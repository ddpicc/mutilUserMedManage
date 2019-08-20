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
						<Button type="success" size="small" v-if="searchNotClick" @click="toAdd">添加</Button>
						<Button type="success" size="small" @click="searchMed">搜索</Button>
						<Button type="success" size="small" v-if="!searchNotClick" @click="searchCancal">退出搜索模式</Button>
					</div>
				</div>

				<div style="" class="doc-content">
					<Table :loading="loading" size="small" border :columns="columns7" :data="data6"></Table>
				</div>
        <Button class="backTopBtn" type="success" size="small" @click="backTop">回到顶部</Button>
			</Col>
		</Row>

		<Modal v-model="formModifyVisible" title="修改药品" @on-ok="okModify" @on-cancel="cancelModify">
			<Form ref="formModify" :model="formModify" :rules="ruleModify" :label-width="80" inline>
        <FormItem label="药品名称" prop="medname">
            <Input v-model="formModify.medname" placeholder="Enter your name"></Input>
        </FormItem>
        <FormItem label="别名" prop="alias">
            <Input v-model="formModify.alias" placeholder="Enter your e-mail"></Input>
        </FormItem>
				<FormItem label="类别" prop="medtype">
					<RadioGroup v-model="formModify.medtype" size="default" style="width: 136px">
						<Radio label="免煎药"></Radio>
						<Radio label="草药"></Radio>
            <Radio label="西药"></Radio>
					</RadioGroup>
				</FormItem>
				<FormItem label="规格" prop="spec" class="aaaa">
            <Input v-model="formModify.spec" placeholder="Enter your e-mail"></Input>
        </FormItem>
				<FormItem label="袋/盒" prop="bagperbox">
            <Input v-model="formModify.bagperbox" placeholder="Enter your e-mail"></Input>
        </FormItem>
				<FormItem label="数量" prop="count">
            <Input v-model="formModify.count" placeholder="Enter your e-mail"></Input>
        </FormItem>
				<FormItem label="进价" prop="baseprice">
            <Input v-model="formModify.baseprice" placeholder="Enter your e-mail"></Input>
        </FormItem>
				<FormItem label="零售价" prop="sellprice">
            <Input v-model="formModify.sellprice" placeholder="Enter your e-mail"></Input>
        </FormItem>
        <FormItem label="计划监测" prop="checked">
            <Checkbox v-model="formModify.checked">是</Checkbox>
        </FormItem>
    	</Form>
		</Modal>

    <Modal v-model="formAddVisible" title="新增药品" @on-ok="okAdd" @on-cancel="clearFormAdd">
			<Form ref="formAdd" :model="formAdd" :rules="ruleAdd" :label-width="80" inline>
        <FormItem label="药品名称" prop="medname">
            <Input v-model="formAdd.medname"></Input>
        </FormItem>
        <FormItem label="别名" prop="alias">
            <Input v-model="formAdd.alias"></Input>
        </FormItem>
				<FormItem label="类别" prop="medtype">
					<RadioGroup v-model="formAdd.medtype" size="default" style="width: 136px">
						<Radio label="免煎药"></Radio>
						<Radio label="草药"></Radio>
            <Radio label="西药"></Radio>
					</RadioGroup>
				</FormItem>
				<FormItem label="规格" prop="spec" class="aaaa">
            <Input v-model="formAdd.spec"></Input>
        </FormItem>
				<FormItem label="袋/盒" prop="bagperbox">
            <Input v-model="formAdd.bagperbox"></Input>
        </FormItem>
				<FormItem label="数量" prop="count">
            <Input v-model="formAdd.count"></Input>
        </FormItem>
				<FormItem label="进价" prop="baseprice">
            <Input v-model="formAdd.baseprice"></Input>
        </FormItem>
				<FormItem label="零售价" prop="sellprice">
            <Input v-model="formAdd.sellprice"></Input>
        </FormItem>
        <FormItem label="计划监测" prop="checked">
            <Checkbox v-model="formAdd.checked">是</Checkbox>
        </FormItem>
    	</Form>
		</Modal>

    <Modal v-model="searchVisible" :closable="false" :mask-closable="false" ok-text="搜索"
        cancel-text="取消" @on-ok="searchHandler" @on-cancel="cancelSearchInModel">
      <div style="text-align:center">
        <Input v-model="searchMedString" placeholder="药品名称" autofocus/>
      </div>
    </Modal>
	</div>
</template>

