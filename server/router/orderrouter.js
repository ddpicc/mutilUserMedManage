const express = require("express");
//定义路由级中间件
const router = express.Router();
//引入数据模型模块
const Ord = require("../models/ordSchema");
const Med = require("../models/medSchema");
const OtherEntry = require("../models/otherEntrySchema");
const Status = require("../models/overallStatus");

//创建订单
router.post("/order", (req, res) => {
  console.log(req.body);
  Ord.create(req.body, (err, hero) => {
    if (err) {
      res.json(err);
    } else {
      res.json(hero);
    }
  });
  }
);

//查找所有订单限制前1000个
router.get("/order", (req, res) => {
  Ord.find()
    .limit(1000)
    .sort({'_id':-1})
    .then(heros => {
      res.json(heros);
    })
    .catch(err => {
      console.log(2);
      res.json(err);
    });
  }
);

 //查找所有订单没有限制
router.get("/orderall", (req, res) => {
  Ord.find()
    .sort({'_id':-1})
    .then(heros => {
      res.json(heros);
    })
    .catch(err => {
      console.log(2);
      res.json(err);
    });
  }
);

// 添加一个临时订单
router.post("/adhoc", (req, res) => {
  //使用Ord model上的create方法储存数据
  req.body.editable = false;
  Ord.create(req.body, (err, hero) => {
    if (err) {
      res.json(err);
    } else {
      res.json(hero);
    }
  });
});

/*  //查找需要出库的订单
 router.get("/orderNeedOut", (req, res) => {
  Ord.find({"editable": false,
            "type": "收入"})
    .sort({ update_at: -1 })
    .then(heros => {
      res.json(heros);
    })
    .catch(err => {
      console.log(2);
      res.json(err);
    });
  }
); */

//从globalstatus库查找总计信息
router.get("/getGlobalStatus", (req, res) => {
  Status.findOne({name: "GlobalStatus"})
    .then(heros => {
      res.json(heros);
    })
    .catch(err => {
      console.log(2);
      res.json(err);
    });
  }
);

//删除一条message
router.delete("/delGlobalMsg", (req, res) => {
  let msgIndex = req.query.msgIndex;
  Status.findOne({name: "GlobalStatus"}, function(err, doc){
    let msgArray = doc.warning;
    msgArray.splice(msgIndex,1);
    doc.warning = msgArray;
    doc.save();
    res.json(doc);
  });
});

//查找当月的订单
router.get("/getCurrentMonth", (req, res) => {
  let nowdate = new Date();
  let curmonth = nowdate.getMonth()+1;
  let curyear = nowdate.getFullYear();
  let endyear = curyear;
  let endMonth = (curmonth+1) %12;
  if(endMonth == 0)
    endMonth = '12';
  if(endMonth < 10)
    endMonth = '0' + endMonth;
  if(curmonth < 10)
    curmonth = '0' + curmonth;
  if(curmonth == 12)
    endyear = curyear + 1;
  let start = curyear + '/' + curmonth;
  let end = endyear + '/' + endMonth;
  console.log(start);
  console.log(end);
  Ord.find({"date":{$gte: start, $lte: end},
            "editable": false})
    .then(heros => {
      console.log(heros);
      res.json(heros);
    })
    .catch(err => {
      console.log('error');
      res.json(err);
    });
  }
);

//查找当天的订单
router.get("/getCurrenDay", (req, res) => {
  console.log("hahahaha");
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
  Ord.find({"date": currentdate,
            "editable": false})
    .then(heros => {
      console.log(heros);
      res.json(heros);
    })
    .catch(err => {
      console.log('error');
      res.json(err);
    });
  }
);


 //查找最近30天的订单
router.get("/getLast30Days", (req, res) => {
  let start = req.query.startDate;
  let end = req.query.endDate;
  console.log(start);
  console.log(end);
  Ord.find({"date":{$gte: start, $lte: end},
            "editable": false})
    .sort({ update_at: -1 })
    .then(heros => {
      res.json(heros);
      console.log(heros);
    })
    .catch(err => {
      console.log(2);
      res.json(err);
    });
  }
);

//查找一个date range的订单
router.get("/getOrderStatement", (req, res) => {
  //console.log(req.query.startDate);
  let start = req.query.startDate;
  let end = req.query.endDate;
  console.log("读取" + start + "到" + end + "的处方订单信息");
  Ord.find({"date":{$gte: start, $lte: end},
            "editable": false})
    .sort({ update_at: -1 })
    .then(heros => {
      res.json(heros);
      console.log(heros);
    })
    .catch(err => {
      console.log(2);
      res.json(err);
    });
  }
);


  //删除一条订单数据
