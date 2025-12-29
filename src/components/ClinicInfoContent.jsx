// src/components/ClinicInfoContent.jsx

import React, { useState } from 'react';
import { Edit, Save, X, Building, MapPin, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataProvider';

// Klinika ma'lumotlarini tahrirlash modal oynasi
const EditClinicInfoModal = ({ isOpen, onClose, initialData }) => {
    const { updateData, t } = useData();
    const [formData, setFormData] = useState(initialData);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        updateData('clinicInfo', formData, 'UPDATE');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-end">
            <div className="bg-white dark:bg-gray-800 w-full max-w-md h-full shadow-2xl overflow-y-auto">
                <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">{t('edit')} {t('clinic_info')}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><X className="w-6 h-6" /></button>
                </div>

                <div className="p-6 space-y-4">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('clinic_name')}</label>
                    <input name="name" value={formData.name} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />

                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('address')}</label>
                    <input name="address" value={formData.address} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />

                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('phone')}</label>
                    <input name="phone" value={formData.phone} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />

                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('email')}</label>
                    <input name="email" value={formData.email} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />

                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Bank rekvizitlari</label>
                    <textarea name="bankDetails" value={formData.bankDetails} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-h-[100px]"></textarea>
                </div>

                <div className="p-5 border-t border-gray-200 dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-800">
                    <button onClick={handleSave} className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
                        <Save className='w-5 h-5' /> {t('save')}
                    </button>
                </div>
            </div>
        </div>
    );
};


const ClinicInfoContent = () => {
    const { data, t } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const clinicInfo = (() => {
        if (!data || data.clinicInfo == null) return {};
        return Array.isArray(data.clinicInfo) ? (data.clinicInfo[0] || {}) : data.clinicInfo;
    })();

    return (
        <div className="p-4 md:p-8 space-y-6">

            {/* Breadcrumbs va Tugma */}
            <div className="flex justify-between items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                        <Link to="/" className="hover:text-blue-600 transition-colors capitalize">{t('dashboard')}</Link>
                        <span className="text-slate-300">/</span>
                        <span className="text-slate-900 dark:text-white capitalize">{t('clinic_info')}</span>
                    </div>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className='flex items-center gap-2 py-2.5 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors whitespace-nowrap'
                >
                    <Edit className='w-5 h-5' /> {t('edit')}
                </button>
            </div>

            {/* Asosiy Ma'lumotlar Bloki */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6 space-y-5">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3 mb-4 flex items-center gap-3">
                    <Building className='w-6 h-6 text-blue-600' /> {clinicInfo.name}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">

                    {/* Manzil */}
                    <div className="flex items-start gap-3">
                        <MapPin className='w-6 h-6 text-gray-500 dark:text-gray-400 mt-1' />
                        <div>
                            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">{t('address')}:</p>
                            <p className="text-lg text-gray-800 dark:text-gray-200">{clinicInfo.address}</p>
                        </div>
                    </div>

                    {/* Telefon */}
                    <div className="flex items-start gap-3">
                        <Phone className='w-6 h-6 text-gray-500 dark:text-gray-400 mt-1' />
                        <div>
                            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">{t('phone')}:</p>
                            <p className="text-lg text-gray-800 dark:text-gray-200">{clinicInfo.phone}</p>
                        </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-start gap-3">
                        <Mail className='w-6 h-6 text-gray-500 dark:text-gray-400 mt-1' />
                        <div>
                            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">{t('email')}:</p>
                            <p className="text-lg text-gray-800 dark:text-gray-200">{clinicInfo.email}</p>
                        </div>
                    </div>
                </div>

                {/* Bank Rekvizitlari */}
                <div className="pt-5 border-t border-gray-200 dark:border-gray-700 mt-5">
                    <p className="text-lg font-bold text-gray-800 dark:text-white mb-2">Bank ma'lumotlari:</p>
                    <p className="whitespace-pre-wrap bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg text-gray-700 dark:text-gray-300 text-sm">
                        {clinicInfo.bankDetails}
                    </p>
                </div>
            </div>

            {/* Modal Oyna */}
            <EditClinicInfoModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialData={clinicInfo}
            />
        </div>
    );
};

export default ClinicInfoContent;
