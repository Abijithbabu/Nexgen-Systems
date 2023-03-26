const Coupons = require('../models/coupon')
const Banner = require('../models/banner')
const Order = require('../models/orders')
const User = require('../models/userModel')

const loadBanner = async (req,res)=>{
    try {
      const bannerData = await Banner.find()
      res.render('admin/banners',{active:6,val:'',banner:bannerData})
    } catch (error) {
      
    }
      }
      const addBanner = async (req,res)=>{
        try {
          const banner = new Banner({
            name : req.body.name,
            url: req.body.url,
            description:req.body.description,
            image:req.file.filename
          })
          await banner.save()
          res.redirect('/admin/banners')
        } catch (error) {
          console.log(error.message);
        }
      }
      const editBanner = async (req,res)=>{
        try {
          const id = req.body.id
          if(req.file){
            fields = {
            name : req.body.name,
            url: req.body.url,
            description:req.body.description,
            image:req.file.filename
            }
          }else{
            fields = {
              name : req.body.name,
              url: req.body.url,
              description:req.body.description,
              }
          }
          bannerData = await Banner.findByIdAndUpdate({ _id: id }, { $set: fields})
          res.redirect('/admin/banners')
        } catch (error) {
          console.log(error.message);
        }
      }
      const listBanner = async (req, res) => {
        try {
          const id = req.body.id
          const coupon = await Banner.findOne({ _id: id });
          if (coupon.isAvailable) {
             await Banner.findByIdAndUpdate({ _id: id }, { $set: { isAvailable: 0 } });
             state=0
          } else { 
             await Banner.findByIdAndUpdate({ _id: id }, { $set: { isAvailable: 1 } })
             state=1
        }
          res.send({state})
        } catch (error) {
          console.log(error);
        }
      } 
      const deleteBanner = async (req, res) => {
        try {
          const id = req.query.id
          await Banner.deleteOne({ _id: id });
          res.redirect('banners')
        } catch (error) {
          console.log(error);
        }
      }


      const loadCoupon = async (req,res)=>{
        try {
          const couponData = await Coupons.find()
          res.render('admin/coupon',{message: undefined, active: 5 , val:'' , coupon:couponData})
        } catch (error) {
          console.log(error.message);
        }
      }
      const addCoupon = async (req,res)=>{
        try {
          let {name, discount, maxDiscount, minValue} = req.body
          const coupon = new Coupons({
            name : name,
            discount: discount,
            max:maxDiscount,
            min:minValue
          })
          await coupon.save()
          res.redirect('coupons')
        } catch (error) {
          console.log(error.message);
        }
      }  
      const editCoupon = async (req,res)=>{
        try {
          let {id, name, discount, maxDiscount, minValue} = req.body
          await Coupons.updateOne({_id:id},{$set:{
            name : name,
            discount: discount,
            max:maxDiscount,
            min:minValue
        }})
          res.redirect('coupons')
        } catch (error) {
          console.log(error.message);
        }
      } 
      const listCoupon = async (req, res) => {
        try {
          const id = req.body.id
          console.log(id);    
          let couponData  
          const coupon = await Coupons.findOne({ _id: id });
          if (coupon.isAvailable) {
             couponData = await Coupons.findByIdAndUpdate({ _id: id }, { $set: { isAvailable: 0 } });
             state=0
          } else { 
             couponData = await Coupons.findByIdAndUpdate({ _id: id }, { $set: { isAvailable: 1 } })
             state=1
        }
          res.send({state})
        } catch (error) {
          console.log(error);
        }
      } 


      const loadOrders = async (req,res)=>{
        try {
          const orderData = await Order.find({}).populate('userId')
          res.render('admin/orders',{message: undefined, active: 7 , val:'' , orders:orderData})
        } catch (error) {
          console.log(error.message);
        }
      }     
      const loadOrderDetails = async (req,res)=>{
        try {
          const orderData = await Order.findOne({_id:req.query.id}).populate('userId')
          const userData = await orderData.populate('userId')
          const productData = await orderData.populate('products.item.productId')
          res.render('admin/orderDetails',{message: undefined, active: 7 , val:'' , order:orderData,user:userData,products:productData.products})
        } catch (error) {
          console.log(error.message);
        }
      }  
      const changeStatus = async (req,res)=>{
        try {
          await Order.updateOne({_id:req.body.id},{status:req.body.status})
          const orderData =  await Order.findOne({_id:req.body.id})
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
      module.exports = {
        loadCoupon,
        addCoupon,
        editCoupon,
        listCoupon,
        loadBanner,
        addBanner,
        editBanner,
        listBanner,
        deleteBanner,
        loadOrders,
        loadOrderDetails,
        changeStatus 
      }