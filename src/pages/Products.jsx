// import React, { useState, useEffect } from 'react';
// import { FaPlus, FaEdit, FaTrash, FaSearch, FaTimes, FaImage, FaSpinner, FaFilter, FaArrowUp, FaLock } from 'react-icons/fa';
// import { toast } from 'react-toastify';
// import API from '../utils/api';
// import { usePermission } from '../hooks/usePermission';
// import ConfirmModal from '../components/ConfirmModal';

// const Products = () => {
//     const { hasPermission, getUserRole } = usePermission();
//     const [products, setProducts] = useState([]);
//     const [filteredProducts, setFilteredProducts] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [modalOpen, setModalOpen] = useState(false);
//     const [editingProduct, setEditingProduct] = useState(null);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [selectedCategory, setSelectedCategory] = useState('');
//     const [formData, setFormData] = useState({ 
//         name: '', category: '', price: '', description: '', stock: '', image: '' 
//     });
//     const [imageFile, setImageFile] = useState(null);
//     const [imagePreview, setImagePreview] = useState('');
//     const [submitLoading, setSubmitLoading] = useState(false);
//     const [deleteLoading, setDeleteLoading] = useState(null);
//     const [searchPerformed, setSearchPerformed] = useState(false);
    
//     // ✅ Delete Confirmation Modal State
//     const [showDeleteModal, setShowDeleteModal] = useState(false);
//     const [productToDelete, setProductToDelete] = useState(null);

//     const canAddProduct = hasPermission('add_product');
//     const canEditProduct = hasPermission('edit_product');
//     const canDeleteProduct = hasPermission('delete_product');
//     const userRole = getUserRole();

//     const categories = ['Copper Utensils', 'Steel Bottles', 'Thermoware & Lunchboxes', 'Cookware Sets', 'Home Appliances', 'Cookers'];

//     useEffect(() => { fetchProducts(); }, []);

//     useEffect(() => {
//         if (products.length > 0) filterProductsLocal();
//     }, [searchTerm, selectedCategory, products]);

//     const fetchProducts = async () => {
//         setLoading(true);
//         setSearchPerformed(false);
//         try {
//             const res = await API.get('/products/all');
//             let productsData = res.data.products || res.data || [];
//             productsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//             setProducts(productsData);
//             setFilteredProducts(productsData);
//         } catch (err) {
//             console.error("Fetch error:", err);
//             toast.error('Failed to fetch products');
//             setProducts([]);
//             setFilteredProducts([]);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const filterProductsLocal = () => {
//         let filtered = [...products];
//         if (searchTerm.trim()) {
//             filtered = filtered.filter(p => 
//                 p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 p.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 p.description?.toLowerCase().includes(searchTerm.toLowerCase())
//             );
//             setSearchPerformed(true);
//         } else {
//             setSearchPerformed(false);
//         }
//         if (selectedCategory) {
//             filtered = filtered.filter(p => p.category === selectedCategory);
//         }
//         setFilteredProducts(filtered);
//         if (searchTerm.trim() && filtered.length === 0) {
//             toast.info(`No products found matching "${searchTerm}"`);
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
        
//         if (editingProduct && !canEditProduct) {
//             toast.error('You don\'t have permission to edit products');
//             return;
//         }
//         if (!editingProduct && !canAddProduct) {
//             toast.error('You don\'t have permission to add products');
//             return;
//         }
        
//         if (!formData.name || !formData.category || !formData.price || !formData.description || !formData.stock) {
//             toast.error('Please fill all required fields');
//             return;
//         }
        
//         if (!imageFile && !formData.image && !editingProduct) {
//             toast.error('Please upload a product image');
//             return;
//         }
        
//         setSubmitLoading(true);
//         try {
//             const formDataToSend = new FormData();
//             formDataToSend.append('name', formData.name);
//             formDataToSend.append('category', formData.category);
//             formDataToSend.append('price', formData.price);
//             formDataToSend.append('description', formData.description);
//             formDataToSend.append('stock', formData.stock);
            
//             if (imageFile) formDataToSend.append('image', imageFile);
//             else if (formData.image) formDataToSend.append('imageUrl', formData.image);
            
//             if (editingProduct) {
//                 await API.put(`/products/${editingProduct._id}`, formDataToSend);
//                 toast.success('Product updated successfully!');
//             } else {
//                 await API.post('/products/add', formDataToSend);
//                 toast.success('Product added successfully!');
//             }
            
