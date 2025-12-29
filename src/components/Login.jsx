// src/components/Login.jsx
import React, { useState } from 'react';
import { useData } from '../context/DataProvider';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Phone, Globe } from 'lucide-react';

import DentaGo from "../assets/dentago.png"
import Dentalist from "../assets/dentalist.png"
import Dentacrm from "../assets/dentacrm.png"

const Login = () => {
    const { t, login } = useData();
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        if (login && login(username, password)) {
            navigate('/');
        } else {
            setError(t('password_mismatch') || 'Login yoki parol xato!'); // Fallback or reuse generic error
        }
    };

    return (
        <div className="flex min-h-screen w-full bg-white dark:bg-gray-900 overflow-hidden font-sans">
            {/* Left Side - Image */}
            <div className="hidden lg:block lg:w-3/5 relative">
                <img
                    src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2068&auto=format&fit=crop"
                    alt="Dental Office"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-blue-900/30 mix-blend-multiply"></div>
                {/* Optional overlay text if needed */}
                <div className="absolute top-10 left-10 text-white">
                    {/* <h1 className="text-4xl font-bold">Dental Soft</h1> */}
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-2/5 flex flex-col justify-between p-8 md:p-12 lg:p-16 bg-white">

                {/* Spacer for proper centering */}
                <div></div>

                <div className="w-full max-w-sm mx-auto">
                    {/* Header */}
                    <div className="flex gap-2 flex-wrap items-center justify-center mb-10">
                        <img src={Dentalist} alt="Dentalist" className="w-auto h-16" />
                        <img src={DentaGo} alt="DentaGo" className="w-auto h-22" />
                        <img src={Dentacrm} alt="Dentalist" className="w-auto h-20" />
                    </div>

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {t('login_label')} <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-blue-50/50 dark:bg-gray-700/50 border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-gray-700 outline-none transition-all text-gray-900 dark:text-white"
                                placeholder="test_admin" // Placeholder to match screenshot hints?
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {t('password_label')} <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg bg-blue-50/50 dark:bg-gray-700/50 border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-gray-700 outline-none transition-all text-gray-900 dark:text-white pr-10"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 p-2 rounded">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/30 transition-all transform active:scale-95"
                        >
                            {t('login_title')}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <div className="text-center mt-10 space-y-4">
                    {/* <p className="text-xs text-gray-400 dark:text-gray-500 max-w-xs mx-auto">
                        {t('copyright')}
                    </p> */}

                    <div className="flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>{t('contact_support')}</span>
                        <div className="flex gap-2">
                            <a href="tel:+998952192699">
                                <Phone size={16} className="cursor-pointer hover:text-blue-500 transition-colors" />
                            </a>
                            <a href="https://t.me/">
                                <Globe size={16} className="cursor-pointer hover:text-blue-500 transition-colors" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
