// App.js 
import React, { useState, useEffect, useRef, createContext, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  ActivityIndicator,
  Dimensions,
  Animated as RNAnimated,
  ScrollView,
  Alert,
  BackHandler,
  SafeAreaView,
  Modal,
  Share,
  Platform,
  Linking,
  Clipboard,
  StyleSheet,
  KeyboardAvoidingView,
  I18nManager,
  AppState
} from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ImageViewer from 'react-native-image-zoom-viewer';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Line, Text as SvgText, G, Circle, Rect } from 'react-native-svg';


/* --------------- غیرفعال کردن RTL در کل برنامه --------------- */
I18nManager.allowRTL(false);
I18nManager.forceRTL(false);

/* --------------- تنظیمات منابع ایرانی --------------- */
const CSV_API_URL = "https://ama-co.com/app/api/products.php";
const CERTIFICATES_CSV_URL = "https://ama-co.com/app/api/certificates.php";
const LOGO_URL = "https://ama-co.com/app/images/Logo.png";
const FA_IMAGES_BASE_URL = "https://ama-co.com/app/images/FA-products/";
const EN_IMAGES_BASE_URL = "https://ama-co.com/app/images/EN-products/";
const CERTIFICATES_IMAGES_BASE_URL = "https://ama-co.com/app/images/certificates/";

const PDF_URLS = {
  fa: "https://ama-co.com/app/pdf/general_info_fa.pdf",
  en: "https://ama-co.com/app/pdf/general_info_en.pdf"
};

/* --------------- APIهای محتوای جدید --------------- */
const ABOUT_API_URLS = {
  fa: "https://ama-co.com/app/api/about_fa.php",
  en: "https://ama-co.com/app/api/about_en.php"
};

const CONTACT_API_URLS = {
  fa: "https://ama-co.com/app/api/contact_fa.php",
  en: "https://ama-co.com/app/api/contact_en.php"
};

/* =============== سیستم مدیریت زبان (اصلاح شده کامل) =============== */
const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('fa');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'fa' ? 'en' : 'fa');
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

/* =============== سیستم ترجمه (به‌روزرسانی کامل) =============== */
const translations = {
  fa: {
    appTitle: "کتابچه الکترونیک راهنمای فنی محصولات شرکت صنعتی آما",
    productCatalog: "کاتالوگ محصولات",
    searchFromList: "جستجو از فهرست",
    search: "جستجو",
    certificates: "گواهینامه ها",
    tools: "ابزارهای محاسبه جوش",
    aboutUs: "درباره ما",
    contactUs: "ارتباط با ما",
    exitApp: "خروج از نرم‌افزار",
    productList: "فهرست محصولات",
    searchByName: "جستجو بر اساس نام",
    enterProductName: "نام محصول را وارد کنید...",
    noProductsFound: "هیچ محصولی یافت نشد",
    loading: "در حال بارگذاری...",
    error: "خطا",
    retry: "تلاش مجدد",
    back: "بازگشت",
    home: "صفحه اصلی",
    qualityCertificates: "گواهینامه‌های سیستم مدیریت کیفیت",
    productCertificate: "گواهی محصول",
    viewCertificate: "مشاهده گواهینامه",
    certificate: "گواهینامه",
    weldingTools: "ابزارهای کاربردی صنعت جوش",
    generalInformation: "اطلاعات عمومی",
    companyHistory: "تاریخچه شرکت صنعتی آما",
    companySlogan: "پیشرو در صنعت تولید الکترود",
    contactInfo: "اطلاعات تماس",
    noImageAvailable: "تصویری برای این محصول موجود نیست",
    product: "محصول",
    share: "اشتراک‌گذاری",
    copyLink: "کپی لینک",
    openLink: "باز کردن لینک",
    cancel: "لغو",
    exitConfirm: "آیا مطمئن هستید که می‌خواهید از برنامه خارج شوید؟",
    noInternet: "اتصال اینترنت برقرار نیست",
    offlineMode: "حالت آفلاین - برخی امکانات محدود هستند",
    reloadLogo: "بارگذاری مجدد لوگو",
    page: "صفحه",
    of: "از",
    previous: "قبلی",
    next: "بعدی",
    preparedBy: "نسخه 2",
    betaVersion: "نسخه آزمایشی",
    noCategory: "بدون دسته",
    noName: "بدون نام",
    understand: "متوجه شدم",
    success: "موفق",
    linkCopied: "لینک تصویر کپی شد",
    cannotOpenLink: "امکان باز کردن لینک وجود ندارد",
    cannotCopyLink: "امکان کپی لینک وجود ندارد",
    copyLinkQuestion: "آیا می‌خواهید لینک تصویر را کپی کنید؟",
    imageLink: "لینک تصویر",
    notice: "توجه",
    comingSoon: "این بخش به زودی اضافه خواهد شد",
    productCertificateInfo: "گواهی‌های محصولات شرکت صنعتی آما",
    generalInfoContent: "اطلاعات عمومی و راهنمای کاربردی",
    loadingPDF: "در حال بارگذاری فایل PDF...",
    pdfError: "خطا در بارگذاری فایل PDF",
    pdfNotFound: "فایل PDF یافت نشد",
    retryPDF: "تلاش مجدد برای بارگذاری PDF",
    pdfViewer: "نمایش‌گر PDF",
    downloading: "دانلود",
    openInBrowser: "باز کردن در مرورگر",
    unitConverter: "تبدیل واحد",
    unitConverterTitle: "تبدیل واحد کامل",
    enterValue: "مقدار را وارد کنید",
    result: "نتیجه",
    selectCategory: "انتخاب دسته",
    selectUnit: "انتخاب واحد",
    clear: "پاک کردن",
    wrcDiagram: "WRC Diagram",
    calculateWRC: "محاسبه",
    wrcResults: "نتایج محاسبات WRC:",
    mainValues: "مقادیر اصلی:",
    rangeMinMax: "محدوده MIN-MAX:",
    chromiumEquivalent: "معادل کروم:",
    nickelEquivalent: "معادل نیکل:",
    element: "عنصر",
    value: "مقدار",
    min: "MIN",
    max: "MAX",
    analysisResults: "تحلیل نتایج:",
    pointOnLine: "نقطه در امتداد خط مورب",
    ferriteNumber: "شماره فریت",
    helpGuide: "راهنما:",
    wrcFormula1: "فرمول WRC: CrEq = Cr + Mo + 0.7 × Nb",
    wrcFormula2: "فرمول WRC: NiEq = Ni + 35 × C + 20 × N + 0.25 × Cu",
    diagonalLines: "خطوط مورب نشان‌دهنده درصد فاز فریت هستند",
    blueRectangle: "مستطیل آبی نشان‌دهنده محدوده MIN-MAX است",
    tapToZoom: "برای بزرگنمایی ضربه بزنید",
    diagramZoom: "WRC Diagram (بزرگنمایی)",
    productCertificateButton: "گواهینامه محصولات",
    electrodeWeightCalculator: "محاسبه گر وزن الکترود",
    enterCaptchaAnswer: "پاسخ را وارد کنید",
    confirm: "تایید",
    newQuestion: "سوال جدید",
    captchaTimeLeft: "زمان باقی‌مانده",
    seconds: "ثانیه",
    captchaError: "پاسخ اشتباه",
    captchaLocked: "دسترسی قفل شده است",
    captchaLockMessage: "لطفاً صبر کنید...",
    downloadCertificate: "نمایش و دانلود گواهینامه",
    goBack: "بازگشت",
    updatingCatalog: "در حال بروزرسانی کاتالوگ...",
    downloadingImages: "در حال دانلود تصاویر...",
    updateComplete: "بروزرسانی کامل شد",
    updateFailed: "بروزرسانی ناموفق",
    checkingUpdates: "در حال بررسی بروزرسانی‌ها...",
    newVersionAvailable: "نسخه جدید موجود است",
    updatingLogo: "در حال بروزرسانی لوگو...",
    syncInBackground: "همگام‌سازی در پس‌زمینه",
    connectedToWifi: "متصل به وای‍فای",
    connectedToCellular: "متصل به اینترنت موبایل",
    downloadComplete: "دانلود کامل شد",
    listVersionChanged: "list-version تغییر کرده",
    onlyCatalogUpdate: "فقط فهرست بروزرسانی می‌شود",
    faImagesDownload: "تصاویر فارسی تغییرکرده دانلود می‌شوند",
    enImagesDownload: "تصاویر انگلیسی تغییرکرده دانلود می‌شوند",
    bothImagesDownload: "تصاویر هر دو زبان تغییرکرده دانلود می‌شوند",
    updateStrategy: "استراتژی بروزرسانی",
    processingUpdates: "در حال پردازش بروزرسانی‌ها",
    loadingAboutContent: "در حال بارگذاری اطلاعات درباره ما...",
    aboutContentError: "خطا در بارگذاری اطلاعات درباره ما",
    aboutTitle: "درباره شرکت صنعتی آما",
    contactContentError: "خطا در بارگذاری اطلاعات تماس",
    contactLoading: "در حال بارگذاری اطلاعات تماس...",
    backgroundDownloading: "در حال دانلود تصاویر در پس‌زمینه...",
    downloadPaused: "دانلود متوقف شد",
    downloadResumed: "دانلود ادامه یافت",
    imageDownloadPriority: "تصویر انتخابی کاربر در حال دانلود...",
    downloadQueueInfo: "تصاویر در صف دانلود",
    // اضافه شده از کد ابزارها
    weldingTools: "ابزارهای کاربردی صنعت جوش",
    back: "بازگشت",
    wrcDiagram: "WRC Diagram",
    electrodeWeightCalculator: "محاسبه گر وزن الکترود",
    unitConverter: "تبدیل واحد",
    generalInformation: "اطلاعات عمومی",
    calculateWRC: "محاسبه",
    wrcResults: "نتایج محاسبات WRC:",
    mainValues: "مقادیر اصلی:",
    rangeMinMax: "محدوده MIN-MAX:",
    chromiumEquivalent: "معادل کروم:",
    nickelEquivalent: "معادل نیکل:",
    element: "عنصر",
    value: "مقدار",
    min: "MIN",
    max: "MAX",
    analysisResults: "تحلیل نتایج:",
    pointOnLine: "نقطه در امتداد خط مورب",
    ferriteNumber: "شماره فریت",
    helpGuide: "راهنما:",
    wrcFormula1: "فرمول WRC: CrEq = Cr + Mo + 0.7 × Nb",
    wrcFormula2: "فرمول WRC: NiEq = Ni + 35 × C + 20 × N + 0.25 × Cu",
    diagonalLines: "خطوط مورب نشان‌دهنده درصد فاز فریت هستند",
    blueRectangle: "مستطیل آبی نشان‌دهنده محدوده MIN-MAX است",
    tapToZoom: "برای بزرگنمایی ضربه بزنید",
    diagramZoom: "نمودار WRC (بزرگنمایی)",
    unitConverterTitle: "تبدیل واحد کامل",
    enterValue: "مقدار را وارد کنید",
    result: "نتیجه",
    selectCategory: "انتخاب دسته",
    selectUnit: "انتخاب واحد",
    clear: "پاک کردن",
    loadingPDF: "در حال بارگذاری فایل PDF...",
    pdfError: "خطا در بارگذاری فایل PDF",
    retry: "تلاش مجدد",
    openingBrowser: "در حال باز کردن مرورگر...",
    loading: "در حال بارگذاری...",
    error: "خطا",
    notice: "توجه",
    noInternet: "اتصال اینترنت برقرار نیست",
    offlineMode: "حالت آفلاین - برخی امکانات محدود هستند",
    openPDFInBrowser: "باز کردن PDF در مرورگر",
    downloadPDF: "دانلود PDF",
    pdfViewer: "نمایش‌گر PDF",
    pdfNotFound: "فایل PDF یافت نشد",
    retryPDF: "تلاش مجدد برای بارگذاری PDF",
    openInBrowser: "باز کردن در مرورگر",
    downloading: "دانلود",
    updateAvailable: "نسخه جدید موجود است",
    updatePDF: "بروزرسانی PDF"
  },
  en: {
    appTitle: "AMA Product Manual",
    productCatalog: "Product Manual",
    searchFromList: "Search from List",
    search: "Search",
    certificates: "Certificates",
    tools: "Welding Calculation Tools",
    aboutUs: "About Us",
    contactUs: "Contact Us",
    exitApp: "Exit Application",
    productList: "Product List",
    searchByName: "Search by Name",
    enterProductName: "Enter product name...",
    noProductsFound: "No products found",
    loading: "Loading...",
    error: "Error",
    retry: "Retry",
    back: "Back",
    home: "Home",
    qualityCertificates: "QMS Certificates",
    productCertificate: "Product Certificate",
    viewCertificate: "View Certificate",
    certificate: "Certificate",
    weldingTools: "Practical Tools for the Welding Industry",
    generalInformation: "General Information",
    companyHistory: "History of AMA Industrial Company",
    companySlogan: "Leading in Electrode Manufacturing Industry",
    contactInfo: "Contact Information",
    noImageAvailable: "No image available for this product",
    product: "Product",
    share: "Share",
    copyLink: "Copy Link",
    openLink: "Open Link",
    cancel: "Cancel",
    exitConfirm: "Are you sure you want to exit the application?",
    noInternet: "No internet connection",
    offlineMode: "Offline mode – Some features are limited",
    reloadLogo: "Reload Logo",
    page: "Page",
    of: "of",
    previous: "Previous",
    next: "Next",
    preparedBy: "Version 2",
    betaVersion: "Beta Version",
    noCategory: "No Category",
    noName: "No Name",
    understand: "I Understand",
    success: "Success",
    linkCopied: "Image link copied",
    cannotOpenLink: "Cannot open link",
    cannotCopyLink: "Cannot copy link",
    copyLinkQuestion: "Do you want to copy the image link?",
    imageLink: "Image Link",
    notice: "Notice",
    comingSoon: "This section will be added soon",
    productCertificateInfo: "Product certificates of AMA Industrial Company",
    generalInfoContent: "General information and user guide",
    loadingPDF: "Loading PDF file...",
    pdfError: "Error loading PDF file",
    pdfNotFound: "PDF file not found",
    retryPDF: "Retry loading PDF",
    pdfViewer: "PDF Viewer",
    downloading: "Download",
    openInBrowser: "Open in Browser",
    unitConverter: "Unit Converter",
    unitConverterTitle: "Complete Unit Converter",
    enterValue: "Enter value",
    result: "Result",
    selectCategory: "Select Category",
    selectUnit: "Select Unit",
    clear: "Clear",
    wrcDiagram: "WRC Diagram",
    calculateWRC: "Calculate WRC",
    wrcResults: "WRC Calculation Results:",
    mainValues: "Main Values:",
    rangeMinMax: "MIN-MAX Range:",
    chromiumEquivalent: "Chromium Equivalent:",
    nickelEquivalent: "Nickel Equivalent:",
    element: "Element",
    value: "Value",
    min: "MIN",
    max: "MAX",
    analysisResults: "Analysis Results:",
    pointOnLine: "Point is along diagonal line",
    ferriteNumber: "Ferrite Number",
    helpGuide: "Guide:",
    wrcFormula1: "WRC Formula: CrEq = Cr + Mo + 0.7 × Nb",
    wrcFormula2: "WRC Formula: NiEq = Ni + 35 × C + 20 × N + 0.25 × Cu",
    diagonalLines: "Diagonal lines indicate ferrite phase percentage",
    blueRectangle: "Blue rectangle shows MIN-MAX range",
    tapToZoom: "Tap to Zoom",
    diagramZoom: "WRC Diagram (Zoom)",
    productCertificateButton: "products certificate",
    electrodeWeightCalculator: "Electrode Weight Calculator",
    enterCaptchaAnswer: "Enter answer",
    confirm: "Confirm",
    newQuestion: "New",
    captchaTimeLeft: "Time left",
    seconds: "seconds",
    captchaError: "Wrong answer",
    captchaLocked: "Access is locked",
    captchaLockMessage: "Please wait...",
    downloadCertificate: "View and Download Certificate",
    goBack: "Go Back",
    updatingCatalog: "Updating catalog...",
    downloadingImages: "Downloading images...",
    updateComplete: "Update complete",
    updateFailed: "Update failed",
    checkingUpdates: "Checking for updates...",
    newVersionAvailable: "New version available",
    updatingLogo: "Updating logo...",
    syncInBackground: "Syncing in background",
    connectedToWifi: "Connected to WiFi",
    connectedToCellular: "Connected to mobile data",
    downloadComplete: "Download complete",
    listVersionChanged: "list-version changed",
    onlyCatalogUpdate: "Only catalog will be updated",
    faImagesDownload: "Changed FA images will be downloaded",
    enImagesDownload: "Changed EN images will be downloaded",
    bothImagesDownload: "Changed images in both languages will be downloaded",
    updateStrategy: "Update Strategy",
    processingUpdates: "Processing updates",
    loadingAboutContent: "Loading about us information...",
    aboutContentError: "Error loading about us information",
    aboutTitle: "About AMA Industrial Company",
    contactContentError: "Error loading contact information",
    contactLoading: "Loading contact information...",
    backgroundDownloading: "Downloading images in background...",
    downloadPaused: "Download paused",
    downloadResumed: "Download resumed",
    imageDownloadPriority: "User selected image downloading...",
    downloadQueueInfo: "Images in download queue",
    // اضافه شده از کد ابزارها
    weldingTools: "Practical Tools for the Welding Industry",
    back: "Back",
    wrcDiagram: "WRC Diagram",
    electrodeWeightCalculator: "Electrode Weight Calculator",
    unitConverter: "Unit Converter",
    generalInformation: "General Information",
    calculateWRC: "Calculate WRC",
    wrcResults: "WRC Calculation Results:",
    mainValues: "Main Values:",
    rangeMinMax: "MIN-MAX Range:",
    chromiumEquivalent: "Chromium Equivalent:",
    nickelEquivalent: "Nickel Equivalent:",
    element: "Element",
    value: "Value",
    min: "MIN",
    max: "MAX",
    analysisResults: "Analysis Results:",
    pointOnLine: "Point is along diagonal line",
    ferriteNumber: "Ferrite Number",
    helpGuide: "Guide:",
    wrcFormula1: "WRC Formula: CrEq = Cr + Mo + 0.7 × Nb",
    wrcFormula2: "WRC Formula: NiEq = Ni + 35 × C + 20 × N + 0.25 × Cu",
    diagonalLines: "Diagonal lines indicate ferrite phase percentage",
    blueRectangle: "Blue rectangle shows MIN-MAX range",
    tapToZoom: "Tap to Zoom",
    diagramZoom: "WRC Diagram (Zoom)",
    unitConverterTitle: "Complete Unit Converter",
    enterValue: "Enter value",
    result: "Result",
    selectCategory: "Select Category",
    selectUnit: "Select Unit",
    clear: "Clear",
    loadingPDF: "Loading PDF file...",
    pdfError: "Error loading PDF file",
    retry: "Retry",
    openingBrowser: "Opening browser...",
    loading: "Loading...",
    error: "Error",
    notice: "Notice",
    noInternet: "No internet connection",
    offlineMode: "Offline mode – Some features are limited",
    openPDFInBrowser: "Open PDF in browser",
    downloadPDF: "Download PDF",
    pdfViewer: "PDF Viewer",
    pdfNotFound: "PDF file not found",
    retryPDF: "Retry loading PDF",
    openInBrowser: "Open in Browser",
    downloading: "Downloading",
    updateAvailable: "New version available",
    updatePDF: "Update PDF"
  }
};

const t = (key, language = 'fa') => {
  return translations[language]?.[key] || key;
};

/* --------------- پالت رنگی حرفه‌ای --------------- */
const colors = {
  primary: '#2E86AB',
  primaryLight: '#5FA8D3',
  primaryDark: '#1B5E7A',
  secondary: '#A23B72',
  secondaryLight: '#C86BA0',
  accent: '#F18F01',
  accentLight: '#FFB347',
  background: '#D8E9F5',
  surface: '#FFFFFF',
  textPrimary: '#2D3047',
  textSecondary: '#6C757D',
  textLight: '#8E9AAF',
  success: '#28A745',
  warning: '#FFC107',
  danger: '#DC3545',
  border: '#C4D8E8',
  shadow: 'rgba(0, 0, 0, 0.15)',
};

/* --------------- استایل‌های متریال دیزاین --------------- */
const shadowStyles = {
  shadowSmall: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  shadowMedium: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  shadowLarge: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 12,
  },
};

/* --------------- استایل‌های متنی جدید برای رفع مشکل تراز --------------- */
const textStyles = StyleSheet.create({
  nameTextFa: {
    fontSize: 14,
    color: '#2D3047',
    fontWeight: '500',
    textAlign: 'right',
    writingDirection: 'rtl',
    includeFontPadding: false,
    textAlignVertical: 'center'
  },
  nameTextEn: {
    fontSize: 14,
    color: '#2D3047',
    fontWeight: '500',
    textAlign: 'left',
    writingDirection: 'ltr',
    includeFontPadding: false,
    textAlignVertical: 'center'
  },
  categoryText: {
    fontSize: 14,
    color: "#fff",
    flex: 1,
    textAlign: 'center',
    fontWeight: '600',
    paddingHorizontal: 8
  },
  subItemText: {
    fontSize: 14,
    color: '#6C757D',
    fontWeight: '400',
    textAlign: 'left',
    flex: 1,
    paddingLeft: 20,
    textAlignVertical: 'center'
  },
  subItemMultiPageText: {
    fontSize: 14,
    color: '#2E86AB',
    fontWeight: '600',
    textAlign: 'left',
    flex: 1,
    paddingLeft: 20,
    textAlignVertical: 'center'
  }
});

const styles = {
  ...shadowStyles,
  
  buttonBase: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
  },
  
  input: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  
  heading1: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  heading2: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  heading3: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  body: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    color: colors.textLight,
  }
};

/* --------------- کامپوننت Text سفارشی --------------- */
const AppText = ({ children, style, language = 'fa', isNameField = false, ...props }) => {
  if (isNameField) {
    return (
      <Text 
        style={[
          language === 'fa' ? textStyles.nameTextFa : textStyles.nameTextEn,
          style
        ]}
        {...props}
      >
        {children}
      </Text>
    );
  }
  
  return (
    <Text style={style} {...props}>
      {children}
    </Text>
  );
};


/* =============== توابع کمکی =============== */
function parseCSV(text) {
  try {
    const rows = [];
    let cur = "";
    let row = [];
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      const next = text[i + 1];
      if (ch === '"') {
        if (inQuotes && next === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === "," && !inQuotes) {
        row.push(cur);
        cur = "";
      } else if ((ch === "\n" || ch === "\r") && !inQuotes) {
        if (ch === "\r" && next === "\n") {}
        row.push(cur);
        rows.push(row);
        row = [];
        cur = "";
        if (ch === "\r" && next === "\n") i++;
      } else {
        cur += ch;
      }
    }
    if (cur !== "" || row.length > 0) {
      row.push(cur);
      rows.push(row);
    }
    return rows;
  } catch (error) {
    console.error("CSV parsing error:", error);
    return [];
  }
}

async function fetchProductsFromAPI(language = 'fa') {
  try {
    const res = await fetch(CSV_API_URL);
    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
    
    const csvText = await res.text();
    const rows = parseCSV(csvText);
    
    if (!rows || rows.length < 2) return [];
    
    // پردازش مستقیم ردیف‌های CSV
    const headers = rows[0];
    const data = [];
    
    // پیدا کردن شاخص ستون‌ها بر اساس زبان
    const colIndexes = {
      category: headers.findIndex(h => 
        language === 'fa' ? h === 'category' : h === 'EN-category'
      ),
      name: headers.findIndex(h => 
        language === 'fa' ? h === 'name' : h === 'EN-name'
      ),
      subItem: headers.findIndex(h => 
        language === 'fa' ? h === 'subItem' : h === 'EN-subItem'
      )
    };
    
    // پردازش ردیف‌ها
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row.length > Math.max(colIndexes.category, colIndexes.name, colIndexes.subItem)) {
        const product = {
          category: row[colIndexes.category]?.trim() || '',
          name: row[colIndexes.name]?.trim() || '',
          subItem: row[colIndexes.subItem]?.trim() || '',
          language: language
        };
        
        // فقط اگر نام داشته باشد اضافه شود
        if (product.name) {
          // ساخت URL تصویر
          const imageName = product.subItem || product.name;
          product.imageUrl = await findImageUrlByName(imageName, language);
          data.push(product);
        }
      }
    }
    
    return data;
  } catch (e) {
    console.error(`Error fetching products for ${language}:`, e);
    return [];
  }
}

