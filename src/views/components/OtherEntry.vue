<template>
	<div class="animated fadeIn">
		<Row>
			<Col :md="24" >
				<div class="doc-header">
					<p> 药丸记录 </p>
				</div>
		
				<div style="" class="doc-content">
					<Row :gutter="6">
						<Col span="3">
							<Select v-model="entryType">
								<Option value="药丸">药丸</Option>
							</Select>
						</Col>
      			<Col span="5">
							<Input v-model="entryName" border placeholder="输入名称..."/>
						</Col>
						<Col span="3">
							<Input v-model="entryAmount" @on-focus="focus($event)" border @on-change="changeAmount" placeholder="输入价钱..."/>
						</Col>
						<Col span="4">
							<DatePicker type="date" :options="options" v-model="dateValue" placeholder="选择日期"></DatePicker>
						</Col>
						<Col span="3">
							<Input v-model="entryProfit" @on-focus="focus($event)" border placeholder="利润(默认总价75%)"/>
						</Col>
						<Col span="5">
							<Input v-model="entryComment" placeholder="备注..."/>
						</Col>
						<Col span="1">
						<Button type="success" @click="postToTb">+</Button>
					</Col>
					</Row>
					<br>
					<Row>
      			<Col>
         			<Table :loading="loading" size="small" border :columns="tbCol" :data="tbData"></Table>
							<Page :total="orderCount" :page-size="pageSize" show-total class="paging" @on-change="changepage"></Page>
						</Col>
					</Row>
				</div>
			</Col>
		</Row>
  </div>
