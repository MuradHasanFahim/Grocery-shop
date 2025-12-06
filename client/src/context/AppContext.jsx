import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router"; // ✅ correct import
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from 'axios'



axios.defaults.withCredentials=true
axios.defaults.baseURL=import.meta.env.VITE_BACKEND_URL


export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const currency = import.meta.VITE_CURRENCY;
    const navigate = useNavigate();
    const [user, setUser] = useState(false);
    const [isSeller, setIsSeller] = useState(false);
    const [showUserLogin, setShowUserLogin] = useState(false);
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [searchQuery,setSearchQuery]=useState([]);


    const fetchSeller=async(req,res)=>{
        try{
            const {data}=await axios.get('/api/seller/is-auth')
            if(data.success)
            {
                setIsSeller(true);
            }
            else
            {
                setIsSeller(false);
            }

        }
        catch(error)
        {
            setIsSeller(false)

        }
    }


    const fetchUser=async(req,res)=>{
        try{
            const {data}=await axios.get('/api/user/is-auth')
        if(data.success)
        {
            setUser(data.user)
            setCartItems(data.user.cartItems)
        }

        }
        catch(error)
        {
            setUser(false)
            console.log(error)
            toast.error(error.message)

        }
        
    }

 const fetchProducts = async () => {
  try {
    const { data } = await axios.get('/api/product/list')
    if (data.success) {
      setProducts(data.products)
    } else {
      console.error('Failed to fetch products:', data.message)
      toast.error('Failed to load products')
      setProducts([]) // Set empty array on failure
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    toast.error('Error loading products')
    setProducts([]) // Set empty array on error
  }
}


  

    const addToCart = (itemId) => {
        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) cartData[itemId] += 1;
        else cartData[itemId] = 1;

        setCartItems(cartData);
        toast.success("Added to Cart");
    };

    const updateCartItem=(itemId,quantity)=>{
        let cartData=structuredClone(cartItems)

        cartData[itemId]=quantity;
        setCartItems(cartData)
        toast.success("Cart Upadated")

    }

    const removeFromCart=(itemId)=>{
        let cartData=structuredClone(cartItems)
        if(cartData[itemId])cartData[itemId]-=1;
        if(cartData[itemId]===0)
            delete cartData[itemId];

        setCartItems(cartData);
        toast.success("Removed From Cart")

    }


    const getCartCount=()=>{
        let count=0;
        for (const item in cartItems)
        {
            count+=cartItems[item];

        }
        return count
    }

    const getCartAmount=()=>{
        let totalAmount=0;
        for(const items in cartItems)
        {
            let itemInfo=products.find((product)=>product._id===items);
            if(cartItems[items]>0)
                totalAmount+=itemInfo.offerPrice*cartItems[items]
        }
        return Math.floor(totalAmount*100)/100;
    }


      useEffect(() => {
        fetchProducts()
        fetchSeller()
        fetchUser()
    }, []);


useEffect(() => {
    const updateCart = async () => {
        if (!user) return; // only update if user exists
        try {
            const { data } = await axios.post("/api/cart/update", {
                userId: user._id,
                cartItems,
            });
            if (!data.success) {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    updateCart(); 
}, [cartItems, user]); // re-run whenever cartItems or user changes



    const value = {
        user,
        setUser,
        isSeller,
        setIsSeller,
        showUserLogin,
        setShowUserLogin,
        navigate,
        products,
        currency,
        cartItems,
        setCartItems,
        addToCart,
        updateCartItem,
        removeFromCart,
        searchQuery,
        setSearchQuery,getCartCount,
        getCartAmount,axios,
        fetchProducts,
       


    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
