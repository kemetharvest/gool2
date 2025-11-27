# 🚀 دليل نشر YallaGoal على Vercel

## 📋 المتطلبات الأساسية

1. حساب على [Vercel](https://vercel.com) (مجاني)
2. حساب GitHub/GitLab/Bitbucket
3. Node.js مثبت (للاختبار المحلي)

---

## 🎯 خطوات النشر السريعة

### الخطوة 1: رفع الكود على GitHub

```bash
# في مجلد المشروع
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/username/yallagoal.git
git push -u origin main
```

### الخطوة 2: نشر Backend على Vercel

1. اذهب إلى [vercel.com](https://vercel.com) وسجل الدخول
2. اضغط **"New Project"**
3. اختر repository الخاص بك
4. في **"Root Directory"** اكتب: `backend`
5. اضغط **"Deploy"**

**إضافة Environment Variables:**
- اضغط على Project → Settings → Environment Variables
- أضف:
  ```
  EXTERNAL_API_URL = https://api.football-data.org/v4
  EXTERNAL_API_KEY = your_api_key_here
  POLL_INTERVAL = 30000
  NODE_ENV = production
  ```

**انسخ Backend URL** (مثل: `https://yallagoal-backend.vercel.app`)

---

### الخطوة 3: نشر Frontend على Vercel

1. في Vercel Dashboard، اضغط **"New Project"** مرة أخرى
2. اختر نفس repository
3. في **"Root Directory"** اكتب: `frontend`
4. في **"Build Command"** اكتب: `npm run build`
5. في **"Output Directory"** اكتب: `dist`

**إضافة Environment Variables:**
- اضغط على Project → Settings → Environment Variables
- أضف:
  ```
  VITE_API_URL = https://your-backend-url.vercel.app
  VITE_WS_URL = wss://your-backend-url.vercel.app
  ```
  (استبدل `your-backend-url` بـ URL الـ backend من الخطوة 2)

6. اضغط **"Deploy"**

---

## ⚠️ ملاحظة مهمة عن WebSocket

**Vercel Serverless Functions لا تدعم WebSocket بشكل كامل.**

### الحلول الموصى بها:

#### الحل 1: استخدام خدمة WebSocket منفصلة

**Ably (مجاني حتى 2000 رسالة/دقيقة):**
1. سجل في [ably.com](https://ably.com)
2. أنشئ App جديد
3. استخدم API Key في frontend

**أو Pusher:**
1. سجل في [pusher.com](https://pusher.com)
2. أنشئ Channel جديد
3. استخدم credentials في الكود

#### الحل 2: نشر Backend على خدمة أخرى

**Railway (سهل ومجاني):**
1. سجل في [railway.app](https://railway.app)
2. اربط GitHub repository
3. اختر `backend` folder
4. Railway سيكتشف تلقائياً ويشغل الـ server

**أو Render:**
1. سجل في [render.com](https://render.com)
2. أنشئ Web Service جديد
3. اربط GitHub repository
4. Root Directory: `backend`

---

## 🔧 إعدادات إضافية

### تحديث CORS في Backend

في `backend/src/server.ts`، تأكد من:

```typescript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-frontend-url.vercel.app'
  ],
  credentials: true
}));
```

### تحديث API URLs

في `frontend/src/services/api.ts`:
- يستخدم `import.meta.env.VITE_API_URL` تلقائياً
- تأكد من إضافة Environment Variable في Vercel

---

## ✅ التحقق من النشر

بعد النشر:

1. ✅ افتح Frontend URL
2. ✅ تحقق من Console (F12) للأخطاء
3. ✅ جرب التنقل بين الصفحات
4. ✅ اختبر API calls من Network tab

---

## 🔄 التحديثات المستقبلية

بعد أي تغيير:

```bash
git add .
git commit -m "Update"
git push
```

Vercel سيعيد النشر تلقائياً! 🎉

---

## 🐛 حل المشاكل الشائعة

### Build فاشل
- ✅ تحقق من logs في Vercel Dashboard
- ✅ تأكد من جميع dependencies في `package.json`
- ✅ تحقق من TypeScript errors

### API لا يعمل
- ✅ تحقق من Environment Variables
- ✅ تأكد من Backend URL صحيح
- ✅ تحقق من CORS settings

### WebSocket لا يعمل
- ⚠️ Vercel Serverless لا يدعم WebSocket
- ✅ استخدم خدمة WebSocket منفصلة (Ably/Pusher)
- ✅ أو انشر Backend على Railway/Render

---

## 📞 المساعدة

إذا واجهت مشاكل:
1. راجع logs في Vercel Dashboard
2. تحقق من Environment Variables
3. راجع [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md) للتفاصيل الكاملة

---

**🎉 تهانينا! تطبيقك الآن على Vercel!**

