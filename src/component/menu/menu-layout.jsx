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
        <SubMenu key="sub1" title={<span><Icon type="user" /><span>用户</span></span>}>
          <Menu.Item key="1">
            {/* 路由链接 */}
            <Link to="/">用户管理</Link>
          </Menu.Item>
        </SubMenu>
        <SubMenu key="sub2" title={<span><Icon type="shop" /><span>店铺</span></span>}>
          <Menu.Item key="2">
            <Link to="/shopCreate/">创建店铺</Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link to="/tagManage/">店铺标签</Link>
          </Menu.Item>
          <Menu.Item key="4">
            <Link to="/shopManage/">店铺管理</Link>
          </Menu.Item>
        </SubMenu>
        <SubMenu key="sub3" title={<span><Icon type="pay-circle" /><span>交易</span></span>}>
          <Menu.Item key="5">
            <Link to="/orderManage/">订单管理</Link>
          </Menu.Item>
          <Menu.Item key="6">
            <Link to="/commentManage/">评价管理</Link>
          </Menu.Item>
        </SubMenu>
      </Menu>
    )
  }
}
