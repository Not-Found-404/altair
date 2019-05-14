import React from 'react';
import { Card, Row, Col, Form, Button, Input, Slider, message, InputNumber, Upload, Icon, Modal } from 'antd';
import './create.css';
import { CategoryAdminService } from '../../../../service/category/category.admin.service';

export class ShopCategoryCreate extends React.Component {
  categoryService = new CategoryAdminService();

  // 构造函数
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: '',
      uploadImgUrlList: [],
      fileList: [],
    };
    // 绑定 this
    this.submit = this.submit.bind(this);
  }

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  handleCancel = () => this.setState({
    previewVisible: false
  });


  handleChange = (event) => {
    let uploadImgUrlList = [];
    const status = event.file.status;
    console.log(event);
    if (status === 'done') {
      uploadImgUrlList.push(event.file.response.result);
      this.setState({
        uploadImgUrlList: uploadImgUrlList
      });
      message.success('上传成功');
    } else if (status === 'error') {
      console.log("图片上传错误:", event.file.response);
    }
    this.setState({
      fileList: event.fileList
    });
  };

  /**
   * 提交表单函数
   */
  submit(event) {
    event.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // 验证通过
        let createParam = { // 传输 DTO
          logo: this.state.uploadImgUrlList[0] ? this.state.uploadImgUrlList[0] : null, // 图片
          name: values.categoryName, // 类目名
          sortIndex: values.sortIndex, // 排序索引
          remark: values.remark, // 备注
        };
        console.log(createParam);
        this.categoryService.create({
          params: createParam, // 传递数据
          success: (data) => { // 成功回调函数
            message.success('成功添加店铺类目');
          },
          final: () => {
            // 重置表单状态
            this.props.form.resetFields();
          }
        });
      }
    });
  }

  render() {
    // 获取表单属性组件-解构
    const {
      getFieldDecorator
    } = this.props.form;

    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div>上传图片</div>
      </div>
    );

    return (
      <Card
        title="类目信息"
      >
        <div className="create-layout">
          <Form onSubmit={this.submit}>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col span={24}>
                <Form.Item className="form-content__item-uploader" label="图标">
                  <Upload
                    action="/api/common/upload/image"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                  >
                    {fileList.length >= 1 ? null : uploadButton}
                  </Upload>
                </Form.Item>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                  <img alt="Preview" style={{ width: '100%' }} src={previewImage} />
                </Modal>
              </Col>

              <Col span={12}>
                <Form.Item className="form-content" label="类目名">
                  {getFieldDecorator('categoryName', {
                    rules: [
                      { required: true, message: '请输入类目名' }
                    ],
                  })(
                    <Input placeholder="请输入类目名" />
                  )}
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item className="form-content" label="排序索引">
                  <div className="form-content__item">
                    <div className="form-content__item-slider">
                      {getFieldDecorator('sortIndex', {
                        initialValue: 1
                      })(
                        <Slider
                          min={1}
                          max={255}
                        />
                      )}
                    </div>
                    <div className="form-content__item-inpue">
                      {getFieldDecorator('sortIndex', {
                        initialValue: 1,
                        rules: [
                          {
                            type: 'number',
                            message: '请输入数字1-255'
                          }
                        ]
                      })(
                        <InputNumber
                          min={1}
                          max={255}
                          style={{ marginLeft: 16 }}
                        />
                      )}
                    </div>
                  </div>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item className="form-content" label="备注">
                  {getFieldDecorator('remark')(
                    <Input placeholder="备注" />
                  )}
                </Form.Item>
              </Col>

            </Row>

            <Row type="flex" justify="center">
              <Col>
                <Button type="primary" htmlType="submit">创建</Button>
              </Col>
            </Row>
          </Form>
        </div>
      </Card>
    );
  }
}

/**
 * 创建包装的类
 * @author BillowsTao
 */
ShopCategoryCreate = Form.create({ name: 'shop_category_create' })(ShopCategoryCreate);

