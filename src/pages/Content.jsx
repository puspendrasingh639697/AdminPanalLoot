// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchContent, updateContent, clearContentState } from '../redux/slices/contentSlice';
// import { toast } from 'react-toastify';
// import { FaSave, FaInfoCircle, FaLock, FaPhoneAlt, FaImage, FaArrowLeft, FaFileAlt } from 'react-icons/fa';

// const Content = () => {
//     const dispatch = useDispatch();
//     const { about, banner, contact, policy, isLoading, success, error } = useSelector((state) => state.content);
//     const [activeTab, setActiveTab] = useState('about');
//     const [formData, setFormData] = useState({ title: '', body: '', link: '', imageUrl: '' });

//     useEffect(() => { loadContent(); }, [activeTab]);
//     useEffect(() => { if (success) { toast.success('Content updated!'); dispatch(clearContentState()); loadContent(); } if (error) { toast.error(error); dispatch(clearContentState()); } }, [success, error, dispatch]);

//     const loadContent = () => { dispatch(fetchContent(activeTab)); };

//     useEffect(() => {
//         const contentMap = { about, banner, contact, policy };
//         const data = contentMap[activeTab];
//         if (data) setFormData({ title: data.title || '', body: data.body || '', link: data.link || '', imageUrl: data.imageUrl || '' });
//     }, [activeTab, about, banner, contact, policy]);

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (activeTab === 'banner') dispatch(updateContent({ contentType: activeTab, title: formData.title, body: formData.body, link: formData.link, imageUrl: formData.imageUrl }));
//         else dispatch(updateContent({ contentType: activeTab, title: formData.title, body: formData.body }));
//     };

//     const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

//     const tabs = [
//         { id: 'about', label: 'About Us', icon: FaInfoCircle },
//         { id: 'policy', label: 'Privacy Policy', icon: FaLock },
//         { id: 'contact', label: 'Contact Info', icon: FaPhoneAlt },
//         { id: 'banner', label: 'Banner', icon: FaImage },
//     ];

//     return (
//         <div>
//             <div className="mb-6"><h1 className="text-2xl font-bold text-gray-800">Content Management</h1><p className="text-gray-500 text-sm mt-1">Manage website content, banners, and pages</p></div>

//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//                 <div className="border-b px-6 py-3 flex flex-wrap gap-2">{tabs.map((tab) => (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${activeTab === tab.id ? 'bg-[#8B1E2D] text-white' : 'text-gray-600 hover:bg-gray-100'}`}><tab.icon size={16} /> {tab.label}</button>))}</div>

//                 <form onSubmit={handleSubmit} className="p-6 space-y-6">
//                     <div><label className="block text-sm font-medium text-gray-700 mb-2">Title</label><input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#8B1E2D]" required /></div>
//                     {activeTab === 'banner' && (<><div><label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label><input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="w-full p-3 border rounded-lg" placeholder="https://example.com/banner.jpg" />{formData.imageUrl && <div className="mt-2"><img src={formData.imageUrl} alt="Preview" className="h-32 object-cover rounded-lg border" /></div>}</div><div><label className="block text-sm font-medium text-gray-700 mb-2">Link URL</label><input type="text" name="link" value={formData.link} onChange={handleChange} className="w-full p-3 border rounded-lg" placeholder="/products or https://example.com" /></div></>)}
//                     <div><label className="block text-sm font-medium text-gray-700 mb-2">Content Body</label><textarea name="body" value={formData.body} onChange={handleChange} rows="12" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#8B1E2D]" required /></div>
//                     <div className="flex gap-3"><button type="submit" disabled={isLoading} className="flex items-center gap-2 px-6 py-2 bg-[#8B1E2D] text-white rounded-lg hover:bg-[#6B1622] transition"><FaSave /> {isLoading ? 'Saving...' : 'Save Changes'}</button><button type="button" onClick={loadContent} className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition">Reset</button></div>
//                 </form>

