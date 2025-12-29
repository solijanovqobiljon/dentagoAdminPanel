import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataProvider';

function Results() {
    const { t } = useData();
    // Tanlangan rasmlar (Image) va video (Video) uchun holat
    const [selectedImages, setSelectedImages] = useState([]); // Array (massiv) 4 tagacha rasm saqlash uchun
    const [selectedVideo, setSelectedVideo] = useState(null); // Faqat bitta video saqlash uchun

    // Rasm tanlanganda ishlaydigan funksiya
    const handleImageChange = (event) => {
        const files = Array.from(event.target.files);

        // Agar tanlangan rasmlar soni 4 tadan oshmasa va joriy tanlanganlar bilan birgalikda ham 4 tadan oshmasa
        if (selectedImages.length + files.length <= 4) {
            // Fayllarni URL lari bilan birga saqlaymiz
            const newImages = files.map(file => ({
                file: file,
                preview: URL.createObjectURL(file) // Ko'rish uchun vaqtinchalik URL
            }));
            setSelectedImages(prevImages => [...prevImages, ...newImages]);
        } else {
            alert(t('max_images_alert'));
        }
        // Fayl input qiymatini tozalash (yana bir marta xuddi shu faylni tanlashga imkon berish uchun)
        event.target.value = null;
    };

    // Video tanlanganda ishlaydigan funksiya
    const handleVideoChange = (event) => {
        const file = event.target.files[0]; // Faqat birinchi faylni olamiz
        if (file) {
            setSelectedVideo({
                file: file,
                preview: URL.createObjectURL(file) // Ko'rish uchun vaqtinchalik URL
            });
        }
        event.target.value = null;
    };

    // Rasm yoki videoni o'chirish funksiyasi
    const handleRemoveFile = (type, index) => {
        if (type === 'image') {
            // O'chiriladigan rasmning URL'ni bo'shatamiz
            URL.revokeObjectURL(selectedImages[index].preview);
            setSelectedImages(prevImages => prevImages.filter((_, i) => i !== index));
        } else if (type === 'video') {
            // O'chiriladigan videoning URL'ni bo'shatamiz
            if (selectedVideo) {
                URL.revokeObjectURL(selectedVideo.preview);
            }
            setSelectedVideo(null);
        }
    };

    return (
        <div className='p-4 md:p-8 space-y-8'>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                <Link to="/" className="hover:text-blue-600 transition-colors capitalize">{t('dashboard')}</Link>
                <span className="text-slate-300">/</span>
                <span className="text-slate-900 dark:text-white capitalize">{t('my_results')}</span>
            </div>

            {/* --- Rasm Yuklash Qismi --- */}
            <div>
                <h2 className='text-lg font-bold mb-4 text-blue-500'>🖼️ {t('images')} ({selectedImages.length}/4)</h2>

                <div className='flex flex-wrap gap-4 items-start'>
                    {/* Yangi rasm tanlash tugmasi */}
                    {selectedImages.length < 4 && (
                        <button
                            className='w-40 h-32 border-2 border-dashed border-blue-500 text-blue-500 dark:border-blue-400 dark:text-blue-400 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30 transition'
                            onClick={() => document.getElementById('imageInput').click()}
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            <span className='mt-2 text-sm'>{t('select_image')}</span>
                            <input
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                id='imageInput'
                                multiple // Bir nechta fayl tanlashga ruxsat berish
                                onChange={handleImageChange}
                            />
                        </button>
                    )}

                    {/* Tanlangan rasmlarni ko'rsatish */}
                    {selectedImages.map((image, index) => (
                        <div key={index} className='relative w-40 h-32 rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700'>
                            <img
                                src={image.preview}
                                alt={`Tanlangan rasm ${index + 1}`}
                                className='w-full h-full object-cover'
                            />
                            {/* O'chirish tugmasi */}
                            <button
                                onClick={() => handleRemoveFile('image', index)}
                                className='absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 leading-none text-xs hover:bg-red-700 transition'
                                title="Rasmni o'chirish"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <hr className='border-gray-200 dark:border-gray-700' />

            {/* --- Video Yuklash Qismi --- */}
            <div>
                <h2 className='text-2xl font-bold mb-4 text-blue-500'>🎬 {t('video')} ({selectedVideo ? '1/1' : '0/1'})</h2>

                <div className='flex gap-4 items-start'>
                    {/* Yangi video tanlash tugmasi (agar video tanlanmagan bo'lsa) */}
                    {!selectedVideo && (
                        <button
                            className='w-40 h-32 border-2 border-dashed border-blue-500 text-blue-500 dark:border-blue-400 dark:text-blue-400 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30 transition'
                            onClick={() => document.getElementById('videoInput').click()}
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            <span className='mt-2 text-sm'>{t('select_video')}</span>
                            <input
                                type="file"
                                accept="video/*"
                                style={{ display: 'none' }}
                                id='videoInput'
                                onChange={handleVideoChange}
                            />
                        </button>
                    )}

                    {/* Tanlangan videoni ko'rsatish */}
                    {selectedVideo && (
                        <div className='relative w-72 h-40 rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700'>
                            <video
                                src={selectedVideo.preview}
                                controls
                                className='w-full h-full object-cover'
                            >
                                {t('video_not_supported')}
                            </video>
                            {/* O'chirish tugmasi */}
                            <button
                                onClick={() => handleRemoveFile('video')}
                                className='absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 leading-none text-xs hover:bg-red-700 transition'
                                title="Videoni o'chirish"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Results;