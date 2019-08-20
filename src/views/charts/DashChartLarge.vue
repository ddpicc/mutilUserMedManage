<template>
  <Col :span="24">
    <chart :options="option" class="echarts" id="chart" theme="macarons" autoResize> </chart>
  </Col>

</template>

<style scoped>
.echarts {
  height: 400px;
  width: 100%;

}
</style>

<script>
	var last30days = [];
	var last30daysIncome = [];
  var last30daysNum = [];
  import { dateToString, stringToDate} from 'utils/index';
	export default {
    data() {   
      return {
        option : {}
      }
    },

    methods: {

      loadMonthChart: function() {
        return new Promise((resolve, reject) => {
          var end = dateToString(new Date());
					var start = dateToString(new Date(new Date().setDate(new Date().getDate()-29)));
          this.$http.get('/ordapi/getLast30Days', {
    				params: {
        			startDate: start,
        			endDate: end
    				}
					}).then(response => {
            this.$nextTick( () => {
              let index = 0;
              let curDate = '';
              for(let item of response.data){
                if(item.date != curDate){
                  index = parseInt((new Date() - stringToDate(item.date)) / (1000 * 60 * 60 * 24));
                  curDate = item.date;
                  last30daysIncome[index] = item.total;
                  last30daysNum[index] = 1;
                }
                else{
                  last30daysIncome[index] = parseFloat((last30daysIncome[index] + item.total).toFixed(2));
                  last30daysNum[index] = last30daysNum[index] + 1;
                }
              }
            this.option = {
              title: {
                text: '最近30天',
              },
              tooltip: {
                  trigger: 'axis',
              },
              legend: {
                  data:['收入','人数']
              },
              toolbox: {
                  show : true,
                  feature : {
                      mark : {show: true},
                      dataView : {show: true, readOnly: false},
                      magicType : {show: true, type: ['line', 'bar']},
                      restore : {show: true},
                      saveAsImage : {show: false}
                  }
              },
              calculable : true,
              xAxis : [
                  {
                      type : 'category',
                      boundaryGap : false,
                      data : last30days
                  }
              ],
              yAxis : [
                  {
                      type : 'value'
                  }
              ],
              series: [
                {
                  name:'收入',
                  type: 'line',
                  data:last30daysIncome,
                  markPoint : {
                    data : [
                      {type : 'max', name: '最大值'},
                      {type : 'min', name: '最小值'}
                    ]
                  },
                  markLine : {
                    data : [
                      {type : 'average', name: '平均值'}
                    ]
                  }
                },
                {
                  name:'人数',
                  type:'line',
                  data:last30daysNum,
                  markLine : {
                    data : [
                      {type : 'average', name : '平均值'}
                    ]
                  }
                }
              ]
            }
          })
						resolve();
					}).catch(error => {
						reject(error);
					});
        })
      }
    },

    mounted: function () {
      //alert(new Date(new Date().setDate(new Date().getDate()-3)).getDate());
      for(var i = 0;i<30;i++)
			{ 
				last30days.push(new Date(new Date().setDate(new Date().getDate()-i)).toLocaleDateString());
			}
			this.loadMonthChart();

		}
	}
  
    

</script>