import React from 'react';
import ReactDOM from 'react-dom';
// 国际化处理
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { Home } from "./view/home/home";
import './index.css';

class App extends React.Component {
  render() {
    return (
      <div className="layout-container">
        <Home />
      </div>
    );
  }
}

// 渲染函数
ReactDOM.render(
  <LocaleProvider locale={zhCN}>
    {/* 国际化处理 */}
    <App />
  </LocaleProvider>
  ,
  document.getElementById('root')
);

