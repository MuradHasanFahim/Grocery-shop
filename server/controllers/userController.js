import UserModel from "../models/user.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'


//register user:api/user/register

export const registerUser=async(req,res)=>{
    try{

        const{name,email,password}=req.body
        if(!name||!email||!password)
        {
            return res.json({success:false,message:'Missing Details'})
        }

        const existingUser=await UserModel.findOne({email})
        if(existingUser)
        {
            return res.json({success:false,message:'User Already Exists!'})

        }

        const hashedPassword= await bcrypt.hash(password,10)

        const user=await UserModel.create({name,email,password:hashedPassword})

        const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'})

        res.cookie('token',token,{
            httpOnly:true, //prevent javascript to access cookie
            secure:process.env.NODE_ENV==='production',
            sameSite:process.env.NODE_ENV==='production'?'none':'strict',
            maxAge:7*24*60*60*1000,
        })
        
        return res.json({success:true,user:{email:user.email,name:user.name}})


    }
    catch(error)
    {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}


export const loginUser=async(req,res)=>{

    try{

        const {email,password}=req.body;
        if(!email||!password)
        {
            return res.json({success:false,messag:'Email and Password are required!!'})
        }

        const user=await UserModel.findOne({email})
        if(!user)
        {
            res.json({success:false,message:'User is not found!!'})
        }
        const isMatch= await bcrypt.compare(password,user.password)
        if(!isMatch)
        {
            return res.json({success:false,messag:'Invalid email or password!!'})
        }

        const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'})

        res.cookie('token',token,{
            httpOnly:true, //prevent javascript to access cookie
            secure:process.env.NODE_ENV==='production',
            sameSite:process.env.NODE_ENV==='production'?'none':'strict',
            maxAge:7*24*60*60*1000,
        })

        return res.json({success:true,user:{email:user.email,name:user.name}})




    }
    catch(error)
    {
        console.log(error);
        res.json({success:false,message:error.message})

    }
}



export const isAuth = async (req, res) => {
    try {
        // Get userId from req.user (set by authUser middleware) instead of req.body
        const userId = req.user.id;
        const user = await UserModel.findById(userId).select('-password');
        return res.json({ success: true, user })

    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

export const logout=async(req,res)=>{
    try{
        res.clearCookie('token',{
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite:process.env.NODE_ENV==='production'?'none':'strict',
        })
        return res.json({success:true,message:'Logged Out!!'})
    }
    catch(error)
    {
        console.log(error);
        res.json({success:false,message:error.message})

    }
}