import React, {Component} from 'react';
import {Table, Form, Row, Col, Input, Button, Rate, Card} from 'antd';
import {CommentAdminService} from "../../service/comment/comment.admin.service";
import {TimeUtil} from "../../util/time.util";
import {ColorUtil} from "../../util/color.util";

/**
 * Created by wildhunt_unique
 */
export class CommentPaging extends Component {

  commentAdminService = new CommentAdminService();

  componentDidMount() {
    this.setData();
  }

  state = {
    data: [],
    pagination: {},
    loading: true,
    orderIdParam: null
  };

  columns = [{
    title: '订单编号',
    dataIndex: 'orderId',
    key: 'orderId',
  }, {
    title: '评分',
    dataIndex: 'rate',
    key: 'rate',
    render: rate => {
      return (<Rate disabled defaultValue={rate}/>)
    }
  }, {
    title: '评价内容',
    dataIndex: 'context',
    key: 'context',
  }, {
    title: '创建时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: createdAt => {
      return TimeUtil.formatTime(createdAt,true);
    }
  }, {
    title: '买家用户名',
    dataIndex: 'userName',
    key: 'userName'
  }, {
    title: '卖家手机号',
    dataIndex: 'extra',
    key: 'buyerPhone',
    render: extra => {
      if (extra.buyerPhone != null) {
        return extra.buyerPhone
      } else {
        return "";
      }
    }
  }, {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: status => {
      if (status === 1) {
        return (
          <span style={{"color": ColorUtil.ACTIVE}}>显示</span>
        )
      } else if (status === -2) {
        return (
          <span style={{"color": ColorUtil.INIT}}>隐藏</span>
        )
      }
    }
  }];

  setData = (pageNo = 1, pageSize = 5) => {
    let searchParam = {
      orderId: this.state.orderIdParam,
      pageNo:pageNo,
      pageSize:pageSize
    };
    this.setState({
      loading: true
    });
    this.commentAdminService.adminPaging({
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

  inputChangeHandler = (e) => {
    let o = {};
    o[e.target.name] = e.target.value;
    this.setState(o);
  };

  enableStatus = (commentId, enable) => {
    let status = enable ? 1 : -2;
    this.commentAdminService.enable({
      params: {
        commentId: commentId,
        status: status
      },
      success: (data) => {
        this.setData(this.state.pageNo,this.state.pageSize);
      }
    })
  };

  getFields = () => {
    const searchParamsInput = [];
    searchParamsInput.push(
      <Col span={6} key={1}>
        <Form.Item label={`订单编号`}>
          <Input onChange={this.inputChangeHandler} name="orderIdParam" placeholder="输入订单编号"/>
        </Form.Item>
      </Col>
    );
    return searchParamsInput;
  };

  render() {
    return (
      <Card title="评论">
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
      </Card>
    )
  }
  pageChange = (current, pageSize) => {
    console.log("current:%d,pageSize:%d", current, pageSize);
    this.setState({
      pageSize: pageSize,
      pageNo: current
    });
    this.setData(current, pageSize);
  }
}
