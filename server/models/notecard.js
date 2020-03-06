const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotecardSchema = new Schema({
   question: {
       type: String
   },
   answer: {
       type: String
   }
});

mongoose.model('notecard', NotecardSchema);