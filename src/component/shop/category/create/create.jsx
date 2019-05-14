import React from 'react';
import classnames from 'classnames'; // className 操作库
import { Card, Row, Col, Form, Button, Input, Slider, message, InputNumber, Upload, Icon, Modal } from 'antd';
import './create.css';

export class ShopCategoryCreate extends React.Component {
  // 构造函数
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Card
        title="类目信息"
      >
        <div className="create-layout">
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col span={12}>
              <Form.Item className="form-content" label="类目名">
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item className="form-content" label="排序索引">
                <Slider
                  min={1}
                  max={255}
                  onChange={this.onChange}
                  value={0}
                />
                <InputNumber
                  min={1}
                  max={20}
                  style={{ marginLeft: 16 }}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item className="form-content" label="备注">
                <Input />
              </Form.Item>
            </Col>

          </Row>
        </div>
      </Card>
    );
  }
}
