// src/components/LeadStatisticsContent.jsx

import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataProvider';
import { Link } from 'react-router-dom';
import { Calendar, Users, Briefcase, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

const LeadStatisticsContent = () => {
    const { data, t } = useData();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [statistics, setStatistics] = useState({
        totalTreatments: 0,
        newTreatments: 0,
        finishedTreatments: 0,
        totalIncome: 0,
    });

    useEffect(() => {
        let filteredTreatments = data.treatments || [];

        if (startDate && endDate) {
            filteredTreatments = filteredTreatments.filter(t => {
                const treatmentDate = new Date(t.date.split(' ')[0].split('.').reverse().join('-'));
                const start = new Date(startDate);
                const end = new Date(endDate);

                start.setHours(0, 0, 0, 0);
                end.setHours(0, 0, 0, 0);
                treatmentDate.setHours(0, 0, 0, 0);

                return treatmentDate >= start && treatmentDate <= end;
            });
        }

        const totalTreatments = filteredTreatments.length;
        const newTreatments = filteredTreatments.filter(t => t.status === 'Yangi').length;
        const finishedTreatments = filteredTreatments.filter(t => t.status.includes('yakunlandi')).length;

        const totalIncome = filteredTreatments.reduce((sum, t) => {
            const debtValue = parseInt(t.debt.replace(" so'm", '').replace(/\s/g, '')) || 0;
            return sum + Math.abs(debtValue);
        }, 0);

        setStatistics({
            totalTreatments,
            newTreatments,
            finishedTreatments,
            totalIncome,
        });

    }, [data.treatments, startDate, endDate]);


    const StatCard = ({ title, value, icon: Icon, color }) => (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 flex items-center justify-between transition-shadow hover:shadow-lg">
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1" style={{ color: color }}>{value}</p>
            </div>
            <Icon className="w-8 h-8 text-gray-300 dark:text-gray-600" />
        </div>
    );

    return (
        <div className="p-4 md:p-8 space-y-6">

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                        <Link to="/" className="hover:text-blue-600 transition-colors capitalize">{t('dashboard')}</Link>
                        <span className="text-slate-300">/</span>
                        <span className="text-slate-900 dark:text-white capitalize">{t('lead_statistics')}</span>
                    </div>
                </div>

                <div className='flex flex-wrap gap-3'>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="py-2.5 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-white min-w-[150px]"
                    />
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="py-2.5 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-white min-w-[150px]"
                    />
                </div>
            </div>

            {/* Statistika kartochkalari */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Jami davolashlar" value={statistics.totalTreatments} icon={Briefcase} color="#4F46E5" />
                <StatCard title="Yangi davolashlar" value={statistics.newTreatments} icon={Users} color="#F59E0B" />
                <StatCard title="Yakunlanganlar" value={statistics.finishedTreatments} icon={TrendingUp} color="#10B981" />
                <StatCard title="Umumiy daromad" value={`${statistics.totalIncome.toLocaleString('uz-UZ')} so'm`} icon={DollarSign} color="#DC2626" />
            </div>

            {/* Ma'lumotlar bo'yicha batafsil jadval */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6">
                <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Davolashlar ro'yxati (Filtrlangan)</h4>
                {statistics.totalTreatments > 0 ? (
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className='bg-gray-50 dark:bg-gray-900/50'>
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">#</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">{t('patient')}</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">{t('doctor')}</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">{t('status')}</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">{t('date')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            <tr><td colSpan="5" className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">Davolashlar ro'yxati chiqadi.</td></tr>
                        </tbody>
                    </table>
                ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-10">Tanlangan sanalar oralig'ida davolashlar topilmadi.</p>
                )}
            </div>
        </div>
    );
};

export default LeadStatisticsContent;
