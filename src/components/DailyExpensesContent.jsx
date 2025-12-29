import React, { useState } from 'react';
import { Plus, Calendar, X, Search, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataProvider';
import Modal from './common/Modal';

const DailyExpensesContent = () => {
    const { data, updateData, t } = useData();
    const categories = data.expenseCategories || [];
    const expensesList = data.dailyExpenses || [];

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        date: new Date().toLocaleDateString('uz-UZ'),
        category: '',
        paymentType: 'Naqd',
    });

    const handleOpenModal = (expense = null) => {
        if (expense) {
            setEditingExpense(expense);
            setFormData({ ...expense });
        } else {
            setEditingExpense(null);
            setFormData({
                name: '',
                price: '',
                description: '',
                date: new Date().toLocaleDateString('uz-UZ'),
                category: '',
                paymentType: 'Naqd',
            });
        }
        setIsModalOpen(true);
    };

    const handleDelete = (id, name) => {
        if (window.confirm(`${name}: ${t('confirm_delete')}`)) {
            updateData('dailyExpenses', { id }, 'DELETE');
        }
    };

    const handleSave = () => {
        if (!formData.name || !formData.price || !formData.category) {
            alert(t('fill_required'));
            return;
        }

        const dataToSend = { ...formData };

        if (editingExpense) {
            updateData('dailyExpenses', dataToSend, 'UPDATE');
        } else {
            updateData('dailyExpenses', dataToSend, 'ADD');
        }
        setIsModalOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const totalSum = expensesList.reduce((sum, item) => sum + (parseInt(item.price.replace(/\s/g, '')) || 0), 0);
    const formattedTotalSum = totalSum.toLocaleString('uz-UZ') + " so'm";

    return (
        <div className="p-4 md:p-8 space-y-6">

            {/* Breadcrumbs va Filterlar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                        <Link to="/" className="hover:text-blue-600 transition-colors capitalize">{t('dashboard')}</Link>
                        <span className="text-slate-300">/</span>
                        <span className="text-slate-900 dark:text-white capitalize">{t('expenses')}</span>
                    </div>
                </div>

                <div className='flex flex-wrap gap-3'>
                    {/* Yangi qo'shish tugmasi */}
                    <button
                        onClick={() => handleOpenModal(null)}
                        className='flex items-center gap-2 py-2.5 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors whitespace-nowrap'
                    >
                        <Plus className='w-5 h-5' /> {t('add')}
                    </button>
                </div>
            </div>

            {/* Asosiy Jadval */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-x-auto relative pb-16">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className='bg-gray-50 dark:bg-gray-900/50'>
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase w-12">#</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase min-w-[150px]">{t('expense_name')}</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase min-w-[100px]">{t('price')}</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase min-w-[120px]">{t('date')}</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase min-w-[150px]">{t('category')}</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase min-w-[120px]">{t('payment_type')}</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase w-20">{t('actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700 whitespace-nowrap">
                        {expensesList.length > 0 ? (
                            expensesList.map((exp, index) => (
                                <tr key={exp.id} className='hover:bg-gray-50 dark:hover:bg-gray-700/50 transition'>
                                    <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">{index + 1}</td>
                                    <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">{exp.name}</td>
                                    <td className="px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400">{exp.price}</td>
                                    <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">{exp.date}</td>
                                    <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">{exp.category}</td>
                                    <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">{exp.paymentType}</td>
                                    <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200 flex gap-2">
                                        <button onClick={() => handleOpenModal(exp)} className='p-1 rounded-full text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30' title={t('edit')}>
                                            <Edit className='w-4 h-4' />
                                        </button>
                                        <button onClick={() => handleDelete(exp.id, exp.name)} className='p-1 rounded-full text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30' title={t('delete')}>
                                            <Trash2 className='w-4 h-4' />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="7" className='p-10 text-center text-gray-500 dark:text-gray-400'>Xarajatlar topilmadi.</td></tr>
                        )}
                    </tbody>
                </table>

                {/* Umumiy Summa */}
                <div className='absolute bottom-0 right-0 p-3 bg-white dark:bg-gray-800 border-t border-l border-gray-100 dark:border-gray-700 rounded-tl-lg shadow-md'>
                    <span className='text-md font-bold text-gray-800 dark:text-white whitespace-nowrap'>{t('amount')}: <span className='text-red-600 dark:text-red-400'>{formattedTotalSum}</span></span>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingExpense ? t('edit') : t('add')}
                footer={
                    <button onClick={handleSave} className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
                        {editingExpense ? t('save') : `+ ${t('add')}`}
                    </button>
                }
            >
                <div className="space-y-4">
                    <input name="name" value={formData.name} onChange={handleChange} placeholder={`${t('expense_name')}*`} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500" />
                    <input name="price" value={formData.price} onChange={handleChange} placeholder={`${t('price')}*`} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500" />
                    <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Izoh" className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-h-[100px] focus:outline-none focus:border-blue-500"></textarea>

                    {/* Sana */}
                    <input name="date" type="text" value={formData.date} onChange={handleChange} placeholder={`${t('date')} (DD.MM.YYYY)`} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500" />

                    {/* Kategoriya */}
                    <select name="category" value={formData.category} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500">
                        <option value="">{t('category')}*</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                    </select>

                    {/* To'lov turi */}
                    <select name="paymentType" value={formData.paymentType} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500">
                        <option value="Naqd">{t('cash')}</option>
                        <option value="Karta">{t('card')}</option>
                        <option value="Hisob raqam">{t('bank_transfer')}</option>
                    </select>
                </div>
            </Modal>
        </div>
    );
};
export default DailyExpensesContent;
