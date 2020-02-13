import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { MSGraphClient } from '@microsoft/sp-http';
import {
  SPHttpClient,
  SPHttpClientResponse
} from '@microsoft/sp-http';

import * as strings from 'SelectRegionWebPartStrings';
import SelectRegion from './components/SelectRegion';
import { ISelectRegionProps } from './components/ISelectRegionProps';
import cookie from 'react-cookies';

export interface ISelectRegionWebPartProps {
  title: string;
  huLink: string;
  dachLink: string;
  userCountry: string;
  cookieValue: string;
  countryList: any;
}

export default class SelectRegionWebPart extends BaseClientSideWebPart<ISelectRegionWebPartProps> {

  public country:string;
  public countryList:any;
  
  public render(): void {
    const element: React.ReactElement<ISelectRegionProps > = React.createElement(
      SelectRegion,
      {
        title: this.properties.title,
        userCountry: this.country,
        cookieValue: cookie.load('SelectedCountry'),
        countryList: this.countryList
      }
    );
    this.context.msGraphClientFactory.getClient()
    .then((client: MSGraphClient) => {
      client.api('me')
      .version('beta')
      .get((error: any, response: any) => {
        if(response){
          var lng = response.country;
          if(lng && location.search.indexOf('?flags') == -1){
            lng.toUpperCase().indexOf('HU') > -1 ? location.href = this.properties.huLink : location.href = this.properties.dachLink;
            element.props.userCountry = lng;
          }
          if(lng && location.search.indexOf('?flags') > -1){
            this._getListData().then((resp) => {
              element.props.countryList = resp.value;
              ReactDom.render(element, this.domElement);
            });
          }
          if(element.props.cookieValue && !lng && location.search.indexOf('?flags') == -1){
            location.href = element.props.cookieValue;
          }
          if(element.props.cookieValue && !lng && location.search.indexOf('?flags') > -1){
            this._getListData().then((resp) => {
              element.props.countryList = resp.value;
              ReactDom.render(element, this.domElement);
            });
          }
          if(!element.props.cookieValue && !lng){
            this._getListData().then((resp) => {
              element.props.countryList = resp.value;
              ReactDom.render(element, this.domElement);
            });
          }
        }
      });
    });
  }

  private _getListData(): Promise<any> {
    return this.context.spHttpClient.get(this.context.pageContext.web.absoluteUrl + `/_api/web/Lists/GetByTitle('CountryList')/Items?`, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      });
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          groups: [
            {
              groupFields: [
                PropertyPaneTextField('title', {
                  label: strings.TitleFieldLabel
                }),
                PropertyPaneTextField('huLink', {
                  label: 'HU Url'
                }),
                PropertyPaneTextField('dachLink', {
                  label: 'DACH Url'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