//                 <div className="border-t p-6 bg-gray-50"><h2 className="text-lg font-bold mb-4">Preview</h2><div className="border-t pt-4"><h3 className="font-semibold mb-2">{formData.title || 'Title'}</h3>{activeTab === 'banner' && formData.imageUrl && <div className="mb-4"><img src={formData.imageUrl} alt="Banner Preview" className="w-full h-48 object-cover rounded-lg" />{formData.link && <p className="text-sm text-gray-500 mt-1">Link: {formData.link}</p>}</div>}<p className="text-gray-600 whitespace-pre-wrap">{formData.body || 'Content will appear here...'}</p></div></div>
//             </div>
//         </div>
//     );
// };

// export default Content;


import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContent, updateContent, clearContentState } from '../redux/slices/contentSlice';
import { toast } from 'react-toastify';
import { 
    FaSave, FaInfoCircle, FaLock, FaPhoneAlt, FaImage, 
    FaEdit, FaEye, FaSpinner, FaSyncAlt, FaHeading, FaParagraph, FaLink
} from 'react-icons/fa';

const Content = () => {
    const dispatch = useDispatch();
    const { about, banner, contact, policy, isLoading, success, error } = useSelector((state) => state.content);
    const [activeTab, setActiveTab] = useState('about');
    const [formData, setFormData] = useState({ title: '', body: '', link: '', imageUrl: '' });
    const [saving, setSaving] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);
    const [successShown, setSuccessShown] = useState(false); // ✅ Track if success already shown

    // Load content when tab changes
    useEffect(() => {
        loadContent();
        setSuccessShown(false); // ✅ Reset success flag on tab change
    }, [activeTab]);

    // ✅ Handle success message - ONLY when save operation happens
    useEffect(() => {
        if (success && !successShown) {
            toast.success(`${activeTab} content updated successfully!`);
            setSuccessShown(true); // ✅ Mark as shown
            dispatch(clearContentState());
            loadContent();
            setSaving(false);
        }
        if (error) {
            toast.error(error);
            dispatch(clearContentState());
            setSaving(false);
        }
    }, [success, error, dispatch, activeTab, successShown]);

    const loadContent = () => {
        dispatch(fetchContent(activeTab));
    };

    useEffect(() => {
        const contentMap = { about, banner, contact, policy };
        const data = contentMap[activeTab];
        if (data) {
            setFormData({
                title: data.title || '',
                body: data.body || '',
                link: data.link || '',
                imageUrl: data.imageUrl || ''
            });
        }
    }, [activeTab, about, banner, contact, policy]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSaving(true);
        setSuccessShown(false); // ✅ Reset flag before saving
        
        if (activeTab === 'banner') {
            dispatch(updateContent({ 
                contentType: activeTab, 
                title: formData.title, 
                body: formData.body, 
                link: formData.link, 
                imageUrl: formData.imageUrl 
            }));
        } else {
            dispatch(updateContent({ 
                contentType: activeTab, 
                title: formData.title, 
                body: formData.body 
            }));
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleReset = () => {
        loadContent();
        toast.info('Content reset to saved version');
    };

    const tabs = [
        { id: 'about', label: 'About Us', icon: FaInfoCircle, description: 'Company information, mission, vision' },
        { id: 'policy', label: 'Privacy Policy', icon: FaLock, description: 'Terms, privacy, legal info' },
        { id: 'contact', label: 'Contact Info', icon: FaPhoneAlt, description: 'Phone, email, address' },
        { id: 'banner', label: 'Banner', icon: FaImage, description: 'Homepage slider images' },
    ];

    const activeTabData = tabs.find(t => t.id === activeTab);

    return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#8B1E2D] to-[#a83246] rounded-2xl shadow-xl p-6 text-white mb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold">Content Management</h1>
                        <p className="text-white/80 text-sm mt-1">Manage your website content, banners, and pages dynamically</p>
                    </div>
                    <div className="mt-3 md:mt-0 flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
                        <FaSyncAlt className="text-white/80" />
                        <span className="text-sm">Live Preview</span>
                    </div>
                </div>
            </div>

            {/* Main Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                {/* Tabs */}
                <div className="border-b border-gray-200 bg-gray-50 overflow-x-auto">
                    <div className="flex min-w-max md:min-w-0">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 md:px-6 py-3 md:py-4 transition-all border-b-2 ${
                                        isActive 
                                            ? 'border-[#8B1E2D] text-[#8B1E2D] bg-white font-semibold' 
                                            : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                                    }`}
                                >
                                    <Icon size={18} />
                                    <span className="text-sm md:text-base">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Form and Preview */}
                <div className="flex flex-col lg:flex-row">
                    {/* Form Section */}
                    <div className="flex-1 p-6 border-r border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <FaEdit className="text-[#8B1E2D]" />
                                Edit {activeTabData?.label}
                            </h2>
                            <button
                                type="button"
                                onClick={() => setPreviewMode(!previewMode)}
                                className="lg:hidden flex items-center gap-1 text-sm text-[#8B1E2D] hover:underline"
                            >
                                <FaEye size={14} /> {previewMode ? 'Hide Preview' : 'Show Preview'}
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Title Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <FaHeading size={14} className="text-gray-400" />
                                    Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B1E2D] focus:border-transparent transition"
                                    placeholder="Enter title..."
                                    required
                                />
                            </div>

                            {/* Banner Specific Fields */}
                            {activeTab === 'banner' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                            <FaImage size={14} className="text-gray-400" />
                                            Image URL
                                        </label>
                                        <input
                                            type="text"
                                            name="imageUrl"
                                            value={formData.imageUrl}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B1E2D]"
                                            placeholder="https://example.com/banner.jpg"
                                        />
                                        {formData.imageUrl && (
                                            <div className="mt-3">
                                                <img 
                                                    src={formData.imageUrl} 
                                                    alt="Preview" 
                                                    className="h-24 object-cover rounded-lg border"
                                                    onError={(e) => {
                                                        e.target.src = 'https://via.placeholder.com/400x200?text=Invalid+Image+URL';
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                            <FaLink size={14} className="text-gray-400" />
                                            Link URL
                                        </label>
                                        <input
                                            type="text"
                                            name="link"
                                            value={formData.link}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B1E2D]"
                                            placeholder="/products or https://example.com"
                                        />
                                    </div>
                                </>
                            )}

                            {/* Body Content Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <FaParagraph size={14} className="text-gray-400" />
                                    Content Body <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="body"
                                    value={formData.body}
                                    onChange={handleChange}
                                    rows={activeTab === 'banner' ? 6 : 12}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B1E2D] resize-vertical"
                                    placeholder="Write your content here..."
                                    required
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-3 pt-4">
                                <button 
                                    type="submit" 
                                    disabled={isLoading || saving}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-[#8B1E2D] text-white rounded-xl hover:bg-[#6B1622] transition-all shadow-md disabled:opacity-50"
                                >
                                    {(isLoading || saving) ? (
                                        <FaSpinner className="animate-spin" size={16} />
                                    ) : (
                                        <FaSave size={16} />
                                    )}
                                    {isLoading || saving ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button 
                                    type="button" 
                                    onClick={handleReset}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition"
                                >
                                    <FaSyncAlt size={14} /> Reset
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Preview Section */}
                    <div className={`${previewMode ? 'block' : 'hidden'} lg:block flex-1 p-6 bg-gray-50`}>
                        <div className="sticky top-6">
                            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
                                <FaEye className="text-[#8B1E2D]" />
                                Live Preview
                            </h2>
                            
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                                <div className="bg-gray-100 px-4 py-2 border-b">
                                    <span className="text-xs text-gray-500">Preview Mode</span>
                                </div>
                                
                                <div className="p-5">
                                    {activeTab === 'banner' && formData.imageUrl && (
                                        <div className="mb-4">
                                            <img 
                                                src={formData.imageUrl} 
                                                alt="Banner Preview" 
                                                className="w-full h-48 object-cover rounded-lg"
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/800x300?text=Invalid+Image+URL';
                                                }}
                                            />
                                        </div>
                                    )}
                                    
                                    <h3 className="text-xl font-bold text-gray-800 mb-3 border-b pb-2">
                                        {formData.title || 'Title Preview'}
                                    </h3>
                                    
                                    <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                        {formData.body || (
                                            <span className="text-gray-400 italic">Content preview will appear here...</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Content;