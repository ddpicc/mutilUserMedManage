<template>
	<div class="animated fadeIn">
		<Row>
			<Col :md="24" >
				<Card v-for="(item, index) in messages" :key="index">
					<Row>
						<Col span='20'>
          		<h6>{{index+1}} {{item}}</h6>
						</Col>
						<Col span='4'>
							<div>
								<Button type="success" class="pannelInline" @click="delectMsg(index)">删除</Button>
							</div>
						</Col>
					</Row>
        </Card>
			</Col>
		</Row>
  </div>
</template>
<script>
    export default {
      data () {
				return {
					messages: []
				}
			},
			methods: {
				// 获取全部数据
				getAll: function() {
					return new Promise((resolve, reject) => {
						this.$http.get("/ordapi/getGlobalStatus").then(response => {
							this.messages = response.data.warning;
							resolve();
						}).catch(error => {
							reject(error);
						});
					});
				},

				delectMsg: function(index) {
					return new Promise((resolve, reject) => {
						this.$http.delete("/ordapi/delGlobalMsg",{
							params: {
								msgIndex : index
							}
						}).then(
							response => {
								this.$Message.success('删除成功!');
								this.messages = response.data.warning;
								resolve();
							}
						).catch(error => {
							this.$Message.error('删除失败');
							reject(error);
						});
					});
				}
			},

			mounted: function() {
				this.getAll();
			}
    }
</script>

<style scoped>
	.pannelInline{
		float: right;
	}
</style>