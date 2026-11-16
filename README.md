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
- Search file names or document content.
- Share files and remove access.
- Admin dashboard with statistics and employee account controls.
- Arabic and English interfaces.
- Light and dark themes with a mobile-friendly layout.

### Technologies

HTML, CSS, JavaScript, Node.js, Express.js, and MongoDB.

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

7. Open:

   ```text
   http://localhost:3000/login.html
   ```

Use the Node.js server, not Live Server.

### Accounts and Permissions

Accounts and database records are not included. Create an employee through `/api/auth/register` using Postman. An administrator account requires the `admin` role in the local database.

- Owner: manages, shares, and deletes their file.
- View permission: allows downloading.
- Edit permission: allows downloading and changing the category only.
- Administrator: views statistics and manages employee account status.

### Notes

- Maximum file size: 10 MB.
- Uploads support PDF, DOCX, XLSX, PPTX, TXT, PNG, JPG, and JPEG.
- Content search supports the user's own TXT and text-based PDF files.
- Scanned PDFs require OCR, which is not included.
- Up to 500,000 extracted characters per file are searchable.
- Private `.env` files and uploaded documents are excluded from GitHub.
- Uploading the source to GitHub does not host the running application.

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
- البحث باسم الملف أو داخل محتواه.
- مشاركة الملفات وإلغاء المشاركة.
- لوحة مسؤول لعرض الإحصائيات وتفعيل حسابات الموظفين وتعطيلها.
- اللغتان العربية والإنجليزية.
- الوضع الفاتح والداكن وتصميم يناسب الجوال.

### التقنيات

HTML، CSS، JavaScript، Node.js، Express.js، MongoDB.

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

7. افتح الرابط:

   ```text
   http://localhost:3000/login.html
   ```

شغّل الموقع من سيرفر Node.js، وليس من Live Server.

### الحسابات والصلاحيات

الحسابات وقاعدة البيانات غير مرفقة بالمشروع. يمكن إنشاء حساب موظف عبر `/api/auth/register` باستخدام Postman. حساب المسؤول يحتاج تعيين الدور `admin` في قاعدة البيانات المحلية.

- المالك: يدير ملفه ويشاركه ويحذفه.
- صلاحية العرض: تسمح بتنزيل الملف.
- صلاحية التعديل: تسمح بالتنزيل وتغيير التصنيف فقط.
- المسؤول: يعرض الإحصائيات ويدير حالة حسابات الموظفين.

### ملاحظات

- الحد الأقصى للملف: 10 MB.
- الرفع يدعم PDF وDOCX وXLSX وPPTX وTXT وPNG وJPG وJPEG.
- البحث بالمحتوى يدعم ملفات TXT وPDF النصية المملوكة للمستخدم.
- ملفات PDF المصوّرة تحتاج OCR، وهو غير متوفر حاليًا.
- يُبحث في أول 500,000 حرف مستخرج من كل ملف.
- ملف `.env` والمستندات المرفوعة مستبعدة من GitHub.
- رفع الكود على GitHub لا يشغّل الموقع على الإنترنت.
