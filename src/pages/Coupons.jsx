import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaPlus, FaTag, FaPercent, FaRupeeSign, FaCalendarAlt, FaUsers, FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { fetchAllCoupons, toggleCouponStatus, deleteCoupon, selectAllCoupons, selectCouponLoading } from '../redux/slices/couponSlice';
import CouponCreateModal from './CouponCreateModal';
// import CouponCreateModal from '../components/CouponCreateModal';

const Coupons = () => {
    const dispatch = useDispatch();
    const coupons = useSelector(selectAllCoupons);
    const loading = useSelector(selectCouponLoading);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => { dispatch(fetchAllCoupons()); }, [dispatch]);

    const handleToggleStatus = async (couponId, currentStatus) => {
        const result = await dispatch(toggleCouponStatus({ id: couponId, isActive: !currentStatus }));
        if (result.payload?.success) toast.success(`Coupon ${!currentStatus ? 'activated' : 'deactivated'}!`);
        else toast.error(result.payload || "Failed to update coupon status");
    };

    const handleDelete = async (couponId) => {
        if (window.confirm("Delete this coupon permanently?")) {
            const result = await dispatch(deleteCoupon(couponId));
            if (result.payload?.success) toast.success("Coupon deleted!");
            else toast.error(result.payload || "Failed to delete coupon");
        }
    };

    const handleCouponCreated = () => { dispatch(fetchAllCoupons()); };

    if (loading && coupons.length === 0) {
        return <div className="flex justify-center items-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-4 border-[#8B1E2D] border-t-transparent mx-auto mb-4"></div><p className="text-gray-500">Loading coupons...</p></div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6"><div><h1 className="text-2xl font-bold text-gray-800">Coupons</h1><p className="text-gray-500 text-sm mt-1">Manage discount coupons for customers</p></div><button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-5 py-2.5 bg-[#8B1E2D] text-white rounded-xl hover:bg-[#6B1622] transition-all shadow-md"><FaPlus size={18} /> Create Coupon</button></div>

            {coupons.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow"><FaTag className="text-6xl text-gray-300 mx-auto mb-4" /><p className="text-gray-500">No coupons created yet</p><button onClick={() => setShowModal(true)} className="mt-4 text-[#8B1E2D] hover:underline">Create your first coupon</button></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {coupons.map((coupon) => (
                        <div key={coupon._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition">
                            <div className="bg-gradient-to-r from-[#8B1E2D] to-[#6B1622] p-4 text-white"><div className="flex justify-between items-start"><div><p className="text-xs opacity-80">COUPON CODE</p><p className="text-xl font-bold tracking-wider">{coupon.code}</p></div><span className={`px-2 py-1 rounded-full text-xs font-medium ${coupon.isActive ? 'bg-green-500' : 'bg-gray-500'}`}>{coupon.isActive ? 'Active' : 'Inactive'}</span></div></div>
                            <div className="p-4"><p className="text-gray-600 text-sm mb-3">{coupon.description || "Special discount!"}</p><div className="space-y-2 text-sm"><div className="flex justify-between"><span className="text-gray-500">Discount:</span><span className="font-bold text-[#8B1E2D]">{coupon.voucherType === 'discount' ? `${coupon.discountPercent}% OFF` : `₹${coupon.fixedAmount} OFF`}</span></div><div className="flex justify-between"><span className="text-gray-500">Min. Order:</span><span>₹{coupon.minOrderAmount || 0}</span></div><div className="flex justify-between"><span className="text-gray-500">Used:</span><span>{coupon.usedCount || 0} / {coupon.maxUsage || 1}</span></div></div><div className="flex gap-2 mt-4 pt-3 border-t"><button onClick={() => handleToggleStatus(coupon._id, coupon.isActive)} className={`flex-1 py-1.5 rounded-lg text-sm ${coupon.isActive ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{coupon.isActive ? 'Deactivate' : 'Activate'}</button><button onClick={() => handleDelete(coupon._id)} className="flex-1 py-1.5 bg-red-100 text-red-600 rounded-lg text-sm hover:bg-red-200">Delete</button></div></div>
                        </div>
                    ))}
                </div>
            )}

            <CouponCreateModal isOpen={showModal} onClose={() => setShowModal(false)} onCouponCreated={handleCouponCreated} />
        </div>
    );
};

export default Coupons;