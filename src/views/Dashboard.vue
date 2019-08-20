<template>
  <div class="animated fadeIn">
    <Row >
      <Col :sm="24" :md="8">
        <h3>云杰诊所后台管理</h3>
      </Col>   
            
      <div class="state-info">
        <Icon class="refresh-icon" type="md-refresh" size="24" @click="reCalculateTotal"/>
        <section class="panel">
          <div class="panel-body">
            <div class="summary">
              <span>全年开销</span>
              <h3 class="green-txt">$ {{yearOutcome}}</h3>
            </div>                         
            <div id="expense" class="chart-bar"> <img src="static/img/greenincome.png"></div>
          </div>
        </section>

        <section class="panel">
          <div class="panel-body">                  
            <div class="summary">
              <span>全年收入</span>
              <h3 class="red-txt">$ {{yearIncome}}</h3>
            </div>
            <div id="income" class="chart-bar">
              <img src="static/img/redincome.png">                     
            </div>
          </div>
        </section>          
      </div>           
    </Row>

    <Row  :gutter="16" style="margin-top:45px">
      <Col :xs="24" :sm="12" :md="12" :lg="12">
        <div class="state-overview">
          <Col span="12">                
            <div class="panel purple">
              <div class="symbol">
                <Icon type="clipboard" size="50" color="white"></Icon>
              </div>
              <div  class="state-value">
                <div class="value">
                   {{dayIncome}}
                </div>
                <div class="title">
                    当天收入
                </div>
              </div>
            </div>
          </Col>

          <Col span="12">
            <div  class="panel red">
              <div class="symbol"> 
                <Icon type="pricetags" size="50" color="white"></Icon>
              </div>
              <div  class="state-value">
                <div class="value">
                  {{dayPatient}}
                </div>
                <div class="title">
                  当天病人
                </div>
              </div>
            </div>
          </Col>
        </div>

        <div  class="state-overview">
          <Col span="12" >                
            <div class="panel blue" >
              <div class="symbol">
                <Icon type="cash" size="50" color="white"></Icon>                      
              </div>
              <div  class="state-value">
                <div class="value">
                  {{monthIncome}}
                </div>
                <div class="title">
                  月收入
                </div>
              </div>
            </div>
          </Col>

          <Col span="12" >
            <div class="panel green" >
              <div class="symbol">
                <Icon type="eye" size="50" color="white"></Icon>                      
              </div>
              <div  class="state-value">
                <div class="value">
                  {{monthPatient}}
                </div>
                <div class="title">
                  月病人
                </div>
              </div>
            </div>
          </Col>
        </div>
      </Col>

      <Col  :xs="24" :sm="24"   :md="12" :lg="12" >
        <dash-chart-visitor></dash-chart-visitor>
      </Col>
    </Row>

    <Row :gutter="16" >
      <Col  :xs="24" :sm="24"   :md="24" :lg="24" >
        <dash-chart-large> </dash-chart-large>
      </Col>
    </Row>

    <Row :gutter="16" >
      <Col  :xs="24" :sm="24"   :md="24" :lg="24" >
        <IntroChartPie> </IntroChartPie>
      </Col>
    </Row>

    <Row :gutter="16" >
      <Col  :xs="24" :sm="24"   :md="24" :lg="24" >
        <monthPie> </monthPie>
      </Col>
    </Row>
  </div>
</template>

<script>
import DashChartVisitor from './charts/DashChartVisitor';
import DashChartLarge from './charts/DashChartLarge';
import IntroChartPie from './charts/IntroChartPie';
import monthPie from './charts/monthPie';

