<template>
  <div class="inviterList">
    <el-table
      :data="tableData.list"
      v-loading="loading"
      style="width: 100%">
      <el-table-column
        prop="username"
        label="用戶帳號"
        >
        <template slot-scope="scope">
          <el-link type="primary" @click="getUserDetail(scope.row.id)">{{scope.row.username}}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="nickname"
        label="用戶暱稱">
        <template slot-scope="scope">
            <el-tag :type="'info'" style="margin-right:5px;">{{scope.row.nickname}}</el-tag>
            <el-tag size="mini" :type="scope.row.db_side == 0?'':'danger'" effect="plain" v-if="db">{{scope.row.db_side == 0?'R':'L'}}</el-tag>
          </template>
      </el-table-column>

      <el-table-column align="center" prop="email_verified" label="實名認證">
        <template slot-scope="scope">
          <el-button v-if="scope.row.certification_verified === 1" size="mini" type="primary" @click="handleShowRealNameInfo(scope.$index, scope.row)">已實名</el-button>
          <el-tag type="danger" v-else>未實名</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        prop="place_user_user_name"
        label="安置人">
        <template slot-scope="scope">
            <el-link type="primary" @click="getUserDetail(scope.row.place_user)">{{scope.row.place_user_user_name}}</el-link>
          </template>
      </el-table-column>

      <el-table-column
        prop="db_active"
        label="是否DB">
        <template slot-scope="scope">
          <div>
            {{scope.row.db_active?'是':'否'}}
          </div>
        </template>
      </el-table-column>

      <el-table-column
        prop="db_level"
        label="DB等級">
      </el-table-column>

      <el-table-column
        prop="db_create_at"
        label="DB申請時間"
        :formatter="$files.timestampToTime"
        >
        <template slot-scope="scope">
          <div>
            {{scope.row.db_create_at?$files.getChinaTime(scope.row.db_create_at):'-'}}
          </div>
        </template>
      </el-table-column>

      <el-table-column
        v-if="future"
        prop="future"
        label="是否開通合約"
        >
        <template slot-scope="scope">
          <div>
            {{scope.row.future?'已開通':'未開通'}}
          </div>
        </template>
      </el-table-column>
      
      
      <el-table-column
        align="center"  
        prop="create_at"
        label="註冊時間"
        :formatter="$files.timestampToTime"             
      >
      </el-table-column>

      <el-table-column fixed="right" align="center" label="操作" prop="status" width="230">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="handleShowTree(scope.$index, scope.row)"              
          >查看組織圖</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
          background
          layout="total, prev, pager, next , jumper"
          :total="tableData.total"
          :page-size="form.limit"
          @current-change="handleChangePage"
          :current-page.sync="currentPage"
      >
      </el-pagination>
    </div>
    <dbTree ref="dbtree" @getUserDetail="getUserDetail" :dialogVisible="showTree" :row="alertShowData" :user_id="alertShowData.user_id" @close="showTree = false"></dbTree>
    <!-- <realNameInfo :dialogVisible="showRealNameInfo" :user_id="alertShowData.id" @close="showRealNameInfo = false"></realNameInfo> -->

  </div>
</template>

<script>
import dbTree from './dbList.vue'
// import realNameInfo from '../../exchange/component/realNameInfo.vue'
export default {
  name: "inviterList",
  components:{
    dbTree,
    // realNameInfo
  },
  props: {
    row: {
      type: [Object, Array],
    },

    /**是否只查詢DB用户 */
    db:{
      type:Boolean,
      default:false
    },

    /**查询类型 1、直推 接口通过inviter字段查询 2、安置人 接口通过user_id查询*/
    /**inviterType:1、inviter 2、place */
    inviterType:{
      type:String,
      default:'inviter'
    },

    /**是否检查有没有开通合约 */
    future:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      tableData:{},
      form:{
        limit:10,
        offset:0,
      },
      loading:false,
      alertShowData: [],

      /**db树 弹窗 */
      showTree:false,

      currentPage:1,

      /**显示实名认证信息 */
      alertShowData: [],
      /**實名認證信息 彈窗 */
      showRealNameInfo:false,

    }
  },
  watch: {
    row(val){
      console.log(val)
      this.form = {
        limit:10,
        offset:0
      }
      this.handleShowInviterList()

    }
  },
  mounted() {
    this.handleShowInviterList()
  },
  methods: {
    /* 显示实名认证信息 */
    handleShowRealNameInfo(index,row){
      this.alertShowData = row;
      this.showRealNameInfo = !this.showRealNameInfo
    },

    getUserDetail(uid){
      /**告知父组件 重新查询用户 */
      this.showTree = false
      this.$emit('getUserDetail',uid)
    },
    handleShowInviterList() {
      let obj = {
        url: "/api/v2/users",
        data: {
          inviter: this.inviterType == 'inviter'?this.row.user_id ||this.row.id :'',
          user_id:this.inviterType == 'place'?this.row.user_id ||this.row.id :'',
          ...this.form,
          db:this.db,
          future:this.future,
          order_by:'DBTree.Active desc'
        }
      };
      this.loading = true
      new this.$http(obj).aPost().then((res=>{
        this.tableData = res.data;
        this.loading = false
      }))
      .catch(()=>{

      });
    },

    handleChangePage(e){
      this.form.offset = this.form.limit*(Number(e)-1);            
      this.handleShowInviterList(e)
    },

    handleShowTree(index,row){
      this.alertShowData = row;
      this.showTree = !this.showTree;
      // this.$refs.dbtree.getTree(row.user_id)
      this.$refs.dbtree.getNewTree(row.id)
    }
  }
};
</script>

<style>
</style>