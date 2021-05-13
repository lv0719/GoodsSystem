import React,{ Component } from "react";
import memoryUtils from '../../utils/memoryUtils';
import { Redirect ,Route,Switch} from "react-router-dom/cjs/react-router-dom.min";
import { Layout } from 'antd';
import LeftNav from '../../components/left-nav/left-nav';
import Head from '../../components/header/head';
import Home from '../home/home';
import Category from '../category/category';
import Bar from '../charts/bar';
import Line from '../charts/line';
import Pie from '../charts/pie';
import Product from '../product/product';
import Role from '../role/role';
import User from '../user/user';
const { Footer, Sider, Content } = Layout;
/*
    该页面是后台管理的路由组件
*/
export default class Admin extends Component{
    render(){
        const user = memoryUtils.user;
        //如果内存没有存储user，则说明当前没有登陆
        if(!user || !user._id){
            return <Redirect to='/login'/> //在render实现页面自动跳转到登陆页面
        }
        return(
           <Layout style={{minHeight:'100%'}}>
                <Sider>
                    <LeftNav />
                </Sider>
                <Layout>
                    <Head></Head>
                    <Content style={{background: '#fff',margin:20}}>
                        <Switch> 
                            {/* 二级路由 */}
                            <Route path="/home" component={Home}/>
                            <Route path="/category" component={Category}/>
                            <Route path="/product" component={Product}/>
                            <Route path="/role" component={Role}/>
                            <Route path="/user" component={User}/>
                            <Route path="/charts/bar" component={Bar}/>
                            <Route path="/charts/pie" component={Pie}/>
                            <Route path="/charts/line" component={Line}/>
                            <Redirect to="/home"/>
                        </Switch>
                    </Content>
                    <Footer style={{textAlign: 'center',color: '#ccc'}}>欢迎使用React后台管理系统</Footer>
                </Layout>
           </Layout>
        )
    }
}