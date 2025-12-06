import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from "axios";

// ✅ Correct axios config
axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

    // ✅ Correct Vite env usage
    const currency = import.meta.env.VITE_CURRENCY;

    const navigate = useNavigate();
    const [user, setUser] = useState(false);
    const [isSeller, setIsSeller] = useState(false);
    const [showUserLogin, setShowUserLogin] = useState(false);
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [searchQuery, setSearchQuery] = useState([]);

    // ------------------ AUTH CHECKS --------------------
    const fetchSeller = async () => {
        try {
            const { data } = await axios.get("/api/seller/is-auth");
            setIsSeller(data.success ? true : false);
        } catch {
            setIsSeller(false);
        }
    };

    const fetchUser = async () => {
        try {
            const { data } = await axios.get("/api/user/is-auth");
            if (data.success) {
                setUser(data.user);
                setCartItems(data.user.cartItems);
            }
        } catch (error) {
            setUser(false);
            console.log(error);
            toast.error(error.message);
        }
    };

    // ------------------ PRODUCTS -----------------------
    const fetchProducts = async () => {
        try {
            const { data } = await axios.get("/api/product/list");
            if (data.success) {
                setProducts(data.products);
            } else {
                toast.error("Failed to load products");
                setProducts([]);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            toast.error("Error loading products");
            setProducts([]);
        }
    };

    // ------------------ CART FUNCTIONS -----------------
    const addToCart = (itemId) => {
        const cartData = structuredClone(cartItems);
        cartData[itemId] = (cartData[itemId] || 0) + 1;
        setCartItems(cartData);
        toast.success("Added to Cart");
    };

    const updateCartItem = (itemId, quantity) => {
        const cartData = structuredClone(cartItems);
        cartData[itemId] = quantity;
        setCartItems(cartData);
        toast.success("Cart Updated");
    };

    const removeFromCart = (itemId) => {
        const cartData = structuredClone(cartItems);
        if (cartData[itemId]) cartData[itemId] -= 1;
        if (cartData[itemId] === 0) delete cartData[itemId];
        setCartItems(cartData);
        toast.success("Removed From Cart");
    };

    const getCartCount = () => {
        return Object.values(cartItems).reduce((a, b) => a + b, 0);
    };

    const getCartAmount = () => {
        let total = 0;
        for (const id in cartItems) {
            const item = products.find((p) => p._id === id);
            if (item) total += item.offerPrice * cartItems[id];
        }
        return Math.floor(total * 100) / 100;
    };

    // ------------------ INITIAL DATA LOAD --------------
    useEffect(() => {
        fetchProducts();
        fetchSeller();
        fetchUser();
    }, []);

    // ------------------ UPDATE CART IN BACKEND ---------
    useEffect(() => {
        const updateCart = async () => {
            if (!user) return;
            try {
                const { data } = await axios.post("/api/cart/update", {
                    userId: user._id,
                    cartItems,
                });
                if (!data.success) toast.error(data.message);
            } catch (error) {
                toast.error(error.message);
            }
        };

        updateCart();
    }, [cartItems, user]);

    // ------------------ CONTEXT VALUE -------------------
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
        setSearchQuery,
        getCartCount,
        getCartAmount,
        axios,
        fetchProducts,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
