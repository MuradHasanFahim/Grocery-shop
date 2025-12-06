import OrderModel from '../models/order.js'
import ProductModel from '../models/product.js'

export const placeOrderCOD = async (req, res) => {
    try {
        const { userId, items, address } = req.body
        if (!address || items.length === 0) {
            return res.json({ success: false, message: 'Invalid Data!' })
        }

        let amount = 0
        for (const item of items) {
            const product = await ProductModel.findById(item.product)
            amount += product.offerPrice * item.quantity
        }

        amount += Math.floor(amount * 0.02)

        await OrderModel.create({
            userId,
            items,
            amount,
            address,
            paymentType: 'COD',
        })
        return res.json({ success: true, message: 'Order Placed Successfully!!' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id; // ✅ authUser middleware sets req.user
        const orders = await OrderModel.find({
            userId,
            $or: [{ paymentType: 'COD' }, { isPaid: true }],
        })
            .populate('items.product address')
            .sort({ createdAt: -1 });

        res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


export const getAllOrders = async (req, res) => {
    try {
        const orders = await OrderModel.find({
            $or: [{ paymentType: 'COD' }, { isPaid: true }],
        })
            .populate('items.product address')
            .sort({ createdAt: -1 })
        res.json({ success: true, orders })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}
