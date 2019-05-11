import React from 'react';
import {Route} from "react-router-dom";
import {ItemManage} from "../../component/item/item.manage";
import { ShopInfo } from "../../component/shop/info/info";
import {OrderManage} from "../../component/order/order.manage";
import {CommentPaging} from "../../component/order/comment.paging";

export class HomeRoute extends React.Component {
  render() {
    return (
      // 路由组件在此声明
      <div className="routeLayout">
        <Route exact path="/" component={ShopInfo}/>{/* 默认跳转店铺管理 */}
        <Route path="/shopInfo" component={ShopInfo}/>
        <Route path="/itemManage" component={ItemManage}/>
        <Route path="/orderManage" component={OrderManage}/>
        <Route path="/commentManage" component={CommentPaging}/>
      </div>
    )
  }
}
