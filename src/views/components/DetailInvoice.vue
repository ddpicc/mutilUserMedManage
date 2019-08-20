<template>
	<div class="animated fadeIn">
		<Row>
			<Col :md="24" >
				<div class="doc-header">
					详细统计
					<div class="actionMenu">
						<Button type="success" size="small" @click="actionGenerate">生成</Button>
						<Button type="success" size="small" @click="startPrint">打印</Button>
					</div>
				</div>
		
				<div style="" class="doc-content">
					<Row  :gutter="16">
      			<Col :xs="24" :sm="24" :md="24" :lg="24">
         			<DatePicker v-model="dateRange" split-panels type="daterange" :options="options3" size="large" placement="bottom-end" placeholder="选择日期" style="width: 100%"></DatePicker>
								<Card>
        					<div  ref="print" v-if="reportDisplay">
            				<h4 style="text-align:center">{{startDay}} --- {{endDay}} 详情</h4>
										<br>
										<br>
										  <ul>
												<li><div class="list-nap1">总收入</div><div class="list-line"></div><div class="list-con1">{{totalIncome}}元</div></li>
												<li><div class="list-nap1">总利润</div><div class="list-line"></div><div class="list-con1">{{totalProfit}}元</div></li>
												<Divider>收&nbsp;&nbsp;&nbsp;&nbsp;入</Divider>
												<li><div class="list-nap1">草药</div><div class="list-line"></div><div class="list-con1">{{incomeCaoyao}}元</div></li>
												<li><div class="list-nap1">免煎药</div><div class="list-line"></div><div class="list-con1">{{incomeMianjian}}元</div></li>
												<li><div class="list-nap1">西药</div><div class="list-line"></div><div class="list-con1">{{incomeXiyao}}元</div></li>
												<li><div class="list-nap1">药丸</div><div class="list-line"></div><div class="list-con1">{{incomeYaowan}}元</div></li>
												<li><div class="list-nap1">收入合计</div><div class="list-line"></div><div class="list-con1">{{totalIncome}}元</div></li>
												<li><div class="list-nap1">平均每天</div><div class="list-line"></div><div class="list-con1">{{averageIncome}}元</div></li>
												<Divider>利&nbsp;&nbsp;&nbsp;&nbsp;润</Divider>
												<li><div class="list-nap1">草药</div><div class="list-line"></div><div class="list-con1">{{profitCaoyao}}元</div></li>
												<li><div class="list-nap1">免煎药</div><div class="list-line"></div><div class="list-con1">{{profitMianjian}}元</div></li>
												<li><div class="list-nap1">西药</div><div class="list-line"></div><div class="list-con1">{{profitXiyao}}元</div></li>
												<li><div class="list-nap1">药丸</div><div class="list-line"></div><div class="list-con1">{{profitYaowan}}元</div></li>
												<li><div class="list-nap1">利润合计</div><div class="list-line"></div><div class="list-con1">{{totalProfit}}元</div></li>
												<li><div class="list-nap1">平均每天</div><div class="list-line"></div><div class="list-con1">{{averageProfit}}元</div></li>
												<Divider>病&nbsp;&nbsp;&nbsp;&nbsp;人</Divider>
												<li><div class="list-nap1">总计</div><div class="list-line"></div><div class="list-con1">{{totalPatient}}人</div></li>
												<li><div class="list-nap1">平均每天</div><div class="list-line"></div><div class="list-con1">{{averagePatient}}人</div></li>
												<li><div class="list-nap1">小于20岁</div><div class="list-line"></div><div class="list-con1">{{gt20Patient}}人</div></li>
												<li><div class="list-nap1">大于20岁</div><div class="list-line"></div><div class="list-con1">{{lt20Patient}}人</div></li>
												<Divider>其&nbsp;&nbsp;&nbsp;&nbsp;它</Divider>
												<li><div class="list-nap1">煎药付数</div><div class="list-line"></div><div class="list-con1">{{jianyaoTimes}}付</div></li>
    									</ul>
        					</div>
    						</Card>
						</Col>
					</Row>
				</div>
			</Col>
		</Row>
  </div>
