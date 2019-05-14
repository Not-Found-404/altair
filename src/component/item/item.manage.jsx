import React, {Component} from 'react';
import {Table, Avatar, Form, Row, Col, Input, Button, Select, Card, Modal} from 'antd';
import {ItemAdminService} from "../../service/item/item.admin.service";
import {ColorUtil} from "../../util/color.util";
import {CategoryAdminService} from "../../service/category/category.admin.service";
import {StringUtil} from "../../util/string.util";
import {Link} from "react-router-dom";

const {Option} = Select;

/**
 * Created by wildhunt_unique
 */
export class ItemManage extends Component {
  itemAdminService = new ItemAdminService();
  categoryAdminService = new CategoryAdminService();

  componentDidMount() {
    this.setData();
    this.categoryAdminService.adminList({
      params: {},
      success: (data) => {
        this.setState({
          categoryOption: data.categoryList
        })
      }
    })
  }

  state = {
    data: [],
    loading: true,
    orderIdParam: null,
    pageSize: 5,
    pageNo: 1,
    itemIdParam: null,
    itemNameParam: null,
    categoryId: null,
    categoryOption: [],
    // 调整库存
    detailModalVisible: false
  };

  setDataCurrentPage = () => {
    let pageNo = this.state.pageNo;
    let pageSize = this.state.pageSize;
    this.setData(pageNo, pageSize);
  };

  setData = (pageNo = 1, pageSize = 5) => {
    let searchParam = {
      pageNo: pageNo,
      pageSize: pageSize,
      itemId: this.state.itemIdParam === "" ? null : this.state.itemIdParam,
      name: this.state.itemNameParam === "" ? null : this.state.itemNameParam,
      categoryId: this.state.categoryId === "" ? null : this.state.categoryId
    };

    this.setState({
      loading: true
    });
    this.itemAdminService.paging({
      params: searchParam,
      success: (data) => {
        this.setState({
          data: data.data,
          loading: false,
          pageTotal: data.total,
          pageNo: pageNo
        })
      }
    });
  };

  columns = [{
    title: '',
    dataIndex: 'mainImage',
    key: 'orderId',
    render: mainImage => {
      return <img src={mainImage} style={{"width": "100px", "height": "100px"}} alt={"商品图"}/>
    }
  }, {
    title: '商品',
    dataIndex: 'name',
    key: 'name',
  }, {
    title: '编号',
    dataIndex: 'itemId',
    key: 'itemId',
  }, {
    title: '库存',
    dataIndex: 'inventory',
    key: 'inventory',
  }, {
    title: '价格',
    dataIndex: 'price',
    key: 'price',
  }, {
    title: '',
    dataIndex: 'status',
    key: 'status',
    render: status => {
      if (status === -2) {
        return (
          <span style={{"color": ColorUtil.INIT}}>未上架</span>
        )
      } else {
        return (
          <span style={{"color": ColorUtil.ACTIVE}}>已上架</span>
        )
      }
    }
  }, {
    title: '',
    dataIndex: 'status',
    key: 'setStatus',
    render: (text, record) => {
      let enable = !(record.status === -2);
      let enableText = enable ? '下架' : '上架';
      return (
        <a onClick={() => this.enableStatus(record.itemId, enable)}>{enableText}</a>
      )
    }
  }, {
    title: '',
    dataIndex: 'status',
    key: 'setInventory',
    render: (text, record) => {
      return (
        <a onClick={() => this.detailModalOpen(record)}>设置库存</a>
      )
    }
  }, {
    title: '',
    dataIndex: 'status',
    key: 'update',
    render: (text, record) => {
      return (
        <Link to={"/itemEdit/" + record.itemId}>编辑</Link>
      )
    }
  }];

  enableStatus = (itemId, enable) => {
    let status = !enable ? 1 : -2;
    this.itemAdminService.update({
      params: {
        itemId: itemId,
        status: status
      },
      success: (data) => {
        this.setData(this.state.pageNo, this.state.pageSize);
      }
    })
  };

  pageChange = (current, pageSize) => {
    console.log("current:%d,pageSize:%d", current, pageSize);
    this.setState({
      pageSize: pageSize,
      pageNo: current
    });
    this.setData(current, pageSize);
  };

