const express = require("express");
const fetch = require("node-fetch");
const bodyParser = require("body-parser");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.json());

const TOKEN = "6021917355:AAFV9sgYQ4c9gLrvNxYh1ezYprOKXwu1oyY";
const CHAT_ID = "5403742714";

app.post("/send-message", async (req, res) => {
  const { name, message } = req.body;

  if (!name || !message) return res.status(400).send("يرجى كتابة الاسم والرسالة");

  try {
    await fetch(https://api.telegram.org/bot${TOKEN}/sendMessage, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: Name: ${name}\nMassage: ${message}
      })
    });

    res.send("تم إرسال الرسالة!");
  } catch (err) {
    console.error(err);
    res.status(500).send("حدث خطأ أثناء الإرسال.");
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Server is running..."));
