import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataProvider';
import Modal from './common/Modal';
import { availableRoles, availableColors, availableServices, colorDotClasses } from '../constants';
import { Link as RouterLink } from 'react-router-dom';
// icons
import { Search, ChevronDown, Plus, MoreVertical, X, FileText, Settings, Key, Zap, EyeOff, Eye, Trash2, Link } from 'lucide-react';

const StaffContent = () => {
    const { data, updateData, t } = useData();

    // Modal Holatlari
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isServiceLinkModalOpen, setIsServiceLinkModalOpen] = useState(false);
    const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);

    // Tanlangan Xodim
    const [selectedStaff, setSelectedStaff] = useState(null);

    // Dropdown (3 nuqta)
    const [openDropdownId, setOpenDropdownId] = useState(null);

    // Parolni ko'rsatish/yashirish holati
    const [showPassword, setShowPassword] = useState(false);

    // --- FORMALAR HOLATLARI ---
    const [addForm, setAddForm] = useState({
        firstName: '', lastName: '', login: '', phone: '', password: 'password123', position: availableRoles[0], color: availableColors[0], status: 'Faol'
    });
    const [editForm, setEditForm] = useState({ id: null, firstName: '', lastName: '', login: '', phone: '', position: '', color: '', status: '' });
    const [passwordForm, setPasswordForm] = useState({ newPassword: '', confirmPassword: '' });

    // Xizmat bog'lash uchun vaqtinchalik holat (bu joyda haqiqiy holat Local Storage'da saqlanadi)
    const [linkedServices, setLinkedServices] = useState([
        { id: 1, name: "Test", shareAmount: "100 000 so'm", shareType: "So'm" }
    ]);

    // --- FUNKSIYALAR ---
    const handleDropdownToggle = (staff) => {
        if (openDropdownId === staff.id) {
            setOpenDropdownId(null);
            setSelectedStaff(null);
        } else {
            setOpenDropdownId(staff.id);
            setSelectedStaff(staff);
            // Boshqa modallarni yopish
            setIsEditModalOpen(false); setIsDetailModalOpen(false); setIsPasswordModalOpen(false); setIsServiceLinkModalOpen(false); setIsAddServiceModalOpen(false);
        }
    };

    // Xodim qo'shish
    const handleAddStaff = () => {
        if (!addForm.firstName || !addForm.login || !addForm.phone) {
            alert(t('fill_required'));
            return;
        }

        const newStaff = {
            fio: `${addForm.firstName} ${addForm.lastName}`,
            position: addForm.position,
            login: addForm.login,
            phone: addForm.phone,
            color: addForm.color,
            status: addForm.status,
        };

        updateData('staff', newStaff, 'ADD');
        setIsAddModalOpen(false);
        setAddForm({ firstName: '', lastName: '', login: '', phone: '', password: 'password123', position: availableRoles[0], color: availableColors[0], status: 'Faol' });
    };

    // Tahrirlash modalini ochish
    const openEditModal = (staff) => {
        setSelectedStaff(staff);
        setOpenDropdownId(null);

        const parts = (staff.fio || '').split(' ');
        const firstName = parts[0] || '';
        const lastName = parts.slice(1).join(' ') || '';
        setEditForm({
            id: staff.id,
            firstName: firstName,
            lastName: lastName,
            position: staff.position,
            login: staff.login,
            phone: staff.phone,
            color: staff.color,
            status: staff.status,
        });
        setIsEditModalOpen(true);
    };

    // Xodimni tahrirlash
    const handleEditSubmit = () => {
        if (!editForm.firstName || !editForm.login || !editForm.phone) {
            alert(t('fill_required'));
            return;
        }

        const updatedStaff = {
            id: editForm.id,
            fio: `${editForm.firstName} ${editForm.lastName}`,
            position: editForm.position,
            login: editForm.login,
            phone: editForm.phone,
            color: editForm.color,
            status: editForm.status,
        };

        updateData('staff', updatedStaff, 'UPDATE');
        setIsEditModalOpen(false);
    };

    // Parol o'zgartirish
    const handlePasswordChange = () => {
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            alert("Parollar bir xil emas!");
            return;
        }
        if (passwordForm.newPassword.length < 6) {
            alert("Parol kamida 6 belgidan iborat bo'lishi kerak.");
            return;
        }

        // Parol o'zgartirish (backend ga yuborish kerak)
        alert(`Xodim (${selectedStaff?.fio}) paroli muvaffaqiyatli yangilanish uchun yuborildi.`);
        setIsPasswordModalOpen(false);
        setPasswordForm({ newPassword: '', confirmPassword: '' });
    };

    // Yordamchi Komponent: Batafsil ma'lumot qatori
    const DetailItem = ({ label, value }) => (
        <div className="flex justify-between items-start border-b border-blue-50 dark:border-blue-900/10 pb-3">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{label}</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white break-word max-w-[60%] text-right">{value}</span>
        </div>
    );

    // Yordamchi Komponent: Rang tanlash tugmasi
    const ColorPicker = ({ colorKey, currentSelection, onSelect, label }) => (
        <div
            className={`py-2 px-3 rounded-lg border cursor-pointer flex items-center gap-2 ${currentSelection === colorKey ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
            onClick={() => onSelect(colorKey)}
        >
            <span className={`w-4 h-4 rounded-full inline-block ${colorDotClasses[colorKey]}`}></span>
            {label && <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>}
        </div>
    );

    return (
        <div className="p-4 md:p-8 space-y-6">

            {/* Breadcrumbs va Filter/Actions Bloki */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

                {/* Chap qism: Breadcrumbs */}
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                    <RouterLink to="/" className="hover:text-blue-600 transition-colors capitalize">{t('dashboard')}</RouterLink>
                    <span className="text-slate-300">/</span>
                    <span className="text-slate-900 dark:text-white capitalize">{t('staff')}</span>
                </div>

                {/* O'ng qism: Qidiruv va Tugmalar */}
                <div className="flex flex-col md:flex-row gap-4 w-full sm:w-auto">

                    {/* Qidiruv maydoni */}
                    <div className="relative grow">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder={t('search')}
                            className="w-full py-2.5 pl-10 pr-4 border border-blue-50 dark:border-blue-900/30 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                    </div>

                    {/* Xodim qo'shish tugmasi */}
                    <button className="flex items-center justify-center gap-2 px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95 w-full md:w-auto uppercase tracking-widest text-xs"
                        onClick={() => setIsAddModalOpen(true)}>
                        <Plus className="w-5 h-5" />
                        {t('add')}
                    </button>
                </div>
            </div>

            {/* Asosiy Jadval (Xodimlar Ro'yxati) */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl shadow-blue-500/5 border border-blue-50 dark:border-blue-900/10 overflow-hidden">
                <table className="min-w-full divide-y divide-blue-50 dark:divide-blue-900/10">

                    {/* Jadval Boshi (Header) */}
                    <thead className='bg-blue-50/50 dark:bg-blue-900/20'>
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-widest w-16">#</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-widest">{t('name')}</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-widest">Lavozim</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-widest">Login</th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-widest w-20">Rangi</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-widest w-24">{t('actions')}</th>
                        </tr>
                    </thead>

                    {/* Jadval Tana qismi (Body) */}
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {data.staff.map((staff) => (
                            <tr key={staff.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors border-b dark:border-blue-900/10">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 dark:text-gray-400">{staff.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">{staff.fio}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600 dark:text-blue-400">{staff.position}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">@{staff.login}</td>

                                {/* Rang ustuni */}
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                                    <div
                                        className={`w-4 h-4 rounded-full mx-auto border border-gray-300 dark:border-gray-600 ${colorDotClasses[staff.color]}`}
                                        title={`Rang: ${staff.color}`}
                                    ></div>
                                </td>

                                {/* Harakatlar tugmasi (3 nuqta) */}
                                <td className="px-4 py-3 whitespace-nowrap text-right relative">
                                    <button
                                        onClick={() => handleDropdownToggle(staff)}
                                        className="p-2 text-gray-500 dark:text-gray-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                                    >
                                        <MoreVertical className="w-5 h-5" />
                                    </button>

                                    {/* --- Dropdown Kontenti --- */}
                                    {openDropdownId === staff.id && (
                                        <>
                                            {/* Tashqariga bosilganda yopish uchun overlay */}
                                            <div className="fixed inset-0 z-10" onClick={() => setOpenDropdownId(null)}></div>

                                            <div className="absolute right-12 top-1/2 transform -translate-y-1/2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-xl overflow-hidden z-20">
                                                <ul className="py-1">
                                                    <li
                                                        onClick={() => openEditModal(staff)}
                                                        className='px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-2'>
                                                        <FileText className='w-4 h-4 text-gray-500 dark:text-gray-400' /> {t('edit')}
                                                    </li>
                                                    <li
                                                        onClick={() => { setSelectedStaff(staff); setIsDetailModalOpen(true); setOpenDropdownId(null) }}
                                                        className='px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-2'>
                                                        <Zap className='w-4 h-4 text-gray-500 dark:text-gray-400' /> {t('view') || 'Batafsil'}
                                                    </li>
                                                    <li
                                                        onClick={() => { setSelectedStaff(staff); setIsServiceLinkModalOpen(true); setOpenDropdownId(null) }}
                                                        className='px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-2 border-t border-gray-100 dark:border-gray-700 mt-1 pt-1'>
                                                        <Settings className='w-4 h-4 text-gray-500 dark:text-gray-400' /> {t('link_service') || "Xizmat bog'lash"}
                                                    </li>
                                                    <li
                                                        onClick={() => { setSelectedStaff(staff); setIsPasswordModalOpen(true); setOpenDropdownId(null) }}
                                                        className='px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-2'>
                                                        <Key className='w-4 h-4 text-gray-500 dark:text-gray-400' /> {t('change_password')}
                                                    </li>
                                                </ul>
                                            </div>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* -------------------- MODALLAR -------------------- */}

            {/* 1. Xodim qo'shish MODALI */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title={t('add')}
                footer={
                    <button onClick={handleAddStaff} className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition w-full">
                        <Plus className="w-5 h-5" />
                        {t('add')}
                    </button>
                }
            >
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('name')}<span className="text-red-500">*</span></label>
                    <input type="text" value={addForm.firstName} onChange={(e) => setAddForm({ ...addForm, firstName: e.target.value })} placeholder="Ismni kiriting..." className="w-full py-2.5 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('surname')}</label>
                    <input type="text" value={addForm.lastName} onChange={(e) => setAddForm({ ...addForm, lastName: e.target.value })} placeholder="Familiyani kiriting..." className="w-full py-2.5 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Login<span className="text-red-500">*</span></label>
                    <input type="text" value={addForm.login} onChange={(e) => setAddForm({ ...addForm, login: e.target.value })} placeholder="Login kiriting..." className="w-full py-2.5 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('phone')}<span className="text-red-500">*</span></label>
                    <input type="tel" value={addForm.phone} onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })} placeholder="Telefon raqamini kiriting..." className="w-full py-2.5 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Parol</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={addForm.password}
                            onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                            placeholder={t('enter_password')}
                            className="w-full py-2.5 px-3 border border-gray-300 dark:border-gray-600 rounded-lg pr-10 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                            {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('staff_role')}</label>
                    <div className="relative">
                        <select value={addForm.position} onChange={(e) => setAddForm({ ...addForm, position: e.target.value })} className="appearance-none block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-2.5 px-3 pr-8 rounded-lg leading-tight focus:outline-none focus:border-blue-500">
                            {availableRoles.map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300 w-5 h-5" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('staff_color')}</label>
                    <div className="flex items-center gap-2 flex-wrap">
                        {availableColors.map(color => (
                            <ColorPicker
                                key={color}
                                colorKey={color}
                                currentSelection={addForm.color}
                                onSelect={(c) => setAddForm({ ...addForm, color: c })}
                                label={color === 'white' ? 'Rang yo\'q' : ''}
                            />
                        ))}
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('status')}</label>
                    <div className="flex gap-4">
                        <button onClick={() => setAddForm({ ...addForm, status: 'Faol' })} className={`px-5 py-2 ${addForm.status === 'Faol' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'} font-semibold rounded-lg transition`}>Faol</button>
                        <button onClick={() => setAddForm({ ...addForm, status: 'Nofaol' })} className={`px-5 py-2 ${addForm.status === 'Nofaol' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'} font-semibold rounded-lg transition`}>Nofaol</button>
                    </div>
                </div>
            </Modal>

            {/* 2. Tahrirlash MODALI */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title={t('edit')}
                footer={
                    <button onClick={handleEditSubmit} className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition w-full">
                        {t('save')}
                    </button>
                }
            >
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('name')}<span className="text-red-500">*</span></label>
                    <input type="text" name="firstName" value={editForm.firstName} onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })} className="w-full py-2.5 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('surname')}</label>
                    <input type="text" name="lastName" value={editForm.lastName} onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })} className="w-full py-2.5 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Login<span className="text-red-500">*</span></label>
                    <input type="text" name="login" value={editForm.login} onChange={(e) => setEditForm({ ...editForm, login: e.target.value })} className="w-full py-2.5 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('phone')}<span className="text-red-500">*</span></label>
                    <input type="tel" name="phone" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} className="w-full py-2.5 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500" />
                </div>
                {/* Parol o'zgartirish maydoni tahrirlashdan olib tashlandi, uning uchun alohida modal bor */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('staff_role')}</label>
                    <div className="relative">
                        <select name="position" value={editForm.position} onChange={(e) => setEditForm({ ...editForm, position: e.target.value })} className="appearance-none block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-2.5 px-3 pr-8 rounded-lg leading-tight focus:outline-none focus:border-blue-500">
                            {availableRoles.map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300 w-5 h-5" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('staff_color')}</label>
                    <div className="flex items-center gap-2 flex-wrap">
                        {availableColors.map(color => (
                            <ColorPicker
                                key={color}
                                colorKey={color}
                                currentSelection={editForm.color}
                                onSelect={(c) => setEditForm({ ...editForm, color: c })}
                                label={color === 'white' ? 'Rang yo\'q' : ''}
                            />
                        ))}
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('status')}</label>
                    <div className="flex gap-4">
                        <button onClick={() => setEditForm({ ...editForm, status: 'Faol' })} className={`px-5 py-2 ${editForm.status === 'Faol' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'} font-semibold rounded-lg transition`}>Faol</button>
                        <button onClick={() => setEditForm({ ...editForm, status: 'Nofaol' })} className={`px-5 py-2 ${editForm.status === 'Nofaol' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'} font-semibold rounded-lg transition`}>Nofaol</button>
                    </div>
                </div>
            </Modal>

            {/* 3. Batafsil MODALI */}
            <Modal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                title={t('details')}
            >
                {selectedStaff && (
                    <div className="space-y-4">
                        <DetailItem label="F.I.O" value={selectedStaff.fio} />
                        <DetailItem label="Lavozim" value={selectedStaff.position} />
                        <DetailItem label="Foydalanuvchi nomi" value={selectedStaff.login} />
                        <DetailItem label="Telefon raqami" value={selectedStaff.phone} />
                        <DetailItem label="Rangi" value={<span className={`w-4 h-4 rounded-full inline-block border border-gray-300 dark:border-gray-600 ${colorDotClasses[selectedStaff.color]}`}></span>} />
                        <DetailItem label="Holati" value={<span className={`inline-flex items-center px-3 py-1 text-xs font-medium ${selectedStaff.status === 'Faol' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'} rounded-full`}>{selectedStaff.status}</span>} />
                    </div>
                )}
            </Modal>

            {/* 4. Parolni o'zgartirish MODALI */}
            <Modal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
                title={`Parolni o'zgartirish: ${selectedStaff?.fio?.split(' ')?.[0] || ''}`}
                footer={
                    <button onClick={handlePasswordChange} className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition w-full">
                        {t('save')}
                    </button>
                }
            >
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('new_password')}<span className="text-red-500">*</span></label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                            placeholder={t('enter_password')}
                            className="w-full py-2.5 px-3 border border-gray-300 dark:border-gray-600 rounded-lg pr-10 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                            {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('confirm_new_password')}<span className="text-red-500">*</span></label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={passwordForm.confirmPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                            placeholder={t('enter_password')}
                            className="w-full py-2.5 px-3 border border-gray-300 dark:border-gray-600 rounded-lg pr-10 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                            {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* 5. Xizmat bog'lash MODALI (O'zgarishsiz, faqat ochilish funksiyasi ulandi) */}
            <Modal
                isOpen={isServiceLinkModalOpen}
                onClose={() => setIsServiceLinkModalOpen(false)}
                title={`Xizmat bog'lash: ${selectedStaff?.fio?.split(' ')?.[0] || ''}`}
                size="max-w-3xl"
            >
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    <RouterLink to="/" className="text-gray-700 dark:text-gray-300 font-medium hover:text-blue-500 transition-colors">{t('dashboard')}</RouterLink> /
                    <span className="text-blue-600 dark:text-blue-400 font-medium"> Xodimlarga xizmat bog'lash</span>
                </div>

                <div className="flex justify-between items-center p-3 border-b border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{t('staff_info')}</h3>
                </div>

                {/* Xodim ma'lumotlari jadvali (bir qator) */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-x-auto">
                    {/* ... (jadval kontenti) */}
                    <p className="p-4 text-sm text-gray-500 dark:text-gray-400">Xodimning jami ma'lumotlari haqiqiy joyda chiqariladi...</p>
                </div>

                <div className="flex justify-between items-center p-3 border-b border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{t('staff_service_share')}</h3>
                    <button onClick={() => setIsAddServiceModalOpen(true)} className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
                        <Plus className="w-5 h-5" /> {t('add')}
                    </button>
                </div>

                {/* Xodimning xizmatlari jadvali */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        {/* ... (jadval kontenti) */}
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {linkedServices.map((service, index) => (
                                <tr key={service.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{index + 1}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{service.name}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{service.shareAmount}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{service.shareType}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">0 so'm</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-right">
                                        <button className="text-red-500 hover:text-red-700 dark:hover:text-red-400 p-1">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Xizmat qo'shish modalini ochish uchun */}
                {isAddServiceModalOpen && (
                    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/50 bg-opacity-40 backdrop-blur-sm">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-sm">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{t('link_new_service')}</h3>
                                <button onClick={() => setIsAddServiceModalOpen(false)} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white p-1">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('select_service')}</label>
                                    <div className="relative">
                                        <select className="appearance-none block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-2.5 px-3 pr-8 rounded-lg leading-tight focus:outline-none focus:border-blue-500">
                                            <option value="">{t('select_service')}</option>
                                            {data.services && data.services.map((service) => (
                                                <option key={service.id} value={service.name}>{service.name}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300 w-5 h-5" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('share_amount')}</label>
                                    <input type="text" placeholder={t('share_amount')} className="w-full py-2.5 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('share_type')}</label>
                                    <div className="flex gap-3">
                                        <button className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg transition">{t('currency_sum')}</button>
                                        <button className="px-5 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition">{t('percent')}</button>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end mt-6">
                                <button onClick={() => setIsAddServiceModalOpen(false)} className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
                                    <Plus className="w-5 h-5" /> {t('add')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>


        </div >
    );
};

export default StaffContent;
