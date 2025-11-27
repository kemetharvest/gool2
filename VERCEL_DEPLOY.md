# 🚀 نشر YallaGoal على Vercel

## 📋 المتطلبات

1. حساب على [Vercel](https://vercel.com)
2. Git repository (GitHub, GitLab, أو Bitbucket)
3. Node.js مثبت محلياً (للاختبار)

---

## 🔧 خطوات النشر

### 1️⃣ نشر Backend على Vercel

#### أ) إعداد Backend للنشر

```bash
cd backend
```

أنشئ ملف `vercel.json` في مجلد `backend`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/server.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "src/server.ts"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

#### ب) تحديث `server.ts` لدعم Vercel

أضف في نهاية `backend/src/server.ts`:

```typescript
// Export for Vercel
export default app;
```

#### ج) نشر Backend

1. ارفع الكود إلى GitHub
2. اذهب إلى [Vercel Dashboard](https://vercel.com/dashboard)
3. اضغط "New Project"
4. اختر repository الخاص بالـ backend
5. في "Root Directory" اكتب: `backend`
6. اضغط "Deploy"

**ملاحظة:** أضف متغيرات البيئة في Vercel Dashboard:
- `PORT` (Vercel يضبطه تلقائياً)
- `WS_PORT` (اختياري)
- `EXTERNAL_API_URL`
- `EXTERNAL_API_KEY`
- `POLL_INTERVAL`

---

### 2️⃣ نشر Frontend على Vercel

#### أ) إعداد Frontend

1. أنشئ ملف `.env.production` في `frontend`:

```env
VITE_API_URL=https://your-backend-url.vercel.app
VITE_WS_URL=wss://your-backend-url.vercel.app
```

**ملاحظة:** استبدل `your-backend-url` بـ URL الـ backend من Vercel

#### ب) تحديث WebSocket URL

الملف `frontend/src/hooks/useWebSocket.ts` يستخدم `VITE_WS_URL` تلقائياً.

#### ج) نشر Frontend

**الطريقة 1: عبر Vercel CLI**

```bash
cd frontend
npm install -g vercel
vercel login
vercel --prod
```

**الطريقة 2: عبر Vercel Dashboard**

1. ارفع الكود إلى GitHub
2. اذهب إلى [Vercel Dashboard](https://vercel.com/dashboard)
3. اضغط "New Project"
4. اختر repository
5. في "Root Directory" اكتب: `frontend`
6. في "Build Command" اكتب: `npm run build`
7. في "Output Directory" اكتب: `dist`
8. أضف Environment Variables:
   - `VITE_API_URL` = `https://your-backend-url.vercel.app`
   - `VITE_WS_URL` = `wss://your-backend-url.vercel.app`
9. اضغط "Deploy"

---

## ⚙️ إعدادات مهمة

### Environment Variables في Vercel

**للـ Backend:**
```
PORT=3001
EXTERNAL_API_URL=https://api.football-data.org/v4
EXTERNAL_API_KEY=your_key_here
POLL_INTERVAL=30000
NODE_ENV=production
```

**للـ Frontend:**
```
VITE_API_URL=https://your-backend.vercel.app
VITE_WS_URL=wss://your-backend.vercel.app
```

### WebSocket على Vercel

⚠️ **مهم:** Vercel Serverless Functions لا تدعم WebSocket بشكل مباشر.

**الحلول:**

1. **استخدام خدمة WebSocket منفصلة:**
   - [Ably](https://ably.com)
   - [Pusher](https://pusher.com)
   - [Socket.io Cloud](https://socket.io/cloud)

2. **استخدام Vercel Edge Functions** (محدود)

3. **نشر Backend على خدمة أخرى:**
   - [Railway](https://railway.app)
   - [Render](https://render.com)
   - [Fly.io](https://fly.io)

---

## 🔄 تحديث التطبيق

بعد أي تغيير في الكود:

```bash
git add .
git commit -m "Update"
git push
```

Vercel سيقوم بإعادة النشر تلقائياً!

---

## 📝 ملاحظات

1. **CORS:** تأكد من إضافة frontend URL في CORS settings في backend
2. **WebSocket:** قد تحتاج لخدمة WebSocket منفصلة للإنتاج
3. **API Keys:** لا تضع API keys في الكود، استخدم Environment Variables
4. **Build Time:** أول build قد يستغرق وقتاً أطول

---

## 🐛 حل المشاكل

### Build فاشل
- تحقق من logs في Vercel Dashboard
- تأكد من أن جميع dependencies موجودة في `package.json`

### API لا يعمل
- تحقق من Environment Variables
- تأكد من أن backend URL صحيح

### WebSocket لا يعمل
- Vercel Serverless لا يدعم WebSocket
- استخدم خدمة WebSocket منفصلة أو نشر backend على خدمة أخرى

---

## ✅ بعد النشر

1. اختبر جميع الصفحات
2. تحقق من Console للأخطاء
3. اختبر WebSocket connections
4. راجع Analytics في Vercel Dashboard

---

**🎉 تهانينا! تطبيقك الآن على Vercel!**

