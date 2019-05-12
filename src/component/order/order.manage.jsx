import React, {Component} from 'react';
import {Table, Form, Row, Col, Input, Button, Modal, Card, Select} from 'antd';
import {OrderAdminService} from "../../service/order/order.admin.service";
import {TimeUtil} from "../../util/time.util";
import {ColorUtil} from "../../util/color.util";

const {Option} = Select;

/**
 * Created by wildhunt_unique
 */
export class OrderManage extends Component {

  orderAdminService = new OrderAdminService();


  componentDidMount() {
    this.setData();
  }

  columns = [{
    title: '订单编号',
    dataIndex: 'orderId',
    key: 'orderId',
  }, {
    title: '买家昵称',
    dataIndex: 'buyerName',
    key: 'buyerName',
  }, {
    title: '买家手机',
    key: 'buyerPhone',
    render: (text, record) => {
      return (
        <div>{record.buyerMobile}</div>
      );
    }
  }, {
    title: '接单状态',
    dataIndex: 'enableStatus',
    key: 'enableStatus',
    render: enableStatus => {
      if (enableStatus === 1) {
        return (
          <span style={{"color": ColorUtil.ACTIVE}}>已接单</span>
        )
      } else if (enableStatus === 0) {
        return (
          <span style={{"color": ColorUtil.INIT}}>未接单</span>
        )
      }else if (enableStatus === -1) {
        return (
          <span style={{"color": ColorUtil.IN_ACTIVE}}>已拒绝</span>
        )
      }
    }
  },{
    title: '',
    dataIndex: 'payStatus',
    key: 'payStatus',
    render: payStatus => {
      if (payStatus === 1) {
        return (
          <span style={{"color": ColorUtil.ACTIVE}}>已付款</span>
        )
      } else if (payStatus === -1) {
        return (
          <span style={{"color": ColorUtil.IN_ACTIVE}}>未付款</span>
        )
      }
    }
  },  {
    title: '',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: createdAt => {
      return TimeUtil.formatTime(createdAt, true);
    }
  }, {
    title: '',
    dataIndex: 'status',
    key: 'detail',
    render: (text, record) => {
      return (
        <a onClick={() => this.detailModalOpen(record.orderId)}>查看详情</a>
      );
    }
  }];

  state = {
    // 表格参数
    data: [],
    pagination: {},
    loading: true,
    // 查询参数
    shopIdParam: null,
    enableStatusParam: null,
    payStatusParam: null,
    buyerIdParam: null,
    orderIdParam: null,
    // 详情页
    detailModalVisible: false,
    detailData: null,
    detailItem: []
  };

  setData = (pageNo = 1, pageSize = 5) => {
    this.setState({
      loading: true
    });
    let searchParam = {
      orderId: this.state.orderIdParam,
      shopId: this.state.shopIdParam,
      enableStatus: this.state.enableStatusParam,
      payStatus: this.state.payStatusParam,
      buyerId: this.state.buyerIdParam,
      pageSize: pageSize,
      pageNo: pageNo
    };
    this.orderAdminService.paging({
      params: searchParam,
      success: (result) => {
        this.setState({
          data: result.data,
          pageTotal: result.total,
          pageNo:pageNo,
          loading: false
        })
      }
    });
  };

  getFields = () => {
    const searchParamsInput = [];
    searchParamsInput.push(
      <Col span={6} key={3}>
        <Form.Item label={`订单编号`}>
          <Input onChange={this.inputChangeHandler} name="orderIdParam" placeholder="输入订单编号"/>
        </Form.Item>
      </Col>
    );
    searchParamsInput.push(
      <Col span={6} key={4}>
        <Form.Item
          label="是否付款"
        >
          <Select onChange={this.selectChangeHandler} name="payStatusParam" defaultValue={null}>
            <Option value={null}>请选择</Option>
            <Option value={1}>已付款</Option>
            <Option value={-1}>未付款</Option>
          </Select>
        </Form.Item>
      </Col>
    );
    return searchParamsInput;
  };

  selectChangeHandler = (value) => {
    this.setState({
      payStatusParam: value
    });
  };

  inputChangeHandler = (e) => {
    let o = {};
    o[e.target.name] = e.target.value;
    this.setState(o);
  };

