import React from 'react';
import classnames from 'classnames'; // className 操作库
import { Card, Row, Col, Select, Form, Button, Input, Switch } from 'antd';
import './info.css';

export class ShopInfo extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    // 获取表单属性组件-解构
    const { getFieldDecorator } = this.props.form;

    return (
      <div>
        <Card
          title="店铺信息" className="card-layout"
          extra={<OperationAction />}
        >
          <div className='info-layout'>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col span={12}>
                <Form.Item className="form-content" label="店铺 ID">
                  {getFieldDecorator('shopId')(
                    <Input readOnly className="form-content__input" placeholder="店铺 ID" />
                  )}
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item className="form-content" label="店名">
                  {getFieldDecorator('shopName')(
                    <Input placeholder="店名" />
                  )}
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item className="form-content" label="卖家 ID">
                  {getFieldDecorator('userId')(
                    <Input readOnly className="form-content__input" placeholder="卖家 ID" />
                  )}
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item className="form-content" label="卖家名">
                  {getFieldDecorator('userName')(
                    <Input readOnly className="form-content__input" placeholder="卖家名" />
                  )}
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item className="form-content" label="联系电话">
                  {getFieldDecorator('mobileNumber')(
                    <Input placeholder="联系电话" />
                  )}
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item className="form-content" label="邮箱">
                  {getFieldDecorator('email')(
                    <Input placeholder="邮箱" />
                  )}
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item className="form-content" label="创建时间">
                  {getFieldDecorator('createdAt')(
                    <Input readOnly className="form-content__input" placeholder="创建时间" />
                  )}
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item className="form-content" label="店铺状态">
                  {getFieldDecorator('status')(
                    <Input readOnly className="form-content__input" placeholder="店铺状态" />
                  )}
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item className="form-content" label="店铺地址">
                  {getFieldDecorator('address')(
                    <Input className="form-content__input-address" placeholder="地址" />
                  )}
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item className="form-content" label="店铺标签">
                  {getFieldDecorator('shopTagList',
                    {
                      valuePropName: 'checked' // 定义子节点的值的属性
                    })(
                      <Select
                        mode="multiple"
                        style={{ width: '100%' }}
                        placeholder="请选择店铺标签"
                      >
                      </Select>
                    )}
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

/**
 * 店铺操作组件
 * @param {any} props - 组件参数
 * @author BillowsTao
 */
function OperationAction(props) {
  return (
    <div className="action-container">
      <div className="action-switch">
        <span className="action-switch__title">店铺状态:</span>
        <Switch />
      </div>
      <Button type="primary">编辑</Button>
    </div>
  );
}

/**
 * 创建包装的类
 * @author BillowsTao
 */
ShopInfo = Form.create({ name: 'shop_maintenance' })(ShopInfo);
