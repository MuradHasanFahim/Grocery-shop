import React, { useEffect } from "react";
import { assets } from "../assets/assets";
import { NavLink } from "react-router";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Navbar = () => {
    const [open, setOpen] = React.useState(false);
    const { user, setUser, setShowUserLogin, navigate,setSearchQuery,searchQuery,getCartCount,axios} = useAppContext();

 const logout = async () => {
  try {
    const { data } = await axios.get('/api/user/logout');
    if (data.success) {
      toast.success(data.message);
      setUser(null);
      navigate('/');
    } else {
      toast.error(data.message || 'Logout failed');
    }
  } catch (error) {
    console.error('Logout error:', error);
    toast.error( error.message);
  }
};


    useEffect(()=>{
        if(searchQuery>0)
          navigate('/products')

    },[searchQuery])

    return (
        <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative">
            <NavLink to="/" onClick={() => setOpen(false)}>
                <img className="h-9" src={assets.logo} alt="logo" />
            </NavLink>

            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center gap-8">
                <NavLink to="/">Home</NavLink>
                <NavLink to="/products">All Product</NavLink>
                <NavLink to="/">Contact</NavLink>

                {/* Search */}
                <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
                    <input onChange={(e)=>setSearchQuery(e.target.value)}
                        className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
                        type="text"
                        placeholder="Search products"
                    />
                    <img
                        src={assets.search_icon}
                        alt="search"
                        className="w-4 h-4"
                    />
                </div>

                {/* Cart */}
                <div
                    onClick={() => navigate("/cart")}
                    className="relative cursor-pointer"
                >
                    <img
                        src={assets.nav_cart_icon}
                        alt="cart"
                        className="w-6"
                    />

                    <span className="absolute -top-2 -right-3 flex items-center justify-center text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">
                        {getCartCount()}
                    </span>
                </div>

                {!user ? (
                    <button
                        onClick={() => setShowUserLogin(true)}
                        className="px-8 py-2 bg-primary hover:bg-primary-dull text-white rounded-full"
                    >
                        Login
                    </button>
                ) : (
                    <div className="relative">
                        <img
                            src={assets.profile_icon}
                            alt="Profile"
                            className="w-10 h-10 rounded-full border border-gray-300 cursor-pointer transition-transform duration-200 hover:scale-105"
                            onClick={() => setOpen(!open)} // toggle dropdown
                        />

                        {open && (
                            <ul className="absolute top-12 right-0 bg-white shadow-lg border border-gray-200 py-2 w-36 rounded-lg text-sm z-50 transition-all duration-200">
                                <li
                                    onClick={() => {
                                        navigate("/my-orders");
                                        setOpen(false); // close dropdown after click
                                    }}
                                    className="px-4 py-2 hover:bg-primary/10 cursor-pointer rounded-md transition-colors"
                                >
                                    My Orders
                                </li>
                                <li
                                    onClick={() => {
                                        logout();
                                        setOpen(false); // close dropdown after click
                                    }}
                                    className="px-4 py-2 hover:bg-primary/10 cursor-pointer rounded-md transition-colors"
                                >
                                    Log Out
                                </li>
                            </ul>
                        )}
                    </div>
                )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
                onClick={() => setOpen(!open)}
                aria-label="Menu"
                className="sm:hidden hover:cursor-pointer"
            >
                <img src={assets.menu_icon} alt="menu" className="" />
            </button>

            {/* Mobile Menu */}
            {open && (
                <div
                    className={`${
                        open ? "flex" : "hidden"
                    } absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden`}
                >
                    <NavLink to="/" onClick={() => setOpen(false)}>
                        Home
                    </NavLink>
                    <NavLink to="/products" onClick={() => setOpen(false)}>
                        Add Product
                    </NavLink>
                    {user && (
                        <NavLink to="/" onClick={() => setOpen(false)}>
                            My Orders
                        </NavLink>
                    )}
                    <NavLink to="/" onClick={() => setOpen(false)}>
                        COntact
                    </NavLink>
                    {!user ? (
                        <button
                            onClick={() => {
                                setOpen(false);
                                setShowUserLogin(true);
                            }}
                            className="px-6 py-2 mt-2 bg-primary hover:bg-primary-dull text-white rounded-full text-sm"
                        >
                            Login
                        </button>
                    ) : (
                        <button
                            onClick={logout}
                            className="px-6 py-2 mt-2 bg-primary hover:bg-primary-dull text-white rounded-full text-sm"
                        >
                            LogOut
                        </button>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
