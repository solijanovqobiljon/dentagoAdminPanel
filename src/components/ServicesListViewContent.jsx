import React, { useState } from 'react';
import { Search, Plus, Edit2, Eye, ChevronLeft, ChevronRight, Users, ChevronDown, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataProvider';
import Modal from './common/Modal';

const ServicesListViewContent = () => {
    const navigate = useNavigate();
    const { data, updateData, t } = useData();
    const services = data.services || [];
    const categories = data.serviceCategories || [];

    const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [selectedService, setSelectedService] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    // Form data for new service
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        costPrice: '',
        categoryId: '',
        status: 'Faol'
    });

    const getStatusClasses = (status) => {
        return status === "Faol"
            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    };

    const getCategoryName = (id) => {
        const cat = categories.find(c => c.id == id);
        return cat ? cat.name : '-';
    };

    const getCategoryColor = (id) => {
        const cat = categories.find(c => c.id == id);
        return cat ? cat.color : '#cbd5e0'; // default gray
    };

    // Filter logic
    const filteredServices = services.filter(service => {
        const matchSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchCategory = filterCategory ? service.categoryId == filterCategory : true;
        return matchSearch && matchCategory;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredServices.slice(indexOfFirstItem, indexOfLastItem);
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    const handleSave = () => {
        if (!formData.name || !formData.price || !formData.categoryId) {
            alert(t('fill_required'));
            return;
        }
        if (formData.id) {
            updateData('services', formData, 'UPDATE');
        } else {
            updateData('services', formData, 'ADD');
        }
        setIsServiceModalOpen(false);
        setFormData({ name: '', price: '', costPrice: '', categoryId: '', status: 'Faol' });
    };

    const handleEdit = (service) => {
        setFormData(service);
        setIsServiceModalOpen(true);
    };

    const handleView = (service) => {
        setSelectedService(service);
        setIsViewModalOpen(true);
    };

    return (
        <div className="p-4 md:p-8 space-y-6">

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                        <Link to="/" className="hover:text-blue-600 transition-colors capitalize">{t('dashboard')}</Link>
                        <span className="text-slate-300">/</span>
                        <span className="text-slate-900 dark:text-white capitalize">{t('services')}</span>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-3 w-full sm:w-auto">

                    <div className="relative grow">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder={t('search')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full py-2 pl-10 pr-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="relative">
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="appearance-none block w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:border-blue-500 h-full"
                        >
                            <option value="">Barcha kategoriyalar</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400 w-5 h-5" />
                    </div>

                    <button
                        onClick={() => setIsServiceModalOpen(true)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition w-full md:w-auto"
                    >
                        <Plus className="w-5 h-5" />
                        {t('add')}
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">

                    <thead className='bg-gray-50 dark:bg-gray-900/50'>
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 w-16">#</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 w-3/12">Nomi</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 w-2/12">Kategoriya</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 w-2/12">Narxi</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 w-2/12">Xom-ashyo narxi</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 w-1/12">Holati</th>
                            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 w-20">Harakatlar</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {currentItems.length > 0 ? (
                            currentItems.map((service, index) => (
                                <tr key={service.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{indexOfFirstItem + index + 1}</td>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{service.name}</td>

                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                                        <span
                                            className="px-2 py-1 rounded-md text-gray-700 dark:text-gray-200"
                                            style={{ backgroundColor: `${getCategoryColor(service.categoryId)}40` }} // 40 = 25% opacity
                                        >
                                            {getCategoryName(service.categoryId)}
                                        </span>
                                    </td>

                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{service.price}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{service.costPrice}</td>

                                    <td className="px-4 py-3 whitespace-nowrap text-center">
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusClasses(service.status)}`}>
                                            {service.status}
                                        </span>
                                    </td>

                                    <td className="px-4 py-3 whitespace-nowrap text-right flex justify-end gap-2">
                                        <button
                                            onClick={() => navigate(`/klinika/xizmatlar/${service.id}/assign`)}
                                            className="p-2 text-yellow-600 rounded-full hover:bg-yellow-50 dark:hover:bg-yellow-900/30 transition"
                                            title="Xodimlarga biriktirish"
                                        >
                                            <Users className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleEdit(service)}
                                            className="p-2 text-blue-600 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition"
                                            title={t('edit')}
                                        >
                                            <Edit2 className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleView(service)}
                                            className="p-2 text-green-600 rounded-full hover:bg-green-50 dark:hover:bg-green-900/30 transition"
                                            title="Ko'rish"
                                        >
                                            <Eye className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="7" className="p-8 text-center text-gray-500 dark:text-gray-400">Xizmatlar topilmadi</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className='flex justify-end pt-4'>
                    <nav className="flex items-center space-x-1" aria-label="Pagination">
                        <button
                            className="p-2 text-gray-500 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:text-gray-300 dark:disabled:text-gray-600"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => p - 1)}
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        {pageNumbers.map(number => (
                            <button
                                key={number}
                                onClick={() => setCurrentPage(number)}
                                className={`px-3 py-1 text-sm rounded-lg transition ${number === currentPage
                                    ? 'bg-blue-600 text-white font-semibold'
                                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                {number}
                            </button>
                        ))}

                        <button
                            className="p-2 text-gray-500 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:text-gray-300 dark:disabled:text-gray-600"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(p => p + 1)}
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </nav>
                </div>
            )}

            <Modal
                isOpen={isServiceModalOpen}
                onClose={() => setIsServiceModalOpen(false)}
                title={t('add') || "Xizmat qo'shish"}
                footer={
                    <button onClick={handleSave} className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition w-full">
                        <Plus className="w-5 h-5" />
                        {t('save')}
                    </button>
                }
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('name') || 'Xizmat nomi'}<span className='text-red-500'>*</span></label>
                        <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Xizmat nomini kiriting" className="w-full py-2.5 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('price') || 'Xizmat narxi'}<span className='text-red-500'>*</span></label>
                        <input type="text" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="Xizmat narxini kiriting" className="w-full py-2.5 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Xom-ashyo narxi</label>
                        <input type="text" value={formData.costPrice} onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })} placeholder="Xom-ashyo narxini kiriting" className="w-full py-2.5 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('category') || 'Kategoriya'}<span className='text-red-500'>*</span></label>
                        <div className="relative">
                            <select
                                value={formData.categoryId}
                                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                className="appearance-none block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-2.5 px-3 pr-8 rounded-lg leading-tight focus:outline-none focus:border-blue-500"
                            >
                                <option value="">Kategoriya tanlang</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                            <ChevronDown className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300 w-5 h-5" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Holati</label>
                        <div className="relative">
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="appearance-none block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-2.5 px-3 pr-8 rounded-lg leading-tight focus:outline-none focus:border-blue-500"
                            >
                                <option value="Faol">Faol</option>
                                <option value="Faol Emas">Faol Emas</option>
                            </select>
                            <ChevronDown className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300 w-5 h-5" />
                        </div>
                    </div>
                </div>
            </Modal>

            {/* View Details Modal */}
            <Modal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                title={t('services') + ": " + (selectedService?.name || '')}
            >
                {selectedService && (
                    <div className="space-y-4">
                        <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                            <span className="text-gray-500 dark:text-gray-400">{t('name')}:</span>
                            <span className="font-medium text-gray-900 dark:text-white">{selectedService.name}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                            <span className="text-gray-500 dark:text-gray-400">{t('category')}:</span>
                            <span className="font-medium text-gray-900 dark:text-white">{getCategoryName(selectedService.categoryId)}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                            <span className="text-gray-500 dark:text-gray-400">{t('price')}:</span>
                            <span className="font-medium text-gray-900 dark:text-white">{selectedService.price}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                            <span className="text-gray-500 dark:text-gray-400">Xom-ashyo narxi:</span>
                            <span className="font-medium text-gray-900 dark:text-white">{selectedService.costPrice || '0 so\'m'}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                            <span className="text-gray-500 dark:text-gray-400">{t('status')}:</span>
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusClasses(selectedService.status)}`}>
                                {selectedService.status}
                            </span>
                        </div>
                    </div>
                )}
            </Modal>

        </div>
    );
};
export default ServicesListViewContent;