async function findImageUrlByName(name, language = 'fa') {
  // فقط URL را بساز و برگردان - بدون بررسی کش
  const baseUrl = language === 'fa' ? FA_IMAGES_BASE_URL : EN_IMAGES_BASE_URL;
  const cleanName = name.trim();
  let imageName = cleanName;
  
  if (!imageName.toLowerCase().endsWith('.jpg') && 
      !imageName.toLowerCase().endsWith('.jpeg')) {
    imageName += '.jpg';
  }
  
  return baseUrl + encodeURIComponent(imageName);
}

/* =============== توابع برای محصولات چندصفحه‌ای =============== */
function isMultiPageProduct(subItem) {
  const multiPagePatterns = [
    /-Page\d+/i,
    /-page\d+/i,
    /صفحه\s*\d+/i,
    /page\s*\d+/i
  ];
  
  return multiPagePatterns.some(pattern => pattern.test(subItem));
}

function getBaseProductName(subItem) {
  if (isMultiPageProduct(subItem)) {
    return subItem.replace(/-Page\d+$/i, '').trim();
  }
  return subItem;
}

function extractPageNumber(subItem) {
  const match = subItem.match(/-Page(\d+)$/i);
  return match ? parseInt(match[1]) : 1;
}

function processProductData(products, language = 'fa') {
  const groupedData = {};
  
  console.log(`[DEBUG] Processing ${products.length} products into grouped data for ${language}`);
  
  products.forEach(product => {
    const { category, name, subItem } = product;
    
    if (!category || category === '') {
      return;
    }
    
    const categoryKey = category;
    const productKey = `${category}-${name}`;
    
    if (!groupedData[categoryKey]) {
      groupedData[categoryKey] = {
        category: category,
        products: {}
      };
    }
    
    if (!groupedData[categoryKey].products[productKey]) {
      groupedData[categoryKey].products[productKey] = {
        name: name,
        subItems: [],
        isMultiPage: false
      };
    }
    
    if (subItem && subItem !== "") {
      groupedData[categoryKey].products[productKey].subItems.push(subItem);
      
      if (isMultiPageProduct(subItem)) {
        groupedData[categoryKey].products[productKey].isMultiPage = true;
      }
    }
  });
  
  console.log(`[DEBUG] Created ${Object.keys(groupedData).length} categories for ${language}`);
  return groupedData;
}

function getSheetHeaders(language = 'fa') {
  if (language === 'en') {
    return {
      category: 'EN-category',
      name: 'EN-name',
      subItem: 'EN-subItem'
    };
  }
  return {
    category: 'category',
    name: 'name',
    subItem: 'subItem'
  };
}

/* =============== کامپوننت ShareButton =============== */
function ShareButton({ imageUrl, productName, isCertificate = false, style, language = 'fa' }) {
  const [sharing, setSharing] = useState(false);

  const shareImage = async () => {
    if (!imageUrl) {
      Alert.alert(t('error', language), t('noImageAvailable', language));
      return;
    }

    try {
      setSharing(true);
      
      const shareText = `AMA Industrial Company\n${isCertificate ? t('certificate', language) : t('product', language)} "${productName}"\n\n${t('imageLink', language)}: ${imageUrl}`;
      
      const shareResult = await Share.share({
        title: productName || 'AMA Industrial Company',
        message: shareText,
        url: imageUrl,
      }, {
        dialogTitle: `${t('share', language)} ${isCertificate ? t('certificate', language) : t('product', language)}`,
        subject: `${isCertificate ? t('certificate', language) : t('product', language)} ${productName} - AMA Company`
      });

    } catch (error) {
      console.error('Share error:', error);
      
      Alert.alert(
        t('share', language),
        t('copyLinkQuestion', language),
        [
          {
            text: t('openLink', language),
            onPress: () => Linking.openURL(imageUrl).catch(err => {
              console.error("Link open error:", err);
              Alert.alert(t('error', language), t('cannotOpenLink', language));
            })
          },
          {
            text: t('copyLink', language),
            onPress: () => {
              try {
                Clipboard.setString(imageUrl);
                Alert.alert(t('success', language), t('linkCopied', language));
              } catch (err) {
                console.error("Copy link error:", err);
                Alert.alert(t('error', language), t('cannotCopyLink', language));
              }
            }
          },
          {
            text: t('cancel', language),
            style: "cancel"
          }
        ]
      );
    } finally {
      setSharing(false);
    }
  };

  return (
    <TouchableOpacity
      onPress={shareImage}
      disabled={sharing || !imageUrl}
      style={[{
        backgroundColor: imageUrl ? colors.accent : colors.textLight,
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        ...styles.shadowMedium,
      }, style]}
    >
      {sharing ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <Text style={{ fontSize: 20, color: '#fff' }}>
          🔗
        </Text>
      )}
    </TouchableOpacity>
  );
}

/* =============== کامپوننت ZoomableImage =============== */
function ZoomableImage({ source, style, resizeMode = "contain", productName, isCertificate = false, language = 'fa' }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  const images = [{
    url: source.uri,
    props: {
      source: { uri: source.uri }
    }
  }];

  const openZoomModal = () => {
    setIsModalVisible(true);
  };

  const closeZoomModal = () => {
    setIsModalVisible(false);
  };

  return (
    <View style={[{ 
      borderRadius: 16,
      overflow: 'hidden',
      backgroundColor: colors.background,
    }, style]}>
      <TouchableOpacity 
        activeOpacity={0.9}
        onPress={openZoomModal}
        style={{ position: 'relative' }}
      >
        <Image
          source={{ uri: source.uri }}
          style={{
            width: '100%',
            height: '100%',
            resizeMode: resizeMode,
          }}
          onError={() => console.warn("Image load error")}
        />
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent={true}
        onRequestClose={closeZoomModal}
      >
        <View style={{ 
          flex: 1, 
          backgroundColor: 'rgba(0,0,0,0.9)',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <View style={{
            position: 'absolute',
            top: Platform.OS === 'ios' ? 60 : 40,
            left: 20,
            flexDirection: 'row',
            alignItems: 'center',
            zIndex: 1000,
            gap: 12,
          }}>
            <TouchableOpacity 
              style={{
                backgroundColor: 'rgba(255,255,255,0.9)',
                width: 50,
                height: 50,
                borderRadius: 25,
                justifyContent: 'center',
                alignItems: 'center',
                ...styles.shadowMedium,
              }}
              onPress={closeZoomModal}
            >
              <Text style={{ color: colors.danger, fontSize: 20, fontWeight: 'bold' }}>✕</Text>
            </TouchableOpacity>
            
            <ShareButton 
              imageUrl={source.uri}
              productName={productName}
              isCertificate={isCertificate}
              language={language}
              style={{
                width: 50,
                height: 50,
              }}
            />
          </View>
          
          <ImageViewer
            imageUrls={images}
            enableSwipeDown={true}
            swipeDownThreshold={50}
            onSwipeDown={closeZoomModal}
            enablePreload={true}
            saveToLocalByLongPress={false}
            backgroundColor="rgba(0,0,0,0.9)"
            onClick={closeZoomModal}
            enableImageZoom={true}
            flipThreshold={100}
            maxOverflow={500}
            doubleClickInterval={300}
            renderIndicator={() => null}
            style={{
              width: Dimensions.get('window').width,
              height: Dimensions.get('window').height,
            }}
          />
        </View>
      </Modal>
    </View>
  );
}

/* =============== صفحه درباره ما =============== */
function AboutScreen({ navigation }) {
  const { language } = useLanguage();
  const [aboutContent, setAboutContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    // بررسی اتصال اینترنت
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    loadAboutContent();

    return () => unsubscribe();
  }, [language]);

  const loadAboutContent = async () => {
    if (!isConnected) {
      setError(true);
      setAboutContent(t('noInternet', language));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(false);
      
      // دریافت مستقیم از API بدون کش
      const response = await fetch(ABOUT_API_URLS[language]);
      
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      
      const content = await response.text();
      setAboutContent(content);
      
    } catch (error) {
      console.error("About content load error:", error);
      setError(true);
      setAboutContent(
        language === 'fa' 
          ? "متأسفانه در بارگذاری اطلاعات درباره ما مشکلی پیش آمده است.\n\nلطفاً اتصال اینترنت خود را بررسی کنید و دوباره تلاش کنید."
          : "Unfortunately, there was a problem loading the about us information.\n\nPlease check your internet connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    loadAboutContent();
  };

  return (
    <SafeAreaView style={{ 
      flex: 1, 
      backgroundColor: colors.background,
    }}>
      <View style={{ flex: 1 }}>
        <View style={{ 
          alignItems: 'center', 
          marginBottom: 16, 
          marginTop: 45,
          backgroundColor: 'transparent',
        }}>
          <Text style={[styles.heading1, { marginBottom: 8 }]}>
            {language === 'fa' ? "شرکت صنعتی آما" : "AMA Industrial Company"}
          </Text>
          <Text style={[styles.heading3, { color: colors.primary }]}>
            {t('companySlogan', language)}
          </Text>
        </View>

        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.card, { marginBottom: 16, ...styles.shadowMedium }]}>
            <Text style={[styles.heading2, { color: colors.primary, marginBottom: 16 }]}>
              📜 {t('aboutTitle', language)}
            </Text>
            
            {loading ? (
              <View style={{
                alignItems: 'center',
                padding: 40,
              }}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={[styles.body, { marginTop: 16 }]}>
                  {t('loadingAboutContent', language)}
                </Text>
              </View>
            ) : (
              <>
                {error && (
                  <View style={{
                    backgroundColor: colors.warning,
                    padding: 12,
                    borderRadius: 8,
                    marginBottom: 16,
                  }}>
                    <Text style={[styles.body, { textAlign: 'center', color: colors.danger }]}>
                      ⚠️ {t('aboutContentError', language)}
                    </Text>
                  </View>
                )}
                
                <Text 
                  style={[styles.body, { 
                    marginBottom: 16, 
                    textAlign: language === 'fa' ? 'right' : 'left',
                    lineHeight: 26,
                  }]}
                >
                  {aboutContent}
                </Text>
                
                {error && (
                  <TouchableOpacity
                    onPress={handleRetry}
                    disabled={loading}
                    style={[styles.buttonBase, { 
                      backgroundColor: loading ? colors.textLight : colors.primary,
                      marginTop: 16,
                      ...styles.shadowSmall,
                    }]}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>{t('retry', language)}</Text>
                    )}
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>

          <View style={{ marginBottom: 45 }}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={[styles.buttonBase, { 
                width: '100%', 
                backgroundColor: colors.primary,
                height: 60,
                marginBottom: 30,
                ...styles.shadowMedium,
              }]}
            >
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>{t('back', language)}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

/* =============== صفحه ارتباط با ما =============== */
function ContactScreen({ navigation }) {
  const { language } = useLanguage();
  const [contactContent, setContactContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    // بررسی اتصال اینترنت
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    loadContactContent();

    return () => unsubscribe();
  }, [language]);

  const loadContactContent = async () => {
    if (!isConnected) {
      setError(true);
      setContactContent(t('noInternet', language));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(false);
      
      // دریافت مستقیم از API بدون کش
      const response = await fetch(CONTACT_API_URLS[language]);
      
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      
      const content = await response.text();
      setContactContent(content);
      
    } catch (error) {
      console.error("Contact content load error:", error);
      setError(true);
      setContactContent(
        language === 'fa' 
          ? "متأسفانه در بارگذاری اطلاعات تماس مشکلی پیش آمده است.\n\nلطفاً اتصال اینترنت خود را بررسی کنید و دوباره تلاش کنید."
          : "Unfortunately, there was a problem loading the contact information.\n\nPlease check your internet connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    loadContactContent();
  };

  return (
    <SafeAreaView style={{ 
      flex: 1, 
      backgroundColor: colors.background,
    }}>
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ 
          alignItems: 'center', 
          marginBottom: 24, 
          marginTop: 60,
          backgroundColor: 'transparent',
        }}>
          <Text style={[styles.heading1, { marginBottom: 8 }]}>
            {language === 'fa' ? "شرکت صنعتی آما" : "AMA Industrial Company"}
          </Text>
          <Text style={[styles.heading3, { color: colors.primary }]}>
            {t('companySlogan', language)}
          </Text>
        </View>

        <View style={{ 
          backgroundColor: colors.surface,
          borderRadius: 16,
          padding: 20,
          marginBottom: 16,
          borderWidth: 2,
          borderColor: colors.border,
          ...styles.shadowMedium,
        }}>
          <Text style={[styles.heading2, { color: colors.primary, marginBottom: 20, textAlign: 'center' }]}>
            📞 {t('contactInfo', language)}
          </Text>
          
          {loading ? (
            <View style={{
              alignItems: 'center',
              padding: 40,
            }}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={[styles.body, { marginTop: 16 }]}>
                {t('contactLoading', language)}
              </Text>
            </View>
          ) : (
            <>
              {error && (
                <View style={{
                  backgroundColor: colors.warning,
                  padding: 12,
                  borderRadius: 8,
                  marginBottom: 16,
                }}>
                  <Text style={[styles.body, { textAlign: 'center', color: colors.danger }]}>
                    ⚠️ {t('contactContentError', language)}
                  </Text>
                </View>
              )}
              
              <Text 
                style={[styles.body, { 
                  marginBottom: 16, 
                  textAlign: language === 'fa' ? 'right' : 'left',
                  lineHeight: 26,
                }]}
              >
                {contactContent}
              </Text>
              
              {error && (
                <TouchableOpacity
                  onPress={handleRetry}
                  disabled={loading}
                  style={[styles.buttonBase, { 
                    backgroundColor: loading ? colors.textLight : colors.primary,
                    marginTop: 16,
                    ...styles.shadowSmall,
                  }]}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>{t('retry', language)}</Text>
                  )}
                </TouchableOpacity>
              )}
            </>
          )}
        </View>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.buttonBase, { 
            width: '100%', 
            backgroundColor: colors.primary,
            height: 60,
            ...styles.shadowMedium,
          }]}
        >
          <View style={{ 
            flexDirection: language === 'fa' ? 'row' : 'row-reverse', 
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600", marginRight: language === 'fa' ? 8 : 0, marginLeft: language === 'fa' ? 0 : 8 }}></Text>
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>{t('back', language)}</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

/* =============== صفحه HomeScreen اصلی (اصلاح نهایی بدون کش) =============== */
function HomeScreen({ navigation }) {
  const { language, toggleLanguage } = useLanguage();
  const [isConnected, setIsConnected] = useState(true);
  const [logoUrl, setLogoUrl] = useState(LOGO_URL);
  const [logoLoading, setLogoLoading] = useState(true);
  const [logoError, setLogoError] = useState(false);
  const appState = AppState.currentState;

  useEffect(() => {
    loadLogo();
    setPortraitOrientation();
    
    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);
    
    // گوش‌دادن ساده به وضعیت شبکه
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    // پاک‌سازی
    return () => {
      unsubscribe();
      appStateSubscription.remove();
    };
  }, [language]);

  const handleAppStateChange = (nextAppState) => {
    // مدیریت ساده وضعیت برنامه
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('[APP] App became active');
    }
  };

  const loadLogo = async () => {
    try {
      setLogoLoading(true);
      setLogoError(false);
      
      // همیشه مستقیم از URL اصلی استفاده می‌کنیم
      setLogoUrl(LOGO_URL);
      
      // پیش‌بارگذاری لوگو
      Image.prefetch(LOGO_URL).catch(() => {});
    } catch (error) {
      console.error("Logo load error:", error);
      setLogoError(true);
    } finally {
      setLogoLoading(false);
    }
  };

  const handleLogoLoad = () => {
    setLogoError(false);
  };

  const handleLogoError = () => {
    console.warn("❌ Logo image load error");
    if (isConnected) {
      setLogoError(true);
    }
  };

  const handleProductCatalogPress = () => {
    navigation.navigate("ProductCatalog");
  };

  const handleToolsPress = () => {
    navigation.navigate("Tools");
  };

  const handleCertificatesPress = () => {
    navigation.navigate("CertificatesMain");
  };

  const handleAboutUsPress = () => {
    navigation.navigate("About");
  };

  const handleContactUsPress = () => {
    navigation.navigate("Contact");
  };

  const handleExitApp = () => {
    Alert.alert(
      t('exitApp', language),
      t('exitConfirm', language),
      [
        {
          text: t('cancel', language),
          style: "cancel"
        },
        {
          text: t('exitApp', language),
          onPress: () => {
            if (Platform.OS === 'android') {
              BackHandler.exitApp();
            } else {
              Alert.alert(
                t('notice', language), 
                language === 'fa' 
                  ? "برای خروج از برنامه دکمه Home را فشار دهید" 
                  : "Press the Home button to exit the app"
              );
            }
          }
        }
      ]
    );
  };

  const screenWidth = Dimensions.get("window").width;
  const buttonWidth = screenWidth - 80;

  return (
    <SafeAreaView style={{ 
      flex: 1, 
      backgroundColor: colors.background,
    }}>
      <View style={{ 
        flex: 1, 
        justifyContent: "flex-start",
        alignItems: "center", 
        padding: 24,
        paddingTop: 40,
      }}>
        
        <TouchableOpacity
          onPress={toggleLanguage}
          style={[styles.buttonBase, {
            position: 'absolute',
            top: 50,
            left: 20,
            backgroundColor: colors.primaryLight,
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 20,
            zIndex: 100,
            ...styles.shadowMedium,
          }]}
        >
          <Text style={{ color: "#fff", fontSize: 14, fontWeight: "600" }}>
            {language === 'fa' ? 'EN' : 'فا'}
          </Text>
        </TouchableOpacity>
        
        <View style={{
          width: 90,
          height: 90,
          borderRadius: 45,
          backgroundColor: colors.surface,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 16,
          ...styles.shadowMedium,
          borderWidth: 1,
          borderColor: colors.primary,
          overflow: 'hidden',
        }}>
          {!logoError ? (
            <Image
              source={{ uri: logoUrl }}
              style={{
                width: '69%',
                height: '69%',
                resizeMode: 'contain',
              }}
              onLoad={handleLogoLoad}
              onError={handleLogoError}
            />
          ) : (
            <View style={{
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: colors.primary,
            }}>
              <Text style={{ 
                color: colors.surface, 
                fontSize: 18,
                fontWeight: 'bold',
                textAlign: 'center'
              }}>
                AMA
              </Text>
            </View>
          )}
        </View>

        {logoError && isConnected && (
          <TouchableOpacity 
            onPress={loadLogo}
            style={[styles.buttonBase, { 
              backgroundColor: colors.warning,
              marginBottom: 8,
              paddingVertical: 6,
              paddingHorizontal: 12,
              ...styles.shadowSmall,
            }]}
          >
            <Text style={{ color: colors.textPrimary, fontSize: 11, fontWeight: "600" }}>
              🔄 {t('reloadLogo', language)}
            </Text>
          </TouchableOpacity>
        )}

        <View style={{ 
          alignItems: 'center',
          marginBottom: 16,
        }}>
          <Text style={[styles.heading1, { marginBottom: 6, textAlign: 'center' }]}>
            {t('appTitle', language)}
          </Text>
        </View>

        <View style={{ 
          width: "100%", 
          alignItems: "center", 
          marginTop: 0,
        }}>
          <TouchableOpacity
            onPress={handleProductCatalogPress}
            style={[styles.buttonBase, { 
              width: buttonWidth, 
              marginBottom: 13,
              backgroundColor: colors.primary,
              height: 59,
              ...styles.shadowLarge,
            }]}
          >
            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6
            }}>
              {language === 'fa' ? (
                <>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>{t('productCatalog', language)}</Text>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>📚</Text>
                </>
              ) : (
                <>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>📚</Text>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>{t('productCatalog', language)}</Text>
                </>
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleCertificatesPress}
            style={[styles.buttonBase, { 
              width: buttonWidth, 
              marginBottom: 13,
              backgroundColor: colors.primary,
              height: 59,
              ...styles.shadowLarge,
            }]}
          >
            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6
            }}>
              {language === 'fa' ? (
                <>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>{t('certificates', language)}</Text>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>📜</Text>
                </>
              ) : (
                <>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>📜</Text>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>{t('certificates', language)}</Text>
                </>
              )}
            </View>
          </TouchableOpacity>

          {/* دکمه ابزارهای محاسبه جوش - اضافه شده */}
          <TouchableOpacity
            onPress={handleToolsPress}
            style={[styles.buttonBase, { 
              width: buttonWidth, 
              marginBottom: 13,
              backgroundColor: colors.primary,
              height: 59,
              ...styles.shadowLarge,
            }]}
          >
            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6
            }}>
              {language === 'fa' ? (
                <>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>{t('tools', language)}</Text>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>🛠️</Text>
                </>
              ) : (
                <>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>🛠️</Text>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>{t('tools', language)}</Text>
                </>
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleAboutUsPress}
            style={[styles.buttonBase, { 
              width: buttonWidth, 
              marginBottom: 13,
              backgroundColor: colors.primary,
              height: 59,
              ...styles.shadowLarge,
            }]}
          >
            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6
            }}>
              {language === 'fa' ? (
                <>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>{t('aboutUs', language)}</Text>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>ℹ️</Text>
                </>
              ) : (
                <>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>ℹ️</Text>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>{t('aboutUs', language)}</Text>
                </>
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleContactUsPress}
            style={[styles.buttonBase, { 
              width: buttonWidth, 
              marginBottom: 13,
              backgroundColor: colors.primary,
              height: 59,
              ...styles.shadowLarge,
            }]}
          >
            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6
            }}>
              {language === 'fa' ? (
                <>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>{t('contactUs', language)}</Text>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>📞</Text>
                </>
              ) : (
                <>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>📞</Text>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>{t('contactUs', language)}</Text>
                </>
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleExitApp}
            style={[styles.buttonBase, { 
              width: buttonWidth,
              backgroundColor: colors.primary,
              height: 59,
              marginBottom: 13,
              ...styles.shadowLarge,
            }]}
          >
            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6
            }}>
              {language === 'fa' ? (
                <>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>{t('exitApp', language)}</Text>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>🚪</Text>
                </>
              ) : (
                <>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>🚪</Text>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>{t('exitApp', language)}</Text>
                </>
              )}
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ 
          position: "absolute", 
          bottom: 50, 
          alignItems: language === 'fa' ? "flex-end" : "flex-start",
          width: "100%",
          paddingHorizontal: 24,
        }}>
          <View style={{
            width: "100%",
            height: 2,
            backgroundColor: colors.border,
            marginBottom: 8
          }} />
          <Text style={[styles.caption, { 
            marginBottom: 2, 
            textAlign: language === 'fa' ? 'right' : 'left',
          }]}>
            {t('preparedBy', language)}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

