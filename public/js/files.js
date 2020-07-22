const files = {
    /** 自动补0** */
    setZero(val) {
        if (val < 10) {
            val = "0" + val;
        }
        return val;
    },
    /***中国时间显示 */
    getChinaTime(val) {
        let time = new Date(val);
        let y = time.getFullYear();
        let m = time.getMonth() + 1;
        let d = time.getDate();
        let h = time.getHours();
        let mm = time.getMinutes();
        let s = time.getSeconds();
        return y + "-" + files.setZero(m) + "-" + files.setZero(d) + " " + files.setZero(h) + ":" + files.setZero(mm) + ":" + files.setZero(s);
    },
    /** 字數截取 */
    getStringStr(str) {
        let strLength = 20;
        if (str && str.length) {
            if (str.length > strLength) {
                str = str.substring(0, strLength) + "...";
            }
        }
        return str;
    },
    /***超過一百 */
    getUnread(str) {
        if (str > 100) {
            str = "99+";
        }
        return str;

    },
    /***中国时间显示  年月日 */
    getDate(val) {
        let time = new Date(val);
        let y = time.getFullYear();
        let m = time.getMonth() + 1;
        let d = time.getDate();
        return y + "-" + files.setZero(m) + "-" + files.setZero(d)
    },
    /**** 平均放行时间优化 */
    setAveragePassTime(val) {
        if (val) {
            val = Math.round(val / 60);
        }
        return val;
    },
    /*** 數字千分位带小数点格式化 */
    toThousands(num = 1) {
        var flag = 1;
        if (num < 0) {
            flag = 0;
            num = -num;
        }
        var str = num.toString();
        //n为小数部分
        var n = str.slice(str.lastIndexOf('.'))
        if (n.indexOf('.') == -1) {
            n = "";
        }
        //str为整数部分
        var str = parseInt(num).toString();
        var list = str.split("").reverse();
        for (var i = 0; i < list.length; i++) {
            if (i % 4 == 3) {
                list.splice(i, 0, ",");
            }
        }
        if (flag == 1) {
            return list.reverse().join("") + n;
        } else {
            return "-" + list.reverse().join("") + n;
        }
    },

    toPercent(num, total) {
        return (Math.round(num / total * 10000) / 100.00 + "%");// 小数点后两位百分比
    },

    timestampToTime(row, column) {
        var date = new Date(row[column.property]) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-'
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
        var D = date.getDate() + ' '
        var h = (date.getHours() > 9 ? date.getHours() : '0' + date.getHours()) + ':'
        var m = (date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()) + ':'
        var s = (date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds())
        return Y + M + D + h + m + s
    },
    timestampToTime1(row, column) {
        var date = new Date(row.create_at || row.time || row.timestamp) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-'
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
        var D = date.getDate() + ' '
        var h = date.getHours() + ':'
        var m = date.getMinutes() + ':'
        var s = date.getSeconds()
        return Y + M + D + h + m + s
    },
    noFixed(num) {
        if (num) {
            let strs = new Array();
            strs = num.toString().split(".");
            if (strs.length >= 2 && strs[1].length > 6) {
                num = strs[0] + "." + strs[1].substring(0, 6);
            } else if (strs.length < 2) {
                num = strs[0] + "." + '000000'
            }
            return num
        }
    },

    /*
       *@description: 
       *@author: Mark 
       *@params1: 除数
       *@return: 被除数
    */
    accDiv(arg1, arg2) {
        var t1 = 0, t2 = 0, r1, r2;
        try {
            t1 = arg1.toString().split(".")[1].length
        } catch (e) {
        }
        try {
            t2 = arg2.toString().split(".")[1].length
        } catch (e) {
        }

        r1 = Number(arg1.toString().replace(".", ""))
        r2 = Number(arg2.toString().replace(".", ""))
        return (r1 / r2) * Math.pow(10, t2 - t1);
    },

    fixed(n, digits) {
        // console.log(n,digits,'这是啥玩意')
        n = n.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
            .replace('.', '$#$')
            .replace(/\./g, '')
            .replace(/\-/g, '')
            .replace('$#$', '.')
        if(n[0] == '0' && n[1] == '0'){
            // debugger
            n = n.slice(0,1)
        }
        // .replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只允许输入两位小数
        if (digits === 0) {
            let num = n
            let strs = new Array();
            console.log(num,'这是啥玩意')
            strs = (num.toString() || '').split(".");
            if (strs.length >= 2) {
                num = strs[0]
            }
            n = num
            // n = n.replace(/\D/g,'')
        }
        else if(digits === 1){
            n = n.replace(/^(\-)*(\d+)\.(\d).*$/, '$1$2.$3');//只允许输入两位小数
        }
        else if (digits === 2) {
            n = n.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');//只允许输入两位小数
        }
        else if (digits === 3) {
            n = n.replace(/^(\-)*(\d+)\.(\d\d\d).*$/, '$1$2.$3');//只允许输入三位小数
        }
        else if (digits === 4) {
            n = n.replace(/^(\-)*(\d+)\.(\d\d\d\d).*$/, '$1$2.$3');//只允许输入六位小数
        }
        else if (digits === 5) {
            n = n.replace(/^(\-)*(\d+)\.(\d\d\d\d\d).*$/, '$1$2.$3');//只允许输入六位小数
        }
        else if (digits === 6) {
            n = n.replace(/^(\-)*(\d+)\.(\d\d\d\d\d\d).*$/, '$1$2.$3');//只允许输入六位小数
        }
        else if (digits === 7) {
            n = n.replace(/^(\-)*(\d+)\.(\d\d\d\d\d\d\d).*$/, '$1$2.$3');//只允许输入六位小数
        }
        else if (digits === 8) {
            n = n.replace(/^(\-)*(\d+)\.(\d\d\d\d\d\d\d\d).*$/, '$1$2.$3');//只允许输入六位小数
        }
        else if (digits === 9) {
            n = n.replace(/^(\-)*(\d+)\.(\d\d\d\d\d\d\d\d).*$/, '$1$2.$3');//只允许输入六位小数
        }
        else if (digits === 10) {
            n = n.replace(/^(\-)*(\d+)\.(\d\d\d\d\d\d\d\d\d).*$/, '$1$2.$3');//只允许输入六位小数
        }
        return n
    },

    // uuid
    createuuid() {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";

        var uuid = s.join("");
        return 'admin' + uuid;
    },
 


}
export default files;