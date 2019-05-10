import React from 'react';
import classnames from 'classnames';
import { Card, Row, Col, Select, Form, Button, Input } from 'antd';
import './info.css';

export class ShopInfo extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Card title="店铺信息" className="card-layout">
          <div className='info-layout'>
            <Row gutter="{ xs: 8, sm: 16, md: 24}">
              <Col span={12}>
                <div className="info-content">
                  <div className="info-title info-content__font">
                    店铺ID：
                  </div>
                  <div className="info-text info-content__font">
                    564123188652611551
                  </div>
                </div>
              </Col>

              <Col span={12}>
                <Form.Item className="form-content" label="店名">
                  <Input placeholder="店名" value="赵小姐的店" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <div className="info-content">
                  <div className="info-title info-content__font">
                    卖家ID：
                  </div>
                  <div className="info-text info-content__font">
                    6511600666
                  </div>
                </div>
              </Col>

              <Col span={12}>
                <div className="info-content">
                  <div className="info-title info-content__font">
                    卖家名：
                  </div>
                  <div className="info-text info-content__font">
                    赵小姐
                  </div>
                </div>
              </Col>

              <Col span={12}>
                <Form.Item className="form-content" label="联系电话">
                  <Input className="form-content__input" placeholder="联系电话" value="17864293685" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item className="form-content" label="邮箱">
                  <Input placeholder="邮箱" value="taobillows@163.com" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <div className="info-content">
                  <div className="info-title info-content__font">
                    创建时间：
                  </div>
                  <div className="info-text info-content__font">
                    2019.10.1 12:56:23
                  </div>
                </div>
              </Col>

              <Col span={12}>
                <div className="info-content">
                  <div className="info-title info-content__font">
                    店铺状态:
                  </div>
                  <div className="info-text info-content__font">
                    停业
                  </div>
                </div>
              </Col>

              <Col span={24}>
                <Form.Item className="form-content" label="店铺地址">
                  <Input placeholder="地址" value="中国山东省青岛市黄岛区薛家岛街道嘉陵江东路777号青岛理工大学七公寓" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item className="form-content" label="店铺标签">
                  <Select
                    mode="multiple"
                    style={{ width: '100%' }}
                    placeholder="请选择店铺标签"
                    defaultValue={['a10', 'c12']}
                  >
                  </Select>
                </Form.Item>
              </Col>


              <Col span={24}>
                <div className="info-image-container">
                  <span className="info-title info-content__font">
                    店铺图片:
                  </span>
                </div>
              </Col>

            </Row>
          </div>
        </Card>
      </div>
    );
  }
}