router.delete("/order/:id", (req, res) => {
  Ord.findOneAndRemove({
    _id: req.params.id
  })
    .then(hero => res.send(`${hero.title}删除成功`))
    .catch(err => res.json(err));
  }
);

//更新订单状态
router.put("/updateOrdstatus/:id", (req, res) => {
  console.log("Update order status");
  Ord.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        editable: false,
      }
    },
    {
      new: true
    }
  )
    .then(hero => console.log(hero))
    .catch(err => res.json(err));
});

//更新药品的库存
router.put("/updateOrdMed", (req, res) => {
  console.log("Update order med");
  let errstr;
  let dose = req.body.dose;
  let arr = [];
  arr = req.body.medary;
  let type = req.body.medtype;
  arr.forEach(element => {
    //console.log(element.medname);
    var tempMedname;
    var tempChangeCount;
    var index=0;
    while(index<4){
      if(index == 0){
        if(typeof(element.medname1) == "undefined")
          break;
        tempMedname = element.medname1;
        tempChangeCount = -1*parseInt(element.count1)*dose
        index = index + 1;
      }
      else if(index==1){
        if(typeof(element.medname2) == "undefined")
          break;
        tempMedname = element.medname2;
        tempChangeCount = -1*parseInt(element.count2)*dose
        index = index + 1;
      }
      else if(index==2){
        if(typeof(element.medname3) == "undefined")
          break;
        tempMedname = element.medname3;
        tempChangeCount = -1*parseInt(element.count3)*dose
        index = index + 1;
      }
      else if(index==3){
        if(typeof(element.medname4) == "undefined")
          break;
        tempMedname = element.medname4;
        tempChangeCount = -1*parseInt(element.count4)*dose
        index = index + 1;
      }
      console.log(tempMedname + '  count change:' +  tempChangeCount);
      Med.findOneAndUpdate({
        medtype: type,
        medname: tempMedname},
        {$inc: {count: tempChangeCount}})
        .catch(err => {
          errstr = err;
          console.log(err);
        });
    }
    });
  });


//update value in global status
router.put("/updateGlobalStatus", (req, res) => {
  var objYearlyIncome = req.body.yearlyIncome;
  var objMonthlyIncome = req.body.monthlyIncome;
  var objMonthlyProfit = req.body.monthlyProfit;
  objYearlyIncome = JSON.stringify(objYearlyIncome).replace(/'/g, '"');
  objMonthlyIncome = JSON.stringify(objMonthlyIncome).replace(/'/g, '"');
  objMonthlyProfit = JSON.stringify(objMonthlyProfit).replace(/'/g, '"');
  console.log(JSON.parse(objYearlyIncome));
  Status.findOne({name: "GlobalStatus"}, function(err, doc){
    doc.yearlyIncome = JSON.parse(objYearlyIncome);
    doc.monthlyIncome = JSON.parse(objMonthlyIncome);
    doc.monthlyProfit = JSON.parse(objMonthlyProfit);
    doc.markModified('yearlyIncome');
    doc.markModified('monthlyIncome');
    doc.markModified('monthlyProfit');
    doc.save();
  });
  res.json("kkkk");
}),

//update only adhoc in global status
router.put("/updateAdhocIncome", (req, res) => {
  var objYearlyIncome = req.body.yearlyIncome;
  objYearlyIncome = JSON.stringify(objYearlyIncome).replace(/'/g, '"');
  Status.findOne({name: "GlobalStatus"}, function(err, doc){
    doc.yearlyIncome = JSON.parse(objYearlyIncome);
    doc.markModified('yearlyIncome');
    doc.save();
  });
}),

//update only adhoc in global status
router.put("/updateAdhocOutcome", (req, res) => {
  var objYearlyOutcome = req.body.yearlyOutcome;
  objYearlyOutcome = JSON.stringify(objYearlyOutcome).replace(/'/g, '"');
  Status.findOne({name: "GlobalStatus"}, function(err, doc){
    doc.yearlyOutcome = JSON.parse(objYearlyOutcome);
    doc.markModified('yearlyOutcome');
    doc.save();
  });
}),


    


module.exports = router;