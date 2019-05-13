import React from 'react';
import classnames from 'classnames'; // className 操作库
import {Card, Row, Col, Form, Button, Input, Switch, message, Tag, Upload, Icon, Modal} from 'antd';
import './info.css';
import {TimeUtil} from '../../../util/time.util';
import {ShopAdminService} from "../../../service/shop/shop.admin.service";
import ImgCrop from "antd-img-crop";
import {StringUtil} from "../../../util/string.util";

export class ShopInfo extends React.Component {
  shopService = new ShopAdminService();

  constructor(props) {
    super(props);
    this.state = {
      tagData: [],
      shopEnable: true,
      tagList: [],
      viewStatus: true,
      // 上传组件相关
      previewVisible: false,
      previewImage: '',
      imageGallery: [],
      fileList: [],
      imageUrl: null
    };

    // 绑定 this
    this.toggleShopStatus = this.toggleShopStatus.bind(this);
    this.submitEditInfo = this.submitEditInfo.bind(this);
    this.switchToEdit = this.switchToEdit.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
  }

  // 组件挂载钩子
  componentDidMount() {
    // 初始化数据
    this.initData();
  }

  /**
   * 初始化装载数据
   */
  initData() {
    this.shopService.shopDetail({
      success: (res) => {
        console.log(res);
        // 处理店铺状态
        let shopStatus;
        let shopEnable;
        switch (res.status) {
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
        }
        // 装载店铺标签数据
        this.setState({
          tagData: res.tagThinResponse,
          shopEnable: shopEnable,
          imageUrl: res.imageUrl,
        });
        let shopTagList = [];
        if (this.state.tagData.length > 0) {
          shopTagList = this.state.tagData.map((element) => {
            return <Tag>{element.name}</Tag>;
          });
        }
        this.setState({
          tagList: shopTagList
        });
        // 绑定数据
        this.props.form.setFieldsValue({
          shopId: res.shopId ? res.shopId : null,
          shopName: res.name ? res.name : null,
          userId: res.userId ? res.userId : null,
          userName: res.userName ? res.userName : null,
          mobileNumber: res.mobile ? res.mobile : null,
          email: res.email ? res.email : null,
          createdAt: res.createdAt ? TimeUtil.formatTime(res.createdAt, true) : null,
          status: shopStatus,
          address: res.address,
        });
        // 装载图片数据
        let imageGalleryList = [];
        imageGalleryList.push(res.imageUrl);
        this.setState({
          imageGallery: imageGalleryList
        });
      }
    });
  }

  /**
   * 店铺控制开关切换
   */
  toggleShopStatus() {
    this.setState({
      shopEnable: !this.state.shopEnable
    });
    this.shopService.shopUpdate({
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
  submitEditInfo() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // 验证通过
        let createParam = { // 传输 DTO
          shopId: values.shopId,
          name: values.shopName ? values.shopName : null,
          userName: values.userName ? values.userName : null,
          mobile: values.mobileNumber ? values.mobileNumber : null,
          email: values.email ? values.email : null,
          address: values.address ? values.address : null,
          imageUrl: StringUtil.notEmpty(this.state.imageUrl) ? this.state.imageUrl : null
        };
        console.log('表单的数据: ', values, 'DTO:', createParam);
        this.shopService.shopUpdate(
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
        // 退出编辑状态
        this.setState({
          viewStatus: true,
        });
      }
    });
  }

  /**
   * 切换编辑状态按钮事件
   */
  switchToEdit() {
    // 装载图片上传组件信息
    let fileList = [];
    let imageUrl = this.state.imageUrl;
    if (StringUtil.notEmpty(imageUrl)) {
      fileList = [{
        uid: '-1',
        // todo get real name
        name: 'xxx.png',
        status: 'done',
        url: imageUrl,
      }];
    }

    this.setState({
      viewStatus: false,
      fileList: fileList
    });

  }

  /**
   * 取消编辑状态
   */
  cancelEdit() {
    this.setState({
      viewStatus: true
    });
    this.initData();
  }

