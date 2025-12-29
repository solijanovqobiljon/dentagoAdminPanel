import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Home, Calendar, Users, Stethoscope, Briefcase, FileText, Send, Settings, BookOpen,
    Phone, ChevronRight, ChevronDown, ListOrdered, DollarSign, TrendingUp, LayoutList,
    Archive,
    User
} from 'lucide-react';
import { BsInstagram, BsTelegram } from 'react-icons/bs';
import { Result } from 'antd';
import { MdEmail } from 'react-icons/md';
import { useData } from '../../context/DataProvider';

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const location = useLocation();
    const { t } = useData();

    // Har bir guruh menyu uchun alohida ochilish holati (state)
    const [openMenus, setOpenMenus] = useState({
        klinika: false,
        ombor: false,
        hisobot: false,
        sms: false,
        settings: false,
    });

    // Menyu ochilish/yopilish funksiyasi
    const handleMenuToggle = (menuName) => {
        setOpenMenus(prev => ({
            ...prev,
            [menuName]: !prev[menuName],
        }));
    };

    // Sahifa o'zgarganda tegishli menyuni avtomatik ochish
    useEffect(() => {
        // Klinika bo'limi sahifalaridan biri bo'lsa
        if (location.pathname.startsWith('/klinika')) {
            setOpenMenus(prev => ({ ...prev, klinika: true }));
        }
        // Ombor bo'limi sahifalaridan biri bo'lsa
        if (location.pathname.startsWith('/storage')) {
            setOpenMenus(prev => ({ ...prev, ombor: true }));
        }
        // Hisobot bo'limi sahifalaridan biri bo'lsa
        if (location.pathname.startsWith('/hisobot')) {
            setOpenMenus(prev => ({ ...prev, hisobot: true }));
        }
        // SMS bo'limi sahifalaridan biri bo'lsa
        if (location.pathname.startsWith('/sms')) {
            setOpenMenus(prev => ({ ...prev, sms: true }));
        }

        if (location.pathname.startsWith('/settings')) {
            setOpenMenus(prev => ({ ...prev, settings: true }));
        }
    }, [location.pathname]);

    // Menyu elementlari tuzilmasi
    const navItems = [
        { icon: Home, label: t('main'), route: "/", type: "link" },
        { icon: Calendar, label: t('calendar'), route: "/taqvim", type: "link" },
        { icon: Users, label: t('queue'), route: "/queue", type: "link" },
        { icon: User, label: t('my_results'), route: "/result", type: "link" },
        // ✨ YANGI QISM: BUYURTMALAR (BTS)
        { icon: ListOrdered, label: t('orders_bts'), route: "/orders", type: "link" },
        // ✨ YANGI QISM: STOMATOLOGIK KURSLAR
        { icon: BookOpen, label: t('dental_courses'), route: "/courses", type: "link" },

        // --- KLINIKA BO'LIMI (GROUP) ---
        {
            icon: Stethoscope,
            label: t('clinic'),
            route: "/klinika",
            type: "group",
            name: "klinika",
            subItems: [
                { label: t('staff'), route: "/klinika/xodimlar" },
                { label: t('services_card'), route: "/klinika/xizmatlar-card" },
                { label: t('service_categories'), route: "/klinika/xizmatlar-kategoriyalari" },
                { label: t('services'), route: "/klinika/xizmatlar" },
                { label: t('treatments'), route: "/klinika/davolashlar" },
                { label: t('treatment_planning'), route: "/klinika/davolashni-rejalashtirish" },
                { label: t('patients'), route: "/klinika/bemorlar" },
                { label: t('debt_treatments'), route: "/klinika/qarzdor-davolashlar" },
                { label: t('clinic_data'), route: "/klinika/malumotlar" },
            ]
        },

        // --- OMBOR BO'LIMI (YANGI GROUP) ---
        {
            icon: Archive, // Ikonka (lucide-react'dan import qilinadi)
            label: t('warehouse'),
            route: "/storage",
            type: "group",
            name: "ombor",
            subItems: [
                { label: t('documents'), route: "/storage/documents" },
                { label: t('products'), route: "/storage/products" },
                { label: t('categories'), route: "/storage/categories" },
                { label: t('brands'), route: "/storage/brands" },
                { label: t('units'), route: "/storage/units" },
                { label: t('suppliers'), route: "/storage/suppliers" },
                { label: t('product_usage'), route: "/storage/usage" },
            ]
        },

        // --- HISOBOT BO'LIMI (YANGI GROUP) ---
        {
            icon: FileText,
            label: t('reports'),
            route: "/hisobot",
            type: "group",
            name: "hisobot",
            subItems: [
                { label: t('payments'), route: "/hisobot/to'lovlar", icon: DollarSign },
                { label: t('lead_statistics'), route: "/hisobot/lead-statistika", icon: TrendingUp },
                { label: t('doc_daily_reports'), route: "/hisobot/doktor-hisobotlari", icon: LayoutList },
                { label: t('give_money_docs'), route: "/hisobot/doktorlarga-pul-berish", icon: DollarSign },
                { label: t('daily_expenses'), route: "/hisobot/kunilik-xarajatlar", icon: ListOrdered },
                { label: t('daily_expense_categories'), route: "/hisobot/kunilik-xarajatlar-kategoriyalari", icon: LayoutList },
            ]
        },

        // --- SMS BO'LIMI (YANGI GROUP) ---
        {
            icon: Send,
            label: t('sms'),
            route: "/sms",
            type: "group", // E'tibor bering, endi 'group'
            name: "sms",
            subItems: [
                { label: t('sms_templates'), route: "/sms/shablonlar" },
                { label: t('sms_settings'), route: "/sms/sozlamalar" },
            ]
        },
        // --- SOZLAMALAR BO'LIMI (YANGI GROUP) ---
        {
            icon: Settings, // import qilish kerak bo'lishi mumkin
            label: t('settings'),
            route: "/settings",
            type: "group",
            name: "settings",
            subItems: [
                { label: t('general_settings'), route: "/settings/general" },           // 1. Umumiy sozlamalar
                { label: t('lead_categories'), route: "/settings/lead-categories" }, // 2. Lead kategoriyalar
                { label: t('diseases'), route: "/settings/diseases" },         // 3. Kasalliklar
                { label: t('ad_settings'), route: "/settings/advertising" },
                { label: t('announcements'), route: "/settings/announcements" },
            ]
        },

    ];

    const bottomItems = [
        {
            icon: BookOpen, // Ikonka (lucide-react'dan import qilinadi)
            label: t('manual'),
            route: "/manual",
            type: "single",
            name: "manual",
        },
    ];

    // Faol linklar uchun umumiy style klasslari
    const activeLinkClasses = "bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/30";
    const inactiveLinkClasses = "text-blue-600 hover:bg-blue-50 transition-all font-medium";

    return (
        <>
            {/* Mobil versiya uchun overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-[rgb(0,0,0,0.8)] z-20 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            <div className={`
                fixed top-0 left-0 h-full bg-white dark:bg-slate-900 shadow-2xl z-30
                transition-all duration-300 ease-in-out
                w-64 flex flex-col justify-between border-r border-blue-100 dark:border-blue-900/20
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                md:translate-x-0 md:static
            `}>
                {/* 1. Yuqori qism: Logo va Asosiy Menyu */}
                <div className="flex-1 overflow-y-auto custom-scrollbar"> {/* custom-scrollbar klassi kerak bo'lishi mumkin */}
                    {/* Logo qismi */}
                    <div className="flex items-center justify-between py-5 px-6 border-b border-blue-50 dark:border-blue-900/10">
                        <Link to="/" className="flex items-center space-x-3" onClick={() => setIsSidebarOpen(false)}>
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                                <span className="text-white text-2xl font-black">D</span>
                            </div>
                            <span className="text-2xl font-black text-blue-600 tracking-tighter">DentaGo</span>
                        </Link>
                        {/* Mobil menyu yopish tugmasi */}
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="p-1 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 md:hidden"
                        >
                            <ChevronRight className="w-6 h-6 rotate-180" />
                        </button>
                    </div>

                    {/* Navigation Links */}
                    <nav className="mt-4 px-2 space-y-1 pb-4">
                        {navItems.map((item, index) => (
                            <div key={index}>
                                {/* Agar element "link" (yakka) bo'lsa */}
                                {item.type === "link" && (
                                    <Link
                                        to={item.route}
                                        onClick={() => setIsSidebarOpen(false)}
                                        className={`
                                            flex items-center px-4 py-3 rounded-lg transition-all duration-200 group
                                            ${location.pathname === item.route
                                                ? activeLinkClasses
                                                : inactiveLinkClasses}
                                        `}
                                    >
                                        <item.icon className={`w-5 h-5 mr-3 transition-colors ${location.pathname === item.route ? 'text-white' : 'text-blue-600 group-hover:text-white'}`} />
                                        <span className="text-sm font-medium">{item.label}</span>
                                    </Link>
                                )}

                                {/* Agar element "group" (guruh) bo'lsa */}
                                {item.type === "group" && (
                                    <div>
                                        <button
                                            onClick={() => handleMenuToggle(item.name)}
                                            className={`
                                                w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group
                                                text-blue-600 hover:bg-blue-600 hover:text-white
                                                ${location.pathname.startsWith(item.route) ? 'bg-blue-600 text-white' : ''}
                                            `}
                                        >
                                            <div className="flex items-center">
                                                <item.icon className={`w-5 h-5 mr-3 transition-colors ${location.pathname.startsWith(item.route) ? 'text-white' : 'text-blue-600 group-hover:text-white'}`} />
                                                <span className="text-sm font-medium">{item.label}</span>
                                            </div>
                                            <ChevronDown
                                                className={`w-4 h-4 transition-transform duration-200 ${openMenus[item.name] ? 'rotate-180' : ''}`}
                                            />
                                        </button>

                                        {/* Sub-menu items */}
                                        <div className={`
                                            overflow-hidden transition-all duration-300 ease-in-out
                                            ${openMenus[item.name] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                                        `}>
                                            <div className="pl-11 pr-2 space-y-1 mt-1">
                                                {item.subItems.map((subItem, subIndex) => (
                                                    <Link
                                                        key={subIndex}
                                                        to={subItem.route}
                                                        onClick={() => setIsSidebarOpen(false)}
                                                        className={`
                                                            flex items-center px-4 py-2.5 rounded-xl text-sm transition-all
                                                            ${location.pathname === subItem.route
                                                                ? 'text-white bg-blue-600 font-bold shadow-md shadow-blue-500/20'
                                                                : 'text-blue-500 hover:text-blue-700 hover:bg-blue-50'}
                                                        `}
                                                    >
                                                        {subItem.icon && <subItem.icon className="w-4 h-4 mr-2" />}
                                                        {subItem.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>
                </div>

                {/* 2. Pastki qism: Qo'llanma va Ijtimoiy tarmoqlar */}
                <div className="p-4 bg-white dark:bg-gray-900 border-t dark:border-blue-500/10">
                    {/* Qo'llanma */}
                    <nav className="mb-4">
                        {bottomItems.map((item, index) => (
                            <Link
                                key={index}
                                to={item.route}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`
                                    flex items-center px-4 py-3 rounded-lg transition-all duration-200 group
                                    ${location.pathname === item.route
                                        ? 'text-white bg-blue-600 font-medium'
                                        : 'text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10'}
                                `}
                            >
                                <item.icon className={`w-5 h-5 mr-3 transition-colors ${location.pathname === item.route ? 'text-white' : 'text-blue-600 group-hover:text-white'}`} />
                                <span className="text-sm font-medium">{item.label}</span>
                            </Link>
                        ))}
                    </nav>

                    {/* Ijtimoiy tarmoqlar */}
                    <div>
                        <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-3">Biz bilan bog'lanish</p>
                        <div className="flex gap-3 items-center">
                            <a href="https://www.instagram.com/shokir__offical" className="p-2 text-white hover:text-blue-600 hover:bg-white transition-colors bg-blue-600 rounded-lg border border-white hover:border-blue-600">
                                <BsInstagram className="w-5 h-5" />
                            </a>
                            <a href="https://t.me/Dentago_uz" className="p-2 text-white hover:text-blue-600 hover:bg-white transition-colors bg-blue-600 rounded-lg border border-white hover:border-blue-600">
                                <BsTelegram className="w-5 h-5" />
                            </a>
                            <a href="mailto:ddentago@gmail.com" className="p-2 text-white hover:text-blue-600 hover:bg-white transition-colors bg-blue-600 rounded-lg border border-white hover:border-blue-600">
                                <MdEmail className="w-5 h-5" />
                            </a>
                        </div>
                        <div className="text-center mt-6 text-xs text-blue-600 dark:text-blue-400/60 font-medium">
                            &copy; 2025 DentaGo
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
