## 🚀 راه‌اندازی پروکسی امن

برای اجرای این پروژه به صورت امن، نیاز به یک **پروکسی** روی Cloudflare Workers دارید تا کلید API شما مخفی بماند.

### مراحل:
1. فایل `worker.js` را در Cloudflare Workers دیپلوی کنید:
   ```bash
   npm install -g wrangler
   wrangler login
   wrangler deploy
   ```
2. آدرس Worker به دست آمده (مثل `https://poultry-assistant-proxy.xxxx.workers.dev`) را در فایل `index.html` جایگزین کنید.
3. از پروژه لذت ببرید!
