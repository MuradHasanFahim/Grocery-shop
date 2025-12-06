import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import ProductCard from '../components/ProductCard'

const AllProducts = () => {
  const { products, searchQuery } = useAppContext()
  const [filteredProducts, setFilteredProducts] = useState([])

  useEffect(() => {
    if (searchQuery.length > 0) {
      setFilteredProducts(
        products.filter(product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    } else {
      setFilteredProducts(products)
    }
  }, [products, searchQuery])

  return (
    <div className="mt-16 px-4 md:px-8 lg:px-16">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-10">
        <p className="text-3xl md:text-4xl font-bold uppercase text-gray-800">
          All Products
        </p>
        <div className="w-20 h-1 bg-primary rounded-full mt-2"></div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {filteredProducts
          .filter(product => product.inStock)
          .map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
      </div>

      {/* Empty State */}
      {filteredProducts.filter(product => product.inStock).length === 0 && (
        <p className="text-center text-gray-500 text-lg mt-10">
          No products available.
        </p>
      )}
    </div>
  )
}

export default AllProducts
