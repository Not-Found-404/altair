import React, { Component } from 'react';
import { Table, Avatar, Form, Row, Col, Input, Button, Select, Card } from 'antd';
import {ItemAdminService} from "../../service/item/item.admin.service";
import {ColorUtil} from "../../util/color.util";

const { Option } = Select;

/**
 * Created by wildhunt_unique
 */
export class ItemManage extends Component {
  itemAdminService = new ItemAdminService();

  componentDidMount() {
    this.setData();
  }

  state = {
    data: [],
    loading: true,
    orderIdParam: null,
    pageSize:5,
    pageNo:1
  };

  setData = (pageNo = 1, pageSize = 5) => {
    let searchParam = {
      pageNo:pageNo,
      pageSize:pageSize
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
          pageNo:pageNo
        })
      }
    });
  };

  columns = [{
    title: '',
    dataIndex: 'mainImage',
    key: 'orderId',
    render: mainImage => {
      return <img src={mainImage}  style={{"width":"100px","height":"100px"}} alt={"商品图"}/>
    }
  }, {
    title: '商品id',
    dataIndex: 'itemId',
    key: 'itemId',
  }, {
    title: '商品名',
    dataIndex: 'name',
    key: 'name',
  },{
    title: '库存',
    dataIndex: 'inventory',
    key: 'inventory',
  },{
    title: '价格',
    dataIndex: 'price',
    key: 'price',
  },{
    title: '',
    dataIndex: 'status',
    key: 'status',
    render: status => {
     if (status === -2) {
        return (
          <span style={{"color": ColorUtil.INIT}}>未上架</span>
        )
      }else {
       return (
         <span style={{"color": ColorUtil.ACTIVE}}>已上架</span>
       )
     }
    }
  },{
    title: '',
    dataIndex: 'status',
    key: 'setStatus',
    render: (text, record) => {
      let enable = !(record.status === -2);
      let enableText = enable ? '下架' : '上架';
        return (
          <a >{enableText}</a>
        )
    }
  },{
    title: '',
    dataIndex: 'status',
    key: 'setInventory',
    render: (text, record) => {
      return (
        <a >设置库存</a>
      )
    }
  },{
    title: '',
    dataIndex: 'status',
    key: 'setInventory',
    render: (text, record) => {
      return (
        <a >编辑</a>
      )
    }
  }];

  render() {
    return (
      <Card title="商品管理">
        <Form
          className="ant-advanced-search-form"
        >
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
          />
        </Form>
      </Card>
    )
  }
}