  /*--------------------------------------------------- 图片上传 begin --------------------------------------------------------------------*/
  // 创建上传组件
  getImageUpload = () => {
    const {previewVisible, previewImage, fileList} = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus"/>
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix" style={{display: this.state.viewStatus ? "none" : "block"}}>
        <ImgCrop width={400} height={300}>
          <Upload
            action="/api/common/upload/image"
            listType="picture-card"
            fileList={fileList}
            onPreview={this.handlePreview}
            onChange={this.handleChange}
          >
            {fileList.length >= 1 ? null : uploadButton}
          </Upload>
        </ImgCrop>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{width: '100%'}} src={previewImage}/>
        </Modal>
      </div>
    );
  };

  // 处理预览取消
  handleCancel = () => this.setState({previewVisible: false});

  // 处理预览
  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  // 文件改变
  handleChange = (info) => {
    let imageUrl = null;
    const status = info.file.status;
    if (status !== 'uploading') {
      console.log("file:%o , fileList:%o", info.file, info.fileList);
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

  /*--------------------------------------------------- 图片上传 end --------------------------------------------------------------------*/

  render() {

    // 获取表单属性组件-解构
    const {getFieldDecorator} = this.props.form;

    // 样式控制变量
    let inputItemClass = classnames({
      'form-content__input': this.state.viewStatus,
    });
    let inputAddressClass = classnames({
      'form-content__input-address': true,
      'form-content__input-address_blur': this.state.viewStatus,
    });

    return (
      <div>
        <Card
          title="店铺信息" className="card-layout"
          extra={
            <OperationAction
              toggleShopStatus={this.toggleShopStatus} shopEnable={this.state.shopEnable}
              submitEditInfo={this.submitEditInfo} switchToEdit={this.switchToEdit}
              isEditMode={!this.state.viewStatus} cancelEdit={this.cancelEdit}
            />
          }
        >
          <div className='info-layout'>
            <Row gutter={{xs: 8, sm: 16, md: 24, lg: 32}}>
              <Col span={24}>
                <div className="info-image-container">
                  <span className="info-title info-content__font">
                    店铺图片:
                  </span>
                  <ImageCardWall
                    imageGallery={this.state.imageGallery} isEditMode={!this.state.viewStatus}
                  />
                  {this.getImageUpload()}
                </div>
              </Col>
              <Col span={12}>
                <Form.Item className="form-content" label="店铺 ID">
                  {getFieldDecorator('shopId')(
                    <Input readOnly className="form-content__input" placeholder="店铺 ID"/>
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item className="form-content" label="店名">
                  {getFieldDecorator('shopName', {
                    rules: [{required: true, message: '请输入店铺名'}],
                  })(
                    <Input readOnly={this.state.viewStatus} className={inputItemClass} placeholder="店名"/>
                  )}
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item className="form-content" label="卖家 ID">
                  {getFieldDecorator('userId')(
                    <Input readOnly className="form-content__input" placeholder="卖家 ID"/>
                  )}
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item className="form-content" label="卖家名">
                  {getFieldDecorator('userName')(
                    <Input readOnly className="form-content__input" placeholder="卖家名"/>
                  )}
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item className="form-content" label="联系电话">
                  {getFieldDecorator('mobileNumber', {
                    rules: [
                      {
                        pattern: '^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\\d{8}$',
                        message: '请输入正确的手机号'
                      }
                    ],
                  })(
                    <Input readOnly={this.state.viewStatus} className={inputItemClass} placeholder="联系电话"
                           type="number"/>
                  )}
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item className="form-content" label="邮箱">
                  {getFieldDecorator('email', {
                    rules: [
                      {
                        pattern: '^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)+$',
                        message: '请输入正确的邮箱地址'
                      }
                    ],
                  })(
                    <Input readOnly={this.state.viewStatus} className={inputItemClass} placeholder="邮箱"/>
                  )}
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item className="form-content" label="创建时间">
                  {getFieldDecorator('createdAt')(
                    <Input readOnly className="form-content__input" placeholder="创建时间"/>
                  )}
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item className="form-content" label="店铺状态">
                  {getFieldDecorator('status')(
                    <Input readOnly className="form-content__input" placeholder="店铺状态"/>
                  )}
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item className="form-content" label="店铺地址">
                  {getFieldDecorator('address')(
                    <Input readOnly={this.state.viewStatus} className={inputAddressClass} placeholder="地址"/>
                  )}
                </Form.Item>
              </Col>

              <Col span={12}>
                <div className="info-content">
                    <span className="info-content__font info-title">
                      店铺标签：
                    </span>
                  <div className="info-content__tag">
                    {this.state.tagList}
                  </div>
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
        <Switch onChange={props.toggleShopStatus} checked={props.shopEnable}/>
      </div>
      <Button className="action-btn" style={{display: props.isEditMode ? 'inline-block' : 'none'}} type="default"
              onClick={props.cancelEdit}>取消</Button>
      <Button className="action-btn" style={{display: props.isEditMode ? 'inline-block' : 'none'}} type="primary"
              onClick={props.submitEditInfo}>保存</Button>
      <Button className="action-btn" style={{display: props.isEditMode ? 'none' : 'inline-block'}} type="default"
              onClick={props.switchToEdit}>编辑</Button>
    </div>
  );
}

/**
 * 图片卡片墙组件
 * @param {any} props - 组件参数
 * @author BillowsTao
 */
function ImageCardWall(props) {
  let imageGallery = [];
  props.imageGallery.forEach((element) => {
    imageGallery.push(
      <Card.Grid className="image-wall__item">
        <img
          className="image-wall__img" alt="shopImg"
          src={element}
        />
      </Card.Grid>
    );
  });

  if (props.isEditMode) {
    // 编辑模式
    return (
      null
    );

  } else {
    // 预览模式
    return (
      <Card>
        {imageGallery}
        {/* <Card.Grid className="image-wall__item">
          <img
            className="image-wall__img" alt="shopImg"
            src="https://img.meituan.net/msmerchant/c73f76b2db57e7ed065e0ab291fab11c1645016.jpg"
          />
        </Card.Grid>
        <Card.Grid className="image-wall__item">
          <img
            className="image-wall__img" alt="shopImg"
            src="https://img.meituan.net/msmerchant/44e70263cf113adf690ae8e8353a5ded664206.jpg"
          />
        </Card.Grid>
        <Card.Grid className="image-wall__item">
          <img
            className="image-wall__img" alt="shopImg"
            src="https://img.meituan.net/msmerchant/a0619d55f3b7857b4ceb92683643c49f1794215.jpg"
          />
        </Card.Grid>
        <Card.Grid className="image-wall__item">
          <img
            className="image-wall__img" alt="shopImg"
            src="https://img.meituan.net/msmerchant/a919189667ba2d5942ce6e668180e10f702520.jpg"
          />
        </Card.Grid> */}
      </Card>
    );
  }


}

/**
 * 创建包装的类
 * @author BillowsTao
 */
ShopInfo = Form.create({name: 'shop_maintenance'})(ShopInfo);
