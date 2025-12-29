import React, { useState } from 'react';
import { Plus, Search, Calendar, Edit, Trash2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataProvider';
import Modal from './common/Modal';

const TreatmentsContent = () => {
    const { data, addTreatment, updateData, t } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingTreatment, setEditingTreatment] = useState(null);

    // Form states
    const [formData, setFormData] = useState({
        patientId: '',
        doctor: '',
        debt: "0 so'm"
    });

    const doctors = data.staff.filter(s => s.position === 'Shifokor' || s.position === 'Doktor' || s.lavozim === 'Shifokor');

    const handleOpenModal = (treatment = null) => {
        if (treatment) {
            setEditingTreatment(treatment);
            setFormData({
                patientId: treatment.patientId,
                doctor: treatment.doctor,
                debt: treatment.debt
            });
        } else {
            setEditingTreatment(null);
            setFormData({ patientId: '', doctor: '', debt: "0 so'm" });
        }
        setIsModalOpen(true);
    };

    const handleDelete = (id, patientName) => {
        if (window.confirm(`${patientName}: ${t('confirm_delete')}`)) {
            updateData('treatments', { id }, 'DELETE');
        }
    };

    const handleSave = () => {
        if (!formData.patientId || !formData.doctor) {
            alert(t('fill_required'));
            return;
        }

        if (editingTreatment) {
            const updatedTreatment = {
                id: editingTreatment.id,
                patientId: parseInt(formData.patientId),
                doctor: formData.doctor,
                debt: formData.debt,
            };
            const patient = data.patients.find(p => p.id == formData.patientId);
            if (patient) {
                updatedTreatment.patientName = `${patient.name} ${patient.familya}`;
                updatedTreatment.phone = patient.phone;
            }
            updateData('treatments', updatedTreatment, 'UPDATE');
        } else {
            addTreatment(parseInt(formData.patientId), { doctor: formData.doctor, debt: formData.debt });
        }
        setIsModalOpen(false);
    };

    const filteredTreatments = data.treatments.filter(t =>
        t.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.doctor.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4 md:p-8 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                        <Link to="/" className="hover:text-blue-600 transition-colors capitalize">{t('dashboard')}</Link>
                        <span className="text-slate-300">/</span>
                        <span className="text-slate-900 dark:text-white capitalize">{t('treatments')}</span>
                    </div>
                </div>

                <div className='flex flex-wrap gap-3'>
                    <div className="relative w-full md:w-auto min-w-[200px]">
                        <input type="text" placeholder={t('search')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full py-2.5 px-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-white focus:border-blue-500 focus:outline-none" />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>

                    <button onClick={() => handleOpenModal(null)}
                        className='flex items-center gap-2 py-2.5 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 whitespace-nowrap transition'>
                        <Plus className='w-5 h-5' /> {t('add')}
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-x-auto relative">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className='bg-gray-50 dark:bg-gray-900/50'>
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase w-12">#</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase min-w-[150px]">{t('patients')}</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase min-w-[150px]">{t('doctor')}</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase min-w-[120px]">{t('debt')}</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase min-w-[120px]">{t('payment_status')}</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase min-w-[120px]">{t('status')}</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase min-w-[150px]">{t('date')}</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase w-20">{t('actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700 whitespace-nowrap">
                        {filteredTreatments.length > 0 ? (
                            filteredTreatments.map((treatment, index) => (
                                <tr key={treatment.id} className='hover:bg-gray-50 dark:hover:bg-gray-700/50 transition'>
                                    <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">{index + 1}</td>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-800 dark:text-gray-200">{treatment.patientName}</td>
                                    <td className="px-4 py-3 text-sm text-blue-600 dark:text-blue-400">{treatment.doctor}</td>
                                    <td className={`px-4 py-3 text-sm font-medium ${treatment.debt.startsWith('-') ? 'text-red-600 dark:text-red-400' : 'text-gray-800 dark:text-gray-200'}`}>{treatment.debt}</td>
                                    <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">{treatment.paymentStatus}</td>
                                    <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${treatment.status === 'Yangi' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>{treatment.status}</span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">{treatment.date}</td>
                                    <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200 flex gap-2">
                                        <button onClick={() => handleOpenModal(treatment)} className='p-1 rounded-full text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30' title={t('edit')}>
                                            <Edit className='w-4 h-4' />
                                        </button>
                                        <button onClick={() => handleDelete(treatment.id, treatment.patientName)} className='p-1 rounded-full text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30' title={t('delete')}>
                                            <Trash2 className='w-4 h-4' />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="8" className='p-10 text-center text-gray-500 dark:text-gray-400'>{t('no_data')}</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingTreatment ? t('edit') : t('add')}
                footer={
                    <button onClick={handleSave} className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
                        {editingTreatment ? t('save') : `+ ${t('add')}`}
                    </button>
                }
            >
                <div className="space-y-4">
                    {/* Bemor tanlash */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('patients')}</label>
                        <select
                            value={formData.patientId}
                            onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                            disabled={!!editingTreatment} // Tahrirlashda bemorni o'zgartirib bo'lmaydi (optional)
                        >
                            <option value="">{t('select_patient')}</option>
                            {data.patients.map(p => (
                                <option key={p.id} value={p.id}>{p.name} {p.familya} ({p.phone})</option>
                            ))}
                        </select>
                    </div>

                    {/* Doktor tanlash */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Doktor</label>
                        <select
                            value={formData.doctor}
                            onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                        >
                            <option value="">{t('select_doctor')}</option>
                            {doctors.map(d => (
                                <option key={d.id} value={d.fio}>{d.fio}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('debt')}</label>
                        <input name="debt" value={formData.debt} onChange={(e) => setFormData({ ...formData, debt: e.target.value })} placeholder={t('debt')} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500" />
                    </div>
                </div>
            </Modal>
        </div >
    );
};
export default TreatmentsContent;
