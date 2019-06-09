import React from 'react';
import { Link } from "react-router-dom";
import { Menu, Icon } from 'antd';

const { SubMenu } = Menu;

export class MenuLayout extends React.Component {
  render() {
    return (
      <Menu theme="dark"
        mode="inline"
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
      >
        {/* 菜单项 */}
        <SubMenu key="sub1" title={<span><Icon type="user" /><span>店铺</span></span>}>
          <Menu.Item key="1">
            {/* 路由链接 */}
            <Link to="/shopInfo/">我的店铺</Link>
          </Menu.Item>
        </SubMenu>
        <SubMenu key="sub2" title={<span><Icon type="shop" /><span>商品</span></span>}>
          <Menu.Item key="2">
            <Link to="/goodsCreate/">创建商品</Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link to="/itemManage/">商品管理</Link>
          </Menu.Item>
          <Menu.Item key="4">
            <Link to="/shopCategoryCreate/">创建类目</Link>
          </Menu.Item>
          <Menu.Item key="5">
            <Link to="/categoryManage/">管理类目</Link>
          </Menu.Item>
        </SubMenu>
        <SubMenu key="sub3" title={<span><Icon type="pay-circle" /><span>交易</span></span>}>

          <Menu.Item key="orderReceive">
            <Link to="/orderReceive/">接单</Link>
          </Menu.Item>
          <Menu.Item key="dealOrder">
            <Link to="/dealOrder/">订单处理</Link>
          </Menu.Item>
          <Menu.Item key="6">
            <Link to="/orderManage/">全部订单</Link>
          </Menu.Item>
          <Menu.Item key="paymentManage">
            <Link to="/paymentManage/">支付单</Link>
          </Menu.Item>
          <Menu.Item key="7">
            <Link to="/commentManage/">评价管理</Link>
          </Menu.Item>
        </SubMenu>
      </Menu>
    )
  }
}
