const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"please Enter Product Name"],
        trim:true
    },
    description:{
        type:String,
        required:[true,"Please Enter Porduct Description"]
    },
    price:{
        type:Number,
        required:[true,"Please Enter Product Price"],
        maxlength:[8,"Price Cannot Exceed 8 Characters"]
    },
    rating:{
        type:Number,
        default:0
    },
    images:[
        {
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true,
            }
        }
    ],
    category:{
        type:String,
        required:[true,"Please Enter Product Category"]
    },
    stock:{
        type:Number,
        required:[true,"Please Enter Product Stock"],
        maxlength:[4,"Stock cannot exceed 4 characters"],
        default:1
    },
    noOfReviews:{
        type:Number,
        default:0,
    },
    reviews:[
        {
            user:{
                type:mongoose.Schema.ObjectId,
                ref:"User",
                required:true,
            },
            name:{
                type:String,
                required:true,
            },
            rating:{
                type:Number,
                required:true
            },
            comment:{
                type:String,
                required:true
            }
        }
    ],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now
    }

})

module.exports = new mongoose.model("Product",productSchema);