import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { DataProvider, useData } from './context/DataProvider';

// Layout Components
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';

// Components
import DashboardContent from './components/DashboardContent';
import CalendarContent from './components/CalendarContent';
import StaffContent from './components/StaffContent';
import ServicesContent from './components/ServicesContent';
import ServiceCategoryContent from './components/ServiceCategoryContent';
import ServicesListViewContent from './components/ServicesListViewContent';
import TreatmentsContent from './components/TreatmentsContent';
import TreatmentSchedulingContent from './components/TreatmentSchedulingContent';
import PatientsContent from './components/PatientsContent';
import PatientDetailView from "./components/PatientDetailView";
import DebtTreatmentsContent from './components/DebtTreatmentsContent';
import PaymentsContent from './components/PaymentsContent';
import LeadStatisticsContent from './components/LeadStatisticsContent';
import DoctorDailyReportsContent from './components/DoctorDailyReportsContent';
import GiveMoneyToDoctorsContent from './components/GiveMoneyToDoctorsContent';
import DailyExpensesContent from './components/DailyExpensesContent';
import DailyExpenseCategoriesContent from './components/DailyExpenseCategoriesContent';
import ClinicInfoContent from './components/ClinicInfoContent';
import SmsTemplatesContent from './components/SmsTemplatesContent';
import SmsSettingsContent from './components/SmsSettingsContent';
import GeneralSettingsContent from './components/GeneralSettingsContent';
import DiseasesContent from './components/DiseasesContent';
import LeadCategoriesContent from './components/LeadCategoriesContent';
import ManualContent from './components/ManualContent';
import DocumentsContent from './components/storage/DocumentsContent';
import ProductsContent from './components/storage/ProductsContent';
import CategoriesContent from './components/storage/CategoriesContent';
import BrandsContent from './components/storage/BrandsContent';
import UnitsContent from './components/storage/UnitsContent';
import SuppliersContent from './components/storage/SuppliersContent';
import AdvertisingContent from './components/AdvertisingContent';
import AnnouncementsContent from './components/AnnouncementsContent';
import ProductUsageContent from './components/storage/ProductUsageContent';
import OrderList from './components/pages/BTS/OrderList';
import { Result } from 'antd';
import Results from './components/Results';
import ProfileContent from './components/ProfileContent';
import AppPaymentsContent from './components/AppPaymentsContent';
import TariffsContent from './components/TariffsContent';
import ServiceAssignmentContent from './components/ServiceAssignmentContent';
import CoursesContent from './components/CoursesContent';
import Login from './components/Login';
import { Link } from 'lucide-react';


// Route Configuration
const routeConfig = {
  '/taqvim': "calendar",
  '/klinika/xodimlar': "staff",
  '/klinika/xizmatlar-card': "services_card",
  '/klinika/xizmatlar-kategoriyalari': "service_categories",
  '/klinika/xizmatlar': "services",
  '/klinika/davolashlar': "treatments",
  '/klinika/davolashni-rejalashtirish': "treatment_planning",
  '/klinika/bemorlar': "patients",
  '/klinika/malumotlar': "clinic_data",
  '/klinika/qarzdor-davolashlar': "debt_treatments",
  "/hisobot/to'lovlar": "payments",
  '/hisobot/lead-statistika': "lead_statistics",
  '/hisobot/doktor-hisobotlari': "doc_daily_reports",
  '/hisobot/doktorlarga-pul-berish': "give_money_docs",
  '/hisobot/kunilik-xarajatlar': "daily_expenses",
  '/hisobot/kunilik-xarajatlar-kategoriyalari': "daily_expense_categories",
  '/sms/shablonlar': "sms_templates",
  '/sms/sozlamalar': "sms_settings",
  '/settings/general': "general_settings",
  '/settings': "general_settings",
  '/settings/lead-categories': "lead_categories",
  '/settings/diseases': "diseases",
  '/settings/advertising': "ad_settings",
  '/settings/announcements': "announcements",
  '/manual': "manual",
  '/storage/documents': "documents",
  '/storage/products': "products",
  '/storage/categories': "categories",
  '/storage/brands': "brands",
  '/storage/units': "units",
  '/storage/suppliers': "suppliers",
  '/storage': "warehouse",
  '/pages/BTS/orders': "orders_bts",
  '/orders': "orders_bts",
  '/result': "my_results",
  '/profile': "profile",
  '/payments/app': "app_payments",
  '/payments/tariffs': "tariffs",
  '/courses': "courses_title",
  '/storage/usage': "product_usage"
};

