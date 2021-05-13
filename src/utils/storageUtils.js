/*
    运行local数据存储管理的工具模块

*/
import store from 'store';
//这里引用store有两个作用：第一是做浏览器的兼容性处理。第二是：简介化代码
const USER_KEY = 'user_key';
export default {
    //保存user
    saveUser(user){
        //localStorage.setItem(USER_KEY,JSON.stringify(user));
        store.set(USER_KEY,user);
    },
    //读取user
    getUser(){
        //return JSON.parse(localStorage.getItem(USER_KEY) || '{}');
        return store.get(USER_KEY) || {}
    },
    //移除user
    removeUser(){
        //localStorage.removeItem(USER_KEY);
        store.remove(USER_KEY)
    }
}