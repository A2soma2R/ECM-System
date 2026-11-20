# Test Results | نتائج الاختبارات

## English

### 1. Overview

This document records manual testing of the ECM System in a local development environment.

Tests were performed using the browser, browser developer tools, and Postman. Results were confirmed through screenshots or the developer’s confirmation during testing.

Earlier results and tests of the DOCX update are recorded separately. Earlier tests were not all repeated after the latest changes.

These results cover the tested cases only. They do not guarantee that the application has no bugs.

### 2. Test Environment

- Backend: Node.js and Express.js.
- Database: Local MongoDB.
- Frontend: HTML, CSS, and JavaScript.
- Accounts: Administrator and employee accounts.
- Sessions: Separate normal and private browser windows.
- Test data: Temporary folders, TXT files, text-based PDF files, and DOCX documents.
- Mobile layout: Browser device emulation.

### 3. Earlier Authentication and Administration Tests

| Test | Observed result | Status |
| --- | --- | --- |
| Start the application and connect to MongoDB | Server started and database connection succeeded | Passed |
| Register an employee account | Account was created successfully during earlier API testing | Passed |
| Sign in with valid credentials | User reached the appropriate application page | Passed |
| Sign in with an incorrect password | Login was rejected with an error message | Passed |
| Request protected files without a token | Request was rejected with “Access denied. No token provided” | Passed |
| Open the admin page using an employee account | User was redirected to the files page | Passed |
| Request the admin API using an employee account | Server returned 403 with “Admin access is required” | Passed |
| Open the dashboard using an administrator account | Statistics and the users list loaded | Passed |
| Deactivate an employee with an existing session | Refreshing the employee page returned the user to login | Passed |
| Attempt login using an inactive account | Login was rejected with “This account is inactive” | Passed |
| Reactivate an employee account | Employee could sign in again | Passed |
| Submit an object instead of an email string during registration | Invalid registration data was rejected | Passed |

### 4. Earlier Files, Folders, and Search Tests

| Test | Observed result | Status |
| --- | --- | --- |
| Create a folder | Folder appeared in the list | Passed |
| Rename a folder | Updated name appeared | Passed |
| Delete an empty folder | Folder was removed | Passed |
| Delete a folder containing a file | Deletion was rejected and the folder remained | Passed |
| Upload a supported TXT file | Upload succeeded and the file appeared | Passed |
| Download an owned TXT file | Downloaded file contained the expected text | Passed |
| Change the category of an owned file | Updated category appeared in the table | Passed |
| Search TXT content using a known word | Matching file appeared | Passed |
| Search text-based PDF content | Matching PDF appeared | Passed |
| Search for a word that does not exist | Search returned zero results | Passed |
| Search file names using the literal characters `[.*` | Search returned zero results without an error | Passed |
| Attempt to upload an unsupported file type | Upload was rejected through the application | Passed |
| Attempt to upload a file larger than 10 MB | Upload was rejected through the application | Passed |
| Delete temporary owned files | Files were removed | Passed |
| Delete the temporary folder after removing its files | Folder was removed | Passed |

The upload rejection tests above were performed through the application interface. Separate requests that bypass frontend validation were not tested for these cases.

The earlier TXT, PDF, and special-character search tests were not separately repeated after the latest search controller update.

### 5. Earlier Sharing and Permission Tests

| Test | Observed result | Status |
| --- | --- | --- |
| Share a file with another active account | File appeared under “Shared with me” | Passed |
| Download a file with View permission | Recipient could download the file | Passed |
| Check available actions with View permission | Category editing was unavailable in the interface | Passed |
| Change sharing permission to Edit | Recipient could change the file category | Passed |
| Revoke sharing | File disappeared from the recipient’s shared list after refresh | Passed |
| Request the shared-files API | Server returned 200 and the shared file details | Passed |
| Send a direct category update request with View permission | Update was rejected | Passed |
| Send a direct delete request as the recipient | Deletion was rejected and the owner’s file remained | Passed |
| Send a direct download request after sharing was revoked | Download was rejected | Passed |

Edit permission allows category changes. It does not allow editing document contents.

Revoking sharing prevents future access through the application. It does not remove copies already downloaded.

### 6. Interface Tests

| Test | Observed result | Status |
| --- | --- | --- |
| Switch between English and Arabic | Interface language changed successfully | Passed |
| Switch between light and dark modes | Theme changed successfully during earlier testing | Passed |
| Check the layout using mobile device emulation | Fields and buttons remained usable, and the file table could be scrolled horizontally during earlier testing | Passed |
| Display updated search help in English | Help text mentioned DOCX and case/whitespace handling | Passed |
| Display updated search help in Arabic | Translated help text mentioned DOCX and case/whitespace handling | Passed |
| Display DOCX content status | Uploaded DOCX files showed “Content searchable” in both languages | Passed |