//             setSearchTerm('');
//             setSelectedCategory('');
//             setSearchPerformed(false);
//             fetchProducts();
//             closeModal();
//         } catch (err) {
//             if (err.response?.status === 403) {
//                 toast.error('You don\'t have permission for this action');
//             } else {
//                 toast.error(err.response?.data?.message || 'Failed to save product');
//             }
//         } finally {
//             setSubmitLoading(false);
//         }
//     };

//     // ✅ Handle delete click - show confirmation modal
//     const handleDeleteClick = (product) => {
//         if (!canDeleteProduct) {
//             toast.error('You don\'t have permission to delete products');
//             return;
//         }
//         setProductToDelete(product);
//         setShowDeleteModal(true);
//     };

//     // ✅ Handle confirm delete
//     const handleConfirmDelete = async () => {
//         if (!productToDelete) return;
        
//         setDeleteLoading(productToDelete._id);
//         setShowDeleteModal(false);
        
//         try {
//             await API.delete(`/products/${productToDelete._id}`);
//             toast.success('Product deleted successfully!');
//             fetchProducts();
//         } catch (err) {
//             if (err.response?.status === 403) {
//                 toast.error('You don\'t have permission to delete products');
//             } else {
//                 toast.error(err.response?.data?.message || 'Failed to delete product');
//             }
//         } finally {
//             setDeleteLoading(null);
//             setProductToDelete(null);
//         }
//     };

//     const openModal = (product = null) => {
//         if (product && !canEditProduct) {
//             toast.error('You don\'t have permission to edit products');
//             return;
//         }
//         if (!product && !canAddProduct) {
//             toast.error('You don\'t have permission to add products');
//             return;
//         }
        
//         if (product) {
//             setEditingProduct(product);
//             setFormData({
//                 name: product.name || '',
//                 category: product.category || '',
//                 price: product.price || '',
//                 description: product.description || '',
//                 stock: product.stock || '',
//                 image: product.image || ''
//             });
//             setImagePreview(product.image);
//         } else {
//             setEditingProduct(null);
//             setFormData({ name: '', category: '', price: '', description: '', stock: '', image: '' });
//             setImagePreview('');
//         }
//         setImageFile(null);
//         setModalOpen(true);
//     };

//     const closeModal = () => {
//         setModalOpen(false);
//         setEditingProduct(null);
//         setFormData({ name: '', category: '', price: '', description: '', stock: '', image: '' });
//         setImageFile(null);
//         setImagePreview('');
//         setSubmitLoading(false);
//     };

//     const handleImageChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             if (file.size > 2 * 1024 * 1024) {
//                 toast.error('Image size should be less than 2MB');
//                 return;
//             }
//             setImageFile(file);
//             const reader = new FileReader();
//             reader.onloadend = () => setImagePreview(reader.result);
//             reader.readAsDataURL(file);
//             setFormData({ ...formData, image: '' });
//         }
//     };

//     const clearFilters = () => {
//         setSearchTerm('');
//         setSelectedCategory('');
//         setSearchPerformed(false);
//     };

//     const RoleBadge = () => {
//         const roleColors = {
//             super_admin: 'bg-purple-600',
//             admin: 'bg-red-600',
//             manager: 'bg-blue-600',
//             editor: 'bg-green-600',
//             viewer: 'bg-gray-600'
//         };
//         return (
//             <span className={`ml-2 px-2 py-0.5 rounded-full text-xs text-white ${roleColors[userRole] || 'bg-gray-500'}`}>
//                 {userRole?.replace('_', ' ').toUpperCase()}
//             </span>
//         );
//     };



//     if (loading && products.length === 0) {
//         return (
//             <div className="flex justify-center items-center h-96">
//                 <div className="text-center">
//                     <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#8B1E2D] border-t-transparent mx-auto mb-4"></div>
//                     <p className="text-gray-500">Loading products...</p>
//                 </div>
//             </div>
//         );
//     }
// console.log("Token:", localStorage.getItem('token'));
// console.log("User:", JSON.parse(localStorage.getItem('user') || '{}'));
//     return (
//         <div className="p-4 md:p-6">
//             {/* Header */}
//             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
//                 <div>
//                     <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
//                         Products
//                         <RoleBadge />
//                     </h1>
//                     <p className="text-gray-500 text-sm mt-1">Manage your product inventory</p>
//                 </div>
                
//                 {canAddProduct && (
//                     <button onClick={() => openModal()} className="flex items-center gap-2 px-5 py-2.5 bg-[#8B1E2D] text-white rounded-xl hover:bg-[#6B1622] transition-all shadow-md">
//                         <FaPlus size={18} /> Add Product
//                     </button>
//                 )}
//             </div>

