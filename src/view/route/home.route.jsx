import React from 'react';
import {Route} from "react-router-dom";
import {ItemManage} from "../../component/item/item.manage";


export class HomeRoute extends React.Component {
  render() {
    return (
      // 路由组件在此声明
      <div className="routeLayout">
        <Route path="/itemManage" component={ItemManage}/>
      </div>
    )
  }
}
