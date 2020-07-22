
<template>
  <div class="user">
    <div class="screenBox">
      <el-row type="flex" justify="start" class="row-bg">
        <el-form
          :inline="true"
          label-position="left"
          ref="form"
          size="mini"
          :model="form"
          class="demo-form-inline"
        >
          <!-- <el-form-item label="用戶id" prop="name">
                    <el-input v-model="form.user_id" placeholder="請輸入用戶id"></el-input>
          </el-form-item>-->

          <el-form-item label="關鍵字" prop="search" autosize>
            <el-input v-model.trim="form.search" placeholder="請輸入用戶帳號/郵箱/暱稱"></el-input>
          </el-form-item>
          <!-- <el-form-item label="邀請碼" prop="invite_code">
            <el-input v-model.trim="form.invite_code" placeholder="請輸入邀請碼"></el-input>
          </el-form-item>
          <el-form-item label="邀請人" prop="inviter">
            <el-input v-model.trim="form.inviter" placeholder="請輸入邀請人帳號/id/暱稱"></el-input>
          </el-form-item>
          <el-form-item label="錢包地址" prop="address">
            <el-input v-model.trim="form.address" placeholder="請輸入錢包地址"></el-input>
          </el-form-item>

          <el-form-item label="身份證號查詢" prop="id_num">
            <el-input v-model.trim="form.id_num" placeholder="請輸入完整的身份證號"></el-input>
          </el-form-item> -->

          <el-form-item label="排序方式" prop="order_by">
            <el-select v-model="form.order_by" placeholder="請選擇排序方式">
              <el-option
                v-for="item in orderbyList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <!-- <el-form-item label="實名認證" prop="certification">
            <el-select v-model="form.certification" placeholder="請選擇實名認證狀態">
              <el-option
                v-for="item in certificationList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item> -->

          <el-form-item>
            <el-button type="primary" @click="onSearch" icon="el-icon-search">查詢</el-button>
            <el-button @click="onReset('form')">重置</el-button>
            <el-button @click="exportExcel()">導出當前頁為Excel</el-button>
            <el-button @click="showExport()">導出更多</el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </div>
    <el-table :data="tableData.list" style="width: 100%" align="center" size="mini">
      <el-table-column align="center" prop="id" label="用戶id" width="240"></el-table-column>
      <el-table-column align="center" prop="username" label="用戶帳號"></el-table-column>
      <el-table-column align="center" prop="nickname" label="暱稱"></el-table-column>
      <el-table-column align="center" prop="email" label="郵箱"></el-table-column>
      <el-table-column align="center" prop="email_verified" label="郵箱驗證">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.email_verified === 1">已驗證</el-tag>
          <el-tag type="danger" v-else>未驗證</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="email_verified" label="實名認證">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.certification_verified === 1"
            size="mini"
            type="primary"
            @click="handleShowRealNameInfo(scope.$index, scope.row)"
          >已實名</el-button>
          <el-tag type="danger" v-else>未實名</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="invite_code" label="個人邀請碼"></el-table-column>
      <el-table-column align="center" prop="transfer_num" label="交易次數"></el-table-column>
      <el-table-column align="center" prop="transfer_success_num" label="交易成功次數"></el-table-column>

      <!-- <el-table-column
                prop="device"
                label="登入設備">
            </el-table-column>
            <el-table-column
                prop="version"
                label="APP版本">
      </el-table-column>-->
      <!-- <el-table-column
                align="center"  
                prop="balance"
                label="帳戶餘額">
      </el-table-column>-->

      <el-table-column
        align="center"
        prop="create_at"
        label="註冊時間"
        width="160"
        :formatter="$files.timestampToTime"
      ></el-table-column>

      <el-table-column
        align="center"
        prop="invite_user_name"
        label="介紹人"
      ></el-table-column>

      <!-- <el-table-column align="center" label="操作" width="140">
        <template slot-scope="scope">
          <el-dropdown>
            <el-button type="primary" size="medium">
              操作
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="handleView(scope.$index, scope.row)">查看用戶詳情</el-dropdown-item>
              <el-dropdown-item @click.native="handleViewAcount(scope.$index, scope.row)">查看用戶資產</el-dropdown-item>
              <el-dropdown-item @click.native="handleViewDeal(scope.$index, scope.row)">查看用戶交易</el-dropdown-item>
              <el-dropdown-item @click.native="handleEdit(scope.$index, scope.row)">編輯用戶</el-dropdown-item>
              <el-dropdown-item @click.native="handleCoinIn(scope.$index, scope.row)">充值</el-dropdown-item>
              <el-dropdown-item @click.native="handleSendMSG(scope.$index, scope.row)">發送消息</el-dropdown-item>
              <el-dropdown-item @click.native="handleShowTree(scope.$index, scope.row)">查看組織圖</el-dropdown-item>
              <el-dropdown-item
                @click.native="handleShowInviterList(scope.$index, scope.row)"
              >查看邀請用戶</el-dropdown-item>
              <el-dropdown-item @click.native="handleToWater(scope.$index, scope.row,0)">查看法幣流水</el-dropdown-item>
              <el-dropdown-item @click.native="handleToWater(scope.$index, scope.row,1)">查看幣幣流水</el-dropdown-item>
              <el-dropdown-item @click.native="handleToWater(scope.$index, scope.row,2)">查看合約流水</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column> -->
    </el-table>

    <div class="block" style="display:flex" v-if="tableData.total > form.limit">
      <el-pagination
        background
        layout="total, prev, pager, next , jumper"
        :total="tableData.total"
        :page-size="form.limit"
        @current-change="handleChangePage"
        :current-page.sync="currentPage"
      ></el-pagination>
      <el-button
        v-if="$route.query.uid"
        type="primary"
        size="mini"
        style="margin-left:100px"
        @click="$router.go(-1)"
      >返回上一頁</el-button>
    </div>
    <el-dialog title="編輯用戶" :visible.sync="dialogVisible" width="40%" id="rebateSetTable">
      <el-form ref="currencyEditForm" :model="currencyEditForm" label-width="120px" size="small">
        <!-- <el-form-item label="用戶帳號">
                    <el-input v-model="form.username"></el-input>
        </el-form-item>-->
        <el-divider content-position="left">法幣交易限制</el-divider>

        <el-form-item label="是否限制登錄">
          <el-switch
            v-model="currencyEditForm.lock"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="onChangeLock"
          ></el-switch>
        </el-form-item>

        <el-form-item label="是否限制交易">
          <el-switch
            v-model="currencyEditForm.transfer_limit"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </el-form-item>
        <el-form-item label="是否限制出金">
          <el-switch
            v-model="currencyEditForm.out_limit"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </el-form-item>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="currencyEdit">保存</el-button>
      </el-form>
      <el-form ref="coinTradeEditForm" :model="coinTradeEditForm" label-width="120px" size="small">
        <el-divider content-position="left">幣幣交易限制</el-divider>
        <el-form-item label="是否允許交易">
          <el-switch
            v-model="coinTradeEditForm.can_trade"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </el-form-item>
        <el-form-item label="是否允許轉出">
          <el-switch
            v-model="coinTradeEditForm.can_withdraw"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </el-form-item>
        <el-form-item label="是否允許轉入">
          <el-switch
            v-model="coinTradeEditForm.can_deposit"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </el-form-item>
        <el-form-item label="买入时的手续费（百分比）" prop="buyer_commission" autosize>
          <el-input
            v-model.number="coinTradeEditForm.buyer_commission"
            type="number"
            step="0.001"
            min="0"
            placeholder
          ></el-input>
        </el-form-item>
        <el-form-item label="卖出时的手续费（百分比）" prop="seller_commission" autosize>
          <el-input
            v-model.number="coinTradeEditForm.seller_commission"
            type="number"
            step="0.001"
            min="0"
            placeholder
          ></el-input>
        </el-form-item>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="coinTradeEdit">保存</el-button>
      </el-form>
    </el-dialog>

    <el-dialog title="充值" :visible.sync="dialogVisible1" width="30%">
      <el-form ref="coinInfrom" :model="coinInfrom" label-width="100px" size="small ">
        <el-form-item label="充值幣種">
          <el-select v-model="coinInfrom.symbol" placeholder="請選擇充值幣種" @change="changeCoinSymbol">
            <el-option
              v-for="(item,index) in nowUserAcountList"
              :key="item.id"
              :label="item.coin_symbol"
              :value="item.id"
            >
              <span style="float: left" v-if="item.coin_symbol == 'USDT'">{{ item.coin_symbol }}</span>
              <span
                style="float: right; color: #8492a6; font-size: 13px"
                v-if="item.coin_symbol == 'USDT'"
              >{{ item.coin_chain }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="充值地址">
          <el-input v-model="coinInfrom.address" disabled></el-input>
        </el-form-item>
        <el-form-item label="充值數量">
          <el-input v-model="coinInfrom.amount"></el-input>
        </el-form-item>
        <el-form-item label="區塊鏈名稱">
          <el-input v-model="coinInfrom.chain" disabled></el-input>
        </el-form-item>
        <el-form-item label="txId">
          <el-input v-model="coinInfrom.txId" disabled></el-input>
        </el-form-item>
     
      </el-form>
      <el-button @click="dialogVisible1 = false">取消</el-button>
      <el-button type="primary" @click="onSubmit">保存</el-button>
    </el-dialog>

    <el-dialog title="查看用戶詳情" :visible.sync="dialogVisible2" width="30%">
      <el-form label-width="120px" size="small" label-position="left">
        <el-form-item label="用戶id">{{user_detail.id}}</el-form-item>
        <el-form-item label="用戶角色">
          <el-tag size="mini" type="danger" effect="plain" v-if="user_detail.ag" style="margin-right:5px">AG</el-tag>
          <el-tag size="mini" type="danger" effect="plain" v-if="user_detail.vag" style="margin-right:5px">VAG</el-tag>
          <el-tag size="mini" type="danger" effect="plain" v-if="user_detail.db" style="margin-right:5px">DB</el-tag>
          <el-tag size="mini" type="danger" effect="plain" v-if="user_detail.pa" style="margin-right:5px">期約合夥人</el-tag>
          <el-tag size="mini" type="danger" effect="plain" v-if="user_detail.bs" style="margin-right:5px">VIP</el-tag>
          <el-tag size="mini" type="danger" effect="plain" v-if="user_detail.sbs" style="margin-right:5px">SVIP</el-tag>
        </el-form-item>
        <el-form-item label="交易次數">{{user_detail.transfer_num}}</el-form-item>
        <el-form-item label="用戶郵箱">{{user_detail.email}}</el-form-item>
        <el-form-item label="是否驗證郵箱">{{user_detail.email_verified?'已驗證':'未驗證'}}</el-form-item>
        <el-form-item label="手機號">{{user_detail.mobile ==''?'無':user_detail.mobile}}</el-form-item>
        <el-form-item label="暱稱">{{user_detail.nickname}}</el-form-item>
        <!-- <el-form-item label="user_detail">{{user_detail.props}}</el-form-item> -->
        <el-form-item label="登入帳號">{{user_detail.username}}</el-form-item>
        <el-form-item label="介紹人">帳號：{{user_detail.invite_user_name}}(暱稱：{{user_detail.inviter}})</el-form-item>
        <el-form-item label="安置人">{{user_detail.place_user ==''?'無':user_detail.place_user}}</el-form-item>
        <el-form-item label="邀請碼">{{user_detail.invite_code}}</el-form-item>
        <el-form-item label="邀請總數">{{user_detail.invite_total}}</el-form-item>
        <el-form-item label="客戶端">{{user_detail.device}}</el-form-item>
        <el-form-item label="登入設備">{{user_detail.device_id}}</el-form-item>
        <el-form-item label="版本號">{{user_detail.version}}</el-form-item>
        <el-form-item label="登入限制">{{user_detail.delete_at>0?'已限制':'未限制'}}</el-form-item>

        <!-- <el-form-item label="修改密碼日期">{{user_detail.last_password_update}}</el-form-item>
        <el-form-item label="修改頭像日期">{{user_detail.last_picture_update}}</el-form-item>-->
      </el-form>
    </el-dialog>

    <el-dialog title :visible.sync="dialogVisible3" width="70%">
      <el-form label-width="120px" size="small" label-position="left" v-if="user_acountData.data">
        <el-table :data="user_acountData.data.account" stripe style="width: 100%">
          <el-table-column label="法幣資產">
            <el-table-column prop="coin_symbol" label="幣種名稱"></el-table-column>
            <el-table-column prop="coin_chain" label="鏈種名稱"></el-table-column>
            <el-table-column prop="balance" label="總餘額"></el-table-column>
            <el-table-column prop="available_balance" label="可用餘額"></el-table-column>
            <el-table-column prop="frozen_balance" label="凍結餘額"></el-table-column>
            <el-table-column prop="address" label="錢包地址" width="380%"></el-table-column>
          </el-table-column>
        </el-table>
        <br />
        <el-table :data="user_coinBalance" stripe style="width: 100%">
          <el-table-column label="幣幣資產">
            <el-table-column prop="asset" label="幣種名稱"></el-table-column>
            <el-table-column prop="total" label="總餘額"></el-table-column>
            <el-table-column prop="free" label="可用餘額"></el-table-column>
            <el-table-column prop="locked" label="凍結餘額"></el-table-column>
          </el-table-column>
        </el-table>

        

        <el-divider content-position="left">合約資產</el-divider>
        <div style="margin-top:50px;"> 
          <h3>資產</h3>
          <el-table :data="user_futureBalance.assets">
            <el-table-column property="asset" label="資產名稱"></el-table-column>
            <el-table-column property="initialMargin" label="起始保證金"></el-table-column>
            <el-table-column property="maintMargin" label="維持保證金"></el-table-column>
            <el-table-column property="marginBalance" label="保證金餘額"></el-table-column>
            <el-table-column property="maxWithdrawAmount" label="最大可提款金額"></el-table-column>
            <el-table-column property="openOrderInitialMargin" label="掛單起始保證金"></el-table-column>
            <el-table-column property="positionInitialMargin" label="持倉起始保證金"></el-table-column>
            <el-table-column property="unrealizedProfit" label="未實現盈虧"></el-table-column>
            <el-table-column property="walletBalance" label="帳戶餘額"></el-table-column>
          </el-table>
        </div>

        <div style="margin-top:50px;"> 
          <h3>持倉</h3>
          <el-table :data="user_futureBalance.positions">
            <el-table-column property="symbol" label="交易對"></el-table-column>
            <el-table-column property="positionAmt" label="持倉數量"></el-table-column>
            <el-table-column property="entryPrice" label="成交均價/開倉價格" width="150"></el-table-column>
            <!-- <el-table-column property="markPrice" label="標記價格"></el-table-column> -->
            <el-table-column property="contractPrice" label="最新價格"></el-table-column>
            <el-table-column property="maxNotionalValue" label="最大頭寸"></el-table-column>
            <el-table-column property="initialMargin" label="起始保證金"></el-table-column>
            <el-table-column property="maintMargin" label="維持保證金"></el-table-column>
            <el-table-column property="openOrderInitialMargin" label="掛單起始保證金"></el-table-column>
            <el-table-column property="positionInitialMargin" label="持倉起始保證金"></el-table-column>
            <el-table-column property="unrealizedProfit" label="未實現盈虧"></el-table-column>
          </el-table>
        </div>
        

        <br />
        <br />
        <br />
        <br />
        <el-form-item label="充幣總數量">{{user_acountData.data.in.amount}}</el-form-item>
        <el-form-item label="充幣次數">{{user_acountData.data.in.num}}</el-form-item>
        <el-form-item label="提幣總數量">{{user_acountData.data.out.amount}}</el-form-item>
        <el-form-item label="提幣次數">{{user_acountData.data.out.num}}</el-form-item>

        <el-form-item label="購買總數量">{{user_acountData.data.buy.amount}}</el-form-item>
        <el-form-item label="購買成功次數">{{user_acountData.data.buy.num}}</el-form-item>
        <el-form-item label="出售總數量">{{user_acountData.data.sell.amount}}</el-form-item>
        <el-form-item label="出售成功次數">{{user_acountData.data.sell.num}}</el-form-item>

      </el-form>
    </el-dialog>

    <el-dialog title="用戶訂單列表" :visible.sync="dialogTableVisible" width="85%">
      <el-table :data="user_deal_tabdata.list">
        <el-table-column prop="id" label="訂單id" width="100"></el-table-column>
        <el-table-column prop="coin_symbol" label="幣種"></el-table-column>
        <el-table-column prop="currency" label="支付貨幣"></el-table-column>
        <el-table-column prop="price" label="單價"></el-table-column>
        <el-table-column prop="quantity" label="數量"></el-table-column>
        <el-table-column prop="amount" label="金額"></el-table-column>

        <el-table-column prop="pay_code" label="付款參考碼">
          <!-- <template slot-scope="scope">
                        {{scope.row.pay_expire/60 + '分鐘'}}
          </template>-->
        </el-table-column>
        <el-table-column prop="coin_symbol" label="交易幣種"></el-table-column>
        <!-- <el-table-column
                    prop="pay_method"
                    label="付款方式">
                    <template slot-scope="scope">
                        {{scope.row.fee?scope.row.fee:'0'}}
                    </template>
        </el-table-column>-->
        <el-table-column prop="trade_type" label="廣告類型">
          <template slot-scope="scope">
            <el-tag
              v-if="scope.row.trade_type == 'SELL'"
              type="success"
              disable-transitions
            >{{scope.row.trade_type == 'BUY'?'購買':'出售'}}</el-tag>
            <el-tag
              v-if="scope.row.trade_type == 'BUY'"
              type="warning"
              disable-transitions
            >{{scope.row.trade_type == 'BUY'?'購買':'出售'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="訂單狀態">
          <template slot-scope="scope">{{getstatus(scope.row.status)}}</template>
        </el-table-column>
        <el-table-column prop="create_at" label="發佈時間" :formatter="$files.timestampToTime"></el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :total="user_deal_tabdata.total"
          :page-size="dealform.limit"
          @current-change="handleChangePageUser"
          :current-page.sync="currentPageUser"
        ></el-pagination>
      </div>
    </el-dialog>

    <el-dialog title="導出Excel" :visible.sync="exportExcelModal" :before-close="handleClose">
      <el-alert title="請選擇要導出的數據條數 或直接選擇數目" type="warning"></el-alert>
      <br />

      <el-form :model="form">
        <el-form-item label="數據條數" label-width="80px">
          <el-col :span="8">
            <el-input v-model.number="exportform.min"></el-input>
          </el-col>
          <el-col class="line" :span="1">-</el-col>
          <el-col :span="8">
            <el-input v-model.number="exportform.max"></el-input>
          </el-col>
          <el-col :span="4">
            <el-button size="small" round type="primary" @click="handleAllLimit">全部</el-button>
          </el-col>
        </el-form-item>
        <el-form-item label="排序方式" prop="order_by" label-width="80px">
          <el-select v-model="exportform.order_by" placeholder="請選擇排序方式">
            <el-option
              v-for="item in orderbyList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="exportExcelModal = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmitExport">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="發送消息給用戶" :visible.sync="sendMSGshow" width="60%" center>
      <customServices :row="row" :hideRight="false" ref="customServices"></customServices>
    </el-dialog>
    <el-dialog title="邀請列表" :visible.sync="showInviterList" width="70%" center>
      <inviterList :row="row" @getUserDetail="getUserDetail"></inviterList>
    </el-dialog>
    <!-- <realNameInfo
      :dialogVisible="showRealNameInfo"
      :user_id="alertShowData.id"
      @close="showRealNameInfo = false"
    ></realNameInfo> -->
    <dbTree
      ref="dbtree"
      @getUserDetail="getUserDetail"
      :dialogVisible="showTree"
      :row="alertShowData"
      :user_id="alertShowData.user_id"
      @close="showTree = false"
    ></dbTree>
  </div>
</template>

<script>

// import {export_json_to_excel} from "../../../public/js/vendor/Export2Excel"

import { setTimeout } from "timers";
// import customServices from "../../views/custom_service/custom_service.vue";
import inviterList from "./components/inviter_list.vue";
// import realNameInfo from "../exchange/component/realNameInfo.vue";
import dbTree from "./components/dbList.vue";

export default {
  name: "user_manage",
  components: {
    // customServices: customServices,
    inviterList,
    // realNameInfo,
    dbTree
  },
  data() {
    return {
      currentPage: 1,
      currentPageUser: 1,
      tableData: [],
      dialogVisible: false,
      dialogVisible1: false,
      dialogVisible2: false,
      dialogVisible3: false,
      dialogTableVisible: false,
      exportExcelModal: false,
      sendMSGshow: false,
      showInviterList: false,
      dealform: {
        limit: 10,
        offset: 0
      },
      form: {
        limit: 10,
        offset: 0,
        search: "",
        invite_code: "",
        order_by: "CreateAt DESC",
        certification: 0,
        inviter: "",
        id_num: "",
        address:'',
        // date2: '',
        // delivery: false,
        // type: [],
        // resource: '',
        // desc: ''
      },
      orderbyList: [
        { value: "", label: "默認" },
        { value: "CreateAt DESC", label: "註冊時間 降序" },
        { value: "CreateAt ASC", label: "註冊時間 升序" },
        { value: "Balance DESC", label: "餘額" },
        { value: "Username", label: "用戶帳號" },
        { value: "Nickname", label: "用戶暱稱" }
      ],
      //实名状态列表
      certificationList: [
        { value: 0, label: "全部" },
        { value: 1, label: "已實名" },
        { value: 2, label: "未實名" }
      ],
      coinInfrom: {
        address: "",
        amount: "",
        chain: "",
        symbol: "UONE",
        txId: new Date().getTime().toString()
      },
      tempdata: [],
      user_detail: {},
      user_acountData: [],
      user_coinBalance: [],
      user_futureBalance: [],
      user_deal_tabdata: [],

      coinTradeEditForm: {
        can_trade: false,
        can_withdraw: false,
        can_deposit: false,
        buyer_commission: null,
        seller_commission: null
      },
      currencyEditForm: {
        lock: false,
        transfer_limit: false,
        out_limit: false
      },

      exportform: {
        min: 0,
        max: 0,
        order_by: "CreateAt DESC"
      },
      sendMSGcontent: "",
      coinListdata: [],
      nowUserAcountList: [],
      lock: false,
      row: "",

      /**显示实名认证信息 */
      alertShowData: [],
      /**實名認證信息 彈窗 */
      showRealNameInfo: false,

      /**db树 弹窗 */
      showTree: false
    };
  },
  computed: {
    loginlimit() {}
  },
  methods: {
    /**查看用戶流水 */
    handleToWater(index,row,type){
      switch(type){
        case 0:
          this.$router.push({name:'water_bills',query:{user_id:row.id}});
          break;
        case 1:
          this.$router.push({name:'coinTrade_water',query:{user_id:row.id}});
          break;
        case 2:
          this.$router.push({name:'future_water',query:{user_id:row.id}});
          break;
      }
    },
    onChangeLock(e) {
      // e?this.currencyEditForm.lock = 1:this.currencyEditForm.lock = 0
    },
    // getLabel(item){
    //     if(item.coin_symbol == 'USDT'){
    //         if(item.coin_type == 'TRADE'){
    //             return 'USDT' + '  BTC鏈'
    //         }
    //         else if(item.coin_type == 'OR'){
    //             return 'USDT' + '  ETH鏈'
    //         }
    //     }
    //     else{
    //         return item.coin_symbol
    //     }
    // },

    // 給用戶發送消息
    handleSendMSG(index, row) {
      this.sendMSGshow = true;
      this.row = row;
      this.$refs.customServices.getuserMsgList(row);
    },
    // 顯示導出
    showExport() {
      this.exportExcelModal = true;
    },
    // 導出最大
    handleAllLimit() {
      console.log(this.tableData.total);
      this.exportform.max = Number(this.tableData.total);
    },
    // 確定導出
    async handleSubmitExport() {
      let obj = {
        url: "/api/v2/users",
        data: {
          order_by: this.exportform.order_by,
          offset: this.exportform.min,
          limit: this.exportform.max - this.exportform.min
        }
      };

      let data = await new this.$http(obj).aPost();
      console.log(data);
      this.exportExcel(data.data);
    },
    handleClose() {
      this.exportExcelModal = false;
    },
    exportExcel(tabledata) {
      let _this = this;
      const theader = [
        "用戶ID",
        "用戶帳號",
        "暱稱",
        "郵箱",
        "郵箱驗證",
        "個人邀請碼",
        "交易次數",
        "登入設備",
        "APP版本",
        "註冊時間",
        "余额"
      ];
      const filterVal = [
        "id",
        "username",
        "nickname",
        "email",
        "email_verified",
        "invite_code",
        "transfer_num",
        "device",
        "version",
        "create_at",
        "balance"
      ];

      let formatFunctionList = {
        create_at:function(row){return _this.$files.timestampToTime1(row)},
      }
      new _this.$exportExcel(tabledata?tabledata.list:_this.tableData.list,theader,filterVal,formatFunctionList,'用戶列表');
      this.insertgenerallog();
    },

    getstatus(status) {
      switch (status) {
        case "active":
          return "未付款";
          break;
        case "waiting":
          return "已付款";
          break;
        case "success":
          return "已完成";
          break;
        case "overdue":
          return "已過期";
          break;
        case "cancel":
          return "已取消";
          break;
        case "appeal":
          return "申訴中";
          break;
      }
    },
    onSearch() {
      this.form.offset = 0
      this.getdata();
    },
    onReset(formName) {
      this.resetForm(formName);
      this.getdata();
    },
    resetForm(formName) {
      this.$nextTick(() => {
        this.$refs[formName].resetFields();
      });
    },
    handleChangePage(e) {
      this.form.offset = this.form.limit * (Number(e) - 1);
      this.getdata(e);
    },
    handleChangePageUser(e) {
      this.dealform.offset = this.dealform.limit * (Number(e) - 1);
      this.getUserDealList(this.userindex, this.userrow, e);
    },
    // 跳轉到查看用戶交易訂單
    handleViewDeal(index, row) {
      // this.$router.push({ namer :'deal_manager', query:{uid : row.id}})
      this.userindex = index;
      this.userrow = row;
      this.dialogTableVisible = true;
      let e = 1;
      this.getUserDealList(index, row, e);
    },
    // 查看用戶資產
    handleViewAcount(index, row) {
      this.dialogVisible3 = true;
      this.getAcount(row.id);
    },
    // 查看用戶詳情
    handleView(index, row) {
      this.dialogVisible2 = true;
      this.user_detail = row;
      let obj = {
        url: "/api/v2/user/detail",
        data: {
          user_id: row.id
        }
      };
      new this.$http(obj)
        .aGet()
        .then(res => {
          console.log(res);
          if (res.code == 200) {
            this.user_detail = res.data;
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    // 修改法幣用戶限制
    currencyEdit() {
      let obj = {
        url: "/api/v2/users/update",
        data: {
          user_id: this.row.id,
          lock: this.currencyEditForm.lock,
          transfer_limit: this.currencyEditForm.transfer_limit,
          out_limit: this.currencyEditForm.out_limit
        }
      };
      new this.$http(obj)
        .aPost()
        .then(() => {
          this.$message.success({
            title: "提示",
            message: "修改成功"
          });
          this.dialogVisible = false;
          this.getdata();
        })
        .catch(e => {});
    },

    // 修改幣幣用戶限制
    coinTradeEdit() {
      let obj = {
        url: "/api/v2/users/update/bb_account",
        data: {
          user_id: this.row.id,
          ...this.coinTradeEditForm
        }
      };
      new this.$http(obj)
        .aPost()
        .then(() => {
          this.$message.success({
            title: "提示",
            message: "修改成功"
          });
          this.dialogVisible = false;
          this.getdata();
        })
        .catch(e => {
          console.log(e);
        });
    },
    // 獲取用戶法幣資產
    async getAcount(id) {
      // 法幣資產
      let obj1 = {
        url: "/api/v2/users/assets/" + id
      };

      // 幣幣資產
      let obj2 = {
        url: "/api/v3/balance",
        data: {
          user_id: id,
          limit: 100
        }
      };

      // 幣幣資產
      let obj3 = {
        url: `/api/v6/account/${id}`,
      };
      try {
        let res1 = await new this.$http(obj1).aGet();
        let res2 = await new this.$http(obj2).aPost();
        let res3 = await new this.$http(obj3).aGet();
        this.user_acountData = res1;
        this.user_coinBalance = res2.data.list;
        this.user_futureBalance = res3.data;
      } catch (error) {}
    },

    // 獲取列表數據
    async getdata(val) {
      this.currentPage = val;
      this.form.limit = 10;
      let obj = {
        url: "/api/v2/users",
        data: this.form
      };

      let data = await new this.$http(obj).aPost();
      this.tableData = data.data;
    },
    // 獲取單個用戶交易列表
    async getUserDealList(index, row, val) {
      this.currentPageUser = val;
      this.dealform.limit = 10;
      let obj = {
        url: "/api/v2/deals",
        data: {
          uid: row.id,
          ...this.dealform
        }
      };
      let data = await new this.$http(obj).aPost();
      console.log(data);
      this.user_deal_tabdata = data.data;
    },

    handleEdit(index, row) {
      console.log(index, row);
      let obj = {
        url: "/api/v2/user/detail",
        data: {
          user_id: row.id
        }
      };
      new this.$http(obj)
        .aGet()
        .then(res => {
          console.log(res);
          if (res.code == 200) {
            this.user_detail = res.data;
            // this.row = res.data;
            this.dialogVisible = true;
            this.currencyEditForm.lock =
            this.user_detail.delete_at > 0 ? true : false;
            this.currencyEditForm.transfer_limit = this.user_detail.props.transfer_limit;
            this.currencyEditForm.out_limit = this.user_detail.props.out_limit;

            this.coinTradeEditForm.can_trade = this.user_detail.can_trade;
            this.coinTradeEditForm.can_withdraw = this.user_detail.can_withdraw;
            this.coinTradeEditForm.can_deposit = this.user_detail.can_deposit;
            this.coinTradeEditForm.buyer_commission = this.user_detail.buyer_commission;
            this.coinTradeEditForm.seller_commission = this.user_detail.seller_commission;
            this.row = this.user_detail;
            
          }
        })
        .catch(e => {
          console.log(e);
        });
      
    },
    async handleCoinIn(index, row) {
      // console.log(this.coinInfrom)
      this.dialogVisible1 = true;
      let _this = this;
      let obj = {
        url: "/api/v2/account",
        data: {
          user_id: row.id,
          // type: "TRADE"
          type: "ALL",
          limit: 20
        }
      };
      // 當前點擊用戶的acountL列表 賬戶餘額列表
      let data = await new _this.$http(obj).aPost();
      this.nowUserAcountList = data.data.list;
      console.log(this.nowUserAcountList);
      for (let i in this.nowUserAcountList) {
        if (this.nowUserAcountList[i].coin_symbol === this.coinInfrom.symbol) {
          this.coinInfrom.address = this.nowUserAcountList[i].address;
          this.coinInfrom.chain = this.nowUserAcountList[i].coin_chain;
          this.coinInfrom.txId = "adminweb" + new Date().getTime().toString();
        }
      }
    },

    changeCoinSymbol(id) {
      console.log(id, "@@@@@@@@@@");
      // let coin = this.coinListdata[index];
      let list = this.nowUserAcountList;
      for (let i in list) {
        if (id == list[i].id) {
          this.coinInfrom.address = list[i].address;
          this.coinInfrom.chain = list[i].coin_chain;
          this.coinInfrom.symbol = list[i].coin_symbol;
          this.coinInfrom.txId = "adminweb" + new Date().getTime().toString();
        }
      }
    },

    // 提交充值
    onSubmit() {
      let obj = {
        url: "/api/v2/transfer/deposit",
        data: this.coinInfrom
      };
      new this.$http(obj)
        .aPost()
        .then(res => {
          console.log(res);
          this.coinInfrom.amount = "";
          this.dialogVisible1 = false;
          this.$message.success({
            title: "提示",
            message: "充值成功"
          });
        })
        .catch(e => {
          console.log(e);
        });
    },
    // 修改用戶
    async onSubmitEdit() {
      let obj = {
        url: "/api/v2/users/update",
        data: {
          user_id: this.row.id,
          nick_name: this.row.nick_name
          // lock:true
        }
      };
      try {
        let res = await new this.$http(obj).aPost();
      } catch (err) {
        console.log(err);
      }
    },

    // 發送消息
    async sendMSG() {
      console.log(this.row);
      if (this.sendMSGcontent == "") {
        return false;
      }
      let obj = {
        url: "/api/v2/message/helper",
        data: {
          to: this.row.id,
          message: this.sendMSGcontent
        }
      };
      let res = await new this.$http(obj).aPost();
      if (res.code == 200) {
        this.$notify({
          title: "成功",
          message: "發送消息成功",
          type: "success"
        });
        this.sendMSGshow = false;
        this.sendMSGcontent = "";
      }
    },
    handleShowInviterList(index, row) {
      this.showInviterList = true;
      this.row = row;
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    handlechange(index, row) {
      console.log(index, row);
    },
    //獲取幣種 列表
    getCoinListdata(val) {
      // console.log("//獲取幣種 列表");
      let obj = {
        url: "/api/v2/coin",
        data: {
          limit: 100,
          offset: 0,
          coin_type: "TRADE"
        }
      };
      new this.$http(obj)
        .aPost()
        .then(res => {
          this.coinListdata = res.data.list;
        })
        .catch(e => {});
    },

    getUserDetail(uid) {
      this.form.search = uid;
      this.form.offset = 0;
      this.showInviterList = false;
      this.showTree = false;
      this.getdata();
    },

    /* 显示实名认证信息 */
    handleShowRealNameInfo(index, row) {
      this.alertShowData = row;
      this.showRealNameInfo = !this.showRealNameInfo;
    },

    /**显示组织树 */
    handleShowTree(index, row) {
      this.alertShowData = row;
      this.showTree = !this.showTree;
      // this.$refs.dbtree.getTree(row.user_id)
      this.$refs.dbtree.getNewTree(row.id);
    }
  },
  mounted() {
    let uid = this.$route.query.uid;
    let user_name = this.$route.query.user_name;
    if (uid) {
      // console.log('321321,',uid)
      this.form.search = uid.replace(/perfect/,'');
    }
    if (user_name) {
      this.form.search = user_name;
    }
    this.getdata();
    // this.getCoinListdata();
  }
};
</script>

<style>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 480px;
}
</style>