<script>
  var cacheAllMed = [];
	export default {
		data () {
			return {
				medtype: '免煎药',
				formModifyVisible: false,
        formAddVisible: false,
        searchVisible: false,
        searchNotClick: true,
        modifyId: "",
        searchMedString: "",
        loading: false,
				columns7: [
					{
						title: '药品名称',
						key: 'medname',
						align: 'center',
            render: (h, params) => {
              return h('div', [
                h('strong', params.row.medname)
              ]);
            }
					},
          {
            title: '别名',
            key: 'alias',
            align: 'center'
          },
          {
            title: '规格',
            key: 'spec',
            align: 'center'
          },
          {
            title: '袋/盒',
            key: 'bagperbox',
            align: 'center'
          },
          {
            title: '数量',
            key: 'count',
            align: 'center'
          },
          {
            title: '进价',
            key: 'baseprice',
            align: 'center'
          },
          {
            title: '零售价',
            key: 'sellprice',
            align: 'center'
          },
          {
            title: '监测',
            key: 'checked',
            align: 'center'
          },
					{
            title: '操作',
            key: 'action',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Icon', {
                  props: {
                    type: 'ios-create',
                    size: 20,
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.modify(params.index)
                    }
                  }
                }, '修改'),
                h('Icon', {
                  props: {
                    type: 'ios-close',
                    size: 20,
                  },
                  on: {
                    click: () => {
                      this.remove(params.index)
                    }
                  }
                }, '删除')
              ]);
            }
					}
				],
        data6: [],
        formModify: {
          medname: "",
          alias: "",
          medtype: "",
          spec: "",
          bagperbox: "",
          count: "",
          baseprice: "",
          sellprice: "",
          checked: ""
        },
        ruleModify: {
            name: [
                { required: true, message: 'Please fill in the user name', trigger: 'blur' }
            ],
            mail: [
                { required: true, message: 'Please fill in the password.', trigger: 'blur' },
                { type: 'string', min: 6, message: 'The password length cannot be less than 6 bits', trigger: 'blur' }
            ]
        },
        formAdd: {
          medname: "",
          alias: "",
          medtype: "免煎药",
          spec: "",
          bagperbox: "",
          count: "",
          baseprice: "",
          sellprice: "",
          checked: false
        },
        ruleAdd: {}
			}
		},
		methods: {      
			modify (index) {
				this.formModifyVisible = true;
        this.formModify = Object.assign({}, this.data6[index]);
        this.modifyId = this.formModify["_id"];
      },
      okModify: function() {
        return new Promise((resolve, reject) => {
          this.$http.put(`/medapi/hero/${this.modifyId}`, this.formModify, {
            emulateJSON: true
          }).then(response => {
            this.formModifyVisible = false;
            this.$Message.success('修改成功!');
            this.getAll();           
            resolve();
          }).catch(error => {
            this.$Message.error('修改失败');
            reject(error);
          });
        });
      },
      cancelModify: function(){
        this.formAddVisible = false;
      },

			remove (index) {
        this.$Modal.confirm({
          content: '此操作将永久删除该文件, 是否继续?',
          onOk: ()=>{
            let tempObj = Object.assign({}, this.data6[index]);
            let deleteId = tempObj['_id'];
            return new Promise((resolve, reject) => {
              this.$http.delete(`/medapi/hero/${deleteId}`).then(
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

      backTop() {
        document.body.scrollTop = 0
        document.documentElement.scrollTop = 0
      },

			searchMed: function(){
        this.searchNotClick = false;
        this.searchVisible = true;
        this.searchMedString = "";
			},

			searchCancal: function(){
        this.searchNotClick = true;
        this.searchMedString = "";
        this.data6 = cacheAllMed;
      },
      
      searchHandler: function(){
        let searchStr = this.searchMedString;
        this.data6 = cacheAllMed.filter( function (item) {
  				return (item.medname.indexOf(searchStr) != -1) || (item.alias.indexOf(searchStr) != -1);
					}
				);
      },

      cancelSearchInModel: function(){
        this.searchNotClick = true;
        this.searchMedString = "";
        this.data6 = cacheAllMed;
      },

      toAdd () {
        this.formAddVisible = true;
			},
      okAdd: function() {
        return new Promise((resolve, reject) => {
          this.$http.post("/medapi/hero", this.formAdd).then(
            response => {
            this.formAddVisible = false;
            this.$Message.success('添加成功!');
            this.getAll();
            this.clearFormAdd();
            resolve();
          }).catch(error => {
            this.$Message.error('添加失败');
            reject(error);
          });
        });
      },

      clearFormAdd: function(){
        this.formAdd.medname = "";
        this.formAdd.alias = "";
        this.formAdd.medtype = "免煎药";
        this.formAdd.spec = "";
        this.formAdd.bagperbox = "";
        this.formAdd.count = "";
        this.formAdd.baseprice = "";
        this.formAdd.sellprice = "";
        this.formAdd.checked = false;
      },

      radioChange: function(){
        this.getAll();
      },

			// 获取全部数据
    	getAll: function() {
        this.loading = true;
				return new Promise((resolve, reject) => {
					this.$http.get("/medapi/allmed",{
							params: {
								type : this.medtype
							}
						}).then(response => {
            this.data6 = response.data;
            cacheAllMed = response.data;
            this.loading = false;
						resolve();
					}).catch(error => {
						reject(error);
					});
				});
			}

		},

		watch: {
			medtype: function() {
        //if(this.medtype == "草药")
          
			}
		},

		mounted: function() {
			this.getAll();
		}

	}
</script>

<style scoped>
	.doc-header .actionMenu{
		float: right;
	}

  .ivu-form .aaaa{
    vertical-align: right;
  }

  .backTopBtn{
    float: right;
  }

</style>