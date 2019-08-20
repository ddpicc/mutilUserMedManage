<template>
	<div class="animated fadeIn">
		<Row>
			<Col :md="24" >
				<div class="doc-header">
					<p> 药丸记录 </p>
				</div>
		
				<div style="" class="doc-content">
					<Row  :gutter="16">
      			<Col :xs="24" :sm="24" :md="24" :lg="24">
         			<todo-list></todo-list>
						</Col>
					</Row>
				</div>
			</Col>
		</Row>
  </div>
</template>
<script>
		import TodoList from 'src/components/TodoList'
    export default {
			components:{TodoList},
      data () {
				return {
					columns7: [],
					data6: []
				}
			}
    }
</script>

<style scoped>

</style>