</template>
<script>
    export default {
      data () {
				return {
					dateRange: '',
					startDay: '',
					endDay: '',
					reportDisplay: false,
					options3: {
						disabledDate (date) {
							return date && (date.valueOf() > Date.now() || date.valueOf() < 1559260800000);
						}
					},
					totalIncome: 0,
					totalProfit: 0,
					averageIncome: 0,
					averageProfit: 0,
					//收入
					incomeMianjian: 0,
					incomeCaoyao: 0,
					incomeXiyao: 0,
					incomeYaowan: 0,
					//利润
					profitMianjian: 0,
					profitCaoyao: 0,
					profitXiyao: 0,
					profitYaowan: 0,
					//病人
					totalPatient: 0,
					averagePatient: 0,
					gt20Patient: 0,
					lt20Patient: 0,
					//其它
					jianyaoTimes: 0,

				}
			},

			methods: {
				actionGenerate: function(){
					this.reportDisplay = true;
					var tempMon = this.dateRange[0].getMonth()+1;
					if(tempMon < 10)
						tempMon = '0' + tempMon;
					var tempYear = this.dateRange[0].getFullYear();
					var tempDay = this.dateRange[0].getDate();
					if(tempDay < 10)
						tempDay = '0' + tempDay;
					var start = tempYear + '/' + tempMon + '/' + tempDay;
					//alert(start);

					tempMon = this.dateRange[1].getMonth()+1;
					if(tempMon < 10)
						tempMon = '0' + tempMon;
					tempYear = this.dateRange[1].getFullYear();
					tempDay = this.dateRange[1].getDate();
					if(tempDay < 10)
						tempDay = '0' + tempDay;
					var end = tempYear + '/' + tempMon + '/' + tempDay;
					//alert(end);
					var range = {
						startDate: start,
						endDate: end,
					};
					this.startDay = start;
					this.endDay = end;
					var orderObj = [];
					var otherEntryObj = [];
					let days = 0;
					days = (this.dateRange[1] - this.dateRange[0]) / (1000*3600*24) + 1;
					this.$http.get("/ordapi/getOrderStatement", {params:range})
					.then(
						function(response) {
							orderObj = response.data;
							this.$http.get("/othentryapi/getOtherEntryRange", {params:range}).then(response => {
								otherEntryObj = response.data;
								this.calculateAndAnalysis(orderObj, otherEntryObj, days);
							})							
						}
					);
				},

				calculateAndAnalysis: function(orderObj,otherEntryObj,days){
					//alert(orderObj.length);
					//alert(otherEntryObj.length);
					let _totalIncome = 0, _totalProfit = 0, _averageIncome = 0, _averageProfit = 0;
					let _incomeMianjian = 0, _incomeXiyao = 0, _incomeYaowan = 0, _incomeCaoyao = 0;
					let _profitMianjian = 0, _profitXiyao = 0, _profitYaowan = 0, _profitCaoyao = 0;
					let _taotalPatient = 0, _averagePatient = 0, _gt20Patient = 0, _lt20Patient = 0;
					let _jianyaoTimes = 0;
					for(let item of orderObj){
						if(item.medType == "免煎药"){
							_incomeMianjian = parseFloat((_incomeMianjian + item.total).toFixed(2));
							_profitMianjian = parseFloat((_profitMianjian + item.totalprofit).toFixed(2));
						} 
						else if(item.medType == "草药"){
							_incomeCaoyao = parseFloat((_incomeCaoyao + item.total).toFixed(2));
							_profitCaoyao = parseFloat((_profitCaoyao + item.totalprofit).toFixed(2));
						}
						else if(item.medType == "西药"){
							_incomeXiyao = parseFloat((_incomeXiyao + item.total).toFixed(2));
							_profitXiyao = parseFloat((_profitXiyao + item.totalprofit).toFixed(2));
						}
						_totalIncome = parseFloat((_totalIncome + item.total).toFixed(2));
						_totalProfit = parseFloat((_totalProfit + item.totalprofit).toFixed(2));
						_taotalPatient = _taotalPatient + 1;
						
						if(parseInt(item.age) > 20){
							_gt20Patient = _gt20Patient + 1;
						}else{
							_lt20Patient = _lt20Patient + 1;
						}
						let searchStr = JSON.stringify(item.med);
						if(searchStr.indexOf('煎药') != -1){
							_jianyaoTimes = _jianyaoTimes + item.dose;
						}
					}

					for(let item of otherEntryObj){
						if(item.detailType == "药丸"){
							_incomeYaowan = parseFloat((_incomeYaowan + item.amount).toFixed(2));
							_profitYaowan = parseFloat((_profitYaowan + item.profit).toFixed(2));
						}
						_totalIncome = parseFloat((_totalIncome + item.amount).toFixed(2));
						_totalProfit = parseFloat((_totalProfit + item.profit).toFixed(2));
						_taotalPatient = _taotalPatient + 1;

					}
					_averageIncome = parseFloat((_totalIncome / days).toFixed(2));
					_averageProfit = parseFloat((_totalProfit / days).toFixed(2));
					_averagePatient = parseFloat((_taotalPatient / days).toFixed(2));
					//赋值
					this.totalIncome = _totalIncome;
					this.totalProfit = _totalProfit;
					this.averageIncome = _averageIncome;
					this.averageProfit = _averageProfit;
					//收入
					this.incomeMianjian = _incomeMianjian;
					this.incomeCaoyao = _incomeCaoyao;
					this.incomeXiyao = _incomeXiyao;
					this.incomeYaowan = _incomeYaowan;
					//利润
					this.profitMianjian = _profitMianjian;
					this.profitCaoyao = _profitCaoyao;
					this.profitXiyao = _profitXiyao;
					this.profitYaowan = _profitYaowan;
					//病人
					this.totalPatient = _taotalPatient;
					this.averagePatient = _averagePatient;
					this.gt20Patient = _gt20Patient;
					this.lt20Patient = _lt20Patient;
					//其它
					this.jianyaoTimes = _jianyaoTimes;


				},

				startPrint: function(){
					this.$print(this.$refs.print);
				}
			}
    }
</script>

<style scoped>
	.doc-header .actionMenu{
		float: right;
	}
  ul li div{display:inline-block;padding-left: 10px;}
  .list-line{border-top:1px solid #d8d8d8;top:11px;margin: 0 5px;width: 90%;}
  .list-con1{ position: absolute;right: 0px;padding: 0 5px;z-index: 100;text-align: right;background: #fff;padding-right: 10px;}



</style>