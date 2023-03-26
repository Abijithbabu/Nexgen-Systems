const mongoose = require('mongoose')
const productSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    stock:{
        type:Number,
        required:true
    },
    image:{
        type:Array,
    },
    isAvailable:{
        type:Number,
        default:1
    },
    star:{
        type:Number,
        default:0
    },
    Rating:{
        type:Array
    }
})
module.exports = mongoose.model('Product',productSchema)