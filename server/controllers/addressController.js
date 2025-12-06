import AddressModel from '../models/address.js'


//add Address:/api/address/add

export const addAddress=async(req,res)=>{
    try{
        const {address,userId}=req.body
        await AddressModel.create({...address,userId})
        res.json({success:true,message:'Address Added successfully!!'})

    }
    catch(error)
    {
        console.log(error)
        res.json({success:false,message:error.message})

    }
}

export const getAddress = async (req, res) => {
    try {
        const { userId } = req.query; // ✅ use query
        const addresses = await AddressModel.find({ userId });
        res.json({ success: true, addresses });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};
