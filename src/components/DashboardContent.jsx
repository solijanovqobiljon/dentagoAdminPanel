import React, { useState, useRef } from 'react';
// icons
import { User, Stethoscope, Clock, TrendingUp, DollarSign, Calendar, Users, Briefcase, Minus, X, ChevronRight } from 'lucide-react';
import { FaCalendarAlt, FaUserClock } from 'react-icons/fa';
import { RiWallet3Line } from "react-icons/ri";
import { CiGlobe } from "react-icons/ci";
import { FaUserDoctor } from "react-icons/fa6";
import { MdMedicalServices } from "react-icons/md";
import { useData } from '../context/DataProvider';
import { Link } from 'react-router-dom';

// Recharts - diagramma uchun
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const DashboardContent = () => {
    const { data, t } = useData();
    const dateInputRef = useRef(null);
    const [selectedDate, setSelectedDate] = useState('2025-01-12');

    // Helper functions
    const parseCurrency = (str) => {
        if (!str) return 0;
        // Agar str raqam bo'lsa to'g'ridan to'g'ri qaytaradi
        if (typeof str === 'number') return str;
        return parseInt(str.toString().replace(/\s/g, '').replace("so'm", '')) || 0;
    };

    const formatCurrency = (num) => {
        return num.toLocaleString() + " so'm";
    };

    // 1. Data Processing
    const services = data.services || [];
    const payments = data.payments || [];
    const patients = data.patients || [];
    const staff = data.staff || [];

    const servicesCount = services.length;
    const patientsCount = patients.length;
    const staffCount = staff.length;
    const debtorsCount = patients.filter(p => parseCurrency(p.debt) < 0).length;

    // To'lovlar va qarzlarni hisoblash
    const totalPayments = payments.reduce((sum, p) => sum + parseCurrency(p.amount), 0);
    const totalDebt = patients.reduce((sum, p) => {
        const debt = parseCurrency(p.debt);
        return debt < 0 ? sum + Math.abs(debt) : sum;
    }, 0);

    // 2. Chart Data (Payments by Type)
    const chartData = [
        { name: t('cash') || 'Naqd', value: payments.filter(p => p.type === 'Naqd').reduce((s, p) => s + parseCurrency(p.amount), 0) },
        { name: t('card') || 'Karta', value: payments.filter(p => p.type === 'Karta').reduce((s, p) => s + parseCurrency(p.amount), 0) },
        { name: t('bank_transfer') || 'Hisob raqam', value: payments.filter(p => p.type === 'Hisob raqam' || p.type === 'Bank').reduce((s, p) => s + parseCurrency(p.amount), 0) },
        { name: 'K-to-K', value: payments.filter(p => p.type === 'Kartadan-kartaga').reduce((s, p) => s + parseCurrency(p.amount), 0) },
    ];

    // Yuqoridagi 4 ta kichik kartochkalar uchun
    const topStats = [
        { title: t('services_count') || "Xizmatlar", value: servicesCount, icon: MdMedicalServices, link: "/klinika/xizmatlar-card" },
        { title: t('patients_count') || "Bemorlar", value: patientsCount, icon: FaUserDoctor, link: "/klinika/bemorlar" },
        { title: t('staff_count') || "Xodimlar", value: staffCount, icon: Users, link: "/klinika/xodimlar" },
        { title: t('debtors_count') || "Qarzdorlar", value: debtorsCount, icon: FaUserClock, link: "/klinika/qarzdor-davolashlar" },
    ];

    // Pastki qismdagi (xato berayotgan) statistikalar uchun massiv
    const bottomStats = [
        { title: t('total_payments') || "Jami To'lovlar", value: formatCurrency(totalPayments), icon: RiWallet3Line },
        { title: t('total_debt') || "Umumiy Qarz", value: formatCurrency(totalDebt), icon: DollarSign },
        { title: t('new_patients') || "Ro'yxatdan o'tganlar", value: patientsCount, icon: User },
    ];

    return (
        <div className="p-4 md:p-8 space-y-6">
            {/* Top Cards Section */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {topStats.map((stat, index) => (
                    <Link to={stat.link} key={index} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-blue-50 dark:border-blue-900/20 shadow-xl shadow-blue-500/5 flex justify-between items-center transition-all hover:translate-y-[-4px]">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-blue-600">
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{stat.title}</p>
                            </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300" />
                    </Link>
                ))}
            </section>

            {/* Chart & Top Services */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* PAYMENTS CHART */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-blue-50 dark:border-blue-900/10 shadow-xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white capitalize">{t('payments')}</h3>
                            <p className="text-xs text-slate-400 font-medium">To'lov turlari bo'yicha tahlil</p>
                        </div>

                        {/* Interactive Calendar */}
                        <div className="relative">
                            <button
                                onClick={() => dateInputRef.current?.showPicker()}
                                className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-xs font-bold text-blue-600 hover:bg-blue-100 transition-all"
                            >
                                <Calendar className="w-4 h-4" />
                                <span>{selectedDate}</span>
                            </button>
                            <input
                                type="date"
                                ref={dateInputRef}
                                className="absolute opacity-0 pointer-events-none"
                                onChange={(e) => setSelectedDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value) => formatCurrency(value)}
                                />
                                <Area type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* TOP SERVICES */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-blue-50 dark:border-blue-900/10 shadow-xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('top_services') || "To'p Xizmatlar"}</h3>
                        <Link to="/klinika/xizmatlar-card" className="text-xs font-bold text-blue-600 hover:underline">Barchasi</Link>
                    </div>

                    <div className="space-y-4">
                        {services.slice(0, 5).map((service, index) => (
                            <div key={service.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 font-bold text-sm">
                                        {index + 1}
                                    </div>
                                    <div className="max-w-[120px]">
                                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{service.name}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">{service.status}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-blue-600">{service.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Summary Stats (Xatolik bartaraf etilgan joy) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {bottomStats.map((stat, index) => (
                    <div
                        key={index}
                        className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-blue-50 dark:border-blue-900/10 shadow-xl shadow-blue-500/5 flex items-center justify-between group hover:border-blue-200 transition-all"
                    >
                        <div className="text-left">
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{stat.title}</p>
                            <p className="text-2xl font-black text-blue-600 dark:text-blue-500 tracking-tighter">{stat.value}</p>
                        </div>
                        <div className="p-5 bg-blue-50 dark:bg-blue-950/40 rounded-3xl text-blue-600 group-hover:scale-110 transition-transform">
                            <stat.icon className="w-8 h-8" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DashboardContent;
