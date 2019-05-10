import React from 'react';
import {Route} from "react-router-dom";
import {ItemManage} from "../../component/item/item.manage";
import { ShopInfo } from "../../component/shop/info/info";


export class HomeRoute extends React.Component {
  render() {
    return (
      // 路由组件在此声明
      <div className="routeLayout">
        <Route exact path="/" component={ShopInfo}/>{/* 默认跳转店铺管理 */}
        <Route path="/shopInfo" component={ShopInfo}/>
        <Route path="/itemManage" component={ItemManage}/>
      </div>
    )
  }
}
