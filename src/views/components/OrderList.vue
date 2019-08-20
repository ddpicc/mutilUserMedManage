<template>
  <div class="animated fadeIn">
		<Row>
			<Col :md="24" >
				<div class="doc-header">
					处方订单
					<div class="actionMenu">
						<Button type="success" size="small" v-if="outerNotClick && searchNotClick" @click="toAdd">添加</Button>
						<Button type="success" size="small" v-if="outerNotClick && searchNotClick" @click="searchPatient">搜索</Button>
						<Button type="success" size="small" v-if="outerNotClick && searchNotClick" @click="outerDb">出库</Button>
						<Button type="success" size="small" :disabled="isDisabled" v-if="!outerNotClick" @click="outerDbSure">出库</Button>
						<Button type="success" size="small" v-if="!outerNotClick || !searchNotClick" @click="outerDbCancal">取消</Button>
					</div>
				</div>

				<div style="" class="doc-content">
					<Table :loading="loading" size="small" border ref="selectionTB" :columns="orderCol" :data="orderData" @on-selection-change="handleSelectChange"></Table>
          <Page :total="orderCount" :page-size="pageSize" show-total class="paging" @on-change="changepage"></Page>
          <Button size="small" class="loadAllBtn" @click="load_all">读取所有处方</Button>
				</div>
			</Col>
		</Row>

    <Modal v-model="searchVisible" :closable="false" ok-text="搜索"
        cancel-text="取消" @on-ok="searchHandler">
      <div style="text-align:center">
        <Row>
          <Col :md="24">
            <Input v-model="searchPatientName" placeholder="名称"></Input>
          </Col>
        </Row>
      </div>
    </Modal>

    <Modal v-model="adhocVisible" :closable="false" ok-text="添加"
        cancel-text="取消" @on-ok="addHandler" @on-cancel="cancelHandler">
      <p slot="header" style="color:#f60;text-align:center">
          <span>添加临时收入/支出</span>
      </p>
      <Form :model="formAddAdhoc" :rules="ruleValidate" :label-width="60">
        <FormItem label="名称"  prop="patient">
            <Input v-model="formAddAdhoc.patient"></Input>
        </FormItem>
        <FormItem label="详情"  prop="comment">
            <Input v-model="formAddAdhoc.comment"></Input>
        </FormItem>
        <FormItem label="类型">
            <RadioGroup v-model="formAddAdhoc.type">
                <Radio label="收入"></Radio>
                <Radio label="支出"></Radio>
            </RadioGroup>
        </FormItem>
        <Row  :gutter="16">
          <Col span="8">
            <FormItem label="价钱"  prop="total">
                <Input v-model="formAddAdhoc.total"></Input> 
            </FormItem>
          </Col>
          <Col span="16">
            <FormItem label="日期" prop="date">
              <DatePicker type="date" placeholder="Select date" v-model="formAddAdhoc.date"></DatePicker>
            </FormItem>
          </col>
        </Row>
      </Form>
    </Modal>
  </div>
</template>

