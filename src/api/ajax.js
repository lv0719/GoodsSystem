/*
    该模块为异步发送ajax请求的函数模块，封装axios库，函数返回值为promise对象。
*/
//代码优化1
    //再ajax请求的时候如果请求有错误就把错误处理掉，利用在外层包一个自己创建的promise对象，
    //在请求出错时，不去rejected，而是去提示错误信息
//代码优化2
    //在请求成功resolve时，resolve(response.data)
import axios from 'axios';
import { message } from 'antd';


export default function ajax(url,data={},type='GET'){ 
    return new Promise((resolve,reject) => {
        let promise;
        if(type === 'GET'){
            promise = axios.get(url,{ //执行ajax的异步GET请求
                params:data
            })
        }else{
            promise = axios.post(url,data) //执行ajax的异步POST请求
        }
        promise.then(response => {
            resolve(response.data); //请求成功时返回resolve(resonse.data)
        },error => {
            message.error('请求出错了:'+error.message) //此处不去reject而是去提示错误信息
        })
    })  
}