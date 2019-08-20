<template>
  <Row>
    <Col  :xs="24" :sm="12" :md="12" :lg="12" >
      <chart :options="option1" class="echarts" id="chart" theme="macarons" autoResize> </chart>
    </Col>
    <Col  :xs="24" :sm="12" :md="12" :lg="12" >
      <chart :options="option2" class="echarts" id="chart" theme="macarons" autoResize> </chart>
    </Col>
  </Row>
</template>

<style scoped>
  .echarts {
    height: 300px;
    width: 100%;
    border-radius: 25px;
  }

  canvas{
    margin-top:50px !important;
  }
</style>

<script>

export default {
  data: function () {   
    return {
      option1: {
        
      },
      option2: {}
    }
  },

  methods: {
    loadIncomePie: function(){
      return new Promise((resolve, reject) => {
        let incomeMianjian = 0;
        let incomeCaoyao = 0;
        let incomeXiyao = 0;
        let incomeYaowan = 0;
        let profitMianjian = 0;
        let profitCaoyao = 0;
        let profitXiyao = 0;  
        let profitYaowan = 0;
        this.$http.get('/ordapi/getCurrentMonth').then(response => {   
          for(let item of response.data){
            if(item.medType == "免煎药"){
              incomeMianjian = parseFloat((incomeMianjian + item.total).toFixed(2));
              profitMianjian = parseFloat((profitMianjian + item.totalprofit).toFixed(2));
            } 
            else if(item.medType == "草药"){
              incomeCaoyao = parseFloat((incomeCaoyao + item.total).toFixed(2));
              profitCaoyao = parseFloat((profitCaoyao + item.totalprofit).toFixed(2));
            }
            else if(item.medType == "西药"){
              incomeXiyao = parseFloat((incomeXiyao + item.total).toFixed(2));
              profitXiyao = parseFloat((profitXiyao + item.totalprofit).toFixed(2));
            }           
          }
          this.$http.get('/othentryapi/getCurrentMonth').then(response => {
            for(let item of response.data){
              if(item.detailType == "药丸"){
                incomeYaowan = parseFloat((incomeYaowan + item.amount).toFixed(2));
                profitYaowan = parseFloat((profitYaowan + item.profit).toFixed(2));
              }
            }
          this.$nextTick( () => {
            this.option1 = {
              title : {
                text: '当月收入组成',
                x:'center'
              },
              tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
              },
              legend: {
                x : 'center',
                y : 'bottom',
                data:['免煎药','草药','西药','药丸']
              },
              toolbox: {
                show : true,
                feature : {
                  mark : {show: true},
                  dataView : {show: true, readOnly: false},
                  magicType : {
                    show: true,
                    type: ['pie', 'funnel']
                  },
                  restore : {show: true},
                  saveAsImage : {show: true}
                }
              },
              calculable : true,
              series : [
                {
                  name:'收入来源',
                  type:'pie',
                  radius : [30, 110],
                  center : ['55%', '55%'],
                  data:[
                    {value:incomeMianjian, name:'免煎药'},
                    {value:incomeCaoyao, name:'草药'},
                    {value:incomeXiyao, name:'西药'},
                    {value:incomeYaowan, name:'药丸'},
                  ]
                }
              ]
            },
            this.option2 = {
              title : {
                text: '当月利润组成',
                x:'center'
              },
              tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
              },
              legend: {
                x : 'center',
                y : 'bottom',
                data:['免煎药','草药','西药','药丸']
              },
              toolbox: {
                show : true,
                feature : {
                  mark : {show: true},
                  dataView : {show: true, readOnly: false},
                  magicType : {
                      show: true,
                      type: ['pie', 'funnel']
                  },
                  restore : {show: true},
                  saveAsImage : {show: true}
                }
              },
              calculable : true,
              series : [
                {
                  name:'利润来源',
                  type:'pie',
                  radius : [30, 110],
                  center : ['55%', '55%'],
                  data:[
                      {value:profitMianjian, name:'免煎药'},
                      {value:profitCaoyao, name:'草药'},
                      {value:profitXiyao, name:'西药'},
                      {value:profitYaowan, name:'药丸'},
                  ]
                }      
              ]
            }
          })
          }
          )
          resolve();
        })
      })
    }
  },


  mounted: function () {      
    this.loadIncomePie();
  }
} 
</script>