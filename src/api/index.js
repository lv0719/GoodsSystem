/*
    包含应用中所有接口请求函数的模块,且每个函数的返回值都是promise
*/
import ajax from '../api/ajax';
import jsonp from 'jsonp';
import { message } from 'antd';
//登陆
const Base = '';

export const reqLogin = (username, password) => ajax(Base+'/login', {username, password}, 'POST')

//添加用户
export const reqAddUser = (user) => ajax(Base+'/manage/user/add', user, 'POST')

//请求天气
export const queryWeather = (city) => ajax(Base+'http://wthrcdn.etouch.cn/weather_mini?city='+{city},{},'GET')

//请求一级或二级分类列表
export const queryCategoryList = (param) => ajax(Base+'/manage/category/list',{param});

//添加分类请求函数
export const queryAddList =  ({categoryName,parentId}) =>　ajax(Base+'/manage/category/add',{categoryName,parentId},'POST')

//点击修改请求函数
export const queryUpdateList =  ({categoryId,categoryName}) =>　ajax(Base+'/manage/category/update',{categoryId,categoryName},'POST')

// jsonp的请求函数。
export const reqWeather = (city) => {
    return new Promise((resolve,reject)=>{
        //const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`;
        
        const url = `http://wthrcdn.etouch.cn/weather_mini?city=${city}`
        jsonp(url,{},(err,data) => {
            //如果成功
            if(!err && data.status === 1000){
                //解构取出需要的数据
                //const {dayPictureUrl,weather} = data.results[0].weather_data[0];
                const city = data.data.city;
                const weather = data.data.forecast[0].type;
                resolve({city,weather});
            }
            //如果失败
            else{
                message.error('获取天气失败');
            }
        });
    })
}

//请求商品接口函数
export const reqProducts = (pageNum, pageSize) => ajax(Base + '/manage/product/list' ,{pageNum, pageSize})
//reqWeather();

//搜索商品分页列表
//searchType的值是productName / productDesc
export const reqSearchList = ({pageNum, pageSize, searchName, searchType}) => ajax(Base + '/manage/product/search', {
    pageNum,
    pageSize,
    [searchType] :searchName
})
// 获取一个分类
export const reqCategory = (categoryId) => ajax(Base + '/manage/category/info', {categoryId})

// 更新商品的状态(上架/下架)
export const reqUpdateStatus = (productId, status) => ajax(Base + '/manage/product/updateStatus', {productId, status}, 'POST')
// 添加/修改商品
export const reqAddOrUpdateProduct = (product) => ajax(Base + '/manage/product/' + ( product._id?'update':'add'), product, 'POST')
// 删除指定名称的图片
export const reqDeleteImg = (name) => ajax(Base + '/manage/img/delete', {name}, 'POST')




// 获取所有角色的列表
export const reqRoles = () => ajax(Base + '/manage/role/list')
// 添加角色
export const reqAddRole = (roleName) => ajax(Base + '/manage/role/add', {roleName}, 'POST')
// 添加角色
export const reqUpdateRole = (role) => ajax(Base + '/manage/role/update', role, 'POST')


// 获取所有用户的列表
export const reqUsers = () => ajax(Base + '/manage/user/list')
// 删除指定用户
export const reqDeleteUser = (userId) => ajax(Base + '/manage/user/delete', {userId}, 'POST')
// 添加/更新用户
export const reqAddOrUpdateUser = (user) => ajax(Base + '/manage/user/'+(user._id ? 'update' : 'add'), user, 'POST')