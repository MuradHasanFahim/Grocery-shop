import React from 'react'
import Navbar from './components/Navbar'
import { Routes, Route, useLocation } from 'react-router'
import { Toaster } from 'react-hot-toast'

import Home from './pages/Home'
import Footer from './components/Footer'
import { useAppContext } from './context/AppContext'
import Login from './components/Login'
import AllProducts from './pages/AllProducts'
import ProductCategory from './pages/ProductCategory'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import AddAddres from './pages/AddAddres'
import MyOrders from './pages/MyOrders'
import SellerLayout from './pages/seller/SellerLayout'
import SellerLogin from './components/seller/SellerLogin'
import AddProduct from './pages/seller/AddProduct'
import ProductList from './pages/seller/ProductList'
import Orders from './pages/seller/Orders'

const App = () => {
  const isSellerPath = useLocation().pathname.includes("seller")
  const { showUserLogin, isSeller } = useAppContext();

  return (
    <div>
      {isSellerPath ? null : <Navbar />}
      {showUserLogin && <Login />}
      <Toaster />

      <div className={`${isSellerPath ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"}`}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/products' element={<AllProducts />} />
          <Route path='/products/:category' element={<ProductCategory />} />
          <Route path='/products/:category/:id' element={<ProductDetails />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/add-address' element={<AddAddres />} />
          <Route path='/my-orders' element={<MyOrders />} />

          {/* ✅ Seller routes */}
          <Route path='/seller' element={isSeller ? <SellerLayout /> : <SellerLogin />}>
            {/* default (index) page when inside /seller */}
            <Route index element={<AddProduct />} />
            <Route path='product-list' element={<ProductList />} />
            <Route path='orders' element={<Orders />} />
          </Route>
        </Routes>
      </div>

      {!isSellerPath && <Footer />}
    </div>
  )
}

export default App
