import React from "react";
import {Card, Row, Col, Form, Select, Button, Input, Switch, message, Tag, Upload, Icon, Modal} from 'antd';
import {ItemAdminService} from "../../service/item/item.admin.service";
import {StringUtil} from "../../util/string.util";
import {ArrayUtil} from "../../util/array.util";
import {CategoryAdminService} from "../../service/category/category.admin.service";
import {Link} from "react-router-dom";

const {Option} = Select;

export class ItemEdit extends React.Component {
  itemAdminService = new ItemAdminService();
  categoryAdminService = new CategoryAdminService();

  componentDidMount() {
    this.setData();
  };

  state = {
    itemId: null,
    itemData: null,
    attributeList: [],
    categoryOption: [],
    categoryIdCreate: null,
    fileList: [],
  };

  setData = () => {
    let itemId = this.props.match.params.itemId;
    this.itemAdminService.getItemInfo({
      params: {
        itemId: itemId
      },
      success: (data) => {
        const attributeList = this.getAttributeListByObject(data.attribute);
        this.setState({
          itemId: itemId,
          itemData: data,
          attributeList: attributeList,
          imageUrl: StringUtil.notEmpty(data.mainImage) ? data.mainImage : null,
          categoryIdCreate: StringUtil.notEmpty(data.categoryId) ? data.categoryId : null,
          nameCreate: StringUtil.notEmpty(data.name) ? data.name : null,
          priceCreate: StringUtil.notEmpty(data.price) ? data.price : null,
          advertiseCreate: StringUtil.notEmpty(data.advertise) ? data.advertise : null,
          fileList: StringUtil.isEmpty(data.mainImage) ? [] : [{
            uid: '-1',
            name: 'xxx.png',
            status: 'done',
            url: data.mainImage,
          }],
        })
      }
    });
    this.categoryAdminService.adminList({
      params: {},
      success: (data) => {
        this.setState({
          categoryOption: data.categoryList,
        })
      }
    });
  };