</template>
<script>
	import { dateToString } from 'utils/index';
	var globalStatus = {};
	export default {
		data () {
			return {
				entryType: "药丸",
				entryName: "",
				dateValue: "",
				entryAmount: 0.00,
				entryProfit: "",
				entryComment: "",
				loading: false,
				//page
        pageSize: 50,
				orderCount: 0,
				cacheAllOrder: [],
				options: {
					disabledDate (date) {
						return date && (date.valueOf() > Date.now() || date.valueOf() < 1559260800000);
					}
				},
				tbCol: [
					{
						title: '名称',
						key: 'name',
						align: 'center',
						render: (h, params) => {
							return h('div', [
								h('strong', params.row.name)
							]);
						}
					},
					{
						title: '类型',
						key: 'detailType',
						align: 'center'
					},
					{
						title: '价钱',
						key: 'amount',
						align: 'center'
					},
					{
						title: '日期',
						key: 'date',
						align: 'center'
					},
					{
						title: '利润',
						key: 'profit',
						align: 'center'
					},
					{
						title: '备注',
						key: 'comment',
						align: 'center'
					},
					{
						title: '操作',
						key: 'action',
						align: 'center',
						render: (h, params) => {
							if(params.row.editable){
								return h('div', [
									h('Button', {
										props: {
											type: 'success',
											size: 'small'
										},
										style: {
											marginRight: '5px'
										},
										on: {
											click: () => {
												this.handelOut(params.index)
											}
										}
									}, '出库'),
									h('Button', {
										props: {
											type: 'error',
											size: 'small'
										},
										on: {
											click: () => {
												this.remove(params.index)
											}
										}
									}, '删除'),
								]);
							}
						}
					}
				],
				tbData: []
			}
		},

		methods: {
			//select text when get focus
      focus(event) {
				//alert(event.currentTarget);
        event.currentTarget.select();
			},

			postToTb: function(){
				if(this.entryName === ""){
					alert("名称不能是空");
					return;
				}
				if(this.dateValue === ""){
					alert("日期不能是空");
					return;
				}
				this.dateValue = dateToString(this.dateValue);
				let tempObj = {
					"name" : this.entryName,
					"type" : "收入",
					"detailType" : this.entryType,
					"date" : this.dateValue,
					"amount" : this.entryAmount,
					"comment" : this.entryComment,
					"profit" : this.entryProfit,
					"editable" : true
				}
				return new Promise((resolve, reject) => {
          this.$http.post("/othentryapi/addIncome", tempObj).then(
            response => {
            this.$Message.success('添加成功!');
						this.getAll();
						this.entryName = "";
						this.dateValue = "";
						this.entryAmount = 0;
						this.entryComment = "";
            resolve();
          }).catch(error => {
            this.$Message.error('添加失败');
            reject(error);
          });
        });
			},

			remove: function(index) {
        this.$Modal.confirm({
          content: '此操作将永久删除该文件, 是否继续?',
          onOk: ()=>{
            let tempObj = Object.assign({}, this.tbData[index]);
            let deleteId = tempObj['_id'];
            return new Promise((resolve, reject) => {
              this.$http.delete(`/othentryapi/deletIncome/${deleteId}`).then(
                response => {
                  this.$Message.success('删除成功!');
                  this.getAll();
                  resolve();
                }
              ).catch(error => {
                this.$Message.error('删除失败');
                reject(error);
              });
            });
          },
          onCancel: ()=>{
            this.$Message.info('已取消删除');
          }
        });
			},
			
			handelOut: async function(index) {
				let tempObj = Object.assign({}, this.tbData[index]);
				let updatedId = tempObj['_id'];
				let tempDate = tempObj.date;
        let yearIndex = tempDate.split('/')[0];
				let yearAndMonIndex = tempDate.substr(0,7);
				if(tempObj.detailType == "药丸"){
					if(typeof(globalStatus.yearlyIncome[yearIndex]) == 'undefined'){
						globalStatus.yearlyIncome[yearIndex] = (parseFloat(tempObj.amount)).toFixed(2);
					} else{
						let temp = parseFloat(globalStatus.yearlyIncome[yearIndex]) + parseFloat(tempObj.amount);
						globalStatus.yearlyIncome[yearIndex] = temp.toFixed(2);
					}
					if(typeof(globalStatus.monthlyIncome[yearAndMonIndex]) == 'undefined'){
						globalStatus.monthlyIncome[yearAndMonIndex] = (parseFloat(tempObj.amount)).toFixed(2);
					} else{
						let temp = parseFloat(globalStatus.monthlyIncome[yearAndMonIndex]) + parseFloat(tempObj.amount);
						globalStatus.monthlyIncome[yearAndMonIndex] = temp.toFixed(2);
					}
					if(typeof(globalStatus.monthlyProfit[yearAndMonIndex]) == 'undefined'){
            globalStatus.monthlyProfit[yearAndMonIndex] = (tempObj.profit).toFixed(2);
          } else{
            let temp = parseFloat(globalStatus.monthlyProfit[yearAndMonIndex]) + tempObj.profit;
            globalStatus.monthlyProfit[yearAndMonIndex] = temp.toFixed(2);
          }
					let temp = {
						"yearlyIncome": globalStatus.yearlyIncome,
						"monthlyIncome": globalStatus.monthlyIncome,
						"monthlyProfit": globalStatus.monthlyProfit
					};
					let promise1 = new Promise((resolve, reject) => {
          	this.$http.put('/ordapi/updateGlobalStatus', temp)
          	resolve();
        	});
					let result1 = promise1;
					
					let promise2 = new Promise((resolve, reject) => {
            this.$http.put(`/othentryapi/updateEntryStatus/${updatedId}`)
            resolve();
          });
					let result2 = await promise2;
					this.getAll();
				}
			},

			changepage: function(index){
        var _start = ( index - 1 ) * this.pageSize;
        var _end = index * this.pageSize;
        this.tbData = this.cacheAllOrder.slice(_start,_end);
			},
			
			changeAmount: function(){
				this.entryProfit = this.entryAmount * 3 / 4;
			},

			// 获取全部数据
    	getAll: function() {
        this.loading = true;
				return new Promise((resolve, reject) => {
					this.$http.get("/othentryapi/getAllEntry").then(response => {
            this.cacheAllOrder = response.data;
            this.orderCount = this.cacheAllOrder.length;
            if(this.orderCount < this.pageSize){
              this.tbData = this.cacheAllOrder;
            }else{
              this.tbData = this.cacheAllOrder.slice(0, this.pageSize);
            }
            this.loading = false;
						resolve();
					}).catch(error => {
						reject(error);
					});
				});
			},

			getGlobalStatus: function() {
        return new Promise((resolve, reject) => {
          this.$http.get("/ordapi/getGlobalStatus").then(response => {
            globalStatus = response.data;
            if(typeof(globalStatus.yearlyIncome) == 'undefined'){
              globalStatus.yearlyIncome = {};
            }
            if(typeof(response.data.yearlyOutcome) == 'undefined'){
              globalStatus.yearlyOutcome = {};
            }
            if(typeof(globalStatus.monthlyIncome) == 'undefined'){
              globalStatus.monthlyIncome = {};
            }
            if(typeof(globalStatus.monthlyProfit) == 'undefined'){
              globalStatus.monthlyProfit = {};
            }
						resolve();
					}).catch(error => {
						reject(error);
					});
        })
      },
		},

		mounted: function() {
			this.getAll();
			this.getGlobalStatus();
		}
	}
</script>

<style scoped>
  .paging{
    float:right;
    margin-top:10px;
  }
</style>