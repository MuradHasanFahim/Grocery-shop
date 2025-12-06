import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { assets, dummyOrders } from "../../assets/assets";
import toast from "react-hot-toast";

const Orders = () => {
    const { currency,axios } = useAppContext();
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
       try{
        
        const {data}=await axios.get('/api/order/seller')
        if(data.success)
        {
            setOrders(data.orders)
        }
        else{
            toast.error(data.error)
        }


       }
       catch(error)
       {
        console.log(error)
        toast.error(error.message)

       }
    };

    useEffect(() => {
        fetchOrders();
    }, []);
    return (
        <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll">
            <div className="md:p-10 p-4 space-y-4">
                <h2 className="text-lg font-medium">Orders List</h2>
                {orders.map((order, index) => (
                    <div
                        key={index}
                        className="grid grid-cols-1 md:grid-cols-4 gap-5 p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all bg-white"
                    >
                        {/* Items */}
                        <div className="flex items-start gap-4">
                            <img
                                className="w-14 h-14 object-cover bg-gray-100 rounded-md"
                                src={assets.box_icon}
                                alt="boxIcon"
                            />
                            <div className="space-y-1">
                                {order.items.map((item, i) => (
                                    <p
                                        key={i}
                                        className="font-medium text-gray-700"
                                    >
                                        {item.product.name}
                                        <span className="text-primary font-semibold ml-1">
                                            × {item.quantity}
                                        </span>
                                    </p>
                                ))}
                            </div>
                        </div>

                        {/* Address */}
                        <div className="text-sm text-gray-600 space-y-1">
                            <p className="font-semibold text-gray-800">
                                {order.address.firstName}{" "}
                                {order.address.lastName}
                            </p>
                            <p>
                                {order.address.street}, {order.address.city}
                            </p>
                            <p>
                                {order.address.state}, {order.address.zipcode}
                            </p>
                            <p>{order.address.country}</p>
                            <p className="text-gray-500">
                                {order.address.phone}
                            </p>
                        </div>

                        {/* Amount */}
                        <div className="flex items-center justify-start md:justify-center">
                            <p className="font-bold text-lg text-gray-800">
                                ${order.amount}
                            </p>
                        </div>

                        {/* Payment Info */}
                        <div className="flex flex-col justify-center text-sm text-gray-600 space-y-1">
                            <p>
                                <span className="font-semibold">Method:</span>{" "}
                                {order.paymentType}
                            </p>
                            <p>
                                <span className="font-semibold">Date:</span>{" "}
                                {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                            <p>
                                <span className="font-semibold">Payment:</span>{" "}
                                <span
                                    className={`${
                                        order.isPaid
                                            ? "text-green-600 font-semibold"
                                            : "text-red-500 font-semibold"
                                    }`}
                                >
                                    {order.isPaid ? "Paid" : "Pending"}
                                </span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Orders;
