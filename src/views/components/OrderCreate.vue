<template>
	<div class="animated fadeIn">
		<Row>
			<Col :md="24" >
				<div class="doc-header">
					<RadioGroup v-model="medtype" size="small" @on-change="radioChange">
						<Radio label="免煎药"></Radio>
						<Radio label="草药"></Radio>
						<Radio label="西药"></Radio>
					</RadioGroup>
					<div class="actionMenu">
						<Button type="success" size="small" v-if="deleteNotClick" @click="showPrint">打印</Button>
						<Button type="success" size="small" v-if="deleteNotClick" @click="deleteMed">删除</Button>
						<Button type="success" size="small" v-if="deleteNotClick" @click="postOrdToDbSure">添加</Button>
						<Button type="success" size="small" v-if="!deleteNotClick" @click="deleteCancal">取消</Button>
					</div>
				</div>

				<div style="" class="doc-content">
					<Table height="313" size="small" border :columns="createOrdCol" :data="createOrdData"></Table>
				</div>
			</Col>
		</Row>
		<Row>
			<Col :xs="24" :sm="24" :md="12" :lg="12">
				<div class="emptyTop"> </div>
				<RadioGroup v-model="typeinMode" size="small">
						<Radio label="首字母"></Radio>
						<Radio label="名字"></Radio>
					</RadioGroup>
				<Row :gutter="8">
					<Col span="7">
						<Input v-model="patientName" border placeholder="输入姓名..."/>
					</Col>
					<Col span="3">
						<Input v-model="patientAge" placeholder="年龄..."/>
					</Col>
					<Col span="4">
						<Select v-model="patientSex">
        			<Option value="男">男</Option>
							<Option value="女">女</Option>
    				</Select>
					</Col>
					<Col span="9">
						<Input v-model="patientComment" placeholder="症状..."/>
					</Col>
				</Row>
				<Row :gutter="8">
					<Col span="10">
						<AutoComplete
							v-model="inputMed"
							@on-search="handleSearch"
							placeholder="药品"
							@on-focus="focus($event)"
							@keyup.enter.native="moveFocusToDose"
							@on-select="handleSelect"
							ref="mark1">
							<Option v-for="item in list" :value="item.medname" :key="item._id">{{ item.alias }}    {{item.medname}} </Option>
						</AutoComplete>
					</Col>
					<Col span="8">
						<Input v-model="medComment" v-bind:disabled="dis" placeholder="用法用量..." ref="mark2" @keyup.enter.native="fouceToDose"/>
					</Col>
					<Col span="3">
						<Input v-model="inputDose" placeholder="数量" @on-focus="focus($event)" ref="mark" @keyup.enter.native="postToTb"/>
					</Col>
					<Col span="2">
						<Button type="success" @click="postToTb">+</Button>
					</Col>
				</Row>
			</Col>
			<Col :xs="24" :sm="24" :md="12" :lg="12">
				<Row>
					<Col>
						<Tag type="border" color="primary" class="rightInput" >每付价钱: {{ordTotal}}元</Tag>
					</Col>
				</Row>
				<Row>
					<Col span="24" style="text-align:right">
					  <Input v-model="orderComment" border placeholder="处方备注.." style="width: 44%"/>
						<Input v-model="orderCount"  @on-focus="focus($event)" placeholder="几付" style="width: 15%"/>
						<Input v-model="value9"  style="width: 15%" :readonly="true" placeholder="合计:" />
						<Input v-model="total"  @on-focus="focus($event)" style="width: 15%"/>
					</Col>
				</Row>
				<Col span="22" offset="2">
					<Table border :columns="infoDisplayCol" :data="infoDisplayData"></Table>
				</Col>
			</Col>
    </Row>
		<Modal v-model="printmodal" ok-text="打印" :closable="false" cancel-text="取消" @on-ok="printOrder">
			<div ref="print">
				<h4 style="text-align:center;">处  方</h4>
				<br>
				<hr style="height:1px;border:none;border-top:1px solid #555555;" />
				<Row :gutter="16">
					<Col span="8">
						<p>姓名： {{patientName}}</p>
					</Col>
					<Col span="8">
						<p>性别： {{patientSex}}</p>
					</Col>
					<Col span="8">
						<p>年龄： {{patientAge}}</p>
					</Col>
				</Row>
				<Row>
					<Col span="24">
						<p>症状：{{patientComment}}</p>
					</Col>
				</Row>
				<Row>
					<Col span="24">
						<p>备注：{{orderComment}}</p>
					</Col>
				</Row>
				<hr style="height:1px;border:none;border-top:1px solid #555555;" />
				<template v-if="medtype != '西药'">
					<Row :gutter="8" v-for="item in createOrdData" :key="item.id">
						<Col span="6">
								<div>{{item.medname1}}&nbsp;&nbsp;{{item.count1}}</div>
						</Col>
						<Col span="6">
								<div>{{item.medname2}}&nbsp;&nbsp;{{item.count2}}</div>
						</Col>
						<Col span="6">
								<div>{{item.medname3}}&nbsp;&nbsp;{{item.count3}}</div>
						</Col>
						<Col span="6">
								<div>{{item.medname4}}&nbsp;&nbsp;{{item.count4}}</div>
						</Col>
					</Row>
				</template>
				<template v-else>
					<Row :gutter="8" v-for="item in createOrdData" :key="item.id">
						<Col span="12">
								<div>{{item.medname1}}&nbsp;&nbsp;{{item.count1}}&nbsp;&nbsp;{{item.medComment1}}</div>
						</Col>
						<Col span="12">
								<div>{{item.medname2}}&nbsp;&nbsp;{{item.count2}}&nbsp;&nbsp;{{item.medComment2}}</div>
						</Col>
					</Row>
				</template>
				<br>
				<Row>
					<Col span="6"  offset="18">
						<p>{{orderCount}} 付</p>
					</Col>
				</Row>
				<Row>
					<Col span="6"  offset="18">
						<p>价钱: {{total}}</p>
					</Col>
				</Row>
				<hr style="height:1px;border:none;border-top:1px solid #555555;" />
				<br>
				<Row :gutter="16">
					<Col span="8">
						<p>处方医师： 崔云杰</p>
					</Col>
					<Col span="8"  offset="8">
						<p>日期： {{nowdate}}</p>
					</Col>
				</Row>
  		</div>
    </Modal>
	</div>
