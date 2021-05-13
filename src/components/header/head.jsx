import React,{Component} from 'react';
import {formateTime} from '../../utils/formatDate'
import memoryUtils from '../../utils/memoryUtils'
import {reqWeather} from '../../api/index'
import {withRouter} from 'react-router-dom'
import menuList from '../../config/menuConfig'
import './head.less'
import { Modal, Button ,Space ,message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import storageUtils from '../../utils/storageUtils';
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";


const { confirm } = Modal;
class Header extends Component{
    state = {
        currentTime: formateTime(Date.now()),   //当前时间
        weather: '晴天', //天气
        city: '',    //城市
    }
    getTimes(){   //每隔一秒获取当前时间
        let $this = this
        setInterval(() => {
            const currentTime = formateTime(Date.now())
            $this.setState({
                currentTime:currentTime
            })
        },1000)
    }
    //getWether = async () => {}
    getWether = async function getWeathers(){ //获取天气函数
        const {city,weather} = await reqWeather('成都')
        this.setState({city,weather})
    }
    getTitle(){ //获取title
        let name ;
        let path = this.props.location.pathname;
        menuList.forEach(item => {
            if(item.key === path){
                name = item.title;
            }else if(item.children){
                const citem = item.children.find(i => path.indexOf(i.key) === 0)
                if(citem){
                    name = citem.title
                }
            }
        })
        return name;
    }
   
    destroyAll() {
        Modal.destroyAll();
      }
    showConfirm() {
            confirm({
              icon: <ExclamationCircleOutlined />,
              content: <p>是否确认退出登陆？</p>,
              onOk() {
                storageUtils.removeUser();
                message.success('退出登陆成功');
                console.log('退出登陆成功!');
              },
              onCancel() {
                message.info('用户取消操作')
                console.log('未退出登陆');
              },
              
            });
      }
    //在第一次render之后执行一次，常用语执行异步操作，如ajax请求和定时器 
    componentDidMount(){
        this.getTimes()
        this.getWether()
        console.log(this.props.location.pathname)
    }
    componentWillMount(){
        console.log(1)
    }
    render(){
        const {currentTime,city,weather} = this.state;
        const username = memoryUtils.user.username;
       //const username = 'liwei1'
        const user = storageUtils.getUser();
            if(!user || !user._id){
                console.log('退出登陆成功!');
                return <Redirect to="/login"/>
        }
        const title =  this.getTitle()
        //console.log(this.props.children);
        return(
            <div className="header">
                <div className="header-top">
                    <span>欢迎 {username}</span>
                    <Space>
                        <Button type="dashed" onClick={this.showConfirm}>&nbsp;退出登陆</Button>
                    </Space> 
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">{title}</div>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                        &nbsp;
                        &nbsp;
                        <span>{city}</span>
                        &nbsp;&nbsp; 
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}
export default withRouter(Header) //转换非路由组件为路由组件