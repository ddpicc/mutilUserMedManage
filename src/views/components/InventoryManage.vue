<template>
	<div class="animated fadeIn">
		<Row>
			<Col :md="24" >
				<div class="doc-header">
					<p> 状态 --------    定时任务每天晚上0点运行 </p>
				</div>

				<div style="" class="doc-content">
					<Collapse v-model="value1">
        		<Panel name="1">
            	检查免煎药 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;例如滑块在1，返回少于1盒的药材
							<div slot='content'>
								<Row>
        					<Col span="18">
										<Slider v-model="mianjianV" :min=0 :max=8></Slider>
        					</Col>
        					<Col span="6">
										<Button type="success" size="large" class="pannelInline" @click="checkMianjian">检查</Button>
        					</Col>
								</Row>
								<br>
								<Table size="small" border :columns="colMianjian" :data="dataMianjian"></Table>								
							</div>
        		</Panel>
						<Panel name="2">
            	检查草药
							<div slot='content'>
            		<Row>
        					<Col span="18">
										<Slider v-model="caoyaoV" :min=300 :max=1000 :step=100></Slider>
        					</Col>
        					<Col span="6">
										<Button type="success" size="large" class="pannelInline"  @click="checkCaoyao">检查</Button>
        					</Col>
								</Row>
								<br>
								<Table size="small" border :columns="colCaoyao" :data="dataCaoyao"></Table>				
							</div>
        		</Panel>
						<Panel name="3">
            	检查其他
							<div slot='content'>
            		<Row>
        					<Col span="18">
										<Slider v-model="value4" :min=0 :max=3></Slider>
        					</Col>
        					<Col span="6">
										<Button type="success" size="large" class="pannelInline">检查</Button>
        					</Col>
								</Row>
								<br>
								<Table size="small" border :columns="columns3" :data="data3"></Table>					
							</div>
        		</Panel>
        		<Panel name="4">
            	定时任务监测列表
							<div slot='content'>
								<Tabs v-model="tabsValue">
        					<TabPane label="免煎药" name="name1">
										<Tag type="dot" color="success" v-for="item in count" :key="item" :name="item" closable @on-close="handleClose2">{{ item }}</Tag>
										<AutoComplete
											v-model="inputMed"
											@on-search="handleSearch"
											placeholder="input here"
											@on-focus="focus($event)"
											ref="mark1"
											style="width:15%">
											<Option v-for="item in list" :value="item.medname" :key="item._id">{{ item.alias }}    {{item.medname}} </Option>
										</AutoComplete>
										<Button icon="ios-add" @click="handleAdd"></Button>
									</TabPane>
									<TabPane label="草药" name="name2">标签二的内容</TabPane>
									<TabPane label="其他" name="name3">标签三的内容</TabPane>
								</Tabs>
							</div>
        		</Panel>
    			</Collapse>
				</div>
			</Col>
		</Row>
	</div>
</template>
<script>
		var cacheList = [];
    export default {
      data () {
				return {
					count: [],
					value1: '1',
					mianjianV: 1,
					caoyaoV: 500,
					value4: 2,
					tabsValue: "name2",
					inputMed: '',
					colMianjian: [
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
					],
					dataMianjian: [],
					colCaoyao: [
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
					],
					dataCaoyao: [],
					columns3: [],
					data3: [],
					list: []
				}
      },
			methods: {
				focus(event) {
				//alert(event.currentTarget);
        event.currentTarget.select();
				},

				handleAdd () {
					if(this.count.indexOf(this.inputMed) === -1)
						this.count.push(this.inputMed);
				},

				handleClose2 (event, name) {
					const index = this.count.indexOf(name);
					this.count.splice(index, 1);
				},

				handleSearch: function() {

				},

				checkMianjian: function() {
					return new Promise((resolve, reject) => {
						this.$http.get("/medapi/allmed",{
							params: {
								type : '免煎药'
							}
						}).then(response => {
							for(let item of response.data){
                let boxCount = Math.floor(item.count /  item.bagperbox);
                console.log(item.medname + ":" + boxCount);
								if(boxCount <= this.mianjianV)
									cacheList.push(item);
							}
							this.dataMianjian = [];
							var emptyStr = "{";
							var carry = 4;
							for(var i=0; i < cacheList.length; i++){
								let tempStrName = "medname" + (i%4+1);
								let tempStrNumber = 'count' + (i%4+1);
								emptyStr = emptyStr + '"' + tempStrName + '":"' + cacheList[i].medname + '","'  + tempStrNumber + '":"' + cacheList[i].count + '",';
								if(i>0 && (i+1) % 4 == 0){
									emptyStr = emptyStr.substr(0,emptyStr.length-1);
									emptyStr = emptyStr + '}';
									let tempObj = JSON.parse(emptyStr);
									this.dataMianjian.push(tempObj);
									emptyStr = "{";
								}
							}
							if( i%4 != 0){
								emptyStr = emptyStr.substr(0,emptyStr.length-1);
								emptyStr = emptyStr + '}';
								let tempObj = JSON.parse(emptyStr);
								this.dataMianjian.push(tempObj);
							}
						}).catch(error => {
							reject(error);
						});
					})
				},

				checkCaoyao: function() {
					return new Promise((resolve, reject) => {
						this.$http.get('/medapi/checkCaoyao', {
							params: {
								count : this.caoyaoV
							}
						}).then(response => {
							cacheList = response.data;
							this.dataCaoyao = [];
							var emptyStr = "{";
							var carry = 4;
							for(var i=0; i < cacheList.length; i++){
								let tempStrName = "medname" + (i%4+1);
								let tempStrNumber = 'count' + (i%4+1);
								emptyStr = emptyStr + '"' + tempStrName + '":"' + cacheList[i].medname + '","'  + tempStrNumber + '":"' + cacheList[i].count + '",';
								if(i>0 && (i+1) % 4 == 0){
									emptyStr = emptyStr.substr(0,emptyStr.length-1);
									emptyStr = emptyStr + '}';
									let tempObj = JSON.parse(emptyStr);
									this.dataCaoyao.push(tempObj);
									emptyStr = "{";
								}
							}
							if( i%4 != 0){
								emptyStr = emptyStr.substr(0,emptyStr.length-1);
								emptyStr = emptyStr + '}';
								let tempObj = JSON.parse(emptyStr);
								this.dataCaoyao.push(tempObj);
							}
						}).catch(error => {
							reject(error);
						});
					})
				},
			}
		}
</script>

<style scoped>
	.doc-header .actionMenu{
		float: right;
	}

	.pannelInline{
		float: right;
	}
</style>