/* =============== صفحه کاتالوگ محصولات =============== */
function ProductCatalogScreen({ navigation }) {
  const { language } = useLanguage();
  const [isConnected, setIsConnected] = useState(true);
  const screenWidth = Dimensions.get("window").width;
  const buttonWidth = screenWidth - 80;

  useEffect(() => {
    setPortraitOrientation();

    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  const handleCategoryListPress = () => {
    if (!isConnected) {
      Alert.alert(
        t('error', language),
        t('noInternet', language),
        [{ text: t('understand', language) }]
      );
      return;
    }
    navigation.navigate("CategoryList");
  };

  const handleSearchByNamePress = () => {
    if (!isConnected) {
      Alert.alert(
        t('error', language),
        t('noInternet', language),
        [{ text: t('understand', language) }]
      );
      return;
    }
    navigation.navigate("SearchByName");
  };

  return (
    <SafeAreaView style={{ 
      flex: 1, 
      backgroundColor: colors.background,
    }}>
      <View style={{ 
        flex: 1, 
        justifyContent: "flex-start",
        alignItems: "center", 
        padding: 24,
        paddingTop: 80,
      }}>
        
        <View style={{ 
          alignItems: 'center',
          marginBottom: 40,
        }}>
          <Text style={[styles.heading1, { marginBottom: 8 }]}>
            {t('productCatalog', language)}
          </Text>
          <Text style={[styles.heading3, { color: colors.textSecondary }]}>
            {language === 'fa' ? "دسترسی به محصولات شرکت صنعتی آما" : "Access to AMA Industrial Company Products"}
          </Text>
        </View>

        {!isConnected && (
          <View style={{
            backgroundColor: colors.warning,
            padding: 10,
            borderRadius: 6,
            marginBottom: 12,
            width: buttonWidth,
            ...styles.shadowSmall,
          }}>
            <Text style={{ 
              color: colors.textPrimary, 
              textAlign: 'center',
              fontSize: 12,
              fontWeight: '600'
            }}>
              ⚠️ {t('offlineMode', language)}
            </Text>
          </View>
        )}

        <View style={{ width: "100%", alignItems: "center" }}>
          <TouchableOpacity
            onPress={handleCategoryListPress}
            style={[styles.buttonBase, { 
              width: buttonWidth, 
              marginBottom: 13,
              backgroundColor: colors.primary,
              height: 59,
              ...styles.shadowLarge,
            }]}
          >
            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6
            }}>
              {language === 'fa' ? (
                <>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>{t('searchFromList', language)}</Text>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>📋</Text>
                </>
              ) : (
                <>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>📋</Text>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>{t('searchFromList', language)}</Text>
                </>
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSearchByNamePress}
            style={[styles.buttonBase, { 
              width: buttonWidth, 
              marginBottom: 13,
              backgroundColor: colors.primary,
              height: 59,
              ...styles.shadowLarge,
            }]}
          >
            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6
            }}>
              {language === 'fa' ? (
                <>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>{t('search', language)}</Text>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>🔍</Text>
                </>
              ) : (
                <>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>🔍</Text>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>{t('search', language)}</Text>
                </>
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("Home")}
            style={[styles.buttonBase, { 
              width: buttonWidth, 
              marginBottom: 13,
              backgroundColor: colors.secondary,
              height: 59,
              ...styles.shadowLarge,
            }]}
          >
            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6
            }}>
              {language === 'fa' ? (
                <>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>{t('back', language)}</Text>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>↩️</Text>
                </>
              ) : (
                <>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>↩️</Text>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>{t('back', language)}</Text>
                </>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

/* =============== صفحه اصلی گواهینامه‌ها =============== */
function CertificatesMainScreen({ navigation }) {
  const { language } = useLanguage();
  const screenWidth = Dimensions.get("window").width;
  const buttonWidth = screenWidth - 80;
  
  const handleProductCertificatePress = () => {
    navigation.navigate("ProductCertificate");
  };

  const handleQualityCertificatesPress = () => {
    navigation.navigate("QualityCertificates");
  };

  return (
    <SafeAreaView style={{ 
      flex: 1, 
      backgroundColor: colors.background,
    }}>
      <View style={{ 
        flex: 1, 
        justifyContent: "flex-start",
        alignItems: "center", 
        padding: 24,
        paddingTop: 80,
      }}>
        
        <View style={{ 
          alignItems: 'center',
          marginBottom: 40,
        }}>
          <Text style={[styles.heading1, { marginBottom: 8 }]}>
            {t('certificates', language)}
          </Text>
          <Text style={[styles.heading3, { color: colors.textSecondary }]}>
            {language === 'fa' ? "گواهی‌نامه‌های شرکت صنعتی آما" : "Certificates of AMA Industrial Company"}
          </Text>
        </View>

        <View style={{ width: "100%", alignItems: "center" }}>
          <TouchableOpacity
            onPress={handleProductCertificatePress}
            style={[styles.buttonBase, { 
              width: buttonWidth, 
              marginBottom: 13,
              backgroundColor: colors.primary,
              height: 59,
              ...styles.shadowLarge,
            }]}
          >
            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6
            }}>
              {language === 'fa' ? (
                <>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
                    {t('productCertificateButton', language)}
                  </Text>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>📄</Text>
                </>
              ) : (
                <>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>📄</Text>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
                    {t('productCertificateButton', language)}
                  </Text>
                </>
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleQualityCertificatesPress}
            style={[styles.buttonBase, { 
              width: buttonWidth, 
              marginBottom: 13,
              backgroundColor: colors.primary,
              height: 59,
              ...styles.shadowLarge,
            }]}
          >
            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6
            }}>
              {language === 'fa' ? (
                <>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
                    {t('qualityCertificates', language)}
                  </Text>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>📜</Text>
                </>
              ) : (
                <>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>📜</Text>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
                    {t('qualityCertificates', language)}
                  </Text>
                </>
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.buttonBase, { 
              width: buttonWidth, 
              marginBottom: 13,
              backgroundColor: colors.secondary,
              height: 59,
              ...styles.shadowLarge,
            }]}
          >
            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6
            }}>
              {language === 'fa' ? (
                <>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>{t('back', language)}</Text>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>↩️</Text>
                </>
              ) : (
                <>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>↩️</Text>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>{t('back', language)}</Text>
                </>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

/* =============== صفحه گواهینامه محصولات (WebView) =============== */
function ProductCertificateScreen({ navigation }) {
  const { language } = useLanguage();
  const webviewRef = useRef(null);
  const [fileName, setFileName] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("https://dcs.ama-co.com/");
  
  const [showCaptcha, setShowCaptcha] = useState(true);
  const [showWebView, setShowWebView] = useState(false);
  const [captchaQuestion, setCaptchaQuestion] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [timer, setTimer] = useState(30);
  const [captchaError, setCaptchaError] = useState("");
  const [isWebviewReady, setIsWebviewReady] = useState(false);
  
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);
  const [lockTimeLeft, setLockTimeLeft] = useState(0);

  const userAgent =
    Platform.OS === "android"
      ? "Mozilla/5.0 (Linux; Android 14; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36"
      : "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile Safari/605.1.15";

  const generateMathQuestion = () => {
    const operations = ['+', '-', '×'];
    const op = operations[Math.floor(Math.random() * operations.length)];
    let num1, num2, answer;
    
    switch(op) {
      case '+':
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        answer = num1 + num2;
        setCaptchaQuestion(`${num1} + ${num2} = ?`);
        break;
      case '-':
        num1 = Math.floor(Math.random() * 15) + 5;
        num2 = Math.floor(Math.random() * 5) + 1;
        answer = num1 - num2;
        setCaptchaQuestion(`${num1} - ${num2} = ?`);
        break;
      case '×':
        num1 = Math.floor(Math.random() * 5) + 1;
        num2 = Math.floor(Math.random() * 5) + 1;
        answer = num1 * num2;
        setCaptchaQuestion(`${num1} × ${num2} = ?`);
        break;
      default:
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        answer = num1 + num2;
        setCaptchaQuestion(`${num1} + ${num2} = ?`);
    }
    
    setCaptchaAnswer(answer);
    setUserAnswer("");
    setCaptchaError("");
    setTimer(30);
  };

  useEffect(() => {
    let interval;
    if (showCaptcha && timer > 0 && !isLocked) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            handleCancelCaptcha();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showCaptcha, timer, isLocked]);

  useEffect(() => {
    let lockInterval;
    if (isLocked && lockTimeLeft > 0) {
      lockInterval = setInterval(() => {
        setLockTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(lockInterval);
            setIsLocked(false);
            setFailedAttempts(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (lockInterval) clearInterval(lockInterval);
    };
  }, [isLocked, lockTimeLeft]);

  useEffect(() => {
    generateMathQuestion();
  }, []);

  const applyLock = () => {
    let lockDuration = 0;
    
    if (failedAttempts >= 5) {
      lockDuration = 120;
    } else if (failedAttempts >= 4) {
      lockDuration = 60;
    } else if (failedAttempts >= 3) {
      lockDuration = 30;
    }
    
    if (lockDuration > 0) {
      setIsLocked(true);
      setLockTimeLeft(lockDuration);
      setLockTimer(lockDuration);
      setCaptchaError(`${t('captchaError', language)} (${failedAttempts} ${language === 'fa' ? 'بار' : 'times'})`);
      
      setTimeout(() => {
        if (isLocked) {
          setIsLocked(false);
          setFailedAttempts(0);
          setCaptchaError("");
          generateMathQuestion();
        }
      }, lockDuration * 1000);
    }
  };

  const verifyCaptcha = () => {
    if (isLocked) {
      setCaptchaError(`${language === 'fa' ? 'لطفاً' : 'Please'} ${lockTimeLeft} ${language === 'fa' ? 'ثانیه دیگر تلاش کنید' : 'seconds'}`);
      return;
    }
    
    const userAns = parseInt(userAnswer);
    if (isNaN(userAns)) {
      setCaptchaError(language === 'fa' ? "لطفاً یک عدد وارد کنید" : "Please enter a number");
      setUserAnswer("");
      return;
    }
    
    if (userAns === captchaAnswer) {
      setShowCaptcha(false);
      setIsWebviewReady(true);
      setShowWebView(true);
      setFailedAttempts(0);
      setLoading(false);
    } else {
      const newFailedAttempts = failedAttempts + 1;
      setFailedAttempts(newFailedAttempts);
      
      if (newFailedAttempts >= 3) {
        applyLock();
      } else {
        setCaptchaError(`${t('captchaError', language)} (${newFailedAttempts} ${language === 'fa' ? 'بار' : 'times'})`);
      }
      
      setUserAnswer("");
    }
  };

  const handleCancelCaptcha = () => {
    navigation.goBack();
  };

  const handleNewQuestion = () => {
    if (isLocked) {
      setCaptchaError(`${language === 'fa' ? 'لطفاً' : 'Please'} ${lockTimeLeft} ${language === 'fa' ? 'ثانیه دیگر تلاش کنید' : 'seconds'}`);
      return;
    }
    
    generateMathQuestion();
    setCaptchaError("");
  };

  const initialJS = `
    (function removeNewCertificateButtonImmediately() {
      document.addEventListener('DOMContentLoaded', function() {
        const buttons = document.querySelectorAll('button, input[type="submit"], input[type="button"], a');
        buttons.forEach(btn => {
          const btnText = (btn.textContent || btn.value || btn.innerText || '').trim();
          if (btnText.includes('استعلام گواهینامه جدید') || 
              btnText.includes('گواهینامه جدید') ||
              btnText.includes('استعلام جدید')) {
            if (btn.parentNode) {
              btn.parentNode.removeChild(btn);
            }
          }
        });
        
        const selectorsToRemove = [
          '#new-certificate-btn',
          '.new-certificate-btn',
          '[href*="new-certificate"]',
          '[href*="new_certificate"]',
          '[onclick*="newCertificate"]'
        ];
        
        selectorsToRemove.forEach(sel => {
          const elements = document.querySelectorAll(sel);
          elements.forEach(el => {
            if (el.parentNode) {
              el.parentNode.removeChild(el);
            }
          });
        });
      });
      
      setTimeout(function() {
        const allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
          const text = (el.textContent || el.innerText || '').toLowerCase();
          if (text.includes('استعلام گواهینامه جدید') || 
              text.includes('گواهینامه جدید') ||
              text.includes('استعلام جدید')) {
            el.style.display = 'none';
            el.style.visibility = 'hidden';
            el.style.opacity = '0';
            el.style.height = '0';
            el.style.padding = '0';
            el.style.margin = '0';
            el.style.border = '0';
          }
        });
      }, 10);
    })();
    
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflowX = 'hidden';
    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';
    
    const limitFontsEarly = () => {
      const style = document.createElement('style');
      style.id = 'font-limiter-css';
      style.textContent = \`
        * {
          max-font-size: 20px !important;
        }
        h1, h2, h3, h4, h5, h6 {
          font-size: 20px !important;
          font-weight: bold !important;
        }
        .large-text, .big-font, .title, .heading {
          font-size: 20px !important;
        }
        table, td, th {
          font-size: 14px !important;
        }
        body * {
          font-size: 16px !important;
        }
      \`;
      document.head.appendChild(style);
      
      const allElements = document.querySelectorAll('body *');
      allElements.forEach(el => {
        const tagName = el.tagName.toLowerCase();
        if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName)) {
          el.style.fontSize = '20px';
          el.style.fontWeight = 'bold';
        }
      });
    };
    
    limitFontsEarly();
    
    const hideQuick = () => {
      const quickSelectors = ['header', 'footer', '#wpadminbar', '.site-header, .site-footer'];
      quickSelectors.forEach(sel => {
        const elements = document.querySelectorAll(sel);
        elements.forEach(el => {
          el.style.display = 'none';
          el.style.visibility = 'hidden';
          el.style.height = '0';
          el.style.overflow = 'hidden';
        });
      });
    };
    
    hideQuick();
    true;
  `;

  const fontFixerJS = `
    (function() {
      const enforceFontLimits = () => {
        document.body.style.opacity = '0';
        document.body.style.visibility = 'hidden';
        
        const allElements = document.querySelectorAll('*');
        
        allElements.forEach(el => {
          try {
            const computedStyle = window.getComputedStyle(el);
            const fontSize = computedStyle.fontSize;
            
            if (fontSize && fontSize.endsWith('px')) {
              const fontSizeNumber = parseFloat(fontSize);
              
              if (fontSizeNumber > 20) {
                el.style.setProperty('font-size', '20px', 'important');
                el.style.setProperty('line-height', '1.4', 'important');
                
                const tagName = el.tagName.toLowerCase();
                if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName)) {
                  el.style.setProperty('font-weight', 'bold', 'important');
                  el.style.setProperty('margin', '10px 0', 'important');
                  el.style.setProperty('text-align', 'center', 'important');
                }
              }
            }
          } catch(e) {
          }
          
          const inlineFontSize = el.style.fontSize;
          if (inlineFontSize) {
            const match = inlineFontSize.match(/(\\d+)/);
            if (match) {
              const fontSizeNum = parseInt(match[0]);
              if (fontSizeNum > 20) {
                el.style.setProperty('font-size', '20px', 'important');
              }
            }
          }
        });
        
        const largeTextElements = document.querySelectorAll('h1, h2, h3, .large-text, .big-font, .title, .heading, .entry-title, .post-title');
        largeTextElements.forEach(el => {
          el.style.setProperty('font-size', '20px', 'important');
          el.style.setProperty('font-weight', 'bold', 'important');
          el.style.setProperty('text-align', 'center', 'important');
          el.style.setProperty('margin', '10px 0', 'important');
          el.style.setProperty('padding', '0', 'important');
        });
        
        const tables = document.querySelectorAll('table');
        tables.forEach(table => {
          table.style.setProperty('font-size', '14px', 'important');
          
          const cells = table.querySelectorAll('td, th');
          cells.forEach(cell => {
            cell.style.setProperty('font-size', '14px', 'important');
            cell.style.setProperty('padding', '8px', 'important');
          });
        });
        
        setTimeout(() => {
          document.body.style.opacity = '1';
          document.body.style.visibility = 'visible';
        }, 50);
      };
      
      enforceFontLimits();
      
      document.addEventListener('DOMContentLoaded', enforceFontLimits);
      
      window.addEventListener('load', enforceFontLimits);
      
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.addedNodes.length) {
            enforceFontLimits();
          }
        });
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      
      true;
    })();
  `;

  const mainJS = `
    (function() {
      const removeHeaderFooter = () => {
        const selectors = [
          'header', 'footer', '#wpadminbar', '.site-header', '.site-footer',
          '#header', '#footer', '.main-header', '.main-footer',
          '.header', '.footer', '.top-bar', '.bottom-bar',
          '.navbar', '.nav-bar', '.main-nav',
          '.sidebar', '#sidebar', '.widget-area',
          '.gform_heading', '.gform_description'
        ];
        
        selectors.forEach(sel => {
          const elements = document.querySelectorAll(sel);
          elements.forEach(el => {
            if (el.parentNode) {
              el.parentNode.removeChild(el);
            }
          });
        });
        
        const hideNewCertificateButtons = () => {
          const allElements = document.querySelectorAll('button, input, a, .btn, [type="submit"]');
          allElements.forEach(el => {
            const text = (el.textContent || el.value || el.innerText || el.title || '').trim();
            if (text.includes('استعلام گواهینامه جدید') || 
                text.includes('گواهینامه جدید') ||
                text.includes('استعلام جدید')) {
              el.style.display = 'none';
              el.style.visibility = 'hidden';
              el.style.opacity = '0';
              el.style.height = '0';
              el.style.padding = '0';
              el.style.margin = '0';
              el.style.border = '0';
              el.style.position = 'absolute';
              el.style.left = '-9999px';
              
              if (el.parentNode) {
                el.parentNode.removeChild(el);
              }
            }
          });
          
          const divs = document.querySelectorAll('div');
          divs.forEach(div => {
            const text = (div.textContent || div.innerText || '').trim();
            if (text.includes('استعلام گواهینامه جدید') || 
                text.includes('گواهینامه جدید') ||
                text.includes('استعلام جدید')) {
              const buttonsInDiv = div.querySelectorAll('button, input, a');
              buttonsInDiv.forEach(btn => {
                btn.style.display = 'none';
                btn.style.visibility = 'hidden';
                if (btn.parentNode) {
                  btn.parentNode.removeChild(btn);
                }
              });
            }
          });
        };
        
        hideNewCertificateButtons();
      };
      
      const setupMainContent = () => {
        const mainElements = document.querySelectorAll('.site-content, #content, main, .content-area, .gform_wrapper');
        mainElements.forEach(el => {
          el.style.width = '100%';
          el.style.maxWidth = '100%';
          el.style.margin = '0 auto';
          el.style.padding = '20px 15px';
          el.style.boxSizing = 'border-box';
          el.style.minHeight = '100vh';
        });
        
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
          form.style.width = '100%';
          form.style.maxWidth = '500px';
          form.style.margin = '0 auto';
          form.style.padding = '20px';
          form.style.boxSizing = 'border-box';
        });
      };
      
      const setupFormFields = () => {
        const textInputs = document.querySelectorAll('input[type="text"], input[type="search"]');
        textInputs.forEach(input => {
          input.style.width = '100%';
          input.style.maxWidth = '100%';
          input.style.boxSizing = 'border-box';
          input.style.display = 'block';
          input.style.padding = '12px 15px';
          input.style.margin = '10px 0';
          input.style.border = '1px solid #ccc';
          input.style.borderRadius = '6px';
          input.style.fontSize = '16px';
        });
        
        const selects = document.querySelectorAll('select');
        selects.forEach(select => {
          select.style.width = '100%';
          select.style.maxWidth = '100%';
          select.style.boxSizing = 'border-box';
          select.style.display = 'block';
          select.style.padding = '12px 15px';
          select.style.margin = '10px 0';
          select.style.border = '1px solid #ccc';
          select.style.borderRadius = '6px';
          select.style.fontSize = '16px';
        });
        
        const textareas = document.querySelectorAll('textarea');
        textareas.forEach(textarea => {
          textarea.style.width = '100%';
          textarea.style.maxWidth = '100%';
          textarea.style.boxSizing = 'border-box';
          textarea.style.display = 'block';
          textarea.style.padding = '12px 15px';
          textarea.style.margin = '10px 0';
          textarea.style.border = '1px solid #ccc';
          textarea.style.borderRadius = '6px';
          textarea.style.fontSize = '16px';
          textarea.style.resize = 'vertical';
        });
        
        const buttons = document.querySelectorAll('button, input[type="submit"], input[type="button"]');
        buttons.forEach(button => {
          const btnText = (button.textContent || button.value || '').toLowerCase();
          if (btnText.includes('استعلام گواهینامه جدید') || 
              btnText.includes('گواهینامه جدید') ||
              btnText.includes('استعلام جدید')) {
            button.style.display = 'none';
            button.style.visibility = 'hidden';
            button.style.opacity = '0';
            button.style.height = '0';
            button.style.padding = '0';
            button.style.margin = '0';
            button.style.border = '0';
            return;
          }
          
          button.style.width = '100%';
          button.style.maxWidth = '100%';
          button.style.boxSizing = 'border-box';
          button.style.display = 'block';
          button.style.padding = '15px';
          button.style.margin = '15px 0';
          button.style.fontSize = '16px';
          button.style.fontWeight = 'bold';
          button.style.borderRadius = '8px';
          button.style.cursor = 'pointer';
          button.style.textAlign = 'center';
          
          if (btnText.includes('بررسی') || btnText.includes('چک') || btnText.includes('جستجو')) {
            button.style.backgroundColor = '#74c0fc';
            button.style.color = 'white';
            button.style.border = 'none';
            button.style.fontSize = '18px';
            button.style.padding = '18px';
          } else {
            button.style.backgroundColor = '#6c757d';
            button.style.color = 'white';
            button.style.border = 'none';
          }
        });
        
        const labels = document.querySelectorAll('label');
        labels.forEach(label => {
          label.style.display = 'block';
          label.style.marginBottom = '8px';
          label.style.fontWeight = 'bold';
          label.style.fontSize = '16px';
        });
      };
      
      removeHeaderFooter();
      setupMainContent();
      setupFormFields();
      
      setTimeout(() => {
        removeHeaderFooter();
        setupMainContent();
        setupFormFields();
      }, 1000);
      
      const scanForDownloadLinks = () => {
        const links = document.querySelectorAll('a');
        links.forEach(a => {
          if (a.href && (a.href.includes('gf-download') || a.href.includes('index.php?gf-download'))) {
            const name = a.textContent.trim() || a.href.split('/').pop();
            if (name && a.href) {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                name: name,
                url: a.href
              }));
            }
          }
        });
      };
      
      scanForDownloadLinks();
      setInterval(scanForDownloadLinks, 3000);
      
      true;
    })();
  `;

  const injectStepByStep = () => {
    if (webviewRef.current) {
      webviewRef.current.injectJavaScript(initialJS);
    }
    
    setTimeout(() => {
      if (webviewRef.current) {
        webviewRef.current.injectJavaScript(fontFixerJS);
      }
    }, 100);
    
    setTimeout(() => {
      if (webviewRef.current) {
        webviewRef.current.injectJavaScript(mainJS);
      }
    }, 300);
    
    setTimeout(() => {
      if (webviewRef.current) {
        webviewRef.current.injectJavaScript(fontFixerJS);
        webviewRef.current.injectJavaScript(mainJS);
      }
    }, 1000);
    
    setTimeout(() => {
      if (webviewRef.current) {
        webviewRef.current.injectJavaScript(`
          (function() {
            const finalCheck = () => {
              const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, .large-text, .big-font');
              elements.forEach(el => {
                el.style.setProperty('font-size', '20px', 'important');
                el.style.setProperty('max-font-size', '20px', 'important');
              });
              
              const finalStyle = document.createElement('style');
              finalStyle.textContent = \`
                body * {
                  max-font-size: 20px !important;
                }
                h1 { font-size: 20px !important; }
                h2 { font-size: 20px !important; }
                h3 { font-size: 20px !important; }
                h4 { font-size: 20px !important; }
                h5 { font-size: 20px !important; }
                h6 { font-size: 20px !important; }
              \`;
              document.head.appendChild(finalStyle);
            };
            
            finalCheck();
            setTimeout(finalCheck, 500);
          })();
          true;
        `);
      }
    }, 2000);
    
    setTimeout(() => {
      if (webviewRef.current) {
        webviewRef.current.injectJavaScript(`
          (function() {
            const hideNewCertificateBtn = () => {
              const allElements = document.querySelectorAll('button, input, a, .btn, [type="submit"]');
              allElements.forEach(el => {
                const text = (el.textContent || el.value || el.innerText || el.title || '').trim();
                if (text.includes('استعلام گواهینامه جدید') || 
                    text.includes('گواهینامه جدید') ||
                    text.includes('استعلام جدید')) {
                  el.style.display = 'none';
                  el.style.visibility = 'hidden';
                  el.style.opacity = '0';
                  el.style.height = '0';
                  el.style.padding = '0';
                  el.style.margin = '0';
                  el.style.border = '0';
                  el.style.position = 'absolute';
                  el.style.left = '-9999px';
                  
                  if (el.parentNode) {
                    el.parentNode.removeChild(el);
                  }
                }
              });
              
              const divs = document.querySelectorAll('div');
              divs.forEach(div => {
                const text = (div.textContent || div.innerText || '').trim();
                if (text.includes('استعلام گواهینامه جدید') || 
                    text.includes('گواهینامه جدید') ||
                    text.includes('استعلام جدید')) {
                  const buttonsInDiv = div.querySelectorAll('button, input, a');
                  buttonsInDiv.forEach(btn => {
                    btn.style.display = 'none';
                    btn.style.visibility = 'hidden';
                    if (btn.parentNode) {
                      btn.parentNode.removeChild(btn);
                    }
                  });
                }
              });
            };
            
            hideNewCertificateBtn();
            setTimeout(hideNewCertificateBtn, 500);
            setTimeout(hideNewCertificateBtn, 2000);
          })();
          true;
        `);
      }
    }, 3000);
  };

  const onMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if(data.url && data.name){
        setFileUrl(data.url);
        setFileName(data.name);
      }
    } catch (e) {
      console.log("Error parsing message", e);
    }
  };

  const openInBrowser = () => {
    if(fileUrl){
      Linking.openURL(fileUrl);
    }
  };

  const handleGoBack = () => {
    if (webviewRef.current && canGoBack) {
      webviewRef.current.goBack();
      setFileUrl(null);
      setFileName(null);
    }
  };

  const handleNavigationStateChange = (navState) => {
    setCanGoBack(navState.canGoBack);
    setCurrentUrl(navState.url);
    
    if (navState.url !== currentUrl) {
      if (!navState.url.includes('gf-download')) {
        setFileUrl(null);
        setFileName(null);
      }
    }
  };

  useEffect(() => {
    if (canGoBack && fileUrl) {
      if (!currentUrl.includes('dcs.ama-co.com')) {
        setFileUrl(null);
        setFileName(null);
      }
    }
  }, [canGoBack, currentUrl]);

  const pageStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      backgroundColor: colors.primary,
      paddingTop: Platform.OS === "ios" ? 50 : 45,
      paddingBottom: 20,
      paddingHorizontal: 15,
      alignItems: "center",
      justifyContent: "center",
      borderBottomWidth: 2,
      borderBottomColor: colors.primaryDark,
      ...styles.shadowMedium,
    },
    headerTitle: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    webviewContainer: {
      flex: 1,
    },
    loadingContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: '#fff',
    },
    loadingOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      zIndex: 1000,
    },
    loadingText: {
      marginTop: 15,
      fontSize: 16,
      color: "#333",
      textAlign: "center",
    },
    bottomButtonsContainer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      paddingHorizontal: 20,
      paddingBottom: Platform.OS === "ios" ? 45 : 45,
      backgroundColor: "transparent",
    },
    bottomButton: {
      backgroundColor: colors.secondary,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 14,
      paddingHorizontal: 20,
      borderRadius: 10,
      ...styles.shadowMedium,
      marginBottom: 10,
    },
    bottomButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
    modalContainer: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    captchaModal: {
      backgroundColor: "white",
      borderRadius: 15,
      padding: 25,
      width: '100%',
      maxWidth: 400,
      ...styles.shadowLarge,
    },
    lockContainer: {
      alignItems: "center",
      padding: 20,
    },
    lockTitle: {
      fontSize: 22,
      fontWeight: "bold",
      color: colors.danger,
      marginBottom: 10,
      textAlign: "center",
    },
    lockText: {
      fontSize: 16,
      color: colors.textPrimary,
      marginBottom: 8,
      textAlign: "center",
    },
    lockTimer: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.danger,
      marginBottom: 15,
      textAlign: "center",
    },
    lockMessage: {
      fontSize: 14,
      color: colors.textSecondary,
      fontStyle: "italic",
      textAlign: "center",
    },
    timerContainer: {
      backgroundColor: colors.warning,
      padding: 12,
      borderRadius: 10,
      marginBottom: 25,
      alignItems: "center",
    },
    timerText: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.textPrimary,
    },
    attemptsText: {
      fontSize: 14,
      color: colors.danger,
      marginTop: 5,
      fontWeight: "bold",
    },
    questionContainer: {
      alignItems: "center",
      marginBottom: 25,
    },
    questionText: {
      fontSize: 18,
      color: colors.textPrimary,
      marginBottom: 15,
      textAlign: "center",
    },
    mathQuestion: {
      fontSize: 32,
      fontWeight: "bold",
      color: colors.primary,
      textAlign: "center",
    },
    answerInput: {
      borderWidth: 2,
      borderColor: colors.primary,
      borderRadius: 10,
      padding: 15,
      fontSize: 20,
      textAlign: "center",
      marginBottom: 20,
      backgroundColor: colors.background,
      color: colors.textPrimary,
    },
    disabledInput: {
      backgroundColor: colors.border,
      borderColor: colors.textLight,
      color: colors.textLight,
    },
    errorText: {
      color: colors.danger,
      fontSize: 16,
      textAlign: "center",
      marginBottom: 20,
      fontWeight: "bold",
    },
    lockErrorText: {
      color: colors.danger,
      fontSize: 18,
      backgroundColor: colors.background,
      padding: 10,
      borderRadius: 8,
    },
    topButtonsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 15,
    },
    captchaActionButton: {
      paddingVertical: 15,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      ...styles.shadowMedium,
    },
    confirmButton: {
      backgroundColor: colors.success,
      flex: 1,
      marginRight: 7.5,
    },
    newQuestionButton: {
      backgroundColor: colors.accent,
      flex: 1,
      marginLeft: 7.5,
    },
    disabledButton: {
      backgroundColor: colors.textLight,
    },
    cancelButton: {
      backgroundColor: colors.danger,
      width: "100%",
    },
    captchaActionButtonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold",
    },
  });

  return (
    <SafeAreaView style={pageStyles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showCaptcha}
        onRequestClose={handleCancelCaptcha}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={pageStyles.modalContainer}
        >
          <ScrollView 
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={pageStyles.captchaModal}>
              {isLocked ? (
                <View style={pageStyles.lockContainer}>
                  <Text style={pageStyles.lockTitle}>⏳ {t('captchaLocked', language)}</Text>
                  <Text style={pageStyles.lockText}>
                    {language === 'fa' ? 'شما' : 'You'} {failedAttempts} {language === 'fa' ? 'بار پاسخ اشتباه داده‌اید' : 'wrong answers'}
                  </Text>
                  <Text style={pageStyles.lockTimer}>
                    {lockTimeLeft} {t('seconds', language)}
                  </Text>
                  <Text style={pageStyles.lockMessage}>
                    {t('captchaLockMessage', language)}
                  </Text>
                </View>
              ) : (
                <>
                  <View style={pageStyles.timerContainer}>
                    <Text style={pageStyles.timerText}>{t('captchaTimeLeft', language)}: {timer} {t('seconds', language)}</Text>
                    {failedAttempts > 0 && (
                      <Text style={pageStyles.attemptsText}>
                        ({failedAttempts} {language === 'fa' ? 'بار اشتباه' : 'wrong'})
                      </Text>
                    )}
                  </View>
                  
                  <View style={pageStyles.questionContainer}>
                    <Text style={pageStyles.questionText}>
                      {language === 'fa' ? 'لطفاً پاسخ سوال زیر را وارد کنید:' : 'Please enter the answer:'}
                    </Text>
                    <Text style={pageStyles.mathQuestion}>{captchaQuestion}</Text>
                  </View>
                  
                  <TextInput
                    style={[
                      pageStyles.answerInput,
                      isLocked && pageStyles.disabledInput
                    ]}
                    placeholder={isLocked ? `${t('captchaLocked', language)} - ${lockTimeLeft} ${t('seconds', language)}` : t('enterCaptchaAnswer', language)}
                    value={userAnswer}
                    onChangeText={setUserAnswer}
                    keyboardType="numeric"
                    autoFocus={!isLocked}
                    editable={!isLocked}
                    selectTextOnFocus={!isLocked}
                  />
                  
                  {captchaError ? (
                    <Text style={[
                      pageStyles.errorText,
                      isLocked && pageStyles.lockErrorText
                    ]}>{captchaError}</Text>
                  ) : null}
                  
                  <View style={pageStyles.topButtonsContainer}>
                    <TouchableOpacity 
                      style={[
                        pageStyles.captchaActionButton, 
                        pageStyles.newQuestionButton,
                        isLocked && pageStyles.disabledButton
                      ]}
                      onPress={handleNewQuestion}
                      disabled={isLocked}
                    >
                      <Text style={pageStyles.captchaActionButtonText}>
                        {isLocked ? t('captchaLocked', language) : t('newQuestion', language)}
                      </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[
                        pageStyles.captchaActionButton, 
                        pageStyles.confirmButton,
                        isLocked && pageStyles.disabledButton
                      ]}
                      onPress={verifyCaptcha}
                      disabled={isLocked}
                    >
                      <Text style={pageStyles.captchaActionButtonText}>
                        {isLocked ? t('captchaLocked', language) : t('confirm', language)}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  
                  <TouchableOpacity 
                    style={[pageStyles.captchaActionButton, pageStyles.cancelButton]}
                    onPress={handleCancelCaptcha}
                  >
                    <Text style={pageStyles.captchaActionButtonText}>{t('cancel', language)}</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>

      {showWebView && (
        <>
          <View style={pageStyles.header}>
            <Text style={pageStyles.headerTitle}>
              {language === 'fa' ? 'گواهینامه محصولات شرکت صنعتی آما' : 'Product Certificates - AMA Industrial Company'}
            </Text>
          </View>

          <View style={pageStyles.webviewContainer}>
            <WebView
              ref={webviewRef}
              source={{ uri: "https://dcs.ama-co.com/" }}
              style={{ flex: 1 }}
              userAgent={userAgent}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              injectedJavaScript={initialJS}
              onMessage={onMessage}
              onLoadStart={() => {
                setLoading(true);
                if (webviewRef.current) {
                  webviewRef.current.injectJavaScript(initialJS);
                }
              }}
              onLoadProgress={({ nativeEvent }) => {
                if (nativeEvent.progress > 0.2 && webviewRef.current) {
                  webviewRef.current.injectJavaScript(fontFixerJS);
                }
                
                if (nativeEvent.progress > 0.4 && webviewRef.current) {
                  webviewRef.current.injectJavaScript(mainJS);
                }
              }}
              onLoadEnd={() => {
                setLoading(false);
                injectStepByStep();
              }}
              onNavigationStateChange={handleNavigationStateChange}
              onError={(syntheticEvent) => {
                setLoading(false);
                console.warn('WebView error: ', syntheticEvent.nativeEvent);
              }}
              onHttpError={(syntheticEvent) => {
                console.warn('HTTP error: ', syntheticEvent.nativeEvent.statusCode);
              }}
              startInLoadingState={true}
              renderLoading={() => (
                <View style={pageStyles.loadingContainer}>
                  <ActivityIndicator size="large" color={colors.primary} />
                  <Text style={pageStyles.loadingText}>{t('loading', language)}</Text>
                </View>
              )}
            />
          </View>

          {loading && (
            <View style={pageStyles.loadingOverlay}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={pageStyles.loadingText}>{t('loading', language)}</Text>
            </View>
          )}

          {showWebView && (
            <View style={pageStyles.bottomButtonsContainer}>
              {fileUrl && (
                <TouchableOpacity 
                  style={pageStyles.bottomButton} 
                  onPress={openInBrowser}
                >
                  <Text style={pageStyles.bottomButtonText}>{t('downloadCertificate', language)}</Text>
                </TouchableOpacity>
              )}
              
              {canGoBack && (
                <TouchableOpacity 
                  style={pageStyles.bottomButton} 
                  onPress={handleGoBack}
                >
                  <Text style={pageStyles.bottomButtonText}>{t('goBack', language)}</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
}

/* =============== صفحه گواهینامه‌های سیستم مدیریت کیفیت =============== */
function QualityCertificatesScreen({ navigation }) {
  const { language } = useLanguage();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [imageHeight, setImageHeight] = useState(300);
  const [error, setError] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    loadCertificates();
    setPortraitOrientation();

    return () => unsubscribe();
  }, []);

  const loadCertificates = async () => {
    if (!isConnected) {
      setError(true);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(false);

      const response = await fetch(CERTIFICATES_CSV_URL);
      
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      
      const csvText = await response.text();
      const rows = parseCSV(csvText);
      
      if (!rows || rows.length < 2) {
        setCertificates([]);
        return;
      }
      
      const certsData = rows.slice(1).map((row, index) => {
        // ستون 0: certificate-name (نام گواهینامه)
        // ستون 1: button-height (ارتفاع دکمه)
        // ستون 2: image-name (نام فایل تصویر)
        // ستون 3: version (نسخه)
        
        const certificateName = row[0]?.trim() || '';
        const buttonHeight = row[1]?.trim() || '90';
        const imageName = row[2]?.trim() || '';
        const version = row[3]?.trim() || '1';
        
        if (!certificateName || !imageName) return null;
        
        return {
          id: `cert-${index}`,
          name: certificateName,
          imageName: imageName,
          version: version,
          buttonHeight: parseInt(buttonHeight) || 90
        };
      }).filter(cert => cert !== null);
      
      setCertificates(certsData);

    } catch (error) {
      console.error("Certificates load error:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const getCertificateImageUrl = (certificate) => {
    if (!certificate || !certificate.imageName) {
      return null;
    }
    
    const cleanImageName = certificate.imageName.trim();
    let imageName = cleanImageName;
    
    if (!imageName.toLowerCase().endsWith('.jpg') && 
        !imageName.toLowerCase().endsWith('.jpeg') &&
        !imageName.toLowerCase().endsWith('.png')) {
      imageName += '.jpg';
    }
    
    return CERTIFICATES_IMAGES_BASE_URL + encodeURIComponent(imageName);
  };

  const handleCertificatePress = async (certificate) => {
    try {
      const imageUrl = getCertificateImageUrl(certificate);
      
      if (imageUrl) {
        Image.getSize(
          imageUrl,
          (width, height) => {
            const screenWidth = Dimensions.get('window').width - 40;
            const calculatedHeight = Math.max(300, screenWidth * (height / width));
            setImageHeight(calculatedHeight);
            setSelectedCertificate({
              ...certificate,
              imageUrl: imageUrl
            });
          },
          () => {
            setImageHeight(400);
            setSelectedCertificate({
              ...certificate,
              imageUrl: imageUrl
            });
          }
        );
      } else {
        setSelectedCertificate({
          ...certificate,
          imageUrl: null
        });
      }
    } catch (error) {
      console.error("Certificate load error:", error);
      setSelectedCertificate({
        ...certificate,
        imageUrl: null
      });
    }
  };

  const handleRetry = () => {
    setLoading(true);
    setError(false);
    loadCertificates();
  };

  const RenderFooter = () => (
    <View style={{ marginTop: 20, marginBottom: 40 }}>
      <TouchableOpacity 
        onPress={() => navigation.navigate("Home")} 
        style={[styles.buttonBase, { 
          width: "100%",
          backgroundColor: colors.primary,
          height: 53,
          ...styles.shadowMedium,
        }]}
      >
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>{t('home', language)}</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={{ 
        flex: 1, 
        backgroundColor: colors.background,
      }}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.body, { marginTop: 16 }]}>{t('loading', language)}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={{ 
        flex: 1, 
        backgroundColor: colors.background,
      }}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24 }}>
          <Text style={[styles.heading2, { color: colors.danger, marginBottom: 16 }]}>
            {t('error', language)}
          </Text>
          <Text style={[styles.body, { textAlign: 'center', marginBottom: 24 }]}>
            {!isConnected 
              ? t('noInternet', language)
              : language === 'fa' 
                ? "متأسفانه در بارگذاری گواهینامه‌ها مشکلی پیش آمده است."
                : "Unfortunately, there was a problem loading the certificates."
            }
          </Text>
          {isConnected && (
            <TouchableOpacity
              onPress={handleRetry}
              style={[styles.buttonBase, { 
                backgroundColor: colors.primary,
                ...styles.shadowMedium,
              }]}
            >
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>{t('retry', language)}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.buttonBase, { 
              backgroundColor: colors.secondary,
              marginTop: 16,
              ...styles.shadowMedium,
            }]}
          >
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>{t('back', language)}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (selectedCertificate) {
    return (
      <SafeAreaView style={{ 
        flex: 1, 
        backgroundColor: colors.background,
      }}>
        <ScrollView 
          contentContainerStyle={{ 
            alignItems: "center", 
            padding: 20,
            paddingBottom: 40
          }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ 
            width: '100%', 
            marginBottom: 16,
            alignItems: 'center',
            marginTop: 45,
          }}>
            <Text style={[styles.heading2, { 
              color: colors.primary,
              marginBottom: 8,
              textAlign: 'center'
            }]}>
              {selectedCertificate.name}
            </Text>
          </View>

          {selectedCertificate.imageUrl ? (
            <View style={{ 
              width: '100%',
              borderRadius: 16,
              backgroundColor: colors.background,
              ...styles.shadowLarge,
              marginBottom: 20,
              overflow: 'hidden',
            }}>
              <ZoomableImage
                source={{ uri: selectedCertificate.imageUrl }}
                style={{ 
                  width: '100%',
                  height: imageHeight,
                }}
                resizeMode="contain"
                productName={selectedCertificate.name}
                isCertificate={true}
                language={language}
              />
            </View>
          ) : (
            <View style={[styles.card, { 
              width: '100%',
              height: 200,
              justifyContent: 'center', 
              alignItems: 'center',
              ...styles.shadowMedium,
              marginBottom: 20,
            }]}>
              <Text style={[styles.body, { textAlign: 'center', color: colors.danger, marginBottom: 8 }]}>
                ⚠️ {t('noImageAvailable', language)}
              </Text>
              <Text style={[styles.caption, { textAlign: 'center' }]}>
                {language === 'fa' ? 'نام:' : 'Name:'} {selectedCertificate.name}
              </Text>
            </View>
          )}

          <View style={{ 
            flexDirection: "row", 
            justifyContent: "space-between", 
            width: "100%", 
          }}>
            <TouchableOpacity 
              onPress={() => setSelectedCertificate(null)} 
              style={[styles.buttonBase, { 
                width: '48%',
                backgroundColor: colors.primary,
                height: 53,
                ...styles.shadowMedium,
              }]}
            >
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>{t('back', language)}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => navigation.navigate("Home")} 
              style={[styles.buttonBase, { 
                width: '48%',
                backgroundColor: colors.primary,
                height: 53,
                ...styles.shadowMedium,
              }]}
            >
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>{t('home', language)}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ 
      flex: 1, 
      backgroundColor: colors.background,
    }}>
      <View style={{ 
        flex: 1, 
        padding: 20,
      }}>
        <Text style={[styles.heading2, { 
          marginBottom: 30,
          color: colors.primary,
          textAlign: 'center',
          marginTop: 45
        }]}>
          📜 {t('qualityCertificates', language)}
        </Text>

        {certificates.length === 0 ? (
          <View style={[styles.card, { alignItems: 'center', padding: 24, ...styles.shadowMedium }]}>
            <Text style={[styles.body, { textAlign: 'center', marginBottom: 16 }]}>
              {language === 'fa' ? "هیچ گواهینامه‌ای یافت نشد" : "No certificates found"}
            </Text>
            {isConnected && (
              <TouchableOpacity 
                onPress={loadCertificates}
                style={[styles.buttonBase, { 
                  backgroundColor: colors.primary,
                  ...styles.shadowSmall,
                }]}
              >
                <Text style={{ color: "#fff", fontSize: 14, fontWeight: "600" }}>{t('retry', language)}</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              onPress={() => navigation.goBack()} 
              style={[styles.buttonBase, { 
                width: "100%",
                backgroundColor: colors.primary,
                height: 53,
                marginTop: 20,
                ...styles.shadowMedium,
              }]}
            >
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>{t('back', language)}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={certificates}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => handleCertificatePress(item)}
                style={[{
                  backgroundColor: colors.surface,
                  borderRadius: 16,
                  padding: 20,
                  marginBottom: 12,
                  borderRightWidth: 6,
                  borderRightColor: index % 3 === 0 ? colors.primary : 
                                   index % 3 === 1 ? colors.secondary : colors.accent,
                  height: item.buttonHeight || 80,
                  minHeight: 80,
                  ...styles.shadowMedium,
                }]}
              >
                <View style={{ 
                  flexDirection: 'row', 
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flex: 1,
                  height: '100%',
                }}>
                  <View style={{ 
                    flex: 1,
                    marginRight: 12,
                    justifyContent: 'center',
                  }}>
                    <Text style={[styles.heading3, { 
                      color: colors.textPrimary,
                      textAlign: language === 'fa' ? 'right' : 'left',
                      lineHeight: 24
                    }]}>
                      {item.name}
                    </Text>
                    
                    <Text style={[styles.caption, { 
                      color: colors.primary,
                      textAlign: language === 'fa' ? 'left' : 'right',
                      marginTop: 8
                    }]}>
                      {language === 'fa' ? '← مشاهده گواهینامه' : 'View Certificate →'}
                    </Text>
                  </View>
                  
                  <View style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: index % 3 === 0 ? colors.primaryLight : 
                                     index % 3 === 1 ? colors.secondaryLight : colors.accentLight,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexShrink: 0,
                    alignSelf: 'center',
                  }}>
                    <Text style={{ color: colors.surface, fontSize: 16, fontWeight: 'bold' }}>
                      {index + 1}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ 
              paddingBottom: 20
            }}
            ListFooterComponent={RenderFooter}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

/* =============== صفحه SearchByNameScreen =============== */
function SearchByNameScreen({ navigation }) {
  const { language } = useLanguage();
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageHeight, setImageHeight] = useState(200);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  const debounced = useDebounce(query, 200);
  const screenWidth = Dimensions.get("window").width;
  const textBoxWidth = screenWidth - 40;
  const animatedValues = useRef([]).current;

  function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    
    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      
      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);
    
    return debouncedValue;
  }

  useEffect(() => {
    // بررسی اتصال اینترنت
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    setPortraitOrientation();
    
    loadProducts();

    return () => unsubscribe();
  }, [language]);

  useEffect(() => {
    if (debounced && debounced.length > 0) {
      const filtered = products.filter((p) => 
        (p.name || "").toLowerCase().includes(debounced.toLowerCase()) ||
        (p.subItem || "").toLowerCase().includes(debounced.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);

      animatedValues.length = filtered.length;
      filtered.forEach((_, i) => {
        animatedValues[i] = new RNAnimated.Value(0);
        RNAnimated.timing(animatedValues[i], { 
          toValue: 1, 
          duration: 600,
          delay: i * 150,
          useNativeDriver: true 
        }).start();
      });
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setSelected(null);
    }
  }, [debounced, products]);

  useEffect(() => {
    if (selected && selected.imageUrl) {
      Image.getSize(
        selected.imageUrl,
        (w, h) => {
          setImageHeight(textBoxWidth * (h / w));
        },
        () => {
          setImageHeight(textBoxWidth);
        }
      );
      
      if (selected.imageUrl) {
        Image.prefetch(selected.imageUrl).catch(() => {});
      }
    }
  }, [selected]);

  const loadProducts = async () => {
    if (!isConnected) {
      setError(true);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(false);
      
      const data = await fetchProductsFromAPI(language);
      setProducts(data);
    } catch (e) {
      console.error("Products load error:", e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setLoading(true);
    setError(false);
    loadProducts();
  };

  const handleSelectProduct = async (item) => {
    setSelected(item);
    setQuery(item.subItem || item.name);
    setShowSuggestions(false);
    
    // فقط URL تصویر را تنظیم می‌کنیم - بدون دانلود
    if (item.imageUrl) {
      // پیش‌بارگذاری تصویر
      Image.prefetch(item.imageUrl).catch(() => {});
    }
  };

  return (
    <SafeAreaView style={{ 
      flex: 1, 
      backgroundColor: colors.background,
    }}>
      <View style={{ 
        paddingHorizontal: 20, 
        marginTop: 80, 
        alignItems: 'center',
      }}>
        <TextInput
          placeholder={t('enterProductName', language)}
          placeholderTextColor={colors.textLight}
          value={query}
          onChangeText={setQuery}
          style={[styles.input, { 
            width: textBoxWidth, 
            ...styles.shadowSmall,
            textAlign: 'center'
          }]}
        />

        {loading && (
          <View style={{ 
            padding: 12,
            borderRadius: 8,
            marginVertical: 16,
            width: textBoxWidth,
            alignItems: 'center',
          }}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={{ color: colors.textPrimary, textAlign: 'center', marginTop: 8 }}>
              {t('loading', language)}
            </Text>
          </View>
        )}

        {error && (
          <View style={{ 
            backgroundColor: colors.warning,
            padding: 12,
            borderRadius: 8,
            marginVertical: 16,
            width: textBoxWidth,
          }}>
            <Text style={{ color: colors.textPrimary, textAlign: 'center', marginBottom: 8 }}>
              {!isConnected ? t('noInternet', language) : t('error', language)}
            </Text>
            {isConnected && (
              <TouchableOpacity
                onPress={handleRetry}
                style={[styles.buttonBase, { 
                  backgroundColor: colors.primary,
                  paddingVertical: 8,
                }]}
              >
                <Text style={{ color: "#fff", fontSize: 14, fontWeight: "600" }}>{t('retry', language)}</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {showSuggestions && suggestions.length > 0 && !selected && (
          <FlatList
            data={suggestions}
            keyExtractor={(item, idx) => (item.name ? item.name + idx : idx.toString())}
            renderItem={({ item, index }) => (
              <RNAnimated.View style={{ 
                opacity: animatedValues[index] || 1,
                transform: [{
                  translateY: animatedValues[index]?.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-30, 0]
                  }) || 0
                }]
              }}>
                <TouchableOpacity
                  onPress={() => handleSelectProduct(item)}
                  style={{ 
                    width: textBoxWidth,
                    marginVertical: 2,
                    paddingVertical: 14,
                    paddingHorizontal: 16,
                    backgroundColor: '#E0E0E0',
                    borderRadius: 8,
                    borderBottomWidth: 3,
                    borderColor: '#FFFFFF',
                    ...styles.shadowSmall,
                  }}
                >
                  <Text style={{ 
                    fontSize: 16, 
                    textAlign: 'left',
                    color: colors.textPrimary,
                    fontWeight: '500',
                    paddingLeft: 20
                  }}>
                    {item.subItem || item.name}
                  </Text>
                </TouchableOpacity>
              </RNAnimated.View>
            )}
            style={{ 
              maxHeight: 400,
              width: '100%',
            }}
            showsVerticalScrollIndicator={true}
          />
        )}
      </View>

      {selected && (
        <View style={{ 
          flex: 1, 
          alignItems: "center", 
          paddingHorizontal: 20,
        }}>
          <ScrollView 
            contentContainerStyle={{ 
              alignItems: "center", 
              paddingBottom: 30,
            }}
            showsVerticalScrollIndicator={false}
          >
            <View style={{ 
              width: textBoxWidth,
              marginTop: 16,
              ...styles.shadowMedium,
              borderRadius: 16,
              backgroundColor: colors.background,
              overflow: 'hidden',
            }}>
              {selected.imageUrl ? (
                <ZoomableImage
                  source={{ uri: selected.imageUrl }}
                  style={{ 
                    width: '100%',
                    height: imageHeight,
                  }}
                  resizeMode="contain"
                  productName={selected.subItem || selected.name}
                  isCertificate={false}
                  language={language}
                />
              ) : (
                <View style={{ 
                  width: '100%',
                  height: 200,
                  justifyContent: 'center', 
                  alignItems: 'center',
                  borderRadius: 16,
                }}>
                  <Text style={{ color: colors.textLight, fontSize: 16 }}>
                    {t('noImageAvailable', language)}
                  </Text>
                </View>
              )}
            </View>
            
            <View style={{ 
              width: textBoxWidth,
              marginTop: 20,
            }}>
              <View style={{ 
                flexDirection: "row", 
                justifyContent: "space-between", 
                width: "100%",
              }}>
                <TouchableOpacity 
                  onPress={() => {
                    setSelected(null);
                    setQuery("");
                  }} 
                  style={[styles.buttonBase, { 
                    width: '48%',
                    backgroundColor: colors.primary,
                    height: 53,
                    ...styles.shadowMedium,
                  }]}
                >
                  <Text style={{ color: "#fff", fontSize: 14, fontWeight: "600" }}>
                    {language === 'fa' ? "جستجوی جدید" : "New Search"}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  onPress={() => navigation.navigate("CategoryList")} 
                  style={[styles.buttonBase, { 
                    width: '48%',
                    backgroundColor: colors.primary,
                    height: 53,
                    ...styles.shadowMedium,
                  }]}
                >
                  <Text style={{ color: "#fff", fontSize: 14, fontWeight: "600" }}>
                    {t('searchFromList', language)}
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                onPress={() => navigation.goBack()} 
                style={[styles.buttonBase, { 
                  width: "100%",
                  backgroundColor: colors.primary,
                  height: 53,
                  marginTop: 12,
                  ...styles.shadowMedium,
                }]}
              >
                <Text style={{ color: "#fff", fontSize: 14, fontWeight: "600" }}>{t('back', language)}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      )}

      {!selected && query === "" && !loading && (
        <View style={{ 
          flexDirection: "row", 
          justifyContent: "space-between", 
          paddingVertical: 16,
          paddingHorizontal: 20,
          backgroundColor: 'transparent',
        }}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={[styles.buttonBase, { 
              width: '48%',
              backgroundColor: colors.primary,
              height: 53,
              ...styles.shadowMedium,
            }]}
          >
            <Text style={{ color: "#fff", fontSize: 14, fontWeight: "600" }}>{t('back', language)}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => navigation.navigate("CategoryList")} 
            style={[styles.buttonBase, { 
              width: '48%',
              backgroundColor: colors.primary,
              height: 53,
              ...styles.shadowMedium,
            }]}
          >
            <Text style={{ color: "#fff", fontSize: 14, fontWeight: "600" }}>{t('searchFromList', language)}</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

/* =============== صفحه CategoryListScreen =============== */
function CategoryListScreen({ navigation }) {
  const { language } = useLanguage();
  const [products, setProducts] = useState([]);
  const [expandedCat, setExpandedCat] = useState(null);
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [groupedData, setGroupedData] = useState({});
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    // بررسی اتصال اینترنت
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    setPortraitOrientation();
    
    loadProducts();

    return () => unsubscribe();
  }, [language]);

  const loadProducts = async () => {
    if (!isConnected) {
      setError(true);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(false);
      
      console.log(`[CategoryList] Loading data for language: ${language}`);
      
      const data = await fetchProductsFromAPI(language);
      
      console.log(`[CategoryList] Received ${data.length} products`);
      
      if (data && data.length > 0) {
        setProducts(data);
        
        const grouped = processProductData(data, language);
        console.log(`[CategoryList] Created ${Object.keys(grouped).length} categories`);
        setGroupedData(grouped);
      } else {
        console.log('[CategoryList] No data received');
        setGroupedData({});
      }
    } catch (e) {
      console.error("[CategoryList] Products load error:", e);
      setError(true);
      setProducts([]);
      setGroupedData({});
    } finally {
      setLoading(false);
    }
  };

  const handleSubItemPress = async (productName, subItem, isMultiPage) => {
    if (isMultiPage) {
      const images = await loadMultiPageImages(productName, subItem, language);
      if (images.length > 0) {
        navigation.navigate("ProductGallery", {
          productName: getBaseProductName(subItem),
          images: images
        });
      } else {
        Alert.alert(t('error', language), t('noImageAvailable', language));
      }
    } else {
      const imageUrl = await findImageUrlByName(subItem, language);
      navigation.navigate("ProductDetail", {
        productName: productName,
        subItem: subItem,
        imageUrl: imageUrl
      });
    }
  };

  const loadMultiPageImages = async (productName, baseSubItem, language) => {
    const baseName = getBaseProductName(baseSubItem);
    const images = [];
    
    // جمع‌آوری تمام subItems مربوطه
    const allSubItems = [];
    Object.values(groupedData).forEach(category => {
      Object.values(category.products).forEach(product => {
        if (product.name === productName) {
          product.subItems.forEach(subItem => {
            if (getBaseProductName(subItem) === baseName) {
              allSubItems.push(subItem);
            }
          });
        }
      });
    });
    
    // مرتب‌سازی بر اساس شماره صفحه
    const sortedSubItems = allSubItems.sort((a, b) => {
      const pageA = extractPageNumber(a);
      const pageB = extractPageNumber(b);
      return pageA - pageB;
    });
    
    // ساخت URL تصاویر
    for (const subItem of sortedSubItems) {
      const imageUrl = await findImageUrlByName(subItem, language);
      if (imageUrl) {
        const pageNumber = extractPageNumber(subItem);
        images.push({
          url: imageUrl,
          page: pageNumber,
          title: subItem
        });
      }
    }
    
    return images;
  };

  const handleRetry = () => {
    loadProducts();
  };

  if (loading) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center", 
        backgroundColor: colors.background,
      }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.body, { marginTop: 16 }]}>{t('loading', language)}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center", 
        backgroundColor: colors.background, 
        padding: 24,
      }}>
        <Text style={[styles.heading2, { color: colors.danger, marginBottom: 16 }]}>
          {t('error', language)}
        </Text>
        <Text style={[styles.body, { textAlign: 'center', marginBottom: 24 }]}>
          {!isConnected 
            ? t('noInternet', language)
            : language === 'fa' 
              ? "متأسفانه در بارگذاری فهرست محصولات مشکلی پیش آمده است."
              : "Unfortunately, there was a problem loading the product list."
          }
        </Text>
        {isConnected && (
          <TouchableOpacity
            onPress={handleRetry}
            style={[styles.buttonBase, { 
              backgroundColor: colors.primary,
              ...styles.shadowMedium,
            }]}
          >
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>{t('retry', language)}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => navigation.navigate("Home")} 
          style={[styles.buttonBase, { 
            backgroundColor: colors.secondary,
            marginTop: 16,
            ...styles.shadowMedium,
          }]}
        >
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>{t('back', language)}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ 
      flex: 1, 
      backgroundColor: colors.background,
    }}>
      <ScrollView 
        style={{ padding: 16 }}
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.heading2, { 
          marginBottom: 16,
          color: colors.primary,
          marginTop: 45,
          textAlign: 'center'
        }]}>
          📋 {t('productList', language)}
        </Text>

        {Object.keys(groupedData).length === 0 ? (
          <View style={[styles.card, { alignItems: 'center', padding: 24, ...styles.shadowMedium }]}>
            <Text style={[styles.body, { textAlign: 'center' }]}>
              {t('noProductsFound', language)}
            </Text>
            {isConnected && (
              <TouchableOpacity 
                onPress={handleRetry}
                style={[styles.buttonBase, { 
                  backgroundColor: colors.primary,
                  marginTop: 16,
                  ...styles.shadowSmall,
                }]}
              >
                <Text style={{ color: "#fff", fontSize: 14, fontWeight: "600" }}>{t('retry', language)}</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          Object.entries(groupedData).map(([categoryKey, categoryData]) => (
            <View key={categoryKey} style={{ marginBottom: 8 }}>
              <TouchableOpacity
                style={[{ 
                  backgroundColor: colors.primary,
                  padding: 16,
                  borderRadius: 12,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  height: 70,
                  ...styles.shadowMedium,
                }]}
                onPress={() => {
                  setExpandedCat(expandedCat === categoryKey ? null : categoryKey);
                  setExpandedProduct(null);
                }}
              >
                <Text style={textStyles.categoryText}>
                  {categoryData.category}
                </Text>
                <Text style={{ color: "#fff", fontSize: 16, fontWeight: 'bold' }}>
                  {expandedCat === categoryKey ? '▲' : '▼'}
                </Text>
              </TouchableOpacity>

              {expandedCat === categoryKey && (
                <View style={{ 
                  backgroundColor: colors.surface,
                  borderRadius: 12,
                  marginTop: 6,
                  overflow: 'hidden',
                  ...styles.shadowMedium,
                }}>
                  {Object.entries(categoryData.products).map(([productKey, product]) => (
                    <View key={productKey}>
                      <TouchableOpacity
                        onPress={() => {
                          if (product.subItems && product.subItems.length > 0) {
                            setExpandedProduct(expandedProduct === productKey ? null : productKey);
                          } else {
                            findImageUrlByName(product.name, language).then(imageUrl => {
                              navigation.navigate("ProductDetail", { 
                                productName: product.name, 
                                imageUrl 
                              });
                            });
                          }
                        }}
                        style={{ 
                          padding: 16,
                          borderBottomWidth: 1,
                          borderBottomColor: '#E0E0E0',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <AppText
                          language={language}
                          isNameField={true}
                          style={{ 
                            flex: 1,
                            textAlignVertical: 'center'
                          }}
                        >
                          {product.name}
                        </AppText>
                        
                        {product.subItems && product.subItems.length > 0 && (
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontSize: 14, color: colors.textLight, fontWeight: '500', marginLeft: 8 }}>
                              ({product.subItems.length})
                            </Text>
                            <Text style={{ fontSize: 14, color: colors.textLight, fontWeight: '500' }}>
                              {expandedProduct === productKey ? '▲' : '▼'}
                            </Text>
                          </View>
                        )}
                      </TouchableOpacity>

                      {expandedProduct === productKey && product.subItems && product.subItems.length > 0 && (
                        <View style={{ backgroundColor: '#F5F5F5' }}>
                          {product.subItems.map((sub, i) => {
                            const isMultiPage = isMultiPageProduct(sub);
                            const baseName = getBaseProductName(sub);
                            const pageNumber = extractPageNumber(sub);
                            
                            return (
                              <TouchableOpacity
                                key={i}
                                onPress={() => handleSubItemPress(product.name, sub, isMultiPage)}
                                style={{ 
                                  paddingVertical: 12,
                                  paddingHorizontal: 1,
                                  borderBottomWidth: 1,
                                  borderBottomColor: '#E0E0E0',
                                  backgroundColor: '#F5F5F5',
                                }}
                              >
                                <View style={{ 
                                  flexDirection: 'row', 
                                  alignItems: 'center', 
                                  justifyContent: 'space-between',
                                }}>
                                  <Text style={isMultiPage ? textStyles.subItemMultiPageText : textStyles.subItemText}>
                                    {isMultiPage 
                                      ? `${baseName} (Page ${pageNumber})`
                                      : sub
                                    }
                                  </Text>
                                 
                                </View>
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))
        )}

        <TouchableOpacity 
          onPress={() => navigation.navigate("Home")} 
          style={[{ 
            backgroundColor: '#A23B72',
            paddingVertical: 16,
            paddingHorizontal: 24,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 20,
            marginBottom: 16,
            height: 70,
            ...styles.shadowMedium,
          }]}
        >
          <Text style={{ 
            color: "#fff", 
            textAlign: "center", 
            fontSize: 16, 
            fontWeight: "600",
            textAlignVertical: 'center'
          }}>
            {t('back', language)}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

/* =============== صفحه ProductDetailScreen =============== */
function ProductDetailScreen({ route, navigation }) {
  const { language } = useLanguage();
  const { productName = t('noName', language), subItem, imageUrl } = route.params || {};
  const [imgUrl, setImgUrl] = useState(imageUrl || null);
  const [loadingImg, setLoadingImg] = useState(!imageUrl);
  const screenWidth = Dimensions.get("window").width;
  const textBoxWidth = screenWidth - 40;
  const [imageHeight, setImageHeight] = useState(200);

  useEffect(() => {
    let mounted = true;
    async function resolve() {
      if (imgUrl) {
        setLoadingImg(false);
        return;
      }
      try {
        const tryName = subItem ? subItem : productName;
        const url = await findImageUrlByName(tryName, language);
        
        if (!url && subItem) {
          const url2 = await findImageUrlByName(productName, language, true);
          if (mounted) {
            setImgUrl(url2 || null);
            setLoadingImg(false);
          }
        } else if (mounted) {
          setImgUrl(url || null);
          setLoadingImg(false);
        }
      } catch (e) {
        console.error("Image find error:", e);
        if (mounted) setLoadingImg(false);
      }
    }
    
    if (!imageUrl) {
      resolve();
    }
    
    return () => (mounted = false);
  }, [productName, subItem, language]);

  useEffect(() => {
    if (imgUrl) {
      Image.getSize(
        imgUrl,
        (w, h) => {
          const ratio = h / w;
          setImageHeight(textBoxWidth * ratio);
        },
        () => {
          setImageHeight(textBoxWidth);
        }
      );
    }
  }, [imgUrl]);

  useEffect(() => {
    setPortraitOrientation();
  }, []);

  const displayName = subItem ? `${productName} - ${subItem}` : productName;

  return (
    <SafeAreaView style={{ 
      flex: 1, 
      backgroundColor: colors.background,
    }}>
      <ScrollView 
        contentContainerStyle={{ 
          alignItems: "center", 
          padding: 20,
          paddingBottom: 40
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ 
          width: '100%', 
          marginBottom: 16,
          alignItems: 'center',
          marginTop: 45,
          backgroundColor: 'transparent',
        }}>
          <Text style={[styles.heading2, { 
            color: colors.primary,
            marginBottom: subItem ? 8 : 0,
            textAlign: 'center'
          }]}>
            {productName}
          </Text>
          {subItem && (
            <Text style={[styles.heading3, { 
              color: colors.textSecondary,
              textAlign: 'center'
            }]}>
              {subItem}
            </Text>
          )}
        </View>

        {loadingImg ? (
          <View style={[styles.card, { 
            height: 250,
            justifyContent: 'center', 
            alignItems: 'center', 
            width: textBoxWidth,
            ...styles.shadowMedium,
            borderRadius: 16,
          }]}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.body, { marginTop: 16, color: colors.textLight }]}>
              {t('loading', language)}
            </Text>
          </View>
        ) : imgUrl ? (
          <View style={{ 
            width: textBoxWidth,
            borderRadius: 16,
            backgroundColor: colors.background,
            ...styles.shadowLarge,
            marginBottom: 20,
            overflow: 'hidden',
          }}>
            <ZoomableImage
              source={{ uri: imgUrl }}
              style={{ 
                width: '100%',
                height: imageHeight,
              }}
              resizeMode="contain"
              productName={displayName}
              isCertificate={false}
              language={language}
            />
          </View>
        ) : (
          <View style={[styles.card, { 
            width: textBoxWidth,
            height: 180,
            justifyContent: 'center', 
            alignItems: 'center',
            ...styles.shadowMedium,
            marginBottom: 20,
            borderRadius: 16,
          }]}>
            <Text style={[styles.body, { textAlign: 'center', color: colors.textLight }]}>
              {t('noImageAvailable', language)}
            </Text>
          </View>
        )}

        <View style={{ 
          flexDirection: "row", 
          justifyContent: "space-between", 
          width: "100%", 
        }}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={[styles.buttonBase, { 
              width: '48%',
              backgroundColor: colors.primary,
              height: 53,
              ...styles.shadowMedium,
            }]}
          >
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>{t('back', language)}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => navigation.navigate("Home")} 
            style={[styles.buttonBase, { 
              width: '48%',
              backgroundColor: colors.primary,
              height: 53,
              ...styles.shadowMedium,
            }]}
          >
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>{t('home', language)}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* =============== صفحه ProductGalleryScreen =============== */
function ProductGalleryScreen({ route, navigation }) {
  const { language } = useLanguage();
  const { productName, images } = route.params;
  const [currentIndex, setCurrentIndex] = useState(0);
  const screenWidth = Dimensions.get('window').width;
  
  const flatListRef = useRef(null);

  const currentImage = images[currentIndex];

  const goToNext = () => {
    if (currentIndex < images.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
        viewPosition: 0.5
      });
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      
      flatListRef.current?.scrollToIndex({
        index: prevIndex,
        animated: true,
        viewPosition: 0.5
      });
    }
  };

  const handleSwipe = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
    if (index !== currentIndex) {
      setCurrentIndex(index);
    }
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const visibleIndex = viewableItems[0].index;
      if (visibleIndex !== currentIndex) {
        setCurrentIndex(visibleIndex);
      }
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 300
  }).current;

  return (
    <SafeAreaView style={{ 
      flex: 1, 
      backgroundColor: colors.background,
    }}>
      <View style={[styles.card, { margin: 8, marginBottom: 2, ...styles.shadowMedium }]}>
        <Text style={[styles.heading2, { color: colors.primary }]}>
          {productName}
        </Text>
        <Text style={[styles.body, { textAlign: 'center', marginTop: 8 }]}>
          {t('page', language)} {currentIndex + 1} {t('of', language)} {images.length}
        </Text>
      </View>

      <View style={{ flex: 1 }}>
        <FlatList
          ref={flatListRef}
          data={images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleSwipe}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          getItemLayout={(data, index) => ({
            length: screenWidth,
            offset: screenWidth * index,
            index,
          })}
          initialScrollIndex={currentIndex}
          renderItem={({ item }) => (
            <View style={{ width: screenWidth, padding: 8 }}>
              <ZoomableImage
                source={{ uri: item.url }}
                style={{ width: '100%', height: '100%' }}
                productName={`${productName} - ${t('page', language)} ${item.page}`}
                isCertificate={false}
                language={language}
              />
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
          extraData={currentIndex}
        />
      </View>

      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginTop: 10,
        marginBottom: 10,
      }}>
        <TouchableOpacity
          onPress={goToPrev}
          disabled={currentIndex === 0}
          style={[styles.buttonBase, {
            backgroundColor: currentIndex === 0 ? colors.textLight : colors.primary,
            flex: 1,
            marginRight: 8,
            opacity: currentIndex === 0 ? 0.5 : 1
          }]}
        >
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
            ← {t('previous', language)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={goToNext}
          disabled={currentIndex === images.length - 1}
          style={[styles.buttonBase, {
            backgroundColor: currentIndex === images.length - 1 ? colors.textLight : colors.primary,
            flex: 1,
            marginLeft: 8,
            opacity: currentIndex === images.length - 1 ? 0.5 : 1
          }]}
        >
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
            {t('next', language)} →
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={[styles.buttonBase, {
          backgroundColor: colors.secondary,
          margin: 16,
          marginTop: 0,
          ...styles.shadowMedium
        }]}
      >
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>{t('back', language)}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}



/* --------------- داده‌های نمودار WRC (جدول خطوط) --------------- */
const WRC_LINES_DATA = [
  // {line: شماره خط, startX, startY, endX, endY}
  {line: 0, startX: 17.00, startY: 12.30, endX: 20.70, endY: 17.00},
  {line: 1, startX: 17.00, startY: 11.60, endX: 21.40, endY: 17.00},
  {line: 2, startX: 17.00, startY: 10.90, endX: 22.10, endY: 17.00},
  {line: 3, startX: 17.00, startY: 10.45, endX: 22.55, endY: 17.00},
  {line: 4, startX: 17.00, startY: 10.00, endX: 23.00, endY: 17.00},
  {line: 5, startX: 17.00, startY: 9.83, endX: 23.17, endY: 17.00},
  {line: 6, startX: 17.00, startY: 9.67, endX: 23.33, endY: 17.00},
  {line: 7, startX: 17.00, startY: 9.50, endX: 23.50, endY: 17.00},
  {line: 8, startX: 17.00, startY: 9.33, endX: 23.73, endY: 17.00},
  {line: 9, startX: 17.00, startY: 9.17, endX: 23.97, endY: 17.00},
  {line: 10, startX: 17.00, startY: 9.00, endX: 24.20, endY: 17.00},
  {line: 11, startX: 17.25, startY: 9.00, endX: 24.55, endY: 17.00},
  {line: 12, startX: 17.50, startY: 9.00, endX: 24.90, endY: 17.00},
  {line: 13, startX: 18.00, startY: 9.00, endX: 25.30, endY: 17.00},
  {line: 14, startX: 18.10, startY: 9.00, endX: 25.60, endY: 17.00},
  {line: 15, startX: 18.20, startY: 9.00, endX: 25.90, endY: 17.00},
  {line: 16, startX: 18.50, startY: 9.00, endX: 26.20, endY: 17.00},
  {line: 17, startX: 18.75, startY: 9.00, endX: 26.35, endY: 17.00},
  {line: 18, startX: 19.00, startY: 9.00, endX: 26.50, endY: 17.00},
  {line: 19, startX: 19.30, startY: 9.00, endX: 26.60, endY: 16.85},
  {line: 20, startX: 19.60, startY: 9.00, endX: 26.70, endY: 16.70},
  {line: 21, startX: 19.70, startY: 9.00, endX: 26.85, endY: 16.65},
  {line: 22, startX: 19.80, startY: 9.00, endX: 27.00, endY: 16.60},
  {line: 23, startX: 20.00, startY: 9.00, endX: 27.20, endY: 16.35},
  {line: 24, startX: 20.15, startY: 9.00, endX: 27.40, endY: 16.20},
  {line: 25, startX: 20.33, startY: 9.00, endX: 27.55, endY: 16.10},
  {line: 26, startX: 20.50, startY: 9.00, endX: 27.70, endY: 16.00},
  {line: 27, startX: 20.58, startY: 9.00, endX: 27.74, endY: 15.95},
  {line: 28, startX: 20.65, startY: 9.00, endX: 27.78, endY: 15.90},
  {line: 29, startX: 20.73, startY: 9.00, endX: 27.81, endY: 15.85},
  {line: 30, startX: 20.80, startY: 9.00, endX: 27.85, endY: 15.80},
  {line: 31, startX: 20.86, startY: 9.00, endX: 27.90, endY: 15.76},
  {line: 32, startX: 20.92, startY: 9.00, endX: 27.95, endY: 15.72},
  {line: 33, startX: 20.98, startY: 9.00, endX: 28.00, endY: 15.68},
  {line: 34, startX: 21.04, startY: 9.00, endX: 28.05, endY: 15.64},
  {line: 35, startX: 21.10, startY: 9.00, endX: 28.10, endY: 15.60},
  {line: 36, startX: 21.14, startY: 9.00, endX: 28.16, endY: 15.56},
  {line: 37, startX: 21.18, startY: 9.00, endX: 28.22, endY: 15.52},
  {line: 38, startX: 21.22, startY: 9.00, endX: 28.28, endY: 15.48},
  {line: 39, startX: 21.26, startY: 9.00, endX: 28.34, endY: 15.44},
  {line: 40, startX: 21.30, startY: 9.00, endX: 28.40, endY: 15.40},
  {line: 41, startX: 21.36, startY: 9.00, endX: 28.46, endY: 15.34},
  {line: 42, startX: 21.42, startY: 9.00, endX: 28.52, endY: 15.28},
  {line: 43, startX: 21.48, startY: 9.00, endX: 28.58, endY: 15.22},
  {line: 44, startX: 21.54, startY: 9.00, endX: 28.64, endY: 15.16},
  {line: 45, startX: 21.60, startY: 9.00, endX: 28.70, endY: 15.10},
  {line: 46, startX: 21.64, startY: 9.00, endX: 28.76, endY: 15.05},
  {line: 47, startX: 21.68, startY: 9.00, endX: 28.82, endY: 15.00},
  {line: 48, startX: 21.72, startY: 9.00, endX: 28.88, endY: 14.95},
  {line: 49, startX: 21.76, startY: 9.00, endX: 28.94, endY: 14.90},
  {line: 50, startX: 21.80, startY: 9.00, endX: 29.00, endY: 14.85},
  {line: 51, startX: 21.88, startY: 9.00, endX: 29.03, endY: 14.81},
  {line: 52, startX: 21.95, startY: 9.00, endX: 29.05, endY: 14.78},
  {line: 53, startX: 22.03, startY: 9.00, endX: 29.08, endY: 14.74},
  {line: 54, startX: 22.10, startY: 9.00, endX: 29.10, endY: 14.70},
  {line: 55, startX: 22.13, startY: 9.00, endX: 29.13, endY: 14.65},
  {line: 56, startX: 22.17, startY: 9.00, endX: 29.17, endY: 14.60},
  {line: 57, startX: 22.20, startY: 9.00, endX: 29.20, endY: 14.55},
  {line: 58, startX: 22.23, startY: 9.00, endX: 29.23, endY: 14.50},
  {line: 59, startX: 22.27, startY: 9.00, endX: 29.27, endY: 14.45},
  {line: 60, startX: 22.30, startY: 9.00, endX: 29.30, endY: 14.40},
  {line: 61, startX: 22.39, startY: 9.00, endX: 29.34, endY: 14.35},
  {line: 62, startX: 22.48, startY: 9.00, endX: 29.38, endY: 14.30},
  {line: 63, startX: 22.57, startY: 9.00, endX: 29.42, endY: 14.25},
  {line: 64, startX: 22.66, startY: 9.00, endX: 29.46, endY: 14.20},
  {line: 65, startX: 22.75, startY: 9.00, endX: 29.50, endY: 14.15},
  {line: 66, startX: 22.78, startY: 9.00, endX: 29.54, endY: 14.08},
  {line: 67, startX: 22.81, startY: 9.00, endX: 29.58, endY: 14.01},
  {line: 68, startX: 22.84, startY: 9.00, endX: 29.62, endY: 13.94},
  {line: 69, startX: 22.87, startY: 9.00, endX: 29.66, endY: 13.87},
  {line: 70, startX: 22.90, startY: 9.00, endX: 29.70, endY: 13.80},
  {line: 71, startX: 22.94, startY: 9.00, endX: 29.74, endY: 13.74},
  {line: 72, startX: 22.98, startY: 9.00, endX: 29.78, endY: 13.68},
  {line: 73, startX: 23.02, startY: 9.00, endX: 29.82, endY: 13.62},
  {line: 74, startX: 23.06, startY: 9.00, endX: 29.86, endY: 13.56},
  {line: 75, startX: 23.10, startY: 9.00, endX: 29.90, endY: 13.50},
  {line: 76, startX: 23.15, startY: 9.00, endX: 29.94, endY: 13.44},
  {line: 77, startX: 23.20, startY: 9.00, endX: 29.98, endY: 13.38},
  {line: 78, startX: 23.25, startY: 9.00, endX: 30.02, endY: 13.32},
  {line: 79, startX: 23.30, startY: 9.00, endX: 30.06, endY: 13.26},
  {line: 80, startX: 23.35, startY: 9.00, endX: 30.10, endY: 13.20},
  {line: 81, startX: 23.43, startY: 9.00, endX: 30.11, endY: 13.15},
  {line: 82, startX: 23.50, startY: 9.00, endX: 30.13, endY: 13.10},
  {line: 83, startX: 23.58, startY: 9.00, endX: 30.14, endY: 13.05},
  {line: 84, startX: 23.65, startY: 9.00, endX: 30.15, endY: 13.00},
  {line: 85, startX: 23.73, startY: 9.00, endX: 30.19, endY: 12.93},
  {line: 86, startX: 23.80, startY: 9.00, endX: 30.23, endY: 12.87},
  {line: 87, startX: 23.88, startY: 9.00, endX: 30.28, endY: 12.80},
  {line: 88, startX: 23.95, startY: 9.00, endX: 30.32, endY: 12.73},
  {line: 89, startX: 24.03, startY: 9.00, endX: 30.36, endY: 12.67},
  {line: 90, startX: 24.10, startY: 9.00, endX: 30.40, endY: 12.60},
  {line: 91, startX: 24.16, startY: 9.00, endX: 30.43, endY: 12.52},
  {line: 92, startX: 24.22, startY: 9.00, endX: 30.46, endY: 12.44},
  {line: 93, startX: 24.28, startY: 9.00, endX: 30.49, endY: 12.36},
  {line: 94, startX: 24.34, startY: 9.00, endX: 30.52, endY: 12.28},
  {line: 95, startX: 24.40, startY: 9.00, endX: 30.55, endY: 12.20},
  {line: 96, startX: 24.50, startY: 9.00, endX: 30.58, endY: 12.13},
  {line: 97, startX: 24.60, startY: 9.00, endX: 30.61, endY: 12.06},
  {line: 98, startX: 24.70, startY: 9.00, endX: 30.64, endY: 11.99},
  {line: 99, startX: 24.80, startY: 9.00, endX: 30.67, endY: 11.92},
  {line: 100, startX: 24.90, startY: 9.00, endX: 30.70, endY: 11.85}
];

/* --------------- تابع محاسبه فریت نمبر --------------- */
const calculateFerriteNumber = (CrEq, NiEq) => {
  try {
    let minDistance = Infinity;
    let nearestLine = 0;
    
    // محاسبه فاصله نقطه (CrEq, NiEq) از هر خط
    for (const lineData of WRC_LINES_DATA) {
      const { line, startX, startY, endX, endY } = lineData;
      
      // محاسبه شیب خط (m)
      const m = (endY - startY) / (endX - startX);
      
      // محاسبه فاصله نقطه از خط با استفاده از فرمول داده شده
      // فرمول: =ABS(((G2-E2)/(F2-D2))*B$1 - B$2 + (E2 - ((G2-E2)/(F2-D2))*D2)) / SQRT(((G2-E2)/(F2-D2))^2 + 1)
      // که در آن:
      // D2 = startX, E2 = startY, F2 = endX, G2 = endY
      // B$1 = CrEq, B$2 = NiEq
      
      const numerator = Math.abs(
        m * CrEq - NiEq + (startY - m * startX)
      );
      
      const denominator = Math.sqrt(m * m + 1);
      
      const distance = numerator / denominator;
      
      // پیدا کردن خط با کمترین فاصله
      if (distance < minDistance) {
        minDistance = distance;
        nearestLine = line;
      }
    }
    
    return nearestLine;
  } catch (error) {
    console.error("خطا در محاسبه فریت نمبر:", error);
    // محاسبه تقریبی در صورت خطا
    return Math.round((CrEq - 15) / 0.5);
  }
};



/* --------------- صفحه تبدیل واحد --------------- */
function UnitConverterScreen({ navigation }) {
  const { language } = useLanguage();
  
  const UNIT_CATEGORIES = {
    length: {
      name: language === 'fa' ? 'طول' : 'Length',
      units: {
        meter: { name: language === 'fa' ? 'متر' : 'Meter', factor: 1 },
        centimeter: { name: language === 'fa' ? 'سانتی‌متر' : 'Centimeter', factor: 0.01 },
        millimeter: { name: language === 'fa' ? 'میلی‌متر' : 'Millimeter', factor: 0.001 },
        kilometer: { name: language === 'fa' ? 'کیلومتر' : 'Kilometer', factor: 1000 },
        inch: { name: language === 'fa' ? 'اینچ' : 'Inch', factor: 0.0254 },
        foot: { name: language === 'fa' ? 'فوت' : 'Foot', factor: 0.3048 },
        yard: { name: language === 'fa' ? 'یارد' : 'Yard', factor: 0.9144 },
        mile: { name: language === 'fa' ? 'مایل' : 'Mile', factor: 1609.344 }
      }
    },
    weight: {
      name: language === 'fa' ? 'وزن' : 'Weight',
      units: {
        kilogram: { name: language === 'fa' ? 'کیلوگرم' : 'Kilogram', factor: 1 },
        gram: { name: language === 'fa' ? 'گرم' : 'Gram', factor: 0.001 },
        milligram: { name: language === 'fa' ? 'میلی‌گرم' : 'Milligram', factor: 0.000001 },
        ton: { name: language === 'fa' ? 'تن' : 'Ton', factor: 1000 },
        pound: { name: language === 'fa' ? 'پوند' : 'Pound', factor: 0.453592 },
        ounce: { name: language === 'fa' ? 'اونس' : 'Ounce', factor: 0.0283495 }
      }
    },
    temperature: {
      name: language === 'fa' ? 'دما' : 'Temperature',
      units: {
        celsius: { name: language === 'fa' ? 'سلسیوس' : 'Celsius', factor: 1, offset: 0 },
        fahrenheit: { name: language === 'fa' ? 'فارنهایت' : 'Fahrenheit', factor: 5/9, offset: -32 },
        kelvin: { name: language === 'fa' ? 'کلوین' : 'Kelvin', factor: 1, offset: -273.15 }
      }
    },
    area: {
      name: language === 'fa' ? 'مساحت' : 'Area',
      units: {
        squareMeter: { name: language === 'fa' ? 'متر مربع' : 'Square Meter', factor: 1 },
        squareKilometer: { name: language === 'fa' ? 'کیلومتر مربع' : 'Square Kilometer', factor: 1000000 },
        squareCentimeter: { name: language === 'fa' ? 'سانتی‌متر مربع' : 'Square Centimeter', factor: 0.0001 },
        hectare: { name: language === 'fa' ? 'هکتار' : 'Hectare', factor: 10000 },
        acre: { name: language === 'fa' ? 'ایکر' : 'Acre', factor: 4046.86 },
        squareMile: { name: language === 'fa' ? 'مایل مربع' : 'Square Mile', factor: 2590000 }
      }
    },
    volume: {
      name: language === 'fa' ? 'حجم' : 'Volume',
      units: {
        liter: { name: language === 'fa' ? 'لیتر' : 'Liter', factor: 1 },
        milliliter: { name: language === 'fa' ? 'میلی‌لیتر' : 'Milliliter', factor: 0.001 },
        cubicMeter: { name: language === 'fa' ? 'متر مکعب' : 'Cubic Meter', factor: 1000 },
        gallon: { name: language === 'fa' ? 'گالن' : 'Gallon', factor: 3.78541 },
        quart: { name: language === 'fa' ? 'کوارت' : 'Quart', factor: 0.946353 },
        pint: { name: language === 'fa' ? 'پاینت' : 'Pint', factor: 0.473176 }
      }
    },
    speed: {
      name: language === 'fa' ? 'سرعت' : 'Speed',
      units: {
        meterPerSecond: { name: language === 'fa' ? 'متر بر ثانیه' : 'Meter per Second', factor: 1 },
        kilometerPerHour: { name: language === 'fa' ? 'کیلومتر بر ساعت' : 'Kilometer per Hour', factor: 0.277778 },
        milePerHour: { name: language === 'fa' ? 'مایل بر ساعت' : 'Mile per Hour', factor: 0.44704 },
        knot: { name: language === 'fa' ? 'گره دریایی' : 'Knot', factor: 0.514444 },
        footPerSecond: { name: language === 'fa' ? 'فوت بر ثانیه' : 'Foot per Second', factor: 0.3048 }
      }
    },
    time: {
      name: language === 'fa' ? 'زمان' : 'Time',
      units: {
        second: { name: language === 'fa' ? 'ثانیه' : 'Second', factor: 1 },
        minute: { name: language === 'fa' ? 'دقیقه' : 'Minute', factor: 60 },
        hour: { name: language === 'fa' ? 'ساعت' : 'Hour', factor: 3600 },
        day: { name: language === 'fa' ? 'روز' : 'Day', factor: 86400 },
        week: { name: language === 'fa' ? 'هفته' : 'Week', factor: 604800 },
        month: { name: language === 'fa' ? 'ماه' : 'Month', factor: 2592000 },
        year: { name: language === 'fa' ? 'سال' : 'Year', factor: 31536000 }
      }
    },
    power: {
      name: language === 'fa' ? 'توان' : 'Power',
      units: {
        watt: { name: language === 'fa' ? 'وات' : 'Watt', factor: 1 },
        kilowatt: { name: language === 'fa' ? 'کیلووات' : 'Kilowatt', factor: 1000 },
        megawatt: { name: language === 'fa' ? 'مگاوات' : 'Megawatt', factor: 1000000 },
        horsepower: { name: language === 'fa' ? 'اسب بخار' : 'Horsepower', factor: 745.7 },
        horsepowerMetric: { name: language === 'fa' ? 'اسب بخار متریک' : 'Metric Horsepower', factor: 735.499 },
        caloriePerSecond: { name: language === 'fa' ? 'کالری بر ثانیه' : 'Calorie per Second', factor: 4.1868 },
        btuPerHour: { name: language === 'fa' ? 'BTU بر ساعت' : 'BTU per Hour', factor: 0.293071 }
      }
    },
    torque: {
      name: language === 'fa' ? 'گشتاور' : 'Torque',
      units: {
        newtonMeter: { name: language === 'fa' ? 'نیوتن متر' : 'Newton Meter', factor: 1 },
        kilogramForceMeter: { name: language === 'fa' ? 'کیلوگرم نیرو متر' : 'Kilogram-force Meter', factor: 9.80665 },
        poundForceFoot: { name: language === 'fa' ? 'پوند نیرو فوت' : 'Pound-force Foot', factor: 1.35582 },
        poundForceInch: { name: language === 'fa' ? 'پوند نیرو اینچ' : 'Pound-force Inch', factor: 0.112985 },
        dyneCentimeter: { name: language === 'fa' ? 'داین سانتی‌متر' : 'Dyne Centimeter', factor: 0.0000001 }
      }
    },
    angle: {
      name: language === 'fa' ? 'زاویه' : 'Angle',
      units: {
        degree: { name: language === 'fa' ? 'درجه' : 'Degree', factor: 1 },
        radian: { name: language === 'fa' ? 'رادیان' : 'Radian', factor: 57.2958 },
        gradian: { name: language === 'fa' ? 'گراد' : 'Gradian', factor: 0.9 },
        arcminute: { name: language === 'fa' ? 'دقیقه قوسی' : 'Arcminute', factor: 0.0166667 },
        arcsecond: { name: language === 'fa' ? 'ثانیه قوسی' : 'Arcsecond', factor: 0.000277778 },
        turn: { name: language === 'fa' ? 'دور' : 'Turn', factor: 360 }
      }
    }
  };

  const [selectedCategory, setSelectedCategory] = useState('length');
  const [fromUnit, setFromUnit] = useState('meter');
  const [toUnit, setToUnit] = useState('centimeter');
  const [fromValue, setFromValue] = useState('1');
  const [toValue, setToValue] = useState('');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showFromUnitModal, setShowFromUnitModal] = useState(false);
  const [showToUnitModal, setShowToUnitModal] = useState(false);
  const [modalType, setModalType] = useState('');

  const screenWidth = Dimensions.get("window").width;
  const isTablet = screenWidth >= 768;
  const screenHeight = Dimensions.get("window").height;
  const isSmallDevice = screenHeight < 700;

  useEffect(() => {
    calculateConversion();
  }, [fromValue, fromUnit, toUnit, selectedCategory]);

  const calculateConversion = () => {
    if (!fromValue || isNaN(parseFloat(fromValue))) {
      setToValue('');
      return;
    }

    const inputValue = parseFloat(fromValue);
    const category = UNIT_CATEGORIES[selectedCategory];
    const fromUnitData = category.units[fromUnit];
    const toUnitData = category.units[toUnit];

    let result;

    if (selectedCategory === 'temperature') {
      if (fromUnit === 'celsius' && toUnit === 'fahrenheit') {
        result = (inputValue * 9/5) + 32;
      } else if (fromUnit === 'fahrenheit' && toUnit === 'celsius') {
        result = (inputValue - 32) * 5/9;
      } else if (fromUnit === 'celsius' && toUnit === 'kelvin') {
        result = inputValue + 273.15;
      } else if (fromUnit === 'kelvin' && toUnit === 'celsius') {
        result = inputValue - 273.15;
      } else if (fromUnit === 'fahrenheit' && toUnit === 'kelvin') {
        result = (inputValue - 32) * 5/9 + 273.15;
      } else if (fromUnit === 'kelvin' && toUnit === 'fahrenheit') {
        result = (inputValue - 273.15) * 9/5 + 32;
      } else {
        result = inputValue;
      }
    } else {
      const valueInBaseUnit = inputValue * fromUnitData.factor;
      result = valueInBaseUnit / toUnitData.factor;
    }

    if (result === 0) {
      setToValue('0');
    } else if (Math.abs(result) < 0.000001) {
      setToValue(result.toExponential(6));
    } else if (Math.abs(result) >= 1000000) {
      setToValue(result.toExponential(6));
    } else {
      setToValue(result.toFixed(6).replace(/\.?0+$/, ''));
    }
  };

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setFromValue(toValue);
  };

  const openModal = (type) => {
    setModalType(type);
    if (type === 'category') {
      setShowCategoryModal(true);
    } else if (type === 'from') {
      setShowFromUnitModal(true);
    } else if (type === 'to') {
      setShowToUnitModal(true);
    }
  };

  const selectCategory = (categoryKey) => {
    setSelectedCategory(categoryKey);
    const categoryUnits = Object.keys(UNIT_CATEGORIES[categoryKey].units);
    setFromUnit(categoryUnits[0]);
    setToUnit(categoryUnits[1] || categoryUnits[0]);
    setShowCategoryModal(false);
  };

  const selectUnit = (unitKey, type) => {
    if (type === 'from') {
      setFromUnit(unitKey);
      setShowFromUnitModal(false);
    } else {
      setToUnit(unitKey);
      setShowToUnitModal(false);
    }
  };

  const clearInputs = () => {
    setFromValue('');
    setToValue('');
  };

  const getCategoryIcon = (category) => {
    const icons = {
      length: 'resize',
      weight: 'speedometer',
      temperature: 'thermometer',
      area: 'square',
      volume: 'water',
      speed: 'speedometer',
      time: 'time',
      power: 'flash',
      torque: 'cog',
      angle: 'compass'
    };
    return icons[category] || 'calculator';
  };

  const UnitModal = ({ visible, onClose, type }) => {
    const data = type === 'category' 
      ? Object.keys(UNIT_CATEGORIES).map(key => ({
          key,
          name: UNIT_CATEGORIES[key].name
        }))
      : Object.keys(UNIT_CATEGORIES[selectedCategory].units).map(key => ({
          key,
          name: UNIT_CATEGORIES[selectedCategory].units[key].name
        }));

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={unitStyles.modalContainer}>
          <View style={[unitStyles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={[unitStyles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[unitStyles.modalTitle, { color: colors.textPrimary }]}>
                {type === 'category' 
                  ? t('selectCategory', language)
                  : t('selectUnit', language)}
              </Text>
              <TouchableOpacity onPress={onClose} style={unitStyles.closeButton}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <ScrollView style={unitStyles.modalList}>
              {data.map((item) => (
                <TouchableOpacity
                  key={item.key}
                  style={[unitStyles.modalItem, { borderBottomColor: colors.border }]}
                  onPress={() => {
                    if (type === 'category') {
                      selectCategory(item.key);
                    } else {
                      selectUnit(item.key, type);
                    }
                  }}
                >
                  <Text style={[unitStyles.modalItemText, { color: colors.textPrimary }]}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const unitStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      direction: 'ltr'
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: 45,
    },
    header: {
      alignItems: 'center',
      padding: isTablet ? 30 : 20,
      paddingTop: 45,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      ...styles.shadowMedium,
      direction: 'ltr'
    },
    companyInfo: {
      alignItems: 'center',
    },
    companyName: {
      fontSize: isTablet ? 26 : 20,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: isTablet ? 8 : 4,
    },
    appName: {
      fontSize: isTablet ? 20 : 16,
      color: colors.primary,
      fontWeight: '600',
    },
    categorySelector: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.surface,
      margin: isTablet ? 20 : 16,
      marginVertical: isSmallDevice ? 12 : 16,
      padding: isTablet ? 20 : 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      ...styles.shadowSmall,
      direction: 'ltr'
    },
    categoryInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: isTablet ? 12 : 8,
    },
    categoryText: {
      fontSize: isTablet ? 20 : 18,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    converterContainer: {
      backgroundColor: colors.surface,
      margin: isTablet ? 20 : 16,
      marginVertical: isSmallDevice ? 12 : 16,
      padding: isTablet ? 25 : 20,
      borderRadius: 16,
      ...styles.shadowMedium,
      direction: 'ltr'
    },
    unitSection: {
      marginBottom: isTablet ? 25 : 20,
    },
    unitSelector: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.background,
      padding: isTablet ? 16 : 12,
      borderRadius: 8,
      marginBottom: isTablet ? 12 : 8,
      borderWidth: 1,
      borderColor: colors.border,
      direction: 'ltr'
    },
    unitText: {
      fontSize: isTablet ? 18 : 16,
      fontWeight: '500',
      color: colors.textPrimary,
      textAlign: 'center',
      flex: 1,
    },
    input: {
      backgroundColor: colors.background,
      padding: isTablet ? 20 : 16,
      borderRadius: 8,
      fontSize: isTablet ? 20 : 18,
      borderWidth: 1,
      borderColor: colors.border,
      textAlign: 'center',
      color: colors.textPrimary,
    },
    output: {
      backgroundColor: colors.primaryLight + '20',
      color: colors.primary,
    },
    swapButton: {
      backgroundColor: colors.primary,
      width: isTablet ? 60 : 50,
      height: isTablet ? 60 : 50,
      borderRadius: isTablet ? 30 : 25,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      marginVertical: isTablet ? 15 : 10,
      ...styles.shadowMedium,
    },
    actionButtons: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginHorizontal: isTablet ? 20 : 16,
      marginBottom: isSmallDevice ? 8 : 16,
      direction: 'ltr'
    },
    clearButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      paddingHorizontal: isTablet ? 25 : 20,
      paddingVertical: isTablet ? 15 : 12,
      borderRadius: 25,
      borderWidth: 1,
      borderColor: colors.danger,
      gap: isTablet ? 8 : 6,
    },
    clearButtonText: {
      color: colors.danger,
      fontSize: isTablet ? 18 : 16,
      fontWeight: '500',
    },
    footer: {
      margin: isTablet ? 20 : 16,
      marginBottom: 45,
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.secondary,
      padding: isTablet ? 18 : 14,
      borderRadius: 12,
      gap: isTablet ? 10 : 8,
      ...styles.shadowMedium,
    },
    backButtonText: {
      color: colors.surface,
      fontSize: isTablet ? 18 : 16,
      fontWeight: '500',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      maxHeight: '80%',
      direction: 'ltr'
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: isTablet ? 20 : 16,
      borderBottomWidth: 1,
    },
    modalTitle: {
      fontSize: isTablet ? 20 : 18,
      fontWeight: 'bold',
    },
    closeButton: {
      padding: 4,
    },
    modalList: {
      maxHeight: 400,
    },
    modalItem: {
      padding: isTablet ? 20 : 16,
      borderBottomWidth: 1,
    },
    modalItemText: {
      fontSize: isTablet ? 18 : 16,
      textAlign: 'center',
    },
  });

  return (
    <SafeAreaView style={unitStyles.container}>
      <View style={unitStyles.header}>
        <View style={unitStyles.companyInfo}>
          <Text style={unitStyles.companyName}>
            {t('unitConverter', language)}
          </Text>
        </View>
      </View>

      <TouchableOpacity 
        style={unitStyles.categorySelector}
        onPress={() => openModal('category')}
      >
        <View style={unitStyles.categoryInfo}>
          <Ionicons name={getCategoryIcon(selectedCategory)} size={isTablet ? 24 : 20} color={colors.primary} />
          <Text style={unitStyles.categoryText}>
            {UNIT_CATEGORIES[selectedCategory].name}
          </Text>
        </View>
        <Ionicons name="chevron-down" size={isTablet ? 24 : 20} color={colors.textSecondary} />
      </TouchableOpacity>

      <View style={unitStyles.converterContainer}>
        <View style={unitStyles.unitSection}>
          <TouchableOpacity 
            style={unitStyles.unitSelector}
            onPress={() => openModal('from')}
          >
            <Text style={unitStyles.unitText}>
              {UNIT_CATEGORIES[selectedCategory].units[fromUnit].name}
            </Text>
            <Ionicons name="swap-vertical" size={isTablet ? 20 : 18} color={colors.primary} />
          </TouchableOpacity>
          <TextInput
            style={unitStyles.input}
            value={fromValue}
            onChangeText={setFromValue}
            placeholder={t('enterValue', language)}
            placeholderTextColor={colors.textLight}
            keyboardType="numeric"
            textAlign="center"
          />
        </View>

        <TouchableOpacity style={unitStyles.swapButton} onPress={swapUnits}>
          <Ionicons name="swap-vertical" size={isTablet ? 28 : 24} color="#fff" />
        </TouchableOpacity>

        <View style={unitStyles.unitSection}>
          <TouchableOpacity 
            style={unitStyles.unitSelector}
            onPress={() => openModal('to')}
          >
            <Text style={unitStyles.unitText}>
              {UNIT_CATEGORIES[selectedCategory].units[toUnit].name}
            </Text>
            <Ionicons name="swap-vertical" size={isTablet ? 20 : 18} color={colors.primary} />
          </TouchableOpacity>
          <TextInput
            style={[unitStyles.input, unitStyles.output]}
            value={toValue}
            editable={false}
            placeholder={t('result', language)}
            placeholderTextColor={colors.textLight}
            textAlign="center"
          />
        </View>
      </View>

      <View style={unitStyles.actionButtons}>
        <TouchableOpacity style={unitStyles.clearButton} onPress={clearInputs}>
          <Ionicons name="refresh" size={isTablet ? 22 : 20} color={colors.danger} />
          <Text style={unitStyles.clearButtonText}>
            {t('clear', language)}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={unitStyles.footer}>
        <TouchableOpacity style={unitStyles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={isTablet ? 22 : 20} color="#fff" />
          <Text style={unitStyles.backButtonText}>
            {t('back', language)}
          </Text>
        </TouchableOpacity>
      </View>

      <UnitModal
        visible={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        type="category"
      />
      <UnitModal
        visible={showFromUnitModal}
        onClose={() => setShowFromUnitModal(false)}
        type="from"
      />
      <UnitModal
        visible={showToUnitModal}
        onClose={() => setShowToUnitModal(false)}
        type="to"
      />
    </SafeAreaView>
  );
}

/* --------------- صفحه WRC Diagram --------------- */
function WRCDiagramScreen({ navigation }) {
  const { language } = useLanguage();
  const [inputs, setInputs] = useState({
    C: { value: '', min: '', max: '' },
    Cr: { value: '', min: '', max: '' },
    Mo: { value: '', min: '', max: '' },
    Ni: { value: '', min: '', max: '' },
    Cu: { value: '', min: '', max: '' },
    Nb: { value: '', min: '', max: '' },
    N: { value: '', min: '', max: '' }
  });

  const [results, setResults] = useState({ 
    CrEq: 0, 
    NiEq: 0,
    CrEq_min: 0,
    CrEq_max: 0,
    NiEq_min: 0,
    NiEq_max: 0,
    nearestLine: null,
    metallurgicalStatus: null
  });

  const [showDiagram, setShowDiagram] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  const scrollViewRef = useRef(null);
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const calculateWRC = async () => {
    setLoading(true);
    setShowResults(false);
    
    try {
      const C = parseFloat(inputs.C.value) || 0;
      const Cr = parseFloat(inputs.Cr.value) || 0;
      const Mo = parseFloat(inputs.Mo.value) || 0;
      const Ni = parseFloat(inputs.Ni.value) || 0;
      const Cu = parseFloat(inputs.Cu.value) || 0;
      const Nb = parseFloat(inputs.Nb.value) || 0;
      const N = parseFloat(inputs.N.value) || 0;

      const C_min = parseFloat(inputs.C.min) || 0;
      const Cr_min = parseFloat(inputs.Cr.min) || 0;
      const Mo_min = parseFloat(inputs.Mo.min) || 0;
      const Ni_min = parseFloat(inputs.Ni.min) || 0;
      const Cu_min = parseFloat(inputs.Cu.min) || 0;
      const Nb_min = parseFloat(inputs.Nb.min) || 0;
      const N_min = parseFloat(inputs.N.min) || 0;

      const C_max = parseFloat(inputs.C.max) || 0;
      const Cr_max = parseFloat(inputs.Cr.max) || 0;
      const Mo_max = parseFloat(inputs.Mo.max) || 0;
      const Ni_max = parseFloat(inputs.Ni.max) || 0;
      const Cu_max = parseFloat(inputs.Cu.max) || 0;
      const Nb_max = parseFloat(inputs.Nb.max) || 0;
      const N_max = parseFloat(inputs.N.max) || 0;

      const CrEq = Cr + Mo + 0.7 * Nb;
      const CrEq_min = Cr_min + Mo_min + 0.7 * Nb_min;
      const CrEq_max = Cr_max + Mo_max + 0.7 * Nb_max;
      
      const NiEq = Ni + 35 * C + 20 * N + 0.25 * Cu;
      const NiEq_min = Ni_min + 35 * C_min + 20 * N_min + 0.25 * Cu_min;
      const NiEq_max = Ni_max + 35 * C_max + 20 * N_max + 0.25 * Cu_max;

      // محاسبه فریت نمبر درون برنامه
      const ferriteNumber = calculateFerriteNumber(CrEq, NiEq);
      
      const newResults = { 
        CrEq: CrEq.toFixed(2), 
        NiEq: NiEq.toFixed(2),
        CrEq_min: CrEq_min.toFixed(2),
        CrEq_max: CrEq_max.toFixed(2),
        NiEq_min: NiEq_min.toFixed(2),
        NiEq_max: NiEq_max.toFixed(2),
        nearestLine: ferriteNumber,
        metallurgicalStatus: "Ferrite"
      };
      
      setResults(newResults);
      setShowResults(true);
      scrollToBottom();
      
    } catch (error) {
      console.error('Calculation error:', error);
      Alert.alert(
        t('error', language),
        language === 'fa' 
          ? 'خطا در محاسبات: ' + error.message
          : 'Calculation error: ' + error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (name, field, value) => {
    setInputs(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        [field]: value
      }
    }));
  };

  const SchaefflerDiagram = ({ isModal = false, showDataPoint = true }) => {
    const lines = [
      { startX: 17, endX: 20.7, startY: 12.3, endY: 17 },
      { startX: 17, endX: 22.1, startY: 10.9, endY: 17 },
      { startX: 17, endX: 23, startY: 10, endY: 17 },
      { startX: 17, endX: 23.5, startY: 9.5, endY: 17 },
      { startX: 17, endX: 24.2, startY: 9, endY: 17 },
      { startX: 17.5, endX: 24.9, startY: 9, endY: 17 },
      { startX: 18, endX: 25.3, startY: 9, endY: 17 },
      { startX: 18.2, endX: 25.9, startY: 9, endY: 17 },
      { startX: 18.5, endX: 26.2, startY: 9, endY: 17 },
      { startX: 19, endX: 26.5, startY: 9, endY: 17 },
      { startX: 19.6, endX: 26.7, startY: 9, endY: 16.7 },
      { startX: 19.8, endX: 27, startY: 9, endY: 16.6 },
      { startX: 20, endX: 27.2, startY: 9, endY: 16.35 },
      { startX: 20.15, endX: 27.4, startY: 9, endY: 16.2 },
      { startX: 20.5, endX: 27.7, startY: 9, endY: 16 },
      { startX: 20.8, endX: 27.85, startY: 9, endY: 15.8 },
      { startX: 21.1, endX: 28.1, startY: 9, endY: 15.6 },
      { startX: 21.3, endX: 28.4, startY: 9, endY: 15.4 },
      { startX: 21.6, endX: 28.7, startY: 9, endY: 15.1 },
      { startX: 21.8, endX: 29, startY: 9, endY: 14.85 },
      { startX: 22.1, endX: 29.1, startY: 9, endY: 14.7 },
      { startX: 22.3, endX: 29.3, startY: 9, endY: 14.4 },
      { startX: 22.75, endX: 29.5, startY: 9, endY: 14.15 },
      { startX: 22.9, endX: 29.7, startY: 9, endY: 13.8 },
      { startX: 23.1, endX: 29.9, startY: 9, endY: 13.5 },
      { startX: 23.35, endX: 30.1, startY: 9, endY: 13.2 },
      { startX: 23.65, endX: 30.15, startY: 9, endY: 13 },
      { startX: 24.1, endX: 30.4, startY: 9, endY: 12.6 },
      { startX: 24.4, endX: 30.55, startY: 9, endY: 12.2 },
      { startX: 24.9, endX: 30.7, startY: 9, endY: 11.85 }
    ];

    const mLine = [
      { startX: 15, startY: 13.3, endX: 22.8, endY: 7 }
    ];

    const uLine = [
      { startX: 17, startY: 11.85, endX: 23.55, endY: 17 }
    ];

    const tLine = [
      { startX: 17, startY: 9.35, endX: 27.4, endY: 17 }
    ];

    const zeroLine = [
      { startX: 17, startY: 12.3, endX: 20.7, endY: 17 }
    ];

    const endLabels = [
      { lineIndex: 1, value: "0" },
      { lineIndex: 2, value: "2" },
      { lineIndex: 5, value: "10" },
      { lineIndex: 11, value: "20" },
      { lineIndex: 16, value: "30" },
      { lineIndex: 18, value: "40" },
      { lineIndex: 22, value: "60" },
      { lineIndex: 26, value: "80" },
      { lineIndex: 30, value: "100" }
    ];

    const diagramWidth = isModal ? Math.min(screenWidth - 80, 400) * 0.95 : Math.min(screenWidth - 60, 350) * 0.95;
    const diagramHeight = isModal ? diagramWidth * 0.85 : Math.min(screenHeight * 0.35, 280) * 0.95;

    const scaleX = (x) => ((x - 15) / (31 - 15)) * diagramWidth;
    const scaleY = (y) => diagramHeight - ((y - 7) / (18 - 7)) * diagramHeight;

    const getEndLabelPosition = (lineIndex) => {
      if (lineIndex < 1 || lineIndex > lines.length) return null;
      const line = lines[lineIndex - 1];
      return {
        x: scaleX(line.endX),
        y: scaleY(line.endY)
      };
    };

    const getRangeRectangle = () => {
      if (!results.CrEq_min || !results.CrEq_max || !results.NiEq_min || !results.NiEq_max) {
        return null;
      }

      const x1 = parseFloat(results.CrEq_min);
      const x2 = parseFloat(results.CrEq_max);
      const y1 = parseFloat(results.NiEq_min);
      const y2 = parseFloat(results.NiEq_max);

      return {
        x: scaleX(x1),
        y: scaleY(y2),
        width: scaleX(x2) - scaleX(x1),
        height: scaleY(y1) - scaleY(y2)
      };
    };

    const rangeRect = getRangeRectangle();

    const gridLines = [];
    
    for (let x = 15; x <= 31; x += 1) {
      gridLines.push(
        <Line
          key={`v-${x}`}
          x1={scaleX(x)}
          y1={0}
          x2={scaleX(x)}
          y2={diagramHeight}
          stroke="#e0e0e0"
          strokeWidth="1"
        />
      );
    }
    
    for (let y = 7; y <= 18; y += 1) {
      gridLines.push(
        <Line
          key={`h-${y}`}
          x1={0}
          y1={scaleY(y)}
          x2={diagramWidth}
          y2={scaleY(y)}
          stroke="#e0e0e0"
          strokeWidth="1"
        />
      );
    }

    const xLabels = [];
    for (let x = 15; x <= 31; x += 1) {
      xLabels.push(
        <SvgText
          key={`xlabel-${x}`}
          x={scaleX(x)}
          y={diagramHeight + 15}
          fontSize="8"
          textAnchor="middle"
          fill="#000"
        >
          {x}
        </SvgText>
      );
    }

    const yLabels = [];
    for (let y = 7; y <= 18; y += 1) {
      if (y % 1 === 0) {
        yLabels.push(
          <SvgText
            key={`ylabel-${y}`}
            x={-15}
            y={scaleY(y) + 3}
            fontSize="8"
            textAnchor="end"
            fill="#000"
          >
            {y}
          </SvgText>
        );
      }
    }

    return (
      <View style={isModal ? wrcStyles.fullDiagramContainer : wrcStyles.miniDiagramContainer}>
        <Svg 
          width={diagramWidth + 60} 
          height={diagramHeight + 60}
          viewBox={`0 0 ${diagramWidth + 60} ${diagramHeight + 60}`}
          preserveAspectRatio="xMidYMid meet"
        >
          <G x={40} y={20}>
            {gridLines}
            
            {lines.map((line, index) => (
              <Line
                key={`main-${index}`}
                x1={scaleX(line.startX)}
                y1={scaleY(line.startY)}
                x2={scaleX(line.endX)}
                y2={scaleY(line.endY)}
                stroke="#404040"
                strokeWidth="0.5"
              />
            ))}
            
            {mLine.map((line, index) => (
              <Line
                key={`m-${index}`}
                x1={scaleX(line.startX)}
                y1={scaleY(line.startY)}
                x2={scaleX(line.endX)}
                y2={scaleY(line.endY)}
                stroke="#000"
                strokeWidth="1.5"
              />
            ))}
            
            {uLine.map((line, index) => (
              <Line
                key={`u-${index}`}
                x1={scaleX(line.startX)}
                y1={scaleY(line.startY)}
                x2={scaleX(line.endX)}
                y2={scaleY(line.endY)}
                stroke="#000"
                strokeWidth="1"
              />
            ))}
            
            {tLine.map((line, index) => (
              <Line
                key={`t-${index}`}
                x1={scaleX(line.startX)}
                y1={scaleY(line.startY)}
                x2={scaleX(line.endX)}
                y2={scaleY(line.endY)}
                stroke="#000"
                strokeWidth="1"
              />
            ))}
            
            {zeroLine.map((line, index) => (
              <Line
                key={`zero-${index}`}
                x1={scaleX(line.startX)}
                y1={scaleY(line.startY)}
                x2={scaleX(line.endX)}
                y2={scaleY(line.endY)}
                stroke="#000"
                strokeWidth="1"
              />
            ))}
            
            {rangeRect && (
              <Rect
                x={rangeRect.x}
                y={rangeRect.y}
                width={rangeRect.width}
                height={rangeRect.height}
                fill="rgba(52, 152, 219, 0.2)"
                stroke="#3498db"
                strokeWidth="1.5"
                strokeDasharray="4,2"
              />
            )}
            
            <SvgText
              x={scaleX(15.5)}
              y={scaleY(13)}
              fontSize="12"
              fontWeight="bold"
              fill="#000"
              textAnchor="start"
              rotation={45}
              origin={`${scaleX(15.5)}, ${scaleY(13)}`}
            >
              M
            </SvgText>
            
            <SvgText
              x={scaleX(18)}
              y={scaleY(15)}
              fontSize="14"
              fontWeight="bold"
              fill="#000"
              textAnchor="middle"
            >
              A
            </SvgText>
            <SvgText
              x={scaleX(20.5)}
              y={scaleY(15)}
              fontSize="14"
              fontWeight="bold"
              fill="#000"
              textAnchor="middle"
            >
              A+F
            </SvgText>
            <SvgText
              x={scaleX(22)}
              y={scaleY(14)}
              fontSize="14"
              fontWeight="bold"
              fill="#000"
              textAnchor="middle"
            >
              F+A
            </SvgText>
            <SvgText
              x={scaleX(25)}
              y={scaleY(12)}
              fontSize="14"
              fontWeight="bold"
              fill="#000"
              textAnchor="middle"
            >
              F
            </SvgText>
            
            {endLabels.map((label, index) => {
              const position = getEndLabelPosition(label.lineIndex);
              if (!position) return null;
              
              return (
                <SvgText
                  key={`endlabel-${index}`}
                  x={position.x + 8}
                  y={position.y - 5}
                  fontSize="10"
                  fontWeight="bold"
                  textAnchor="start"
                  fill="#000"
                >
                  {label.value}
                </SvgText>
              );
            })}
            
            {showDataPoint && results.CrEq && results.NiEq && (
              <G>
                <Line
                  x1={scaleX(parseFloat(results.CrEq))}
                  y1={0}
                  x2={scaleX(parseFloat(results.CrEq))}
                  y2={diagramHeight}
                  stroke="#e74c3c"
                  strokeWidth="1"
                  strokeDasharray="5,5"
                />
                <Line
                  x1={0}
                  y1={scaleY(parseFloat(results.NiEq))}
                  x2={diagramWidth}
                  y2={scaleY(parseFloat(results.NiEq))}
                  stroke="#e74c3c"
                  strokeWidth="1"
                  strokeDasharray="5,5"
                />
                
                <Circle
                  cx={scaleX(parseFloat(results.CrEq))}
                  cy={scaleY(parseFloat(results.NiEq))}
                  r="2"
                  fill="#e74c3c"
                  stroke="#c0392b"
                  strokeWidth="1.5"
                />
              </G>
            )}
            
            <Line
              x1={0}
              y1={diagramHeight}
              x2={diagramWidth}
              y2={diagramHeight}
              stroke="#000"
              strokeWidth="2"
            />
            
            <Line
              x1={0}
              y1={0}
              x2={0}
              y2={diagramHeight}
              stroke="#000"
              strokeWidth="2"
            />
            
            {xLabels}
            
            {yLabels}

            {Array.from({ length: 31 - 15 + 1 }, (_, i) => 15 + i).map(x => (
              <Line
                key={`xmark-${x}`}
                x1={scaleX(x)}
                y1={diagramHeight}
                x2={scaleX(x)}
                y2={diagramHeight + 5}
                stroke="#000"
                strokeWidth="1"
              />
            ))}

            {Array.from({ length: 18 - 7 + 1 }, (_, i) => 7 + i).map(y => (
              <Line
                key={`ymark-${y}`}
                x1={0}
                y1={scaleY(y)}
                x2={-5}
                y2={scaleY(y)}
                stroke="#000"
                strokeWidth="1"
              />
            ))}

            {isModal && (
              <G>
                <SvgText
                  x={diagramWidth - 10}
                  y={diagramHeight + 40}
                  fontSize="10"
                  fill="#000"
                  textAnchor="end"
                >
                  Ni-equivalent = Ni + 35×C + 20×N + 0.25×Cu
                </SvgText>
                <SvgText
                  x={diagramWidth - 10}
                  y={diagramHeight + 55}
                  fontSize="10"
                  fill="#000"
                  textAnchor="end"
                >
                  Cr-equivalent = Cr + Mo + 0.7×Nb
                </SvgText>
              </G>
            )}
          </G>
        </Svg>
      </View>
    );
  };

  const BulletPoint = ({ children }) => (
    <View style={wrcStyles.bulletContainer}>
      <View style={wrcStyles.bulletCircle} />
      <Text style={[wrcStyles.bulletText, { 
        textAlign: language === 'fa' ? 'right' : 'left',
        textAlignVertical: 'center'
      }]}>{children}</Text>
    </View>
  );

  const MiniDiagram = () => (
    <TouchableOpacity style={wrcStyles.miniDiagramContainer} onPress={() => setShowDiagram(true)}>
      <Text style={wrcStyles.miniDiagramTitle}>
        {t('wrcDiagram', language)} ({t('tapToZoom', language)})
      </Text>
      <SchaefflerDiagram isModal={false} showDataPoint={true} />
    </TouchableOpacity>
  );

  const FullScreenDiagram = () => (
    <Modal visible={showDiagram} animationType="slide">
      <View style={wrcStyles.modalContainer}>
        <View style={wrcStyles.modalHeader}>
          <Text style={wrcStyles.modalTitle}>{t('diagramZoom', language)}</Text>
          <TouchableOpacity style={wrcStyles.closeButton} onPress={() => setShowDiagram(false)}>
            <Text style={wrcStyles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={wrcStyles.fullScreenScroll}>
          <View style={wrcStyles.fullDiagramWrapper}>
            <SchaefflerDiagram isModal={true} showDataPoint={true} />
            
            {results.nearestLine && (
              <View style={wrcStyles.fullNearestLineInfo}>
                <Text style={[wrcStyles.fullNearestLineTitle, { 
                  textAlign: language === 'fa' ? 'right' : 'left',
                  textAlignVertical: 'center'
                }]}>
                  {t('analysisResults', language)}
                </Text>
                <BulletPoint>
                  {t('pointOnLine', language)} {results.nearestLine} ({t('ferriteNumber', language)}={results.nearestLine}).
                </BulletPoint>
              </View>
            )}
            
            <View style={wrcStyles.fullFormulas}>
              <Text style={[wrcStyles.fullFormula, { 
                textAlign: language === 'fa' ? 'right' : 'left',
                textAlignVertical: 'center'
              }]}>
                {t('wrcFormula2', language)}
              </Text>
              <Text style={[wrcStyles.fullFormula, { 
                textAlign: language === 'fa' ? 'right' : 'left',
                textAlignVertical: 'center'
              }]}>
                {t('wrcFormula1', language)}
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={[wrcStyles.container, { direction: 'ltr' }]}>
      <ScrollView 
        style={wrcStyles.scrollView}
        ref={scrollViewRef}
        contentContainerStyle={wrcStyles.scrollContent}
      >
        <View style={wrcStyles.topSpacer} />
        
        <Text style={wrcStyles.companyTitle}>Welding Tools</Text>
        
        <Text style={wrcStyles.subtitle}>{t('wrcDiagram', language)}</Text>
        
        <View style={[wrcStyles.tableHeader, { direction: 'ltr' }]}>
          <View style={[wrcStyles.columnHeader, wrcStyles.maxHeader]}>
            <Text style={wrcStyles.columnHeaderText}>{t('max', language)}</Text>
          </View>
          <View style={[wrcStyles.columnHeader, wrcStyles.minHeader]}>
            <Text style={wrcStyles.columnHeaderText}>{t('min', language)}</Text>
          </View>
          <View style={[wrcStyles.columnHeader, wrcStyles.valueHeader]}>
            <Text style={wrcStyles.columnHeaderText}>{t('value', language)}</Text>
          </View>
          <View style={[wrcStyles.columnHeader, wrcStyles.elementHeader]}>
            <Text style={wrcStyles.columnHeaderText}>{t('element', language)}</Text>
          </View>
        </View>

        <View style={[wrcStyles.inputContainer, { direction: 'ltr' }]}>
          {['C', 'Cr', 'Mo', 'Ni', 'Cu', 'Nb', 'N'].map((element) => (
            <View key={element} style={[wrcStyles.inputRow, { direction: 'ltr' }]}>
              <View style={[wrcStyles.inputWrapper, wrcStyles.maxInput]}>
                <TextInput
                  style={wrcStyles.input}
                  value={inputs[element].max}
                  onChangeText={(value) => handleInputChange(element, 'max', value)}
                  keyboardType="numeric"
                  placeholder=""
                  textAlign="center"
                />
              </View>
              <View style={[wrcStyles.inputWrapper, wrcStyles.minInput]}>
                <TextInput
                  style={wrcStyles.input}
                  value={inputs[element].min}
                  onChangeText={(value) => handleInputChange(element, 'min', value)}
                  keyboardType="numeric"
                  placeholder=""
                  textAlign="center"
                />
              </View>
              <View style={[wrcStyles.inputWrapper, wrcStyles.valueInput]}>
                <TextInput
                  style={wrcStyles.input}
                  value={inputs[element].value}
                  onChangeText={(value) => handleInputChange(element, 'value', value)}
                  keyboardType="numeric"
                  placeholder=""
                  textAlign="center"
                />
              </View>
              <View style={[wrcStyles.labelContainer, wrcStyles.elementLabel]}>
                <Text style={wrcStyles.label}>{element}</Text>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity 
          style={[wrcStyles.button, loading && wrcStyles.buttonDisabled]} 
          onPress={calculateWRC}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={wrcStyles.buttonText}>{t('calculateWRC', language)}</Text>
          )}
        </TouchableOpacity>

        {showResults && (
          <>
            <View style={wrcStyles.results}>
              <Text style={wrcStyles.sectionTitle}>{t('wrcResults', language)}</Text>
              
              <View style={wrcStyles.resultsRow}>
                <View style={wrcStyles.resultColumn}>
                  <Text style={wrcStyles.resultType}>{t('mainValues', language)}</Text>
                  <Text style={wrcStyles.resultText}>
                    {t('chromiumEquivalent', language)}: <Text style={wrcStyles.highlight}>{results.CrEq}</Text>
                  </Text>
                  <Text style={wrcStyles.resultText}>
                    {t('nickelEquivalent', language)}: <Text style={wrcStyles.highlight}>{results.NiEq}</Text>
                  </Text>
                </View>
                
                <View style={wrcStyles.resultColumn}>
                  <Text style={wrcStyles.resultType}>{t('rangeMinMax', language)}</Text>
                  <Text style={wrcStyles.resultText}>
                    CrEq: <Text style={wrcStyles.rangeText}>{results.CrEq_min} - {results.CrEq_max}</Text>
                  </Text>
                  <Text style={wrcStyles.resultText}>
                    NiEq: <Text style={wrcStyles.rangeText}>{results.NiEq_min} - {results.NiEq_max}</Text>
                  </Text>
                </View>
              </View>

              {results.nearestLine && (
                <View style={wrcStyles.nearestLineResult}>
                  <Text style={[wrcStyles.nearestLineResultTitle, { 
                    textAlign: language === 'fa' ? 'right' : 'left',
                    textAlignVertical: 'center'
                  }]}>
                    {t('analysisResults', language)}
                  </Text>
                  <BulletPoint>
                    {t('pointOnLine', language)} {results.nearestLine} ({t('ferriteNumber', language)}={results.nearestLine}).
                  </BulletPoint>
                </View>
              )}
            </View>

            <MiniDiagram />

            <View style={wrcStyles.help}>
              <Text style={[wrcStyles.helpTitle, { 
                textAlign: language === 'fa' ? 'right' : 'left',
                textAlignVertical: 'center'
              }]}>
                {t('helpGuide', language)}
              </Text>
              <Text style={[wrcStyles.helpText, { 
                textAlign: language === 'fa' ? 'right' : 'left',
                textAlignVertical: 'center'
              }]}>
                • {t('wrcFormula1', language)}
              </Text>
              <Text style={[wrcStyles.helpText, { 
                textAlign: language === 'fa' ? 'right' : 'left',
                textAlignVertical: 'center'
              }]}>
                • {t('wrcFormula2', language)}
              </Text>
              <Text style={[wrcStyles.helpText, { 
                textAlign: language === 'fa' ? 'right' : 'left',
                textAlignVertical: 'center'
              }]}>
                • {t('diagonalLines', language)}
              </Text>
              <Text style={[wrcStyles.helpText, { 
                textAlign: language === 'fa' ? 'right' : 'left',
                textAlignVertical: 'center'
              }]}>
                • {t('blueRectangle', language)}
              </Text>
            </View>
          </>
        )}
        
        <View style={wrcStyles.bottomSpacerBeforeButton} />
        
        <TouchableOpacity 
          style={wrcStyles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={wrcStyles.backButtonText}>{t('back', language)}</Text>
        </TouchableOpacity>
        
        <View style={wrcStyles.bottomSpacer} />
      </ScrollView>

      <FullScreenDiagram />
    </SafeAreaView>
  );
}

const wrcStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Math.min(Dimensions.get('window').width * 0.03, 15),
    paddingBottom: 0,
  },
  topSpacer: {
    height: 45,
  },
  bottomSpacer: {
    height: 45,
  },
  bottomSpacerBeforeButton: {
    height: 45,
  },
  backButton: {
    backgroundColor: colors.secondary,
    padding: Math.min(Dimensions.get('window').height * 0.02, 15),
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    marginHorizontal: Math.min(Dimensions.get('window').width * 0.05, 20),
    marginBottom: 10,
  },
  backButtonText: {
    color: 'white',
    fontSize: Math.min(Dimensions.get('window').width * 0.04, 16),
    fontWeight: 'bold'
  },
  companyTitle: {
    fontSize: Math.min(Dimensions.get('window').width * 0.06, 18),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: Math.min(Dimensions.get('window').height * 0.01, 8),
    color: colors.textPrimary,
    fontStyle: 'italic',
  },
  subtitle: {
    fontSize: Math.min(Dimensions.get('window').width * 0.045, 14),
    textAlign: 'center',
    marginBottom: Math.min(Dimensions.get('window').height * 0.03, 25),
    color: colors.textSecondary
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: Math.min(Dimensions.get('window').width * 0.025, 10),
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignItems: 'center',
  },
  columnHeader: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  columnHeaderText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: Math.min(Dimensions.get('window').width * 0.035, 14),
  },
  elementHeader: { 
    flex: 2,
    height: Math.min(Dimensions.get('window').height * 0.05, 40),
  },
  valueHeader: { 
    flex: 2,
    height: Math.min(Dimensions.get('window').height * 0.05, 40),
  },
  minHeader: { 
    flex: 1.5,
    height: Math.min(Dimensions.get('window').height * 0.05, 40),
  },
  maxHeader: { 
    flex: 1.5,
    height: Math.min(Dimensions.get('window').height * 0.05, 40),
  },
  inputContainer: {
    backgroundColor: 'white',
    padding: Math.min(Dimensions.get('window').width * 0.02, 8),
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginBottom: Math.min(Dimensions.get('window').height * 0.025, 20),
    elevation: 3,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Math.min(Dimensions.get('window').height * 0.01, 8),
  },
  labelContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  inputWrapper: {
    paddingHorizontal: 2,
    justifyContent: 'center',
  },
  label: {
    fontWeight: 'bold',
    color: colors.textPrimary,
    fontSize: Math.min(Dimensions.get('window').width * 0.035, 14),
    textAlign: 'center',
  },
  elementLabel: {
    flex: 2,
    height: Math.min(Dimensions.get('window').height * 0.05, 40),
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 5,
    padding: Math.min(Dimensions.get('window').width * 0.015, 6),
    textAlign: 'center',
    fontSize: Math.min(Dimensions.get('window').width * 0.04, 12),
    height: Math.min(Dimensions.get('window').height * 0.05, 40),
    textAlignVertical: 'center',
  },
  valueInput: {
    flex: 2,
    backgroundColor: '#f8f9fa'
  },
  minInput: {
    flex: 1.5,
    backgroundColor: '#fff3cd'
  },
  maxInput: {
    flex: 1.5,
    backgroundColor: '#d1ecf1'
  },
  button: {
    backgroundColor: colors.primary,
    padding: Math.min(Dimensions.get('window').height * 0.02, 15),
    borderRadius: 8,
    marginBottom: Math.min(Dimensions.get('window').height * 0.025, 20),
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  buttonDisabled: {
    backgroundColor: colors.textLight,
    opacity: 0.7
  },
  buttonText: {
    color: 'white',
    fontSize: Math.min(Dimensions.get('window').width * 0.04, 16),
    fontWeight: 'bold'
  },
  results: {
    backgroundColor: colors.surface,
    padding: Math.min(Dimensions.get('window').width * 0.04, 15),
    borderRadius: 10,
    marginBottom: Math.min(Dimensions.get('window').height * 0.025, 20),
    elevation: 3,
  },
  sectionTitle: {
    fontSize: Math.min(Dimensions.get('window').width * 0.045, 18),
    fontWeight: 'bold',
    marginBottom: Math.min(Dimensions.get('window').height * 0.02, 15),
    textAlign: 'center',
    color: colors.textPrimary
  },
  resultsRow: {
    flexDirection: Dimensions.get('window').width < 768 ? 'column' : 'row',
    justifyContent: 'space-between',
    marginBottom: Math.min(Dimensions.get('window').height * 0.02, 15),
  },
  resultColumn: {
    flex: 1,
    paddingHorizontal: Math.min(Dimensions.get('window').width * 0.01, 5),
    marginBottom: Dimensions.get('window').width < 768 ? Math.min(Dimensions.get('window').height * 0.015, 10) : 0,
  },
  resultType: {
    fontSize: Math.min(Dimensions.get('window').width * 0.035, 14),
    fontWeight: 'bold',
    marginBottom: Math.min(Dimensions.get('window').height * 0.015, 10),
    color: colors.primary,
    textAlign: 'center'
  },
  resultText: {
    fontSize: Math.min(Dimensions.get('window').width * 0.033, 14),
    marginBottom: Math.min(Dimensions.get('window').height * 0.01, 6),
    textAlign: 'center'
  },
  rangeText: {
    color: colors.success,
    fontWeight: 'bold'
  },
  highlight: {
    color: colors.danger,
    fontWeight: 'bold'
  },
  nearestLineResult: {
    backgroundColor: colors.background,
    padding: Math.min(Dimensions.get('window').width * 0.04, 15),
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.primaryDark,
    marginTop: Math.min(Dimensions.get('window').height * 0.015, 10),
  },
  nearestLineResultTitle: {
    fontSize: Math.min(Dimensions.get('window').width * 0.038, 15),
    fontWeight: 'bold',
    color: colors.primaryDark,
    marginBottom: Math.min(Dimensions.get('window').height * 0.015, 10),
  },
  bulletContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Math.min(Dimensions.get('window').height * 0.01, 8),
  },
  bulletCircle: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primaryDark,
    marginTop: Math.min(Dimensions.get('window').height * 0.008, 6),
    marginRight: Math.min(Dimensions.get('window').width * 0.02, 8),
    marginLeft: Math.min(Dimensions.get('window').width * 0.01, 4),
  },
  bulletText: {
    fontSize: Math.min(Dimensions.get('window').width * 0.033, 13),
    color: colors.textPrimary,
    lineHeight: Math.min(Dimensions.get('window').height * 0.025, 20),
    flex: 1,
    textAlignVertical: 'center',
  },
  miniDiagramContainer: {
    backgroundColor: colors.surface,
    padding: Math.min(Dimensions.get('window').width * 0.04, 15),
    borderRadius: 10,
    marginBottom: Math.min(Dimensions.get('window').height * 0.025, 20),
    elevation: 3,
    alignItems: 'center',
    width: '100%',
  },
  miniDiagramTitle: {
    fontSize: Math.min(Dimensions.get('window').width * 0.038, 16),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: Math.min(Dimensions.get('window').height * 0.015, 10),
    color: colors.textPrimary
  },
  fullDiagramContainer: {
    alignItems: 'center',
    marginBottom: Math.min(Dimensions.get('window').height * 0.025, 20),
    width: '100%',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Math.min(Dimensions.get('window').width * 0.04, 15),
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.primary,
  },
  modalTitle: {
    fontSize: Math.min(Dimensions.get('window').width * 0.045, 18),
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    flex: 1,
  },
  closeButton: {
    padding: Math.min(Dimensions.get('window').width * 0.01, 5),
  },
  closeButtonText: {
    fontSize: Math.min(Dimensions.get('window').width * 0.05, 20),
    color: 'white',
    fontWeight: 'bold',
  },
  fullScreenScroll: {
    flex: 1,
  },
  fullDiagramWrapper: {
    alignItems: 'center',
    padding: Math.min(Dimensions.get('window').width * 0.05, 20),
  },
  fullNearestLineInfo: {
    backgroundColor: colors.background,
    padding: Math.min(Dimensions.get('window').width * 0.04, 15),
    borderRadius: 10,
    marginBottom: Math.min(Dimensions.get('window').height * 0.025, 20),
    borderLeftWidth: 4,
    borderLeftColor: colors.primaryDark,
    width: '90%',
  },
  fullNearestLineTitle: {
    fontSize: Math.min(Dimensions.get('window').width * 0.038, 15),
    fontWeight: 'bold',
    color: colors.primaryDark,
    marginBottom: Math.min(Dimensions.get('window').height * 0.015, 10),
  },
  fullFormulas: {
    marginTop: Math.min(Dimensions.get('window').height * 0.025, 20),
    backgroundColor: '#f8f9fa',
    padding: Math.min(Dimensions.get('window').width * 0.04, 15),
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.border,
    width: '90%',
  },
  fullFormula: {
    fontSize: Math.min(Dimensions.get('window').width * 0.033, 14),
    color: colors.textPrimary,
    marginBottom: Math.min(Dimensions.get('window').height * 0.01, 5),
    fontFamily: 'monospace',
  },
  help: {
    backgroundColor: colors.background,
    padding: Math.min(Dimensions.get('window').width * 0.04, 15),
    borderRadius: 10,
    marginBottom: Math.min(Dimensions.get('window').height * 0.025, 20),
  },
  helpTitle: {
    fontSize: Math.min(Dimensions.get('window').width * 0.038, 16),
    fontWeight: 'bold',
    marginBottom: Math.min(Dimensions.get('window').height * 0.015, 10),
    color: colors.primary
  },
  helpText: {
    fontSize: Math.min(Dimensions.get('window').width * 0.03, 12),
    marginBottom: Math.min(Dimensions.get('window').height * 0.01, 5),
    color: colors.textPrimary
  }
});

/* --------------- صفحه محاسبه گر وزن الکترود --------------- */
function WeldingCalculatorScreen({ navigation }) {
  const webViewRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  const injectedCSS = `
    header, footer, .header, .footer, 
    .site-header, .site-footer,
    .navbar, .breadcrumb,
    .wp-block-navigation,
    .comment-form,
    #header, #footer,
    nav, .nav {
      display: none !important;
    }
    
    body {
      padding: 10px !important;
      margin: 0 !important;
      background: white !important;
      direction: ltr !important;
    }
    
    .calculator-container, 
    .wp-block-group,
    .entry-content {
      margin: 0 auto !important;
      max-width: 100% !important;
      padding: 10px !important;
      direction: ltr !important;
    }
    
    input, select, button {
      font-size: 16px !important;
      min-height: 44px !important;
    }
    
    a:not([href*="calculator"]),
    .widget, .sidebar {
      display: none !important;
    }
  `;

  const injectedJavaScript = `
    var style = document.createElement('style');
    style.textContent = \`${injectedCSS}\`;
    document.head.appendChild(style);
    
    function scrollToResult() {
      setTimeout(function() {
        var resultElements = document.querySelectorAll(
          '.result-box, .output, .calculation-result, ' +
          '[class*="result"], [class*="output"], ' +
          '#result, #output, .wp-block-group__inner-container'
        );
        
        if (resultElements.length > 0) {
          var resultElement = resultElements[0];
          resultElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      }, 1000);
    }

    function setupCalculateButton() {
      var calculateButtons = document.querySelectorAll(
        'button, input[type="submit"], [type="submit"], ' +
        '[value*="Calculate"], [value*="CALCULATE"], ' +
        '[onclick*="calculate"], .calculate-btn, #calculate'
      );
      
      calculateButtons.forEach(function(button) {
        var buttonText = button.textContent || button.value || '';
        if (buttonText.toUpperCase().includes('CALCULATE')) {
          button.addEventListener('click', scrollToResult);
        }
      });
    }

    window.addEventListener('load', function() {
      setTimeout(function() {
        var elementsToHide = document.querySelectorAll('header, footer, nav, .navbar, .site-header, .site-footer');
        elementsToHide.forEach(function(el) {
          el.style.display = 'none';
        });
        
        setupCalculateButton();
        
        var calculator = document.querySelector('.calculator-container') || 
                        document.querySelector('.wp-block-group') ||
                        document.querySelector('form');
        if (calculator) {
          calculator.scrollIntoView({behavior: 'smooth'});
        }
      }, 1000);
    });

    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.addedNodes.length > 0) {
          setupCalculateButton();
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    true;
  `;

  const handleLoadEnd = () => {
    setLoading(false);
  };

  const reinjectScript = () => {
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(injectedJavaScript);
    }
  };

  return (
    <SafeAreaView style={{ 
      flex: 1, 
      backgroundColor: colors.background,
      direction: 'ltr'
    }}>
      <View style={{ 
        flex: 1, 
        backgroundColor: '#fff',
        direction: 'ltr'
      }}>
        <View style={{
          marginTop: 45,
          paddingVertical: 15,
          paddingHorizontal: 20,
          backgroundColor: '#fff',
          borderBottomWidth: 1,
          borderBottomColor: '#e0e0e0',
          alignItems: 'center',
          justifyContent: 'center',
          direction: 'ltr'
        }}>
          <Text style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.primary,
            textAlign: 'center',
          }}>
            {t('electrodeWeightCalculator', language)}
          </Text>
        </View>

        <View style={{ flex: 1, position: 'relative' }}>
          {loading && (
            <View style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'white',
              zIndex: 1000,
              direction: 'ltr'
            }}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          )}
          
          <WebView
            ref={webViewRef}
            source={{ uri: 'https://elgawelding.com/calculator/' }}
            style={{ flex: 1 }}
            injectedJavaScript={injectedJavaScript}
            onLoadEnd={handleLoadEnd}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            scalesPageToFit={true}
            mixedContentMode="compatibility"
            setBuiltInZoomControls={false}
            setDisplayZoomControls={false}
            cacheEnabled={true}
            cacheMode="LOAD_CACHE_ELSE_NETWORK"
            onContentProcessDidTerminate={reinjectScript}
          />
        </View>

        <View style={{
          padding: 15,
          paddingBottom: 45,
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          direction: 'ltr'
        }}>
          <TouchableOpacity 
            style={{
              backgroundColor: colors.primary,
              paddingVertical: 12,
              paddingHorizontal: 30,
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => navigation.goBack()}
          >
            <Text style={{
              color: '#fff',
              fontSize: 16,
              fontWeight: 'bold',
            }}>
              {t('back', language)}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

/* --------------- صفحه ابزارها --------------- */
function ToolsScreen({ navigation }) {
  const { language } = useLanguage();
  const screenWidth = Dimensions.get("window").width;
  const buttonWidth = screenWidth - 80;

  const handleWRCDiagram = () => {
    navigation.navigate("WRCDiagram");
  };

  const handleWeightCalculator = () => {
    navigation.navigate("WeldingCalculator");
  };

  const handleUnitConverter = () => {
    navigation.navigate("UnitConverter");
  };

  const handleGeneralInformation = () => {
  const pdfUrl = language === 'fa' 
    ? 'https://ama-co.com/app/pdf/general_info_fa.pdf'
    : 'https://ama-co.com/app/pdf/general_info_en.pdf';
  
  Linking.openURL(pdfUrl).catch(err => {
    Alert.alert(
      t('error', language),
      language === 'fa' 
        ? 'امکان باز کردن فایل PDF وجود ندارد'
        : 'Cannot open PDF file'
    );
  });
};

  return (
    <SafeAreaView style={{ 
      flex: 1, 
      backgroundColor: colors.background,
      direction: 'ltr'
    }}>
      <View style={{ 
        flex: 1, 
        justifyContent: "flex-start",
        alignItems: "center", 
        padding: 24,
        paddingTop: 80,
        direction: 'ltr'
      }}>
        
        <View style={{ 
          alignItems: 'center',
          marginBottom: 40,
        }}>
          <Text style={[styles.heading1, { marginBottom: 8 }]}>
            {t('tools', language)}
          </Text>
          <Text style={[styles.heading3, { color: colors.textSecondary }]}>
            {t('weldingTools', language)}
          </Text>
        </View>

        <View style={{ width: "100%", alignItems: "center", direction: 'ltr' }}>
          <TouchableOpacity
            onPress={handleWRCDiagram}
            style={[styles.buttonBase, { 
              width: buttonWidth, 
              marginBottom: 13,
              backgroundColor: colors.primary,
              height: 59,
              ...styles.shadowLarge,
            }]}
          >
            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6
            }}>
              {language === 'fa' ? (
                <>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>WRC-Diagram</Text>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>📊</Text>
                </>
              ) : (
                <>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>📊</Text>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>WRC-Diagram</Text>
                </>
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleWeightCalculator}
            style={[styles.buttonBase, { 
              width: buttonWidth, 
              marginBottom: 13,
              backgroundColor: colors.primary,
              height: 59,
              ...styles.shadowLarge,
            }]}
          >
            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6
            }}>
              {language === 'fa' ? (
                <>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
                    {t('electrodeWeightCalculator', language)}
                  </Text>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>⚖️</Text>
                </>
              ) : (
                <>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>⚖️</Text>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
                    {t('electrodeWeightCalculator', language)}
                  </Text>
                </>
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleUnitConverter}
            style={[styles.buttonBase, { 
              width: buttonWidth, 
              marginBottom: 13,
              backgroundColor: colors.primary,
              height: 59,
              ...styles.shadowLarge,
            }]}
          >
            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6
            }}>
              {language === 'fa' ? (
                <>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
                    {t('unitConverter', language)}
                  </Text>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>🔄</Text>
                </>
              ) : (
                <>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>🔄</Text>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
                    {t('unitConverter', language)}
                  </Text>
                </>
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleGeneralInformation}
            style={[styles.buttonBase, { 
              width: buttonWidth, 
              marginBottom: 13,
              backgroundColor: colors.primary,
              height: 59,
              ...styles.shadowLarge,
            }]}
          >
            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6
            }}>
              {language === 'fa' ? (
                <>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
                    {t('generalInformation', language)}
                  </Text>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>📚</Text>
                </>
              ) : (
                <>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>📚</Text>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
                    {t('generalInformation', language)}
                  </Text>
                </>
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.buttonBase, { 
              width: buttonWidth, 
              marginBottom: 13,
              backgroundColor: colors.secondary,
              height: 59,
              ...styles.shadowLarge,
            }]}
          >
            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6
            }}>
              {language === 'fa' ? (
                <>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>{t('back', language)}</Text>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>↩️</Text>
                </>
              ) : (
                <>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>↩️</Text>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>{t('back', language)}</Text>
                </>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

/* =============== تعریف Stack Navigator =============== */
const Stack = createStackNavigator();

/* =============== توابع کمکی =============== */
async function setPortraitOrientation() {
  try {
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
  } catch (error) {
    console.warn("خطا در تنظیم جهت صفحه:", error);
  }
}

/* =============== App =============== */
function AppContent() {
  const { language } = useLanguage();
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    I18nManager.allowRTL(false);
    I18nManager.forceRTL(false);
    
    setPortraitOrientation();
        
    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);
    
        
    return () => {
      appStateSubscription.remove();
    };
  }, [language]);

  const handleAppStateChange = (nextAppState) => {
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('[APP] App became active, resuming downloads if any');
      DownloadScheduler.resumeNormalDownloads();
    } else if (nextAppState.match(/inactive|background/)) {
      console.log('[APP] App went to background, pausing downloads');
      DownloadScheduler.pauseCurrentDownloads();
    }
    setAppState(nextAppState);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Home" 
          screenOptions={{ 
            headerShown: false,
            animationEnabled: true
          }}
        >
          {/* مسیرهای اصلی برنامه */}
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="ProductCatalog" component={ProductCatalogScreen} />
          <Stack.Screen name="SearchByName" component={SearchByNameScreen} />
          <Stack.Screen name="CategoryList" component={CategoryListScreen} />
          <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
          <Stack.Screen name="ProductGallery" component={ProductGalleryScreen} />
          <Stack.Screen name="CertificatesMain" component={CertificatesMainScreen} />
          <Stack.Screen name="ProductCertificate" component={ProductCertificateScreen} />
          <Stack.Screen name="QualityCertificates" component={QualityCertificatesScreen} />
          <Stack.Screen name="About" component={AboutScreen} />
          <Stack.Screen name="Contact" component={ContactScreen} />
          
          {/* مسیرهای جدید ابزارهای محاسبه جوش */}
          <Stack.Screen name="Tools" component={ToolsScreen} />
          <Stack.Screen name="UnitConverter" component={UnitConverterScreen} />
          <Stack.Screen name="WRCDiagram" component={WRCDiagramScreen} />
          <Stack.Screen name="WeldingCalculator" component={WeldingCalculatorScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

function App() {
  useEffect(() => {
    I18nManager.allowRTL(false);
    I18nManager.forceRTL(false);
  }, []);

  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