The updated bilingual search help and DOCX status were confirmed through screenshots.

Mobile emulation does not replace testing on physical devices. Theme and mobile layout tests were not separately repeated after the latest preferences update.

### 7. DOCX, Search, and File Name Update

The following manual checks were performed after adding Mammoth and updating text extraction, search matching, and uploaded file name handling.

| Test | Observed result | Status |
| --- | --- | --- |
| Upload a new DOCX document | Document appeared and its content was marked searchable | Passed |
| Search DOCX content with different letter case and no space | The developer confirmed that searching `wEeK22` matched the test text `Week 22` | Passed — developer confirmation |
| Upload a TXT file with an Arabic name | The developer confirmed that the new name appeared correctly in the table | Passed — developer confirmation |

The Arabic file name issue affected the displayed name. The developer confirmed that the downloaded TXT contents were already correct before the name-handling fix.

These results do not establish support for every DOCX document structure or every file name encoding.

### 8. Checks Not Performed

The following checks remain unverified:

- Installing and running the project on a clean computer.
- Restoring a complete backup of MongoDB and uploaded files.
- Uploading into another user’s folder through a direct API request.
- Bypassing frontend validation to test upload size and file type restrictions directly.
- Load testing and response-time measurement.
- Concurrent file and folder operations.
- A comprehensive security assessment.
- Separately retesting TXT, PDF, and literal special-character searches after the latest search update.
- Separately testing whitespace-insensitive file name search.
- Retesting themes and mobile layout after the latest preferences update.
- Reindexing older DOCX files previously marked as unsupported.
- Repairing previously stored incorrect Arabic file names.
- DOCX extraction failure and timeout cases, including corrupt or password-protected documents.
- Behaviour at the 500,000-character extraction limit.
- File name decoding across different clients and legacy encodings.

The current project does not include an automated test suite.

### 9. Test Cleanup and Conclusion

Temporary files and folders from the earlier final manual test session were deleted after testing. Cleanup of the later DOCX test documents has not been confirmed.

The earlier tested authentication, file management, search, sharing, administration, and interface scenarios behaved as expected.

The latest checks confirmed DOCX content extraction, the combined case/whitespace content search example, Arabic names for new uploads, and updated bilingual search help.

Untested cases should remain unverified until they are executed. These results do not establish production readiness.

---

## العربية

### 1. نظرة عامة

يوثّق هذا الملف الاختبارات اليدوية لنظام إدارة المحتوى المؤسسي في بيئة تطوير محلية.

نُفّذت الاختبارات باستخدام المتصفح وأدوات المطوّر وPostman. تم تأكيد النتائج من خلال الصور أو تأكيد المطوّر أثناء الاختبار.

فُصلت النتائج السابقة عن اختبارات تحديث DOCX. لم تُعَد جميع الاختبارات السابقة بعد آخر التعديلات.

تغطي النتائج الحالات التي جرى اختبارها فقط، ولا تعني خلو التطبيق من الأخطاء.

### 2. بيئة الاختبار

- الخادم: Node.js وExpress.js.
- قاعدة البيانات: MongoDB محلية.
- الواجهة: HTML وCSS وJavaScript.
- الحسابات: حساب مسؤول وحساب موظف.
- الجلسات: نافذة متصفح عادية وأخرى خاصة.
- بيانات الاختبار: مجلدات مؤقتة وملفات TXT وPDF نصية ومستندات DOCX.
- عرض الجوال: محاكاة الأجهزة من أدوات المتصفح.

### 3. اختبارات تسجيل الدخول والإدارة السابقة

