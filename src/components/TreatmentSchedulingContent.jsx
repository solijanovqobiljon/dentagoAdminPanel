import React, { useState } from 'react';
import { Search, ChevronDown, Calendar, MoreVertical, Edit2, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataProvider';

const TreatmentSchedulingContent = () => {
    const { data, t } = useData();
    const treatments = data.treatments || [];

    const [openDropdownId, setOpenDropdownId] = useState(null);
    const [isStartDatePickerOpen, setIsStartDatePickerOpen] = useState(false);
    const [isEndDatePickerOpen, setIsEndDatePickerOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const handleDropdownToggle = (id) => {
        setOpenDropdownId(openDropdownId === id ? null : id);
    };

    const getStatusClasses = (status) => {
        return status === "Yangi"
            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
            : status === "Shifokor yakunlandi"
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    };

    const filteredTreatments = treatments.filter(t =>
        t.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.doctor.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const renderDatePicker = ({ isOpen, setIsOpen }) => {
        if (!isOpen) return null;

        return (
            <div className="absolute z-10 mt-2 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 border border-gray-200 dark:border-gray-600 w-64">
                <div className="flex justify-between items-center mb-3">
                    <button onClick={() => { }} className='p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700'><ChevronLeft className='w-4 h-4 text-gray-700 dark:text-gray-300' /></button>
                    <span className="font-semibold text-gray-700 dark:text-gray-200">Dec 2025</span>
                    <button onClick={() => { }} className='p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700'><ChevronRight className='w-4 h-4 text-gray-700 dark:text-gray-300' /></button>
                </div>
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
                <div className='flex justify-between mt-4 border-t border-gray-200 dark:border-gray-600 pt-3'>
                    <button onClick={() => setIsOpen(false)} className='text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'>{t('cancel')}</button>
                    <button onClick={() => setIsOpen(false)} className='text-sm text-blue-600 font-medium px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/30'>Select</button>
                </div>
            </div>
        )
    }


    return (
        <div className="p-4 md:p-8 space-y-6">

            {/* Breadcrumbs va Filter Bloki */}
            <div className="space-y-4">

                {/* 1-qator: Breadcrumbs, Qidiruv, Filter tugmasi */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                            <Link to="/" className="hover:text-blue-600 transition-colors capitalize">{t('dashboard')}</Link>
                            <span className="text-slate-300">/</span>
                            <span className="text-slate-900 dark:text-white capitalize">{t('treatments')}</span>
                        </div>
                    </div>

                    <div className="flex gap-3 w-full sm:w-auto">

                        {/* Qidiruv maydoni */}
                        <div className="relative grow max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder={t('search')}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full py-2 pl-10 pr-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        {/* Filter tugmasi */}
                        <button className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition w-12 h-auto">
                            <ChevronDown className='w-5 h-5 transform rotate-180' />
                        </button>
                    </div>
                </div>

                {/* 2-qator: Sana tanlash maydonlari */}
                <div className='flex gap-4 items-center'>

                    {/* Boshlanish sanasi (DatePicker) */}
                    <div className="relative">
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Boshlanish sanasi</label>
                        <input
                            type="text"
                            placeholder="Sanani tanlang"
                            readOnly
                            defaultValue="13.12.2025"
                            onClick={() => setIsStartDatePickerOpen(!isStartDatePickerOpen)}
                            className="w-full py-2 px-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-white cursor-pointer"
                        />
                        <Calendar className="absolute right-3 top-1/2 mt-3 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        {renderDatePicker({ isOpen: isStartDatePickerOpen, setIsOpen: setIsStartDatePickerOpen })}
                    </div>

                    {/* Tugash sanasi (DatePicker) */}
                    <div className="relative">
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Tugash sanasi</label>
                        <input
                            type="text"
                            placeholder="Sanani tanlang"
                            readOnly
                            onClick={() => setIsEndDatePickerOpen(!isEndDatePickerOpen)}
                            className="w-full py-2 px-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-white cursor-pointer"
                        />
                        <Calendar className="absolute right-3 top-1/2 mt-3 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        {renderDatePicker({ isOpen: isEndDatePickerOpen, setIsOpen: setIsEndDatePickerOpen })}
                    </div>
                </div>
            </div>

            {/* Asosiy Jadval (Davolashni Rejalashtirish Ro'yxati) */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">

                    {/* Jadval Boshi (Header) */}
                    <thead className='whitespace-nowrap bg-gray-50 dark:bg-gray-900/50'>
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase w-12">#</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase min-w-[150px]">{t('patient')}</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase min-w-[120px]">{t('phone')}</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase min-w-[150px]">{t('doctor')}</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase min-w-[120px]">{t('date')}</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase min-w-[120px]">{t('status')}</th>
                            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase w-20">{t('actions')}</th>
                        </tr>
                    </thead>

                    {/* Jadval Tana qismi (Body) */}
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700 whitespace-nowrap">
                        {filteredTreatments.length > 0 ? (
                            filteredTreatments.map((item, index) => (
                                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{index + 1}</td>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{item.patientName}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{item.phone}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{item.doctor}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{item.date}</td>

                                    {/* Holati ustuni */}
                                    <td className="px-4 py-3 text-center">
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusClasses(item.status)}`}>
                                            {item.status}
                                        </span>
                                    </td>

                                    {/* Harakatlar (3 nuqta) */}
                                    <td className="px-4 py-3 text-right relative">
                                        <button
                                            onClick={() => handleDropdownToggle(item.id)}
                                            className="p-2 text-gray-500 dark:text-gray-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                                        >
                                            <MoreVertical className="w-5 h-5" />
                                        </button>

                                        {/* --- Harakatlar Dropdown Kontenti (3-rasm) --- */}
                                        {openDropdownId === item.id && (
                                            <>
                                                <div className="fixed inset-0 z-10" onClick={() => setOpenDropdownId(null)}></div>
                                                <div className="absolute right-12 top-1/2 transform -translate-y-1/2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-xl overflow-hidden z-20">
                                                    <ul className="py-1">
                                                        <li className='px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-2'>
                                                            <Edit2 className='w-4 h-4 text-blue-500' /> {t('edit')}
                                                        </li>
                                                        <li className='px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-2'>
                                                            <Eye className='w-4 h-4 text-green-500' /> {t('view')}
                                                        </li>
                                                    </ul>
                                                </div>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="7" className="p-8 text-center text-gray-500 dark:text-gray-400">{t('treatments')} topilmadi.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pastki qismda bo'lishi mumkin bo'lgan Pagination (qo'shilmagan, lekin joy qoldirilgan) */}
            <div className='flex justify-end pt-4'>
                <p className='text-sm text-gray-500 dark:text-gray-400'>{t('treatments')} ro'yxati</p>
            </div>

        </div>
    );
};
export default TreatmentSchedulingContent;
