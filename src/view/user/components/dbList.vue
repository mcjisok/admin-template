<template>
  <div class="dbList">
    <el-dialog
      title="通路商組織"
      :visible.sync="dialogVisible"
      width="90vw"
      top="8vh"
      :before-close="handleClose"
      append-to-body
    >
      <div slot="title" class="title">
        <div class="header_title">通路商組織結構圖</div>

        <el-alert
          title="1、紅色為DB用戶，藍色為普通用戶；2、點擊節點繼續查看該節點下級組織；3、可在搜索框輸入用戶帳號，查看其下級組織"
          type="success"
          :closable="false"
        ></el-alert>
        <div class="header_from">
          <el-form :inline="true" :model="form" class="demo-form-inline" size="mini">
            <!-- <el-form-item label="通路商組織圖">
              <el-select v-model="form.deep" placeholder="請選擇層級" @change="getTree">
                <el-option label="5級" :value="5"></el-option>
                <el-option label="6級" :value="6"></el-option>
                <el-option label="7級" :value="7"></el-option>
                <el-option label="8級" :value="8"></el-option>
                <el-option label="9級" :value="9"></el-option>
                <el-option label="10級" :value="10"></el-option>
              </el-select>
            </el-form-item>-->
            <el-form-item label="用戶帳號:">
              <el-input v-model.trim="newTreeForm.search" placeholder="請輸入用戶帳號"></el-input>
            </el-form-item>
            <el-form-item label>
              <el-button type="primary" @click="handleSearch">搜索</el-button>
            </el-form-item>
            <el-form-item label v-if="localUserId !== row.user_id">
              <el-button type @click="handleReturn">返回</el-button>
            </el-form-item>
          </el-form>
          <el-form size="mini">
            <el-form-item label="當前查看用戶:">
              <el-tooltip class="item" effect="dark" content="點擊查看該用戶詳情" placement="right">
              <el-button type @click="handleToUserDetail">{{nowNodeData.user_name}}({{nowNodeData.user_nick_name}})
                <!-- (成為DB時間:{{nowUSERDB.pass_at | getChinaTime}}) -->
                {{nowUSERDB.list[0]?`成為DB時間:${$files.getChinaTime(nowUSERDB.list[0].pass_at)}`:''}}
              </el-button>
              </el-tooltip>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div id="container" v-loading="loading">
        <TreeChart
          v-if="listData.list"
          :json="tableData[this.firstUser.user_name]"
          :firstID="listData.list[1].user_id"
          :tableData="tableData"
          :class="{landscape: landscape.length}"
          @click-node="clickNode"
          @changeUserTree="changeUserTree"
        />
        <div class="nodata" v-else>暫無數據</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleClose">确 定</el-button>-->
      </span>
    </el-dialog>
  </div>
</template>

<script>
import TreeChart from "./tree";
function text(firstObj, list,vm) {
  let arr = [];
  arr[0] = list[1];
  let child = firstObj.child;
  let layerList = list.filter((ele=>{
    return ele.layer -1 === firstObj.layer && ele.lft>firstObj.lft && ele.rgt<firstObj.rgt
  }))
  // console.log(firstObj,layerList,firstObj.layer+1)

  for(let i in layerList){
    layerList[i].child = [undefined, undefined]
    child[i] = layerList[i]
  }
  if(child[0] && child[1]){
    text(child[0],list)
    text(child[1],list)
  }
  else if(child[0] && child[1] == undefined){
    text(child[0],list)
  }
  else if(child[0] == undefined && child[1]){
    text(child[1],list)
  }
};