export default {
  components:{DashChartVisitor,DashChartLarge,IntroChartPie,monthPie},
  inject: ['reload'],
  name: 'dashboard',
    data () {
      return {
        yearOutcome: 0,
        yearIncome: 0,
        dayIncome: 0,
        dayPatient: 0,
        monthIncome: 0,
        monthPatient: 0,
        oneMonthOrdCacah: []
      }
    },
    methods:{
      test_logout(){
        this.$store.dispatch('LogOut').then(() => {
          this.$router.push({ path: '/login' });
        }).catch(err => {
          this.$message.error(err);
        });
      },

      loadGlobalStatus: function() {
        var date = new Date();
        var yearIndex = date.getFullYear();
        return new Promise((resolve, reject) => {
					this.$http.get("/ordapi/getGlobalStatus").then(response => {
            let dataArray = response.data;
            this.yearIncome = dataArray.yearlyIncome[yearIndex];
            this.yearOutcome = dataArray.yearlyOutcome[yearIndex];
						resolve();
					}).catch(error => {
						reject(error);
					});
				});
      },

      //获取当前时间，格式YYYY-MM-DD
      getNowFormatDate() {
				var date = new Date();
				var seperator1 = "/";
				var year = date.getFullYear();  //年
				var month = date.getMonth() + 1;   //月
				var strDate = date.getDate();   //日
				if (month >= 1 && month <= 9) {
					month = "0" + month;
				}
				if (strDate >= 0 && strDate <= 9) {
					strDate = "0" + strDate;
				}
				var currentdate = year + seperator1 + month + seperator1 + strDate;
				return currentdate;
      },

      loadMonthStatus: function() {
        let monthTotal = 0.00;
        let today = this.getNowFormatDate();
        let todayPatient = 0;
        let todayIncome = 0.00;
        return new Promise((resolve, reject) => {
					this.$http.get("/ordapi/getCurrentMonth").then(response => {
            this.oneMonthOrdCacah = response.data;
            this.monthPatient = this.oneMonthOrdCacah.length;
            for(let item of this.oneMonthOrdCacah) {
              monthTotal = monthTotal + item.total;
              if(item.date == today){
                todayPatient = todayPatient + 1;
                todayIncome = todayIncome + item.total;
              }
            }
            this.$http.get('/othentryapi/getCurrentMonth').then(response => {
              for(let item of response.data){
                monthTotal = monthTotal + item.amount;
                this.monthPatient = this.monthPatient + 1;
                if(item.date == today){
                  if(item.detailType == "药丸"){
                    todayPatient = todayPatient + 1;
                    todayIncome = todayIncome + item.amount;
                  }
                }                
              }
              monthTotal = monthTotal.toFixed(2);
              todayIncome = todayIncome.toFixed(2);
              this.monthIncome = monthTotal;
              this.dayIncome  = todayIncome;
              this.dayPatient = todayPatient;
              resolve();
            })
					}).catch(error => {
            console.log(error);
						reject(error);
					});
				});
      },

      reCalculateTotal:  async function(){
        this.$Notice.open({
          title: '重新修正计算...',
          duration: 2
        });

        let oneStatus = {};
        oneStatus.yearlyIncome = {};
        oneStatus.monthlyIncome = {};
        oneStatus.monthlyProfit = {};
        let promise1 = new Promise((resolve, reject) => {
					this.$http.get("/ordapi/orderall").then(response => {
            for(let item of response.data) {
              let tempDate = item.date;
              let yearIndex = tempDate.split('/')[0];
              let yearAndMonIndex = tempDate.substr(0,7);
              if(typeof(oneStatus.yearlyIncome[yearIndex]) === 'undefined'){
                oneStatus.yearlyIncome[yearIndex] = (item.total).toFixed(2);
              } else{
                let temp = parseFloat(oneStatus.yearlyIncome[yearIndex]) + item.total;
                oneStatus.yearlyIncome[yearIndex] = temp.toFixed(2);
              }
              if(typeof(oneStatus.monthlyIncome[yearAndMonIndex]) == 'undefined'){
                oneStatus.monthlyIncome[yearAndMonIndex] = (item.total).toFixed(2);
              } else{
                let temp = parseFloat(oneStatus.monthlyIncome[yearAndMonIndex]) + item.total;
                oneStatus.monthlyIncome[yearAndMonIndex] = temp.toFixed(2);
              }
              if(typeof(oneStatus.monthlyProfit[yearAndMonIndex]) == 'undefined'){
                oneStatus.monthlyProfit[yearAndMonIndex] = (item.totalprofit).toFixed(2);
              } else{
                let temp = parseFloat(oneStatus.monthlyProfit[yearAndMonIndex]) + item.totalprofit;
                oneStatus.monthlyProfit[yearAndMonIndex] = temp.toFixed(2);
              }
            }
            resolve();
					}).catch(error => {
						reject(error);
					});
        });

        let promise2 = new Promise((resolve, reject) => {
					this.$http.get("/othentryapi/getAllEntry").then(response => {
            for(let item of response.data) {
              let tempDate = item.date;
              let yearIndex = tempDate.split('/')[0];
              let yearAndMonIndex = tempDate.substr(0,7);
              if(typeof(oneStatus.yearlyIncome[yearIndex]) === 'undefined'){
                oneStatus.yearlyIncome[yearIndex] = (item.amount).toFixed(2);
              } else{
                let temp = parseFloat(oneStatus.yearlyIncome[yearIndex]) + item.amount;
                oneStatus.yearlyIncome[yearIndex] = temp.toFixed(2);
              }
              if(typeof(oneStatus.monthlyIncome[yearAndMonIndex]) == 'undefined'){
                oneStatus.monthlyIncome[yearAndMonIndex] = (item.amount).toFixed(2);
              } else{
                let temp = parseFloat(oneStatus.monthlyIncome[yearAndMonIndex]) + item.amount;
                oneStatus.monthlyIncome[yearAndMonIndex] = temp.toFixed(2);
              }
              if(typeof(oneStatus.monthlyProfit[yearAndMonIndex]) == 'undefined'){
                oneStatus.monthlyProfit[yearAndMonIndex] = (item.profit).toFixed(2);
              } else{
                let temp = parseFloat(oneStatus.monthlyProfit[yearAndMonIndex]) + item.profit;
                oneStatus.monthlyProfit[yearAndMonIndex] = temp.toFixed(2);
              }
            }
            resolve();
					}).catch(error => {
						reject(error);
					  });
        });

        let result1 = await promise1;
        let result2 = await promise2;

        let temp = {
          "yearlyIncome": oneStatus.yearlyIncome,
          "monthlyIncome": oneStatus.monthlyIncome,
          "monthlyProfit": oneStatus.monthlyProfit
        }

        return new Promise((resolve, reject) => {
					this.$http.put('/ordapi/updateGlobalStatus', temp).then(response => {
            this.reload();
            resolve();
					}).catch(error => {
						reject(error);
					});
				});
      }
    },

    mounted(){
      const token=this.$store.getters.token;                
      this.$Notice.success({
        title: '欢迎使用',
        desc:  `你的账户权限是 ${token}`,
        duration: 5
      });
      this.loadGlobalStatus();
      this.loadMonthStatus();
    }
}
</script>


