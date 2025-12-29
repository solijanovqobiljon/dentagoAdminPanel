import React, { useState, useRef, useEffect } from 'react';
import { Camera, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataProvider';

const GeneralSettingsContent = () => {
    const { data, updateData, t } = useData();

    const initialSettings = data.generalSettings || {};

    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState(initialSettings);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        setFormData(initialSettings);
    }, [data.generalSettings]);


    // --- LOGOTIP FUNKSIYALARI ---

    const handleLogoClick = () => {
        fileInputRef.current.click();
    };

    const handleLogoChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                logoUrl: URL.createObjectURL(file)
            }));
            setSuccess(t('fill_required'));
            setError('');
        }
    };

    // --- FORMA FUNKSIYALARI ---

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.companyName.trim() || !formData.phone1.trim() || !formData.address.trim()) {
            setError(t('fill_required'));
            return;
        }

        setIsSaving(true);

        const updatedSetting = {
            ...formData,
            lastUpdated: new Date().toLocaleDateString('uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(',', ''),
        };

        updateData('generalSettings', updatedSetting, 'UPDATE');

        setIsSaving(false);
        setSuccess("Sozlamalar muvaffaqiyatli saqlandi!");

        setTimeout(() => setSuccess(''), 5000);
    };

    return (
        <div className="p-4 md:p-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                        <Link to="/" className="hover:text-blue-600 transition-colors capitalize">{t('dashboard')}</Link>
                        <span className="text-slate-300">/</span>
                        <span className="text-slate-900 dark:text-white capitalize">{t('general_settings')}</span>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-medium text-gray-700 dark:text-gray-200 mb-6 border-b border-gray-200 dark:border-gray-700 pb-3">Kompaniya sozlamalari</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex justify-center mb-8">
                        {/* 1. YASHIRIN FAYL INPUTI */}
                        <input
                            type="file"
                            accept="image/jpeg,image/jpg,image/png"
                            ref={fileInputRef}
                            onChange={handleLogoChange}
                            className="hidden"
                        />

                        {/* 2. LOGOTIPNI KO'RSATISH VA BOSILISH JOYI */}
                        <div
                            onClick={handleLogoClick}
                            className="relative w-32 h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-full flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors group"
                        >
                            {formData.logoUrl ? (
                                <img
                                    src={formData.logoUrl}
                                    alt="Kompaniya Logotipi"
                                    className="w-full h-full object-cover rounded-full"
                                />
                            ) : (
                                <Camera className="w-8 h-8 text-gray-400" />
                            )}

                            {/* O'zgartirish overlay'i */}
                            <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity">
                                <span className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity">{t('edit')}</span>
                            </div>

                            <span className="text-sm text-gray-500 dark:text-gray-400 absolute bottom-[-30px] text-center">
                                Kompaniya logotipi (jpeg, jpg, png)
                            </span>
                        </div>
                    </div>

                    {/* 1-QATOR: Firma nomi va Telefon raqami 1 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Firma nomi*</label>
                            <input
                                type="text"
                                id="companyName"
                                value={formData.companyName || ''}
                                onChange={handleChange}
                                placeholder="Firma nomini kiriting"
                                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="phone1" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('phone')} 1*</label>
                            <input
                                type="text"
                                id="phone1"
                                value={formData.phone1 || ''}
                                onChange={handleChange}
                                placeholder={t('phone')}
                                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                    </div>

                    {/* 2-QATOR: Telefon raqami 2 va Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="phone2" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('phone')} 2</label>
                            <input
                                type="text"
                                id="phone2"
                                value={formData.phone2 || ''}
                                onChange={handleChange}
                                placeholder={t('phone')}
                                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('email')}</label>
                            <input
                                type="email"
                                id="email"
                                value={formData.email || ''}
                                onChange={handleChange}
                                placeholder={t('email')}
                                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                    </div>

                    {/* 3-QATOR: Manzil */}
                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('address')}*</label>
                        <div className="flex items-end gap-3">
                            <input
                                type="text"
                                id="address"
                                value={formData.address || ''}
                                onChange={handleChange}
                                placeholder={t('address')}
                                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-32 disabled:bg-blue-400"
                            >
                                {isSaving ? 'Saqlanmoqda...' : <><Save className="w-5 h-5 mr-1" /> {t('save')}</>}
                            </button>
                        </div>
                    </div>

                    {/* XATO VA MUVAFFFAQIYAT XABARLARI */}
                    {error && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-2 p-2 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded">{error}</p>
                    )}
                    {success && (
                        <p className="text-sm text-green-600 dark:text-green-400 mt-2 p-2 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded">{success}</p>
                    )}
                </form>
            </div>
        </div>
    );
};

export default GeneralSettingsContent;
