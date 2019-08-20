<style scoped>
  .expand-row{
    margin-bottom: 16px;
  }
</style>
<template>
  <div>
      <Button type="success" @click="printOrder">打印</Button>
    <div ref="print">
      <h4 style="text-align:center;">处  方</h4>
      <br>
      <hr style="height:1px;border:none;border-top:1px solid #555555;" />
      <Row :gutter="16">
        <Col span="8">
          <p>姓名： {{row.patient}}</p>
        </Col>
        <Col span="8">
          <p>性别： {{row.sex}}</p>
        </Col>
        <Col span="8">
          <p>年龄： {{row.age}}</p>
        </Col>
      </Row>
      <Row>
        <Col span="24">
          <p>症状：{{row.comment}}</p>
        </Col>
      </Row>
      <Row>
        <Col span="24">
          <p>备注：{{row.orderComment}}</p>
        </Col>
      </Row>
      <hr style="height:1px;border:none;border-top:1px solid #555555;" />
      <br>	
      <template v-if="row.medType != '西药'">
					<Row :gutter="8" v-for="item in row.med" :key="item.id">
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
					<Row :gutter="8" v-for="item in row.med" :key="item.id">
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
          <p>{{row.dose}} 付</p>
        </Col>
      </Row>
      <Row>
        <Col span="6"  offset="18">
          <p>价钱: {{row.total}}</p>
        </Col>
      </Row>
      <hr style="height:1px;border:none;border-top:1px solid #555555;" />
      <br>
      <Row :gutter="16">
        <Col span="8">
          <p>处方医师： 崔云杰</p>
        </Col>
        <Col span="8"  offset="8">
          <p>日期： {{row.date}}</p>
        </Col>
      </Row>
    </div>
  </div>
</template>
<script>
    export default {
      props: {
          row: Object
      },
      methods: {
        printOrder: function(){
          this.$print(this.$refs.print);				
        },
      }
    };
</script>