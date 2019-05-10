import React from 'react';
import classnames from 'classnames'; // className 操作库
import { Card, Row, Col, Form, Button, Input, Switch, message } from 'antd';
import './info.css';
import { ShopCommonService } from '../../../service/shop/shop.common.service';
import { TimeUtil } from '../../../util/time.util';

export class ShopInfo extends React.Component {

  shopService = new ShopCommonService();

  constructor(props) {
    super(props);
    this.state = {
      tagData: [],
      shopEnable: true
    };

    // 绑定 this
    this.toggleShopStatus = this.toggleShopStatus.bind(this);
    this.submitEditInfo = this.submitEditInfo.bind(this);
  }

  // 组件挂载钩子
  componentDidMount(){
    // 初始化数据
    this.initData();
  }

  /**
   * 初始化装载数据
   */
  initData(){
    this.shopService.shopDetail({
      success: (res) => {
        console.log(res);
        // 处理店铺状态
        let shopStatus;
        let shopEnable;
        switch(res.status) {
          case 1:
            shopStatus = '营业';
            shopEnable = true;
            break;
          case -1:
            shopStatus = '歇业';
            shopEnable = false;
            break;
          case -2:
            shopStatus = '冻结';
            shopEnable = false;
            break;
          default:
            shopStatus = '';
            shopEnable = false;
            break;
        };
        // 装载店铺标签数据
        this.setState({
          tagData: res.tagThinResponse,
          shopEnable: shopEnable
        });
        let shopTagText;
        if (this.state.tagData.length > 0) {
          shopTagText = this.state.tagData.map((element) => {
            return element.name;
          });
        }
        // 绑定数据
        this.props.form.setFieldsValue({
          shopId: res.shopId ? res.shopId: null,
          shopName: res.name ? res.name: null,
          userId: res.userId ? res.userId: null,
          userName: res.userName ? res.userName: null,
          mobileNumber: res.mobile ? res.mobile: null,
          email: res.email ? res.email: null,
          createdAt: res.createdAt ? TimeUtil.formatTime(res.createdAt, true) : null,
          status: shopStatus,
          address: res.address,
          shopTagList: shopTagText,
        });
      }
    });
  }

  /**
   * 店铺控制开关切换
   */
  toggleShopStatus(){
    this.setState({
      shopEnable: !this.state.shopEnable
    });
    this.shopService.shopDetailUpdate({
      params: {
        shopId: this.props.form.getFieldValue('shopId'),
        status: !this.state.shopEnable ? 1 : -2, // 参数传递在之前的一轮
      },
      success: () => {
        this.initData();
      }
    });
  }

  /**
   * 提交信息函数
   */
  submitEditInfo(){
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // 验证通过
        let createParam = { // 传输 DTO
          shopId: values.shopId,
          name: values.shopName ? values.shopName: null,
          userName: values.userName ? values.userName: null,
          mobile: values.mobileNumber ? values.mobileNumber: null,
          email: values.email ? values.email: null,
          address: values.address ? values.address: null,
        };
        console.log('表单的数据: ', values, 'DTO:', createParam);
        this.shopService.shopDetailUpdate(
          {
            params: createParam, // 传递数据
            success: (data) => { // 成功回调函数
              message.success('成功修改信息');
            },
            final: () => {
              this.initData();
            }
          }
        );
      }
    });
  }

  render() {

    // 获取表单属性组件-解构
    const { getFieldDecorator } = this.props.form;

    return (
      <div>
        <Card
          title="店铺信息" className="card-layout"
          extra={
            <OperationAction
              toggleShopStatus={this.toggleShopStatus} shopEnable={this.state.shopEnable}
              submitEditInfo={this.submitEditInfo}
            />
          }
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
                  {getFieldDecorator('shopName',{
                    rules: [{ required: true, message: '请输入店铺名' }],
                  })(
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
                  {getFieldDecorator('mobileNumber',{
                    rules: [
                      {
                        pattern: '^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\\d{8}$',
                        message: '请输入正确的手机号'
                      }
                    ],
                  })(
                    <Input placeholder="联系电话" type="number" />
                  )}
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item className="form-content" label="邮箱">
                  {getFieldDecorator('email',{
                    rules: [
                      {
                        pattern: '^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)+$',
                        message: '请输入正确的邮箱地址'
                      }
                    ],
                  })(
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
                  {getFieldDecorator('shopTagList')(
                    <Input readOnly className="form-content__input" placeholder="店铺标签" />
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
  // 输出状态
  return (
    <div className="action-container">
      <div className="action-switch">
        <span className="action-switch__title">店铺状态:</span>
        <Switch onChange={props.toggleShopStatus} checked={ props.shopEnable } />
      </div>
      <Button className="action-btn" type="default">取消</Button>
      <Button className="action-btn" type="primary" onClick={ props.submitEditInfo }>保存</Button>
      <Button className="action-btn" type="default">编辑</Button>
    </div>
  );
}

/**
 * 创建包装的类
 * @author BillowsTao
 */
ShopInfo = Form.create({ name: 'shop_maintenance' })(ShopInfo);