export default {
  name: "dbList",
  components: {
    TreeChart
  },
  props: {
    dialogVisible: {
      type: Boolean,
      required: true
    },

    user_id: {
      type: String
    },
    row: {
      type: [Object, Array],
      required: true
    }
  },
  data() {
    return {
      form: {
        deep: 10,
        search: ""
      },
      searchForm: {
        username: ""
      },
      landscape: [],
      data: {},

      localUserId: "",

      loading: true,

      newTreeForm: {
        user_id: "",
        search: "",
        deep_offset: 0,
        deep_limit: 20,
        offset: 0,
        limit: 80
      },

      firstObj: {},
      listData:{},
      firstUser:{},

      tableData:{},

      /**当前组织树显示的用户 */
      nowNodeData:{},
      nowUSERDB:{}
    };
  },
  watch: {
    // user_id(val) {
    //   this.getTree(val);
    // }
    row(val){
      this.nowNodeData = val;
    },
    nowNodeData(val){
      console.log(val,'222222222222222222')
      let obj = {
        url : '/api/v3/role',
        data:{
          user_id: val.user_id,
          role: [7],
        }
      }
      new this.$http(obj).aPost().then(res=>{
        console.log(res)
        if(res.code == 200){
          this.nowUSERDB = res.data
        }
      }).catch(e=>{
        console.log(e)
      })
    },
  },
  methods: {
    handleReturn() {
      this.newTreeForm.search = "";
      // this.getTree(this.row.user_id);
      this.getNewTree(this.row.user_id);
    },
    changeUserTree() {},
    clickNode: function(node) {
      // eslint-disable-next-line
      console.log(node);
      // this.nowNodeData = node
      this.newTreeForm.search = "";
      // this.getTree(node.user_id);
      this.getNewTree(node.user_id);
      this.localUserId = node.user_id;
    },
    handleClose() {
      this.$emit("close");
    },

    // getTree(val) {
    //   /**val String 传userid */
    //   this.localUserId = val;
    //   let obj = {
    //     url: "/api/v3/role/db/list",
    //     data: {
    //       user_id: val,
    //       deep: this.form.deep,
    //       search: this.form.search
    //     }
    //   };
    //   this.data = {};
    //   this.loading = true;
    //   new this.$http(obj)
    //     .aGet()
    //     .then(res => {
    //       this.data = JSON.parse(JSON.stringify(res.data));
    //       this.loading = false;
    //       // console.log(res);
    //     })
    //     .catch(e => {
    //       console.log(e);
    //     });
    // },

    getNewTree(val) {
      this.localUserId = val;
      let obj = {
        url: "/api/v3/role/db/new_list",
        data: {
          user_id: val,
          search: this.newTreeForm.search,
          deep_offset: this.newTreeForm.deep_offset,
          deep_limit: this.newTreeForm.deep_limit,
          offset: this.newTreeForm.offset,
          limit: this.newTreeForm.limit
        }
      };
      this.loading = true;

      new this.$http(obj)
        .aPost()
        .then(res => {
          if (res.code == 200) {
            this.loading = false;

            this.listData = res.data
            this.computedData(res.data.list);

          }
        })
        .catch(e => {});
    },

    /**计算 */

    computedData(list) {
      let _this = this

      let obj = list[1];
      let firstObj = list[0].id ===0?list[1]:list[0];
      this.nowNodeData = list[0].id === 0? list[2]:list[1]
      this.firstUser = JSON.parse(JSON.stringify(list[0].id ===0?list[1]:list[0]))
      firstObj.child = [undefined, undefined];
      this.firstObj = firstObj;

      // text(this.firstObj, list,_this);
      this.test1(list)
      // this.tableData = test1(list)
    },


    /**生成树形结构 */
    test1(datas){
      var result = {};
      var positions = {};

      datas.forEach(function (ele, index) {
        var parent = positions[ele.layer - 1]
        if (parent) {
          result[parent].childrenIds.push(ele)
        }
        result[ele.user_name] = {
          ...ele,
          childrenIds: []
        }
        positions[ele.layer] = ele.user_name
      })
      this.tableData = result
    },

    handleSearch() {
      if (this.newTreeForm.search === "") {
        this.$message({
          message: "請輸入用戶帳號",
          type: "warning"
        });
      } else {
        // this.getTree();
        this.nowNodeData = {}
        this.getNewTree();

      }
    },

    handleToUserDetail(){
      console.log(this.$route.path)
      if(this.$route.path == '/index/user_manager'){
        /**在当前页面 重新查询用户 */
        this.$emit('getUserDetail',this.nowNodeData.user_id)
      }
      else{
        this.$router.push({name:'user_manager',query:{uid:this.nowNodeData.user_id}})
      }
    },
  },
  mounted() {
    // this.getTree();
    // this.getNewTree();
    // this.nowNodeData = this.row
  }
};
</script>

<style lang="less" scoped>
#container {
  max-width: 90vw;
  min-height: 50vh;
  max-height: 90vh;
  overflow: scroll;
}
.title {
  // display: flex;
  p {
    margin: 4px;
  }
}
.header_title {
  width: 100%;
  padding: 15px;
  text-align: center;
}
.header_from {
  padding: 15px 0;
}
.nodata {
  width: 100%;
  height: 300px;
  text-align: center;
  padding-top: 200px;
}
</style>