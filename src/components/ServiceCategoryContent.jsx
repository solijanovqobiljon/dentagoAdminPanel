import React, { useState } from 'react';
import { Search, Plus, Edit2, Eye, X, Trash2, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataProvider';
import Modal from './common/Modal';

const getStatusClasses = (status, isDark = false) => {
    if (status === "Faol" || status === "Active" || status === "Активный") {
        return isDark
            ? "bg-green-900/30 text-green-400"
            : "bg-green-100 text-green-700";
    }
    return isDark
        ? "bg-red-900/30 text-red-400"
        : "bg-red-100 text-red-700";
};

const ServiceCategoryContent = () => {
    const { data, updateData, t } = useData();
    const categories = data.serviceCategories || [];

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [addForm, setAddForm] = useState({ name: '', color: '#4299E1', status: 'Faol' });
    const [editForm, setEditForm] = useState({ id: null, name: '', color: '', status: '' });

    const handleActionClick = (category, actionType) => {
        setSelectedCategory(category);
        if (actionType === 'edit') {
            setEditForm({ ...category });
            setIsEditModalOpen(true);
        } else if (actionType === 'detail') {
            setIsDetailModalOpen(true);
        }
    };

    const handleDelete = (id, name) => {
        if (window.confirm(`${name}: ${t('confirm_delete')}`)) {
            updateData('serviceCategories', { id }, 'DELETE');
        }
    };

    const handleAddSubmit = () => {
        if (!addForm.name) {
            alert(t('fill_required'));
            return;
        }
        updateData('serviceCategories', addForm, 'ADD');
        setIsAddModalOpen(false);
        setAddForm({ name: '', color: '#4299E1', status: 'Faol' });
    };

    const handleEditSubmit = () => {
        if (!editForm.name) {
            alert(t('fill_required'));
            return;
        }
        updateData('serviceCategories', editForm, 'UPDATE');
        setIsEditModalOpen(false);
    };

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const availableColors = ["#4299E1", "#F687B3", "#F64E60", "#F6AD9C", "#9AE6B4", "#805AD5", "#ECC94B"];

    return (
        <div className="p-4 md:p-8 space-y-6">

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                        <Link to="/" className="hover:text-blue-600 transition-colors capitalize">{t('dashboard')}</Link>
                        <span className="text-slate-300">/</span>
                        <span className="text-slate-900 dark:text-white capitalize">{t('service_category')}</span>
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

                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition w-full md:w-auto"
                    >
                        <Plus className="w-5 h-5" />
                        {t('add')}
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">

                    <thead className="bg-gray-50 dark:bg-gray-900/50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase w-16">#</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase w-1/4">{t('name')}</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase w-1/4">{t('color')}</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase w-1/4">{t('status')}</th>
                            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase w-24">{t('actions')}</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredCategories.length > 0 ? (
                            filteredCategories.map((category, index) => (
                                <tr key={category.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{index + 1}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{category.name}</td>

                                    <td className="px-4 py-3">
                                        <div className="h-6 w-full rounded-md" style={{ backgroundColor: category.color || '#ccc', opacity: 0.5, borderLeft: `4px solid ${category.color || '#999'}` }} title={category.color}>
                                        </div>
                                    </td>

                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusClasses(category.status)}`}>
                                            {category.status}
                                        </span>
                                    </td>

                                    <td className="px-4 py-3 whitespace-nowrap text-right flex justify-end gap-2">
                                        <button
                                            onClick={() => handleActionClick(category, 'edit')}
                                            className="p-2 text-blue-600 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition"
                                            title={t('edit')}
                                        >
                                            <Edit2 className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleActionClick(category, 'detail')}
                                            className="p-2 text-green-600 rounded-full hover:bg-green-50 dark:hover:bg-green-900/30 transition"
                                            title={t('view')}
                                        >
                                            <Eye className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(category.id, category.name)}
                                            className="p-2 text-red-600 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 transition"
                                            title={t('delete')}
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="5" className="p-8 text-center text-gray-500 dark:text-gray-400">{t('category')} topilmadi</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Qo'shish Modali */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title={t('add')}
                footer={
                    <button onClick={handleAddSubmit} className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition w-full">
                        <Plus className="w-5 h-5" /> {t('add')}
                    </button>
                }
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('category')} {t('name')}</label>
                        <input type="text" value={addForm.name} onChange={(e) => setAddForm({ ...addForm, name: e.target.value })} placeholder={t('name')} className="w-full py-2.5 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('color')}</label>
                        <div className="flex flex-wrap gap-2 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                            {availableColors.map(color => (
                                <div
                                    key={color}
                                    onClick={() => setAddForm({ ...addForm, color })}
                                    className={`w-6 h-6 rounded-full cursor-pointer border-2 ${addForm.color === color ? 'border-gray-800 dark:border-white' : 'border-transparent'}`}
                                    style={{ backgroundColor: color }}
                                ></div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('status')}</label>
                        <div className="flex gap-4 p-0.5 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            <button onClick={() => setAddForm({ ...addForm, status: 'Faol' })} className={`flex-1 py-2 font-semibold rounded-lg transition ${addForm.status === 'Faol' ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-300'}`}>{t('active')}</button>
                            <button onClick={() => setAddForm({ ...addForm, status: 'Nofaol' })} className={`flex-1 py-2 font-semibold rounded-lg transition ${addForm.status === 'Nofaol' ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-300'}`}>{t('inactive')}</button>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Tahrirlash Modali */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title={t('edit')}
                footer={
                    <button onClick={handleEditSubmit} className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition w-full">
                        {t('save')}
                    </button>
                }
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('category')} {t('name')}</label>
                        <input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="w-full py-2.5 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('color')}</label>
                        <div className="flex flex-wrap gap-2 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                            {availableColors.map(color => (
                                <div
                                    key={color}
                                    onClick={() => setEditForm({ ...editForm, color })}
                                    className={`w-6 h-6 rounded-full cursor-pointer border-2 ${editForm.color === color ? 'border-gray-800 dark:border-white' : 'border-transparent'}`}
                                    style={{ backgroundColor: color }}
                                ></div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('status')}</label>
                        <div className="flex gap-4 p-0.5 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            <button onClick={() => setEditForm({ ...editForm, status: 'Faol' })} className={`flex-1 py-2 font-semibold rounded-lg transition ${editForm.status === 'Faol' ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-300'}`}>{t('active')}</button>
                            <button onClick={() => setEditForm({ ...editForm, status: 'Nofaol' })} className={`flex-1 py-2 font-semibold rounded-lg transition ${editForm.status === 'Nofaol' ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-300'}`}>{t('inactive')}</button>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Batafsil Modali */}
            <Modal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                title={t('view')}
            >
                {selectedCategory && (
                    <div className="space-y-4">
                        <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">ID</span>
                            <span className="text-sm font-semibold text-gray-800 dark:text-white">{selectedCategory.id}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('name')}</span>
                            <span className="text-sm font-semibold text-gray-800 dark:text-white">{selectedCategory.name}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('color')}</span>
                            <span className="text-sm font-semibold flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full border ring-2 ring-opacity-50" style={{ backgroundColor: selectedCategory.color, borderColor: selectedCategory.color }}></span>
                                <span className="text-gray-800 dark:text-white">{selectedCategory.color}</span>
                            </span>
                        </div>
                        <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('status')}</span>
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusClasses(selectedCategory.status)}`}>
                                {selectedCategory.status}
                            </span>
                        </div>
                    </div>
                )}
            </Modal>

        </div>
    );
};
export default ServiceCategoryContent;
