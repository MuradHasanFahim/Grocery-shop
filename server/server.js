import express from 'express';
import cookieParser from 'cookie-parser';  // ✅ import added
import dotenv from 'dotenv';
import cors from 'cors'
import connectDB from './configs/db.js';
import 'dotenv/config'
import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import connectCloudinary from './configs/cloudinary.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';


//const uri = "mongodb+srv://fahim:fahim123@grocerycluster.deob5sz.mongodb.net/?retryWrites=true&w=majority&appName=GroceryCluster";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

await connectDB()
await connectCloudinary()

const allowedOrigins=['http://localhost:5173']

app.use(express.json());
app.use(cookieParser());
app.use(cors({origin:allowedOrigins,credentials:true})) // ✅ works now

app.get('/', (req, res) => res.send("API is Working 🚀"));
app.use('/api/user',userRouter)
app.use('/api/seller',sellerRouter)
app.use('/api/product',productRouter)
app.use('/api/cart',cartRouter)
app.use('/api/address',addressRouter)
app.use('/api/order',orderRouter)




app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
