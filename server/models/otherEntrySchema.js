const mongoose = require('mongoose')
var Schema = mongoose.Schema;

const otherEntrySchema = new Schema({
    name :String,
    comment: String,
    type : String,
    detailType: String,
    date: String,
    amount : Number,
    profit : Number,
    editable : Boolean,
  }, { collection: 'otherEntry'})

  module.exports = mongoose.model('otherEntry',otherEntrySchema);