import axios from "axios"
import {ElMessage} from "element-plus"

const authItemName = "access_token"


const defaultFailure = (message, code, url) => {
    console.warn(`请求地址: ${url}, 状态码: ${code}, 错误信息: ${message}`)
    ElMessage.warning(message)
}


const defaultError = (err) => {
    console.error(err)
    ElMessage.warning('发生了一些错误，请联系管理员')
}

//获取本地保存token
function takeAccessToken() {
    const str= localStorage.getItem(authItemName) || sessionStorage.getItem(authItemName)
    if (!str) return null;
    const authObj = JSON.parse(str)
    if (authObj.expire <= new Date()) {
        deleteAccessToken();
        ElMessage.warning('登录状态已经过期，请重新登录')
        return null
    }
    return authObj.token
}

//保存token
function storeAccessToken(token, remember, expire) {
    const authObj= { token: token, expire: expire }
    const str = JSON.stringify(authObj)
    if (remember)
        localStorage.setItem(authItemName, str)
    else
        sessionStorage.setItem(authItemName, str)
}

//删除token
function deleteAccessToken() {
    localStorage.removeItem(authItemName)
    sessionStorage.removeItem(authItemName)
}

//获取请求头
function accessHeader(){
    const token = takeAccessToken()
    return token ? {
        'Authorization': `Bearer ${token}`
    } : {}
}

//封装请求Post
function internalPost(url, data, header, success, failure, error = defaultError) {
    axios.post(url,data,{ headers: header}).then(({data}) => {
        if(data.code === 200){
            success(data.data)
        } else {
            failure(data.message, data.code, url)
        }
    }).catch(err => error(err))
}


//封装请求Get
function internalGet(url, header, success, failure, error = defaultError) {
    axios.get(url,{ headers: header}).then(({data}) => {
        if(data.code === 200){
            success(data.data)
        } else {
            failure(data.message, data.code, url)
        }
    }).catch(err => error(err))
}

//封装外部使用get
function get(url, success, failure = defaultFailure) {
    internalGet(url, accessHeader(), success, failure)
}


//封装外部使用post
function post(url, data, success, failure = defaultFailure) {
    internalPost(url, data, accessHeader(), success, failure)
}


//登录请求
function login (username, password, remember, success, failure = defaultFailure){
    internalPost('/api/auth/login', {
        username: username,
        password: password
    }, {
        'Content-Type': 'application/x-www-form-urlencoded'
    }, (data) => {
        storeAccessToken(data.token, remember, data.expire)
        ElMessage.success(`登录成功，欢迎${data.username} `)
        success(data)
    },failure)
}


//退出登录
function logout(success, failure = defaultFailure){
    get('/api/auth/logout', () => {
        deleteAccessToken()
        ElMessage.success('退出登录成功，欢迎您再次使用')
        success()
    },failure)
}

//验证是否登录
function unauthorized(){
    return !takeAccessToken()
}

//暴露方法
export {login, logout, get, post, unauthorized}