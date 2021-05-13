import React, { Component } from "react";
import { Form, Input, Button, Checkbox, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons"; //采用SVG图标
import {reqLogin} from "../../api";
import "./login.less";
import memoryUtils from '../../utils/memoryUtils';
import storageUtils from '../../utils/storageUtils';
import favicon from "./image/favicon.ico";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";

/*
    登陆的路由组件
*/
export default class Login extends Component {
    //antd v4版本自动实现前台表单验证和表单数据收集，无需通过create方法传入form对象。
        formRef = React.createRef(); //class组件通过this.forRef来获取数据
        onCheck = async (event, errorInfo)=>{ //提交表单数据验证回调事件
            event.preventDefault();
            try{
                const values = await this.formRef.current.validateFields();
                const {username,password} = values; //解构出用户名和密码
                //message.success('提交检验成功');
                try{
                    const result = await reqLogin(username, password); //返回的是ajax.js已经处理过的promise请求，不会再报错
                     //result {status:0,data:user}{status:1,msg:''}
                    if(result.status === 0){
                        message.success('登陆成功');
                        //console.log(result);
                        const user = result.data;
                        memoryUtils.user = user;  //user保存在内存中
                        storageUtils.saveUser(user); //保存user到local中去
                        this.props.history.replace('/'); //跳转到管理界面(不需要在回退到登陆界面)
                    }else{
                        message.error(result.msg);//登陆失败
                    }
                    
                }finally{
                    
                }
                //catch{
                //    console.log('请求出错了');
                //}    
                // reqLogin(username,password).then(response => {  //这些代码被上面的await代替了，不再需要then回调处理
                //     console.log('成功',response.data);
                // }).catch(error => {
                //     console.log('失败',error);
                // })
            }catch(errorInfo){
                console.log('数据格式错误');
                message.warn('提交检验失败');
            }
        }
        onFinish= (values,err) => { //提交表单数据验证成功后回调事件
            if(!err){
                console.log('Success:',values);
                message.success('提交检验成功');
            }else{
                console.log('Failed',err);
                message.warn('提交检验失败');
            }
         };
        onReset = ()=> { //清除表单数据
            this.formRef.current.resetFields();
            message.success('清除原数据成功');
        }
        onFill = ()=> { //默认填充表单
            this.formRef.current.setFieldsValue({
                username: 'LV1234',
                password: 'liwei',
              });
              message.success('启用默认用户');
        }
        validatePwd = (rule,value,callback)=>{ //自定义验证密码框函数
            if(!value){
                callback('密码必须输入');
            }else if(value.length<4){
                callback('密码必须大等于4位');
            }else if(value.length>12){
                callback('密码必须小等于12位');
            }else if(!/^[a-zA-Z0-9_]+$/.test(value)){
                callback('用户名必须是英文，数字或下划线组成');
            }else{
                callback();
            }
            //callback()代表通过
            //callback('xxxx')代表验证失败
        }
        render() {
            const user = storageUtils.getUser();
            if(user && user._id){
                return <Redirect to="/admin"/> //实现自动跳转到首页
            }
            return (
            <div className="login">
                <header className="login-header">
                <img src={favicon} alt="" />
                <h2>React项目: 后台管理系统</h2>
                </header>
                <section className="login-section">
                <h2>用户登陆</h2>
                <Form ref={this.formRef}
                    name="normal_login"
                    className="login-form"
                    initialValues={{
                    //username:'admin',
                    remember: true,
                    }} 
                  //onFinish={this.onFinish}
                >
                    <Form.Item
                    name="username"
                    rules={[ //直接使用antd定义好的验证规则(声明式验证)
                        {required: true, whitespace: true, message: "Please input your Username!"},
                        {min: 4, message: '用户名至少4位'},
                        {max: 12, message: '用户名最多12位'},
                        {pattern: /^[a-zA-Z0-9_]+$/, message: "用户名必须是英文，数字或下划线组成"},
                    ]}
                    >
                    <Input
                        prefix={<UserOutlined className="site-form-item-icon" />}
                        placeholder="Username"
                    />
                    </Form.Item>
                    <Form.Item
                    name="password"
                    rules={[
                        {required: true, message: "Please input your Password!"},
                        //{validator: this.validatePwd} //自定义验证表单方法
                    ]}
                    >
                    <Input
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="Password"
                    />
                    </Form.Item>
                    <Form.Item>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <a className="login-form-forgot" href="www">
                        Forgot password
                    </a>
                    </Form.Item>

                    <Form.Item>
                    <Button
                        onClick={this.onCheck}  
                        type="primary"
                        htmlType="submit"
                        className="login-form-button"
                    >
                        Log in
                    </Button>
                    Or <a href="www">register now!</a>

                    <Button onClick={this.onReset} 
                    danger
                    style={{marginLeft:20}}
                    >
                        Reset
                    </Button>
                    <Button
                    onClick={this.onFill}
                    danger
                    style={{marginLeft:10}}
                    >
                        Fill
                    </Button>
                    </Form.Item>
                </Form>
                </section>
            </div>
            );
        }
        }