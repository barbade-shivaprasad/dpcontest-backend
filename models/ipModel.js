const {Schema , model} = require('mongoose')

const ip = new Schema({
    ip:{type:String,required:true},
    id:{type:String,required:true}
}, {
    timestamps: true
});

const ipModel = model('ip',ip);

module.exports = ipModel