</template>

<script>
	var staticCol = [
		{
			title: '名称',
			key: 'medname1',
			align: 'center',
		},
		{
			title: '数量',
			key: 'count1',
			align: 'center'
		},
		{
			title: '名称',
			key: 'medname2',
			align: 'center',
		},
		{
			title: '数量',
			key: 'count2',
			align: 'center'
		},
		{
			title: '名称',
			key: 'medname3',
			align: 'center',
		},
		{
			title: '数量',
			key: 'count3',
			align: 'center'
		},
		{
			title: '名称',
			key: 'medname4',
			align: 'center',
		},
		{
			title: '数量',
			key: 'count4',
			align: 'center'
		},
	]
	export default {
		data () {
			return {
				printmodal: false,
				medtype: '免煎药',
				typeinMode: '首字母',
				deleteNotClick: true,
				patientName: '',
				patientAge: '',
				patientSex: '',
				patientComment: '',
				orderComment: '',
				medComment: '',
				inputMed: '',
				inputDose: '',
				ordTotal: 0,
				ordBaseTotal: 0,
				orderCount: '',
				total: '',			
				list: [],
				value9: '',
				nowdate: this.getNowFormatDate(),
				cacheMedData: [],
				orderMed1PerObj: [],
				dis: true,
				createOrdCol: staticCol,
				xiyaoCol: [
					{
						title: '名称',
						key: 'medname1',
						align: 'center',
					},
					{
						title: '数量',
						key: 'count1',
						align: 'center'
					},
          {
						title: '用量',
						key: 'medComment1',
						align: 'center',
					},
					{
						title: '名称',
						key: 'medname2',
						align: 'center'
					},
          {
						title: '数量',
						key: 'count2',
						align: 'center',
					},
					{
						title: '用量',
						key: 'medComment2',
						align: 'center'
					},
				],
				createOrdData: [],
				infoDisplayCol: [
					{
						title: '库存',
						key: 'inventory',
						align: 'center',
					},
					{
						title: '含量',
						key: 'spec',
						align: 'center'
					},
          {
						title: '单价',
						key: 'unitprice',
						align: 'center',
					},

				],
				infoDisplayData: []

			}
		},
		methods: {
			//select text when get focus
      focus(event) {
				//alert(event.currentTarget);
        event.currentTarget.select();
			},

			//display all the med 4 each line
			disPlayToTb() {
				this.createOrdData = [];
				var emptyStr = "{";
				var carry = 4;
				if(this.medtype == "西药")
					carry = 2;
				for(var i=0; i < this.orderMed1PerObj.length; i++){
					let tempStrName = "medname" + (i%carry+1);
					let tempStrNumber = 'count' + (i%carry+1);
					let tempStrMedComment = 'medComment' + (i%carry+1);
					if(this.medtype == "草药")
						emptyStr = emptyStr + '"' + tempStrName + '":"' + this.orderMed1PerObj[i].medname + '","'  + tempStrNumber + '":"' + parseInt(this.orderMed1PerObj[i].count) + '克",';
					else if(this.medtype == "免煎药")
						emptyStr = emptyStr + '"' + tempStrName + '":"' + this.orderMed1PerObj[i].medname + '","'  + tempStrNumber + '":"' + this.orderMed1PerObj[i].count + '",';
					else if(this.medtype == "西药")
						emptyStr = emptyStr + '"' + tempStrName + '":"' + this.orderMed1PerObj[i].medname + '","'  + tempStrNumber + '":"' + parseInt(this.orderMed1PerObj[i].count) + '盒","' + tempStrMedComment + '":"' + this.orderMed1PerObj[i].medComment + '",';
					if(i>0 && (i+1) % carry == 0){
						emptyStr = emptyStr.substr(0,emptyStr.length-1);
						emptyStr = emptyStr + '}';
						let tempObj = JSON.parse(emptyStr);
						this.createOrdData.push(tempObj);
						emptyStr = "{";
					}
				}
				if( i%carry != 0){
					emptyStr = emptyStr.substr(0,emptyStr.length-1);
					emptyStr = emptyStr + '}';
					let tempObj = JSON.parse(emptyStr);
					this.createOrdData.push(tempObj);
				}
			},

			fouceToDose(){
				this.$refs.mark.$el.querySelector('input').focus();
			},

			moveFocusToDose: function(){
        let searchStr = this.inputMed;
        if(searchStr === ""){
          alert("不能为空");
          return;
        }
        
        //check if it is exist
        let existInDb = this.cacheMedData.find(function(p){
            return p.medname === searchStr;
        });

        if(typeof(existInDb)=="undefined"){
            alert("药品库中没有这种药，请重输");
            return;
				}
				
        //check if already exist in table
        let existInTable = this.orderMed1PerObj.find(function(p){
            return p.medname === searchStr;
        });
        if(typeof(existInTable)!="undefined"){
            alert("不能重复添加药品");
            return;
				}
				
				let tempObj = [{
					"inventory": existInDb.count,
					"spec": existInDb.spec,
					"unitprice": existInDb.sellprice,
				}];
				this.infoDisplayData = tempObj;
				//move focus to input dose
				if(this.medtype != "西药")
					this.$refs.mark.$el.querySelector('input').focus();
				else
					this.$refs.mark2.$el.querySelector('input').focus();
      },

			postToTb () {
				let searchStr = this.inputMed;
        if(searchStr === ""){
          alert("不能为空");
          this.$refs.mark1.$el.querySelector('input').focus();
          return;
				}
				
				if(this.inputDose === "" || this.inputDose === "0"){
          alert("药品数量不能为空");
          this.$refs.mark.$el.querySelector('input').focus();
          return;
        }
        
        //check if it is exist
        let existInDb = this.cacheMedData.find(function(p){
            return p.medname === searchStr;
        });
        if(typeof(existInDb)=="undefined"){
            alert("药品库中没有这种药，请重输");
            this.$refs.mark1.$el.querySelector('input').focus();
            return;
        }

        //check if already exist in table
        let existInTable = this.orderMed1PerObj.find(function(p){
            return p.medname === searchStr;
        });
        if(typeof(existInTable)!="undefined"){
            alert("不能重复添加药品");
            this.$refs.mark1.$el.querySelector('input').focus();
            return;
				}

				if(this.medtype != "草药"){
					if(this.inputDose === '1'){
						alert("注意： 草药" + this.inputMed + "数量是1克")
					}
				}
				
				//update order med cache
				if(this.medtype != "西药"){
					this.orderMed1PerObj.push({
						medname: this.inputMed,
						count: this.inputDose,
						baseprice: existInDb.baseprice,
						sellprice: existInDb.sellprice
					})
				}else{
					this.orderMed1PerObj.push({
						medname: this.inputMed,
						count: this.inputDose,
						medComment: this.medComment,
						baseprice: existInDb.baseprice,
						sellprice: existInDb.sellprice
					})
				}

				this.disPlayToTb();
				if(this.orderCount === '')
          this.orderCount = 1;
				this.$refs.mark1.$el.querySelector('input').focus();
				this.inputDose = 1;
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

			postOrdToDbSure:function() {
				let mydate = this.getNowFormatDate();

				if(this.createOrdData.length == 0){
					this.$Message.warning('订单为空');
					return;
				}

				if(this.patientName == ''){
					this.$Message.warning('姓名不能为空');
					return;
				}

				var addOrd = [{
					patient: this.patientName,
					age: this.patientAge,
					sex: this.patientSex,
					comment: this.patientComment,
					orderComment: this.orderComment,
					orderalias: 'new',
					medType: this.medtype,
					date: mydate,
					med: this.createOrdData,
					dose: this.orderCount,
					total: parseFloat(this.total),
					totalprofit : (parseFloat(this.total) - parseFloat((this.ordBaseTotal * this.orderCount).toFixed(2))).toFixed(2),
          editable: true,
				}];

				return new Promise((resolve, reject) => {
          this.$http.post("/ordapi/order", addOrd).then(response => {
						//clear all value
						this.$Message.success('添加成功!');
						this.patientName = '';
						this.patientAge = '';
						this.patientSex = '男';
						this.patientComment = '';
						this.inputMed = '';
						this.inputDose = "";
						this.ordTotal = 0;
						this.ordBaseTotal = 0;
						this.orderCount = '';
						this.total = '';
						this.createOrdData = [];
						this.orderMed1PerObj = [];
						this.infoDisplayData = [];
						this.$store.dispatch("setOrderToVuex",[]);
            resolve();
          }).catch(error => {
            this.$Message.error('修改失败');
            reject(error);
          });
        });
			},

			
			handleSelect(){
				//not sure why this is needed. But if the focus is not set, the focus will not move. Seems if will select itself first
				this.$refs.mark1.$el.querySelector('input').focus();
			},

			showPrint(){
				this.printmodal = true;
			},

			printOrder: function(){
				this.$print(this.$refs.print);
				this.postOrdToDbSure();
			},

			handleSearch (value) {
				if(value.length < 2){
					this.list = [];
					return;
				}

				let state = this.cacheMedData;
				if(this.typeinMode == '首字母'){
					this.list = state.filter( function (item) {
						return item.alias.indexOf(value) === 0;
						}
					);
				}
				else if(this.typeinMode == '名字'){
					this.list = state.filter( function (item) {
						return item.medname.indexOf(value) != -1;
						}
					);
				}
						
      },

			deleteMed: function(){
				this.deleteNotClick = false;
				//dynamic modify column
				//need to find a better way
				if(this.medtype != "西药"){
					let deleteCol1 = {
						title: '',
						key: 'action',
						width: 30,
						align: 'center',
						render: (h, params) => {
							return h('div', [
								h('Icon', {
									props: {
										type: 'md-trash',
										size: 'small'
									},
									on: {
										click: () => {
											this.remove1(params.index)
										}
									}
								},)
							]);
						}
					};
					this.createOrdCol.splice(2,0,deleteCol1);
					let deleteCol2 = {
						title: '',
						key: 'action',
						width: 30,
						align: 'center',
						render: (h, params) => {
							return h('div', [
								h('Icon', {
									props: {
										type: 'md-trash',
										size: 'small'
									},
									on: {
										click: () => {
											this.remove2(params.index)
										}
									}
								},)
							]);
						}
					};
					this.createOrdCol.splice(5,0,deleteCol2);
					let deleteCol3 = {
						title: '',
						key: 'action',
						width: 30,
						align: 'center',
						render: (h, params) => {
							return h('div', [
								h('Icon', {
									props: {
										type: 'md-trash',
										size: 'small'
									},
									on: {
										click: () => {
											this.remove3(params.index)
										}
									}
								},)
							]);
						}
					};
					this.createOrdCol.splice(8,0,deleteCol3);
					let deleteCol4 = {
						title: '',
						key: 'action',
						width: 30,
						align: 'center',
						render: (h, params) => {
							return h('div', [
								h('Icon', {
									props: {
										type: 'md-trash',
										size: 'small'
									},
									on: {
										click: () => {
											this.remove4(params.index)
										}
									}
								},)
							]);
						}
					};
					this.createOrdCol.splice(11,0,deleteCol4);
				} else{
					let deleteCol1 = {
						title: '',
						key: 'action',
						width: 30,
						align: 'center',
						render: (h, params) => {
							return h('div', [
								h('Icon', {
									props: {
										type: 'md-trash',
										size: 'small'
									},
									on: {
										click: () => {
											this.remove1(params.index)
										}
									}
								},)
							]);
						}
					};
					this.createOrdCol.splice(3,0,deleteCol1);
					let deleteCol2 = {
						title: '',
						key: 'action',
						width: 30,
						align: 'center',
						render: (h, params) => {
							return h('div', [
								h('Icon', {
									props: {
										type: 'md-trash',
										size: 'small'
									},
									on: {
										click: () => {
											this.remove2(params.index)
										}
									}
								},)
							]);
						}
					};
					this.createOrdCol.splice(7,0,deleteCol2);
				}
			},

			deleteCancal: function(){
				this.deleteNotClick = true;
				//restore column
				if(this.medtype != "西药"){
					this.createOrdCol.splice(2,1);
					this.createOrdCol.splice(4,1);
					this.createOrdCol.splice(6,1);
					this.createOrdCol.splice(8,1);
				}else{
					this.createOrdCol.splice(3,1);
					this.createOrdCol.splice(6,1);
				}
			},

			radioChange: function(){
				this.getAll();
				if(this.medtype == "西药"){
					this.dis = false;
					this.createOrdCol = this.xiyaoCol;
				}else{
					this.createOrdCol = staticCol;
					this.dis = true;
				}					
			},
			

			// 获取全部数据
    	getAll: function() {
				return new Promise((resolve, reject) => {
					this.$http.get("/medapi/allmed",{
							params: {
								type : this.medtype
							}
						}).then(response => {
						this.cacheMedData = response.data;
						//alert(JSON.stringify(this.cacheMedData));
						resolve();
					}).catch(error => {
						reject(error);
					});
				});
			},

			unpackOrdVuex: function(ordVuex){
				let tempMed = ordVuex.med;
				this.medtype = ordVuex.medType;
				if(this.medtype == "西药"){
					this.dis = false;
					this.createOrdCol = this.xiyaoCol;
				}else{
					this.createOrdCol = staticCol;
					this.dis = true;
				}
				this.patientName = ordVuex.patient;
				this.patientAge = ordVuex.age;
				this.patientSex = ordVuex.sex;
				this.patientComment = ordVuex.comment;
				this.orderComment = ordVuex.orderComment;
				return new Promise((resolve, reject) => {
					this.$http.get("/medapi/allmed",{
							params: {
								type : this.medtype
							}
						}).then(response => {
							this.cacheMedData = response.data;
							//unpack to orderMed
							for(let item of ordVuex.med) {
								if(typeof(item.medname1) == 'undefined')
									break;
								else{
									var existInDb = this.cacheMedData.find(function(p){
									return p.medname === item.medname1;
									})
									if(typeof(existInDb) != 'undefined'){
										this.orderMed1PerObj.push({
										medname: item.medname1,
										count: item.count1,
										medComment: item.medComment1,
										baseprice: existInDb.baseprice,
										sellprice: existInDb.sellprice
										})
									}
								}
								if(typeof(item.medname2) == 'undefined')
									break;
								else{
									var existInDb = this.cacheMedData.find(function(p){
									return p.medname === item.medname2;
									})
									if(typeof(existInDb) != 'undefined'){
										this.orderMed1PerObj.push({
										medname: item.medname2,
										count: item.count2,
										medComment: item.medComment2,
										baseprice: existInDb.baseprice,
										sellprice: existInDb.sellprice
										})
									}
								}
								if(typeof(item.medname3) == 'undefined')
									break;
								else{
									var existInDb = this.cacheMedData.find(function(p){
									return p.medname === item.medname3;
									})
									if(typeof(existInDb) != 'undefined'){
										this.orderMed1PerObj.push({
										medname: item.medname3,
										count: item.count3,
										baseprice: existInDb.baseprice,
										sellprice: existInDb.sellprice
										})
									}
								}
								if(typeof(item.medname4) == 'undefined')
									break;
								else{
									var existInDb = this.cacheMedData.find(function(p){
									return p.medname === item.medname4;
									})
									if(typeof(existInDb) != 'undefined'){
										this.orderMed1PerObj.push({
										medname: item.medname4,
										count: item.count4,
										baseprice: existInDb.baseprice,
										sellprice: existInDb.sellprice
										})
									}
								}
							}
							this.disPlayToTb();
							this.orderCount = ordVuex.dose;
							resolve();
					}).catch(error => {
						reject(error);
					});
				});		
				
        
				this.orderCount = ordVuex.dose;
			},

			deleteAndDisplay(indexToDel){
        this.orderMed1PerObj.splice(indexToDel,1);
        this.disPlayToTb();
      },

      remove1(index){
        var indexToDel = index * 4 + 0;
        this.deleteAndDisplay(indexToDel);
      },

      remove2(index){
        var indexToDel = index * 4 + 1;
        this.deleteAndDisplay(indexToDel);
      },

      remove3(index){
        var indexToDel = index * 4 + 2;
        this.deleteAndDisplay(indexToDel);
			},
			
			remove4(index){
        var indexToDel = index * 4 + 3;
        this.deleteAndDisplay(indexToDel);
      },

		},

		watch: {
      orderMed1PerObj: function(){
        this.ordBaseTotal = 0;
        this.ordTotal = 0;
        for(let item of this.orderMed1PerObj) {
          let basePriceOfMed = item.baseprice;
          let sellPriceOfMed = item.sellprice;
          let medDose = parseInt(item.count);
          this.ordBaseTotal = parseFloat((this.ordBaseTotal + parseFloat((basePriceOfMed*medDose).toFixed(2))).toFixed(2));
          this.ordTotal = parseFloat((this.ordTotal + parseFloat((sellPriceOfMed*medDose).toFixed(2))).toFixed(2));
          let temp = (this.ordTotal * this.orderCount).toFixed(2);
          temp += ' 元';
          this.total = temp;
        }
      },
      
      orderCount: function(val) {
        if(val != ''){
          this.orderCount = val;
        }
        let temp = (this.ordTotal * this.orderCount).toFixed(2);
        temp += ' 元';
        this.total = temp;
      }, 
		},

		mounted: function() {
			var ordVuex = this.$store.getters.post_order; 
      if(ordVuex.length != 0){
				this.unpackOrdVuex(ordVuex);
			}else{
				this.getAll();
				this.patientSex = "男";
			}
		},

		created:function(e){
    // 主页添加键盘事件,注意,不能直接在焦点事件上添加回车
			var lett=this;
			document.onkeydown=function(e){
				var key=e.keyCode;
				var altKey = e.altKey;
				if(altKey && key==35){
					lett.showPrint();
				}
			}
		},

	}
</script>

<style scoped>
	.doc-header .actionMenu{
		float: right;
	}

	.doc-content{
		margin-bottom:5px;
	}

	.doc-indiv{
		margin-top:5px;margin-bottom:5px;padding:5px;line-height:20px
	}

	.doc-indiv .doc-input2{
		margin-top:9px;

	}

	.rightInput{
		float: right;
	}

	.emptyTop{
		margin-top:7px;
	}

	.tableSum{
		float: right;
		display: flex;
	}

	.ivu-select-item:hover {
    background: #2e8de6;
}

.ivu-select-item-focus{
	background: #2e8de6;
}


</style>