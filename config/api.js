import axios from 'axios';
import config from './index';
import router from './../src/router/index'
import { Notification  } from 'element-ui';

var instance = axios.create();
instance.defaults.timeout = 2500;
// axios全局拦截器
axios.interceptors.request.use(function (config) {
    // let langluage = window.localStorage.getItem("langluage");
    // config.headers.common['Accept-Language'] = langluage;
    const token = window.localStorage.getItem('token');
    if (token) {
        config.headers.common['Authorization'] = 'Bearer ' + token;
    }
    return config;
  }, function (error) {
    return Promise.reject(error);
  });

axios.interceptors.response.use(function (response) { 
    if (response.data.code == 401){ 
        // console.log(321)
        Notification.error({
            title: '登录失效,请重新登录',
            message: response.data.msg
        })
            localStorage.clear() 
            router.push({ 
                path: '/login', 
                // query: {redirect: router.currentRoute.fullPath} 
            }) 
        } 
    if(response.data.code == 400){
        console.log('参数错误')
        Notification.error({
            title: '错误',
            message: response.data.data || response.data.msg
        })
        return false
    }
    if(response.data.code == 403){
        Notification.error({
            title: '您没有相应的权限,请通知管理员添加',
            message: response.data.data
        })
        return false
    }
    return response 
    }, function (error) { 
    // Do something with response error
    return Promise.reject(error) 
}) 
class Http{
    constructor(params){
        this.url = params.url;
        this.params =  params.data;
        this.postType = params.postType;
    }
    aPost(){
        return new Promise((resolve,reject)=>{
            // let token = window.sessionStorage.getItem("token");
            axios.post(config.path + this.url,this.params, {
                "headers" : {          
                    "Content-Type" : "application/json"
                }}).then(res=>{
                    if(res.status === 200){
                        if(res.data.status_code){
                            // Toast(res.data.message);
                            reject(res);
                        }else{
                            resolve(res.data);
                        }
                    }else{
                         reject(res);
                    }
                }).catch(err=>{
                    // Toast("网络异常");
                    console.log(err);
                    reject(err);
                });
        })
    }

    aGet(){
        return new Promise((resolve,reject)=>{
            axios.get(config.path + this.url,{ params : this.params }, {
                "headers" : {           
                    "Content-Type" : "application/json"
                }}).then(res=>{
                    // console.log(res.headers);
                    if(res.status === 200){
                     resolve(res.data);
                    }else{
                     reject(res);
                    }
                }).catch(err=>{
                    console.log('错误',err);
                 reject(err);
                });
        })
    }

    aDelete(){
        return new Promise((resolve,reject)=>{
            axios.delete(config.path + this.url,{ params : this.params }, {
                "headers" : {           
                    "Content-Type" : "application/json"
                }}).then(res=>{
                    // console.log(res.headers);
                    if(res.status === 200){
                     resolve(res.data);
                    }else{
                     reject(res);
                    }
                }).catch(err=>{
                    console.log('错误',err);
                 reject(err);
                });
        })
    }

    aPut(){
        return new Promise((resolve,reject)=>{
            axios.put(config.path + this.url, this.params , {
                "headers" : {           
                    "Content-Type" : "application/json"
                }}).then(res=>{
                    // console.log(res.headers);
                    if(res.status === 200){
                     resolve(res.data);
                    }else{
                     reject(res);
                    }
                }).catch(err=>{
                    console.log('错误',err);
                 reject(err);
                });
        })
    }
}
export default Http;