  getFields = () => {
    const searchParamsInput = [];
    searchParamsInput.push(
      <Col span={6} key={2}>
        <Form.Item label={`商品类目`}>
          <Select name="type" allowClear placeholder="选择商品类目" onChange={this.handleCategorySearch}>
            {this.getCategoryOption()}
          </Select>
        </Form.Item>
      </Col>
    );
    searchParamsInput.push(
      <Col span={6} key={1}>
        <Form.Item label={`商品编号`}>
          <Input onChange={this.inputChangeHandler} name="itemIdParam" placeholder="输入商品编号"/>
        </Form.Item>
      </Col>
    );
    searchParamsInput.push(
      <Col span={6} key={2}>
        <Form.Item label={`商品名`}>
          <Input onChange={this.inputChangeHandler} name="itemNameParam" placeholder="输入商品名"/>
        </Form.Item>
      </Col>
    );
    return searchParamsInput;
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

  handleCategorySearch = (e) => {
    this.setState({
      categoryId: e === "" ? null : e
    });
  };

  inputChangeHandler = (e) => {
    let o = {};
    o[e.target.name] = e.target.value;
    this.setState(o);
  };

  handleSearch = () => {
    this.setData();
  };

  render() {
    return (
      <Card title="商品管理">
        <Form
          className="ant-advanced-search-form"
          onSubmit={this.handleSearch}
        >
          <Row gutter={24}>{this.getFields()}</Row>
          <Row>
            <Col span={24} style={{textAlign: 'right'}}>
              <Button type="primary" onClick={() => {
                this.setData()
              }}>搜索</Button>
              <Button style={{marginLeft: 8}} onClick={() => this.setData()}>
                重置
              </Button>
            </Col>
          </Row>
          <br/>
          <Table
            columns={this.columns}
            dataSource={this.state.data}
            loading={this.state.loading}
            pagination={{
              total: this.state.pageTotal,
              defaultCurrent: 1,
              pageSize: 5,
              current: this.state.pageNo,
              onChange: (current, pageSize) => {
                this.pageChange(current, pageSize)
              }
            }}
          />
        </Form>
        {this.getAdjustModal()}
      </Card>
    )
  }

  detailModalClose = () => {
    this.setState({
      detailModalVisible: false
    })
  };

  detailModalOpen = (item) => {
    this.setState({
      detailModalVisible: true,
      itemData: item,
      adjustInventoryParam: item.inventory
    });
  };

  adjustInventory = () => {
    let inventory = this.state.adjustInventoryParam;
    let itemData = this.state.itemData;
    if (itemData != null) {
      this.itemAdminService.inventoryAdjust({
        params: {
          inventory: StringUtil.notEmpty(inventory) ? inventory : null,
          itemId: itemData.itemId
        },
        success: () => {
          this.setDataCurrentPage();
          this.setState({
            detailModalVisible: false
          })
        }
      })
    }
  };

  getAdjustInventoryView = () => {
    let itemData = this.state.itemData;
    if (itemData != null) {
      return (
        <Row>
          <Col span={13}>
            <img width={"100%"} src={itemData.mainImage} alt=""/>
          </Col>
          <Col span={1}>
          </Col>
          <Col span={8}>
            <Row>
              <Col span={24}>
                <Form.Item label={`商品`}>
                  <span>{itemData.name}</span>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label={`编号`}>
                  <span>{itemData.itemId}</span>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label={`库存`}>
                  <Input value={this.state.adjustInventoryParam} onChange={this.inputChangeHandler}
                         name="adjustInventoryParam" placeholder="设置库存"/>
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
      )
    }
  };

  getAdjustModal = () => {
    return (
      <Modal
        visible={this.state.detailModalVisible}
        title="设置库存"
        onCancel={this.detailModalClose}
        width="550px"
        footer={[
          <Button key="back" type="primary" onClick={this.adjustInventory}>保存</Button>,
          <Button key="back" onClick={this.detailModalClose}>取消</Button>
        ]}
      >
        {this.getAdjustInventoryView()}
      </Modal>
    );
  }
}
