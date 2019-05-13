import React from 'react';
import classnames from 'classnames'; // className 操作库
import { Card, Row, Col, Form, Select, Button, Input, Switch, message, Tag, Upload } from 'antd';
import './create.css';

export class GoodsCreate extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="content-layout">
        <Card
          title="基本信息" className="card-layout"
        >
          <div className="create-layout">
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col span={12}>
                <Form.Item className="form-content" label="商品编码">
                  <Input />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item className="form-content" label="商品名">
                  <Input />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item className="form-content" label="价格">
                  <Input />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item className="form-content" label="类目">
                  <Select style={{ width: '100%' }}>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item className="form-content" label="广告">
                  <Input />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item className="form-content" label="备注">
                  <Input />
                </Form.Item>
              </Col>

              {/* 图片上传组件 */}
              <Col span={24}>

              </Col>

            </Row>
          </div>
        </Card>

        <Card
          className="card-layout" title="属性信息"
        >

        </Card>
      </div>
    );
  };
}

/**
 * 创建包装的类
 * @author BillowsTao
 */
GoodsCreate = Form.create({ name: 'goods_add' })(GoodsCreate);
