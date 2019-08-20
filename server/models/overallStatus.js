const mongoose = require('mongoose')
var Schema = mongoose.Schema;

const statusSchema = new Schema({
  yearlyIncome : Schema.Types.Mixed,
  yearlyOutcome: Schema.Types.Mixed,
  monthlyIncome: Schema.Types.Mixed,
  monthlyProfit : Schema.Types.Mixed,
  warning: [String]
}, { collection: 'myStatus'})    //这里mongoose.Schema要写上第二个参数，明确指定到数据库中的哪个表取数据


module.exports = mongoose.model('myStatus',statusSchema);