const getPageTitle = (pathname) => {
  if (pathname === '/') return "dashboard";
  if (pathname.includes('/assign')) return "link_service";

  // Exact match
  if (routeConfig[pathname]) return routeConfig[pathname];

  // Starts with match (for detail pages or nested routes)
  const sortedKeys = Object.keys(routeConfig).sort((a, b) => b.length - a.length);
  for (const key of sortedKeys) {
    if (pathname.startsWith(key)) {
      return routeConfig[key];
    }
  }

  return "dashboard";
};

const MainLayout = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const location = useLocation();
  const pageKey = getPageTitle(location.pathname);
  const { theme, isAuthenticated, t } = useData();

  // MANA SHU QISIM: Mavzu o'zgarganda butun sahifani (html) yangilaydi
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  return (
    <div className={`flex min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      <main className="flex-1 overflow-x-hidden">
        <Header
          setIsSidebarOpen={setIsSidebarOpen}
          isSidebarOpen={isSidebarOpen}
          currentPage={t(pageKey)}
        />

        <Routes>
          <Route path="/" element={<DashboardContent />} />
          <Route path="/taqvim" element={<CalendarContent />} />
          <Route path="/queue" element={<div className="p-8">Navbat sahifasi</div>} />
          <Route path="*" element={<div className="p-8 text-center text-xl font-bold">404 Sahifa topilmadi</div>} />
          <Route path="/klinika/xodimlar" element={<StaffContent />} />
          <Route path="/klinika/xizmatlar-card" element={<ServicesContent />} />
          <Route path="/klinika/xizmatlar-kategoriyalari" element={<ServiceCategoryContent />} />
          <Route path="/klinika/xizmatlar" element={<ServicesListViewContent />} />
          <Route path="/klinika/xizmatlar/:id/assign" element={<ServiceAssignmentContent />} />
          <Route path="/klinika/davolashlar" element={<TreatmentsContent />} />
          <Route path="/klinika/davolashni-rejalashtirish" element={<TreatmentSchedulingContent />} />
          <Route path="/klinika/bemorlar" element={<PatientsContent />} />
          <Route path="/klinika/malumotlar" element={<ClinicInfoContent />} />
          <Route path="/klinika/bemorlar/detail/:id" element={<PatientDetailView />} />
          <Route path="/klinika/qarzdor-davolashlar" element={<DebtTreatmentsContent />} />

          <Route path="/hisobot/to'lovlar" element={<PaymentsContent />} />
          <Route path="/hisobot/lead-statistika" element={<LeadStatisticsContent />} />
          <Route path="/hisobot/doktor-hisobotlari" element={<DoctorDailyReportsContent />} />
          <Route path="/hisobot/doktorlarga-pul-berish" element={<GiveMoneyToDoctorsContent />} />
          <Route path="/hisobot/kunilik-xarajatlar" element={<DailyExpensesContent />} />
          <Route path="/hisobot/kunilik-xarajatlar-kategoriyalari" element={<DailyExpenseCategoriesContent />} />

          <Route path="/sms/shablonlar" element={<SmsTemplatesContent />} />
          <Route path="/sms/sozlamalar" element={<SmsSettingsContent />} />

          <Route path="/settings/general" element={<GeneralSettingsContent />} />
          <Route path="/settings/lead-categories" element={<LeadCategoriesContent />} />
          <Route path="/settings/diseases" element={<DiseasesContent />} />
          <Route path="/settings" element={<GeneralSettingsContent />} />
          <Route path="/settings/advertising" element={<AdvertisingContent />} />
          <Route path="/settings/announcements" element={<AnnouncementsContent />} />
          <Route path="/manual" element={<ManualContent />} />

          <Route path="/storage/documents" element={<DocumentsContent />} />
          <Route path="/storage/products" element={<ProductsContent />} />
          <Route path="/storage/categories" element={<CategoriesContent />} />
          <Route path="/storage/brands" element={<BrandsContent />} />
          <Route path="/storage/units" element={<UnitsContent />} />
          <Route path="/storage/suppliers" element={<SuppliersContent />} />
          <Route path="/storage/usage" element={<ProductUsageContent />} />
          <Route path="/storage" element={<ProductsContent />} />

          <Route path="/orders" element={<OrderList />} />
          <Route path="/profile" element={<ProfileContent />} />
          <Route path="/payments/app" element={<AppPaymentsContent />} />
          <Route path="/payments/tariffs" element={<TariffsContent />} />

          <Route path="/result" element={<Results />} />
          <Route path="/courses" element={<CoursesContent />} />
        </Routes>
      </main>
    </div>
  );
}


function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <DataProvider>
      <MainLayout isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      <a href="https://t.me/dentalsoft_uz" target="_blank" rel="noopener noreferrer" className="fixed bottom-5 right-5 z-50 w-14 h-14 flex items-center justify-center bg-blue-600 rounded-full cursor-pointer shadow-lg">
        <Link className='text-white' />
      </a>
    </DataProvider>
  );
}

export default App;
