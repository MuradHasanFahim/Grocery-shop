import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';

const InputField = ({ type, placeholder, name, handleChange, address }) => (
    <input
        className='w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-gray-500 focus:border-primary transition'
        type={type}
        placeholder={placeholder}
        onChange={handleChange}
        name={name}
        value={address[name]}
        required
    />
);

const AddAddress = () => {
    const { axios, user } = useContext(AppContext); // ✅ get axios & user
    const navigate = useNavigate();

    const [address, setAddress] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        phone: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddress(prev => ({ ...prev, [name]: value }));
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        if (!user) {
            toast.error("You must be logged in to add an address");
            navigate('/login');
            return;
        }

        try {
            const { data } = await axios.post('/api/address/add', {
                userId: user._id, // ✅ include userId
                address
            });

            if (data.success) {
                toast.success(data.message);
                navigate('/cart');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (!user) navigate('/cart'); // ✅ include user
    }, [user, navigate]);

    return (
        <div className='mt-16 pb-16'>
            <p className='text-2xl md:text-3xl text-gray-500'>
                Add Shipping <span className='font-semibold text-primary '>Address</span>
            </p>
            <div className='flex flex-col-reverse md:flex-row justify-between mt-10'>
                <div className='flex-1 max-w-md'>
                    <form onSubmit={onSubmitHandler} className='space-y-3 mt-6 text-sm'>
                        <div className='grid grid-cols-2 gap-4'>
                            <InputField handleChange={handleChange} address={address} name='firstName' type='text' placeholder='First Name' />
                            <InputField handleChange={handleChange} address={address} name='lastName' type='text' placeholder='Last Name' />
                        </div>
                        <InputField handleChange={handleChange} address={address} name='email' type='email' placeholder='Email Address' />
                        <InputField handleChange={handleChange} address={address} name='street' type='text' placeholder='Street' />
                        <div className='grid grid-cols-2 gap-4'>
                            <InputField handleChange={handleChange} address={address} name='city' type='text' placeholder='City' />
                            <InputField handleChange={handleChange} address={address} name='zipcode' type='text' placeholder='Zip Code' />
                        </div>
                        <div className='grid grid-cols-2 gap-4'>
                            <InputField handleChange={handleChange} address={address} name='state' type='text' placeholder='State' />
                            <InputField handleChange={handleChange} address={address} name='country' type='text' placeholder='Country' />
                        </div>
                        <InputField handleChange={handleChange} address={address} name='phone' type='tel' placeholder='Phone' />
                        <button type="submit" className='w-full bg-primary hover:bg-primary-dull transition cursor-pointer uppercase text-white py-3 rounded mt-6'>
                            Save Address
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddAddress;