  // 图片上传相关
  getImageUpload = () => {
    const {previewVisible, previewImage, fileList} = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus"/>
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          action="/api/common/upload/image"
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 1 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{width: '100%'}} src={previewImage}/>
        </Modal>
        {this.state.fileUrl}
      </div>
    );
  };

  handleCancel = () => this.setState({
    previewVisible: false
  });

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  handleChange = (info) => {
    let imageUrl = null;
    const status = info.file.status;
    if (status !== 'uploading') {
      imageUrl = null;
    }
    if (status === 'done') {
      imageUrl = info.file.response.result;
    } else if (status === 'error') {
      imageUrl = null;
    }
    this.setState({
      fileList: info.fileList,
      imageUrl: imageUrl
    });
  };

  handleCategorySelect = (e) => {
    this.setState({
      categoryIdCreate: e === "" ? null : e
    });
  };

  getCategoryOption = () => {
    const categoryOption = [];
    let categoryList = this.state.categoryOption;
    for (let i = 0; i < categoryList.length; i++) {
      categoryOption.push(<Option key={categoryList[i].shopCategoryId}
                                  value={categoryList[i].shopCategoryId}>{categoryList[i].name}</Option>)
    }
    return categoryOption;
  };

  inputChangeHandler = (e) => {
    let o = {};
    o[e.target.name] = e.target.value;
    this.setState(o);
  };

  submitCreateItem = () => {
    let createParam = {
      itemId: this.state.itemId,
      // attribute: this.getAttributeObject(),
      categoryId: this.state.categoryIdCreate,
      mainImage: StringUtil.notEmpty(this.state.imageUrl) ? this.state.imageUrl : null,
      name: StringUtil.notEmpty(this.state.nameCreate) ? this.state.nameCreate : null,
      price: StringUtil.notEmpty(this.state.priceCreate) ? this.state.priceCreate : null,
      advertise: StringUtil.notEmpty(this.state.advertiseCreate) ? this.state.advertiseCreate : null,
    };
    this.itemAdminService.update({
      params: createParam,
      success: (data) => {
        message.success('修改成功！');
      }
    });
  };

  getAttributeObject = () => {
    let attributeList = this.state.attributeList;
    let attr = {};
    attributeList.forEach(e => {
      let attributeName = this.state[e.name];
      alert(e.name);
      let value = [];
      if (StringUtil.isEmpty(attributeName)) {
        return;
      }
      if (ArrayUtil.notEmpty(e.value)) {
        e.value.forEach(element => {
          let attributeValue = this.state[element.name];
          if (StringUtil.notEmpty(attributeValue)) {
            value.push(attributeValue);
          }
        });
      }
      if (ArrayUtil.notEmpty(value)) {
        attr[attributeName] = value;
      }
    });
    return attr;
  };

  getAttributeValueInput = (attributeList, i) => {
    const view = [];
    let value = attributeList[i].value;
    for (let j = 0; j < value.length; j++) {
      let name = value[j].name;
      view.push(
        <div className="property-subitem">
          <div className="property-subitem__content">
            <Input className="property-subitem__input" placeholder="属性值" onChange={this.inputChangeHandler}
                   value={this.state[name]} name={name}/>
          </div>
          <div className="property-subitem__action">
            <div onClick={() => {
              this.deleteAttributeValue(attributeList, i, j)
            }} className="property-subitem__action-item property-item__action-delete">
              <Icon type="close-circle"/>
            </div>
          </div>
        </div>
      );
    }
    return view;
  };

  deleteAttributeValue = (attributeList, i, j) => {
    ArrayUtil.remove(attributeList[i].value, j);
    this.setState({
      attributeList: attributeList
    });
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

  deleteAttributeGroup = (attributeList, i) => {
    this.setState({
      attributeList: ArrayUtil.remove(attributeList, i)
    })
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
            {this.getAttributeValueInput(attributeList, i)}
          </div>

          {/* 控制按钮区域 */}
          <div className="property-item__action">
            <div className="property-item__action-item" onClick={() => this.addAttributeValue(attributeList, i)}>
              <Icon type="plus"/>
            </div>
            <div className="property-item__action-item"
                 onClick={() => {
                   this.deleteAttributeGroup(attributeList, i)
                 }}>
              <Icon type="close"/>
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
        <Row>
          <Col span={24} style={{textAlign: 'right'}}>
            <Button type={"primary"} onClick={() => this.submitCreateItem()}>保存</Button>
            <Button style={{marginLeft: 8}}>
              <Link to={"/itemManage"}>取消</Link>
            </Button>
          </Col>
        </Row>
        <Card
          title="基本信息" className="card-layout"
        >
          <div className="create-layout">
            <Row gutter={{xs: 8, sm: 16, md: 24, lg: 32}}>
              <Col span={24}>
                <Form.Item className="form-content" label="商品图片">
                  {this.getImageUpload()}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item className="form-content" label="类目">
                  <Select value={this.state.categoryIdCreate} style={{width: '100%'}}
                          onChange={this.handleCategorySelect}>
                    {this.getCategoryOption()}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item className="form-content" label="商品名">
                  <Input value={this.state.nameCreate} name={"nameCreate"} onChange={this.inputChangeHandler}/>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item className="form-content" label="价格">
                  <Input value={this.state.priceCreate} name={"priceCreate"} onChange={this.inputChangeHandler}/>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item className="form-content" label="广告">
                  <Input value={this.state.advertiseCreate} name={"advertiseCreate"}
                         onChange={this.inputChangeHandler}/>
                </Form.Item>
              </Col>
            </Row>
          </div>
        </Card>

        {/*<Card*/}
        {/*  className="card-layout" title="属性信息"*/}
        {/*>*/}
        {/*  <Row type="flex" justify="center" gutter={{xs: 8, sm: 16, md: 24, lg: 32}}>*/}
        {/*    <Col span={24}>*/}
        {/*      <div className="property-container">*/}
        {/*        <div className="property-header">*/}
        {/*          <div className="property-header__text-container">*/}
        {/*            <span className="property-header__text property-header__text-1">属性名</span>*/}
        {/*            <span className="property-header__text property-header__text-2">内容</span>*/}
        {/*          </div>*/}
        {/*          <div className="property-header__action">*/}
        {/*            <Button className="property-header__btn" icon="plus" onClick={() => this.addAttribute()}>新建</Button>*/}
        {/*          </div>*/}
        {/*        </div>*/}
        {/*        <div className="property-content">*/}
        {/*          {this.getAttributeInput()}*/}
        {/*        </div>*/}
        {/*      </div>*/}
        {/*    </Col>*/}
        {/*  </Row>*/}
        {/*</Card>*/}
      </div>
    );
  }

  attributeIndex = 1;

  getName = () => {
    return "attribute_input_value_" + this.attributeIndex++;
  };

  getAttributeListByObject = (attributeObject) => {
    const attributeList = [];
    if (attributeObject == null) {
    } else {
      for (let key in attributeObject) {
        let attributeListElement = {};
        let keyName = this.getName();
        attributeListElement["name"] = keyName;
        attributeListElement["value"] = [];
        console.log("keyName:%o , key:%o",keyName,key);
        this.setState({
          keyName: key
        });
        attributeList.push(attributeListElement);
      }
    }
    return attributeList;
  }
}
