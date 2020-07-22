import Http from '../../config/api.js'
import store from '../../src/store/index.js'
import { async } from 'q';

const commonapi = {
    getCoinList : async function(){
        let obj = {
            url : '/api/v2/coin',
            data:{
                limit:100,
                offset:0
            }
        }
        return await store.dispatch('common/getCoinList',obj)
    },

    getCountry : async function(){
        let obj = {
            url : '/api/v2/country',
            data : {
                limit : 100,
                offset:0,
            }
        }
        return await store.dispatch('common/getCountry',obj)

    },

    getCurrencyList : async function(){
        let obj = {
            url : '/api/v2/currency'
        }
        return await store.dispatch('common/getCurrencyList',obj)
    },

    // 獲取單個訂單id
    getOneDeal:async function(dealID){
        let obj = {
            url : '/api/v2/deals',
            data : {
                id : dealID
            }
        }
        return await new Http(obj).aPost()
    },

    // 獲取單個廣告
    getOneAd:async function (id) {
        let obj = {
            url : '/api/v2/items',
            data : {
                id : id
            }
        }
        return await new Http(obj).aPost()
        
    }
    
}
export default commonapi