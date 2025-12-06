import ProductModel from '../models/product.js'
import { v2 as cloudinary } from 'cloudinary';




//add product :/api/product/add

export  const addProduct=async(req,res)=>{
    try{

        let productData=JSON.parse(req.body.productData)
        const images=req.files

        let imageUrl=await Promise.all(
             images.map(async(item)=>{
                let result=await cloudinary.uploader.upload (item.path,
                {resource_type:'image'});

                return result.secure_url
            })
        )
        await ProductModel.create({...productData,image:imageUrl})
        res.json({ success: true, message: "Product added successfully" });


    }
    catch(error)
    {
        console.log(error)
        res.json({success:false,message:error.message})

    }
}

//get product: /api/product/list
//get product: /api/product/list
export const productList = async (req, res) => {
  try {
    const products = await ProductModel.find({})
    res.json({ success: true, products }) // ✅ Fixed typo: "sucess" to "success"
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}


//get single product: /api/product/id
export const productById=async (req,res)=>{
    try{
        const {id}=req.body
        const product=await ProductModel.findById(id)

        res.json({success:true, product})

    }
    catch(error)
    {
        console.log(error)
        res.json({success:false,message:error.message})

    }


}



export const changeStock=async(req,res)=>{

    try{
        const {id,inStock}=req.body

        await ProductModel.findByIdAndUpdate(id,{inStock})
        res.json({success:true,message:'Stock Updated!!'})

    }
    catch(error)
    {
        console.log(error)
        res.json({success:false,message:error.message})
    }

    
}