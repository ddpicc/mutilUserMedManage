
//引入express模块
const express = require("express");
//定义路由级中间件
const router = express.Router();
//引入数据模型模块
const Med = require("../models/medSchema");

// 查询所有英雄信息路由
router.get("/allmed", (req, res) => {
  let type = req.query.type;
  Med.find({'medtype': type})
    .sort({ update_at: -1 })
    .then(heros => {
      res.json(heros);
    })
    .catch(err => {
      console.log(2);
      res.json(err);
    });
});

//查看免煎药库存，返回库存小于count的数据
router.get("/checkMianjian", (req, res) => {
  let count = req.query.count;
  //Med.update({"count": null,
  //          "medtype": "免煎药"}, {"count": 0},{multi: true})
  Med.find({"count":{$lte: count},
            "medtype": "免煎药"})
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

//查看草药库存，返回库存小于count的数据
router.get("/checkCaoyao", (req, res) => {
  let count = req.query.count;
  Med.find({"count":{$lte: count},
            "medtype": "草药"})
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

// 通过ObjectId查询单个英雄信息路由
router.get("/hero/:id", (req, res) => {
  Med.findById(req.params.id)
    .then(hero => {
      res.json(hero);
    })
    .catch(err => {
      res.json(err);
    });
});

// 添加一个英雄信息路由
router.post("/hero", (req, res) => {
  //使用Hero model上的create方法储存数据
  Med.create(req.body, (err, hero) => {
    if (err) {
      res.json(err);
    } else {
      res.json(hero);
    }
  });
});

//更新一条英雄信息数据路由
router.put("/hero/:id", (req, res) => {
  Med.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        medname: req.body.medname,
        alias: req.body.alias,
        medtype: req.body.medtype,
        spec: req.body.spec,
        bagperbox: req.body.bagperbox,
        count: req.body.count,
        baseprice: req.body.baseprice,
        sellprice: req.body.sellprice,
        checked: req.body.checked
      }
    },
    {
      new: true
    }
  )
    .then(hero => res.json(hero))
    .catch(err => res.json(err));
});

//删除一条英雄信息路由
router.delete("/hero/:id", (req, res) => {
  Med.findOneAndRemove({
    _id: req.params.id
  })
    .then(hero => res.send(`${hero.title}删除成功`))
    .catch(err => res.json(err));
})

module.exports = router;




















