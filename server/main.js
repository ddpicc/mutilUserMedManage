const express = require('express');
const med = require('./router/medrouter')
const ord = require('./router/orderrouter')
const otherEntry = require('./router/otherentryerouter')
const mongoose = require("mongoose");
const Med = require("./models/medSchema");
const overallStatus = require("./models/overallStatus");

const bodyParser = require("body-parser")
var schedule = require("node-schedule");



//这一句是连接上数据库
var url = 'mongodb://qcui:8890@localhost:27017/myDbs?authSource=admin';
var db = mongoose.connect(url, {useNewUrlParser: true, useFindAndModify: false});

//var url = 'mongodb://qcui:cnaiq1988@localhost:27017/myDbs?authSource=myDbs';
//var db = mongoose.connect(url, {useNewUrlParser: true});

//var url = 'mongodb://localhost:27017/myDbs';
//var db = mongoose.connect(url, {useNewUrlParser: true});

//这里的myDbs是数据库的名字，不是表的名字



const app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/medapi',med);
app.use('/ordapi',ord);
app.use('/othentryapi',otherEntry);


//定时任务  todo
var rule = new schedule.RecurrenceRule();
rule.hour = 0;
rule.minute = 0;
rule.second = 0;
schedule.scheduleJob(rule, function(){
	console.log('scheduler run');
	var msgString = '注意以下药品可能短缺： ';
	Med.find({"checked": true,})
	.then(heros => {
		for(let item of heros){
			let boxCount = Math.floor(item.count /  item.bagperbox);
			if(boxCount <= 1)
				msgString = msgString + '	' + item.medname;
		}
		overallStatus.findOne({name: "GlobalStatus"}, function(err, doc){
			let msgArray = doc.warning;
			msgArray.unshift(msgString);
			doc.warning = msgArray;
			doc.save();
		});
    })
});


app.all("*",(req,res,next) => {
    res.header("Access-Control-Allow-Credentials", "ture");
    res.header("Access-Control-Allow-Origin", req.header.origin);
    res.header("Access-Control-Allow-Methods", "PUT,GET,POST,DELETE,Option");
    res.header("Access-Control-Allow-Headers", "Content-Type,username");
    next();
});

app.listen(3000,() => {
    console.log('app listening on port 3000.')
})


