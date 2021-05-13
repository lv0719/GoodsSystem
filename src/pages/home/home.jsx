import React, {Component} from 'react';
import { Carousel ,Card } from 'antd';
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
/*该界面为首页界面*/
import './index.less'

const contentStyle = {
    height: '160px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
};
export default class Home extends Component{
    toCategory = () =>  {
        window.location.pathname = '/category'
    }
    toProduct = () =>  {
        window.location.pathname = '/product'
    }
    toUser = () =>  {
        window.location.pathname = '/user'
    }
    toRole = () =>  {
        window.location.pathname = '/role'
    }
    toBar = () =>  {
        window.location.pathname = '/charts/bar'
    }
    render(){
        return(
            <div className="home">
                <div className="saySomethig">
                    <p>介绍页面菜单及主要功能</p>
                </div>
               <Carousel autoplay className="autoPlay">
               <div>
                    <h3 style={contentStyle}>首页页面</h3>
                </div>
                <div>
                    <h3 style={contentStyle}>商品页面</h3>
                </div>
                <div>
                    <h3 style={contentStyle}>用户管理页面</h3>
                </div>
                <div>
                    <h3 style={contentStyle}>角色管理页面</h3>
                </div>
                <div>
                    <h3 style={contentStyle}>图形图表页面</h3>
                </div>
                </Carousel>
                <div className="card">
                <Card title="品类管理" onClick={this.toCategory} className="center" bordered={true} style={{ width: 300 }}>
                    <p>修改分类</p>
                    <p>查看分类</p>
                    <p>新增分类</p>
                </Card>
                <Card title="商品管理" onClick={this.toProduct} bordered={true} style={{ width: 300 }}>
                    <p>搜索列表</p>
                    <p>商品上下架</p>
                    <p>查看详情</p>
                    <p>修改详情</p>
                    <p>新增商品</p>
                </Card>
                <Card title="用户管理" onClick={this.toUser} bordered={true} style={{ width: 300 }}>
                    <p>修改用户</p>
                    <p>删除用户</p>
                    <p>创建用户</p>
                </Card>
                <Card title="角色管理" onClick={this.toRole} bordered={true} style={{ width: 300 }}>
                    <p>创建角色</p>
                    <p>角色授权</p>
                    <p>创建用户</p>
                </Card>
                <Card title="图形图表" onClick={this.toBar} bordered={true} style={{ width: 300 }}>
                    <p>柱形图</p>
                    <p>折线图</p>
                    <p>饼图</p>
                </Card>
                </div>
            </div>
        )
    }
}