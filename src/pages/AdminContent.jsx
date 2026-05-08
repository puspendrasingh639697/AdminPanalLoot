import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContent, updateContent, clearContentState } from '../redux/slices/contentSlice';
import { toast } from 'react-toastify';
import { FaSave, FaInfoCircle, FaFileAlt, FaLock, FaPhoneAlt, FaArrowLeft } from 'react-icons/fa';

const AdminContent = () => {
    const dispatch = useDispatch();
    const { about, terms, privacy, contact, isLoading, success, error } = useSelector((state) => state.content);
    const [activeTab, setActiveTab] = useState('about');
    const [formData, setFormData] = useState({ title: '', body: '' });

    useEffect(() => { loadContent(); }, [activeTab]);

    useEffect(() => {
        if (success) {
            toast.success('Content updated successfully!');
            dispatch(clearContentState());
            loadContent();
        }
        if (error) {
            toast.error(error);
            dispatch(clearContentState());
        }
    }, [success, error, dispatch]);

    const loadContent = () => { dispatch(fetchContent(activeTab)); };

    useEffect(() => {
        const contentMap = { about, terms, privacy, contact };
        const data = contentMap[activeTab];
        if (data) setFormData({ title: data.title || '', body: data.body || '' });
    }, [activeTab, about, terms, privacy, contact]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(updateContent({ contentType: activeTab, title: formData.title, body: formData.body }));
    };

    const tabs = [
        { id: 'about', label: 'About Us', icon: FaInfoCircle },
        { id: 'terms', label: 'Terms & Conditions', icon: FaFileAlt },
        { id: 'privacy', label: 'Privacy Policy', icon: FaLock },
        { id: 'contact', label: 'Contact Info', icon: FaPhoneAlt },
    ];

    return (
        <div className="bg-white rounded-xl shadow p-6">
            <div className="flex flex-wrap gap-2 mb-6 border-b">
                {tabs.map((tab) => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-6 py-3 font-medium transition ${activeTab === tab.id ? 'border-b-2 border-[#8B1E2D] text-[#8B1E2D]' : 'text-gray-500'}`}>
                        <tab.icon /> {tab.label}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#8B1E2D]" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                    <textarea value={formData.body} onChange={(e) => setFormData({ ...formData, body: e.target.value })} rows="12" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#8B1E2D]" required />
                </div>
                <div className="flex gap-3">
                    <button type="submit" disabled={isLoading} className="px-6 py-2 bg-[#8B1E2D] text-white rounded-lg hover:bg-[#6B1622]"><FaSave /> {isLoading ? 'Saving...' : 'Save Changes'}</button>
                    <button type="button" onClick={loadContent} className="px-6 py-2 bg-gray-200 rounded-lg">Reset</button>
                </div>
            </form>

            <div className="mt-8 bg-gray-50 rounded-lg p-6">
                <h2 className="text-lg font-bold mb-4">Preview</h2>
                <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2">{formData.title || 'Title'}</h3>
                    <p className="text-gray-600 whitespace-pre-wrap">{formData.body || 'Content will appear here...'}</p>
                </div>
            </div>
        </div>
    );
};

export default AdminContent;