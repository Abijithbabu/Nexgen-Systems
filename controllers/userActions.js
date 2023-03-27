
const User = require('../models/userModel')
const Category = require('../models/category')
const Product = require('../models/product')
const Address = require('../models/address')
const Coupon = require('../models/coupon')
const Order = require('../models/orders')
const RazorPay = require('razorpay')
require("dotenv").config();

const updateCart = async(req,res)=>{
    try{
        let { quantity , _id } = req.body
            const userData =await User.findById({_id:req.session.user_id})
            const total =await userData.updateCart(_id , quantity)
          res.json({total})
    }catch(error){
        console.log(error)
    }
}
const addToCart = async(req,res)=>{
    try{
        const productId = req.query.id
        console.log('proid'+productId);
        userSession = req.session.user_id
        console.log(userSession);
        if(userSession){
            const userData =await User.findById({_id:req.session.user_id})
            const productData =await Product.findById({ _id:productId })
            userData.addToCart(productData)
            res.redirect('/cart')
        }else{
            res.redirect('/login')
        }
    }catch(error){
        console.log(error)
    }
}
const removeFromCart = async(req,res)=>{
    const productId = req.query.id
    const userData =await User.findById({_id:req.session.user_id})
    userData.removefromCart(productId)
    res.redirect('/cart')
}

const addToWishlist = async(req,res)=>{
    const productId = req.query.id
    if(req.session.user_id){
        const userData =await User.findById({_id:req.session.user_id})
        const productData =await Product.findById({ _id:productId })
        userData.addToWishlist(productData)
        res.redirect('/wishList')
    }else{
        res.redirect('/wishList')
    }
}
const deleteFromWishlist = async(req,res)=>{
    const productId = req.query.id
    const userData =await User.findById({_id:req.session.user_id})
    userData.removefromWishlist(productId)
    res.redirect('/wishList')
}


const loadCheckout = async(req,res)=>{
    try {
        if(req.session.user_id){
            const userData =await User.findById({ _id:req.session.user_id })
            const cartData = await userData.populate('cart.item.productId')
            const addressData = await Address.find({ userId: req.session.user_id })
            // const selectAddress = await Address.findOne({ _id: id });
            const couponData = await Coupon.find()
            console.log(req.query.id);
            if(req.query.id){
             offer = await Coupon.findOne({_id:req.query.id})
            }else{offer = null}
            res.render('users/checkout',{ user: req.session.user,userData, head: 4,products:cartData.cart,address:addressData , coupons:couponData , discount:offer})       
        }else{
            res.redirect('/')
        }
    } catch (error) {
        console.log(error.message);
    }
}

const applyCoupon = async(req,res)=>{
    const couponData = await Coupon.findOne({_id:req.body.id})
    res.send({couponData}) 

}

let order
const placeOrder = async(req,res)=>{
    console.log('comming');
    try {
        if(req.body.address==0){
            addrData = new Address({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                country: req.body.country,
                address: req.body.street,
                city: req.body.city,
                state: req.body.state,
                zip: req.body.pin,
                mobile: req.body.mno,
            })
        }else{
            addrData= await Address.findOne({_id: req.body.address})
        }
        const couponData = await Coupon.findOne({_id:req.body.coupon})
        const userData = await User.findOne({_id:req.session.user_id})
        order = new Order({
            userId:req.session.user_id,
            address:addrData,
            payment:req.body.payment,
            amount: req.body.amount,
            offer:couponData.discount,
            products:userData.cart
        })
        if(req.body.payment=='COD'){
            res.send({method:req.body.payment})
        }else if(req.body.payment=='wallet'){
            let bal = userData.wallet
            if(userData.wallet>req.body.amount){
                bal = userData.wallet-req.body.amount
            }else{ bal = 0 }  
            await User.updateOne({_id:req.session.user_id},{$set:{wallet:bal}})  
            res.send({method:req.body.payment})
        }else{
            var instance = new RazorPay({
                key_id:process.env.KEY_ID,
                key_secret:process.env.KEY_SECRET
              })
              let razorpayOrder = await instance.orders.create({
                amount: req.body.payable*100,
                currency:'INR',
                receipt:order._id.toString()
              })
              console.log('Order created', razorpayOrder);
              res.send({
                userId:req.session.user_id,
                order_id:razorpayOrder.id,
                total:  req.body.amount,
                key_id: process.env.key_id,
                user: userData,
                order: order,
                orderId: order._id.toString()   
              });
        }
        
    } catch (error) {
        console.log(error.message);
    }
}

const saveOrder = async (req,res)=>{
    await order.save(); 
    for(let x of order.products.item){
       await Product.updateOne({_id:x.productId},{$inc:{stock:-x.qty}})
    }
    await User.updateOne({_id:req.session.user_id},{$unset:{cart:1}})
    console.log('order successfull');
    res.send({success:true})
}
module.exports = {
    updateCart, 
    addToCart,
    addToWishlist,
    deleteFromWishlist,
    removeFromCart,
    loadCheckout,
    applyCoupon,
    placeOrder,
    saveOrder
} 