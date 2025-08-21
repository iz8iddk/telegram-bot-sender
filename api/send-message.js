import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, message } = req.body;

  if (!name || !message) {
    return res.status(400).send("يرجى كتابة الاسم والرسالة");
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${process.env.TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: process.env.CHAT_ID,
        text: `Name: ${name}\nMessage: ${message}`
      })
    });

    const data = await response.json();
    if (!data.ok) {
      throw new Error(data.description);
    }

    return res.status(200).send("تم إرسال الرسالة!");
  } catch (err) {
    console.error(err);
    return res.status(500).send("حدث خطأ أثناء الإرسال.");
  }
}