  render() {
    return (
      <Card title="订单管理">
        <Form
          className="ant-advanced-search-form"
        >
          <Row gutter={24}>{this.getFields()}</Row>
          <Row>
            <Col span={24} style={{textAlign: 'right'}}>
              <Button type="primary" onClick={() => {
                this.setData()
              }}>搜索</Button>
              <Button style={{marginLeft: 8}} onClick={()=>this.setData()}>
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
              current:this.state.pageNo,
              onChange: (current, pageSize) => {
                this.pageChange(current, pageSize)
              }
            }}
          />
        </Form>
        {this.getDetailModal()}
      </Card>
    )
  }

  detailModalOpen = (orderId) => {
    this.setState({
      detailData: null,
      detailItem: []
    });
    this.orderAdminService.getDetail({
      params: {
        orderId: orderId
      },
      success: (data) => {
        this.setState({
          detailModalVisible: true,
          detailData: data,
          detailItem: data.orderLineThinResponseList
        });
      }
    });
  };

  detailModalClose = () => {
    this.setState({
      detailModalVisible: false
    })
  };

  getBuyerInfo() {
    const view = [];
    let detailData = this.state.detailData;
    if (detailData != null) {
      let orderInfo = detailData.orderThinResponse;
      view.push(
        <Card title={"买家信息"}>
          <Row>
            <Col span={6} key={"buyerName"}>
              <Form.Item label={`买家`}>
                <span>{orderInfo.buyerName}</span>
              </Form.Item>
            </Col>
            <Col span={12} key={"buyerNotes"}>
              <Form.Item label={`买家留言`}>
                <span>{orderInfo.buyerNotes}</span>
              </Form.Item>
            </Col>
          </Row>
        </Card>
      );
    }
    return view;
  }

  getDetailItem() {
    const view = [];
    let detailData = this.state.detailData;
    if (detailData != null) {
      let detailItemColumns = [{
        title: '',
        dataIndex: 'itemImage',
        key: 'itemImage',
        render: itemImage => {
          return <img src={itemImage} style={{"width": "100px", "height": "100px"}} alt={"商品图"}/>
        }
      }, {
        title: '商品编号',
        dataIndex: 'itemId',
        key: 'itemId'
      }, {
        title: '商品名',
        dataIndex: 'itemName',
        key: 'itemName'
      }, {
        title: "数量",
        dataIndex: 'quantity',
        key: 'quantity'
      }, {
        title: '单价',
        dataIndex: 'paidAmount',
        key: 'paidAmount'
      }];
      view.push(
        <Card title={"商品信息"}>
          <Table
            columns={detailItemColumns}
            dataSource={this.state.detailItem}
            pagination={false}
          />
        </Card>
      );
    }
    return view;
  }

  getShopInfo() {
    const view = [];
    let detailData = this.state.detailData;
    if (detailData != null) {
      let orderInfo = detailData.orderThinResponse;
      view.push(
        <Card title="店铺信息">
          <Row>
            <Col span={6} key={"shopId"}>
              <Form.Item label={`店铺编号`}>
                <span>{orderInfo.shopId}</span>
              </Form.Item>
            </Col>
            <Col span={6} key={"shopName"}>
              <Form.Item label={`店铺名`}>
                <span>{orderInfo.shopName}</span>
              </Form.Item>
            </Col>
            <Col span={12} key={"shopNotes"}>
              <Form.Item label={`卖家留言`}>
                <span>{orderInfo.shopNotes}</span>
              </Form.Item>
            </Col>
          </Row>
        </Card>
      );
    }
    return view;
  }

  getOrderInfo = () => {
    const view = [];
    let detailData = this.state.detailData;
    if (detailData != null) {
      let orderInfo = detailData.orderThinResponse;
      view.push(
        <Card title="订单信息">
          <Row>
            <Col span={6} key={"订单id"}>
              <Form.Item label={`订单id`}>
                <span>{orderInfo.orderId}</span>
              </Form.Item>
            </Col>
            <Col span={6} key={"下单时间"}>
              <Form.Item label={`下单时间`}>
                <span>{TimeUtil.formatTime(orderInfo.createdAt, true)}</span>
              </Form.Item>
            </Col>
            <Col span={6} key={"支付状态"}>
              <Form.Item label={`支付状态`}>
                <span>{ColorUtil.getSpan(orderInfo.payStatus, "已支付", "未支付", "")}</span>
              </Form.Item>
            </Col>
            <Col span={6} key={"是否接单"}>
              <Form.Item label={`接单状态`}>
                <span>{ColorUtil.getSpan(orderInfo.enableStatus, "已接单", "已拒接", "")}</span>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={6} key={"itemTotalAmount"}>
              <Form.Item label={`商品总数`}>
                <span>{orderInfo.itemTotalAmount}</span>
              </Form.Item>
            </Col>
            <Col span={6} key={"paidAmount"}>
              <Form.Item label={`支付金额`}>
                <span>{orderInfo.paidAmount}</span>
              </Form.Item>
            </Col>
          </Row>
        </Card>
      );
    }
    return view;
  };

  getDetailModal = () => {
    const modal = [];
    modal.push(
      <Modal
        visible={this.state.detailModalVisible}
        title="订单详情"
        onCancel={this.detailModalClose}
        width="80%"
        footer={[
          <Button key="back" onClick={this.detailModalClose}>关闭</Button>
        ]}
      >
        {this.getOrderInfo()}
        <br/>
        {this.getBuyerInfo()}
        <br/>
        {this.getShopInfo()}
        <br/>
        {this.getDetailItem()}
      </Modal>
    );
    return modal;
  };

  pageChange = (current, pageSize) => {
    console.log("current:%d,pageSize:%d", current, pageSize);
    this.setState({
      pageSize: pageSize,
      pageNo: current
    });
    this.setData(current, pageSize);
  }
}
