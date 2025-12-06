import UserModel from '../models/user.js'

//update user cartData:/api/cart/update

export const updateCart=async(req,res)=>{
    try{
        const {userId,cartItems}=req.body
        await UserModel.findByIdAndUpdate(userId,{cartItems})
        res.json({success:true,message:'Cart Updated!!'})


    }
    catch(error)
    {
        console.log(error)
        res.json({success:false,message:error.message})

    }
}