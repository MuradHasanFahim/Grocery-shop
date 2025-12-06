import React from "react";
import { assets, features } from "../assets/assets";

const BottomBanner = () => {
    return (
        <div className="relative mt-24">
            {/* Banner Images */}
            <img
                src={assets.bottom_banner_image}
                alt=""
                className="w-full hidden md:block"
            />
            <img
                src={assets.bottom_banner_image_sm}
                alt=""
                className="w-full md:hidden"
            />

            {/* Overlay Content */}
            <div className="absolute inset-0 flex flex-col items-center md:items-end md:justify-center px-6 md:pr-24 py-10 bg-black/40 md:bg-transparent">
                <div className=" rounded-2xl p-6 md:p-8  max-w-lg">
                    <h1 className="text-2xl md:text-3xl font-bold text-primary mb-6 text-center md:text-left">
                        Why We Are the Best?
                    </h1>

                    <div className="space-y-4">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="flex items-start gap-4 p-3  transition"
                            >
                                <img
                                    src={feature.icon}
                                    alt={feature.title}
                                    className="md:w-11 w-9 flex-shrink-0"
                                />
                                <div>
                                    <h3 className="text-lg md:text-xl font-semibold">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm md:text-base">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BottomBanner;
