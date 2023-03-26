const Category = require('../models/category')
const Product = require('../models/product')

const loadCategory = async (req, res) => {
    try {
      var search = "";
      if (req.query.search) {
        search = req.query.search;
      }
      const categoryData = await Category.find({ name: { $regex: ".*" + search + ".*" } });
      res.render("admin/category", { category: categoryData, val: search, message: undefined, active: 3 });
    } catch (error) {
      console.log(error);
    }
  };

  const addCategory = async (req, res) => {
    console.log(req.body);
      try {
        let arr = []
        const categoryData = await Category.find()
        categoryData.map(x=>{
          arr.push(x.name.toUpperCase())
        })
        const category = req.body.name.toUpperCase()
        const isExisting = arr.findIndex(x => x==category)
        if(isExisting!=-1){
            state =0
        }else{
            state = 1
            if(req.body.edit){
              await Category.updateOne( { _id: req.body.id },{$set: { name: req.body.name }})
            }else{
              const cat = new Category({ name: req.body.name })
              cat.save()
            }
        }
        res.send({ state});
      } catch (error) {
        console.log(error);
      }
    }

  const deleteCategory = async (req, res) => {
    try {
      const id = req.query.id
      await Category.deleteOne({ _id: id });
      res.redirect('category')
    } catch (error) {
      console.log(error);
    }
  }
  const listCategory = async (req, res) => {
    try {
      const id = req.body.id
      console.log(id);    
      let categoryData  
      const category = await Category.findOne({ _id: id });
      if (category.isAvailable) {
         categoryData = await Category.findByIdAndUpdate({ _id: id }, { $set: { isAvailable: 0 } });
         state=0
      } else { 
         categoryData = await Category.findByIdAndUpdate({ _id: id }, { $set: { isAvailable: 1 } })
         state=1
    }
      res.send({state})
    } catch (error) {
      console.log(error);
    }
  } 
  const loadProducts = async (req, res) => {
    try {
      const productData = await Product.find();
      res.render("admin/product", { products: productData, active: 4 });
    } catch (error) {
      console.log(error.message);
    }
  };
  const loadAddProducts = async (req, res) => {
    try {
      const categoryData = await Category.find();
      res.render("admin/addProducts", { category: categoryData, message: null, active: 4 });
    } catch (error) {
      console.log(error.message);
    }
  };
  const addProduct = async (req, res) => {
    try {
      const categoryData = await Category.find();
      if (req.files.length != 0) {
        const product = Product({
          name: req.body.name,
          price: req.body.price,
          description: req.body.description,
          stock: req.body.stock,
          category: req.body.category,
          image: req.files.map((x) => x.filename)
        });
        console.log(product);
        await product.save();
        const productData = await Product.find()
        if (product) {
          res.render("admin/product", {
            message: "registration successfull.",
            products: productData, active: 4
          });
        } else {
          res.render("admin/addProducts", { message: "registration failed", category: categoryData, active: 4 });
        }
      } else {
        res.render("admin/addProducts", { message: "registration failed only jpg ,jpeg, webp & png file supported !", category: categoryData, active: 4 });
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const loadEditProducts = async (req, res) => {
    try {
      const categoryData = await Category.find();
      const productData = await Product.findOne({ _id: req.query.id });
      res.render("admin/editProduct", { product: productData, category: categoryData, active: 4 });
    } catch (error) {
      console.log(error.message);
    }
  };
  const updateImage = async(req,res)=>{
    try {
      let{pId , img}=req.body
      console.log(pId,img);
      await Product.updateOne({ _id: pId },{ $pull: { image: img } })
      const productData = Product.findOne({_id:pId})
      console.log(productData);
      res.send({ newImage: productData.image});
    } catch (error) {
      console.log(error.message);
    }
  };
  const uploadImage = async(req,res)=>{
    try {
      console.log(req.files);
      const productDetails = await Product.findOne({_id:req.body.pId })
        const oldImg = productDetails.image
        const newImg = req.files.map((x) => x.filename)
        const images = oldImg.concat(newImg)
        console.log(images);
      await Product.updateOne({ _id: req.body.pId },{ $set:{image:images} })
      const productData =await Product.findOne({_id:req.body.pId})
      console.log(productData.image);
      res.json({ newImage: productData.image});
    } catch (error) {
      console.log(error.message);
    }
  };
  
  const editProduct = async (req, res) => {
    try {
      console.log(req.files);
      if (req.files.length != 0) {
        const productDetails = await Product.findOne({_id:req.query.id })
        const oldImg = productDetails.image
        const newImg = req.files.map((x) => x.filename)
        const images = oldImg.concat(newImg)
        console.log(images);
        product = await Product.updateOne({ _id: req.query.id }, {
          $set: {
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            stock: req.body.stock,
            category: req.body.category,
            image: images
          }
        })
      } else {
        product = await Product.updateOne({ _id: req.query.id }, {
          $set: {
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            stock: req.body.stock,
            category: req.body.category,
          }
        })
      } console.log(product);
      const productData = await Product.find()
      if (productData) {
        res.render("admin/product", {
          message: "registration successfull.",
          products: productData, active: 4
        })
      } else {
        res.render("admin/product", { message: "registration failed", products: productData, active: 4 })
      }
    } catch (error) {
      console.log(error.message)
    }
  }
  const deleteProduct = async (req, res) => {
    try {
      await Product.deleteOne({ _id: req.query.id })
      res.redirect("products");
    } catch (error) {
      console.log(error.message);
    }
  } 
module.exports = {
    loadProducts,
    loadAddProducts,
    loadEditProducts,
    editProduct,
    updateImage,
    uploadImage,
    addProduct,
    deleteProduct,
    loadCategory,
    addCategory,
    listCategory,
    deleteCategory,

}