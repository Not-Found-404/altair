import {Upload, Icon, Modal} from 'antd';
import React, {Component} from 'react';
import ImgCrop from 'antd-img-crop';

export class ImageUpload extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
    fileUrl:null,
    fileList: [{
      uid: '-1',
      name: 'xxx.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    }],
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
    this.setState({
      fileList: info.fileList
    });
    const status = info.file.status;
    if (status !== 'uploading') {
      console.log("file:%o , fileList:%o",info.file, info.fileList);
    }
    if (status === 'done') {
     console.log("event: %o",info.file.response);
    } else if (status === 'error') {

    }
  };

  render() {
    const {previewVisible, previewImage, fileList} = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus"/>
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <ImgCrop>
          <Upload
            action="/api/common/upload/image"
            listType="picture-card"
            fileList={fileList}
            onPreview={this.handlePreview}
            onChange={this.handleChange}
          >
            {fileList.length >= 3 ? null : uploadButton}
          </Upload>
        </ImgCrop>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{width: '100%'}} src={previewImage}/>
        </Modal>
        {this.state.fileUrl}
      </div>
    );
  }
}
