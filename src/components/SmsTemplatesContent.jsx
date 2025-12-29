// src/components/SmsTemplatesContent.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataProvider';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';

import AddEditTemplateModal from './AddEditTemplateModal';
import ViewTemplateModal from './ViewTemplateModal';

const SmsTemplatesContent = () => {
    const { data, updateData, t } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [currentTemplate, setCurrentTemplate] = useState(null);

    const toggleTemplateStatus = (id, currentStatus) => {
        updateData('smsTemplates', { id, status: !currentStatus }, 'UPDATE');
    };

    const handleOpenAddEditModal = (template = null) => {
        setCurrentTemplate(template);
        setIsModalOpen(true);
    };

    const handleOpenViewModal = (template) => {
        setCurrentTemplate(template);
        setIsViewModalOpen(true);
    };

    const handleDeleteTemplate = (id) => {
        if (window.confirm(t('confirm_delete'))) {
            updateData('smsTemplates', { id }, 'DELETE');
        }
    };

    return (
        <div className="p-4 md:p-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                        <Link to="/" className="hover:text-blue-600 transition-colors capitalize">{t('dashboard')}</Link>
                        <span className="text-slate-300">/</span>
                        <span className="text-slate-900 dark:text-white capitalize">{t('sms_templates')}</span>
                    </div>
                </div>
                <button
                    onClick={() => handleOpenAddEditModal(null)}
                    className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    {t('add')}
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-100 dark:border-gray-700 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900/50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('name')}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Turi</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('status')}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('message')}</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {(data?.smsTemplates || []).map((template) => (
                            <tr key={template.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{template.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{template.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                        {template.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <button
                                            onClick={() => toggleTemplateStatus(template.id, template.status)}
                                            className={`relative inline-flex shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${template.status ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'}`}
                                            role="switch"
                                            aria-checked={template.status}
                                        >
                                            <span
                                                aria-hidden="true"
                                                className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${template.status ? 'translate-x-5' : 'translate-x-0'}`}
                                            ></span>
                                        </button>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">{(template.message || '').substring(0, 50)}...</td>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                    <div className="flex justify-center space-x-2">
                                        <button
                                            onClick={() => handleOpenViewModal(template)}
                                            className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                            title={t('view')}
                                        >
                                            <Eye className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleOpenAddEditModal(template)}
                                            className="text-yellow-600 hover:text-yellow-900 dark:hover:text-yellow-400 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                            title={t('edit')}
                                        >
                                            <Edit className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteTemplate(template.id)}
                                            className="text-red-600 hover:text-red-900 dark:hover:text-red-400 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                            title={t('delete')}
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* YANGI SHABLON QO'SHISH/TAHRIRLASH MODALI */}
            {isModalOpen && (
                <AddEditTemplateModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    template={currentTemplate}
                    updateData={updateData}
                />
            )}

            {/* SHABLON MA'LUMOTLARINI KO'RISH MODALI */}
            {isViewModalOpen && (
                <ViewTemplateModal
                    isOpen={isViewModalOpen}
                    onClose={() => setIsViewModalOpen(false)}
                    template={currentTemplate}
                />
            )}
        </div>
    );
};

export default SmsTemplatesContent;
