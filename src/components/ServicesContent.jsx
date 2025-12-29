import React, { useState, useEffect } from 'react';
import { Plus, Printer, Edit2, Trash2, LayoutGrid, List, Check } from 'lucide-react';
import { useData } from '../context/DataProvider';
import Modal from './common/Modal';
import { Link } from 'react-router-dom';

const ServicesContent = () => {
    const { data, updateData, t } = useData();
    const services = data.services || [];
    const categories = data.serviceCategories || [];

    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [viewMode, setViewMode] = useState('grid');

    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);

    const [categoryForm, setCategoryForm] = useState({ name: '', color: '#3B82F6' });
    const [serviceForm, setServiceForm] = useState({
        name: '',
        price: '',
        costPrice: '',
        categoryId: '',
        status: 'Faol'
    });

    useEffect(() => {
        if (!selectedCategoryId && categories.length > 0) {
            setSelectedCategoryId(categories[0].id);
        }
    }, [categories, selectedCategoryId]);

    const selectedCategory = categories.find(c => c.id === selectedCategoryId);
    const filteredServices = services.filter(s => s.categoryId === selectedCategoryId);

    const handleCategoryClick = (id) => {
        setSelectedCategoryId(id);
    };

    const handleSaveCategory = () => {
        if (!categoryForm.name) return;
        const newCategory = {
            id: Date.now(),
            ...categoryForm,
            status: 'Faol'
        };
        updateData('serviceCategories', newCategory, 'ADD');
        setIsCategoryModalOpen(false);
        setCategoryForm({ name: '', color: '#3B82F6' });
    };

    const handleSaveService = () => {
        if (!serviceForm.name || !serviceForm.price || !serviceForm.categoryId) return;
        const newService = {
            id: Date.now(),
            ...serviceForm,
            price: serviceForm.price + " so'm",
            costPrice: serviceForm.costPrice ? serviceForm.costPrice + " so'm" : ""
        };
        updateData('services', newService, 'ADD');
        setIsServiceModalOpen(false);
        setServiceForm({ name: '', price: '', costPrice: '', categoryId: selectedCategoryId || '', status: 'Faol' });
    };

    const handleDeleteService = (service) => {
        if (window.confirm(t('confirm_delete') || "O'chirishni tasdiqlaysizmi?")) {
            updateData('services', service, 'DELETE');
        }
    };

    const colorOptions = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#FCA5A5', '#9CA3AF'];

    const servicesByCategory = categories.map(cat => ({
        ...cat,
        services: services.filter(s => s.categoryId === cat.id)
    }));

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] lg:h-[calc(100vh-80px)] overflow-hidden bg-white dark:bg-slate-950">
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 border-b border-blue-50 dark:border-blue-900/20 p-4 sm:p-6 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center shadow-xl shadow-blue-500/5 z-10 shrink-0">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                        <Link to="/" className="hover:text-blue-600 transition-colors capitalize">{t('dashboard')}</Link>
                        <span className="text-slate-300">/</span>
                        <span className="text-slate-900 dark:text-white capitalize">{t('services')}</span>
                    </div>
                </div>

                <div className="flex items-center gap-3 justify-between sm:justify-end">
                    <div className="bg-blue-50 dark:bg-blue-950/40 p-1 rounded-xl flex items-center shrink-0 border border-blue-100 dark:border-blue-900/20">
                        <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-blue-600 shadow-md text-blue-600 dark:text-white' : 'text-blue-400 dark:text-blue-600'}`}><List className="w-5 h-5" /></button>
                        <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-blue-600 shadow-md text-blue-600 dark:text-white' : 'text-blue-400 dark:text-blue-600'}`}><LayoutGrid className="w-5 h-5" /></button>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="flex items-center justify-center p-2.5 sm:px-6 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-95 uppercase tracking-widest text-[10px]">
                            <Printer className="w-4 h-4 sm:mr-2" />
                            <span className="hidden sm:inline">{t('print') || "Chop etish"}</span>
                        </button>
                        <button onClick={() => setIsCategoryModalOpen(true)} className="flex items-center justify-center p-2.5 sm:px-6 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-95 uppercase tracking-widest text-[10px]">
                            <Plus className="w-4 h-4 sm:mr-2" />
                            <span className="hidden sm:inline">{t('add_category') || "Kategoriya"}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden">
                {viewMode === 'list' ? (
                    <div className="flex flex-col lg:flex-row h-full">
                        {/* Categories Sidebar/Top-bar */}
                        <div className="w-full lg:w-72 bg-white dark:bg-slate-900 border-b lg:border-r border-blue-50 dark:border-blue-900/20 flex flex-col shrink-0">
                            <div className="hidden lg:block p-6 border-b border-blue-50 dark:border-blue-900/10 bg-blue-50/10 dark:bg-blue-950/10">
                                <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('categories') || "Kategoriyalar"}</h2>
                            </div>
                            <div className="flex lg:flex-col overflow-x-auto lg:overflow-y-auto p-3 gap-2 no-scrollbar">
                                {categories.map(category => (
                                    <button
                                        key={category.id}
                                        onClick={() => handleCategoryClick(category.id)}
                                        className={`whitespace-nowrap lg:whitespace-normal shrink-0 text-left px-5 py-3 rounded-2xl flex items-center justify-between transition-all duration-300 ${selectedCategoryId === category.id ? 'bg-blue-600 text-white font-black shadow-lg shadow-blue-500/20 translate-x-1' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20'}`}
                                    >
                                        <span className="uppercase text-[10px] font-black tracking-widest truncate">{category.name}</span>
                                        {selectedCategoryId === category.id && <Check className="w-4 h-4" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* List Content */}
                        <div className="flex-1 overflow-y-auto p-4 sm:p-10 bg-white dark:bg-slate-950">
                            {selectedCategory && (
                                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-blue-500/5 border border-blue-50 dark:border-blue-900/10 overflow-hidden">
                                    <div className="px-8 py-6 flex justify-between items-center bg-blue-600">
                                        <div className="flex items-center gap-4">
                                            <div className="w-3 h-10 bg-white/20 rounded-full"></div>
                                            <h3 className="text-lg sm:text-xl font-black text-white truncate uppercase tracking-tighter">{selectedCategory.name}</h3>
                                        </div>
                                        <button className="p-2 sm:p-3 bg-white/20 hover:bg-white/30 rounded-2xl text-white backdrop-blur-md border border-white/10 transition-all active:scale-90"><Edit2 className="w-5 h-5" /></button>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-[700px] lg:min-w-full divide-y divide-gray-200 dark:divide-blue-900/20">
                                            <thead className="bg-blue-50/50 dark:bg-blue-900/10">
                                                <tr>
                                                    <th className="px-6 py-4 text-left text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-widest">{t('service_name') || "Xizmat nomi"}</th>
                                                    <th className="px-6 py-4 text-center text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-widest">{t('price') || "Narx"}</th>
                                                    <th className="px-6 py-4 text-center text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-widest">{t('cost_price') || "Xom ashyo"}</th>
                                                    <th className="px-6 py-4 text-right text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-widest w-24">{t('actions') || "Harakatlar"}</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 dark:divide-blue-900/10">
                                                {filteredServices.length > 0 ? filteredServices.map(service => (
                                                    <tr key={service.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors">
                                                        <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">{service.name}</td>
                                                        <td className="px-6 py-4 text-center text-sm text-blue-600 dark:text-blue-400 font-black">{service.price}</td>
                                                        <td className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400 font-medium">{service.costPrice || '—'}</td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <button className="p-2 text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 rounded-xl transition-all active:scale-90"><Edit2 className="w-4 h-4" /></button>
                                                                <button onClick={() => handleDeleteService(service)} className="p-2 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 rounded-xl transition-all active:scale-90"><Trash2 className="w-4 h-4" /></button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )) : (
                                                    <tr><td colSpan="4" className="px-6 py-16 text-center text-gray-400 text-sm font-medium italic">{t('no_data') || "Ma'lumot mavjud emas"}</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    /* GRID VIEW */
                    <div className="h-full overflow-y-auto p-3 sm:p-6 bg-gray-50 dark:bg-gray-900">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 pb-20">
                            {servicesByCategory.map(category => (
                                <div key={category.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col h-full">
                                    <div className="px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center text-white" style={{ backgroundColor: category.color || '#3B82F6' }}>
                                        <h3 className="text-sm sm:text-base font-bold truncate uppercase">{category.name}</h3>
                                        <button className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg shrink-0 backdrop-blur-sm"><Edit2 className="w-4 h-4" /></button>
                                    </div>

                                    <div className="flex-1 overflow-x-auto overflow-y-hidden">
                                        <table className="w-full divide-y divide-gray-100 dark:divide-gray-700">
                                            <thead className="bg-gray-50 dark:bg-gray-900/50">
                                                <tr>
                                                    <th className="px-3 py-2 text-left text-[10px] font-semibold text-gray-500 uppercase">{t('service_name') || "Nomi"}</th>
                                                    <th className="px-3 py-2 text-center text-[10px] font-semibold text-gray-500 uppercase">{t('price') || "Narx"}</th>
                                                    <th className="px-3 py-2 text-center text-[10px] font-semibold text-gray-500 uppercase">{t('actions') || "Amallar"}</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                                                {category.services.length > 0 ? category.services.map(service => (
                                                    <tr key={service.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                                        <td className="px-3 py-2.5 text-xs font-medium text-gray-900 dark:text-white truncate max-w-[120px]">{service.name}</td>
                                                        <td className="px-3 py-2.5 whitespace-nowrap text-xs text-center font-bold text-gray-700 dark:text-gray-300">{service.price}</td>
                                                        <td className="px-3 py-2.5 whitespace-nowrap text-center">
                                                            <div className="flex items-center justify-center gap-1.5">
                                                                <button className="p-1 text-blue-500 bg-blue-50 dark:bg-blue-900/20 rounded-md"><Edit2 className="w-3.5 h-3.5" /></button>
                                                                <button onClick={() => handleDeleteService(service)} className="p-1 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-md"><Trash2 className="w-3.5 h-3.5" /></button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )) : (
                                                    <tr><td colSpan="3" className="px-4 py-6 text-center text-gray-400 text-[10px] italic">Bo'sh</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="p-3 sm:p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/30">
                                        <button onClick={() => { setSelectedCategoryId(category.id); setServiceForm(prev => ({ ...prev, categoryId: category.id })); setIsServiceModalOpen(true); }} className="w-full py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-200 hover:bg-gray-50 transition shadow-sm flex items-center justify-center gap-2">
                                            <Plus className="w-4 h-4" /> {t('add_service') || "Xizmat qo'shish"}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Modals are kept as they were, but styles are handled inside their component */}
            <Modal
                isOpen={isCategoryModalOpen}
                onClose={() => setIsCategoryModalOpen(false)}
                title={t('add_category') || "Kategoriya qo'shish"}
                footer={
                    <button onClick={handleSaveCategory} className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2">
                        <Plus className="w-5 h-5" />
                        {t('add') || "Qo'shish"}
                    </button>
                }
            >
                <div className="space-y-4 sm:space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('category_name') || "Kategoriya nomi"}</label>
                        <input
                            type="text"
                            value={categoryForm.name}
                            onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                            placeholder="Masalan: Stomatologiya"
                            className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white py-2.5 sm:py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('category_color') || "Kategoriya rangi"}</label>
                        <div className="grid grid-cols-4 sm:flex sm:flex-wrap gap-2 sm:gap-3">
                            {colorOptions.map(color => (
                                <button
                                    key={color}
                                    onClick={() => setCategoryForm({ ...categoryForm, color })}
                                    className={`w-full aspect-square sm:w-10 sm:h-10 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${categoryForm.color === color ? 'border-gray-600 scale-110 shadow-md' : 'border-transparent'}`}
                                    style={{ backgroundColor: color }}
                                >
                                    {categoryForm.color === color && <Check className="w-5 h-5 text-white drop-shadow-md" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={isServiceModalOpen}
                onClose={() => setIsServiceModalOpen(false)}
                title={t('add_service') || "Xizmat qo'shish"}
                footer={
                    <button onClick={handleSaveService} className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2">
                        <Plus className="w-5 h-5" />
                        {t('add') || "Qo'shish"}
                    </button>
                }
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('service_name') || "Xizmat nomi"}*</label>
                        <input
                            type="text"
                            value={serviceForm.name}
                            onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                            className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white py-2.5 sm:py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('service_price') || "Narxi"}*</label>
                            <input
                                type="number"
                                value={serviceForm.price}
                                onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                                className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white py-2.5 px-4 rounded-xl"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('cost_price') || "Xom-ashyo"}</label>
                            <input
                                type="number"
                                value={serviceForm.costPrice}
                                onChange={(e) => setServiceForm({ ...serviceForm, costPrice: e.target.value })}
                                className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white py-2.5 px-4 rounded-xl"
                            />
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ServicesContent;