const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:true
    },
    payment:{
        type:String,
        required:true  
    },
    amount:{
        type:Number,        
    },
    address:{
          firstname: {
            type: String,
            required: true
          },
          lastname: {
            type: String,
            required: true
          },
          country: {
            type: String,
            required: true
          },
          address: {
            type: String,
            required: true
          },
          
          city: {
            type: String,
            required: true
          },
          state: {
            type: String,
            required: true
          },
          zip: {
            type: String,
            required: true
          },
          mobile: {
            type: Number,
            required: true
          },
    },
    createdAt:{
        type:Date,
        immutable:true,
        default:()=>Date.now()
    },
    products:{
        item:[{
            productId:{
                type:mongoose.Types.ObjectId,
                ref:'Product',
                required:true
            },
            qty:{
                type:Number,
                required:true
            },
            price:{
                type:Number,
            }
        }],
        totalPrice:{
            type:Number,
            default:0
        }
    },
    status:{
        type:String,
        default:"Placed"
    },
    offer:{
        type:String,
        default:"None"
    }
})

// orderSchema.methods.addToOrders = function (product) {
//     const products = this.products
//     const isExisting = products.item.findIndex(objInItems => {
//         return new String(objInItems.productId).trim() == new String(product._id).trim()
//     })
//     if(isExisting >=0){
//         cart.products[isExisting].qty +=1
//     }else{
//         cart.products.push({productId:product._id,
//         qty:1})
//     }
//     cart.totalPrice += product.price
//     console.log("User in schema:",this);
//     return this.save()
// }


module.exports = mongoose.model('Orders',orderSchema)