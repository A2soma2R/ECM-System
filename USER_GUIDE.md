# User Guide | دليل الاستخدام

## English

### 1. Sign In

1. Open http://localhost:3000/login.html while the server is running.
2. Enter your registered email and password.
3. Select **Sign in**.

An inactive account cannot access protected features. Contact the administrator if your account is inactive.

### 2. Language and Theme

- Select Arabic or English from the language menu.
- Use the theme button to switch between light and dark mode.
- Your preferences are saved in the current browser.

### 3. Manage Folders

- Enter a folder name and select **Create folder**.
- Select **Rename** to change a folder name.
- Select **Delete** to remove an empty folder.

A folder containing files cannot be deleted. Delete its files first if you no longer need them.

### 4. Upload a File

1. Select a folder.
2. Enter a category, or leave it empty to use **General**.
3. Select **Choose file** and pick a document.
4. Select **Upload file** and wait for the result.

Maximum file size: **10 MB**.

Supported extensions: PDF, DOCX, XLSX, PPTX, TXT, PNG, JPG, and JPEG.

### 5. Search for Files

1. Enter your search text.
2. Choose where to search: file name, file content, or both.
3. Optionally select a folder or enter a category.
4. Select **Search**.
5. Select **Clear** to remove the filters.

Content search supports your own TXT and text-based PDF files. Scanned PDFs are not supported for content search. Up to 500,000 extracted characters per file are searchable.

### 6. Manage Your Files

- **Download:** Save a copy to your device.
- **Category:** Change the file category.
- **Share:** Manage access for other users.
- **Delete:** Permanently remove your file after confirmation.

Keep a separate backup of important documents before deleting them.

### 7. Share a File

1. Select **Share** next to a file you own.
2. Enter the email of an active registered user.
3. Choose the permission.
4. Select **Save sharing**.

| Permission | Allowed actions |
| --- | --- |
| View | Download the file |
| Edit | Download and change the category |

Edit permission does not allow changing the document contents.

Use the sharing list to change a recipient's permission or remove their access. Only the owner can manage sharing and delete the file.

Removing access does not delete copies already downloaded by the recipient.

### 8. Shared With Me

Open **Shared with me** to find documents shared with your account. Select **Refresh** to reload the list.

Available actions depend on your permission. A shared file becomes unavailable if its owner is inactive or removes your access.

### 9. Administrator Dashboard

Administrator accounts can open **Admin dashboard** from My files.

The dashboard shows:

- Total, active, and inactive users.
- Total files and folders.
- Total file size.

The administrator can activate or deactivate employee accounts. Deactivation preserves their files and folders. Administrator account status cannot be changed through this screen.

### 10. Sign Out

Select **Sign out** when finished, especially on a shared computer.

### Troubleshooting

- **Cannot sign in:** Check your email, password, and account status.
- **No files found:** Clear the search filters and check the signed-in account.
- **Upload failed:** Check the file size, extension, and selected folder.
- **Content search has no result:** Check that the document is a supported text file or text-based PDF.
- **Website unavailable:** Make sure the Node.js server and MongoDB are running.

---

## العربية

### 1. تسجيل الدخول

1. افتح http://localhost:3000/login.html أثناء تشغيل السيرفر.
2. أدخل البريد الإلكتروني المسجّل وكلمة المرور.
3. اضغط **تسجيل الدخول**.

الحساب المعطّل لا يستطيع الوصول إلى الوظائف المحمية. تواصل مع المسؤول إذا كان حسابك معطّلًا.

### 2. اللغة والمظهر

- اختر العربية أو الإنجليزية من قائمة اللغة.
- استخدم زر المظهر للتبديل بين الوضع الفاتح والداكن.
- تُحفظ تفضيلاتك في المتصفح الحالي.

### 3. إدارة المجلدات

- أدخل اسم المجلد واضغط **إنشاء مجلد**.
- استخدم زر إعادة التسمية لتغيير اسم المجلد.
- اضغط **حذف** لإزالة مجلد فارغ.

