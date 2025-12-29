// src/components/PatientDetailView.jsx
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, User, Briefcase, Zap, Image, Clock, Phone, MapPin, MoreVertical, Edit2, ChevronRight, ChevronLeft } from 'lucide-react';

// Bemor ma'lumotlari uchun dummy data
const getPatientDetails = (id) => {
    // ID bo'yicha ma'lumot olishni simulyatsiya qilish
    return {
        id: id,
        name: "Abdurahmon",
        surname: "Safarov",
        birthDate: "03.12.1999",
        gender: "Male",
        registered: "26.09.2025",
        phone: "998971234567",
        address: "Surxondaryo viloyati, Termiz sh. Obi-hayot mahallasi 11-uy",
        oldAddress: "Surxondaryo viloyati, Termiz sh. Obi-hayot mahallasi 11-uy",
        illnesses: "-",
        polyclinic: "Test (Sales)",

        // Davolashlar Ro'yxati (1-rasmdagi jadval)
        treatments: [
            { id: 1, doctor: "Sunnatillo Istamov", date: "04.12.2025 16:00", status: "Yangi", payment: "To'lanmadi" },
            { id: 2, doctor: "Mateo Versace", date: "04.11.2025 00:00", status: "Yangi", payment: "To'lanmadi" },
            { id: 3, doctor: "Mateo Versace", date: "02.11.2025 00:00", status: "Yangi", payment: "To'lanmadi" },
            { id: 4, doctor: "Mateo Versace", date: "25.10.2025 00:00", status: "Yangi", payment: "To'lanmadi" },
            { id: 5, doctor: "Mateo Versace", date: "21.10.2025 00:00", status: "Yangi", payment: "To'lanmadi" },
            { id: 6, doctor: "Mateo Versace", date: "20.10.2025 00:00", status: "Yangi", payment: "To'lanmadi" },
            { id: 7, doctor: "Junior Mateo", date: "20.10.2025 00:00", status: "Yangi", payment: "To'lanmadi" },
        ],
        // To'lovlar ro'yxati (Bu yerda bo'sh, lekin structure qo'shilgan)
        payments: []
    };
};

