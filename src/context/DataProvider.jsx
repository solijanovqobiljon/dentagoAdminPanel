import React, { createContext, useState, useEffect, useContext } from 'react';
import { translations } from '../constants/translations';

// Boshlang'ich statik ma'lumotlar (simulyatsiya)
const initialData = {
    // Xodimlar ma'lumotlari
    staff: [
        { id: 1, fio: "Jahongir Ahmedov", position: "Shifokor", login: "jahongir", phone: "+998911977882", color: 'green', status: 'Faol' },
        { id: 2, fio: "Mateo Versace", position: "Texnik", login: "tech", phone: "+998991234567", color: 'blue', status: 'Faol' },
        { id: 3, fio: "Reception Center", position: "Qabulxona xodimi", login: "reception1", phone: "+998901112233", color: 'red', status: 'Faol' },
        { id: 4, fio: "Abduxalim To'xtayev", position: "Direktor", login: "test_admin", phone: "+998934445566", color: 'white', status: 'Faol' },
    ],
    // Bemorlar ma'lumotlari
    patients: [
        { id: 1, name: "Abdurahmon", familya: "Safarov", birthDate: "03.12.1999", phone: "998971234567", debt: "0 so'm", registrationDate: "26.09.2025", gender: 'Erkak', address: 'Surxondaryo viloyati' },
        { id: 2, name: "Jonibek", familya: "Tursunov", birthDate: "10.11.2000", phone: "998971923888", debt: "-250 000 so'm", registrationDate: "26.09.2025", gender: 'Erkak', address: 'Fargona viloyati' },
    ],
    dailyExpenses: [],
    expenseCategories: [
        { id: 1, name: "Oziq-ovqat" },
        { id: 2, name: "Transport" },
        { id: 3, name: "Kanselyariya" },
        { id: 4, name: "Kommunal" },
        { id: 5, name: "Boshqa" }
    ],

    // Davolashlar
    treatments: [
        { id: 101, patientId: 1, patientName: "Abdurahmon Safarov", phone: "998971234567", doctor: "Sunnatillo Istamov", date: "04.12.2025 16:00", status: "Yangi", debt: "0 so'm", paymentStatus: "To'lanmadi" },
        { id: 102, patientId: 2, patientName: "Jonibek Tursunov", phone: "998971923888", doctor: "Sunnatillo Istamov", date: "03.11.2025 00:00", status: "Shifokor yakunlandi", debt: "-200 000 so'm", paymentStatus: "To'lanmadi" },
    ],

    // Klinika ma'lumotlari
    clinicInfo: {
        id: 1,
        name: "Yangi Klinikangiz nomi",
        address: "Samarqand sh., Ulug'bek ko'chasi 1A",
        phone: "+998 90 123 45 67",
        email: "info@clinic.uz",
        bankDetails: "Hisob raqam: 20208000900000123456, MFO: 00424",
    },

    // SMS shablonlari
    smsTemplates: [
        {
            id: 75,
            name: "Bemorga kelish uchun eslatma",
            type: "Bemor qabuli",
            status: true,
            message: "Hurmatli {bemor}! Sizning qabulgilingiz {doctor} qabulida {clinic} da belgilangan. Qabul vaqti: {sana}. Iltimos, vaqtida tashrif buyuring.",
            variables: ['{bemor}', '{sana}', '{doctor}', '{clinic}'],
            createdAt: "16.10.2025 11:38",
            updatedAt: "12.12.2025 14:28"
        },
        {
            id: 76,
            name: "Tug'ilgan kun bilari",
            type: "Tug'ilgan kun",
            status: true,
            message: "Hurmatli {bemor}! Sizni tug'ilgan kuniningiz bilan chin qalbimizdan tabriklaymiz. {clinic} jamoasi.",
            variables: ['{bemor}', '{clinic}'],
            createdAt: "16.10.2025 11:40",
            updatedAt: "12.12.2025 14:30"
        },
    ],

    // SMS sozlamalari
    smsSettings: [
        {
            id: 1,
            clinicName: "Dental Soft Klinikasi",
            token: "ASDF123-ZXCV456-QWER789-MNBV012",
            updatedAt: "15.12.2025 14:00",
        },
    ],

    // Umumiy sozlamalar
    generalSettings: {
        id: 1,
        companyName: "Dental Soft Klinika",
        phone1: "+998 90 123 45 67",
        phone2: "+998 91 765 43 21",
        email: "info@dentalsoft.uz",
        address: "Toshkent sh., Yunusobod tumani, Amir Temur ko'chasi 16-uy",
        logoUrl: "/path/to/default/logo.png",
        lastUpdated: "15.12.2025 14:30"
    },

    // Lead kategoriyalari (settings bo'limidan olib chiqildi)
    leadCategories: [
        { id: 1, name: "Veb-sayt", status: true },
        { id: 2, name: "Instagram", status: true },
        { id: 3, name: "Yangi kelgan", status: true },
    ],

    // Kasalliklar (settings bo'limidan olib chiqildi)
    diseases: [
        { id: 1, name: "Karies", color: "#F05252", status: true },
        { id: 2, name: "Pulpit", color: "#3B82F6", status: true },
        { id: 3, name: "Periodontit", color: "#10B981", status: false },
    ],

    // Ombor ma'lumotlari (Takrorlangan unit/supplier lar birlashtirildi)
    storage: {
        documents: [
            { id: 1, name: "Asosiy shartnoma", supplier: "Global Pharma", date: "01.12.2025", filename: "contract_global_pharma.pdf" },
            { id: 2, name: "Litsenziya nusxasi", supplier: "—", date: "10.11.2025", filename: "license.jpg" },
        ],
        categories: [
            { id: 1, name: "Pechatkalar", status: true },
            { id: 2, name: "Iglalar", status: true },
        ],
        brands: [
            { id: 1, name: "Colgate", status: true },
            { id: 2, name: "3M Espe", status: false },
        ],
        products: [
            { id: 1, name: "Kariyes to'ldirgich", price: 150000, minQty: 5, maxQty: 50, brand: "3M Espe", category: "Pechatkalar", unit: "dona", quantity: 15, status: true },
        ],

        // ✨ Birlashtirilgan Units (O'lchov birliklari) ro'yxati
        units: [
            { id: 1, name: "dona", status: true },
            { id: 2, name: "quti", status: true },
            { id: 3, name: "korobka", status: true },
            { id: 4, name: "M", status: true },
            { id: 5, name: "L", status: true },
            { id: 6, name: "KG", status: true },
            { id: 7, name: "шт", status: true },
        ],

        // ✨ Birlashtirilgan Suppliers (Yetkazib beruvchilar) ro'yxati
        suppliers: [
            { id: 101, firstName: "Ali", lastName: "Valiyev", phone1: "+998 90 123 45 67", phone2: "", status: true, company: 'Yetkazib beruvchi A' },
            { id: 102, firstName: "Bahodir", lastName: "Ahmadov", phone1: "+998 99 987 65 43", phone2: "+998 97 777 77 77", status: true, company: 'Dental World' },
            { id: 103, firstName: "Dilfuza", lastName: "Karimova", phone1: "+998 88 555 55 55", phone2: "", status: false, company: 'Global Pharma' },
        ],
    },

    // Reklama ma'lumotlari
    advertisements: [
        { id: 1, title: "Yangi yil aksiyasi", content: "Davolash xizmatlariga 15% chegirma.", status: "active", date: "2025-12-01" },
        { id: 2, title: "Vrach qabuli", content: "Bepul diagnostika!", status: "inactive", date: "2025-11-15" },
    ],

    // E'lonlar (Announcements)
    announcements: [
        {
            id: 1,
            image: "https://via.placeholder.com/400x300",
            description: "Yangi xizmatlarimiz haqida ma'lumot! Tishlarni oqartirish xizmati 30% chegirma bilan.",
            paymentStatus: "To'landi",
            createdAt: "2025-12-10",
            expiresAt: "2025-12-17", // 7 kun
            isActive: true
        }
    ],

    // Xizmatlar
    services: [
        // Image 1
        { id: 1, name: "Test", price: "200 000 so'm", costPrice: "150 000 so'm", categoryId: 1, status: "Faol" },
        { id: 2, name: "Фиксация коронки на цемент (до 3-х зубов)", price: "50 000 so'm", costPrice: "", categoryId: 2, status: "Faol" },
        { id: 3, name: "Снятие коронки", price: "50 000 so'm", costPrice: "", categoryId: 3, status: "Faol" },
        { id: 4, name: "Индивидуальная ложка", price: "200 000 so'm", costPrice: "", categoryId: 3, status: "Faol" },
        { id: 5, name: "Починка съёмного протеза", price: "200 000 so'm", costPrice: "", categoryId: 3, status: "Faol" },
        { id: 6, name: "Протезы из полимерных материалов", price: "2 600 000 so'm", costPrice: "", categoryId: 3, status: "Faol" },
        { id: 7, name: "Микропротез (до 2-х зубов)", price: "450 000 so'm", costPrice: "", categoryId: 3, status: "Faol" },
        { id: 8, name: "Частичный съёмный пластмассовый протез", price: "500 000 so'm", costPrice: "", categoryId: 3, status: "Faol" },
        { id: 9, name: "Полный съёмный пластмассовый протез", price: "900 000 so'm", costPrice: "", categoryId: 3, status: "Faol" },
        { id: 10, name: "Штифт разборный", price: "250 000 so'm", costPrice: "", categoryId: 3, status: "Faol" },
        { id: 11, name: "Штифт цельнолитий", price: "300 000 so'm", costPrice: "0 so'm", categoryId: 3, status: "Faol" },
        { id: 12, name: "Цельнокерамическая вкладка", price: "2 000 000 so'm", costPrice: "", categoryId: 3, status: "Faol" },
        { id: 13, name: "Винир", price: "3 000 000 so'm", costPrice: "", categoryId: 3, status: "Faol" },
        { id: 14, name: "Цельнокерамическая коронка (e.max press) каронка на имплантах", price: "3 000 000 so'm", costPrice: "", categoryId: 3, status: "Faol" },
        { id: 15, name: "Временная CAD CAM PMMA карта на имплантах", price: "500 000 so'm", costPrice: "", categoryId: 3, status: "Faol" },
        { id: 16, name: "Металлопластмассовая коронка на имплантах", price: "400 000 so'm", costPrice: "", categoryId: 3, status: "Faol" },
        { id: 17, name: "Керамическая коронка с основой из диоксида циркония каронка на имплантах", price: "1 600 000 so'm", costPrice: "", categoryId: 3, status: "Faol" },
        { id: 18, name: "Металлокерамическая коронка на имплантах", price: "1 200 000 so'm", costPrice: "", categoryId: 3, status: "Faol" },
        { id: 19, name: "Металлокерамическая стандарт каронка на имплантах", price: "1 200 000 so'm", costPrice: "", categoryId: 3, status: "Faol" },
        { id: 20, name: "Пластмассовая коронка прямым методом", price: "100 000 so'm", costPrice: "", categoryId: 3, status: "Faol" },

        // Image 2
        { id: 21, name: "Временная коронка", price: "200 000 so'm", costPrice: "0", categoryId: 3, status: "Faol" },
        { id: 22, name: "Цельнокерамическая (e.max press) каронка", price: "2 600 000 so'm", costPrice: "", categoryId: 3, status: "Faol" },
        { id: 23, name: "Из диоксида циркония каронка без нанесения", price: "1 000 000 so'm", costPrice: "", categoryId: 3, status: "Faol" },
        { id: 24, name: "Из диоксида циркония каронка", price: "1 300 000 so'm", costPrice: "", categoryId: 3, status: "Faol" },
        { id: 25, name: "Из диоксида циркония стандарт каронки", price: "1 000 000 so'm", costPrice: "", categoryId: 3, status: "Faol" },
        { id: 26, name: "Металлопластмассовая каронка", price: "300 000 so'm", costPrice: "", categoryId: 3, status: "Faol" },
        { id: 27, name: "Металлокерамическая каронка", price: "850 000 so'm", costPrice: "", categoryId: 3, status: "Faol" },
        { id: 28, name: "Металлокерамическая стандарт каронка", price: "700 000 so'm", costPrice: "", categoryId: 2, status: "Faol" },
        { id: 29, name: "Рентгеновский снимок", price: "0 so'm", costPrice: "", categoryId: 2, status: "Faol" },
        { id: 30, name: "Развернутая консультация", price: "150 000 so'm", costPrice: "", categoryId: 2, status: "Faol" },
        { id: 31, name: "Консультация", price: "50 000 so'm", costPrice: "", categoryId: 2, status: "Faol" },
        { id: 32, name: "Отбеливание зубов", price: "3 200 000 so'm", costPrice: "", categoryId: 4, status: "Faol" },
        { id: 33, name: "Лечение молочного зуба", price: "250 000 so'm", costPrice: "", categoryId: 4, status: "Faol" },
        { id: 34, name: "Распломбировка одного корневого канала", price: "60 000 so'm", costPrice: "", categoryId: 4, status: "Faol" },
        { id: 35, name: "Снятие чувствительности (1 зуб)", price: "50 000 so'm", costPrice: "", categoryId: 4, status: "Faol" },
        { id: 36, name: "Экстренная помощь (при острых болях)", price: "100 000 so'm", costPrice: "", categoryId: 4, status: "Faol" },
        { id: 37, name: "Шинирование зуба с помощью гибкой керамической системы", price: "500 000 so'm", costPrice: "", categoryId: 4, status: "Faol" },
        { id: 38, name: "Временная пломба", price: "50 000 so'm", costPrice: "", categoryId: 4, status: "Faol" },
        { id: 39, name: "Наложение лечебного материала в корневой канал", price: "60 000 so'm", costPrice: "", categoryId: 4, status: "Faol" },
        { id: 40, name: "Пломбировка более трех каналов", price: "350 000 so'm", costPrice: "", categoryId: 4, status: "Faol" },

        // Image 3
        { id: 41, name: "Пломбировка Трех каналов", price: "300 000 so'm", costPrice: "", categoryId: 4, status: "Faol" },
        { id: 42, name: "Пломбировка Двух каналов", price: "250 000 so'm", costPrice: "", categoryId: 4, status: "Faol" },
        { id: 43, name: "Пломбировка Одного канала", price: "200 000 so'm", costPrice: "", categoryId: 4, status: "Faol" },
        { id: 44, name: "Светоотверждаемый композит премиум (3фронтальных зубов)", price: "600 000 so'm", costPrice: "", categoryId: 4, status: "Faol" },
        { id: 45, name: "Светоотверждаемый композит премиум (2фронтальных зубов)", price: "500 000 so'm", costPrice: "", categoryId: 4, status: "Faol" },
        { id: 46, name: "Светоотверждаемый композит премиум (1фронтальных зубов)", price: "300 000 so'm", costPrice: "", categoryId: 4, status: "Faol" },
        { id: 47, name: "Светоотверждаемый композит премиум (3 поверхность зуба)", price: "500 000 so'm", costPrice: "", categoryId: 4, status: "Faol" },
        { id: 48, name: "Светоотверждаемый композит премиум (2 поверхность зуба)", price: "400 000 so'm", costPrice: "", categoryId: 4, status: "Faol" },
        { id: 49, name: "Светоотверждаемый композит премиум (1 поверхность зуба)", price: "350 000 so'm", costPrice: "", categoryId: 4, status: "Faol" },
        { id: 50, name: "Светоотверждаемый композит (3 поверхности зуба)", price: "300 000 so'm", costPrice: "", categoryId: 4, status: "Faol" },
        { id: 51, name: "Светоотверждаемый композит (2 поверхности зуба)", price: "250 000 so'm", costPrice: "", categoryId: 4, status: "Faol" },
        { id: 52, name: "Светоотверждаемый композит (1 поверхность зуба)", price: "200 000 so'm", costPrice: "", categoryId: 4, status: "Faol" },
        { id: 53, name: "Анкерный титановый штифт Dentsply 1шт.", price: "100 000 so'm", costPrice: "", categoryId: 4, status: "Faol" },
        { id: 54, name: "Стекловолоконный штифт с фиксацией на цемент", price: "100 000 so'm", costPrice: "", categoryId: 2, status: "Faol" },
        { id: 55, name: "Стеклоиномерный цемент 'GC Fuji'", price: "100 000 so'm", costPrice: "", categoryId: 2, status: "Faol" },
        { id: 56, name: "Наложение изолирующей прокладки 'Optibond FL'", price: "50 000 so'm", costPrice: "", categoryId: 2, status: "Faol" },
        { id: 57, name: "Установка Коффердама", price: "50 000 so'm", costPrice: "", categoryId: 2, status: "Faol" },
        { id: 58, name: "Оптрагейт", price: "50 000 so'm", costPrice: "", categoryId: 2, status: "Faol" },
        { id: 59, name: "Профессиональная чистка + полировка за 1 зуба", price: "20 000 so'm", costPrice: "", categoryId: 4, status: "Faol" },
        { id: 60, name: "Профессиональная чистка полости рта + AIR FLOW и полировка (верхняя и нижняя челюсть)", price: "450 000 so'm", costPrice: "", categoryId: 4, status: "Faol" },

        // Image 4
        { id: 61, name: "Профессиональная чистка полости рта и полировка (верхняя и нижняя челюсть)", price: "300 000 so'm", costPrice: "0", categoryId: 4, status: "Faol" },
        { id: 62, name: "Установка имплантата премиум класса (Nobel Biocare Straumann)", price: "6 000 000 so'm", costPrice: "", categoryId: 5, status: "Faol" },
        { id: 63, name: "Установка имплантата AnyRidge", price: "4 000 000 so'm", costPrice: "", categoryId: 5, status: "Faol" },
        { id: 64, name: "Установка имплантата Osstem", price: "3 000 000 so'm", costPrice: "", categoryId: 5, status: "Faol" },
        { id: 65, name: "Имплантация зубов (включает стоимость имплантата)", price: "500 000 so'm", costPrice: "", categoryId: 5, status: "Faol" },
        { id: 66, name: "Увеличение объема прикрепленной десны в зоне одного зуба", price: "500 000 so'm", costPrice: "", categoryId: 6, status: "Faol" },
        { id: 67, name: "Устранение рецессии десны в зоне 1-2 зубов", price: "900 000 so'm", costPrice: "", categoryId: 6, status: "Faol" },
        { id: 68, name: "Увеличение объёма десны", price: "400 000 so'm", costPrice: "", categoryId: 6, status: "Faol" },
        { id: 69, name: "Пластика уздечки губы или языка", price: "300 000 so'm", costPrice: "", categoryId: 6, status: "Faol" },
        { id: 70, name: "Зубосохраняющие операции (резекция верхушки корня, гемисекция)", price: "500 000 so'm", costPrice: "", categoryId: 6, status: "Faol" },
        { id: 71, name: "Удаление клинической коронки зуба", price: "300 000 so'm", costPrice: "", categoryId: 6, status: "Faol" },
        { id: 72, name: "Закрытие соустья гайморовой пазухи после удаления", price: "700 000 so'm", costPrice: "", categoryId: 6, status: "Faol" },
        { id: 73, name: "Удаление радикальной кисты или инородного тела из гайморовой пазухи", price: "1 000 000 so'm", costPrice: "", categoryId: 6, status: "Faol" },
        { id: 74, name: "Наложение швов", price: "75 000 so'm", costPrice: "", categoryId: 6, status: "Faol" },
        { id: 75, name: "Обработка раны", price: "50 000 so'm", costPrice: "", categoryId: 6, status: "Faol" },
        { id: 76, name: "Лечебный материал для профилактики осложнений после удаления", price: "25 000 so'm", costPrice: "", categoryId: 6, status: "Faol" },
        { id: 77, name: "Удаление Ретинированных дистопированных зубов", price: "450 000 so'm", costPrice: "", categoryId: 6, status: "Faol" },
        { id: 78, name: "Удаление Зуба мудрости", price: "200 000 so'm", costPrice: "", categoryId: 6, status: "Faol" },
        { id: 79, name: "Удаление Сложное", price: "300 000 so'm", costPrice: "", categoryId: 6, status: "Faol" },
        { id: 80, name: "Удаление Простое", price: "150 000 so'm", costPrice: "", categoryId: 6, status: "Faol" },

        // Image 5
        { id: 81, name: "Удаление Подвижного зуба", price: "100 000 so'm", costPrice: "0", categoryId: 6, status: "Faol" },
        { id: 82, name: "Анестезия (карпульный анестетик)", price: "50 000 so'm", costPrice: "", categoryId: 4, status: "Faol" },
        { id: 83, name: "Депрограмматор Коиса", price: "400 000 so'm", costPrice: "", categoryId: 7, status: "Faol" },
        { id: 84, name: "Сплинты декомпрессионные", price: "600 000 so'm", costPrice: "", categoryId: 7, status: "Faol" },
        { id: 85, name: "Сплинты репозицирующие", price: "600 000 so'm", costPrice: "", categoryId: 7, status: "Faol" },
        { id: 86, name: "Лечение ВНЧС", price: "3 000 000 so'm", costPrice: "", categoryId: 7, status: "Faol" },
        { id: 87, name: "Подбородочная праша", price: "500 000 so'm", costPrice: "", categoryId: 7, status: "Faol" },
        { id: 88, name: "Шейная повязка", price: "1 000 000 so'm", costPrice: "", categoryId: 7, status: "Faol" },
        { id: 89, name: "Лицевая маска face mask", price: "1 200 000 so'm", costPrice: "", categoryId: 7, status: "Faol" },
        { id: 90, name: "Ретенционный аппарат - каппа прозрачная на один челюсть", price: "350 000 so'm", costPrice: "", categoryId: 7, status: "Faol" },
        { id: 91, name: "Ретенционный аппарат Hawley на один челюсть", price: "1 000 000 so'm", costPrice: "", categoryId: 7, status: "Faol" },
        { id: 92, name: "Ретенционный аппарат Wrap-around на один челюсть", price: "1 000 000 so'm", costPrice: "", categoryId: 7, status: "Faol" },
        { id: 93, name: "Установка ритейнеры (6 зубов)", price: "300 000 so'm", costPrice: "", categoryId: 7, status: "Faol" },
        { id: 94, name: "Снятие брекет системы", price: "300 000 so'm", costPrice: "", categoryId: 7, status: "Faol" },
        { id: 95, name: "Ортодонтические микроимпланты", price: "700 000 so'm", costPrice: "", categoryId: 7, status: "Faol" },
        { id: 96, name: "Коррекция и активации", price: "50 000 so'm", costPrice: "", categoryId: 7, status: "Faol" },
        { id: 97, name: "Капы Invisalign", price: "25 000 000 so'm", costPrice: "", categoryId: 7, status: "Faol" },
        { id: 98, name: "Лечение на Элайнерах", price: "12 000 000 so'm", costPrice: "", categoryId: 7, status: "Faol" },
        { id: 99, name: "Самолигирующие комбинированные брекеты", price: "8 000 000 so'm", costPrice: "", categoryId: 7, status: "Faol" },
        { id: 100, name: "Сапфир+Метал", price: "7 500 000 so'm", costPrice: "", categoryId: 9, status: "Faol" },
        // Image New (101-119)
        { id: 101, name: "Сапфирные брекеты", price: "9 000 000 so'm", costPrice: "0", categoryId: 9, status: "Faol" },
        { id: 102, name: "Металические брекеты", price: "6 500 000 so'm", costPrice: "", categoryId: 9, status: "Faol" },
        { id: 103, name: "Аппарат Планас с винтом Бертони", price: "1 800 000 so'm", costPrice: "", categoryId: 9, status: "Faol" },
        { id: 104, name: "Функциональный аппарат Френкля", price: "1 600 000 so'm", costPrice: "", categoryId: 9, status: "Faol" },
        { id: 105, name: "Функциональный аппарат Арагао", price: "1 600 000 so'm", costPrice: "", categoryId: 9, status: "Faol" },
        { id: 106, name: "Функциональный аппарат Планса", price: "1 600 000 so'm", costPrice: "", categoryId: 9, status: "Faol" },
        { id: 107, name: "Держатель место передних зубов Space maintainer", price: "600 000 so'm", costPrice: "", categoryId: 9, status: "Faol" },
        { id: 108, name: "Бампер для губ Lip bumper", price: "600 000 so'm", costPrice: "", categoryId: 9, status: "Faol" },
        { id: 109, name: "Лингвальная дуга", price: "600 000 so'm", costPrice: "", categoryId: 9, status: "Faol" },
        { id: 110, name: "Транснёбная дуга TPA", price: "600 000 so'm", costPrice: "", categoryId: 9, status: "Faol" },
        { id: 111, name: "Несъёмный расширитель Hyrex", price: "1 600 000 so'm", costPrice: "", categoryId: 9, status: "Faol" },
        { id: 112, name: "Несъёмный расширитель Marco Rossa", price: "1 600 000 so'm", costPrice: "", categoryId: 9, status: "Faol" },
        { id: 113, name: "Несъёмный расширитель Haas", price: "1 200 000 so'm", costPrice: "", categoryId: 9, status: "Faol" },
        { id: 114, name: "Съёмный толкатель (с обычным винтом Leone)", price: "1 100 000 so'm", costPrice: "", categoryId: 9, status: "Faol" },
        { id: 115, name: "Съёмный толкатель (простой тип)", price: "1 100 000 so'm", costPrice: "", categoryId: 9, status: "Faol" },
        { id: 116, name: "Съёмный расширитель (с обычным винтом Leone)", price: "1 100 000 so'm", costPrice: "", categoryId: 8, status: "Faol" },
        { id: 117, name: "Съёмный расширитель (простой тип)", price: "1 100 000 so'm", costPrice: "", categoryId: 9, status: "Faol" },
        { id: 118, name: "Диагностика и планирование лечения ортодонта", price: "200 000 so'm", costPrice: "", categoryId: 9, status: "Faol" },
        { id: 119, name: "Первичная консультация ортодонта", price: "50 000 so'm", costPrice: "", categoryId: 9, status: "Faol" },
    ],
    serviceCategories: [
        { id: 1, name: "Plonba", status: "Faol", color: "#3B82F6" },
        { id: 2, name: "Blomba qilish", status: "Faol", color: "#F59E0B" },
        { id: 3, name: "Tish olish", status: "Faol", color: "#EF4444" },
        { id: 4, name: "ДОПОЛНИТЕЛЬНО", status: "Faol", color: "#8B5CF6" },
        { id: 5, name: "ИМПЛАНТАЦИЯ", status: "Faol", color: "#10B981" },
        { id: 6, name: "Хирургия", status: "Faol", color: "#F97316" },
        { id: 7, name: "Лечение", status: "Faol", color: "#6366F1" },
        { id: 8, name: "ОРТОПЕДИЯ", status: "Faol", color: "#EC4899" },
        { id: 9, name: "ОРТОДОНТИЯ", status: "Faol", color: "#14B8A6" },
    ],

    // To'lovlar
    payments: [
        { id: 1, patientId: 1, amount: "100 000", type: "Naqd", date: "15.12.2025", comment: "Oldindan to'lov" },
    ],

    // Xodimlar (Dropdown uchun)
    staff: [
        { id: 1, name: "Jahongir Ahmedov", role: "Stomatolog", type: "fixed" },
        { id: 2, name: "Mateo Versace", role: "Texnik", type: "percent" },
        { id: 3, name: "Dr. House", role: "Terapevt", type: "fixed" },
        { id: 4, name: "Abduxalim To'xtayev", role: "Direktor", type: "percent" },
        { id: 5, name: "Shaxzoda Karimova", role: "Hamshira", type: "fixed" }
    ],

    // Xodimlarga biriktirilgan xizmatlar (Service Assignments)
    serviceAssignments: [
        // Example: { id: 1, serviceId: 101, staffId: 1, type: "percent", value: 15 } 
    ],

    // ✨ YANGI QISM: BTS (Zubtexnik Buyurtma Tizimi) uchun ma'lumotlar
    orderStatuses: [
        { id: 1, name: "Yangi", color: "gray-500", step: 1 },
        { id: 2, name: "Jarayonda (Ishlash)", color: "blue-500", step: 2 },
        { id: 3, name: "Sifat Tekshiruvi", color: "yellow-500", step: 3 },
        { id: 4, name: "Tayyor/Yetkazib Berildi", color: "green-500", step: 4 },
        { id: 5, name: "Qaytarildi (Defekt)", color: "red-500", step: 5 },
    ],
    // Kurslar
    courses: [
        {
            id: 1,
            name: "Zamonaviy Endodontiya",
            teacher: "Dr. Alisher Valiyev",
            price: "1 500 000 so'm",
            image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2070&auto=format&fit=crop",
            comments: [
                { id: 1, user: "Bahodir", text: "Juda foydali kurs ekan!", date: "2025-12-10" }
            ]
        },
        {
            id: 2,
            name: "Ortopedik Stomatologika Asoslari",
            teacher: "Prof. Jamshid Karimov",
            price: "2 200 000 so'm",
            image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=2074&auto=format&fit=crop",
            comments: []
        }
    ],
    // Mahsulotlar sarfi
    productUsage: [
        {
            id: 1,
            doctorId: 1,
            doctorName: "Dr. Alisher Valiyev",
            patientId: 101,
            patientName: "Bahodir Toshmatov",
            productId: 501,
            productName: "Shpris (5ml)",
            quantity: "2 dona",
            date: "2025-12-18"
        },
        {
            id: 2,
            doctorId: 2,
            doctorName: "Dr. Malika Ahmedova",
            patientId: 102,
            patientName: "Gulnora Karimova",
            productId: 502,
            productName: "Tibbiy qo'lqop",
            quantity: "1 juft",
            date: "2025-12-18"
        }
    ],
    // ✨ YANGI QISM: Buyurtmalar
    btsOrders: [
        {
            id: 1,
            title: "Yuqori jag'ga keramik kron",
            doctor: "Jahongir Ahmedov (ID:1)",
            patientName: "Abdurahmon Safarov",
            technician: "Mateo Versace (ID:2)",
            dateCreated: "2025-12-14",
            dateDue: "2025-12-20",
            statusId: 2, // Jarayonda
            price: 500000,
            paymentStatus: "To'lanmadi",
            comments: "Rangi A2. Qat'iy o'lchamga rioya qiling.",
            materials: [
                { name: "Keramika bloki", qty: 1, unit: "dona" },
                { name: "Sementlash vositasi", qty: 0.5, unit: "ml" },
            ]
        },
        {
            id: 2,
            title: "Pastki jag'da metall kasting",
            doctor: "Abduxalim To'xtayev (ID:4)",
            patientName: "Jonibek Tursunov",
            technician: "Mateo Versace (ID:2)",
            dateCreated: "2025-12-10",
            dateDue: "2025-12-15",
            statusId: 4, // Tayyor/Yetkazib Berildi
            price: 150000,
            paymentStatus: "To'landi",
            comments: "Oddiy kasting, tezlashtirilgan tartibda.",
            materials: []
        },
    ],
    // User profile data
    user: {
        id: "133",
        name: "Abduxalim",
        surname: "To'xtayev",
        role: "Direktor",
        login: "test_admin",
        image: null,
        createdAt: "11.09.2025 21:12",
        updatedAt: "26.09.2025 16:40"
    }
};

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {

    // Til va Mavzu holatlari
    const [locale, setLocale] = useState(localStorage.getItem('app_locale') || 'uz');
    const [theme, setTheme] = useState(localStorage.getItem('app_theme') || 'light');

    // Auth State
    const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('auth_token') === 'simulated_token');

    const login = (username, password) => {
        if (username === 'admin' && password === '123') {
            localStorage.setItem('auth_token', 'simulated_token');
            setIsAuthenticated(true);
            return true;
        }
        return false;
    };

    const logout = () => {
        localStorage.removeItem('auth_token');
        setIsAuthenticated(false);
    };

    // Translation helper
    const t = (key) => {
        return translations[locale][key] || key;
    };

    // ... useEffect lar (locale, theme, data uchun) ...
    useEffect(() => {
        localStorage.setItem('app_locale', locale);
    }, [locale]);

    useEffect(() => {
        localStorage.setItem('app_theme', theme);
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    const switchLocale = (newLocale) => {
        setLocale(newLocale);
    };

    const switchTheme = (newTheme) => {
        setTheme(newTheme);
    };

    // Ma'lumotlarni Local Storage'dan yuklash
    const [data, setData] = useState(() => {
        const localData = localStorage.getItem('clinic_app_data');
        if (localData) {
            try {
                const parsedData = JSON.parse(localData);
                // Data integrity check: Ensure 'user' is an object, not an array (fix for previous bug)
                if (Array.isArray(parsedData.user) || !parsedData.user) {
                    parsedData.user = initialData.user || {
                        id: "133",
                        name: "Abduxalim",
                        surname: "To'xtayev",
                        role: "Direktor",
                        login: "test_admin",
                        image: null,
                        createdAt: "11.09.2025 21:12",
                        updatedAt: "26.09.2025 16:40"
                    };
                }
                // Force update services and categories to match latest codebase version
                parsedData.services = initialData.services;
                parsedData.serviceCategories = initialData.serviceCategories;

                return parsedData;
            } catch (e) {
                console.error("Local storage ma'lumotlarini o'qishda xato:", e);
                return initialData;
            }
        }
        return initialData;
    });

    useEffect(() => {
        localStorage.setItem('clinic_app_data', JSON.stringify(data));
    }, [data]);

    // Umumiy CRUD funksiyasi
    const updateData = (type, item, action = 'ADD') => {
        setData(prevData => {
            const keys = type.split('.');
            let current = prevData;
            let targetKey = keys[keys.length - 1];

            if (keys.length > 1) {
                for (let i = 0; i < keys.length - 1; i++) {
                    current = current[keys[i]] || {};
                }
            } else {
                current = prevData;
            }

            let list = current[targetKey] || [];

            if (Array.isArray(list)) {
                let newList;

                if (action === 'ADD') {
                    const newId = list.length > 0 ? Math.max(...list.map(i => i.id)) + 1 : 1;
                    newList = [...list, { ...item, id: newId }];
                } else if (action === 'UPDATE') {
                    newList = list.map(i => (i.id === item.id ? { ...i, ...item } : i));
                } else if (action === 'DELETE') {
                    newList = list.filter(i => i.id !== item.id);
                } else {
                    return prevData;
                }

                if (keys.length > 1) {
                    const updatedInner = { ...current, [targetKey]: newList };
                    let updatedOuter = { ...prevData };
                    updatedOuter[keys[0]] = updatedInner;
                    if (keys.length === 2) {
                        return { ...prevData, [keys[0]]: updatedInner };
                    }
                    return prevData;
                }
                return { ...prevData, [type]: newList };
            }

            if (current[type] && typeof current[type] === 'object' && !Array.isArray(current[type])) {
                if (action === 'UPDATE' || action === 'ADD') {
                    return { ...prevData, [type]: { ...current[type], ...item } };
                }
            }
            return prevData;
        });
    };

    const addStaff = (staffDetails) => updateData('staff', { ...staffDetails, status: 'Faol' }, 'ADD');
    const updateStaff = (id, newDetails) => updateData('staff', { id, ...newDetails }, 'UPDATE');
    const updateStaffPassword = (id, newPassword) => console.log(`Xodim ID: ${id} paroli yangilandi: ${newPassword}`);

    const addTreatment = (patientId, treatmentDetails) => {
        const newId = data.treatments.length > 0 ? Math.max(...data.treatments.map(t => t.id)) + 1 : 1;
        const patient = data.patients.find(p => p.id === patientId);
        if (!patient) return;

        const newTreatment = {
            id: newId,
            patientId: patientId,
            patientName: `${patient.name} ${patient.familya}`,
            phone: patient.phone,
            doctor: treatmentDetails.doctor,
            date: new Date().toLocaleDateString('uz-UZ', { month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(',', ''),
            status: "Yangi",
            debt: treatmentDetails.debt || "0 so'm",
            paymentStatus: "To'lanmadi",
        };

        setData(prevData => ({ ...prevData, treatments: [...prevData.treatments, newTreatment] }));
    }

    const addAdvertisement = (newAd) => {
        setData(prevData => ({
            ...prevData,
            advertisements: [...prevData.advertisements, { id: Date.now(), status: 'active', date: new Date().toISOString().split('T')[0], ...newAd }]
        }));
    };

    const addOrder = (orderDetails) => {
        setData(prevData => {
            const list = Array.isArray(prevData.btsOrders) ? prevData.btsOrders : [];
            const newId = list.length > 0 ? Math.max(...list.map(i => i.id)) + 1 : 1;
            const newOrder = { id: newId, statusId: 1, dateCreated: new Date().toISOString().split('T')[0], paymentStatus: "To'lanmadi", ...orderDetails };
            return { ...prevData, btsOrders: [...list, newOrder] };
        });
    };

    const updateOrderStatus = (orderId, newStatusId) => {
        setData(prevData => ({
            ...prevData,
            btsOrders: prevData.btsOrders.map(order => order.id === orderId ? { ...order, statusId: newStatusId } : order),
        }));
    };

    return (
        <DataContext.Provider value={{
            data,
            updateData,
            addTreatment,
            addStaff,
            updateStaff,
            updateStaffPassword,
            addAdvertisement,
            addOrder,
            updateOrderStatus,
            locale,
            switchLocale,
            theme,
            switchTheme,
            t,
            isAuthenticated,
            login,
            logout
        }}>
            {children}
        </DataContext.Provider>
    );
};
