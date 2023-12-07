const catchAsyncError = require("../middleware/catchAsyncError.js");
const Product = require("../model/productModel.js");
const ApiFeatures = require("../utils/apifeatures.js");
const ErrorHandler = require("../utils/errorHandler.js");
const cloudinary = require("cloudinary");


// create Product -- Admin

exports.createProduct = catchAsyncError(async(req,res,next)=>{

    let images = [];
    if(typeof req.body.images === "string"){
        images.push(req.body.images);
    }
    else{
      images = req.body.images;
    }

    const imagesLinks = [];

    for(let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i],{
            folder:"Products",
        })
        imagesLinks.push({
            public_id:result.public_id,
            url:result.secure_url,
        });
    };

    req.body.images = imagesLinks;
    req.body.user = req.user.id;

    const product = await Product.create(req.body);
    res.status(200).json({success:true,product});

});


// Get all product

exports.getAllProductss = catchAsyncError(async(req,res,next)=>{
    

    const resultPerPage = 8;
    const productsCount = await Product.countDocuments();  
     
    const apiFeature = new ApiFeatures(Product.find(),req.query)
    .search()
    .filter()


     let products = await apiFeature.query;

     let filteredProductsCount = products.length;

     apiFeature.pagination(resultPerPage);

    // products = await apiFeature.query;
    res.status(200).json({
        success:true,   
        products,
        productsCount,
        resultPerPage,
        filteredProductsCount
    });

});

// Get all product(Admin)

exports.getAdminProducts = catchAsyncError(async(req,res,next)=>{
    const products = await Product.find();

    res.status(200).json({
        success:true,   
        products,
    });

});

// update product --Admin

exports.updateProduct = catchAsyncError(async(req,res,next)=>{
    let product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("Product not found",404));
    }
    product = await Product.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true,useFindAndModify:false});
    res.status(200).json({success:true,product});
});

// Delete product --Admin

exports.deleteProduct = catchAsyncError(async(req,res,next)=>{
    const product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler("Product Not Found",404));
    }

    // Deleting Images from Cloudinary
    for(let i = 0; i < product.images.length; i++){
        await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    await product.deleteOne();
    res.status(200).json({success:true,message:"product deleted successfully"});
});

// Get Product details

exports.getProductDetails = catchAsyncError(async(req,res,next)=>{
    const product = await Product.findById(req.params.id);
    if(!product){
       return next(new ErrorHandler("Product not found",404));
    }
    res.status(200).json({success:true,product});
});

// Create new review or update the review
exports.createProductReview = catchAsyncError(async(req,res,next)=>{

    const {rating,comment,productId} = req.body;

    const review = {
        user:req.user.id,
        name:req.user.name,
        rating:Number(rating),
        comment,
    }
    const product =await Product.findById(productId);

    const isReviewed = product.reviews.find(
        (rev)=> rev.user.toString()===req.user._id.toString());

    if(isReviewed){
        product.reviews.forEach((rev)=>{
            if(rev.user.toString() === req.user._id.toString())
            (rev.rating = rating),( rev.comment = comment)
        });
    }else{
        product.reviews.push(review);
        product.noOfReviews = product.reviews.length;
    }
    let avg = 0;

    product.reviews.forEach((rev)=>{
        avg += rev.rating;
    })

    product.rating = avg / product.reviews.length;


    await product.save({ validateBeforeSave:false });

    res.status(200).json({
        success:true
    });
});

// Get all review of a product
exports.getProductReviews = catchAsyncError(async(req,res,next)=>{
    const product = await Product.findById(req.query.id);

    if(!product){
        return next(new ErrorHandler("Product not found",404));
    }
    res.status(200).json({success:true,reviews:product.reviews});
});

// Delete review
exports.deleteReview = catchAsyncError(async(req,res,next)=>{
    const product = await Product.findById(req.query.productId);

    if(!product){
        return next(new ErrorHandler("Product not found",404));
    }

    const reviews = product.reviews.filter(
        (rev) => rev._id.toString() !== req.query.id.toString()
    );

    let avg = 0;

    reviews.forEach((rev)=>{
        avg += rev.rating;
    });

    const ratings = avg/ reviews.length;

    const noOfReviews = reviews.length;

    await Product.findByIdAndUpdate(req.query.productId,
        {reviews,ratings,noOfReviews},
        {new:true,runValidators:true,useFindAndModify:false}
        );

    res.status(200).json({
        success:true,
    });
});
