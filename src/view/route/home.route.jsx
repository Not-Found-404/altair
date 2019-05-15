import React from 'react';
import {Route} from "react-router-dom";
import {ItemManage} from "../../component/item/item.manage";
import { ShopInfo } from "../../component/shop/info/info";
import {OrderManage} from "../../component/order/order.manage";
import {CommentPaging} from "../../component/order/comment.paging";
import {ImageUpload} from "../../component/test/image.upload";
import { GoodsCreate } from "../../component/goods/create/create";
import { ShopCategoryCreate } from "../../component/shop/category/create/create";
import {ItemEdit} from "../../component/item/item.edit";
import {OrderReceive} from "../../component/order/order.receive";
import {CategoryManage} from "../../component/shop/category/manage/category.manage";

export class HomeRoute extends React.Component {
  render() {
    return (
      // 路由组件在此声明
      <div className="routeLayout">
        <Route exact path="/" component={ShopInfo}/>{/* 默认跳转店铺管理 */}
        <Route path="/shopInfo/" component={ShopInfo}/>
        <Route path="/itemManage" component={ItemManage}/>
        <Route path="/orderManage" component={OrderManage}/>
        <Route path="/commentManage" component={CommentPaging}/>
        <Route path="/goodsCreate/" component={GoodsCreate}/>
        <Route path="/shopCategoryCreate/" component={ShopCategoryCreate}/>
        <Route path="/categoryManage" component={CategoryManage}/>
        <Route path="/itemEdit/:itemId" component={ItemEdit}/>
        <Route path="/orderReceive" component={OrderReceive}/>
      </div>
    )
  }
}
