import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { 
    FaTimes, FaPercent, FaRupeeSign, FaTag, FaCalendarAlt, 
    FaUsers, FaTicketAlt, FaCheckCircle
} from "react-icons/fa";
import { createCoupon, selectCouponLoading } from "../redux/slices/couponSlice";

const CouponCreateModal = ({ isOpen, onClose, onCouponCreated }) => {
    const dispatch = useDispatch();
    const loading = useSelector(selectCouponLoading);
    
    const [formData, setFormData] = useState({
        code: "",
        discountPercent: "",
        fixedAmount: "",
        voucherType: "discount",
        minOrderAmount: "",
        maxUsage: "1",
        description: "",
        isFirstOrderOnly: false,
        expiresAt: "",
    });
    
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.code.trim()) {
            newErrors.code = "Coupon code is required";
        } else if (formData.code.trim().length < 3) {
            newErrors.code = "Coupon code must be at least 3 characters";
        }
        
        if (formData.voucherType === "discount") {
            if (!formData.discountPercent) {
                newErrors.discountPercent = "Discount percentage is required";
            } else if (formData.discountPercent < 1 || formData.discountPercent > 100) {
                newErrors.discountPercent = "Discount must be between 1% and 100%";
            }
        } else if (formData.voucherType === "fixed") {
            if (!formData.fixedAmount) {
                newErrors.fixedAmount = "Fixed amount is required";
            } else if (formData.fixedAmount < 1) {
                newErrors.fixedAmount = "Amount must be greater than 0";
            }
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error("Please fix the errors in the form");
            return;
        }
        
        const couponData = {
            code: formData.code.toUpperCase(),
            discountPercent: formData.voucherType === "discount" ? Number(formData.discountPercent) : 0,
            fixedAmount: formData.voucherType === "fixed" ? Number(formData.fixedAmount) : 0,
            voucherType: formData.voucherType,
            minOrderAmount: Number(formData.minOrderAmount) || 0,
            maxUsage: Number(formData.maxUsage) || 1,
            description: formData.description,
            isFirstOrderOnly: formData.isFirstOrderOnly,
            expiresAt: formData.expiresAt || null,
        };
        
        const result = await dispatch(createCoupon(couponData));
        
        if (result.payload?.success) {
            toast.success(result.payload.message || "Coupon created successfully!");
            if (onCouponCreated) {
                onCouponCreated(result.payload.coupon);
            }
            onClose();
            resetForm();
        } else {
            toast.error(result.payload || "Failed to create coupon");
        }
    };

    const resetForm = () => {
        setFormData({
            code: "",
            discountPercent: "",
            fixedAmount: "",
            voucherType: "discount",
            minOrderAmount: "",
            maxUsage: "1",
            description: "",
            isFirstOrderOnly: false,
            expiresAt: "",
        });
        setErrors({});
    };

    const getPreviewDiscount = () => {
        if (formData.voucherType === "discount") {
            return formData.discountPercent ? `${formData.discountPercent}% OFF` : "0% OFF";
        } else {
            return formData.fixedAmount ? `₹${formData.fixedAmount} OFF` : "₹0 OFF";
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black z-50"
                    />
                    
                    {/* Modal Container - Centered */}
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: "spring", duration: 0.3 }}
                            className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
                        >
                            {/* Header */}
                            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 bg-[#8B1E2D]/10 rounded-full flex items-center justify-center">
                                        <FaTicketAlt className="text-[#8B1E2D] text-xl" />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-800">Create New Coupon</h2>
                                </div>
                                <button 
                                    onClick={onClose} 
                                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
                                >
                                    <FaTimes className="text-gray-500" />
                                </button>
                            </div>

                            {/* Form - Scrollable */}
                            <div className="max-h-[calc(90vh-80px)] overflow-y-auto p-6">
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {/* Coupon Code */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Coupon Code <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <FaTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                name="code"
                                                value={formData.code}
                                                onChange={handleChange}
                                                placeholder="e.g., WELCOME20"
                                                className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1E2D] transition uppercase ${errors.code ? 'border-red-500' : 'border-gray-300'}`}
                                            />
                                        </div>
                                        {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
                                        <p className="text-xs text-gray-400 mt-1">Code will be automatically converted to uppercase</p>
                                    </div>

                                    {/* Voucher Type */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Voucher Type
                                        </label>
                                        <div className="flex gap-6">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="voucherType"
                                                    value="discount"
                                                    checked={formData.voucherType === "discount"}
                                                    onChange={handleChange}
                                                    className="w-4 h-4 text-[#8B1E2D] focus:ring-[#8B1E2D]"
                                                />
                                                <span className="text-gray-700">Percentage Discount (%)</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="voucherType"
                                                    value="fixed"
                                                    checked={formData.voucherType === "fixed"}
                                                    onChange={handleChange}
                                                    className="w-4 h-4 text-[#8B1E2D] focus:ring-[#8B1E2D]"
                                                />
                                                <span className="text-gray-700">Fixed Amount (₹)</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Discount Value */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {formData.voucherType === "discount" ? "Discount Percentage" : "Fixed Amount"} 
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                                {formData.voucherType === "discount" ? <FaPercent /> : <FaRupeeSign />}
                                            </span>
                                            <input
                                                type="number"
                                                name={formData.voucherType === "discount" ? "discountPercent" : "fixedAmount"}
                                                value={formData.voucherType === "discount" ? formData.discountPercent : formData.fixedAmount}
                                                onChange={handleChange}
                                                placeholder={formData.voucherType === "discount" ? "e.g., 20" : "e.g., 500"}
                                                min="0"
                                                max={formData.voucherType === "discount" ? "100" : ""}
                                                className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1E2D] transition ${errors.discountPercent || errors.fixedAmount ? 'border-red-500' : 'border-gray-300'}`}
                                            />
                                        </div>
                                        {errors.discountPercent && <p className="text-red-500 text-xs mt-1">{errors.discountPercent}</p>}
                                        {errors.fixedAmount && <p className="text-red-500 text-xs mt-1">{errors.fixedAmount}</p>}
                                    </div>

                                    {/* Minimum Order Amount */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Minimum Order Amount (₹) <span className="text-gray-400 text-xs">(Optional)</span>
                                        </label>
                                        <div className="relative">
                                            <FaRupeeSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="number"
                                                name="minOrderAmount"
                                                value={formData.minOrderAmount}
                                                onChange={handleChange}
                                                placeholder="e.g., 500"
                                                min="0"
                                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1E2D] transition"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">Leave empty for no minimum order requirement</p>
                                    </div>

                                    {/* Max Usage per User */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Max Usage per User
                                        </label>
                                        <div className="relative">
                                            <FaUsers className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="number"
                                                name="maxUsage"
                                                value={formData.maxUsage}
                                                onChange={handleChange}
                                                min="1"
                                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1E2D] transition"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">How many times can a single user use this coupon?</p>
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Description <span className="text-gray-400 text-xs">(Optional)</span>
                                        </label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            rows="2"
                                            placeholder="Describe the coupon offer..."
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1E2D] transition resize-none"
                                        />
                                    </div>

                                    {/* First Order Only */}
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            name="isFirstOrderOnly"
                                            checked={formData.isFirstOrderOnly}
                                            onChange={handleChange}
                                            className="w-4 h-4 text-[#8B1E2D] rounded focus:ring-[#8B1E2D]"
                                        />
                                        <label className="text-sm text-gray-700">
                                            Apply only for first-time orders
                                        </label>
                                    </div>

                                    {/* Expiry Date */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Expiry Date <span className="text-gray-400 text-xs">(Optional)</span>
                                        </label>
                                        <div className="relative">
                                            <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="datetime-local"
                                                name="expiresAt"
                                                value={formData.expiresAt}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1E2D] transition"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">Leave empty for no expiry date</p>
                                    </div>

                                    {/* Preview Section */}
                                    {(formData.code || formData.discountPercent || formData.fixedAmount) && (
                                        <div className="bg-gradient-to-r from-[#8B1E2D]/5 to-[#8B1E2D]/10 p-5 rounded-xl border border-[#8B1E2D]/20">
                                            <div className="flex items-center gap-2 mb-3">
                                                <FaCheckCircle className="text-[#8B1E2D]" />
                                                <p className="text-sm font-semibold text-gray-700">Preview</p>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-lg font-bold text-[#8B1E2D]">{formData.code.toUpperCase() || "COUPON_CODE"}</p>
                                                    <p className="text-sm text-gray-600">
                                                        {getPreviewDiscount()}
                                                    </p>
                                                    {formData.description && (
                                                        <p className="text-xs text-gray-500 mt-1">{formData.description}</p>
                                                    )}
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-gray-500">Min. Order</p>
                                                    <p className="font-semibold text-gray-800">₹{formData.minOrderAmount || 0}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Buttons */}
                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                resetForm();
                                                onClose();
                                            }}
                                            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex-1 px-4 py-2.5 bg-[#8B1E2D] text-white rounded-lg hover:bg-[#6B1622] transition disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
                                        >
                                            {loading ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    Creating...
                                                </>
                                            ) : (
                                                "Create Coupon"
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CouponCreateModal;