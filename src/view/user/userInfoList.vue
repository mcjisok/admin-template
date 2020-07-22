<template>
  <div class="role_apply">
    <div class="screenBox">
      <el-row type="flex" justify="space-between" class="row-bg">
        <el-col :span="24">
          <el-form
            :inline="true"
            label-position="left"
            ref="form"
            size="mini"
            :model="form"
            class="demo-form-inline"
          >
            <el-form-item label="搜索關鍵字" prop="search">
              <el-input v-model.trim="form.search" placeholder="請輸入關鍵字/用戶暱稱/郵箱"></el-input>
            </el-form-item>
            <el-form-item label="用戶id" prop="name">
              <el-input v-model.trim="form.user_id" placeholder="請輸入用戶id"></el-input>
            </el-form-item>
            <el-form-item label="申請狀態" prop="status">
              <el-select v-model="form.status" placeholder="全部">
                <el-option
                  v-for="item in statusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="時間範圍" prop="value1" style="margin-left:40px">
              <el-date-picker
                v-model="value1"
                type="datetimerange"
                :picker-options="pickerOptions"
                range-separator="-"
                start-placeholder="開始日期"
                end-placeholder="結束日期"
                align="right"
                @change="transDate"
              ></el-date-picker>
            </el-form-item> -->
            <el-form-item>
              <el-button type="primary" @click="onSubmit" icon="el-icon-search">查詢</el-button>
              <el-button @click="reset('form')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <div v-loading="loading">
      <el-table :data="tableData.list" style="width: 100%" align="center" size="mini">
        <el-table-column align="center" prop="user_name" label="用戶帳號">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="$router.push({name:'user_manager',query:{uid:scope.row.user_id}})"
            >{{scope.row.user_name}}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="user_nick_name" label="用戶暱稱"></el-table-column>
        <el-table-column align="center" prop="user_email" label="email"></el-table-column>
        <el-table-column align="center" prop="inviter_username" label="邀請人">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="$router.push({name:'user_manager',query:{uid:scope.row.inviter}})"
            >{{scope.row.inviter_username}}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="placer_username" label="安置人">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="$router.push({name:'user_manager',query:{uid:scope.row.placer}})"
            >{{scope.row.placer_username}}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="mentor_username" label="引導師">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="$router.push({name:'user_manager',query:{uid:scope.row.mentor}})"
            >{{scope.row.mentor_username}}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="giac_account" label="GIAC帳號"></el-table-column>
        <el-table-column align="center" prop="giac_address" label="GIAC地址"></el-table-column>
        
        <el-table-column
          align="center"
          prop="update_at"
          :formatter="$files.timestampToTime"
          label="申请時間"
        ></el-table-column>

        <el-table-column align="center" prop="status" label="狀態">
          <template slot-scope="scope">
            <el-tag
              :type="gettagType(scope.row.status)"
              disable-transitions
            >{{getStatus(scope.row.status)}}</el-tag>
          </template>
        </el-table-column>
				<el-table-column align="center" prop="remark" label="備註" width="140px">
        </el-table-column>

        <el-table-column align="center" label="操作" prop="status">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="showRelease(scope.$index, scope.row)"
              v-if="scope.row.status == 'APPLY'|| scope.row.status == 'QUIT'"
            >进行審核</el-button>
            <el-button
              size="mini"
              @click="showRelease(scope.$index, scope.row)"
              v-if="scope.row.status == 'PASS' || scope.row.status =='NOPASS'"
            >查看</el-button>
            <!-- <el-button
              size="mini"
              type="primary"
              @click="handleShowRealNameInfo(scope.$index, scope.row)"
            >查看實名信息</el-button> -->
          </template>
        </el-table-column>

        <el-table-column align="center" prop="approval_name" label="審核人員"></el-table-column>
      </el-table>

      <div class="block" v-if="tableData.total > form.limit">
        <el-pagination
          background
          layout="total, prev, pager, next , jumper"
          :total="tableData.total"
          :page-size="form.limit"
          @current-change="handleChangePage"
          :current-page.sync="currentPage"
        ></el-pagination>
      </div>
    </div>
    <!-- 弹框 -->
    <el-dialog
      title="提示"
      :visible.sync="centerDialogVisible"
      :before-close="handleClose"
      :center="false"
      width="30%"
    >
      <div class="alert-content">
        <p style="text-align:center">是否通過用戶的{{rescissionOrSigning}}申請?</p>
        <el-form ref="form" :model="form" label-width="100px" size="mini">
          <el-form-item label="真實姓名">
            <el-input :placeholder="alertShowData.name" disabled></el-input>
          </el-form-item>
          <el-form-item label="生日">
            <el-input :placeholder="alertShowData.birthday" disabled></el-input>
          </el-form-item>
          <el-form-item label="居住地址">
            <el-input :placeholder="alertShowData.re_address" disabled></el-input>
          </el-form-item>
          <el-form-item label="收貨地址">
            <el-input :placeholder="alertShowData.de_address" disabled></el-input>
          </el-form-item>
          <el-form-item label="電話號碼">
            <el-input :placeholder="alertShowData.tel" disabled></el-input>
          </el-form-item>
          <el-form-item label="E-mail">
            <el-input :placeholder="alertShowData.email" disabled></el-input>
          </el-form-item>
          <el-form-item label="GIAC帳號">
            <el-input :placeholder="alertShowData.giac_account" disabled></el-input>
          </el-form-item>
          <el-form-item label="GIAC地址">
            <el-input :placeholder="alertShowData.giac_address" disabled></el-input>
          </el-form-item>
          <el-form-item label="身份證號碼">
            <el-input :placeholder="alertShowData.id_number" disabled></el-input>
          </el-form-item>
          <el-form-item class="img-item" label="正面證件照片">
            <el-image 
              style="width: 100px; height: 100px"
              :src="ImgArr[0]" 
              :preview-src-list="ImgArr">
            </el-image>        
          </el-form-item>
          <el-form-item class="img-item" label="反面證件照片">
            <el-image 
              style="width: 100px; height: 100px"
              :src="ImgArr[1]" 
              :preview-src-list="ImgArr">
            </el-image>  
          </el-form-item>

          <el-form-item label="邀請人">
            <el-input :placeholder="alertShowData.inviter_username" disabled></el-input>
          </el-form-item>
          <el-form-item label="安置人">
            <el-input :placeholder="alertShowData.placer_username" disabled></el-input>
          </el-form-item>
          <el-form-item label="引導師">
            <el-input :placeholder="alertShowData.mentor_username" disabled></el-input>
          </el-form-item>

          
          <el-form-item label="備註">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入備註/拒絕通過理由(選填)  拒絕通過時必填"
              v-model="remark"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer" v-if="alertShowData.status == 'APPLY'">
        <el-button @click="headleBtn('no')">拒 絕</el-button>
        <el-button type="primary" @click="headleBtn('yes')">通 過</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "userInfoList",

  data() {
    return {
      loading: false,
      //控制弹框显现
      centerDialogVisible: false,

      alertShowData: [],
      rescissionOrSigning: "",
      tableData: [],
      ImgArr: [],

      remark: "",
      form: {
        limit: 10,
        offset: 0,
        search: "",
        // date: "",
        // order_by:'CreateAt ASC',
        // order_by: "CreateAt DESC",
        status: "",
      },
      editRoleForm: {
        user_id: "",
        role: null
      },
    
      statusList: [
        { valeu: "", label: "全部" },
        { value: "APPLY", label: "申請簽約中" },
        { value: "PASS", label: "通過" },
        { value: "NOPASS", label: "未通過" },
      ],
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一個月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三個月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      value1: "",
      currentPage: "",


      /**實名認證信息 彈窗 */
      showRealNameInfo:false,
    };
  },
  methods: {
    handleClose(done) {
      this.centerDialogVisible = false;
      this.editRoleShow = false;
      this.ImgArr = [];
    },
    handleChangePage(e) {
      // console.log(this.currentPage)
      this.form.offset = this.form.limit * (Number(e) - 1);
      this.getdata(e);
    },
    getdata(val) {
      this.loading = true;
      // console.log("va1111111111111l" , val)
      this.currentPage = val;
      this.form.limit = 10;
      let obj = {
        url: "/api/v2/users/info",
        data: this.form
      };
      new this.$http(obj)
        .aPost()
        .then(res => {
          if (res.code == 200) {
            this.loading = false;
            this.tableData = res.data;
          }
        })
        .catch(e => {});
    },
    
    onSubmit() {
      // console.log('chaxun')
      this.form.offset = 0;
      this.getdata();
    },
    reset(formName) {
      this.form.date = "";
      this.resetForm(formName);
      this.getdata();
    },
    resetForm(formName) {
      this.value1 = "";
      this.$refs[formName].resetFields();
    },
    // 点击进行審核
    showRelease(index, row) {
      this.centerDialogVisible = true;
      this.alertShowData = row;
      this.rescissionOrSigning = row.status == "QUIT" ? "解約" : "簽約";
      console.log("this.alertShowData", this.alertShowData);

      /**實名認證照片 */
      let arr = row.pictures.split(",");
      for (let i = 0; i < arr.length; i++) {
        let url =
          this.$config.frontpath +
          "/sso/file/get?file_name=" +
          arr[i] +
          "&user_id=" +
          row.user_id;
        this.ImgArr.push(url);
      }
      return false;

      // console.log('index,row',index,row)
      // let obj = {
      //     url : '/api/v3/role/approve',
      //     data : {
      //         id : row.id,
      //         pass : true
      //     }
      // };
      // row.status = 'QUIT'
      // if(row.status == 'QUIT' || row.status == 'APPLY'){
      //     let text = row.status == 'QUIT'?'解約':'簽約'
      //     this.$confirm('是否通過用戶的'+ text +'申請?', '提示', {
      //     confirmButtonText: '確定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //     }).then(() => {
      //         new this.$http(obj).aPost().then(res=>{
      //             console.log("get数据+++++",res)
      //             this.$message({
      //                 type: 'success',
      //                 message: '已通過!'
      //             });
      //             this.getdata()
      //         })
      //         .catch(e=>{

      //         })
      //     }).catch(() => {
      //         this.$message({
      //             type: 'info',
      //             message: '已取消刪除'
      //         });
      //     });
      // }
    },
    
    headleBtn(param) {
      if (param == "no" && this.remark == "") {
        this.$message({
          type: "error",
          message: "請填寫拒絕通過理由"
        });
        return false;
      }
      let obj = {
        url: "/api/v2/users/info/approve",
        data: {
          id: this.alertShowData.id,
          pass: param == "yes" ? true : false,
          remark: this.remark
        }
      };
      if (this.alertShowData.status == "ACTIVE") {
        return false;
      }
      new this.$http(obj)
        .aPost()
        .then(res => {
          // console.log("get数据+++++",res)
          if (res.code == 200) {
            this.$message({
              type: "success",
              message: param == "yes" ? "已通過!" : "拒絕通過"
            });
            this.getdata(1);
            this.ImgArr = [];
            this.centerDialogVisible = false;
          } else {
            this.$message.error(res.data);
          }
        })
        .catch(e => {});
    },
    //字符串拼接
    stringSplicFn(a, b) {
      return a + b;
    },
    // 數組日期轉換為時間戳格式
    transDate() {
      let arr = [];
      this.value1.map((v, i, a) => {
        arr.push(v.getTime());
      });
      this.form.date = arr.join("-");
    },
    getStatus(type) {
      switch (type) {
        case "APPLY":
          return "審核中";
          break;
        case "PASS":
          return "已激活";
          break;
        case "NOPASS":
          return "拒絕通過申請";
          break;
      
      }
    },
    gettagType(type) {
      switch (type) {
        case "PASS":
          return "";
          break;
        case "APPLY":
          return "success";
          break;
        case "NOPASS":
          return "danger";
          break;
      
      }
    },
    /* 显示实名认证信息 */
    handleShowRealNameInfo(index,row){
      this.alertShowData = row;
      this.showRealNameInfo = !this.showRealNameInfo
    }
  },
  created() {
    // let d = this.$route.query
    // console.log("d-----",d)
    // if(!(JSON.stringify(d) == "{}")){
    //     this.form.date = d.date;
    //     this.form.currency = d.currency
    // // }
    // this.$commonapi.getCoinList();
    // this.$commonapi.getCurrencyList();
    this.getdata();
  }
};
</script>

<style scoped>
.screenBox {
  /* padding: 15px; */
  width: 100%;
  float: left;
}
</style>
