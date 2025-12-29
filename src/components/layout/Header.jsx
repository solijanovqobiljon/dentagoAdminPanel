import React, { useState } from 'react';
import { useData } from '../../context/DataProvider';
import {
    Search,
    Maximize,
    Sun,
    Moon,
    Menu,
    ChevronDown,
    Calendar,
    LogOut,
    User,
    CreditCard,
    FileText,
} from 'lucide-react';
import { UZ, US, RU } from 'country-flag-icons/react/3x2';
import { useNavigate } from 'react-router-dom';
import LogoutConfirmationModal from '../modals/LogoutConfirmationModal';

// Qidiruv Modali - Responsive dizayn bilan
const SearchModal = ({ isOpen, onClose }) => {
    const { t } = useData();
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-start justify-center p-4 sm:pt-20 bg-black/60 backdrop-blur-sm transition-all duration-300">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in duration-200">
                <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
                    <Search className="w-5 h-5 text-blue-500" />
                    <input
                        type="text"
                        placeholder={t('search') || "Qidiruv..."}
                        className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-base sm:text-lg"
                        autoFocus
                    />
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500 transition-colors"
                    >
                        <span className="text-2xl leading-none">&times;</span>
                    </button>
                </div>
                <div className="p-6 min-h-[300px] max-h-[60vh] overflow-y-auto">
                    <div className="flex flex-col items-center justify-center text-center space-y-3 py-10">
                        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-full">
                            <Search className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base font-medium">
                            Bemorlar, Davolashlar va Xizmatlar bo'yicha tezkor qidiruv...
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Header = ({ setIsSidebarOpen, isSidebarOpen, currentPage }) => {
    const navigate = useNavigate();

    const {
        data = {},
        locale,
        switchLocale,
        theme,
        switchTheme,
        t,
        logout
    } = useData();

    const user = data.user || { name: 'Admin', role: 'Boshliq' };

    const [isLocaleMenuOpen, setIsLocaleMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const handleLogoutClick = () => {
        setIsProfileMenuOpen(false);
        setIsLogoutModalOpen(true);
    };

    const handleConfirmLogout = () => {
        logout();
        setIsLogoutModalOpen(false);
        navigate('/login');
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    };

    const handleLocaleChange = (newLocale) => {
        switchLocale(newLocale);
        setIsLocaleMenuOpen(false);
    };

    const handleThemeToggle = () => {
        switchTheme(theme === 'light' ? 'dark' : 'light');
    };

    const getFlag = (loc) => {
        const flagClass = "w-5 h-3.5 object-cover rounded-sm shadow-sm";
        switch (loc) {
            case 'uz': return <UZ title="Uzbek" className={flagClass} />;
            case 'en': return <US title="English" className={flagClass} />;
            case 'ru': return <RU title="Russian" className={flagClass} />;
            default: return null;
        }
    };

    return (
        <header className="flex items-center justify-between px-3 sm:px-6 py-3 bg-white dark:bg-gray-900 border-b border-blue-600 dark:border-blue-500/30 shadow-sm sticky top-0 z-40 transition-all duration-300">

            {/* Chap qism: Menu va Sarlavha */}
            <div className="flex items-center gap-2 sm:gap-4">
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2.5 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 active:scale-95 transition-all lg:hidden"
                >
                    <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <h1 className="text-lg sm:text-2xl font-bold text-blue-600 dark:text-blue-500 transition-all">
                    {currentPage}
                </h1>
            </div>

            {/* O'ng qism: Amallar */}
            <div className="flex items-center gap-1 sm:gap-3">

                {/* Qidiruv - Mobilda kichikroq */}
                <button
                    onClick={() => setIsSearchOpen(true)}
                    className="p-2 text-gray-500 dark:text-gray-400 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all group"
                >
                    <Search className="w-5 h-5 group-hover:text-blue-500 transition-colors" />
                </button>

                {/* Taqvim - Desktopda ko'rinadi */}
                <button
                    className="p-2 text-gray-500 dark:text-gray-400 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all hidden xs:flex"
                    onClick={() => navigate('/taqvim')}
                >
                    <Calendar className="w-5 h-5" />
                </button>

                {/* Fullscreen - Faqat desktopda */}
                <button
                    onClick={toggleFullscreen}
                    className="p-2 text-gray-500 dark:text-gray-400 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all hidden md:flex"
                    title="To'liq ekran"
                >
                    <Maximize className="w-5 h-5" />
                </button>

                {/* Til tanlash */}
                <div className="relative">
                    <button
                        onClick={() => setIsLocaleMenuOpen(!isLocaleMenuOpen)}
                        className="flex items-center gap-1.5 p-1.5 sm:p-2 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                    >
                        {getFlag(locale)}
                        <span className="text-xs sm:text-sm font-bold hidden xs:inline uppercase">{locale}</span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isLocaleMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isLocaleMenuOpen && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setIsLocaleMenuOpen(false)}></div>
                            <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 rounded-2xl shadow-xl z-20 border border-gray-100 dark:border-gray-700 py-2 overflow-hidden animate-in slide-in-from-top-2">
                                {['uz', 'ru', 'en'].map(lang => (
                                    <button
                                        key={lang}
                                        onClick={() => handleLocaleChange(lang)}
                                        className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors ${locale === lang ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                                    >
                                        {getFlag(lang)}
                                        <span className="font-medium uppercase">{lang}</span>
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Mavzu */}
                <button
                    onClick={handleThemeToggle}
                    className="p-2 text-gray-500 dark:text-gray-400 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all active:rotate-45"
                >
                    {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </button>

                {/* Profil - Moslashuvchan */}
                <div className="relative flex items-center border-l border-gray-200 dark:border-gray-700 ml-1 pl-2 sm:pl-4">
                    <button
                        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                        className="flex items-center gap-2 group outline-none"
                    >
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 text-white flex items-center justify-center rounded-xl text-sm font-black shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                            {(user.name && user.name[0]) || 'A'}
                        </div>
                        <div className="hidden lg:flex flex-col items-start text-left">
                            <span className="text-sm font-bold text-gray-900 dark:text-white leading-tight">{user.name}</span>
                            <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{user.role}</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isProfileMenuOpen && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setIsProfileMenuOpen(false)}></div>
                            <div className="absolute right-0 top-full mt-3 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-20 border border-gray-100 dark:border-gray-700 py-3 overflow-hidden animate-in slide-in-from-top-2">
                                <div className="px-4 py-2 mb-2 border-b border-gray-50 dark:border-gray-700 lg:hidden">
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">{user.name}</p>
                                    <p className="text-xs text-gray-500">{user.role}</p>
                                </div>

                                <button
                                    onClick={() => { navigate('/profile'); setIsProfileMenuOpen(false); }}
                                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:text-blue-600 transition-all group"
                                >
                                    <User className="w-4 h-4 mr-3 text-gray-400 group-hover:text-blue-500" />
                                    {t('my_profile') || "Mening profilim"}
                                </button>
                                <button
                                    onClick={() => { navigate('/payments/app'); setIsProfileMenuOpen(false); }}
                                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:text-blue-600 transition-all group"
                                >
                                    <CreditCard className="w-4 h-4 mr-3 text-gray-400 group-hover:text-blue-500" />
                                    {t('app_payments') || "To'lovlar"}
                                </button>
                                <button
                                    onClick={() => { navigate('/payments/tariffs'); setIsProfileMenuOpen(false); }}
                                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:text-blue-600 transition-all group"
                                >
                                    <FileText className="w-4 h-4 mr-3 text-gray-400 group-hover:text-blue-500" />
                                    {t('tariffs') || "Tariflar"}
                                </button>

                                <div className="h-px bg-gray-100 dark:bg-gray-700 my-2"></div>

                                <button
                                    onClick={handleLogoutClick}
                                    className="flex items-center w-full px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all font-medium"
                                >
                                    <LogOut className="w-4 h-4 mr-3" />
                                    {t('logout') || "Chiqish"}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Modallar */}
            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

            <LogoutConfirmationModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={handleConfirmLogout}
            />

        </header >
    );
};

export default Header;