//             {/* Search and Filter Bar */}
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
//                 <div className="flex flex-col md:flex-row gap-4">
//                     <div className="flex-1 relative">
//                         <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//                         <input
//                             type="text"
//                             placeholder="Search products by name or category..."
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                             className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1E2D]"
//                         />
//                     </div>
//                     <div className="relative">
//                         <select
//                             value={selectedCategory}
//                             onChange={(e) => setSelectedCategory(e.target.value)}
//                             className="pl-10 pr-8 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1E2D] appearance-none bg-white"
//                         >
//                             <option value="">All Categories</option>
//                             {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
//                         </select>
//                         <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//                     </div>
//                     {(searchTerm || selectedCategory) && (
//                         <button onClick={clearFilters} className="px-4 py-2 text-gray-600 hover:text-[#8B1E2D] transition border border-gray-200 rounded-lg">
//                             Clear Filters
//                         </button>
//                     )}
//                 </div>
//             </div>

//             {/* Products Grid */}
//             {filteredProducts.length === 0 ? (
//                 <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
//                     <div className="text-6xl mb-4">📦</div>
//                     <h3 className="text-xl font-semibold text-gray-800 mb-2">
//                         {searchPerformed ? 'No Products Found' : 'No Products Yet'}
//                     </h3>
//                     <p className="text-gray-500 mb-4">
//                         {searchPerformed 
//                             ? `No products matching "${searchTerm}" were found.`
//                             : "You haven't added any products yet."}
//                     </p>
//                     {!searchPerformed && canAddProduct && (
//                         <button onClick={() => openModal()} className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#8B1E2D] text-white rounded-xl hover:bg-[#6B1622] transition">
//                             <FaPlus size={18} /> Add Your First Product
//                         </button>
//                     )}
//                 </div>
//             ) : (
//                 <>
//                     <div className="flex justify-between items-center mb-4">
//                         <p className="text-sm text-gray-500">
//                             Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
//                             {searchPerformed && ` matching "${searchTerm}"`}
//                         </p>
//                         <div className="text-xs text-gray-400 flex items-center gap-1">
//                             <FaArrowUp size={10} /> Latest first
//                         </div>
//                     </div>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//                         {filteredProducts.map((product, index) => (
//                             <div key={product._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group relative">
//                                 {index === 0 && !searchPerformed && !selectedCategory && (
//                                     <div className="absolute top-2 left-2 z-10">
//                                         <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
//                                             <FaPlus size={10} /> New
//                                         </span>
//                                     </div>
//                                 )}
//                                 <div className="h-48 bg-gray-100 relative overflow-hidden">
//                                     <img src={product.image || 'https://via.placeholder.com/400x300?text=No+Image'} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
//                                     {product.stock < 5 && product.stock > 0 && (
//                                         <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">Low Stock</span>
//                                     )}
//                                     {product.stock === 0 && (
//                                         <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">Out of Stock</span>
//                                     )}
//                                 </div>
//                                 <div className="p-4">
//                                     <h3 className="font-bold text-gray-800 mb-1 truncate">{product.name}</h3>
//                                     <p className="text-sm text-gray-500 mb-2">{product.category}</p>
//                                     <div className="flex justify-between items-center mb-3">
//                                         <span className="text-xl font-bold text-[#8B1E2D]">₹{product.price}</span>
//                                         <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
//                                             Stock: {product.stock || 0}
//                                         </span>
//                                     </div>
//                                     <p className="text-sm text-gray-600 line-clamp-2 mb-4">{product.description}</p>
                                    
//                                     <div className="flex gap-2">
//                                         {canEditProduct && (
//                                             <button onClick={() => openModal(product)} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition">
//                                                 <FaEdit size={14} /> Edit
//                                             </button>
//                                         )}
//                                         {canDeleteProduct && (
//                                             <button onClick={() => handleDeleteClick(product)} disabled={deleteLoading === product._id} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition disabled:opacity-50">
//                                                 {deleteLoading === product._id ? <FaSpinner className="animate-spin" size={14} /> : <FaTrash size={14} />} Delete
//                                             </button>
//                                         )}
//                                         {!canEditProduct && !canDeleteProduct && (
//                                             <div className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-50 text-gray-500 rounded-lg">
//                                                 <FaLock size={14} /> Read Only
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </>
//             )}

