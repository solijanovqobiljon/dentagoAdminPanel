import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, X, FileText, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataProvider';
import Modal from './common/Modal';

// Bemor qo'shish/tahrirlash modal oynasi
const AddEditPatientModal = ({ isOpen, onClose, editingPatient }) => {
    const { updateData, t } = useData();
    const [formData, setFormData] = useState(editingPatient || {
        name: '',
        familya: '',
        phone: '',
        birthDate: '',
        gender: 'Erkak',
        address: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        if (!formData.name || !formData.phone) {
            alert(t('fill_required'));
            return;
        }

        const dataToSend = {
            ...formData,
            registrationDate: new Date().toLocaleDateString('uz-UZ'),
            debt: formData.debt || "0 so'm"
        };

        if (editingPatient) {
            updateData('patients', dataToSend, 'UPDATE');
        } else {
            updateData('patients', dataToSend, 'ADD');
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={editingPatient ? t('edit') : t('add')}
            footer={
                <button onClick={handleSave} className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
                    {editingPatient ? t('save') : `+ ${t('add')}`}
                </button>
            }
        >
            <div className="space-y-4">
                <input name="name" value={formData.name} onChange={handleChange} placeholder={`${t('name')}*`} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500" />
                <input name="familya" value={formData.familya} onChange={handleChange} placeholder={t('surname')} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500" />
                <input name="phone" value={formData.phone} onChange={handleChange} placeholder={`${t('phone')}*`} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500" />
                <input name="birthDate" type="date" value={formData.birthDate} onChange={handleChange} placeholder={t('birth_date')} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500" />
                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500">
                    <option value="Erkak">{t('gender_male')}</option>
                    <option value="Ayol">{t('gender_female')}</option>
                </select>
                <input name="address" value={formData.address} onChange={handleChange} placeholder={t('address')} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500" />
            </div>
        </Modal>
    );
};


const PatientsContent = () => {
    const { data, updateData, t } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPatient, setEditingPatient] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleOpenModal = (patient = null) => {
        setEditingPatient(patient);
        setIsModalOpen(true);
    };

    const handleDelete = (id, name) => {
        if (window.confirm(`${name}: ${t('confirm_delete')}`)) {
            updateData('patients', { id }, 'DELETE');
        }
    };

    const filteredPatients = data.patients.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.familya.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone.includes(searchTerm)
    );

    return (
        <div className="p-4 md:p-8 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                        <Link to="/" className="hover:text-blue-600 transition-colors capitalize">{t('dashboard')}</Link>
                        <span className="text-slate-300">/</span>
                        <span className="text-slate-900 dark:text-white capitalize">{t('patients')}</span>
                    </div>
                </div>

                <div className='flex flex-wrap gap-4 w-full md:w-auto mt-2 md:mt-0'>
                    <div className="relative grow md:grow-0 min-w-[280px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input type="text" placeholder={t('search')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full py-2.5 pl-12 pr-4 border border-blue-50 dark:border-blue-900/30 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all" />
                    </div>

                    <button onClick={() => handleOpenModal(null)}
                        className='flex items-center justify-center gap-2 py-3 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black shadow-lg shadow-blue-500/30 whitespace-nowrap transition active:scale-95 uppercase tracking-widest text-xs w-full md:w-auto'>
                        <Plus className='w-5 h-5' /> {t('add')}
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-blue-500/5 border border-blue-50 dark:border-blue-900/10 overflow-hidden relative">
                <table className="min-w-full divide-y divide-blue-50 dark:divide-blue-900/10">
                    <thead className='bg-blue-50/50 dark:bg-blue-900/20'>
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-widest w-12">#</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-widest min-w-[150px]">{t('name')}</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-widest min-w-[100px]">{t('phone')}</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-widest min-w-[100px]">{t('debt')}</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-widest min-w-[120px]">{t('registered_date')}</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-widest w-20">{t('actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700 whitespace-nowrap">
                        {filteredPatients.length > 0 ? (
                            filteredPatients.map((patient, index) => (
                                <tr key={patient.id} className='hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors border-b dark:border-blue-900/10'>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">{index + 1}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">{patient.name} {patient.familya}</td>
                                    <td className="px-6 py-4 text-sm font-semibold text-blue-600 dark:text-blue-400">{patient.phone}</td>
                                    <td className={`px-6 py-4 text-sm font-black ${patient.debt.startsWith('-') ? 'text-red-500' : 'text-emerald-500'}`}>{patient.debt}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 font-medium">{patient.registrationDate}</td>
                                    <td className="px-6 py-4 text-sm flex justify-end gap-2">
                                        <button onClick={() => alert(`${t('send_to_treatment')}: ${patient.name}`)} className='p-2 rounded-xl text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all active:scale-90 border border-transparent hover:border-emerald-200' title={t('treatment')}>
                                            <FileText className='w-4 h-4' />
                                        </button>
                                        <button onClick={() => handleOpenModal(patient)} className='p-1 rounded-full text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30' title={t('edit')}>
                                            <Edit className='w-4 h-4' />
                                        </button>
                                        <button onClick={() => handleDelete(patient.id, patient.name)} className='p-1 rounded-full text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30' title={t('delete')}>
                                            <Trash2 className='w-4 h-4' />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="6" className='p-10 text-center text-gray-500 dark:text-gray-400'>{t('no_patients')}</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
            <AddEditPatientModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                editingPatient={editingPatient}
            />
        </div>
    );
};

export default PatientsContent;
