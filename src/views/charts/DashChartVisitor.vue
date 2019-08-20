<template>
  <Col :span="24">
    <chart :options="option" class="echarts" id="chart" theme="macarons" autoResize> </chart>
  </Col>
</template>

<style scoped>
.echarts {
  border-radius:4px;    
  height: 250px;
  width: 100%;
}
</style>

<script>
  var globalStatus = {};
	export default {
    data() {   
      return {
        option : {}
      }
    },

    methods: {
      getYearMonthIndex(nowMonth, nowYear, count){
        nowMonth = nowMonth - count;
        if(nowMonth < 1)
          nowYear = nowYear - 1;
        nowMonth = (nowMonth + 12) % 12;
        if(nowMonth == 0)
          nowMonth = '12';
        if (nowMonth >= 1 && nowMonth <= 9) {
					nowMonth = "0" + nowMonth;
        }
        return nowYear + '/' + nowMonth;
      },

      loadMonthChart: function() {
        return new Promise((resolve, reject) => {
          var nowMonth = new Date().getMonth()+1;
          var nowYear = new Date().getFullYear();
          this.$http.get("/ordapi/getGlobalStatus").then(response => {
            globalStatus = response.data;
            if(typeof(globalStatus.yearlyIncome) == 'undefined'){
              globalStatus.yearlyIncome = {};
            }
            if(typeof(globalStatus.monthlyIncome) == 'undefined'){
              globalStatus.monthlyIncome = {};
            }
            if(typeof(globalStatus.monthlyProfit) == 'undefined'){
              globalStatus.monthlyProfit = {};
            }
            this.$nextTick( () => {
            this.option = {
              title: {
                text: '最近12个月收入',
              },
              tooltip: {
                  trigger: 'axis',
              },
              legend: {
                  data:['收入','利润']
              },
              toolbox: {
                  show : true,
                  feature : {
                      mark : {show: true},
                      dataView : {show: true, readOnly: false},
                      magicType : {show: true, type: ['line', 'bar']},
                      restore : {show: true},
                      saveAsImage : {show: true}
                  }
              },
              calculable : true,
              xAxis : [
                  {
                      type : 'category',
                      boundaryGap : false,
                      data : [nowMonth+'月', (nowMonth-1+12)%12 === 0 ? 12 + '月': (nowMonth-1+12)%12 +'月', (nowMonth-2+12)%12 === 0 ? 12 + '月': (nowMonth-2+12)%12 +'月', 
                              (nowMonth-3+12)%12 === 0 ? 12 + '月': (nowMonth-3+12)%12 +'月', (nowMonth-4+12)%12 === 0 ? 12 + '月': (nowMonth-4+12)%12 +'月', (nowMonth-5+12)%12 === 0 ? 12 + '月': (nowMonth-5+12)%12 +'月', 
                              (nowMonth-6+12)%12 === 0 ? 12 + '月': (nowMonth-6+12)%12 +'月', (nowMonth-7+12)%12 === 0 ? 12 + '月': (nowMonth-7+12)%12 +'月' ,(nowMonth-8+12)%12 === 0 ? 12 + '月': (nowMonth-8+12)%12 +'月', 
                              (nowMonth-9+12)%12 === 0 ? 12 + '月': (nowMonth-9+12)%12 +'月', (nowMonth-10+12)%12 === 0 ? 12 + '月': (nowMonth-10+12)%12 +'月', (nowMonth-11+12)%12 === 0 ? 12 + '月': (nowMonth-11+12)%12 +'月'
                              ]
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
                  data:[globalStatus.monthlyIncome[this.getYearMonthIndex(nowMonth,nowYear,0)], globalStatus.monthlyIncome[this.getYearMonthIndex(nowMonth,nowYear,1)], globalStatus.monthlyIncome[this.getYearMonthIndex(nowMonth,nowYear,2)],
                        globalStatus.monthlyIncome[this.getYearMonthIndex(nowMonth,nowYear,3)], globalStatus.monthlyIncome[this.getYearMonthIndex(nowMonth,nowYear,4)], globalStatus.monthlyIncome[this.getYearMonthIndex(nowMonth,nowYear,5)],
                        globalStatus.monthlyIncome[this.getYearMonthIndex(nowMonth,nowYear,6)], globalStatus.monthlyIncome[this.getYearMonthIndex(nowMonth,nowYear,7)], globalStatus.monthlyIncome[this.getYearMonthIndex(nowMonth,nowYear,8)],
                        globalStatus.monthlyIncome[this.getYearMonthIndex(nowMonth,nowYear,9)], globalStatus.monthlyIncome[this.getYearMonthIndex(nowMonth,nowYear,10)], globalStatus.monthlyIncome[this.getYearMonthIndex(nowMonth,nowYear,11)]
                        ],
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
                  name:'利润',
                  type:'line',
                  data:[globalStatus.monthlyProfit[this.getYearMonthIndex(nowMonth,nowYear,0)], globalStatus.monthlyProfit[this.getYearMonthIndex(nowMonth,nowYear,1)], globalStatus.monthlyProfit[this.getYearMonthIndex(nowMonth,nowYear,2)],
                        globalStatus.monthlyProfit[this.getYearMonthIndex(nowMonth,nowYear,3)], globalStatus.monthlyProfit[this.getYearMonthIndex(nowMonth,nowYear,4)], globalStatus.monthlyProfit[this.getYearMonthIndex(nowMonth,nowYear,5)],
                        globalStatus.monthlyProfit[this.getYearMonthIndex(nowMonth,nowYear,6)], globalStatus.monthlyProfit[this.getYearMonthIndex(nowMonth,nowYear,7)], globalStatus.monthlyProfit[this.getYearMonthIndex(nowMonth,nowYear,8)],
                        globalStatus.monthlyProfit[this.getYearMonthIndex(nowMonth,nowYear,9)], globalStatus.monthlyProfit[this.getYearMonthIndex(nowMonth,nowYear,10)], globalStatus.monthlyProfit[this.getYearMonthIndex(nowMonth,nowYear,11)]
                        ],
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
      this.loadMonthChart();
		}
	}
  
    

</script>