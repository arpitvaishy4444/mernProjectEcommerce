const ErrorHandler = require("../utils/errorHandler.js");
const catchAsyncError = require("../middleware/catchAsyncError.js");
const User = require("../model/userModel.js");
const sendToken = require("../utils/jwtToken.js");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");


// Register a User 
exports.registerUser = catchAsyncError(async(req,res,next)=>{

    const mycloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
        folder: "avatars",
        width:150,
        crop:"scale",
    });

    const {name,email,password} = req.body;

    const user = await User.create({
        name,email,password,
        avatar:{
            public_id: mycloud.public_id,
            url: mycloud.secure_url,
        }
    });

    sendToken(user,201,res);
});

// LOG IN a USER

exports.loginUser= catchAsyncError(async(req,res,next)=>{
    const {email,password} = req.body;

    // checking if user has given email and password both
    if(!email || !password){
        return next(new ErrorHandler("please Enter Email & Password",400))
    }
    const user = await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("Invalid Email or Password",401));
    }
    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid Email or Password",401))
    }
    
    sendToken(user,200,res);
});

// Logout a User
exports.logoutUser = catchAsyncError(async(req,res,next)=>{

    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true,
    });

    res.status(200).json({
        success:true,
        message:"Logged Out",
    });
});

// Forgot Password

exports.forgotpassword = catchAsyncError(async(req,res,next)=>{
    const user = await User.findOne({email:req.body.email});
    if(!user){
        return next(new ErrorHandler("User not found",404))
    }

    // Get ResetPassord Token
    const resetToken = user.getResetPasswordToken();
    
    await user.save({validateBeforeSave:false});

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset${resetToken}`;

    const message = `Your Password Reset Token is temp :- \n\n ${resetPasswordUrl} 
    \n\n If you have not requested this email then please ignore it.`;

    try {
        await sendEmail({
            email:user.email,
            subject:`Ecommerce Password Recovery`,
            message,
        });
        res.status(200).json({
            success:true,
            message:`Email sent to ${user.email} successfully`,
        });
        
    } catch (error) {
        user.resetPasswordToken= undefined;
        user.resetPasswordExpire = undefined;
        await user.save({validateBeforeSave:false});

        return next(new ErrorHandler(error.message))
        
    }


});

// Reset Password

exports.resetPassword = catchAsyncError(async (req ,res ,next)=>{

    // creating token hash
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{ $gt: Date.now() },
    });

    if(!user){
        return next(new ErrorHandler("Reset Password Token is invalid or has been expired",400));
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("Password does not match",400));
    }

    user.password =  req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    sendToken(user,200,res);

});

// Get User Details
exports.getUserDetais = catchAsyncError(async(req,res,next)=>{

    const user = await User.findById(req.user.id);
    res.status(200).json({success:true,user,});
});

// Update user Password
exports.updatePassword = catchAsyncError(async(req,res,next)=>{

    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Old Password is incorrect",400));
    }
    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHandler("Password does not match",400));
    }
    user.password = req.body.newPassword;

    await user.save();

    sendToken(user,200,res);

});

// Update user Profile
exports.updateProfile = catchAsyncError(async(req,res,next)=>{

   const newUserData = {
    name:req.body.name,
    email:req.body.email,
   }

   if(req.body.avatar == ""){
    const user = await User.findById(req.user.id);
    
    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);

    const mycloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
        folder: "avatars",
        width:150,
        crop:"scale",
    });
    newUserData.avatar = {
        public_id:mycloud.public_id,
        url:mycloud.secure_url,
    };
   }


const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new:true,
    runValidators:true,
    useFindAndModify:false,
});

res.status(200).json({
    success:true,
});

});
// Get all users (Admin)

exports.getAllUsers = catchAsyncError(async(req,res,next)=>{
    const users = await User.find();

    res.status(200).json({
        success:true,
        users
    });
});

// Get Single User (Admin)
exports.getSingleUser = catchAsyncError(async(req,res,next)=>{
    const user =await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User does not exist with Id:${req.params.id}`));  
    }
    res.status(200).json({
        success:true,
        user,
    });
});

// Update user Role --Admin
exports.updateUserRole = catchAsyncError(async(req,res,next)=>{

    const newUserData = {
     name:req.body.name,
     email:req.body.email,
     role:req.body.role,
    }
 

 const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
     new:true,
     runValidators:true,
     useFindAndModify:false,
 });

 if(!user){
    return next(new ErrorHandler(`user does not exist with Id: ${req.params.id}`,400))
 }
 res.status(200).json({
     success:true,
 });
 
 });

// Delete user --Admin

exports.deleteUser = catchAsyncError(async(req,res,next)=>{
    const user = await User.findById(req.params.id);
   

    if(!user){
        return next(
            new ErrorHandler(`user does not exist with id: ${req.param.id}`));
    }
    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);
    await user.deleteOne();
    
    res.status(200).json({success:true,message:"User Deleted Successfully"});
})