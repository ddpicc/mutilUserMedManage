const mongoose = require('mongoose')
var Schema = mongoose.Schema;

const ordSchema = new Schema({
    patient :String,
    age: String,
    sex: String,
    comment: String,
    orderComment: String,
    orderalias: String,
    medType: String,
    date: String,
    med : [Schema.Types.Mixed],
    dose : Number,
    total : Number,
    totalprofit : Number,
    editable : Boolean,
  }, { collection: 'myOrd'})

  module.exports = mongoose.model('ord',ordSchema);