//             {/* Add/Edit Modal */}
//             {modalOpen && (canAddProduct || canEditProduct) && (
//                 <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={closeModal}>
//                     <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
//                         <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
//                             <h2 className="text-xl font-bold">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
//                             <button onClick={closeModal} className="p-1 hover:bg-gray-100 rounded-lg"><FaTimes size={20} /></button>
//                         </div>
//                         <form onSubmit={handleSubmit} className="p-6 space-y-4">
//                             <input type="text" placeholder="Product Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-3 border rounded-lg" required />
//                             <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full p-3 border rounded-lg" required>
//                                 <option value="">Select Category</option>
//                                 {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
//                             </select>
//                             <input type="number" placeholder="Price (₹)" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full p-3 border rounded-lg" required />
//                             <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows="3" className="w-full p-3 border rounded-lg" required />
//                             <input type="number" placeholder="Stock Quantity" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} className="w-full p-3 border rounded-lg" required />
//                             <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
//                                 {imagePreview ? (
//                                     <div className="relative inline-block">
//                                         <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg mx-auto" />
//                                         <button type="button" onClick={() => { setImagePreview(''); setImageFile(null); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><FaTimes size={14} /></button>
//                                     </div>
//                                 ) : (
//                                     <>
//                                         <FaImage className="text-4xl text-gray-400 mx-auto mb-2" />
//                                         <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="productImage" />
//                                         <label htmlFor="productImage" className="cursor-pointer text-gray-500">Click to upload image</label>
//                                     </>
//                                 )}
//                             </div>
//                             <input type="text" placeholder="Or enter image URL" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} className="w-full p-3 border rounded-lg" />
//                             <div className="flex gap-3 pt-4">
//                                 <button type="submit" disabled={submitLoading} className="flex-1 bg-[#8B1E2D] text-white py-3 rounded-xl hover:bg-[#6B1622] transition disabled:opacity-50 flex items-center justify-center gap-2">
//                                     {submitLoading ? <><FaSpinner className="animate-spin" /> {editingProduct ? 'Updating...' : 'Adding...'}</> : (editingProduct ? 'Update Product' : 'Add Product')}
//                                 </button>
//                                 <button type="button" onClick={closeModal} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition">Cancel</button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}

//             {/* Delete Confirmation Modal */}
//             <ConfirmModal
//                 isOpen={showDeleteModal}
//                 onClose={() => {
//                     setShowDeleteModal(false);
//                     setProductToDelete(null);
//                 }}
//                 onConfirm={handleConfirmDelete}
//                 title="Delete Product"
//                 message={`Are you sure you want to delete "${productToDelete?.name}"?`}
//                 confirmText="Yes, Delete Product"
//                 cancelText="Cancel"
//                 isLoading={deleteLoading !== null}
//             />
//         </div>
//     );
// };

// export default Products;

