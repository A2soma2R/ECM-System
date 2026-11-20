# ECM System | نظام إدارة المحتوى المؤسسي

## English

### About

A graduation project for managing files and documents, developed during cooperative training at King Fahd Glorious Quran Printing Complex.

Developed by **Osamah Asor** with assistance from **Claude, ChatGPT, and Gemini**.

### Features

- Login and user permissions.
- Create, rename, and delete empty folders.
- Upload, download, and delete files.
- Organize files by category.
- Search file names and document content, ignoring letter case and whitespace.
- Search inside TXT, Word (DOCX), and text-based PDF files.
- Support Arabic file names for new uploads.
- Share files and remove access.
- Admin dashboard with statistics and employee account controls.
- Arabic and English interfaces.
- Light and dark themes with a mobile-friendly layout.

### Technologies

HTML, CSS, JavaScript, Node.js, Express.js, and MongoDB.

File uploads use **Multer**. Text extraction uses **pdf-parse** for PDF and **Mammoth** for DOCX.

### Run the Project

1. Install Node.js and MongoDB. Make sure MongoDB is running.
2. Download the project and open a terminal in its folder.
3. Install the dependencies:

   ```bash
   npm ci
   ```

4. Copy `.env.example` and name the copy `.env`.
5. Set the database connection and a private, random JWT secret in `.env`.
6. Start the application:

   ```bash
   npm start
   ```

7. Open [http://localhost:3000/login.html](http://localhost:3000/login.html).

Use the Node.js server to run the application. Live Server does not run its backend.

### Accounts and Permissions

Accounts and database records are not included. Create an employee through `/api/auth/register` using Postman. An administrator account requires the `admin` role in the local database.

- Owner: manages, shares, and deletes their file.
- View permission: allows downloading.
- Edit permission: allows downloading and changing the category only.
- Administrator: views statistics and manages employee account status.

### Search

- Content search covers the signed-in user's own TXT, DOCX, and text-based PDF files.
- File name and content searches ignore letter case and whitespace.
- For example, `Week 22`, `week22`, and `WeEk   22` match the same text.
- Category and folder filters can narrow the results.
- Up to 500,000 extracted characters per file are searchable.
- Scanned PDFs and images require OCR for content search. OCR is not included.
- Other supported upload formats can be found by file name.

### Notes

- Maximum file size: 10 MB.
- Uploads support PDF, DOCX, XLSX, PPTX, TXT, PNG, JPG, and JPEG.
- Word content search supports `.docx`, not the older `.doc` format.
- Files uploaded before DOCX support was added may require content reindexing.
- The Arabic file name correction applies to new uploads. Previously stored names are not automatically repaired.
- Private `.env` files and uploaded documents are excluded from GitHub.
- Uploading the source to GitHub does not host the running application.

### Documentation

- [User Guide](USER_GUIDE.md)
- [Technical Guide](TECHNICAL_GUIDE.md)
- [System Design](SYSTEM_DESIGN.md)
- [Test Results](TEST_RESULTS.md)

---

## العربية

### عن المشروع

مشروع تخرج لإدارة الملفات والمستندات، تم تطويره خلال التدريب التعاوني في مجمع الملك فهد لطباعة المصحف الشريف.

إعداد وتطوير: **Osamah Asor**، بمساعدة **Claude وChatGPT وGemini**.

### المميزات

- تسجيل الدخول وصلاحيات المستخدمين.
- إنشاء المجلدات وتغيير أسمائها وحذف المجلدات الفارغة.
- رفع الملفات وتنزيلها وحذفها.
- تنظيم الملفات حسب التصنيف.
- البحث باسم الملف ومحتواه مع تجاهل حجم الحروف والمسافات.
- البحث داخل ملفات TXT وWord بصيغة DOCX وPDF النصية.
- دعم أسماء الملفات العربية عند الرفع الجديد.
- مشاركة الملفات وإلغاء المشاركة.
- لوحة مسؤول لعرض الإحصائيات وتفعيل حسابات الموظفين وتعطيلها.
- اللغتان العربية والإنجليزية.
- الوضع الفاتح والداكن وتصميم يناسب الجوال.

### التقنيات

HTML، CSS، JavaScript، Node.js، Express.js، MongoDB.

يستخدم رفع الملفات مكتبة **Multer**، واستخراج النص مكتبة **pdf-parse** لملفات PDF ومكتبة **Mammoth** لملفات DOCX.

### تشغيل المشروع

1. ثبّت Node.js وMongoDB، وتأكد أن MongoDB يعمل.
2. نزّل المشروع وافتح التيرمنال داخل مجلده.
3. ثبّت المكتبات:

   ```bash
   npm ci
   ```

4. انسخ ملف `.env.example` وسمّ النسخة `.env`.
5. ضع إعدادات قاعدة البيانات ومفتاح JWT سريًا وعشوائيًا داخل `.env`.
6. شغّل المشروع:

   ```bash
   npm start
   ```

7. افتح [http://localhost:3000/login.html](http://localhost:3000/login.html).

شغّل التطبيق من سيرفر Node.js؛ إضافة Live Server لا تشغّل الخادم الخلفي للمشروع.

### الحسابات والصلاحيات

الحسابات وقاعدة البيانات غير مرفقة بالمشروع. يمكن إنشاء حساب موظف عبر `/api/auth/register` باستخدام Postman. حساب المسؤول يحتاج تعيين الدور `admin` في قاعدة البيانات المحلية.

- المالك: يدير ملفه ويشاركه ويحذفه.
- صلاحية العرض: تسمح بتنزيل الملف.
- صلاحية التعديل: تسمح بالتنزيل وتغيير التصنيف فقط.
- المسؤول: يعرض الإحصائيات ويدير حالة حسابات الموظفين.

### البحث

- البحث بالمحتوى يشمل ملفات TXT وDOCX وPDF النصية المملوكة للمستخدم المسجّل دخوله.
- يتجاهل البحث باسم الملف ومحتواه حجم الحروف والمسافات.
- مثلًا، تطابق `Week 22` و`week22` و`WeEk   22` النص نفسه.
- يمكن تضييق النتائج باستخدام التصنيف والمجلد.
- يشمل البحث أول 500,000 حرف مستخرج من كل ملف.
- ملفات PDF المصوّرة والصور تحتاج OCR للبحث داخل محتواها، وهو غير متوفر حاليًا.
- يمكن العثور على صيغ الرفع الأخرى باسم الملف.

### ملاحظات

- الحد الأقصى للملف: 10 MB.
- الرفع يدعم PDF وDOCX وXLSX وPPTX وTXT وPNG وJPG وJPEG.
- البحث داخل Word يدعم صيغة `.docx` ولا يدعم صيغة `.doc` القديمة.
- الملفات المرفوعة قبل إضافة دعم DOCX قد تحتاج إعادة فهرسة المحتوى.
- تصحيح أسماء الملفات العربية يطبّق على الرفع الجديد، ولا يصلح الأسماء المخزّنة سابقًا تلقائيًا.
- ملف `.env` والمستندات المرفوعة مستبعدة من GitHub.
- رفع الكود على GitHub لا يشغّل الموقع على الإنترنت.

### التوثيق

- [دليل المستخدم](USER_GUIDE.md)
- [التوثيق الفني](TECHNICAL_GUIDE.md)
- [تصميم النظام](SYSTEM_DESIGN.md)
- [نتائج الاختبارات](TEST_RESULTS.md)