| الاختبار | النتيجة الفعلية | الحالة |
| --- | --- | --- |
| تشغيل التطبيق والاتصال بقاعدة البيانات | نجح تشغيل الخادم والاتصال بقاعدة البيانات | ناجح |
| تسجيل حساب موظف | تم إنشاء الحساب خلال اختبارات API السابقة | ناجح |
| تسجيل الدخول ببيانات صحيحة | وصل المستخدم إلى صفحة التطبيق المناسبة | ناجح |
| تسجيل الدخول بكلمة مرور خاطئة | تم رفض الدخول مع رسالة خطأ | ناجح |
| طلب الملفات المحمية بدون توكن | تم رفض الطلب برسالة توضح عدم وجود توكن | ناجح |
| فتح صفحة المسؤول من حساب موظف | تمت إعادة المستخدم إلى صفحة الملفات | ناجح |
| طلب API المسؤول من حساب موظف | أعاد الخادم 403 ورسالة تتطلب صلاحية المسؤول | ناجح |
| فتح لوحة التحكم من حساب المسؤول | ظهرت الإحصائيات وقائمة المستخدمين | ناجح |
| تعطيل موظف لديه جلسة مفتوحة | أعاد تحديث الصفحة الموظف إلى تسجيل الدخول | ناجح |
| محاولة دخول حساب معطّل | تم رفض الدخول برسالة توضح أن الحساب غير نشط | ناجح |
| إعادة تفعيل حساب الموظف | استطاع الموظف تسجيل الدخول مجددًا | ناجح |
| إرسال كائن بدلًا من نص البريد الإلكتروني عند التسجيل | تم رفض بيانات التسجيل غير الصحيحة | ناجح |

### 4. اختبارات الملفات والمجلدات والبحث السابقة

| الاختبار | النتيجة الفعلية | الحالة |
| --- | --- | --- |
| إنشاء مجلد | ظهر المجلد في القائمة | ناجح |
| إعادة تسمية مجلد | ظهر الاسم الجديد | ناجح |
| حذف مجلد فارغ | تم حذف المجلد | ناجح |
| حذف مجلد يحتوي على ملف | تم رفض الحذف وبقي المجلد موجودًا | ناجح |
| رفع ملف TXT مدعوم | نجح الرفع وظهر الملف | ناجح |
| تنزيل ملف TXT يملكه المستخدم | احتوى الملف المنزّل على النص المتوقع | ناجح |
| تغيير تصنيف ملف مملوك | ظهر التصنيف الجديد في الجدول | ناجح |
| البحث بكلمة معروفة داخل TXT | ظهر الملف المطابق | ناجح |
| البحث داخل PDF نصي | ظهر ملف PDF المطابق | ناجح |
| البحث بكلمة غير موجودة | ظهرت نتائج بعدد صفر | ناجح |
| البحث في أسماء الملفات بالرموز الحرفية `[.*` | ظهرت نتائج بعدد صفر بدون خطأ | ناجح |
| محاولة رفع نوع ملف غير مسموح | تم رفض الرفع من خلال التطبيق | ناجح |
| محاولة رفع ملف أكبر من 10 MB | تم رفض الرفع من خلال التطبيق | ناجح |
| حذف الملفات التجريبية المملوكة | تم حذف الملفات | ناجح |
| حذف المجلد التجريبي بعد إفراغه | تم حذف المجلد | ناجح |

نُفّذت اختبارات رفض الرفع المذكورة أعلاه من خلال واجهة التطبيق. لم تُختبر هذه الحالات بطلبات منفصلة تتجاوز تحقق الواجهة.

لم تُعَد اختبارات البحث داخل TXT وPDF والرموز الخاصة بشكل منفصل بعد آخر تعديل لوحدة البحث.

### 5. اختبارات المشاركة والصلاحيات السابقة

| الاختبار | النتيجة الفعلية | الحالة |
| --- | --- | --- |
| مشاركة ملف مع حساب نشط آخر | ظهر الملف ضمن الملفات المشتركة مع المستلم | ناجح |
| تنزيل ملف بصلاحية View | استطاع المستلم تنزيل الملف | ناجح |
| التحقق من أزرار صلاحية View | لم يكن تعديل التصنيف متاحًا في الواجهة | ناجح |
| تغيير صلاحية المشاركة إلى Edit | استطاع المستلم تعديل التصنيف | ناجح |
| إلغاء المشاركة | اختفى الملف من قائمة المستلم بعد التحديث | ناجح |
| طلب API الملفات المشتركة | أعاد الخادم 200 وتفاصيل الملف المشترك | ناجح |
| إرسال طلب مباشر لتعديل التصنيف بصلاحية View | تم رفض التعديل | ناجح |
| إرسال طلب حذف مباشر من حساب المستلم | تم رفض الحذف وبقي ملف المالك موجودًا | ناجح |
| إرسال طلب تنزيل مباشر بعد إلغاء المشاركة | تم رفض التنزيل | ناجح |

تسمح صلاحية Edit بتغيير التصنيف، ولا تسمح بتعديل محتوى المستند.

يمنع إلغاء المشاركة الوصول اللاحق من خلال التطبيق، ولا يحذف النسخ التي سبق تنزيلها.

### 6. اختبارات الواجهة

