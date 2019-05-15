import React, {Component} from 'react'
import {Card, Row, Col, Form, Select, Tabs, Avatar, Input, Menu, Button, Icon, Upload, Modal, message} from 'antd';
import {CategoryAdminService} from "../../../../service/category/category.admin.service";
import {ArrayUtil} from "../../../../util/array.util";
import {StringUtil} from "../../../../util/string.util";
import {ItemAdminService} from "../../../../service/item/item.admin.service";

const {Meta} = Card;
const {Option} = Select;
const TabPane = Tabs.TabPane;

export class CategoryManage extends Component {
  categoryAdminService = new CategoryAdminService();
  itemAdminService = new ItemAdminService();

  componentDidMount() {
    this.setData()
  }

  state = {
    categoryList: [],
    activeCategoryId: null,
    categoryData: null,
    itemList: [],
    categoryNameEdit: null,
    categoryRemarkEdit: null,
    // 上传相关
    previewVisible: false,
    previewImage: '',
    imageUrl: null,
    fileList: [],
  };

  render() {
    return (
      <Card title={"类目管理"}>
        <Row>
          <Col span={6}>
            <Menu theme="light"
                  mode="inline"
                  defaultSelectedKeys={[this.state.activeCategoryId]}
            >
              {this.getCategoryListView()}
              <div key={"addCategory"} onClick={() => this.props.history.push('/shopCategoryCreate')}>
                <Button type="primary" shape="circle" icon="plus" style={{display: 'flex',flexDirection: 'row',margin: "0 auto", justifyContent: 'center', alignItems: 'center'  }} />
              </div>
            </Menu>
          </Col>
          <Col span={1}>
          </Col>
          <Col span={17}>
            {this.getCategoryInfoView()}
          </Col>
        </Row>
      </Card>
    )
  }

  setData = () => {
    this.categoryAdminService.adminList({
      params: null,
      success: (data) => {
        this.setState({
          categoryList: data.categoryList
        })
      }
    });
  };

  switchActiveCategory(categoryId) {
    this.categoryAdminService.adminList({
      params: {
        categoryId: categoryId,
        withItemInfo: true
      },
      success: (data) => {
        if (ArrayUtil.notEmpty(data.categoryList)) {
          let categoryData = data.categoryList[0];
          this.setState({
            activeCategoryId: categoryId,
            categoryData: categoryData,
            categoryNameEdit: categoryData.name,
            categoryRemarkEdit: categoryData.remark,
            imageUrl: categoryData.logo,
            fileList: StringUtil.isEmpty(categoryData.logo) ? [] : [{
              uid: '-1',
              name: 'xxx.png',
              status: 'done',
              url: categoryData.logo,
            }],
          })
        }
      }
    })
  }

  getCategoryListView = () => {
    let categoryList = this.state.categoryList;
    const view = [];
    console.log(categoryList);
    categoryList.forEach(category => {
      view.push(
        <Menu.Item key={category.shopCategoryId} onClick={() => {
          this.switchActiveCategory(category.shopCategoryId)
        }}>
          {category.name}
        </Menu.Item>
      )
    });
    return view;
  };

  handleCategorySelect = (item, e) => {
    let categoryId = StringUtil.notEmpty(e) ? e : null;
    this.itemAdminService.update({
      params: {
        categoryId: categoryId,
        itemId: item.itemId,

      },
      success: (data) => {
        this.switchActiveCategory(item.categoryId);
      }
    })
  };

  getCategoryOption = () => {
    const categoryOption = [];
    let categoryList = this.state.categoryList;
    for (let i = 0; i < categoryList.length; i++) {
      categoryOption.push(<Option key={categoryList[i].shopCategoryId}
                                  value={categoryList[i].shopCategoryId}>{categoryList[i].name}</Option>)
    }
    return categoryOption;
  };

  getAllItem = () => {
    const view = [];
    let categoryData = this.state.categoryData;
    if (categoryData == null){ return (<span>请选择类目</span>)}
    if (categoryData.itemThinResponseList != null) {
      let itemList = categoryData.itemThinResponseList;
      for (let i = 0; i < itemList.length; i++) {
        let item = itemList[i];
        view.push(
          <Col span={12}>
            <Card style={{width: "98%", margin: "2%", backgroundColor: "#f2f5f7"}}>
              <Meta
                avatar={<Avatar style={{width: "100px", height: "100px"}} shape="square" src={item.mainImage}/>}
                title={item.name}
                description={(
                  <div>
                    <div>{"￥" + item.price}</div>
                    <br/>
                    <Select style={{width: '100%'}} value={item.categoryId}
                            onChange={(e) => this.handleCategorySelect(item, e)}>
                      {this.getCategoryOption()}
                    </Select>
                  </div>
                )}
              />
            </Card>
          </Col>
        )
      }
    }
    return (
      <Row>
        {view}
      </Row>
    );
  };

  getCategoryInfoView = () => {
    return (
      <Tabs defaultActiveKey="1">
        <TabPane tab="所属商品" key="1">
          {this.getAllItem()}
        </TabPane>
        <TabPane tab="编辑类目" key="2">
          {this.getCategoryEditView()}
        </TabPane>
      </Tabs>
    );
  };

  inputChangeHandler = (e) => {
    let o = {};
    o[e.target.name] = e.target.value;
    this.setState(o);
  };

  getCategoryEditView = () => {
    let categoryData = this.state.categoryData;
    if (categoryData == null){ return (<span>请选择类目</span>)}
    return (
      <div>
        <Row>
          <Col span={24} style={{textAlign: 'right'}}>
            <Button type="primary" onClick={() => {
              this.updateCategory()
            }}>保存</Button>
            <Button style={{marginLeft: 8}} onClick={() => {
            }}>
              重置
            </Button>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            {this.getImageUpload()}
          </Col>
          <Col span={11}>
            <Form.Item label={`类目名`}>
              <Input onChange={this.inputChangeHandler} name="categoryNameEdit" value={this.state.categoryNameEdit}
                     placeholder="输入类名目"/>
            </Form.Item>
          </Col>
          <Col span={2}>
          </Col>
          <Col span={11}>
            <Form.Item label={`备注`}>
              <Input onChange={this.inputChangeHandler} name="categoryRemarkEdit" value={this.state.categoryRemarkEdit}
                     placeholder="输入备注"/>
            </Form.Item>
          </Col>
        </Row>
      </div>
    )
  };

  // 上传相关
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

  handleCancel = () => this.setState({
    previewVisible: false
  });

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  getImageUpload = () => {
    const {previewVisible, previewImage, fileList} = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus"/>
        <div className="ant-upload-text">上传图片</div>
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

  updateCategory = () => {
    let name = this.state.categoryNameEdit;
    let remark = this.state.categoryRemarkEdit;
    let logo = this.state.imageUrl;
    let editParam = {
      shopCategoryId: this.state.activeCategoryId,
      name: StringUtil.notEmpty(name) ? name : null,
      remark: StringUtil.notEmpty(remark) ? remark : null,
      logo: StringUtil.notEmpty(logo) ? logo : null,
    };
    this.categoryAdminService.update({
      params: editParam,
      success: (data) => {
        message.success("修改成功");
        this.setData();
        this.switchActiveCategory(this.state.activeCategoryId);
      }
    })
  }
}
