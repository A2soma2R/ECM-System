# Technical Guide | التوثيق الفني

## English

### 1. Project Overview

ECM is a web application for managing and sharing documents.

The browser sends requests to an Express REST API. MongoDB stores user accounts, folders, file information, and sharing permissions. Uploaded document files are stored in the private `uploads` directory.

### 2. Technologies

| Part | Technology |
| --- | --- |
| Frontend | HTML, CSS, JavaScript |
| Server | Node.js and Express.js |
| Database | MongoDB and Mongoose |
| Authentication | JWT and bcryptjs |
| File uploads | Multer |
| PDF text extraction | pdf-parse |

### 3. Project Structure

| Path | Purpose |
| --- | --- |
| `server.js` | Configure and start the application |
| `config/db.js` | Connect to MongoDB |
| `models/` | Define database schemas |
| `routes/` | Define API routes |
| `controllers/` | Handle application operations |
| `middleware/` | Check login, roles, and uploaded files |
| `public/` | Store frontend pages, styles, and scripts |
| `utils/` | Extract text from supported documents |
| `scripts/` | Index existing document content |
| `uploads/` | Store uploaded document files |

### 4. Database Design

#### User

Stores:

- Name and unique email.
- Hashed password.
- Role: `admin` or `employee`.
- Active account status.
- Creation and update dates.

Password hashes are excluded from normal queries. Login explicitly retrieves the hash to check the password.

#### Folder

Stores:

- Folder name.
- Owner reference.
- Creation and update dates.

#### File

Stores:

- Original and stored file names.
- MIME type and size.
- Folder and owner references.
- Category.
- Sharing entries.
- Extracted text and indexing status.
- Creation and update dates.

Each sharing entry contains a user reference, a `view` or `edit` permission, and the sharing date. Sharing entries are embedded in the File document.

The relationships are:

- A user can own many folders and files.
- A folder can contain many files.
- A file can be shared with several users.

### 5. Authentication and Permissions

1. The user submits an email and password.
2. The server checks the password using bcrypt.
3. An active account receives a JWT valid for one day.
4. Protected API requests send the token in this header:

   ```text
   Authorization: Bearer YOUR_TOKEN
   ```

5. The server verifies the token and loads the current user from MongoDB.
6. Each operation checks the required role or file ownership.

JWT signing and verification use HS256. Deactivated accounts are rejected by the authentication middleware.

Public registration creates employee accounts only. Administrator routes require an administrator role.

### 6. Main API Routes

All routes below require authentication except registration and login.

#### Authentication

| Method | Route | Purpose |
| --- | --- | --- |
| POST | `/api/auth/register` | Create an employee account |
| POST | `/api/auth/login` | Sign in |
| GET | `/api/auth/profile` | Get the current user |

#### Folders

| Method | Route | Purpose |
| --- | --- | --- |
| POST | `/api/folders` | Create a folder |
| GET | `/api/folders` | List owned folders |
| PATCH | `/api/folders/:id` | Rename an owned folder |
| DELETE | `/api/folders/:id` | Delete an empty owned folder |

#### Files

| Method | Route | Purpose |
| --- | --- | --- |
| POST | `/api/files` | Upload a file |
| GET | `/api/files` | List owned files |
| GET | `/api/files/search` | Search owned files |
| GET | `/api/files/shared` | List files shared with the user |
| GET | `/api/files/:id/download` | Download an authorized file |
| PATCH | `/api/files/:id` | Change an authorized file category |
| DELETE | `/api/files/:id` | Delete an owned file |
| GET | `/api/files/:id/shares` | List sharing entries as owner |
| PUT | `/api/files/:id/shares` | Add or update sharing as owner |
| DELETE | `/api/files/:id/shares/:userId` | Remove sharing as owner |

#### Administration

