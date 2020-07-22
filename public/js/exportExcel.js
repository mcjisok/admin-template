
const isArray = (o) => {
  return Object.prototype.toString.call(o).slice(8, -1) === 'Array'
}


class exportExcel{
  constructor(tabledata,tHeader,filterVal,formatFunctionList=undefined,fileName){
    /*
       *@description: 
       *@author: Mark 
       *@tabledata: 完整数据列
       *@tHeader: 表头
       *@filterVal: 对应字段
       *@formatFunctionList: 格式化函数列表
       *@fileName:导出之后的文件名
    */
    this.formatFunctionList = formatFunctionList;
    this.fileName = fileName;
    try {
      if(isArray(tabledata)){
        this.tabledata = tabledata;
      }
      else{
        throw new Error("tabledata必须是数组");  
      }

      if(isArray(tHeader) || isArray(filterVal)){
        this.tHeader = tHeader;
        this.filterVal = filterVal;
      }
      else{
        throw new Error("tHeader或filterVal必须是数组");  
      }

    this.export()
      
    } catch (error) {
      console.log(error)
    }
  }

  export(){
    require.ensure([], () => {
      const { export_json_to_excel } = require("./vendor/Export2Excel");
      const list = this.tabledata;
      const data = this.formatJson(this.filterVal, list);
      export_json_to_excel(this.tHeader, data, this.fileName);
    });
  }

  formatJson(filterVal,jsonData){
    console.log(this.formatFunctionList)
    return jsonData.map(v =>
      filterVal.map(j => {
        if(this.formatFunctionList.hasOwnProperty(j)){
          return this.formatFunctionList[j](v)
        }
        else{
          return v[j]
        }
      })
    );
  }
}

export default exportExcel;
