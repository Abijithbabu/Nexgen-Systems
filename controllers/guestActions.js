const User = require('../models/userModel')
const Category = require('../models/category')
const Product = require('../models/product')
const Banner = require('../models/banner')
let session
const loadHome = async (req, res) => {
    try {
        productData = await Product.find()
        const bannerData = await Banner.find({isAvailable:1})
        if (req.session.user) { session = req.session.user } else session = false
        res.render('users/home', { user: session, product: productData, banner:bannerData, head: 1 })
    }
    catch (error) {
        console.log(error.message)
    }
}
const loadProducts = async (req, res) => {
    try {
        const categoryData = await Category.find()
        let { search, sort, category, limit, page,rating,ajax } = req.query
        if (!search) {
            search = ''
        }
        skip=0
        start = 0
        end = 50000
        if(!limit){
            limit=15
        }
        if(!page){
            page=0
        }
        if(!rating){
            rating=0
        }
        skip=page*limit
        console.log(category);
        let arr = []
        if (category) {
            for (i = 0; i < category.length; i++) {
                arr = [...arr, categoryData[category[i]].name]
            }
        } else {
            category = []
            arr = categoryData.map((x) => x.name)
        }
        console.log('sort ' + req.query.sort);
        console.log('category ' + arr);
        if (sort == 0) {
            productData = await Product.find({ isAvailable:1, $and: [{ category: arr },{star:{$gte:rating}}, { price:{$gte:start,$lte:end} }, { $or: [{ name: { $regex: '' + search + ".*" } }, { category: { $regex: ".*" + search + ".*" } }] }] }).sort({$natural:-1})
            pageCount = Math.floor(productData.length/limit)
            if(productData.length%limit >0){
                pageCount +=1
            }
            console.log(productData.length + ' results found '+pageCount);
            productData = await Product.find({ isAvailable:1, $and: [{ category: arr },{star:{$gte:rating}},  { price:{$gte:start,$lte:end} }, { $or: [{ name: { $regex: '' + search + ".*" } }, { category: { $regex: ".*" + search + ".*" } }] }] }).sort({$natural:-1}).skip(skip).limit(limit)
        } else {
            productData = await Product.find({ isAvailable:1, $and: [{ category: arr },{star:{$gte:rating}},  { price:{$gte:start,$lte:end} }, { $or: [{ name: { $regex: '' + search + ".*" } }, { category: { $regex: ".*" + search + ".*" } }] }] }).sort({ price: sort })
            pageCount = Math.floor(productData.length/limit)
            if(productData.length%limit >0){
                pageCount +=1
            }
            console.log(productData.length + ' results found '+pageCount);
            productData = await Product.find({ isAvailable:1, $and: [{ category: arr },{star:{$gte:rating}},  { price:{$gte:start,$lte:end} }, { $or: [{ name: { $regex: '' + search + ".*" } }, { category: { $regex: ".*" + search + ".*" } }] }] }).sort({ price: sort }).skip(skip).limit(limit)
        }
        console.log(productData.length + ' results found');
        if (req.session.user) { 
            userData =await User.findById({ _id:req.session.user_id })
            session = req.session.user
        } else{
             session = false
             userData =''
        }console.log(userData);
        if(pageCount==0){pageCount=1}
        if(ajax){
        res.json({products: productData,pageCount,page})
        }else{
        res.render('users/products', { user: session,userData, products: productData, category: categoryData, val: search, selected: category, order: sort, limit: limit,pageCount,page, head: 2 })
        }
    } catch (error) {
        console.log(error.message);
    }
}
const loadProductDetails = async (req, res) => {
    try {
        productData = await Product.findOne({ _id: req.query.id })
        productsData = await Product.find({ category: productData.category })
        if (req.session.user) { session = req.session.user } else session = false
        res.render('users/productDetail', { user: session, products: productsData, product: productData, head: 2 })
    } catch (error) {
        console.log(error.message);
    }
}
const loadWishList = async (req, res) => {
    try {
        if(req.session.user_id){
            const userData =await User.findById({ _id:req.session.user_id })
            const wishData = await userData.populate('wishlist.item.productId')
        res.render('users/wishList', { user: session, products:wishData.wishlist, head: 3 })
        }else{
            res.render('users/wishList', { user: session,products:null, head: 3 })

        }
    } catch (error) {
        console.log(error);
    }
}
const loadCart = async (req, res) => { 
    try {
        if(req.session.user_id){
            const userData =await User.findById({ _id:req.session.user_id })
            const cartData = await userData.populate('cart.item.productId')
        res.render('users/cart', { user: session, head: 4 ,products:cartData.cart })}
        else{
            res.render('users/cart', { user: session, head: 4 ,products:null })
        }
    } catch (error) {
        console.log(error);
    }
}   
module.exports = {
    loadHome,
    loadProducts,
    loadProductDetails,
    loadCart,
    loadWishList,
}