const PatientDetailView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const patient = getPatientDetails(id);

    const [activeTab, setActiveTab] = useState('davolashlar');

    // Status uchun rang berish
    const getStatusClasses = (status) => {
        return status === "Yangi" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    };

    // To'lov holati uchun rang berish
    const getPaymentClasses = (payment) => {
        return payment === "To'lanmadi" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 font-semibold" : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    };

    if (!patient) return <div className="p-8">Bemor topilmadi.</div>;

    // Asosiy kontent render qilish
    const renderContent = () => {
        if (activeTab === 'davolashlar') {
            return (
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-blue-100 dark:border-blue-900/10 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-blue-900/10">
                        <thead className="bg-blue-50/50 dark:bg-blue-900/20">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-widest w-12">#</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-widest min-w-[150px]">Ism</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-widest min-w-[150px]">Shifokor</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-widest min-w-[120px]">Davolash sanasi</th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-widest min-w-20">Holati</th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-widest min-w-[100px]">To'lov miqdori</th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-widest min-w-[120px]">To'lov holati</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-widest w-20">Harakatlar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-blue-900/10 whitespace-nowrap">
                            {patient.treatments.map((t) => (
                                <tr key={t.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">{t.id}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">{patient.name} {patient.surname}</td>
                                    <td className="px-6 py-4 text-sm font-semibold text-blue-600 dark:text-blue-400">{t.doctor}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 font-medium">{t.date}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-4 py-1 text-[10px] uppercase tracking-widest font-black rounded-lg ${getStatusClasses(t.status)}`}>
                                            {t.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-center font-black text-gray-400">—</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-4 py-1 text-[10px] uppercase tracking-widest font-black rounded-lg ${getPaymentClasses(t.payment)}`}>
                                            {t.payment}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 bg-transparent hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all active:scale-90">
                                            <MoreVertical className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        }
        // To'lovlar ro'yxati kontenti (5-rasmdagi To'lovlar ro'yxati qismi)
        if (activeTab === 'payments') {
            return (
                <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-x-auto p-4">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">To'lovlar ro'yxati</h3>
                    <div className='flex justify-end text-sm text-gray-500'>
                        {/* Pagination simulyatsiyasi */}
                        <div className='flex items-center gap-2'>
                            <span>1</span>
                            <button className='p-1 rounded-full bg-blue-500 text-white'><ChevronLeft className='w-4 h-4' /></button>
                            <button className='p-1 rounded-full bg-blue-500 text-white'><ChevronRight className='w-4 h-4' /></button>
                        </div>
                    </div>
                    {/* Bo'sh jadval simulyatsiyasi */}
                    <div className="text-center py-10 text-gray-500">
                        Hozircha to'lov ma'lumotlari mavjud emas.
                    </div>
                </div>
            );
        }

        return null;
    };


    return (
        <div className="p-4 md:p-8 space-y-6">

            {/* Breadcrumbs va Header */}
            <div className="text-sm text-gray-500">
                <Link to="/" className="text-gray-700 font-medium hover:text-blue-500">Bosh sahifa</Link> /
                <Link to="/klinika/bemorlar" className="text-gray-700 font-medium hover:text-blue-500"> Bemorlar</Link> /
                <span className="text-blue-600 font-medium"> Bemor haqida</span>
            </div>

            <div className="flex items-center gap-4 border-b pb-4">
                <button onClick={() => navigate('/klinika/bemorlar')} className="flex items-center text-blue-600 font-medium hover:text-blue-700 transition">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Orqaga qaytish
                </button>
                <h1 className="text-xl font-semibold text-gray-800">{patient.name} {patient.surname}</h1>
            </div>


            {/* Kontent Qismlari */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>

                {/* Chap qism: Tabs va Tish/Xizmatlar (6, 7-rasmlar) */}
                <div className='lg:col-span-2 space-y-6'>

                    {/* Tabs */}
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setActiveTab('davolashlar')}
                            className={`flex-1 py-2 text-sm font-medium rounded-lg transition ${activeTab === 'davolashlar' ? 'bg-white shadow text-blue-600' : 'text-gray-700 hover:bg-gray-200'}`}
                        >
                            Davolashlar ro'yxati
                        </button>
                        <button
                            onClick={() => setActiveTab('payments')}
                            className={`flex-1 py-2 text-sm font-medium rounded-lg transition ${activeTab === 'payments' ? 'bg-white shadow text-blue-600' : 'text-gray-700 hover:bg-gray-200'}`}
                        >
                            To'lovlar ro'yxati
                        </button>
                    </div>

                    {/* Davolashlar/To'lovlar Ro'yxati Kontenti */}
                    {renderContent()}

                    {/* Tish/Xizmatlar Qismi (6, 7-rasmlar) */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 space-y-4">
                        <div className="flex gap-2">
                            <button className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg">Kattalar</button>
                            <button className="px-4 py-2 text-gray-700 font-semibold rounded-lg bg-gray-100">Bolalar</button>
                        </div>

                        <div className='flex items-center justify-between'>
                            <h3 className="text-lg font-semibold text-gray-800">Tishlarni tanlang:</h3>
                            <button className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">Barchasini tanlash</button>
                        </div>

                        {/* Tish kartasi simulyatsiyasi  */}
                        <div className='overflow-x-auto py-4 border-b border-gray-100'>
                            <div className='min-w-[700px]'>
                                <p className='text-center text-sm text-gray-500'>Tish kartasi (Simulyatsiya)</p>
                                <div className='grid grid-cols-2 text-xs font-semibold text-gray-600'>
                                    {/* Yuqori qator raqamlari */}
                                    <div className='flex justify-between px-2'>
                                        {[18, 17, 16, 15, 14, 13, 12, 11].map(n => <span key={n}>{n}</span>)}
                                    </div>
                                    <div className='flex justify-between px-2'>
                                        {[21, 22, 23, 24, 25, 26, 27, 28].map(n => <span key={n}>{n}</span>)}
                                    </div>
                                </div>

                                {/* Tishlar rasmi joyi (Simulyatsiya) */}
                                <div className='h-20 flex items-center justify-center bg-gray-50 rounded-lg my-2 border border-gray-200'>
                                    <span className='text-gray-400 text-sm'>Tishlar joyi</span>
                                </div>

                                {/* Pastki qator raqamlari */}
                                <div className='grid grid-cols-2 text-xs font-semibold text-gray-600'>
                                    <div className='flex justify-between px-2'>
                                        {[48, 47, 46, 45, 44, 43, 42, 41].map(n => <span key={n}>{n}</span>)}
                                    </div>
                                    <div className='flex justify-between px-2'>
                                        {[31, 32, 33, 34, 35, 36, 37, 38].map(n => <span key={n}>{n}</span>)}
                                    </div>
                                </div>
                            </div>
                        </div>


                        {/* Xizmatlar jadvali (7-rasmdagi pastki qism) */}
                        <h3 className="text-lg font-semibold text-gray-800 pt-4">Xizmatlarni tanlang:</h3>
                        <div className="text-center py-10 text-gray-500 border border-gray-200 rounded-lg">
                            <Zap className='w-8 h-8 text-gray-300 mx-auto mb-2' />
                            <span className='text-sm'>Hozircha ma'lumot mavjud emas</span>
                        </div>

                        <div className='flex justify-between items-center border-t pt-4'>
                            <span className="text-xl font-bold text-gray-700">0 so'm</span>
                            <button className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition">Saqlash</button>
                        </div>

                    </div>
                </div>

                {/* O'ng qism: Bemor haqida ma'lumotlar (5-rasm) */}
                <div className='lg:col-span-1 space-y-6'>

                    {/* Chapdagi Kichik Tabs */}
                    <div className="space-y-2">
                        <button className='flex items-center gap-3 p-3 bg-blue-100 text-blue-700 font-medium rounded-lg w-full text-left'><Zap className='w-5 h-5' /> Xizmat qo'shish</button>
                        <button className='flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg w-full text-left'><Briefcase className='w-5 h-5' /> Mahsulot qo'shish</button>
                        <button className='flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg w-full text-left'><User className='w-5 h-5' /> Qabulxonaga yozgan ma'lumotlar</button>
                        <button className='flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg w-full text-left'><Edit2 className='w-5 h-5' /> Texnik va shifokor yozgan ma'lumotlar</button>
                        <button className='flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg w-full text-left'><Image className='w-5 h-5' /> Rasmlar</button>
                        <button className='flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg w-full text-left'><Clock className='w-5 h-5' /> Davolanishlar tarixi</button>
                    </div>

                    {/* Bemor haqida (Kontakt va Shaxsiy ma'lumotlar) */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 space-y-6">
                        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Bemor haqida</h3>

                        {/* Shaxsiy ma'lumotlar qismi */}
                        <div className="space-y-3">
                            <h4 className="text-md font-semibold text-gray-700">Shaxsiy ma'lumotlar</h4>
                            <DataRow title="ID" value={patient.id} />
                            <DataRow title="Ism" value={patient.name} />
                            <DataRow title="Familiya" value={patient.surname} />
                            <DataRow title="Tug'ilgan sana" value={patient.birthDate} />
                            <DataRow title="Jinsi" value={patient.gender} />
                        </div>

                        {/* Kontakt ma'lumotlari qismi */}
                        <div className="space-y-3 pt-4 border-t">
                            <h4 className="text-md font-semibold text-gray-700">Kontakt ma'lumotlar</h4>
                            <DataRow icon={<MapPin className='w-4 h-4 text-gray-500' />} title="Manzili" value={patient.address} isBlock={true} />
                            <DataRow icon={<Phone className='w-4 h-4 text-gray-500' />} title="Telefon raqami" value={patient.phone} />
                            <DataRow title="Yashash manzili" value={patient.oldAddress} isBlock={true} />
                        </div>

                        {/* Shaxsiy ma'lumotlar (qo'shimcha) qismi */}
                        <div className="space-y-3 pt-4 border-t">
                            <h4 className="text-md font-semibold text-gray-700">Shaxsiy ma'lumotlar</h4>
                            <DataRow title="Yo'ldosh Kasalliklar" value={patient.illnesses} />
                            <DataRow title="Poliklinika nomi" value={patient.polyclinic} />
                            <DataRow title="Ro'yxatga olingan vaqti" value={patient.registered} />
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

// Yordamchi komponent
const DataRow = ({ title, value, icon, isBlock = false }) => (
    <div className={`py-1 ${isBlock ? 'block' : 'flex justify-between'}`}>
        <div className='flex items-center gap-1.5'>
            {icon}
            <span className="text-sm font-medium text-gray-500">{title}</span>
        </div>
        <span className={`text-sm font-semibold text-gray-800 ${isBlock ? 'mt-1 block text-left' : 'text-right'}`}>{value}</span>
    </div>
);
// PatientDetailView.jsx fayli tugadi
export default PatientDetailView
