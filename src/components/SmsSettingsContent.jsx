// src/components/SmsSettingsContent.jsx

import React, { useState } from 'react';
import { useData } from '../context/DataProvider';
import { Link } from 'react-router-dom';
import { Edit } from 'lucide-react';
import EditSettingsModal from './EditSettingsModal';

const SmsSettingsContent = () => {
    const { data, t } = useData();
    const settings = data.smsSettings || [];

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentSetting, setCurrentSetting] = useState(null);

    const handleEdit = (setting) => {
        setCurrentSetting(setting);
        setIsModalOpen(true);
    };

    const setting = settings.length > 0 ? settings[0] : null;

    return (
        <div className="p-4 md:p-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                        <Link to="/" className="hover:text-blue-600 transition-colors capitalize">{t('dashboard')}</Link>
                        <span className="text-slate-300">/</span>
                        <span className="text-slate-900 dark:text-white capitalize">{t('sms_settings')}</span>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900/50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Shifoxona</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">SMS Token</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Yangilangan sana</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {setting ? (
                            <tr key={setting.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{setting.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{setting.clinicName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                    {setting.token ? `***${setting.token.slice(-8)}` : 'Token kiritilmagan'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{setting.updatedAt}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                                    <button
                                        onClick={() => handleEdit(setting)}
                                        className="text-indigo-600 hover:text-indigo-900 dark:hover:text-indigo-400 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                        title={t('edit')}
                                    >
                                        <Edit className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                    Hozircha sozlamalar mavjud emas.
                                    <button
                                        onClick={() => handleEdit(null)}
                                        className="ml-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                                    >
                                        Sozlamalarni qo'shish
                                    </button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* SOZLAMALAR MODALI */}
            {isModalOpen && (
                <EditSettingsModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    setting={currentSetting}
                    updateData={data.updateData}
                />
            )}
        </div>
    );
};

export default SmsSettingsContent;