لا يمكن حذف مجلد يحتوي ملفات. احذف ملفاته أولًا إذا لم تعد تحتاجها.

### 4. رفع ملف

1. اختر المجلد.
2. أدخل التصنيف، أو اتركه فارغًا لاستخدام التصنيف الافتراضي **عام**.
3. اضغط **اختيار ملف** وحدّد المستند.
4. اضغط **رفع الملف** وانتظر النتيجة.

الحد الأقصى لحجم الملف: **10 MB**.

الامتدادات المدعومة: PDF وDOCX وXLSX وPPTX وTXT وPNG وJPG وJPEG.

### 5. البحث عن الملفات

1. أدخل نص البحث.
2. اختر البحث باسم الملف أو محتواه أو كليهما.
3. يمكنك تحديد مجلد أو إدخال تصنيف.
4. اضغط **بحث**.
5. اضغط **مسح** لإزالة الفلاتر.

البحث بالمحتوى يدعم ملفات TXT وPDF النصية المملوكة لك. ملفات PDF المصوّرة غير مدعومة للبحث بالمحتوى. يمكن البحث في أول 500,000 حرف مستخرج من كل ملف.

### 6. إدارة ملفاتك

- **تنزيل:** حفظ نسخة على جهازك.
- **التصنيف:** تغيير تصنيف الملف.
- **مشاركة:** إدارة وصول المستخدمين الآخرين.
- **حذف:** إزالة الملف نهائيًا بعد التأكيد.

احتفظ بنسخة احتياطية مستقلة من المستندات المهمة قبل حذفها.

### 7. مشاركة ملف

1. اضغط **مشاركة** بجانب ملف تملكه.
2. أدخل بريد مستخدم مسجّل وحسابه نشط.
3. اختر الصلاحية.
4. اضغط **حفظ المشاركة**.

| الصلاحية | الإجراءات المسموحة |
| --- | --- |
| عرض | تنزيل الملف |
| تعديل | تنزيل الملف وتغيير التصنيف |

صلاحية التعديل لا تسمح بتغيير محتوى المستند.

استخدم قائمة المشاركات لتغيير صلاحية المستخدم أو إلغاء وصوله. المالك وحده يستطيع إدارة المشاركة وحذف الملف.

إلغاء المشاركة لا يحذف النسخ التي سبق للمستلم تنزيلها.

### 8. تمت مشاركتها معي

انتقل إلى قسم **تمت مشاركتها معي** لعرض الملفات التي شاركها الآخرون مع حسابك. اضغط **تحديث** لإعادة تحميل القائمة.

الإجراءات المتاحة تعتمد على صلاحيتك. يصبح الملف المشارَك غير متاح إذا تعطّل حساب مالكه أو ألغى وصولك.

### 9. لوحة تحكم المسؤول

يمكن لحساب المسؤول فتح **لوحة تحكم المسؤول** من صفحة ملفاتي.

تعرض اللوحة:

- إجمالي المستخدمين والنشطين والمعطّلين.
- إجمالي الملفات والمجلدات.
- إجمالي حجم الملفات.

يستطيع المسؤول تفعيل حسابات الموظفين أو تعطيلها. التعطيل يحافظ على ملفاتهم ومجلداتهم. لا يمكن تغيير حالة حساب المسؤول من هذه الشاشة.

### 10. تسجيل الخروج

اضغط **تسجيل الخروج** عند الانتهاء، خصوصًا عند استخدام جهاز مشترك.

### حل المشكلات

- **تعذّر تسجيل الدخول:** تحقق من البريد وكلمة المرور وحالة الحساب.
- **لا توجد نتائج:** امسح فلاتر البحث وتحقق من الحساب المستخدم.
- **فشل الرفع:** تحقق من حجم الملف وامتداده والمجلد المختار.
- **لا توجد نتيجة في المحتوى:** تأكد أن المستند ملف نصي مدعوم أو PDF نصي.
- **الموقع غير متاح:** تأكد من تشغيل سيرفر Node.js وقاعدة MongoDB.