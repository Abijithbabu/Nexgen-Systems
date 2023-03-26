const express = require("express")
const session = require("express-session");
const admin_route = express()
const auth = require("../middleware/adminAuth");
const adminController = require("../controllers/adminController");
const storeController = require('../controllers/storeController')
const productController = require('../controllers/productController')
const multer = require('../middleware/multer')

admin_route.use(session({secret: 'secertt',resave:false,saveUninitialized:true}));

admin_route.get('/', auth.isLogout, adminController.loadLogin);
admin_route.post('/', adminController.verifyLogin);

admin_route.use(auth.isLogin) 
admin_route.get('/logout', adminController.logout); 
admin_route.get('/dashboard', adminController.loadDashboard);
admin_route.get('/users', adminController.loadUsers);
admin_route.get('/block',adminController.blockUser)

admin_route.get('/category', productController.loadCategory) 
admin_route.post('/category', productController.addCategory)
admin_route.get('/deleteCategory', productController.deleteCategory)
admin_route.post('/listCategory', productController.listCategory)
admin_route.get('/products', productController.loadProducts)
admin_route.get('/addProducts', productController.loadAddProducts) 
admin_route.get('/editProducts', productController.loadEditProducts) 
admin_route.post('/updateImage', productController.updateImage)
admin_route.post('/uploadImage',multer.upload.array('image', 10), productController.uploadImage)
admin_route.post('/addProducts',multer.upload.array('image', 10), productController.addProduct)  
admin_route.post('/editProducts',multer.upload.array('image', 10), productController.editProduct)  
admin_route.get('/deleteProduct', productController.deleteProduct)  

admin_route.get('/coupons',storeController.loadCoupon)
admin_route.post('/addCoupon',storeController.addCoupon)
admin_route.post('/editCoupon',storeController.editCoupon)
admin_route.post('/listCoupon',storeController.listCoupon)
admin_route.get('/banners',storeController.loadBanner)
admin_route.post('/addBanner',multer.upload.single('image'),storeController.addBanner)
admin_route.post('/editBanner',multer.upload.single('image'),storeController.editBanner)
admin_route.post('/listBanner', storeController.listBanner)
admin_route.get('/deleteBanner',storeController.deleteBanner)
admin_route.get('/orders',storeController.loadOrders)
admin_route.get('/orderDetails',storeController.loadOrderDetails)
admin_route.post('/editOrder',storeController.changeStatus)

module.exports = admin_route;