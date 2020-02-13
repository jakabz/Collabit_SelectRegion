import * as React from 'react';
import styles from './SelectRegion.module.scss';
import { ISelectRegionProps } from './ISelectRegionProps';
import ImageButton from '@fdmg/ts-react-image-button';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import cookie from 'react-cookies';

export default class SelectRegion extends React.Component<ISelectRegionProps, {}> {
  
  private items:any;
  private save:any;
  private self = this;
  
  public clickHandler(item,e) {
    console.info(item);
    if(this.save){
      cookie.save('SelectedCountry', item[this.props.linkField].Url, { path: '/' });
      location.href = item[this.props.linkField].Url;
    } else {
      location.href = item[this.props.linkField].Url;
    }
  }

  public onChangeChoice(self,e) {
    self.save = e.currentTarget.checked;
  }

  public render(): React.ReactElement<ISelectRegionProps> {
    //console.info(this.props);
    
    if(this.props.countryList){
      this.items = this.props.countryList.map((item, key) => {
        return <ImageButton src={item.Flag.Url} onClick={this.clickHandler.bind(this,item)} className={styles.flagBtn} alt={item.Title}/>;
      });
    }

    return (
      <div className={ styles.selectRegion }>
        {this.props.title ?
          <div className={styles.wptitle}>
            <Icon iconName='Globe' className={styles.wptitleIcon} />
            <span>{this.props.title}</span>
          </div>
        : ''}
        <div className={styles.flagsList}>
          {this.items}
          <div className={styles.saveRow}>
            <Checkbox label="Remember your choice" onChange={this.onChangeChoice.bind(this.self,this)} />
          </div>
        </div>
      </div>
    );
  }
}
