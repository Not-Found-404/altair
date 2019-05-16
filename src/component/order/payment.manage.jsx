import React, {Component} from "react";
import {OrderAdminService} from "../../service/order/order.admin.service";
import {Button, Card, Col, Form, Input, Row, Table} from "antd";
import {ColorUtil} from "../../util/color.util";
import {StringUtil} from "../../util/string.util";
import {TimeUtil} from "../../util/time.util";

export class PaymentManage extends Component {

  orderAdminService = new OrderAdminService();

  componentDidMount() {
    this.setData();
  }

  state = {
    data: [],
    loading: true,
    pageNo: 1,
    pageSize: 5,
    pageTotal: null,
    orderIdParam: null,
    buyerMobileParam: null,
  };

  columns = [{
    title: '订单编号',
    dataIndex: 'orderId',
    key: 'orderId',
  }, {
    title: '支付单号',
    dataIndex: 'paymentId',
    key: 'paymentId',
  }, {
    title: '买家',
    dataIndex: 'buyerName',
    key: 'buyerName',
  }, {
    title: '手机号',
    dataIndex: 'buyerMobile',
    key: 'buyerMobile',
  }, {
    title: '商品总数',
    dataIndex: 'itemTotalAmount',
    key: 'itemTotalAmount',
  }, {
    title: '支付金额',
    dataIndex: 'paidAmount',
    key: 'paidAmount',
    render: paidAmount => {
      return (
        <div>
          <span style={{color: ColorUtil.ACTIVE}}>{"￥ " + paidAmount}</span>
        </div>
      );
    }
  }, {
    title: '支付时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: createdAt => {
      let payAt = StringUtil.isEmpty(createdAt) ? "-" : TimeUtil.formatTime(createdAt, true);
      return (
        <span>{payAt}</span>
      );
    }
  }];

  setData = (pageNo = 1, pageSize = 5) => {
    this.setState({
      loading: true
    });
    let searchParam = {
      pageNo: pageNo,
      pageSize: pageSize,
      orderId: this.state.orderIdParam,
      buyerMobile: this.state.buyerMobileParam,
    };
    this.orderAdminService.paymentPaging({
      params: searchParam,
      success: (result) => {
        this.setState({
          data: result.data,
          pageTotal: result.total,
          pageNo: pageNo,
          loading: false
        });
      }
    })
  };

  pageChange = (current, pageSize) => {
    this.setState({
      pageSize: pageSize,
      pageNo: current
    });
    this.setData(current, pageSize);
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
      <Col span={6} key={3}>
        <Form.Item label={`买家手机号`}>
          <Input onChange={this.inputChangeHandler} name="buyerMobileParam" placeholder="买家手机号"/>
        </Form.Item>
      </Col>
    );
    return searchParamsInput;
  };

  inputChangeHandler = (e) => {
    let o = {};
    o[e.target.name] = e.target.value;
    this.setState(o);
  };

  render() {
    return (
      <Card title={"支付单查看"}>
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
      </Card>
    );
  }
}
