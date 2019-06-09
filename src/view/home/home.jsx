import React from 'react';
import { Layout, Icon, Avatar, Button, Popover } from 'antd';
import { MenuLayout } from '../../component/menu/menu-layout';
import { BrowserRouter as Router } from "react-router-dom";
import { HomeRoute } from "../route/home.route";
import './home.css';
import { UserAdminService } from "../../service/user/user.admin.service";

// 界面控件
const {
  Header, Content, Sider,
} = Layout;

export class Home extends React.Component {
  state = {
    collapsed: false,
    userInfo: null,
  };

  userAdminService = new UserAdminService();

  componentDidMount() {
    // this.userAdminService.login({
    //   params: {
    //     mobile: "17866668888",
    //     password: "1",
    //     type: 2
    //   },
    //   success: (data) => {}
    // });
    this.userAdminService.getUserInfo({
      params: {},
      success: (data) => {
        this.setState({
          userInfo: data
        })
      }
    });
  }



  /* 展开侧边栏函数 */
  toggleSider = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  getLogoutButton = () => {
    const x = [];
    const content = (
      <div>
        <Button icon="logout" onClick={() => {
          this.userAdminService.logout({
            params: {},
            success: () => {
              window.open("http://login.qtu404.com?redirectTo=" + document.location, "_self");
            }
          });
        }}>退出登录</Button>
      </div>
    );
    let userInfo = this.state.userInfo;
    if (userInfo !== null) {
      x.push(
        <Popover content={content}>
          <span style={{ float: "right", marginRight: "5%" }}>
            <Avatar src={userInfo.avatar} style={{ marginRight: "15px" }} />
            <span style={{ marginRight: "15px" }}>{userInfo.nickname}</span>
          </span>
        </Popover>,
      );
    }
    return x;
  };

  render() {
    return (
      <Router>
        <Layout className="layout">
          <Sider
            className="layout-sider"
            trigger={null}
            collapsible
            collapsed={this.state.collapsed}
          >
            <div className="sider-content">
              <div className="logo">O2O</div>
              <div className="layout-sider__menu">
                {/* 菜单项 */}
                <MenuLayout />
              </div>
            </div>
          </Sider>
          <Layout>
            {/* 重写头部CSS样式 */}
            <Header className="layout-header" style={{ background: "#fff", padding: 0 }}>
              <Icon
                className="trigger"
                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                onClick={this.toggleSider}
              />
              {this.getLogoutButton()}
            </Header>
            <Content className="layout-main">
              {/* 路由切换组件区域 */}
              <HomeRoute />
            </Content>
          </Layout>
        </Layout>
      </Router>
    );
  }
}
