import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, message } = req.body;

  if (!name || !message) {
    return res.status(400).send("يرجى تسجيل الدخول");
  }

  try {
    // 1️⃣ جلب IP المستخدم
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket.remoteAddress;

    // 2️⃣ جلب الدولة + العلم باستخدام ipwho.is
    let country = "غير معروف";
    let flag = "🏳️";

    try {
      const geoRes = await fetch(`https://ipwho.is/${ip}`);
      const geoData = await geoRes.json();

      if (geoData.success) {
        country = geoData.country;
        flag = geoData.flag.emoji;
      }
    } catch (geoErr) {
      console.log("فشل جلب الدولة");
    }

    // 3️⃣ إرسال الرسالة إلى تيليجرام
    const response = await fetch(
      `https://api.telegram.org/bot${process.env.TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: process.env.CHAT_ID,
          text: `👤 الاسم: ${name}
💬 الرسالة: ${message}
🌍 الدولة: ${country} ${flag}
📡 IP: ${ip}`
        })
      }
    );

    const data = await response.json();
    if (!data.ok) {
      throw new Error(data.description);
    }

    return res
      .status(200)
      .send("تم الإرسال بنجاح، انتظر قليلًا لو ما وصلش");
  } catch (err) {
    console.error(err);
    return res.status(500).send("حدث خطأ أثناء الإرسال.");
  }
}
