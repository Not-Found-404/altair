import React from 'react';
import classnames from 'classnames'; // className 操作库
import {Card, Row, Col, Form, Select, Button, Input, Switch, message, Tag, Upload, Icon} from 'antd';
import './create.css';

export class GoodsCreate extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {

    key: {
      key1: 123123,
      key2: 123123
    },

    attributeList: [
      // {
      //   name: "",
      //   value: []
      // }
    ]
  };

  attributeIndex = 1;

  getName = () => {
    return "attribute_input_value_" + this.attributeIndex++;
  };

  inputChangeHandler = (e) => {
    let o = {};
    o[e.target.name] = e.target.value;
    this.setState(o);
  };

  getAttributeInput = () => {
    let attributeList = this.state.attributeList;
    const view = [];
    for (let i = 0; i < attributeList.length; i++) {
      let name = attributeList[i].name;
      view.push(
        <div className="property-item">
          {/* 属性名 */}
          <div className="property-item__name">
            <Input placeholder="请输入属性名" onChange={this.inputChangeHandler} value={this.state[name]} name={name}/>
          </div>
          {/* 属性内容 */}
          <div className="property-item__content">
            {this.getAttributeValueInput(attributeList[i].value)}
          </div>

          {/* 控制按钮区域 */}
          <div className="property-item__action">
            <div className="property-item__action-item" onClick={() => this.addAttributeValue(attributeList, i)}>
              <Icon type="plus"/>
            </div>
            <div className="property-item__action-item"
                 onClick={() => {}}>
              <Icon type="close"/>
            </div>
          </div>
        </div>
      );
    }
    return view;
  };

  getAttributeValueInput = (value) => {
    const view = [];
    for (let i = 0; i < value.length; i++) {
      let name = value[i].name;
      view.push(
        <div className="property-subitem">
          <div className="property-subitem__content">
            <Input className="property-subitem__input" placeholder="属性值" onChange={this.inputChangeHandler}
                   value={this.state[name]} name={name}/>
          </div>
          <div className="property-subitem__action">
            <div className="property-subitem__action-item property-item__action-delete">
              <Icon type="close-circle"/>
            </div>
          </div>
        </div>
      );
    }
    return view;
  };

  render() {
    return (
      <div className="content-layout">
        <Card
          title="基本信息" className="card-layout"
        >
          <div className="create-layout">
            <Row gutter={{xs: 8, sm: 16, md: 24, lg: 32}}>
              <Col span={12}>
                <Form.Item className="form-content" label="商品编码">
                  <Input/>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item className="form-content" label="商品名">
                  <Input/>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item className="form-content" label="价格">
                  <Input/>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item className="form-content" label="类目">
                  <Select style={{width: '100%'}}>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item className="form-content" label="广告">
                  <Input/>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item className="form-content" label="备注">
                  <Input/>
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
          <Row type="flex" justify="center" gutter={{xs: 8, sm: 16, md: 24, lg: 32}}>
            <Col span={24}>
              <div className="property-container">
                <div className="property-header">
                  <div className="property-header__text-container">
                    <span className="property-header__text property-header__text-1">属性名</span>
                    <span className="property-header__text property-header__text-2">内容</span>
                  </div>
                  <div className="property-header__action">
                    <Button className="property-header__btn" icon="plus" onClick={() => this.addAttribute()}>新建</Button>
                  </div>
                </div>
                <div className="property-content">
                  {this.getAttributeInput()}
                </div>
              </div>
            </Col>
          </Row>
        </Card>
        <br/>
        <Button type={"primary"} onClick={() => this.submitCreateItem()}>创建商品</Button>
      </div>
    );
  };

  submitCreateItem = () => {
    let attributeList = this.state.attributeList;
    console.log(attributeList);
    return undefined;
  };

  addAttribute = () => {
    let attributeList = this.state.attributeList;
    attributeList.push({
      name: this.getName(),
      value: []
    });
    this.setState({
      attributeList: attributeList
    })
  };

  addAttributeValue = (attributeList, i) => {
    attributeList[i].value.push(
      {
        name: this.getName()
      }
    );
    this.setState({
      attributeList: attributeList
    })
  };
}

/**
 * 创建包装的类
 * @author BillowsTao
 */
GoodsCreate = Form.create({name: 'goods_add'})(GoodsCreate);
