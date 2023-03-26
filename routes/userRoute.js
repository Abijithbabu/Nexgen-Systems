const express = require("express");
const session = require("express-session");
const user_route = express.Router()
const blockUser = require('../middleware/blockUser')
const auth = require("../middleware/auth");
const userController = require("../controllers/userController");
const userActions = require('../controllers/userActions')
const guestActions = require('../controllers/guestActions')
const userDashboard = require('../controllers/userDashboard')
const multer = require('../middleware/multer')

user_route.use( session({secret: 'sessionSecret',resave: false,saveUninitialized: true }))
user_route.use(express.static('public/user'));
user_route.use('/', blockUser)

user_route.get("/",guestActions.loadHome);
user_route.get('/products', guestActions.loadProducts)
user_route.get('/productDetail', guestActions.loadProductDetails)
user_route.get('/wishList',guestActions.loadWishList)
user_route.get('/cart',guestActions.loadCart)

user_route.get("/login", auth.isLogout, userController.loginLoad);
user_route.post("/login", userController.verifyLogin);
user_route.post('/forget',userController.verifyforget)
user_route.get("/logout", auth.isLogin, userController.userLogout);
user_route.post('/resetPassword',userController.resetPassword)
user_route.get("/register", auth.isLogout, userController.loadRegister);
user_route.post("/register", userController.loadOtp);
user_route.get('/resendOtp',  userController.resendOtp)
user_route.get('/verifyOtp', userController.verifyOtp)

user_route.get('/dashboard', userDashboard.loadDash)
user_route.get('/address', userDashboard.loadAddress)
user_route.post('/address', userDashboard.saveAddress)
user_route.post('/editAddress', userDashboard.editAddress)
user_route.get('/deleteAddress', userDashboard.deleteAddress)
user_route.get('/profile', userDashboard.loadProfile)
user_route.post('/editUser',multer.upload.single('image'),userDashboard.editUser)
user_route.get('/orders', userDashboard.loadOrders)
user_route.get('/orderDetails', userDashboard.loadOrderDetails)
user_route.post('/updateRating',userDashboard.updateRating)

user_route.post('/updateCart',userActions.updateCart)
user_route.get('/addToCart',userActions.addToCart)
user_route.get('/removeFromCart',userActions.removeFromCart)
user_route.get('/addToWishList',userActions.addToWishlist)
user_route.get('/deleteFromWishList',userActions.deleteFromWishlist)
user_route.get('/checkout',userActions.loadCheckout) 
user_route.post('/applyCoupon',userActions.applyCoupon)
user_route.post('/placeOrder',userActions.placeOrder) 
user_route.get('/orderSuccess',userActions.saveOrder)

module.exports = user_route;
