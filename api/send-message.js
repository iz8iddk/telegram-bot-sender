import fetch from "node-fetch";
import countries from "i18n-iso-countries";

// تهيئة اللغة العربية
countries.registerLocale(require("i18n-iso-countries/langs/ar.json"));

function getFlagEmoji(countryCode) {
  if (!countryCode || countryCode.length !== 2) return "🏳️";
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map(c => 127397 + c.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, message } = req.body;

  if (!name || !message) {
    return res.status(400).send("يرجى تسجيل الدخول");
  }

  try {
    const countryCode = req.headers["x-vercel-ip-country"] || "UN";
    const countryName = countries.getName(countryCode, "ar") || "غير معروف";
    const countryFlag = getFlagEmoji(countryCode);

    // إرسال إلى تيليجرام
    const response = await fetch(
      `https://api.telegram.org/bot${process.env.TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: process.env.CHAT_ID,
          text: `👤 الاسم: ${name}
💬 الرسالة: ${message}
🌍 الدولة: ${countryName} ${countryFlag}`
        })
      }
    );

    const data = await response.json();
    if (!data.ok) throw new Error(data.description);

    return res.status(200).send("تم الإرسال بنجاح");
  } catch (err) {
    console.error(err);
    return res.status(500).send("حدث خطأ أثناء الإرسال");
  }
}
