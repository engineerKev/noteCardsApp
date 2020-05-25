const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotecardSchema = new Schema({
   question: {
       type: String
   },
   answer: {
       type: String
   },
   parentStack: {
       type: Schema.Types.ObjectId,
       ref: 'parentStack'
   }
});

mongoose.model('notecard', NotecardSchema);