These routes also require the administrator role.

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/api/admin/dashboard` | Get system statistics |
| GET | `/api/admin/users` | List users |
| PATCH | `/api/admin/users/:id/status` | Activate or deactivate an employee |

### 7. Request Formats

Use JSON for normal requests and multipart form data for file uploads.

| Operation | Fields |
| --- | --- |
| Register | `name`, `email`, `password` |
| Login | `email`, `password` |
| Create or rename folder | `name` |
| Upload | `file`, `folderId`, optional `category` |
| Change category | `category` |
| Share file | `email`, `permission` |
| Change account status | `isActive` as a boolean |

Search query parameters:

| Parameter | Purpose |
| --- | --- |
| `search` | Search text |
| `scope` | `name`, `content`, or `all` |
| `category` | Exact category, ignoring letter case |
| `folderId` | Selected folder ID |

Search results always remain restricted to the current user's owned files.

### 8. Upload and Content Search

- One file per upload request.
- Maximum file size: 10 MB.
- Allowed extensions: PDF, DOCX, XLSX, PPTX, TXT, PNG, JPG, and JPEG.
- Files receive generated storage names.
- Uploaded files are stored outside `public`.
- The selected upload folder must belong to the current user.

Text extraction supports TXT and text-based PDF files. It runs in a separate worker with a 20-second timeout. Up to 500,000 extracted characters per file are stored for searching.

Indexing status can be:

`pending`, `indexed`, `truncated`, `empty`, `unsupported`, or `failed`.

An extraction failure does not prevent an otherwise valid file from being uploaded. The file can still be found by name.

To index older pending or failed files:

```bash
npm run index:content
```

To rebuild extracted content for all files:

```bash
npm run index:content -- --all
```

### 9. Sharing Rules

- Only the owner can add, change, or remove sharing.
- Recipients must have active registered accounts when sharing is saved.
- View permission allows downloading.
- Edit permission allows downloading and category changes.
- Recipients cannot delete the file or manage sharing.
- Shared downloads and category changes check that the owner is active.

### 10. Configuration and Startup

The local `.env` file contains:

| Variable | Purpose |
| --- | --- |
| `PORT` | Server port |
| `MONGODB_URI` | Database connection |
| `JWT_SECRET` | Private token signing secret |

The server connects to MongoDB before listening for requests. Express serves the frontend from `public`.

Start normally:

```bash
npm start
```

Start during development:

```bash
npm run dev
```

Open:

```text
http://localhost:3000/login.html
```

### 11. GitHub and Backups

The `.gitignore` excludes private environment files, dependencies, uploaded documents, logs, and backup directories.

The repository includes `.env.example` with placeholder settings and `uploads/.gitkeep` to preserve the upload directory.

To back up application data, keep a matching copy of:

- The MongoDB database.
- The `uploads` directory.
- The private environment configuration, stored securely.

The GitHub repository contains source code, not a backup of the local database or uploaded documents.

### 12. Current Limitations

- No OCR for scanned documents.
- No editing of document contents.
- No password recovery feature.
- No malware scanner.
- Content search covers owned TXT and text-based PDF files only.
- File deletion and database deletion are separate operations.
- Folder emptiness checking and deletion are separate operations.
- The current project version has no automated test suite.
- Publishing source on GitHub does not deploy the application.

---

## العربية

### 1. نظرة عامة

ECM تطبيق ويب لإدارة المستندات ومشاركتها.

يرسل المتصفح الطلبات إلى REST API مبني باستخدام Express. تحفظ MongoDB الحسابات والمجلدات وبيانات الملفات وصلاحيات المشاركة. تُحفظ المستندات نفسها داخل مجلد `uploads` الخاص.

### 2. التقنيات

| الجزء | التقنية |
| --- | --- |
| الواجهة | HTML وCSS وJavaScript |
| السيرفر | Node.js وExpress.js |
| قاعدة البيانات | MongoDB وMongoose |
| تسجيل الدخول | JWT وbcryptjs |
| رفع الملفات | Multer |
| استخراج نص PDF | pdf-parse |

### 3. تنظيم المشروع

| المسار | الوظيفة |
| --- | --- |
| `server.js` | إعداد التطبيق وتشغيله |
| `config/db.js` | الاتصال بقاعدة البيانات |
| `models/` | تعريف نماذج البيانات |
| `routes/` | تعريف مسارات API |
| `controllers/` | تنفيذ عمليات التطبيق |
| `middleware/` | التحقق من الدخول والصلاحيات والرفع |
| `public/` | صفحات الواجهة والتنسيقات والسكربتات |
| `utils/` | استخراج النص من المستندات المدعومة |
| `scripts/` | فهرسة محتوى الملفات الموجودة |
| `uploads/` | حفظ المستندات المرفوعة |

### 4. تصميم قاعدة البيانات

#### المستخدم User

يحفظ:

- الاسم والبريد الإلكتروني الفريد.
- هاش كلمة المرور.
- الدور: مسؤول أو موظف.
- حالة نشاط الحساب.
- تاريخ الإنشاء والتعديل.

هاش كلمة المرور مستبعد من الاستعلامات العادية. يسترجعه تسجيل الدخول صراحة للتحقق من كلمة المرور.

#### المجلد Folder

يحفظ:

- اسم المجلد.
- مرجع المالك.
- تاريخ الإنشاء والتعديل.

#### الملف File

يحفظ:

- اسم الملف الأصلي والاسم المستخدم للتخزين.
- نوع الملف وحجمه.
- مرجع المجلد والمالك.
- التصنيف.
- بيانات المشاركة.
- النص المستخرج وحالة الفهرسة.
- تاريخ الإنشاء والتعديل.

كل مشاركة تتضمن مرجع المستخدم والصلاحية وتاريخ المشاركة. تُحفظ المشاركات داخل سجل الملف.

العلاقات:

- المستخدم يستطيع امتلاك عدة مجلدات وملفات.
- المجلد يستطيع احتواء عدة ملفات.
- الملف يمكن مشاركته مع عدة مستخدمين.

### 5. تسجيل الدخول والصلاحيات

1. يرسل المستخدم البريد الإلكتروني وكلمة المرور.
2. يتحقق السيرفر من كلمة المرور باستخدام bcrypt.
3. يحصل الحساب النشط على JWT صالح لمدة يوم.
4. ترسل الطلبات المحمية التوكن داخل الترويسة:

   ```text
   Authorization: Bearer YOUR_TOKEN
   ```

5. يتحقق السيرفر من التوكن ويسترجع المستخدم الحالي من MongoDB.
6. تتحقق كل عملية من الدور أو ملكية الملف المطلوبة.

يستخدم توقيع JWT والتحقق منه خوارزمية HS256. ترفض طبقة المصادقة الحسابات المعطّلة.

التسجيل العام ينشئ حساب موظف فقط. مسارات المسؤول تتطلب دور المسؤول.

### 6. مسارات API الرئيسية

جميع المسارات التالية تتطلب تسجيل الدخول، باستثناء التسجيل والدخول.

#### الحسابات

| الطريقة | المسار | الوظيفة |
| --- | --- | --- |
| POST | `/api/auth/register` | إنشاء حساب موظف |
| POST | `/api/auth/login` | تسجيل الدخول |
| GET | `/api/auth/profile` | عرض المستخدم الحالي |

#### المجلدات

| الطريقة | المسار | الوظيفة |
| --- | --- | --- |
| POST | `/api/folders` | إنشاء مجلد |
| GET | `/api/folders` | عرض مجلدات المستخدم |
| PATCH | `/api/folders/:id` | تغيير اسم مجلد مملوك |
| DELETE | `/api/folders/:id` | حذف مجلد مملوك وفارغ |

#### الملفات

| الطريقة | المسار | الوظيفة |
| --- | --- | --- |
| POST | `/api/files` | رفع ملف |
| GET | `/api/files` | عرض الملفات المملوكة |
| GET | `/api/files/search` | البحث في الملفات المملوكة |
| GET | `/api/files/shared` | عرض الملفات المشارَكة مع المستخدم |
| GET | `/api/files/:id/download` | تنزيل ملف مصرح به |
| PATCH | `/api/files/:id` | تغيير تصنيف ملف مصرح به |
| DELETE | `/api/files/:id` | حذف ملف مملوك |
| GET | `/api/files/:id/shares` | عرض المشاركات بواسطة المالك |
| PUT | `/api/files/:id/shares` | إضافة المشاركة أو تعديلها بواسطة المالك |
| DELETE | `/api/files/:id/shares/:userId` | إلغاء المشاركة بواسطة المالك |

#### الإدارة

تتطلب هذه المسارات دور المسؤول أيضًا.

| الطريقة | المسار | الوظيفة |
| --- | --- | --- |
| GET | `/api/admin/dashboard` | إحصائيات النظام |
| GET | `/api/admin/users` | قائمة المستخدمين |
| PATCH | `/api/admin/users/:id/status` | تفعيل حساب موظف أو تعطيله |

### 7. بيانات الطلبات

تستخدم الطلبات العادية JSON، ويستخدم رفع الملفات multipart form data.

| العملية | الحقول |
| --- | --- |
| التسجيل | `name` و`email` و`password` |
| الدخول | `email` و`password` |
| إنشاء مجلد أو تغيير اسمه | `name` |
| الرفع | `file` و`folderId` و`category` اختياري |
| تغيير التصنيف | `category` |
| المشاركة | `email` و`permission` |
| تغيير حالة الحساب | `isActive` بقيمة منطقية |

معاملات البحث:

| المعامل | الوظيفة |
| --- | --- |
| `search` | نص البحث |
| `scope` | الاسم `name` أو المحتوى `content` أو كلاهما `all` |
| `category` | التصنيف المطابق مع تجاهل حالة الحروف |
| `folderId` | معرّف المجلد المحدد |

تبقى نتائج البحث محصورة في الملفات المملوكة للمستخدم الحالي.

### 8. الرفع والبحث بالمحتوى

- ملف واحد لكل طلب رفع.
- الحد الأقصى: 10 MB.
- الامتدادات المسموحة: PDF وDOCX وXLSX وPPTX وTXT وPNG وJPG وJPEG.
- يُولّد اسم تخزين للملف.
- تُحفظ الملفات خارج مجلد `public`.
- يجب أن يكون المجلد المختار ملكًا للمستخدم الحالي.

يدعم استخراج النص ملفات TXT وPDF النصية. يعمل الاستخراج في عامل منفصل بمهلة 20 ثانية. يُحفظ حتى 500,000 حرف مستخرج من كل ملف للبحث.

حالات الفهرسة:

`pending`، `indexed`، `truncated`، `empty`، `unsupported`، `failed`.

فشل استخراج النص لا يمنع رفع ملف صالح. يظل البحث باسمه متاحًا.

لفهرسة الملفات القديمة التي لم تُفهرس أو فشل استخراجها:

```bash
npm run index:content
```

لإعادة فهرسة جميع الملفات:

```bash
npm run index:content -- --all
```

### 9. قواعد المشاركة

- المالك وحده يضيف المشاركة أو يغيّرها أو يلغيها.
- يجب أن يكون المستلم مسجّلًا وحسابه نشطًا عند حفظ المشاركة.
- العرض يسمح بالتنزيل.
- التعديل يسمح بالتنزيل وتغيير التصنيف.
- المستلم لا يستطيع حذف الملف أو إدارة مشاركته.
- تنزيل الملف المشارَك وتغيير تصنيفه يتحققان من نشاط حساب المالك.

### 10. الإعداد والتشغيل

يحتوي ملف `.env` المحلي على:

| المتغير | الوظيفة |
| --- | --- |
| `PORT` | منفذ السيرفر |
| `MONGODB_URI` | الاتصال بقاعدة البيانات |
| `JWT_SECRET` | المفتاح السري لتوقيع التوكن |

يتصل السيرفر بـMongoDB قبل استقبال الطلبات. يعرض Express الواجهة من مجلد `public`.

للتشغيل:

```bash
npm start
```

للتطوير:

```bash
npm run dev
```

الرابط:

```text
http://localhost:3000/login.html
```

### 11. GitHub والنسخ الاحتياطي

يستبعد `.gitignore` الإعدادات الخاصة والمكتبات والمستندات المرفوعة والسجلات ومجلدات النسخ الاحتياطي.

يتضمن المستودع `.env.example` بإعدادات نموذجية، و`uploads/.gitkeep` للاحتفاظ بمجلد الرفع.

للنسخ الاحتياطي، احتفظ بنسخة متوافقة من:

- قاعدة MongoDB.
- مجلد `uploads`.
- الإعدادات الخاصة، محفوظة في مكان آمن.

مستودع GitHub يحتوي الكود، وليس نسخة احتياطية من قاعدة البيانات أو المستندات المحلية.

### 12. الحدود الحالية

- لا يوجد OCR للمستندات المصوّرة.
- لا يوجد تعديل لمحتوى المستند.
- لا توجد ميزة استعادة كلمة المرور.
- لا يوجد فحص للبرمجيات الضارة.
- البحث بالمحتوى محصور في ملفات TXT وPDF النصية المملوكة للمستخدم.
- حذف الملف وحذف سجله عمليتان منفصلتان.
- التحقق من فراغ المجلد وحذفه عمليتان منفصلتان.
- النسخة الحالية لا تحتوي اختبارات آلية.
- نشر الكود على GitHub لا يشغّل التطبيق على الإنترنت.