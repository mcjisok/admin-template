import Http from './../../../config/api';
import config from './../../../config/index';
let state = {
    userInfo: {},
    Websocket: null,
    countryList: []
};
const actions = {
    //用户登录
    async userLogin({
        commit
    }, params) {
        await new Http(params).aPost().then((cbData) => {
            commit("userLogin", {
                data: cbData
            });
        });
    },
    //用户注册
    async gotoRegister({
        commit
    }, params) {
        await new Http(params).aPost();
    },

    // 判断用户是否已登录
    async userIsLogin({
        commit
    }, params) {
        let token = window.localStorage.getItem("token");
        let userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
        if (token && userInfo) {
            commit("userLoginForVuex", {
                data: userInfo
            })
        }
    },

    // 注册获取国家地区
    async getCountry({
        commit
    }, params) {
        let cbData = await new Http(params).aGet();
        commit('getCountry', {
            data: cbData
        })
    },

    // 用户注销
    async userLogOut({
        commit
    }, params) {
        commit("userLogOut")
    },
    //websocket連接
    startWebSocket({
        commit
    }, params) {
        const wsuri = config.wsPath + "/ws";
        // commit("startWebSocket",new WebSocket(wsuri),['Bearer ' + window.sessionStorage.getItem('token')]);
        const headers = {
            'Authorization': 'Bearer ' + window.localStorage.getItem('token')
        };
        commit("startWebSocket", new WebSocket(wsuri));
    },
    // 更新userinfo
    async renewUserInfo({
        commit
    }) {
        let cbData = await new Http({
            url: '/sso/user/me'
        }).aGet();
        commit('renewUserInfo', {
            data: cbData
        })
    },

    login({
        commit
    }, params) {

        return new Promise((resolve, reject) => {
            try {
                new Http(params).aPost().then(cbData => {
                    commit('setAvator', '')
                    commit('setUserName', cbData.data.info.username)
                    commit('setUserId', cbData.data.info.id)
                    commit('setAccess', cbData.data.info.username)
                    commit('setHasGetInfo', true)
                    commit('setUserInfo',cbData.data)
                    resolve(cbData)
                }).catch(err=>{
                    reject(err)
                });
            } catch (error) {
                reject(error)
            }

        })

    }

};
const mutations = {
    startWebSocket(state, websocket) {
        state.Websocket = websocket;
    },
    userLogin(state, {
        data
    }) {
        state.userInfo = data;
        window.localStorage.setItem("token", data.token);
        window.localStorage.setItem("userInfo", JSON.stringify(data))
    },

    // 单独设置vuex的userinfo
    userLoginForVuex(state, {
        data
    }) {
        state.userInfo = data;
    },

    userLogOut() {
        sessionStorage.clear();
        localStorage.clear();
    },
    getCountry(state, {
        data
    }) {
        state.countryList = data
    },

    renewUserInfo(state, {
        data
    }) {
        state.userInfo = data;
        window.localStorage.setItem("userInfo", JSON.stringify(data))
    },

    login(state, {
        data
    }) {
        state.userInfo = data.data;
        console.log(data)
        window.localStorage.setItem("userInfo", JSON.stringify(data))
        window.localStorage.setItem("token", data.data.token);
        window.localStorage.setItem("adminid", data.data.info.id);
    },

    setAvator(state, avatorPath) {
        state.avatorImgPath = avatorPath
    },
    setUserId(state, id) {
        state.userId = id
    },
    setUserName(state, name) {
        state.userName = name
    },
    setAccess(state, access) {
        state.access = access
    },
    setToken(state, token) {
        state.token = token
        setToken(token)
    },
    setHasGetInfo(state, status) {
        state.hasGetInfo = status
    },
    setUserInfo(state, userInfo) {
        state.userInfo = userInfo;
    }

}
export default {
    namespaced: true,
    state,
    actions,
    mutations
}