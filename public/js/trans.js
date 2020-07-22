const trans = {
    trans(status) {
        switch (status) {
            case 'WithdrawApprove':
                return '提幣審核通過';
                break;
            case 'WithdrawApproveCancel':
                return '提幣審核未通過';
                break;
            case 'Outing':
                return '提幣等待到帳';
                break;
            case 'WithdrawCancel':
                return '提幣取消';
                break;
            case 'RemoveItem':
                return '下架';
                break;
            case 'Establish':
                return '下单';
                break;
            case 'NewItem':
                return '新建广告';
                break;
            case 'Deposit':
                return '充幣';
                break;
            case 'Withdraw':
                return '提幣申請';
                break;
            case 'OUT':
                return '提幣';
                break;
            case 'IN':
                return '充幣';
                break;
            case 'overdue':
                return '訂單過期';
                break
            case 'cancel':
                return '訂單取消';
                break;
            case 'BUY':
                return '購買';
                break;
            case 'SELL':
                return '出售';
                break;
            case 'notsale':
                return '下架廣告';
                break;
            case 'DIVIDEND':
                return '分紅';
                break;
            case 'DIVIDENDPA':
                return '期約分紅'
                break;
            case 'ACTIVITY':
                return '活動獎勵'
                break;
            case 'TOBB':
                return '劃轉至幣幣帳戶'
                break;
            case 'FROMBB':
                return '劃轉至法幣賬戶'
        }
    },

    getPos(item, column, cellValue, index) {
        if (item.type.toUpperCase() === "LIQUIDATION") {
            return '強平';
          }
    
          /**双向 */
          if (item.side.toUpperCase() === "SELL") {
            if (item.positionSide.toUpperCase() === "SHORT") {
              return '開空';
            } else if (item.positionSide.toUpperCase() === "LONG") {
              return '平多';
            }
          } else if (item.side.toUpperCase() === "BUY") {
            if (item.positionSide.toUpperCase() === "SHORT") {
              return '平空';
            } else if (item.positionSide.toUpperCase() === "LONG") {
              return '開多';
            }
          }
    
          /**单向持仓 */
          if (item.type.toUpperCase() === "LIQUIDATION") {
            return '強平';
          }
          if (item.side.toUpperCase() === "SELL") {
            if (item.positionStatus === "closeopen") {
              return '平开';
            } else if (item.positionStatus === "close" || item.reduceOnly === "1") {
              return '平多'; /**平仓单 */
            } else {
              return '開空';
            }
          } else if (item.side.toUpperCase() === "BUY") {
            if (item.positionStatus === "closeopen") {
              return '平开';
            } else if (item.positionStatus === "close" || item.reduceOnly === "1") {
              /**平仓单 */ return '平空';
            } else {
              return '開多';
            }
          }
    },
    
    /**根据positionSide 判断单向持仓或双向持仓 */
    getDual(item, column, cellValue, index){
        
    }
}

export default trans