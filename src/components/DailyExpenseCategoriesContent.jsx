// src/components/DailyExpenseCategoriesContent.jsx

import React, { useState } from 'react';
import { Plus, X, Search, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataProvider';

// Kategoriya qo'shish/tahrirlash modal oynasi
const AddEditCategoryModal = ({ isOpen, onClose, editingCategory }) => {
    const { updateData, t } = useData();
    const [categoryName, setCategoryName] = useState(editingCategory?.name || '');
    const [status, setStatus] = useState(editingCategory?.status || 'Faol');

    const handleSave = () => {
        if (!categoryName) {
            alert(t('fill_required'));
            return;
        }

        const newCategory = {
            id: editingCategory?.id,
            name: categoryName,
            status: status,
        };

        if (editingCategory) {
            updateData('expenseCategories', newCategory, 'UPDATE');
        } else {
            updateData('expenseCategories', newCategory, 'ADD');
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-end">
            <div className="bg-white dark:bg-gray-800 w-full max-w-md h-full shadow-2xl overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">{editingCategory ? t('edit') : t('add')} {t('category')}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><X className="w-6 h-6" /></button>
                </div>

                {/* Body - Forma */}
                <div className="p-6 space-y-6">

                    {/* Kategoriya nomi */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('category')} {t('name')}</label>
                        <input
                            type="text"
                            placeholder={t('name')}
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Holati */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block">{t('status')}</label>
                        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                            <button
                                onClick={() => setStatus('Faol')}
                                className={`w-1/2 py-2 text-sm font-semibold rounded-lg transition-colors ${status === 'Faol' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                            >
                                {t('active')}
                            </button>
                            <button
                                onClick={() => setStatus('Nofaol')}
                                className={`w-1/2 py-2 text-sm font-semibold rounded-lg transition-colors ${status === 'Nofaol' ? 'bg-white dark:bg-gray-800 text-gray-700 dark:text-white shadow-md' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                            >
                                {t('inactive')}
                            </button>
                        </div>
                    </div>

                </div>

                {/* Footer - Tugma */}
                <div className="p-5 border-t border-gray-200 dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-800">
                    <button
                        onClick={handleSave}
                        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                        {editingCategory ? t('save') : `+ ${t('add')}`}
                    </button>
                </div>
            </div>
        </div>
    );
};


// No data view when there are no categories to show
const NoDataView = ({ t }) => {
    return (
        <div className="w-full py-12 flex flex-col items-center justify-center text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-inbox mx-auto text-gray-300 dark:text-gray-600 mb-4">
                <path d="M22 12v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6" />
                <path d="M16 6l-4-3-4 3" />
                <path d="M12 3v9" />
            </svg>
            <div className="text-lg font-medium text-gray-700 dark:text-gray-300">Ma'lumot topilmadi</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">Hozircha hech qanday kategoriya yo'q yoki qidiruv natijasi bo'sh.</div>
        </div>
    );
};

const DailyExpenseCategoriesContent = () => {
    const { data, updateData, t } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleOpenModal = (category = null) => {
        setEditingCategory(category);
        setIsModalOpen(true);
    };

    const handleDelete = (id, name) => {
        if (window.confirm(`${name}: ${t('confirm_delete')}`)) {
            updateData('expenseCategories', { id }, 'DELETE');
        }
    };

    const filteredCategories = data.expenseCategories.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4 md:p-8 space-y-6">

            {/* Breadcrumbs va Filterlar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                        <Link to="/" className="hover:text-blue-600 transition-colors capitalize">{t('dashboard')}</Link>
                        <span className="text-slate-300">/</span>
                        <span className="text-slate-900 dark:text-white capitalize">{t('expense_categories')}</span>
                    </div>
                </div>

                <div className='flex flex-wrap gap-3'>

                    {/* Qidirish maydoni */}
                    <div className="relative w-full md:w-auto min-w-[200px]">
                        <input
                            type="text"
                            placeholder={t('search')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full py-2.5 px-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-white focus:border-blue-500"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>

                    {/* Yangi qo'shish tugmasi */}
                    <button
                        onClick={() => handleOpenModal(null)}
                        className='flex items-center gap-2 py-2.5 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors whitespace-nowrap'
                    >
                        <Plus className='w-5 h-5' />
                    </button>
                </div>
            </div>

            {/* Asosiy Jadval */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-x-auto relative">

                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className='bg-gray-50 dark:bg-gray-900/50'>
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase w-12">#</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase min-w-[250px]">{t('name')}</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase min-w-[100px]">{t('status')}</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase w-20">{t('actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700 whitespace-nowrap">
                        {filteredCategories.length > 0 ? (
                            filteredCategories.map((cat, index) => (
                                <tr key={cat.id} className='hover:bg-gray-50 dark:hover:bg-gray-700/50'>
                                    <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">{index + 1}</td>
                                    <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">{cat.name}</td>
                                    <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${cat.status === 'Faol' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                            }`}>{cat.status}</span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200 flex gap-2">
                                        <button onClick={() => handleOpenModal(cat)} className='p-1 rounded-full text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30'>
                                            <Edit className='w-4 h-4' />
                                        </button>
                                        <button onClick={() => handleDelete(cat.id, cat.name)} className='p-1 rounded-full text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30'>
                                            <Trash2 className='w-4 h-4' />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className='p-0'>
                                    <NoDataView t={t} />
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Oyna */}
            <AddEditCategoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                editingCategory={editingCategory}
            />
        </div>
    );
};

export default DailyExpenseCategoriesContent;
