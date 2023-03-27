const User = require('../models/userModel')
const Product = require('../models/product')
const Address = require('../models/address')
const Orders = require('../models/orders')
const Coupon = require('../models/coupon')
const loadDash = async (req, res) => {
    try {
        if(req.session.user){
        const userData = await User.findOne({_id:req.session.user_id})  
        const orderData = await Orders.find({ userId: req.session.user_id }).populate('products.item.productId')
        res.render('users/dashboard', { user: req.session.user,userData,orderData, head: 5 , active:1 })
    }else{
        res.redirect('login')
    }
    }catch (error) {
        console.log(error.message)
    }
}
const loadAddress = async (req, res) => {
    try {
        if(req.session.user){
        const addressData = await Address.find({ userId: req.session.user_id })
        res.render('users/address', { user: req.session.user, head: 5 ,address:addressData,active:3 })
    }else{
        res.redirect('login')
    }
    }catch (error) {
        console.log(error.message)
    }
}
const saveAddress = async(req,res)=>{
    try {
      const addressData = new Address({
        userId:req.session.user_id,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        country: req.body.country,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.pin,
        mobile: req.body.mno,
      })
       await addressData.save();
       res.redirect('/address');
  
  
    } catch (error) {
      console.log(error.message)
    }
  }

  const editAddress = async(req,res)=>{
    try {
      const addressData = await Address.updateOne({_id:req.body.id},{$set:{
        userId:req.session.user_id,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        country: req.body.country,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.pin,
        mobile: req.body.mno,
     } })
       res.redirect('/address');
  
  
    } catch (error) {
      console.log(error.message)
    }
  }
  const deleteAddress = async (req, res) => {
    try {
        if(req.session.user){
        const addressData = await Address.deleteOne({_id: req.query.id})
        res.redirect('/address');
        }else{
        res.redirect('login')
    }
    }catch (error) {
        console.log(error.message)
    }
}

  const loadOrders = async function (req,res) {
    try {
        const orderData = await Orders.find({ userId: req.session.user_id }).populate('products.item.productId')
        res.render('users/orders',{active:2,user: req.session.user,u_id:req.session.user_id, orders:orderData, head: 5})
    } catch (error) {
        console.log(error.message);
    }
  }
  const loadOrderDetails = async (req,res)=>{
    try {
      const orderData = await Orders.findOne({_id:req.query.id}).populate('userId')
      const productData = await orderData.populate('products.item.productId')
      res.render('users/orderDetails',{active:2,user: req.session.user, order:orderData, head: 5, products:productData.products})
    } catch (error) {
      console.log(error.message);
    }
  } 
  
  const updateRating = async (req,res)=>{
      let{rating,_id}= req.body
      const user = req.session.user_id
      const product = await Product.findOne({_id:_id})
      rating = parseInt(rating)
      const index = product.Rating.findIndex(obj => obj.user === user);
  if (index != -1) {
    product.Rating[index].rating = rating;
  } else {
    // if the key doesn't exist, add it to the array
    product.Rating.push({ user, rating }); 
  }
  console.log(product.Rating);
  let sum = 0 
  const num = parseInt(product.Rating.length)
  product.Rating.map(x=>sum += x.rating)
  const star = sum/num
  console.log(star);
  await Product.updateOne({_id:_id},{$set:{Rating:product.Rating,star:star}})
  res.send({rat:product.Rating})
  }

  const changeStatus = async (req,res)=>{
    try {
      await Orders.updateOne({_id:req.body.id},{status:req.body.status})
      const orderData =  await Orders.findOne({_id:req.body.id})
      if(req.body.status=='Cancelled' && orderData.payment!='COD'){
        const userData = await User.findOne({_id:orderData.userId})
        await User.updateOne({_id:orderData.userId},{$set:{wallet:userData.wallet + orderData.amount}})
         console.log(userData,userData.wallet);
      }
      if(orderData){
        console.log(orderData);
      res.send({ state:1});
      }
    } catch (error) {
      console.log(error.message);
    }
  }  
  const loadProfile = async (req,res)=> {
    try {
        const userData = await User.findOne({_id:req.session.user_id})
        res.render('users/profile',{active:4,user: req.session.user, head: 5,userData})
    } catch (error) {
        console.log(error.message);
    }
  }

  const editUser = async (req,res)=>{
     try {
      if(req.file.filename){
      await User.updateOne({_id:req.session.user_id},{$set:{
        name:req.body.name,
        email:req.body.email,
        mobile:req.body.mno,
        profile:req.file.filename
      }})
    }else{
      await User.updateOne({_id:req.session.user_id},{$set:{
        name:req.body.name,
        email:req.body.email,
        mobile:req.body.mno,
      }})
    }
      const userData = await User.findOne({_id:req.session.user_id})
      res.render('users/profile',{active:4,user: req.session.user, head: 5,userData})

     } catch (error) {
      
     }
  }
module.exports = {
    loadDash,
    loadOrders,
    loadOrderDetails,
    updateRating,
    changeStatus,
    loadProfile,
    editUser,
    loadAddress,
    saveAddress,
    editAddress,
    deleteAddress
}