| الاختبار | النتيجة الفعلية | الحالة |
| --- | --- | --- |
| التبديل بين الإنجليزية والعربية | تغيّرت لغة الواجهة بنجاح | ناجح |
| التبديل بين الوضع الفاتح والداكن | تغيّر المظهر خلال الاختبار السابق | ناجح |
| فحص الصفحة بمحاكاة الجوال | بقيت الحقول والأزرار قابلة للاستخدام، وأمكن تمرير جدول الملفات أفقيًا خلال الاختبار السابق | ناجح |
| عرض وصف البحث الجديد بالإنجليزية | ظهر دعم DOCX وتجاهل حجم الحروف والمسافات | ناجح |
| عرض وصف البحث الجديد بالعربية | ظهر الوصف المترجم لدعم DOCX وتجاهل حجم الحروف والمسافات | ناجح |
| عرض حالة محتوى DOCX | ظهرت المستندات المرفوعة قابلة للبحث باللغتين | ناجح |

تم تأكيد وصف البحث المحدّث وحالة DOCX بالصور.

لا تغني محاكاة الجوال عن الاختبار على أجهزة فعلية. لم تُعَد اختبارات المظهر وعرض الجوال بشكل منفصل بعد آخر تحديث لملف التفضيلات.

### 7. تحديث DOCX والبحث وأسماء الملفات

نُفّذت الفحوصات التالية بعد إضافة Mammoth وتحديث استخراج النص ومطابقة البحث ومعالجة أسماء الملفات.

| الاختبار | النتيجة الفعلية | الحالة |
| --- | --- | --- |
| رفع مستند DOCX جديد | ظهر المستند وأصبحت حالة محتواه قابلة للبحث | ناجح |
| البحث داخل DOCX باختلاف حجم الحروف وبدون مسافة | أكد المطوّر أن البحث عن `wEeK22` طابق النص التجريبي `Week 22` | ناجح — بتأكيد المطوّر |
| رفع TXT باسم عربي | أكد المطوّر ظهور الاسم الجديد صحيحًا في الجدول | ناجح — بتأكيد المطوّر |

كانت مشكلة الاسم العربي تخص الاسم المعروض. أكد المطوّر أن محتوى TXT المنزّل كان صحيحًا قبل إصلاح معالجة الاسم.

لا تثبت هذه النتائج دعم جميع تراكيب مستندات DOCX أو جميع ترميزات أسماء الملفات.

### 8. فحوصات لم تُنفّذ

لم يتم التحقق من الفحوصات التالية:

- تثبيت المشروع وتشغيله على جهاز جديد.
- استعادة نسخة احتياطية كاملة من MongoDB والملفات المرفوعة.
- رفع ملف إلى مجلد مستخدم آخر من خلال طلب API مباشر.
- تجاوز تحقق الواجهة لاختبار قيود حجم الرفع ونوع الملف مباشرة.
- اختبار الضغط وقياس زمن الاستجابة.
- تنفيذ عمليات ملفات ومجلدات متزامنة.
- إجراء تقييم أمني شامل.
- إعادة اختبار البحث داخل TXT وPDF والرموز الحرفية بعد آخر تعديل للبحث.
- اختبار تجاهل المسافات في اسم الملف بشكل منفصل.
- إعادة اختبار المظهر وعرض الجوال بعد آخر تحديث للتفضيلات.
- إعادة فهرسة ملفات DOCX القديمة المسجّلة كغير مدعومة.
- تصحيح أسماء الملفات العربية المخزّنة سابقًا.
- حالات فشل استخراج DOCX وانتهاء المهلة، بما فيها المستندات التالفة أو المحمية بكلمة مرور.
- السلوك عند حد استخراج 500,000 حرف.
- فك ترميز أسماء الملفات من عملاء مختلفين وترميزات قديمة.

لا يحتوي المشروع الحالي على مجموعة اختبارات آلية.

### 9. تنظيف بيانات الاختبار والخلاصة

تم حذف الملفات والمجلدات المؤقتة من جلسة الاختبار اليدوي النهائية السابقة. لم يُؤكد حذف مستندات اختبار DOCX اللاحقة.

عملت حالات تسجيل الدخول وإدارة الملفات والبحث والمشاركة والإدارة والواجهة التي اختُبرت سابقًا كما هو متوقع.

أكدت الفحوصات الأخيرة استخراج محتوى DOCX، ومثال البحث الذي يجمع اختلاف حجم الحروف وتجاهل المسافات، وأسماء الملفات العربية في الرفع الجديد، ووصف البحث المحدّث باللغتين.

تبقى الحالات غير المختبرة دون تحقق حتى تنفيذها. لا تثبت هذه النتائج جاهزية النظام للاستخدام الإنتاجي.