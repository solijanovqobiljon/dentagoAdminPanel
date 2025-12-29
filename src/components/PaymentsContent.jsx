import React, { useState } from 'react';
import { Search, Calendar, ChevronDown, DollarSign, CreditCard, Smartphone, RefreshCw, ArrowLeft, ArrowRight, Plus } from 'lucide-react';
import { useData } from '../context/DataProvider';
import Modal from './common/Modal';
import { Link } from 'react-router-dom';

const PaymentsContent = () => {
    const { data, updateData, t } = useData(); // Added t
    const payments = data.payments || [];
    const patients = data.patients || [];

    const [isStartDatePickerOpen, setIsStartDatePickerOpen] = useState(false);
    const [isEndDatePickerOpen, setIsEndDatePickerOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        patientId: '',
        amount: '',
        type: 'Naqd',
        date: new Date().toLocaleDateString('ru-RU') // DD.MM.YYYY
    });

    // Calculate totals
    const calculateTotal = (type) => {
        return payments
            .filter(p => p.type === type)
            .reduce((sum, p) => {
                const amount = parseInt(p.amount.replace(/\s/g, '').replace("so'm", '')) || 0;
                return sum + amount;
            }, 0).toLocaleString() + " so'm";
    };

    const paymentCards = [
        { type: t('cash'), amount: calculateTotal("Naqd"), icon: <DollarSign className='w-6 h-6 text-yellow-600' />, bgColor: 'bg-yellow-100 dark:bg-yellow-900/30', iconColor: 'text-yellow-600' },
        { type: t('card'), amount: calculateTotal("Karta"), icon: <CreditCard className='w-6 h-6 text-purple-600' />, bgColor: 'bg-purple-100 dark:bg-purple-900/30', iconColor: 'text-purple-600' },
        { type: t('bank_transfer'), amount: calculateTotal("Hisob raqam"), icon: <Smartphone className='w-6 h-6 text-indigo-600' />, bgColor: 'bg-indigo-100 dark:bg-indigo-900/30', iconColor: 'text-indigo-600' },
        { type: "Kartadan-kartaga", amount: calculateTotal("Kartadan-kartaga"), icon: <RefreshCw className='w-6 h-6 text-green-600' />, bgColor: 'bg-green-100 dark:bg-green-900/30', iconColor: 'text-green-600' },
    ];

    const filteredPayments = payments.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSave = () => {
        if (!formData.patientId || !formData.amount) {
            alert(t('fill_required'));
            return;
        }

        const patient = patients.find(p => p.id == formData.patientId);
        const newPayment = {
            ...formData,
            name: patient ? `${patient.name} ${patient.familya}` : 'Noma\'lum',
            amount: `${formData.amount} so'm`
        };

        updateData('payments', newPayment, 'ADD');
        setIsModalOpen(false);
        setFormData({ patientId: '', amount: '', type: 'Naqd', date: new Date().toLocaleDateString('ru-RU') });
    };

    const renderDatePicker = ({ isOpen, setIsOpen }) => {
        if (!isOpen) return null;

        return (
            <div className="absolute z-10 mt-2 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 border border-gray-200 dark:border-gray-700 w-64">
                <div className='text-center text-sm font-medium text-gray-700 dark:text-gray-300 py-1'>Dec 2025</div>
                <div className="grid grid-cols-7 gap-1 text-center text-sm">
                    {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(day => (
                        <div key={day} className="text-xs font-medium text-gray-500 dark:text-gray-400">{day}</div>
                    ))}
                    {[...Array(30).keys()].map(i => i + 1).map(day => (
                        <div key={day} className={`py-1 rounded-full cursor-pointer text-gray-700 dark:text-gray-300 ${day === 13 ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                            {day}
                        </div>
                    ))}
                </div>
                <div className='flex justify-between mt-4 border-t border-gray-100 dark:border-gray-700 pt-3'>
                    <button onClick={() => setIsOpen(false)} className='text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'>{t('cancel')}</button>
                    <button onClick={() => setIsOpen(false)} className='text-sm text-blue-600 font-medium px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/30'>Tanlash</button>
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 md:p-8 space-y-6">

            <div className="space-y-4">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                            <Link to="/" className="hover:text-blue-600 transition-colors capitalize">{t('dashboard')}</Link>
                            <span className="text-slate-300">/</span>
                            <span className="text-slate-900 dark:text-white capitalize">{t('payments')}</span>
                        </div>
                    </div>

                    <div className='flex flex-wrap gap-4'>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Boshlanish sanasi"
                                readOnly
                                onClick={() => setIsStartDatePickerOpen(!isStartDatePickerOpen)}
                                className="w-full py-2.5 px-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 cursor-pointer focus:border-blue-500 focus:outline-none"
                            />
                            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                            {isStartDatePickerOpen && renderDatePicker({ isOpen: isStartDatePickerOpen, setIsOpen: setIsStartDatePickerOpen })}
                        </div>

                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Tugash sanasi"
                                readOnly
                                onClick={() => setIsEndDatePickerOpen(!isEndDatePickerOpen)}
                                className="w-full py-2.5 px-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 cursor-pointer focus:border-blue-500 focus:outline-none"
                            />
                            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                            {isEndDatePickerOpen && renderDatePicker({ isOpen: isEndDatePickerOpen, setIsOpen: setIsEndDatePickerOpen })}
                        </div>
                        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">
                            <Plus className="w-5 h-5" /> {t('add')}
                        </button>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4">

                    <div className="relative grow max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder={t('search')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full py-2.5 pl-10 pr-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                        />
                    </div>
                </div>
            </div>

            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                {paymentCards.map((card) => (
                    <div key={card.type} className={`p-4 rounded-xl shadow-md ${card.bgColor} flex items-center gap-4`}>
                        <div className={`p-3 rounded-full bg-white dark:bg-gray-800 bg-opacity-70 ${card.iconColor}`}>
                            {card.icon}
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{card.type}</p>
                            <p className="text-xl font-bold text-gray-800 dark:text-gray-200">{card.amount}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">

                    <thead className='bg-gray-50 dark:bg-gray-900/50'>
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase w-12">#</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase min-w-[150px]">{t('name')}</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase min-w-[120px]">{t('amount')}</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase min-w-[120px]">{t('date')}</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase min-w-[100px]">{t('payment_type')}</th>
                            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase w-20">{t('actions')}</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700 whitespace-nowrap">
                        {filteredPayments.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center py-10 text-gray-500 dark:text-gray-400">
                                    Hozircha ma'lumot mavjud emas
                                </td>
                            </tr>
                        ) : (
                            filteredPayments.map((p, index) => (
                                <tr key={p.id} className='hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors'>
                                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{index + 1}</td>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{p.name}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{p.amount}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{p.date}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{p.type}</td>
                                    <td className="px-4 py-3 text-right text-gray-500 dark:text-gray-400 text-sm">...</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={t('add') || "To'lov qabul qilish"}
                footer={
                    <button onClick={handleSave} className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
                        {t('save')}
                    </button>
                }
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bemor</label>
                        <select
                            value={formData.patientId}
                            onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                            className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                        >
                            <option value="">Bemor tanlang</option>
                            {patients.map(p => (
                                <option key={p.id} value={p.id}>{p.name} {p.familya}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Summa</label>
                        <input
                            type="number"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            placeholder="Summani kiriting"
                            className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('payment_type')}</label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                        >
                            <option value="Naqd">{t('cash')}</option>
                            <option value="Karta">{t('card')}</option>
                            <option value="Hisob raqam">{t('bank_transfer')}</option>
                            <option value="Kartadan-kartaga">Kartadan-kartaga</option>
                        </select>
                    </div>
                </div>
            </Modal>

        </div>
    );
};
export default PaymentsContent;
