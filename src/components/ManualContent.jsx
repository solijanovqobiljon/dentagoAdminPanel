import React from 'react';
import { Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataProvider';

// Video kartochka uchun kichik komponent
const VideoCard = ({ title, videoUrl, thumbnailUrl }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden transform hover:scale-[1.02] transition-transform duration-300 cursor-pointer">
            <div className="relative h-36 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                {/* Agar video rasmi (thumbnail) mavjud bo'lsa, uni ko'rsatish */}
                {thumbnailUrl ? (
                    <img src={thumbnailUrl} alt={title} className="w-full h-full object-cover" />
                ) : (
                    // Vaqtinchalik joy
                    <div className="text-gray-500 dark:text-gray-400 text-sm">Video joyi</div>
                )}

                {/* Play tugmasi overlay'i */}
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity">
                    <div className="bg-white dark:bg-gray-800 rounded-full p-3 text-blue-600 shadow-lg">
                        <Play className="w-6 h-6 fill-current" />
                    </div>
                </div>
            </div>
            <div className="p-3">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-2">{title}</p>
            </div>
        </div>
    );
};


const ManualContent = () => {
    const { data, t } = useData();
    const manualSections = data.manualSections || [];

    return (
        <div className="p-4 md:p-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                        <Link to="/" className="hover:text-blue-600 transition-colors capitalize">{t('dashboard')}</Link>
                        <span className="text-slate-300">/</span>
                        <span className="text-slate-900 dark:text-white capitalize">{t('manual')}</span>
                    </div>
                </div>
            </div>

            {/* Ma'lumotlar mavjud bo'lsa ko'rsatish */}
            {manualSections.length > 0 ? (
                manualSections.map((section, index) => (
                    <section key={index} className="mb-10">
                        {/* Bo'lim sarlavhasi (Rasmdagidek: Kirish qismi, Asosiy qism) */}
                        <h2 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-6 pb-2 border-b-2 border-blue-100 dark:border-blue-900">{section.title}</h2>

                        {/* Video kartochkalar joylashadigan grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {section.videos.map((video) => (
                                <VideoCard
                                    key={video.id}
                                    title={video.title}
                                    videoUrl={video.url}
                                    thumbnailUrl={video.thumbnailUrl}
                                />
                            ))}
                        </div>
                    </section>
                ))
            ) : (
                // Agar ma'lumotlar bo'lmasa
                <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400">Qo'llanmalar bo'limi hali to'ldirilmagan.</p>
                </div>
            )}
        </div>
    );
};

export default ManualContent;
