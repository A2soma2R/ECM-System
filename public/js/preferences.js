"use strict";

// ===== Interface Translations =====
(() => {
const translations = {
  "Enterprise Content Management": "إدارة المحتوى المؤسسي",
  "King Fahd Glorious Quran Printing Complex": "مجمع الملك فهد لطباعة المصحف الشريف",
  "Welcome back": "مرحبًا بعودتك",
  "Sign in to access your files and folders.": "سجّل الدخول للوصول إلى ملفاتك ومجلداتك.",
  "Email address": "البريد الإلكتروني",
  "Password": "كلمة المرور",
  "Enter your email address": "أدخل بريدك الإلكتروني",
  "Enter your password": "أدخل كلمة المرور",
  "Show password": "إظهار كلمة المرور",
  "Hide password": "إخفاء كلمة المرور",
  "Sign in": "تسجيل الدخول",
  "Signing in...": "جارٍ تسجيل الدخول...",
  "Sign out": "تسجيل الخروج",
  "My files": "ملفاتي",
  "Upload, organize, and manage your documents.": "ارفع مستنداتك ونظّمها وأدرها.",
  "Admin dashboard": "لوحة تحكم المسؤول",
  "Folders": "المجلدات",
  "New folder name": "اسم المجلد الجديد",
  "Enter a folder name": "أدخل اسم المجلد",
  "Create folder": "إنشاء مجلد",
  "Upload a file": "رفع ملف",
  "Folder": "المجلد",
  "Select a folder": "اختر مجلدًا",
  "Category": "التصنيف",
  "General": "عام",
  "File": "الملف",
  "Choose file": "اختيار ملف",
  "No file selected": "لم يتم اختيار ملف",
  "PDF, DOCX, XLSX, PPTX, TXT, PNG, JPG, or JPEG. Maximum file size: 10 MB.": "الصيغ المسموحة: PDF، DOCX، XLSX، PPTX، TXT، PNG، JPG، JPEG. الحد الأقصى لحجم الملف: 10 ميجابايت.",
  "Upload file": "رفع الملف",
  "File name": "اسم الملف",
  "Search by file name": "البحث باسم الملف",
  "All categories": "جميع التصنيفات",
  "All folders": "جميع المجلدات",
  "Search": "بحث",
  "Clear": "مسح",
  "Your files and available actions": "ملفاتك والإجراءات المتاحة",
  "Size": "الحجم",
  "Actions": "الإجراءات",
  "Shared with me": "تمت مشاركتها معي",
  "Refresh": "تحديث",
  "Files other users have shared with you. Available actions depend on your permission.": "ملفات شاركها الآخرون معك. تعتمد الإجراءات المتاحة على صلاحيتك.",
  "Files shared with you and available actions": "الملفات المشاركة معك والإجراءات المتاحة",
  "Owner": "المالك",
  "Permission": "الصلاحية",
  "Update item": "تعديل العنصر",
  "Name": "الاسم",
  "Cancel": "إلغاء",
  "Save": "حفظ",
  "Share file": "مشاركة الملف",
  "User email address": "البريد الإلكتروني للمستخدم",
  "Enter the user's email address": "أدخل البريد الإلكتروني للمستخدم",
  "View and download": "عرض وتنزيل",
  "Download and edit category": "تنزيل وتعديل التصنيف",
  "Only the owner can delete this file or manage sharing.": "يمكن للمالك فقط حذف هذا الملف أو إدارة مشاركته.",
  "Save sharing": "حفظ المشاركة",
  "Shared with": "تمت المشاركة مع",
  "Close": "إغلاق",
  "View system statistics and manage employee accounts.": "عرض إحصائيات النظام وإدارة حسابات الموظفين.",
  "System statistics": "إحصائيات النظام",
  "Loading statistics...": "جارٍ تحميل الإحصائيات...",
  "Total users": "إجمالي المستخدمين",
  "Active users": "المستخدمون النشطون",
  "Inactive users": "المستخدمون المعطّلون",
  "Total files": "إجمالي الملفات",
  "Total folders": "إجمالي المجلدات",
  "Total file size": "إجمالي حجم الملفات",
  "Users": "المستخدمون",
  "Activate or deactivate employee accounts. Deactivating an account keeps its files and folders. Admin account status cannot be changed here.": "تفعيل حسابات الموظفين أو تعطيلها. تبقى الملفات والمجلدات محفوظة عند التعطيل. لا يمكن تغيير حالة حساب المسؤول هنا.",
  "Loading users...": "جارٍ تحميل المستخدمين...",
  "System users and account status controls": "مستخدمو النظام وخيارات حالة الحساب",
  "Email": "البريد الإلكتروني",
  "Role": "الدور",
  "Status": "الحالة",
  "Update account status": "تغيير حالة الحساب",
  "Confirm": "تأكيد",
  "Active": "نشط",
  "Inactive": "معطّل",
  "Admin": "مسؤول",
  "Employee": "موظف",
  "Activate": "تفعيل",
  "Deactivate": "تعطيل",
  "Your account": "حسابك",
  "Admin account": "حساب مسؤول",
  "Deactivate account": "تعطيل الحساب",
  "Activate account": "تفعيل الحساب",
  "Statistics updated.": "تم تحديث الإحصائيات.",
  "Unable to load statistics.": "تعذّر تحميل الإحصائيات.",
  "Unable to load users.": "تعذّر تحميل المستخدمين.",
  "No users found.": "لا يوجد مستخدمون.",
  "Unable to load dashboard.": "تعذّر تحميل لوحة التحكم.",
  "Reload the page to try again.": "أعد تحميل الصفحة للمحاولة مجددًا.",
  "Account status updated successfully.": "تم تغيير حالة الحساب بنجاح.",
  "User account activated successfully": "تم تفعيل حساب المستخدم بنجاح",
  "User account deactivated successfully": "تم تعطيل حساب المستخدم بنجاح",
  "Unable to connect. Check your connection and try again.": "تعذّر الاتصال. تحقّق من اتصالك وحاول مجددًا.",
  "Please sign in again.": "يرجى تسجيل الدخول مجددًا.",
  "Admin access is unavailable.": "صلاحية المسؤول غير متاحة.",
  "Unable to complete this action. Please try again.": "تعذّر إكمال هذا الإجراء. حاول مجددًا.",
  "The statistics response is incomplete.": "بيانات الإحصائيات غير مكتملة.",
  "The users response is incomplete.": "بيانات المستخدمين غير مكتملة.",
  "Unable to load your account information.": "تعذّر تحميل بيانات حسابك.",
  "Your session is unavailable. Please sign in again.": "جلستك غير متاحة. سجّل الدخول مجددًا.",
  "No folders yet. Create your first folder.": "لا توجد مجلدات بعد. أنشئ مجلدك الأول.",
  "Rename": "إعادة تسمية",
  "Delete": "حذف",
  "Rename folder": "إعادة تسمية المجلد",
  "Enter a new name for this folder.": "أدخل اسمًا جديدًا لهذا المجلد.",
  "Folder name": "اسم المجلد",
  "Folder renamed successfully.": "تمت إعادة تسمية المجلد بنجاح.",
  "Delete folder": "حذف المجلد",
  "Folder deleted successfully.": "تم حذف المجلد بنجاح.",
  "Unavailable folder": "المجلد غير متاح",
  "Download": "تنزيل",
  "Share": "مشاركة",
  "Edit category": "تعديل التصنيف",
  "View": "عرض",
  "Loading files...": "جارٍ تحميل الملفات...",
  "No files found.": "لا توجد ملفات.",
  "Unable to load files.": "تعذّر تحميل الملفات.",
  "Unavailable user": "المستخدم غير متاح",
  "Loading shared files...": "جارٍ تحميل الملفات المشاركة...",
  "No files have been shared with you.": "لم تتم مشاركة أي ملفات معك.",
  "Unable to load shared files.": "تعذّر تحميل الملفات المشاركة.",
  "File download started.": "بدأ تنزيل الملف.",
  "Update category": "تعديل التصنيف",
  "Enter a category for this file.": "أدخل تصنيفًا لهذا الملف.",
  "Category updated successfully.": "تم تعديل التصنيف بنجاح.",
  "Delete file": "حذف الملف",
  "File deleted successfully.": "تم حذف الملف بنجاح.",
  "Edit": "تعديل",
  "Remove": "إزالة",
  "File sharing removed successfully.": "تم إلغاء مشاركة الملف بنجاح.",
  "Loading sharing list...": "جارٍ تحميل قائمة المشاركة...",
  "This file has not been shared.": "لم تتم مشاركة هذا الملف.",
  "Unable to load the sharing list.": "تعذّر تحميل قائمة المشاركة.",
  "Enter the user's email address.": "أدخل البريد الإلكتروني للمستخدم.",
  "Enter a valid email address.": "أدخل بريدًا إلكترونيًا صحيحًا.",
  "File sharing saved successfully.": "تم حفظ مشاركة الملف بنجاح.",
  "Enter a folder name.": "أدخل اسم المجلد.",
  "Folder created successfully.": "تم إنشاء المجلد بنجاح.",
  "Select a folder.": "اختر مجلدًا.",
  "Choose a file to upload.": "اختر ملفًا لرفعه.",
  "Choose a supported document or image file.": "اختر مستندًا أو صورة بصيغة مسموحة.",
  "File size must not exceed 10 MB.": "يجب ألا يتجاوز حجم الملف 10 ميجابايت.",
  "File uploaded successfully.": "تم رفع الملف بنجاح.",
  "Unable to load your user information.": "تعذّر تحميل بيانات المستخدم.",
  "Enter your email address.": "أدخل بريدك الإلكتروني.",
  "Enter your password.": "أدخل كلمة المرور.",
  "Unable to sign in. Please try again.": "تعذّر تسجيل الدخول. حاول مجددًا.",
  "Unable to complete sign-in. Check your connection and allow browser storage, then try again.": "تعذّر إكمال تسجيل الدخول. تحقّق من الاتصال واسمح بتخزين بيانات المتصفح، ثم حاول مجددًا.",
  "Invalid email or password": "البريد الإلكتروني أو كلمة المرور غير صحيحة",
  "This account is inactive": "هذا الحساب معطّل",
  "Admin access is required": "يلزم توفر صلاحية المسؤول",
  "Folder is not empty. Delete its files first": "المجلد غير فارغ. احذف ملفاته أولًا",
  "File not found or download access is unavailable": "الملف غير موجود أو صلاحية التنزيل غير متاحة",
  "File not found or edit access is unavailable": "الملف غير موجود أو صلاحية التعديل غير متاحة",
  "File not found": "الملف غير موجود",
  "Folder not found": "المجلد غير موجود",
  "User not found": "المستخدم غير موجود",
  "Shared file is unavailable": "الملف المشارك غير متاح",
  "Unable to share file": "تعذّرت مشاركة الملف",
  "Unable to download file": "تعذّر تنزيل الملف",
  "Unable to update file": "تعذّر تعديل الملف",
  "Unable to delete file": "تعذّر حذف الملف",
  "Unable to update account status": "تعذّر تغيير حالة الحساب",
  "You cannot change your own account status": "لا يمكنك تغيير حالة حسابك",
  "Only employee account status can be changed": "يمكن تغيير حالة حسابات الموظفين فقط",
  "My Files | ECM": "ملفاتي | ECM",
  "Login | ECM": "تسجيل الدخول | ECM",
  "Admin Dashboard | ECM": "لوحة تحكم المسؤول | ECM",
  "Search text": "نص البحث",
  "Enter a file name or words from a document": "أدخل اسم الملف أو كلمات من المستند",
  "Search in": "البحث في",
  "File content": "محتوى الملف",
  "File name and content": "اسم الملف والمحتوى",
  "Content search supports TXT and text-based PDF files in My files. Scanned PDFs and other formats can still be found by file name. Up to 500,000 extracted characters per file are searchable.": "يدعم البحث في المحتوى ملفات TXT وPDF النصية ضمن ملفاتي. يمكنك البحث باسم الملف لملفات PDF المصوّرة والصيغ الأخرى. يشمل البحث أول 500,000 حرف مستخرج من كل ملف.",
  "Content searchable": "يمكن البحث داخل المحتوى",
  "Content searchable: first 500,000 characters": "يمكن البحث في أول 500,000 حرف من المحتوى",
  "No extractable text: search by name": "لا يوجد نص قابل للاستخراج: ابحث باسم الملف",
  "Content search not supported for this format": "البحث داخل المحتوى غير مدعوم لهذه الصيغة",
  "Content indexing failed: search by name": "تعذّرت فهرسة المحتوى: ابحث باسم الملف",
  "Content not indexed yet": "لم تتم فهرسة المحتوى بعد",
  "Invalid search scope": "نطاق البحث غير صحيح",
  "Search text must not exceed 200 characters": "يجب ألا يتجاوز نص البحث 200 حرف",
  "Search filters must be text": "يجب أن تكون خيارات البحث نصية",
  "Unable to search files": "تعذّر البحث عن الملفات"
};

// ===== Saved Preferences =====
const readPreference = (key, fallback) => {
  try { return localStorage.getItem(key) || fallback; }
  catch { return fallback; }
};
let language = readPreference("ecmLanguage", "en") === "ar" ? "ar" : "en";
let theme = readPreference("ecmTheme", "light") === "dark" ? "dark" : "light";
const savePreference = (key, value) => {
  try { localStorage.setItem(key, value); } catch { /* Preferences remain available for this page. */ }
};
const normalize = (text) => text.trim().replace(/\s+/g, " ");

// ===== Messages With Values =====
const translate = (value) => {
  const text = normalize(value);
  if (language === "en") return value;
  if (translations[text]) return translations[text];
  const patterns = [
    [/^(\d+) file\(s\) found\.$/, (n) => `تم العثور على ${n} ملف.`],
    [/^(\d+) shared file\(s\) found\.$/, (n) => `تم العثور على ${n} ملف مشارك.`],
    [/^(\d+) user\(s\) found\.$/, (n) => `تم العثور على ${n} مستخدم.`],
    [/^(\d+) user\(s\) have access\.$/, (n) => `يتوفر الوصول لـ ${n} مستخدم.`],
    [/^Delete "(.*)"\? The folder must be empty\.$/, (name) => `هل تريد حذف المجلد «${name}»؟ يجب أن يكون فارغًا.`],
    [/^Permanently delete "(.*)"\?$/, (name) => `هل تريد حذف الملف «${name}» نهائيًا؟`],
    [/^(.*) cannot be empty\.$/, (label) => `يجب إدخال ${translations[label] || label}.`],
    [/^Deactivate the account for (.*)\? This user will lose access to the system\. Their files and folders will be kept\.$/, (user) => `هل تريد تعطيل حساب ${user}؟ سيفقد المستخدم الوصول إلى النظام، وستبقى ملفاته ومجلداته محفوظة.`],
    [/^Activate the account for (.*)\? This user will be able to sign in again\.$/, (user) => `هل تريد تفعيل حساب ${user}؟ سيتمكن من تسجيل الدخول مجددًا.`],
    [/^Deactivate (.+)$/, (name) => `تعطيل ${name}`],
    [/^Activate (.+)$/, (name) => `تفعيل ${name}`],
    [/^Unable to load the page\. Reload to try again\. (.*)$/, (error) => `تعذّر تحميل الصفحة. أعد تحميلها للمحاولة مجددًا. ${translate(error)}`],
    [/^The action was saved, but the lists could not refresh\. (.*)$/, (error) => `تم حفظ الإجراء، لكن تعذّر تحديث القوائم. ${translate(error)}`],
    [/^([\d.]+) B$/, (n) => `${n} بايت`],
    [/^([\d.]+) KB$/, (n) => `${n} كيلوبايت`],
    [/^([\d.]+) MB$/, (n) => `${n} ميجابايت`],
    [/^([\d.]+) GB$/, (n) => `${n} جيجابايت`],
  ];
  for (const [pattern, render] of patterns) {
    const match = text.match(pattern);
    if (match) return render(...match.slice(1));
  }
  return value;
};

// ===== Apply Theme Before Page Rendering =====
const applyRoot = () => {
  document.documentElement.lang = language;
  document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  document.documentElement.dataset.theme = theme;
};
applyRoot();

// ===== Preserve Source Text During Language Changes =====
const textSources = new WeakMap();
const attributeSources = new WeakMap();
let observer;
let languageSelect;
let themeButton;
const observerOptions = {
  subtree: true, childList: true, characterData: true,
  attributes: true, attributeFilter: ["placeholder", "aria-label", "title"],
};

const skipText = (element) => {
  if (element.closest("script, style, .preferences-bar, .folder-name, .owner-name, .owner-email, .share-user-name, .share-user-email, #userName, #sharingFileName")) return true;
  if (element.closest("#selectedFileName")) {
    return !["No file selected", "لم يتم اختيار ملف"].includes(normalize(element.textContent));
  }
  const cell = element.closest("td");
  if (cell && !element.closest("button, .permission-badge, .account-status, .account-note, .content-status")) {
    const table = cell.closest("table");
    // User-entered file names, categories, names, and email addresses remain unchanged.
    return !(table?.classList.contains("users-table") && cell.cellIndex === 2);
  }
  if (element.tagName === "OPTION" && element.value !== "" && !element.closest("#sharePermission, #searchScope")) return true;
  return false;
};

const applyTranslations = () => {
  observer?.disconnect();
  applyRoot();
  const walker = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    const element = node.parentElement;
    if (!element || !node.nodeValue.trim() || skipText(element)) continue;
    let record = textSources.get(node);
    if (!record || node.nodeValue !== record.rendered) record = { source: node.nodeValue };
    let rendered = translate(record.source);
    // Unknown server messages use a translated fallback without changing user data.
    if (language === "ar" && rendered === record.source && element.closest(".form-message") && /[A-Za-z]{2}/.test(rendered)) {
      rendered = "تعذّر إكمال العملية. تحقّق من البيانات وحاول مجددًا.";
    }
    if (node.nodeValue !== rendered) node.nodeValue = rendered;
    record.rendered = rendered;
    textSources.set(node, record);
  }
  document.querySelectorAll("[placeholder], [aria-label], [title]").forEach((element) => {
    if (element.closest(".preferences-bar")) return;
    const records = attributeSources.get(element) || {};
    for (const key of ["placeholder", "aria-label", "title"]) {
      if (!element.hasAttribute(key)) continue;
      const current = element.getAttribute(key);
      let record = records[key];
      if (!record || current !== record.rendered) record = { source: current };
      record.rendered = translate(record.source);
      if (current !== record.rendered) element.setAttribute(key, record.rendered);
      records[key] = record;
    }
    attributeSources.set(element, records);
  });
  if (languageSelect) {
    languageSelect.setAttribute("aria-label", language === "ar" ? "اللغة" : "Language");
    languageSelect.options[0].textContent = language === "ar" ? "الإنجليزية" : "English";
    languageSelect.options[1].textContent = language === "ar" ? "العربية" : "Arabic";
    languageSelect.value = language;
    themeButton.textContent = language === "ar"
      ? (theme === "dark" ? "الوضع الفاتح" : "الوضع الداكن")
      : (theme === "dark" ? "Light mode" : "Dark mode");
    themeButton.setAttribute("aria-label", themeButton.textContent);
  }
  observer?.observe(document.documentElement, observerOptions);
};

// ===== Preference Controls =====
document.addEventListener("DOMContentLoaded", () => {
  const bar = document.createElement("div");
  bar.className = "preferences-bar";
  languageSelect = document.createElement("select");
  languageSelect.id = "interfaceLanguage";
  languageSelect.append(new Option("English", "en"), new Option("Arabic", "ar"));
  themeButton = document.createElement("button");
  themeButton.type = "button";
  themeButton.id = "interfaceTheme";
  bar.append(languageSelect, themeButton);
  const loginCard = document.querySelector(".login-card");
  if (loginCard) loginCard.prepend(bar);
  else document.body.prepend(bar);

  languageSelect.addEventListener("change", () => {
    language = languageSelect.value === "ar" ? "ar" : "en";
    savePreference("ecmLanguage", language);
    applyTranslations();
  });
  themeButton.addEventListener("click", () => {
    theme = theme === "dark" ? "light" : "dark";
    savePreference("ecmTheme", theme);
    applyTranslations();
  });
  observer = new MutationObserver(applyTranslations);
  applyTranslations();
});
})();
