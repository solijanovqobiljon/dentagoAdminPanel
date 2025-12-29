import React, { useState } from 'react';
import { Search, ChevronDown, Calendar, MoreVertical, Eye, DollarSign, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataProvider';

const debtTreatmentsData = [
    {
        id: 1,
        patient: "Jonibek Tursunov",
        phone: "998971923888",
        doctor: "Sunnatillo Istamov",
        schedule_date: "03.11.2025 00:00",
        treatment_status: "Shifokor yakunlandi",
        total_amount: "200 000 so'm",
        discount: "-",
        debt_amount: "- 200 000 so'm",
        payment_status: "To'lanmadi",
        technician: "Mateo Technician",
        doctor_share: "0 so'm",
        technician_share: "-",
    },
    {
        id: 2,
        patient: "Jonibek Tursunov",
        phone: "998971923888",
        doctor: "Mateo Versace",
        schedule_date: "28.10.2025 17:56",
        treatment_status: "Shifokor yakunlandi",
        total_amount: "50 000 so'm",
        discount: "-",
        debt_amount: "- 50 000 so'm",
        payment_status: "To'lanmadi",
        technician: "Mateo Technician",
        doctor_share: "0 so'm",
        technician_share: "-",
    },
];

const DebtTreatmentsContent = () => {
    const { t } = useData();
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    const [isStartDatePickerOpen, setIsStartDatePickerOpen] = useState(false);
    const [isEndDatePickerOpen, setIsEndDatePickerOpen] = useState(false);


    const handleDropdownToggle = (id) => {
        setOpenDropdownId(openDropdownId === id ? null : id);
    };

    const getDebtClasses = (debt) => {
        if (debt.startsWith('-')) return "bg-red-100 text-red-700 font-semibold";
        return "bg-green-100 text-green-700";
    };

    const getPaymentStatusClasses = (status) => {
        return status === "To'lanmadi"
            ? "bg-red-100 text-red-700 font-semibold"
            : "bg-green-100 text-green-700";
    };

    const getTreatmentStatusClasses = (status) => {
        return status === "Shifokor yakunlandi" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700";
    };

    const renderDatePicker = ({ isOpen, setIsOpen }) => {
        if (!isOpen) return null;

        return (
            <div className="absolute z-10 mt-2 right-0 bg-white rounded-lg shadow-xl p-4 border border-gray-200 w-64">
                <div className='text-center text-sm font-medium text-gray-700 py-1'>Dec 2025</div>
                <div className="grid grid-cols-7 gap-1 text-center text-sm">
                    {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(day => (
                        <div key={day} className="text-xs font-medium text-gray-500">{day}</div>
                    ))}
                    {[...Array(30).keys()].map(i => i + 1).map(day => (
                        <div key={day} className={`py-1 rounded-full cursor-pointer ${day === 13 ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}>
                            {day}
                        </div>
                    ))}
                </div>
                <div className='flex justify-between mt-4 border-t pt-3'>
                    <button onClick={() => setIsOpen(false)} className='text-sm text-gray-500 hover:text-gray-700'>Cancel</button>
                    <button onClick={() => setIsOpen(false)} className='text-sm text-blue-600 font-medium px-3 py-1 rounded-lg bg-blue-50'>Select</button>
                </div>
            </div>
        )
    }

    const renderPaymentModal = ({ isPaymentModalOpen, setIsPaymentModalOpen }) => {
        if (!isPaymentModalOpen) return null;

        return (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-[rgb(0,0,0,0.5)] bg-opacity-50 flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-md rounded-xl shadow-2xl">

                    <div className="flex justify-between items-center p-5 border-b border-gray-100">
                        <h2 className="text-xl font-semibold text-gray-800">To'lov qilish</h2>
                        <button onClick={() => setIsPaymentModalOpen(false)} className="text-gray-500 hover:text-gray-900 p-1">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="p-5 space-y-5">

                        <p className="text-base text-gray-700">Bemor: <span className="font-semibold text-gray-900">Jonibek Tursunov</span></p>

                        <p className="text-lg text-red-700 font-bold">Qarzdorlik: 250 000 so'm</p>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">To'lanayotgan miqdor</label>
                            <input
                                type="text"
                                placeholder="Masalan: 250 000"
                                className="w-full py-2.5 px-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">To'lov turi</label>
                            <div className="relative">
                                <select className="appearance-none block w-full bg-white border border-gray-300 text-gray-700 py-2.5 px-3 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-blue-500">
                                    <option>Naqd</option>
                                    <option>Plastik karta (UzCard/Humo)</option>
                                    <option>Pul o'tkazish</option>
                                </select>
                                <ChevronDown className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 w-5 h-5" />
                            </div>
                        </div>

                    </div>

                    <div className="p-5 border-t border-gray-100 flex justify-end">
                        <button
                            onClick={() => setIsPaymentModalOpen(false)}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
                        >
                            <DollarSign className='w-5 h-5' /> To'lovni amalga oshirish
                        </button>
                    </div>

                </div>
            </div>
        );
    };


    return (
        <div className="p-4 md:p-8 space-y-6">

            <div className="space-y-4">

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                            <Link to="/" className="hover:text-blue-600 transition-colors capitalize">{t('dashboard')}</Link>
                            <span className="text-slate-300">/</span>
                            <span className="text-slate-900 dark:text-white capitalize">{t('debt_treatments')}</span>
                        </div>
                    </div>

                    <div className="flex gap-3 w-full sm:w-auto">

                        <div className="relative grow max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Qidirish..."
                                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <button className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition w-12 h-auto">
                            <ChevronDown className='w-5 h-5 transform rotate-180' />
                        </button>
                    </div>
                </div>

                <div className='flex gap-4 items-center'>

                    <div className="relative">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Boshlanish sanasi</label>
                        <input
                            type="text"
                            placeholder="Sanani tanlang"
                            readOnly
                            onClick={() => setIsStartDatePickerOpen(!isStartDatePickerOpen)}
                            className="w-full py-2 px-3 pr-10 border border-gray-300 rounded-lg bg-white text-gray-700 cursor-pointer"
                        />
                        <Calendar className="absolute right-3 top-1/2 mt-3 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        {renderDatePicker({ isOpen: isStartDatePickerOpen, setIsOpen: setIsStartDatePickerOpen })}
                    </div>

                    <div className="relative">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Tugash sanasi</label>
                        <input
                            type="text"
                            placeholder="Sanani tanlang"
                            readOnly
                            onClick={() => setIsEndDatePickerOpen(!isEndDatePickerOpen)}
                            className="w-full py-2 px-3 pr-10 border border-gray-300 rounded-lg bg-white text-gray-700 cursor-pointer"
                        />
                        <Calendar className="absolute right-3 top-1/2 mt-3 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        {renderDatePicker({ isOpen: isEndDatePickerOpen, setIsOpen: setIsEndDatePickerOpen })}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">

                    <thead className='whitespace-nowrap'>
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase w-12">#</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase min-w-[150px]">Bemor</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase min-w-[120px]">Telefon raqam</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase min-w-[120px]">Shifokor</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase min-w-[120px]">Davolash sanasi</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase min-w-[150px]">Davolash holati</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase min-w-[120px]">To'lov miqdori</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase min-w-[120px]">Chegirma miqdori</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase min-w-[120px]">Qarzdorlik miqdori</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase min-w-[100px]">To'lov holati</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase min-w-[100px]">Texnik</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase min-w-[100px]">Doktor ulushi</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase min-w-[100px]">Texnik ulushi</th>
                            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase w-20">Harakatlar</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 whitespace-nowrap">
                        {debtTreatmentsData.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50 transition">
                                <td className="px-4 py-3 text-sm text-gray-500">{item.id}</td>
                                <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.patient}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">{item.phone}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">{item.doctor}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">{item.schedule_date}</td>

                                <td className="px-4 py-3 text-center">
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getTreatmentStatusClasses(item.treatment_status)}`}>
                                        {item.treatment_status}
                                    </span>
                                </td>

                                <td className="px-4 py-3 text-sm text-gray-700">{item.total_amount}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">{item.discount}</td>

                                <td className="px-4 py-3 text-center">
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getDebtClasses(item.debt_amount)}`}>
                                        {item.debt_amount}
                                    </span>
                                </td>

                                <td className="px-4 py-3 text-center">
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getPaymentStatusClasses(item.payment_status)}`}>
                                        {item.payment_status}
                                    </span>
                                </td>

                                <td className="px-4 py-3 text-sm text-gray-700">{item.technician}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">{item.doctor_share}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">{item.technician_share}</td>


                                <td className="px-4 py-3 text-right relative">
                                    <button
                                        onClick={() => handleDropdownToggle(item.id)}
                                        className="p-2 text-gray-500 rounded-full hover:bg-gray-200 transition"
                                    >
                                        <MoreVertical className="w-5 h-5" />
                                    </button>

                                    {openDropdownId === item.id && (
                                        <div className="absolute right-12 top-1/2 transform -translate-y-1/2 w-40 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-20">
                                            <ul className="py-1">
                                                <li
                                                    onClick={() => {
                                                        setIsPaymentModalOpen(true);
                                                        setOpenDropdownId(null);
                                                    }}
                                                    className='px-4 py-2 text-sm text-gray-700 hover:bg-green-50 cursor-pointer flex items-center gap-2'
                                                >
                                                    <DollarSign className='w-4 h-4 text-green-500' /> To'lov qilish
                                                </li>
                                                <li
                                                    onClick={() => setOpenDropdownId(null)}
                                                    className='px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer flex items-center gap-2'
                                                >
                                                    <Eye className='w-4 h-4 text-blue-500' /> Batafsil
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {renderPaymentModal({ isPaymentModalOpen, setIsPaymentModalOpen })}
        </div>
    );
};

export default DebtTreatmentsContent;
