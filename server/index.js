const express = require("express");
const App = express();
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT || 3000;
App.use(express.json());
App.use(express.urlencoded({ extended: true }));
const cors = require("cors");
App.use(cors({
    origin: [
        "https://devadelani.com.ng",
        "http://localhost:3000",

    ],
    methods: ["GET", "POST"],
}));


App.get("/ping", (req, res) => {
    res.status(200).json({ message: "Server is awake" });
});

App.get("/health", (req, res) => {
    res.sendStatus(200);
});

App.post("/contactinfo", async (req, res) => {
    try {

        const { name, email, projectType, message } = req.body;

        const response = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
                accept: "application/json",
                "api-key": process.env.BREVO_API_KEY,
                "content-type": "application/json",
            },
            body: JSON.stringify({
                sender: {
                    name: process.env.SENDER_NAME,
                    email: process.env.SENDER_EMAIL,
                },

                to: [
                    {
                        email: process.env.RECEIVER_EMAIL,
                    },
                ],

                replyTo: {
                    email,
                    name,
                },

                subject: `🚀 New Portfolio Contact (${projectType})`,

                htmlContent: `
                      <div style="font-family:Arial,sans-serif;padding:20px">
  
                          <h2>New Contact Message</h2>
  
                          <hr/>
  
                          <p><strong>Name:</strong> ${name}</p>
  
                          <p><strong>Email:</strong> ${email}</p>
  
                          <p><strong>Project Type:</strong> ${projectType}</p>
  
                          <p><strong>Message</strong></p>
  
                          <div style="
                              padding:16px;
                              background:#f5f5f5;
                              border-radius:8px;
                          ">
                              ${message}
                          </div>
  
                      </div>
                  `,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.log(data);

            return res.status(500).json({
                success: false,
                message: "Unable to send email.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Message sent successfully.",
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json(
            {
                success: false,
                message: "Server Error",
            },
            {
                status: 500,
            }
        );
    }
}
);

App.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});