<script>
  import orderExpandRow from './OrderExpand.vue';
  import { resolve } from 'url';
  import { dateToString } from 'utils/index';
  var globalStatus = {};
	export default {
    components: { orderExpandRow },
		data () {
			return {
        outerNotClick: true,
        isDisabled: true,
        searchNotClick: true,
        searchVisible: false,
        adhocVisible: false,
        searchPatientName: '',
        loading: false,
        //page
        pageSize: 100,
        orderCount: 0,
				orderCol: [
          {
            type: 'expand',
            width: 20,
            render: (h, params) => {
              return h(orderExpandRow, {
                props: {
                  row: params.row
                }
              })
            }
          },
					{
						type: 'index',
						width: 53,
            align: 'center'
          },
					{
						title: '名字',
						key: 'patient',
						align: 'center',
          },
          {
						title: '类型',
						key: 'medType',
						align: 'center',
					},
					{
						title: '数量',
						key: 'dose',
						align: 'center'
					},
					{
						title: '总价',
						key: 'total',
						align: 'center'
					},
					{
						title: '日期',
						key: 'date',
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
                      type: 'error',
                      size: 'small'
                    },
                      on: {
                        click: () => {
                          this.remove(params.index)
                        }
                      }
                    }, '删除')
                ]);
              }else{
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'success',
                      size: 'small'
                    },
                      on: {
                        click: () => {
                          this.reUes(params.row)
                        }
                      }
                    }, '重用')
                ]);
              }
						}
					}
				],
        orderData: [],
        cacheAllOrder: [],
        cacheSelectedRow: [],
        formAddAdhoc:{
          patient: '',
          comment: '',
          type: '支出',
          total: 0
        },
        ruleValidate: {
          patient: [
            { required: true, message: 'The name cannot be empty', trigger: 'blur' }
          ],
          date: [
            { required: true, type: 'date', message: 'Please select the date', trigger: 'change' }
          ]
        }
			}
		},
		methods: {
      //删除一个没有出库的订单
			remove (index) {
        this.$Modal.confirm({
          content: '此操作将永久删除该处方, 是否继续?',
          onOk: ()=>{
            let tempObj = Object.assign({}, this.orderData[index]);
            let deleteId = tempObj['_id'];
            return new Promise((resolve, reject) => {
              this.$http.delete(`/ordapi/order/${deleteId}`).then(
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

      handleSelectChange: function(selection){
        if(selection.length == 0){
          this.isDisabled = true;}
        else{
          this.isDisabled = false;}
        this.cacheSelectedRow = selection;
      },

			toAdd () {
        this.adhocVisible = true;
      },
      
      
      addHandler: function(){
        //alert(dateToString(this.formAddAdhoc.date));
        this.formAddAdhoc.date = dateToString(this.formAddAdhoc.date);
        return new Promise((resolve, reject) => {
          this.$http.post("/ordapi/adhoc", this.formAddAdhoc).then(
            response => {
            this.adhocVisible = false;
            this.$Message.success('添加成功!');
            let tempDate = this.formAddAdhoc.date;
            let yearIndex = tempDate.split('/')[0];
            let yearAndMonIndex = tempDate.substr(0,7);
            var promise3;
            if(this.formAddAdhoc.type == "收入"){
              if(typeof(globalStatus.yearlyIncome[yearIndex]) == 'undefined'){
                globalStatus.yearlyIncome[yearIndex] = (parseFloat(this.formAddAdhoc.total)).toFixed(2);
              } else{
                let temp = parseFloat(globalStatus.yearlyIncome[yearIndex]) + parseFloat(this.formAddAdhoc.total);
                globalStatus.yearlyIncome[yearIndex] = temp.toFixed(2);
              }
              let temp = {"yearlyIncome": globalStatus.yearlyIncome };
              promise3 = new Promise((resolve, reject) => {
                this.$http.put('/ordapi/updateAdhocIncome', temp);
                resolve();
              });
            }else if(this.formAddAdhoc.type == "支出"){
              if(typeof(globalStatus.yearlyOutcome[yearIndex]) == 'undefined'){
                globalStatus.yearlyOutcome[yearIndex] = (parseFloat(this.formAddAdhoc.total)).toFixed(2);
              } else{
                let temp = parseFloat(globalStatus.yearlyOutcome[yearIndex]) + parseFloat(this.formAddAdhoc.total);
                globalStatus.yearlyOutcome[yearIndex] = temp.toFixed(2);
              }
              let temp = {"yearlyOutcome": globalStatus.yearlyOutcome };
              promise3 = new Promise((resolve, reject) => {
                this.$http.put('/ordapi/updateAdhocOutcome', temp);
                resolve();
              });
            }
            let result3 = promise3;
            this.getAll();
            this.clesrFormAddAdhoc();
            resolve();
          }).catch(error => {
            this.$Message.error('添加失败');
            reject(error);
          });
        });

      },

      clesrFormAddAdhoc: function(){
        this.formAddAdhoc.patient = '';
        this.formAddAdhoc.comment = '';
        this.formAddAdhoc.total = 0;
      },

      cancelHandler: function(){
        this.clesrFormAddAdhoc();
      },

      //display select column and enable selection
			outerDb: function(){
        //change index column to selection column
				let objCol = {
          type: 'selection',
          width: 40,
          align: 'center'
				};
				this.orderCol.splice(1,1,objCol);
        this.outerNotClick = false;
        
        //update table
        let editableOrder = this.cacheAllOrder.filter((item) => item.editable == true);
        this.orderData = editableOrder;
      },

      reUes: function(row) {
        let tempOrder = {
          med: row.med,
          patient: row.patient,
          age: row.age,
          sex: row.sex,
          medType: row.medType,
          comment: row.comment,
          orderComment: row.orderComment,
          dose: row.dose,
          total: row.total,
          totalprofit: row.totalprofit
        }
        this.$store.dispatch("setOrderToVuex",tempOrder);
        this.$router.push({path: '/orderCreate'});
      },

      //need to divide them
      updateOrdMedandStatus: async function() {
        this.loading = true;
        for(let item of this.cacheSelectedRow){
          let temp = {
            medary: item.med,
            dose: item.dose,
            medtype: item.medType
          }
          let promise1 = new Promise((resolve, reject) => {
            this.$http.put('/ordapi/updateOrdMed', temp).then(response => {
              resolve();
            }).catch(error => {
              //reject(error);
            });
          });

          let result1 = promise1;
          let promise2 = new Promise((resolve, reject) => {
            this.$http.put(`/ordapi/updateOrdstatus/${item._id}`)
            resolve();
          });
          //let result2 = await promise2;

          let tempDate = item.date;
          let yearIndex = tempDate.split('/')[0];
          let yearAndMonIndex = tempDate.substr(0,7);
          //alert(JSON.stringify(globalStatus.yearlyIncome));
          if(typeof(globalStatus.yearlyIncome[yearIndex]) == 'undefined'){
            globalStatus.yearlyIncome[yearIndex] = (item.total).toFixed(2);
          } else{
            let temp = parseFloat(globalStatus.yearlyIncome[yearIndex]) + item.total;
            globalStatus.yearlyIncome[yearIndex] = temp.toFixed(2);
          }
          if(typeof(globalStatus.monthlyIncome[yearAndMonIndex]) == 'undefined'){
            globalStatus.monthlyIncome[yearAndMonIndex] = (item.total).toFixed(2);
          } else{
            let temp = parseFloat(globalStatus.monthlyIncome[yearAndMonIndex]) + item.total;
            globalStatus.monthlyIncome[yearAndMonIndex] = temp.toFixed(2);
          }
          if(typeof(globalStatus.monthlyProfit[yearAndMonIndex]) == 'undefined'){
            globalStatus.monthlyProfit[yearAndMonIndex] = (item.totalprofit).toFixed(2);
          } else{
            let temp = parseFloat(globalStatus.monthlyProfit[yearAndMonIndex]) + item.totalprofit;
            globalStatus.monthlyProfit[yearAndMonIndex] = temp.toFixed(2);
          }
        }
        //alert(JSON.stringify(globalStatus.yearlyIncome));
        let temp = {
          "yearlyIncome": globalStatus.yearlyIncome,
          "monthlyIncome": globalStatus.monthlyIncome,
          "monthlyProfit": globalStatus.monthlyProfit
        }
        let promise3 = new Promise((resolve, reject) => {
          this.$http.put('/ordapi/updateGlobalStatus', temp)
          resolve();
        });
        //let result3 = promise3;
        
        let promise4 = new Promise((resolve, reject) => {
					this.$http.get("/ordapi/order").then(response => {
            this.cacheAllOrder = response.data;
            let editableOrder = this.cacheAllOrder.filter((item) => item.editable == true);
            this.orderData = editableOrder;
            this.loading = false;
						resolve();
					}).catch(error => {
						reject(error);
					});
        });
        //let result4 = promise4;
      },

			outerDbSure: function(){
        //alert(JSON.stringify(this.cacheSelectedRow));
        this.updateOrdMedandStatus();
			},

			outerDbCancal: function(){
        if(!this.outerNotClick){
          let objCol = {
            type: 'index',
            width: 40,
            align: 'center'
          };
          this.orderCol.splice(1,1,objCol);
          this.outerNotClick = true;
          //clear selection
          this.$refs.selectionTB.selectAll(false);
        } else{
          this.searchNotClick = true;
          this.searchPatientName = '';
        }
        this.orderCount = this.cacheAllOrder.length;
        if(this.orderCount < this.pageSize){
          this.orderData = this.cacheAllOrder;
        }else{
          this.orderData = this.cacheAllOrder.slice(0, this.pageSize);
        }
      },

      searchPatient: function(){
        this.searchNotClick = false;
        this.searchVisible = true;

      },

      searchHandler: function(){
        let searchStr = this.searchPatientName;
        this.orderData = this.cacheAllOrder.filter( function (item) {
  				return item.patient.indexOf(searchStr) != -1;;
					}
        );
      },

      radioChange: function(){
        this.getAll();
      },

    // 获取全部order数据  
      load_all: function(){
        this.loading = true;
        return new Promise((resolve, reject) => {
					this.$http.get("/ordapi/orderall").then(response => {
            this.cacheAllOrder = response.data;
            this.orderCount = this.cacheAllOrder.length;
            if(this.orderCount < this.pageSize){
              this.orderData = this.cacheAllOrder;
            }else{
              this.orderData = this.cacheAllOrder.slice(0, this.pageSize);
            }
            this.loading = false;
						resolve();
					}).catch(error => {
						reject(error);
					});
				});
      },
    
    // 获取order数据，只取前1000个
    	getAll: function() {
        this.loading = true;
				return new Promise((resolve, reject) => {
					this.$http.get("/ordapi/order").then(response => {
            this.cacheAllOrder = response.data;
            this.orderCount = this.cacheAllOrder.length;
            if(this.orderCount < this.pageSize){
              this.orderData = this.cacheAllOrder;
            }else{
              this.orderData = this.cacheAllOrder.slice(0, this.pageSize);
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

      changepage: function(index){
        var _start = ( index - 1 ) * this.pageSize;
        var _end = index * this.pageSize;
        this.orderData = this.cacheAllOrder.slice(_start,_end);
      }
    },

    mounted: function() {
      this.getAll();
      this.getGlobalStatus();
		}
	}
</script>

<style scoped>
	.doc-header .actionMenu{
		float: right;
	}

  .paging{
    float:right;
    margin-top:10px;
  }

  .loadAllBtn{
    margin-top: 13px;
  }

</style>
								