// src/pages/Products.jsx
import React, { useState, useEffect } from 'react';
import { 
    FaPlus, FaEdit, FaTrash, FaSearch, FaTimes, FaImage, FaSpinner, 
    FaFilter, FaArrowUp, FaLock, FaSortAmountDown, FaSortAmountUp,
    FaRupeeSign, FaTag, FaBox, FaChevronLeft, FaChevronRight
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import API from '../utils/Api';
import { usePermission } from '../hooks/usePermission';
import ConfirmModal from '../components/ConfirmModal';

const Products = () => {
    const { hasPermission, getUserRole } = usePermission();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [formData, setFormData] = useState({ 
        name: '', category: '', price: '', description: '', stock: '', image: '' 
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [submitLoading, setSubmitLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(null);
    const [searchPerformed, setSearchPerformed] = useState(false);
    
    // ✅ Delete Confirmation Modal State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    
    // ✅ Advanced Filtering & Sorting States
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState('newest');
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [stockFilter, setStockFilter] = useState('all');
    const [priceFilter, setPriceFilter] = useState('all');
    
    // ✅ Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    const canAddProduct = hasPermission('add_product');
    const canEditProduct = hasPermission('edit_product');
    const canDeleteProduct = hasPermission('delete_product');
    const userRole = getUserRole();

    const categories = [
        'Copper Utensils', 'Steel Bottles', 'Thermoware & Lunchboxes', 
        'Cookware Sets', 'Home Appliances', 'Cookers'
    ];

    // Sorting options
    const sortOptions = [
        { value: 'newest', label: 'Newest First', icon: FaArrowUp },
        { value: 'oldest', label: 'Oldest First', icon: FaArrowUp },
        { value: 'price-asc', label: 'Price: Low to High', icon: FaRupeeSign },
        { value: 'price-desc', label: 'Price: High to Low', icon: FaRupeeSign },
        { value: 'name-asc', label: 'Name: A to Z', icon: FaTag },
        { value: 'name-desc', label: 'Name: Z to A', icon: FaTag },
        { value: 'stock-asc', label: 'Stock: Low to High', icon: FaBox },
        { value: 'stock-desc', label: 'Stock: High to Low', icon: FaBox }
    ];

    // Price presets
    const pricePresets = [
        { label: 'All', value: 'all', min: 0, max: Infinity },
        { label: 'Under ₹500', value: 'under500', min: 0, max: 500 },
        { label: '₹500 - ₹1000', value: '500-1000', min: 500, max: 1000 },
        { label: '₹1000 - ₹5000', value: '1000-5000', min: 1000, max: 5000 },
        { label: 'Above ₹5000', value: 'above5000', min: 5000, max: Infinity }
    ];

    useEffect(() => { fetchProducts(); }, []);

    useEffect(() => {
        if (products.length > 0) {
            applyFiltersAndSorting();
        }
    }, [searchTerm, selectedCategory, sortBy, priceRange, stockFilter, priceFilter, products]);

    const fetchProducts = async () => {
        setLoading(true);
        setSearchPerformed(false);
        try {
            const res = await API.get('/products/all');
            let productsData = res.data.products || res.data || [];
            productsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setProducts(productsData);
            setFilteredProducts(productsData);
        } catch (err) {
            console.error("Fetch error:", err);
            toast.error('Failed to fetch products');
            setProducts([]);
            setFilteredProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const applyFiltersAndSorting = () => {
        let filtered = [...products];
        
        // 1. Search filter
        if (searchTerm.trim()) {
            filtered = filtered.filter(p => 
                p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setSearchPerformed(true);
        } else {
            setSearchPerformed(false);
        }
        
        // 2. Category filter
        if (selectedCategory) {
            filtered = filtered.filter(p => p.category === selectedCategory);
        }
        
        // 3. Price range filter
        if (priceRange.min) {
            filtered = filtered.filter(p => p.price >= Number(priceRange.min));
        }
        if (priceRange.max) {
            filtered = filtered.filter(p => p.price <= Number(priceRange.max));
        }
        
        // 4. Price preset filter
        if (priceFilter !== 'all') {
            const preset = pricePresets.find(p => p.value === priceFilter);
            if (preset) {
                filtered = filtered.filter(p => p.price >= preset.min && p.price <= preset.max);
            }
        }
        
        // 5. Stock filter
        if (stockFilter === 'inStock') {
            filtered = filtered.filter(p => p.stock > 0);
        } else if (stockFilter === 'lowStock') {
            filtered = filtered.filter(p => p.stock > 0 && p.stock < 10);
        } else if (stockFilter === 'outOfStock') {
            filtered = filtered.filter(p => p.stock === 0);
        }
        
        // 6. Sorting
        filtered.sort((a, b) => {
            switch(sortBy) {
                case 'newest':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'oldest':
                    return new Date(a.createdAt) - new Date(b.createdAt);
                case 'price-asc':
                    return a.price - b.price;
                case 'price-desc':
                    return b.price - a.price;
                case 'name-asc':
                    return a.name?.localeCompare(b.name);
                case 'name-desc':
                    return b.name?.localeCompare(a.name);
                case 'stock-asc':
                    return (a.stock || 0) - (b.stock || 0);
                case 'stock-desc':
                    return (b.stock || 0) - (a.stock || 0);
                default:
                    return 0;
            }
        });
        
        setFilteredProducts(filtered);
        setCurrentPage(1);
        
        if (searchTerm.trim() && filtered.length === 0) {
            toast.info(`No products found matching "${searchTerm}"`);
        }
    };

    const resetAllFilters = () => {
        setSearchTerm('');
        setSelectedCategory('');
        setSortBy('newest');
        setPriceRange({ min: '', max: '' });
        setStockFilter('all');
        setPriceFilter('all');
        setSearchPerformed(false);
        toast.info('All filters reset');
    };

    const getActiveFiltersCount = () => {
        let count = 0;
        if (searchTerm) count++;
        if (selectedCategory) count++;
        if (priceRange.min || priceRange.max) count++;
        if (stockFilter !== 'all') count++;
        if (priceFilter !== 'all') count++;
        if (sortBy !== 'newest') count++;
        return count;
    };

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);


const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ✅ Log all form data before sending
    
    // ✅ Check permission
    if (editingProduct && !canEditProduct) {
        toast.error('You don\'t have permission to edit products');
        return;
    }
    if (!editingProduct && !canAddProduct) {
        toast.error('You don\'t have permission to add products');
        return;
    }
    
    // ✅ Check validation rules
    const errors = [];
    if (!formData.name || formData.name.trim() === '') {
        errors.push("Product name is required");
    } else if (formData.name.length < 3) {
        errors.push("Product name must be at least 3 characters");
    }
    
    if (!formData.category) {
        errors.push("Category is required");
    }
    
    if (!formData.price) {
        errors.push("Price is required");
    } else if (isNaN(formData.price) || Number(formData.price) <= 0) {
        errors.push("Price must be a positive number");
    }
    
    if (!formData.description || formData.description.trim() === '') {
        errors.push("Description is required");
    } else if (formData.description.length < 10) {
        errors.push("Description must be at least 10 characters");
    }
    
    if (formData.stock === undefined || formData.stock === null) {
        errors.push("Stock is required");
    } else if (isNaN(formData.stock) || Number(formData.stock) < 0) {
        errors.push("Stock must be a non-negative number");
    }
    
    if (!imageFile && !formData.image && !editingProduct) {
        errors.push("Product image is required");
    }
    
    if (errors.length > 0) {
        errors.forEach(err => toast.error(err));
        return;
    }
    
    console.log("✅ All validations passed, sending to server...");
    setSubmitLoading(true);
    
    try {
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name.trim());
        formDataToSend.append('category', formData.category);
        formDataToSend.append('price', Number(formData.price));
        formDataToSend.append('description', formData.description.trim());
        formDataToSend.append('stock', Number(formData.stock));
        
        if (imageFile) {
            formDataToSend.append('image', imageFile);
        } else if (formData.image) {
            formDataToSend.append('imageUrl', formData.image);
        }
        
        // Log FormData contents
        for (let [key, value] of formDataToSend.entries()) {
            console.log(`   ${key}: ${value instanceof File ? value.name : value}`);
        }
        
        let response;
        if (editingProduct) {
            response = await API.put(`/products/${editingProduct._id}`, formDataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('Product updated successfully!');
        } else {
            response = await API.post('/products/add', formDataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            console.log("✅ Add response:", response.data);
            toast.success('Product added successfully!');
        }
        
        // Reset filters and refresh
        resetAllFilters();
        fetchProducts();
        closeModal();
        
    } catch (err) {
        
        if (err.response?.status === 401) {
            toast.error('Session expired. Please login again.');
            setTimeout(() => window.location.href = '/login', 2000);
        } else if (err.response?.status === 403) {
            toast.error('You don\'t have permission for this action');
        } else if (err.response?.status === 400) {
            const errorMsg = err.response?.data?.message || err.response?.data?.errors?.join(', ') || 'Validation failed';
            toast.error(errorMsg);
        } else if (err.response?.status === 500) {
            toast.error('Server error. Please try again later.');
        } else {
            toast.error(err.response?.data?.message || 'Failed to save product');
        }
    } finally {
        setSubmitLoading(false);
    }
};
    const handleDeleteClick = (product) => {
        if (!canDeleteProduct) {
            toast.error('You don\'t have permission to delete products');
            return;
        }
        setProductToDelete(product);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!productToDelete) return;
        
        setDeleteLoading(productToDelete._id);
        setShowDeleteModal(false);
        
        try {
            await API.delete(`/products/${productToDelete._id}`);
            toast.success('Product deleted successfully!');
            fetchProducts();
        } catch (err) {
            if (err.response?.status === 403) {
                toast.error('You don\'t have permission to delete products');
            } else {
                toast.error(err.response?.data?.message || 'Failed to delete product');
            }
        } finally {
            setDeleteLoading(null);
            setProductToDelete(null);
        }
    };

    const openModal = (product = null) => {
        if (product && !canEditProduct) {
            toast.error('You don\'t have permission to edit products');
            return;
        }
        if (!product && !canAddProduct) {
            toast.error('You don\'t have permission to add products');
            return;
        }
        
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name || '',
                category: product.category || '',
                price: product.price || '',
                description: product.description || '',
                stock: product.stock || '',
                image: product.image || ''
            });
            setImagePreview(product.image);
        } else {
            setEditingProduct(null);
            setFormData({ name: '', category: '', price: '', description: '', stock: '', image: '' });
            setImagePreview('');
        }
        setImageFile(null);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingProduct(null);
        setFormData({ name: '', category: '', price: '', description: '', stock: '', image: '' });
        setImageFile(null);
        setImagePreview('');
        setSubmitLoading(false);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error('Image size should be less than 2MB');
                return;
            }
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
            setFormData({ ...formData, image: '' });
        }
    };

    const RoleBadge = () => {
        const roleColors = {
            super_admin: 'bg-purple-600',
            admin: 'bg-red-600',
            manager: 'bg-blue-600',
            editor: 'bg-green-600',
            viewer: 'bg-gray-600'
        };
        return (
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs text-white ${roleColors[userRole] || 'bg-gray-500'}`}>
                {userRole?.replace('_', ' ').toUpperCase()}
            </span>
        );
    };

    if (loading && products.length === 0) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#8B1E2D] border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading products...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                        Products
                        <RoleBadge />
                        <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-gray-200 text-gray-700">
                            {filteredProducts.length} items
                        </span>
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Manage your product inventory</p>
                </div>
                
                {canAddProduct && (
                    <button onClick={() => openModal()} className="flex items-center gap-2 px-5 py-2.5 bg-[#8B1E2D] text-white rounded-xl hover:bg-[#6B1622] transition-all shadow-md">
                        <FaPlus size={18} /> Add Product
                    </button>
                )}
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search products by name, category or description..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1E2D]"
                        />
                    </div>
                    
                    <div className="flex gap-2 flex-wrap">
                        {/* Category Filter */}
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1E2D] bg-white"
                        >
                            <option value="">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        
                        {/* Sort Dropdown */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1E2D] bg-white"
                        >
                            {sortOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                        
                        {/* Filter Toggle Button */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`px-4 py-3 rounded-lg border transition flex items-center gap-2 ${
                                showFilters || getActiveFiltersCount() > 0 
                                    ? 'bg-[#8B1E2D] text-white border-[#8B1E2D]' 
                                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                            <FaFilter size={14} />
                            Filters
                            {getActiveFiltersCount() > 0 && (
                                <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded-full text-xs">
                                    {getActiveFiltersCount()}
                                </span>
                            )}
                        </button>
                        
                        {(searchTerm || selectedCategory || getActiveFiltersCount() > 0) && (
                            <button
                                onClick={resetAllFilters}
                                className="px-4 py-3 text-gray-600 hover:text-[#8B1E2D] transition border border-gray-200 rounded-lg"
                            >
                                <FaTimes size={14} /> Clear All
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Advanced Filters Panel */}
            {showFilters && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Price Range Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Price Range (₹)</label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={priceRange.min}
                                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1E2D]"
                                />
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={priceRange.max}
                                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1E2D]"
                                />
                            </div>
                        </div>
                        
                        {/* Quick Price Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Quick Price</label>
                            <select
                                value={priceFilter}
                                onChange={(e) => setPriceFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1E2D] bg-white"
                            >
                                {pricePresets.map(preset => (
                                    <option key={preset.value} value={preset.value}>{preset.label}</option>
                                ))}
                            </select>
                        </div>
                        
                        {/* Stock Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Stock Status</label>
                            <select
                                value={stockFilter}
                                onChange={(e) => setStockFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1E2D] bg-white"
                            >
                                <option value="all">All Products</option>
                                <option value="inStock">In Stock Only</option>
                                <option value="lowStock">Low Stock (&lt;10)</option>
                                <option value="outOfStock">Out of Stock</option>
                            </select>
                        </div>
                        
                        {/* Active Filters Info */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Active Filters</label>
                            <div className="bg-gray-50 rounded-lg p-2 text-sm text-gray-600">
                                {getActiveFiltersCount() === 0 ? (
                                    <span>No active filters</span>
                                ) : (
                                    <div className="space-y-1">
                                        {searchTerm && <div>🔍 "{searchTerm}"</div>}
                                        {selectedCategory && <div>📁 {selectedCategory}</div>}
                                        {(priceRange.min || priceRange.max) && <div>💰 ₹{priceRange.min || 0} - ₹{priceRange.max || '∞'}</div>}
                                        {stockFilter !== 'all' && <div>📦 {stockFilter === 'inStock' ? 'In Stock' : stockFilter === 'lowStock' ? 'Low Stock' : 'Out of Stock'}</div>}
                                        {sortBy !== 'newest' && <div>📊 {sortOptions.find(o => o.value === sortBy)?.label}</div>}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Products Count Info */}
            <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                <p className="text-sm text-gray-500">
                    Showing {currentProducts.length} of {filteredProducts.length} products
                    {searchPerformed && ` matching "${searchTerm}"`}
                </p>
                <div className="text-xs text-gray-400 flex items-center gap-2">
                    <FaArrowUp size={10} /> Sorted by: {sortOptions.find(o => o.value === sortBy)?.label}
                </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                    <div className="text-6xl mb-4">📦</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {searchPerformed ? 'No Products Found' : 'No Products Yet'}
                    </h3>
                    <p className="text-gray-500 mb-4">
                        {searchPerformed 
                            ? `No products matching "${searchTerm}" were found. Try different filters.`
                            : "You haven't added any products yet."}
                    </p>
                    {!searchPerformed && canAddProduct && (
                        <button onClick={() => openModal()} className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#8B1E2D] text-white rounded-xl hover:bg-[#6B1622] transition">
                            <FaPlus size={18} /> Add Your First Product
                        </button>
                    )}
                    {searchPerformed && (
                        <button onClick={resetAllFilters} className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition">
                            Clear All Filters
                        </button>
                    )}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {currentProducts.map((product, index) => (
                            <div key={product._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group relative">
                                {index === 0 && !searchPerformed && !selectedCategory && getActiveFiltersCount() === 0 && (
                                    <div className="absolute top-2 left-2 z-10">
                                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                            <FaPlus size={10} /> New
                                        </span>
                                    </div>
                                )}
                                <div className="h-48 bg-gray-100 relative overflow-hidden">
                                    <img 
                                        src={product.image || 'https://via.placeholder.com/400x300?text=No+Image'} 
                                        alt={product.name} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        loading="lazy"
                                    />
                                    {product.stock < 5 && product.stock > 0 && (
                                        <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">Low Stock</span>
                                    )}
                                    {product.stock === 0 && (
                                        <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">Out of Stock</span>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-gray-800 mb-1 truncate">{product.name}</h3>
                                    <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-xl font-bold text-[#8B1E2D]">₹{product.price?.toLocaleString()}</span>
                                        <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            Stock: {product.stock || 0}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">{product.description}</p>
                                    
                                    <div className="flex gap-2">
                                        {canEditProduct && (
                                            <button onClick={() => openModal(product)} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition">
                                                <FaEdit size={14} /> Edit
                                            </button>
                                        )}
                                        {canDeleteProduct && (
                                            <button onClick={() => handleDeleteClick(product)} disabled={deleteLoading === product._id} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition disabled:opacity-50">
                                                {deleteLoading === product._id ? <FaSpinner className="animate-spin" size={14} /> : <FaTrash size={14} />} Delete
                                            </button>
                                        )}
                                        {!canEditProduct && !canDeleteProduct && (
                                            <div className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-50 text-gray-500 rounded-lg">
                                                <FaLock size={14} /> Read Only
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50 hover:bg-gray-200 transition flex items-center gap-1"
                            >
                                <FaChevronLeft size={12} /> Previous
                            </button>
                            
                            <div className="flex gap-1">
                                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={`w-10 h-10 rounded-lg transition ${
                                                currentPage === pageNum
                                                    ? 'bg-[#8B1E2D] text-white'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>
                            
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50 hover:bg-gray-200 transition flex items-center gap-1"
                            >
                                Next <FaChevronRight size={12} />
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Add/Edit Modal */}
            {modalOpen && (canAddProduct || canEditProduct) && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={closeModal}>
                    <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                            <h2 className="text-xl font-bold">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                            <button onClick={closeModal} className="p-1 hover:bg-gray-100 rounded-lg"><FaTimes size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <input type="text" placeholder="Product Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-3 border rounded-lg" required />
                            <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full p-3 border rounded-lg" required>
                                <option value="">Select Category</option>
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                            <input type="number" placeholder="Price (₹)" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full p-3 border rounded-lg" required />
                            <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows="3" className="w-full p-3 border rounded-lg" required />
                            <input type="number" placeholder="Stock Quantity" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} className="w-full p-3 border rounded-lg" required />
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                {imagePreview ? (
                                    <div className="relative inline-block">
                                        <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg mx-auto" />
                                        <button type="button" onClick={() => { setImagePreview(''); setImageFile(null); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><FaTimes size={14} /></button>
                                    </div>
                                ) : (
                                    <>
                                        <FaImage className="text-4xl text-gray-400 mx-auto mb-2" />
                                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="productImage" />
                                        <label htmlFor="productImage" className="cursor-pointer text-gray-500">Click to upload image</label>
                                    </>
                                )}
                            </div>
                            <input type="text" placeholder="Or enter image URL" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} className="w-full p-3 border rounded-lg" />
                            <div className="flex gap-3 pt-4">
                                <button type="submit" disabled={submitLoading} className="flex-1 bg-[#8B1E2D] text-white py-3 rounded-xl hover:bg-[#6B1622] transition disabled:opacity-50 flex items-center justify-center gap-2">
                                    {submitLoading ? <><FaSpinner className="animate-spin" /> {editingProduct ? 'Updating...' : 'Adding...'}</> : (editingProduct ? 'Update Product' : 'Add Product')}
                                </button>
                                <button type="button" onClick={closeModal} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setProductToDelete(null);
                }}
                onConfirm={handleConfirmDelete}
                title="Delete Product"
                message={`Are you sure you want to delete "${productToDelete?.name}"?`}
                confirmText="Yes, Delete Product"
                cancelText="Cancel"
                isLoading={deleteLoading !== null}
            />
        </div>
    );
};

export default Products;