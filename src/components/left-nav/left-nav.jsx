import React,{Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import './left-nav.less';
import logo from '../../assets/images/favicon.ico';
import menuList from '../../config/menuConfig';
import { Menu,Switch } from 'antd';
import {MailOutlined,} from '@ant-design/icons';
import getUserMenu from '../../utils/storageUtils'

const { SubMenu } = Menu;
 class LeftNav extends Component{
    state = {
        mode: 'inline', 
        theme: 'dark'
    }
    hasAuth(item){  //根据登陆人的menu确定他有那些权限
        let userMenu = getUserMenu.getUser();
        let {menus} = userMenu.role;
        let username = userMenu.username;
        if(username === 'liwei'){
            return true
        }else if(!item.children){
            return menus.find(item1 => {return item1 === item.key})
        }else if(item.children){
            return item.children.some(item3 => {return menus.indexOf(item3.key) == -1})
        }
    }
    //根据menu的数据数组动态的生成对应的标签数组
    //方法一：使用map和递归调用实现动态标签生成
    getMenuNodes = (menuList)=> {
        const path = this.props.location.pathname;
        return menuList.map(item => {
            if(this.hasAuth(item)){
                if(!item.children){
                    return (
                    //<Menu.Item key="2" icon={<MailOutlined />}><Link to="/category">品类管理</Link></Menu.Item>
                    <Menu.Item key={item.key} icon={(item.icon)}><Link to={item.key}>{item.title}</Link></Menu.Item>
                    )
                }else{
                    //查找一个与当前请求路径匹配的子item
                    const citem = item.children.find(citem => path.indexOf(citem.key) === 0) //实现刷新自动展开上次打开的目录
                    //如果存在，说明当前item.children的子列表需要展开
                    if(citem){
                        this.openKey = item.key;
                    }
                    return(
                        <SubMenu key={item.key} icon={item.icon} title={item.title}>
                            {this.getMenuNodes(item.children)}
                        </SubMenu>
                    )   
                } 
            }
           
            
        })
    }
    //方法二：使用reduce和递归调用实现动态生成标签
    getMenuNode_Reduce = (menuList) =>{
        return menuList.reduce((pre,item)=>{
            if(!item.children){
                pre.push((
                    
                    <Menu.Item key={item.key} icon={<MailOutlined />}>
                        <Link to={item.key}>{item.title}</Link>
                    </Menu.Item>
                ))
            }else{
                pre.push(
                    (
                        <SubMenu key={item.key} icon={<MailOutlined />} title={item.title}>
                            {this.getMenuNodes(item.children)}
                        </SubMenu>
                    )   
                )
            }
            return pre
        },[])
    }
    changeMode = value => {
        this.setState({
            mode: value ? 'vertical' : 'inline'
        })
    };
    changeTheme = value => {
        this.setState({
            theme: value ? 'light' : 'dark'
        })
    };
    componentWillMount(){ //在第一次render之前，执行一次，为第一个render准备数据(必须是同步的)
        this.menuNodes = this.getMenuNodes(menuList);
    }
    render(){
        let path = this.props.location.pathname;
        let openKey = this.openKey;
        if(path.indexOf('/product') === 0){
            path = '/product'
        }
        
        return(
            <div className="left-nav">
                <Link to="/admin" className="left-nav-header">
                    <img src={logo} alt="logo"/>
                    <h1>后台管理系统</h1>
                </Link>
                <Menu
                    selectedKeys={[path]}
                    defaultOpenKeys={[openKey]}
                    mode={this.state.mode}
                    theme={this.state.theme} 
                >
                {/* <Menu.Item key="1" icon={<PieChartOutlined />}>
                    <Link to="/home">首页</Link>
                </Menu.Item>
                
                <SubMenu key="sub1" icon={<MailOutlined />} title="商品">
                    <Menu.Item key="2" icon={<MailOutlined />}><Link to="/category">品类管理</Link></Menu.Item>
                    <Menu.Item key="3" icon={<MailOutlined />}><Link to="/product">商品管理</Link></Menu.Item>
                </SubMenu>
                <Menu.Item key="4" icon={<DesktopOutlined />}>
                <Link to="/user">用户管理</Link>
                </Menu.Item>
                <Menu.Item key="5" icon={<ContainerOutlined />}>
                <Link to="/role">角色管理</Link>
                </Menu.Item>
                <SubMenu key="sub2" icon={<AppstoreOutlined />} title="未知菜单">
                    <Menu.Item key="9">Option 9</Menu.Item>
                    <Menu.Item key="10">Option 10</Menu.Item>
                    <SubMenu key="sub3" title="Submenu">
                    <Menu.Item key="11">Option 11</Menu.Item>
                    <Menu.Item key="12">Option 12</Menu.Item>
                    </SubMenu>
                </SubMenu>  */}
                {/* 上面之所以注释掉是因为使用了动态生成标签 */}
                {this.menuNodes}
                </Menu>
                <div className="btns">
                    <Switch 
                        className="switch-one"
                        onClick={this.changeMode} 
                        checked={this.state.mode === 'vertical'}
                        checkedChildren="vertical"
                        unCheckedChildren="inline"
                    />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <Switch 
                        className="switch-two"
                        onClick={this.changeTheme}
                        checked={this.state.theme === 'light'}
                        checkedChildren="Dark"
                        unCheckedChildren="Light"
                    />
                </div>
            </div>
        )
    }
}
export default withRouter(LeftNav);
//又用到了高阶组件withRouter包装非路由组件，返回一个新组件，并且新组件会向被包装组件传递三个属性：history/loaction/match