<style type="text/css" scoped>
.state-overview{color:#fff}.state-overview .ivu-col{margin-bottom:20px}.state-overview .state-value .value{font-size:18px;font-weight:700;margin-bottom:5px}.state-overview .state-value .title{font-size:14px}.state-value{width:60%;display:inline-block}.symbol{width:35%;display:inline-block}.state-overview .panel{border-radius:4px;padding:25px 20px}.panel.purple{background:#6a8abe;box-shadow:0 5px 0 #5f7cab}.panel.red{background-color:#fc8675;box-shadow:0 5px 0 #e27869}.panel.blue{background:#5ab6df;box-shadow:0 5px 0 #51a3c8}.panel.green{background:#4acacb;box-shadow:0 5px 0 #42b5b6}.dash_income_chart{float:left}.ivu-row{margin-bottom:20px!important}.dash_income{border-radius:4px;background-color:#fff;height:80px;padding:15px}.staff_name{font-weight:900;font-size:16px}.staff_progress{margin-left:10px;width:90%}.staff_progress p{margin:0}.staff_list{border-radius:4px;margin-top:0;height:90px;display:flex;align-items:center}.animated{background-color:#eff0f4}li{margin-bottom:11px;margin-left:10px;margin-right:10px}.num{font-weight:700}.time{font-size:14px;font-weight:700}.content{padding-left:5px}.dashboard_feature{text-align:center}.demo-carousel{height:600px;line-height:200px;text-align:center;color:#fff;font-size:20px;background:#506b9e}.demo-carousel img{height:100%;width:100%}h3,h4,h5{margin:12px}h3{margin-bottom:20px}p{margin:12px}.row-margin-top{margin-top:30px}.state-info{position:absolute;right:15px;top:20px;margin-bottom:30px}.state-info .panel{margin-bottom:20px;float:right;margin-left:15px}.panel{background-color:#fff;border:1px solid transparent;border-radius:4px;-webkit-box-shadow:0 1px 1px rgba(0,0,0,.05);box-shadow:0 1px 1px rgba(0,0,0,.05)}.panel-body{padding:15px}.state-info .panel .summary{float:left;margin-right:20px}.state-info .panel .summary span{color:#49586e;font-size:13px;font-weight:400;text-transform:uppercase;margin-bottom:10px}.state-info .panel .summary h3.red-txt{color:#fc8675}.state-info .panel .summary h3.green-txt{color:#65cea7}.state-info .panel .summary h3{font-size:200%;font-weight:700;line-height:20px;margin:0}.page-heading h3{color:#49586e;font-size:25px;font-size:11%;font-weight:400;margin:10px 0}.chart-bar{float:right;margin-top:5px}.chart-bar img{display:inline-block;width:68px;height:45px;vertical-align:top}@media screen and (max-width:767px){.state-info{position:static;width:100%;margin-top:15px}.state-info .panel{width:100%}}.panel.blue-box{background:none repeat scroll 0 0 #5ab5de;box-shadow:0 5px 0 #51a3c7;color:#fff}.twt-info h3{font-family:'Open Sans',sans-serif;font-size:16px;font-weight:900;margin:10px 0 30px 0;text-align:center}.twt-info p{font-size:18px;line-height:25px;font-style:italic;margin:0 0 20px 0;text-align:center}.twt-info p a{color:#98fdf4}.media:first-child{margin-top:0}.media.usr-info>.pull-left{margin-right:20px;margin-top:10px}.media>.pull-left{margin-right:10px}.pull-left{float:left}.pull-left{float:left!important}.custom-trq-footer{background:none repeat scroll 0 0 #4eb6b7!important;box-shadow:0 5px 0 #46a3a4;color:#fff;border-top:none}.panel-footer{padding:10px 15px;background-color:#f5f5f5;border-top:1px solid #ddd;border-bottom-right-radius:3px;border-bottom-left-radius:3px}.usr-info .thumb{width:80px;height:80px;border-radius:50%;-webkit-border-radius:50%}.usr-info img{vertical-align:middle}.usr-info h4{color:#658585;margin-bottom:0}.media-heading{margin:0 0 5px}.usr-info .media-body span{color:#ea755c;font-size:12px;margin-bottom:20px;display:inline-block}.usr-info .media-body p{color:#b6bcbc}ul.user-states{list-style-type:none;padding:20px 0}ul.user-states li{text-align:center;float:left;width:33%;font-size:18px;margin:0}
</style>