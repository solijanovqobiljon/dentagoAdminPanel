import React, { useState } from 'react';
import { Plus, Search, Trash2, Calendar, User, Package, ClipboardList } from 'lucide-react';
import { useData } from '../../context/DataProvider';
import Modal from '../common/Modal';
import { Link } from 'react-router-dom';

const ProductUsageContent = () => {
    const { data, updateData, t } = useData();
    const productUsage = data.productUsage || [];
    const staff = data.staff || [];
    const patients = data.patients || [];
    const products = data.products || [];

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        doctorName: '',
        patientName: '',
        productName: '',
        quantity: '',
        date: new Date().toISOString().split('T')[0]
    });

    const filteredUsage = productUsage.filter(item =>
        item.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddUsage = () => {
        if (!formData.doctorName || !formData.patientName || !formData.productName || !formData.quantity) {
            alert(t('fill_required'));
            return;
        }

        const newUsage = {
            id: Date.now(),
            doctorName: formData.doctorName,
            patientName: formData.patientName,
            productName: formData.productName,
            quantity: formData.quantity,
            date: formData.date
        };

        updateData('productUsage', newUsage, 'ADD');
        setIsModalOpen(false);
        setFormData({
            doctorName: '',
            patientName: '',
            productName: '',
            quantity: '',
            date: new Date().toISOString().split('T')[0]
        });
    };

    const handleDeleteUsage = (id) => {
        if (window.confirm(t('confirm_delete'))) {
            updateData('productUsage', { id }, 'DELETE');
        }
    };

    return (
        <div className="p-4 md:p-8 space-y-6 bg-white dark:bg-slate-950 min-h-full">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-blue-50 dark:border-blue-900/10 shadow-xl shadow-blue-500/5">
                <div>
                    {/* <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                        {t('product_usage_title')}
                    </h1> */}
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                        <Link to="/" className="hover:text-blue-600 transition-colors capitalize">{t('dashboard')}</Link>
                        <span className="text-slate-300">/</span>
                        <span className="text-slate-900 dark:text-white capitalize">{t('product_usage')}</span>
                    </div>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-lg shadow-blue-500/20 transition-all active:scale-95 uppercase tracking-widest text-xs"
                >
                    <Plus className="w-5 h-5" />
                    {t('add_usage')}
                </button>
            </div>

            {/* Search */}
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 transition-colors group-focus-within:text-blue-600" />
                <input
                    type="text"
                    placeholder={t('search')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-blue-50/30 dark:bg-slate-900 border border-blue-100 dark:border-blue-900/10 rounded-2xl text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                />
            </div>

            {/* Content Table */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-blue-50 dark:border-blue-900/10 shadow-xl shadow-blue-500/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-blue-50/50 dark:bg-blue-900/20">
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('doctor')}</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('patient')}</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('product')}</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('usage_quantity')}</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('usage_date')}</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-blue-50 dark:divide-blue-900/10">
                            {filteredUsage.length > 0 ? filteredUsage.map((item) => (
                                <tr key={item.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/5 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                                                <User className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <span className="text-sm font-black text-slate-900 dark:text-white">{item.doctorName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-bold text-slate-500 dark:text-slate-400">{item.patientName}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Package className="w-4 h-4 text-blue-400" />
                                            <span className="text-sm font-black text-blue-600 dark:text-blue-500">{item.productName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-black text-slate-600 dark:text-slate-300">
                                            {item.quantity}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-slate-500">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            {item.date}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDeleteUsage(item.id)}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-20 text-center">
                                        <ClipboardList className="w-16 h-16 text-slate-200 dark:text-slate-800 mx-auto mb-4" />
                                        <p className="text-slate-400 font-bold italic">{t('no_data')}</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={t('add_usage')}
                footer={
                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black rounded-2xl hover:bg-slate-200 transition-all uppercase tracking-widest text-xs"
                        >
                            {t('cancel')}
                        </button>
                        <button
                            onClick={handleAddUsage}
                            className="flex-1 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all uppercase tracking-widest text-xs"
                        >
                            {t('add')}
                        </button>
                    </div>
                }
            >
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{t('doctor')}</label>
                        <input
                            type="text"
                            value={formData.doctorName}
                            onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                            placeholder="Dr. Alisher Valiyev"
                            className="w-full px-5 py-4 bg-blue-50/30 dark:bg-slate-800 border border-blue-100 dark:border-blue-900/20 rounded-2xl text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-bold"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{t('patient')}</label>
                        <input
                            type="text"
                            value={formData.patientName}
                            onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                            placeholder="Bahodir Toshmatov"
                            className="w-full px-5 py-4 bg-blue-50/30 dark:bg-slate-800 border border-blue-100 dark:border-blue-900/20 rounded-2xl text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-bold"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{t('product')}</label>
                        <input
                            type="text"
                            value={formData.productName}
                            onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                            placeholder="Shpris (5ml)"
                            className="w-full px-5 py-4 bg-blue-50/30 dark:bg-slate-800 border border-blue-100 dark:border-blue-900/20 rounded-2xl text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-bold"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{t('usage_quantity')}</label>
                        <input
                            type="text"
                            value={formData.quantity}
                            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                            placeholder="Masalan: 2 dona, 1 juft"
                            className="w-full px-5 py-4 bg-blue-50/30 dark:bg-slate-800 border border-blue-100 dark:border-blue-900/20 rounded-2xl text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-bold"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{t('usage_date')}</label>
                        <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="w-full px-5 py-4 bg-blue-50/30 dark:bg-slate-800 border border-blue-100 dark:border-blue-900/20 rounded-2xl text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-bold"
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ProductUsageContent;
