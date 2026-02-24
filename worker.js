// ================================================
// پروکسی اختصاصی برای OpenRouter (Cloudflare Worker)
// مسیر ذخیره: /worker.js
// ================================================

// ⚠️ کلید OpenRouter خود را اینجا قرار دهید
const OPENROUTER_API_KEY = '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';

// اطلاعات برنامه شما (اختیاری)
const YOUR_SITE_URL = 'https://your-site.com'; // آدرس سایت خود را وارد کنید
const YOUR_SITE_NAME = 'ماشین حساب مرغداری';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export default {
  async fetch(request) {
    // فقط POST مجاز است
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 
          'Content-Type': 'application/json',
          'Allow': 'POST',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // مدیریت CORS برای درخواست‌های preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });
    }

    try {
      const requestBody = await request.json();

      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': YOUR_SITE_URL,
          'X-Title': YOUR_SITE_NAME
        },
        body: JSON.stringify(requestBody)
      });

      const responseData = await response.json();

      return new Response(JSON.stringify(responseData), {
        status: response.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });

    } catch (error) {
      return new Response(JSON.stringify({ 
        error: 'Proxy error', 
        details: error.message 
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
  }
};
