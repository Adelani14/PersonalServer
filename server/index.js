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
        "https://devadelani.vercel.app",
        "http://localhost:3000",


    ],
    credentials: true,
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



                      <body style="margin:0;padding:0;background-color:#2c2d2e;font-family:Arial,Helvetica,sans-serif;color:#e7e7e7;">
    <!-- Email-safe, table-based layout. -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
        style="width:100%;background-color:#2c2d2e;">
        <tr>
            <td style="padding:54px 45px 50px 48px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                    <tr>
                        <td valign="middle"
                            style=" width:52px;height:52px;background:#00d54b;border-radius:14px;text-align:center;vertical-align:middle;">
                            <span
                                style=" font-family:Arial,Helvetica,sans-serif;font-size:38px;line-height:52px;font-weight:bold;color:#222;display:block;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"
                                    fill="#fff" style="vertical-align: middle; transform: skewX(-10deg);">
                                    <path
                                        d="M12 1a1 1 0 0 1 1 1v1.1c3.2.4 5.5 2.3 5.5 5.2h-3.2c0-1.5-1.2-2.6-3.3-2.6-1.9 0-3.1.9-3.1 2.2 0 1.4 1.3 1.9 3.7 2.4 3.4.7 6.1 1.7 6.1 5.1 0 2.8-2.2 4.7-5.7 5.1V22a1 1 0 0 1-2 0v-1.4c-3.6-.4-6-2.4-6-5.6h3.3c0 1.8 1.4 2.8 3.6 2.8 2 0 3.4-.8 3.4-2.2 0-1.5-1.5-2-4-2.6-3.2-.7-5.8-1.8-5.8-5 0-2.6 2.2-4.5 5.5-4.9V2a1 1 0 0 1 1-1z" />
                                </svg>

                            </span>
                        </td>
                        <td
                            style="padding-left:14px;font-size:36px;line-height:42px;font-weight:700;color:#00d54b;white-space:nowrap;">
                            Cash App</td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td align="center" style="padding:0 10px;">
                <table role="presentation" width="720" cellspacing="0" cellpadding="0" border="0"
                    style="width:100%;max-width:720px;background-color:#151515; border-radius: 25px;">


                    <tr>
                        <td style="padding:70px 56px 0 56px;">
                            <img src="data:image/jpeg;base64,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"
                                width="128" height="128" alt="Recipient profile image"
                                style="display:block;width:100px;height:100px;border-radius:50%;object-fit:cover;border:0;">
                            <div
                                style="padding-top:34px;font-size:58px;line-height:1.12;font-weight:600;letter-spacing:-1.4px;color:#e7e7e7;">
                                Seirra Melanie
                                <!-- Verified Badge: Blue Starburst with Checkmark -->
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
                                    style="display:inline-block; vertical-align:middle;">
                                    <path
                                        d="M12 1L15 3.2L19 3L20 7L23 9.5L21.5 12L23 14.5L20 17L19 21L15 20.8L12 23L9 20.8L5 21L4 17L1 14.5L2.5 12L1 9.5L4 7L5 3L9 3.2Z"
                                        fill="#008CFF" />
                                    <path d="M8 12L10.5 14.5L16 9" fill="none" stroke="#FFFFFF" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </div>
                            <div style="padding-top:18px;font-size:30px;line-height:1.3;color:#a4a4a6;">Today at 3:43 AM
                            </div>
                            <div style="padding-top:18px;font-size:30px;line-height:1.55;color:#a4a4a6;">For you have a
                                pending payment with which is already 98% done</div>
                            <div
                                style="padding-top:36px;font-size:76px;line-height:1.1;font-weight:700;letter-spacing:-2px;color:#e7e7e7;">
                                <span style="text-decoration-thickness:4px;">+ $7,000.00</span>
                            </div>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:72px 56px 0 56px;">
                            <div style="height:1px;background:#393a3b;font-size:1px;line-height:1px;">&nbsp;</div>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:66px 56px 0 56px;">
                            <div style="font-size:38px;line-height:1.2;font-weight:700;color:#e7e7e7;">Transaction
                                details</div>
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
                                style="margin-top:48px;">
                                <tr>
                                    <td valign="top" width="68"
                                        style="width:68px;padding-top:0;font-size:35px;line-height:1;color:#8b8c8d;">
                                        <!-- Pending Icon -->
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                            viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round"
                                            style="vertical-align: middle;">
                                            <circle cx="12" cy="12" r="10" />
                                            <polyline points="12 6 12 12 16 14" />
                                        </svg>
                                    </td>
                                    <td valign="top">
                                        <div style="font-size:32px;line-height:1.25;font-weight:700;color:#e7e7e7;">
                                            pending
                                        </div>
                                        <div style="padding-top:8px;font-size:15px;line-height:1.55;color:#a4a4a6;">
                                            Payment hasn't been completed because it exceeded your monthly limit
                                        </div>
                                    </td>
                                </tr>

                                <tr>
                                    <td colspan="2" style="height:40px;font-size:1px;line-height:1px;"></td>
                                </tr>
                                <tr>
                                    <td valign="top" width="68"
                                        style="width:68px;font-size:36px;line-height:1;color:#8b8c8d;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"
                                            viewBox="0 0 24 24" style="display:inline-block; vertical-align:middle;">
                                            <circle cx="12" cy="8" r="4" fill="#A4A4A6" />
                                            <path d="M4 21C4 16.6 7.6 13 12 13C16.4 13 20 16.6 20 21Z" fill="#A4A4A6" />
                                        </svg>
                                    </td>
                                    <td valign="top">
                                        <div style="font-size:32px;line-height:1.25;font-weight:700;color:#e7e7e7;">
                                            Payment between
                                        </div>
                                        <div style="padding-top:8px;font-size:20px;line-height:1.35;color:#a4a4a6;">
                                            To: Tyler Smith
                                        </div>
                                        <div style="padding-top:8px;font-size:20px;line-height:1.35;color:#a4a4a6;">
                                            From: Seirra Melanie
                                        </div>
                                    </td>
                                </tr>

                                <tr>
                                    <td colspan="2" style="height:40px;font-size:1px;line-height:1px;"></td>
                                </tr>

                                <tr>
                                    <td valign="top" width="68"
                                        style="width:68px;font-size:36px;line-height:1;color:#8b8c8d;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23"
                                            viewBox="0 0 24 24" fill="#A4A4A6"
                                            style="vertical-align: middle; transform: skewX(-10deg);">
                                            <path
                                                d="M12 1a1 1 0 0 1 1 1v1.1c3.2.4 5.5 2.3 5.5 5.2h-3.2c0-1.5-1.2-2.6-3.3-2.6-1.9 0-3.1.9-3.1 2.2 0 1.4 1.3 1.9 3.7 2.4 3.4.7 6.1 1.7 6.1 5.1 0 2.8-2.2 4.7-5.7 5.1V22a1 1 0 0 1-2 0v-1.4c-3.6-.4-6-2.4-6-5.6h3.3c0 1.8 1.4 2.8 3.6 2.8 2 0 3.4-.8 3.4-2.2 0-1.5-1.5-2-4-2.6-3.2-.7-5.8-1.8-5.8-5 0-2.6 2.2-4.5 5.5-4.9V2a1 1 0 0 1 1-1z" />
                                        </svg>

                                    </td>
                                    <td valign="top">
                                        <div style="font-size:32px;line-height:1.25;font-weight:700;color:#e7e7e7;">
                                            Depositing to</div>
                                        <div style="padding-top:8px;font-size:20px;line-height:1.35;color:#a4a4a6;">
                                            Cash balance
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="2" style="height:40px;font-size:1px;line-height:1px;"></td>
                                </tr>


                                <tr>
                                    <td valign="top" width="68"
                                        style="width:68px;font-size:36px;line-height:1;color:#8b8c8d;">
                                        <!-- Fee Icon -->
                                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"
                                            viewBox="0 0 24 24" style="display:inline-block; vertical-align:middle;">
                                            <path d="M6 2H18V22L15 20L12 22L9 20L6 22Z" fill="#A4A4A6" />
                                            <path d="M9 7H15M9 11H15M9 15H13" fill="none" stroke="#2C2D2E"
                                                stroke-width="1.8" stroke-linecap="round" />
                                        </svg>
                                    </td>
                                    <td valign="top">
                                        <div style="font-size:32px;line-height:1.25;font-weight:700;color:#e7e7e7;">
                                            Fees
                                        </div>
                                        <div
                                            style=" display:flex; align-items:center; justify-content:flex-space-between ; width:100%;">
                                            <div style="padding-top:8px;font-size:20px;line-height:1.35;color:#a4a4a6;">
                                                $75.00
                                            </div>
                                            <span style="margin-left:75%; margin-bottom: 35px;">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                                    viewBox="0 0 24 24"
                                                    style="display:inline-block; vertical-align:middle;">
                                                    <path d="M12 2L23 21H1Z" fill="#F59E0B" />
                                                    <path d="M12 8V14" fill="none" stroke="#2C2D2E" stroke-width="2.2"
                                                        stroke-linecap="round" />
                                                    <circle cx="12" cy="17.5" r="1.2" fill="#2C2D2E" />
                                                </svg>
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="2" style="height:40px;font-size:1px;line-height:1px;"></td>
                                </tr>

                                <tr>
                                    <td valign="top" width="68"
                                        style="width:68px;font-size:36px;line-height:1;color:#8b8c8d;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25"
                                            viewBox="0 0 24 24" fill="none" stroke="#A4A4A6" stroke-width="1.8"
                                            stroke-linecap="round" stroke-linejoin="round"
                                            style="vertical-align: middle;">

                                            <rect x="5" y="3" width="14" height="18" rx="2" />

                                            <path d="M9 7h6" />
                                            <path d="M9 11h6" />
                                            <path d="M9 15h2" />

                                            <circle cx="15.5" cy="15.5" r="2.5" />
                                            <path d="m14.5 15.5.7.7 1.3-1.4" />

                                        </svg>

                                    </td>
                                    <td valign="top">
                                        <div style="font-size:32px;line-height:1.25;font-weight:700;color:#e7e7e7;">
                                            Transaction number</div>
                                        <div style="padding-top:8px;font-size:20px;line-height:1.35;color:#a4a4a6;">
                                            #D-2QGDR9VJO</div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:76px 56px 0 56px;">
                            <div style="height:1px;background:#393a3b;font-size:1px;line-height:1px;">&nbsp;</div>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:50px 50px 0 50px;">
                            <button href="https://cash.app/launch/activity/"
                                style="width: 100%; background-color:#00c244;border:none;color:white;padding:15px 32px;text-align:center;  text-decoration:none;display:inline-block;font-size:16px;margin:4px 2px;cursor:pointer;border-radius:12px;">
                                Accept
                            </button>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:52px 56px 0 56px;">
                            <div style="height:1px;background:#393a3b;font-size:1px;line-height:1px;">&nbsp;</div>
                        </td>
                    </tr>


                    <tr>
                        <td style="padding:50px 56px 0 56px;font-size:29px;line-height:1.5;color:#e7e7e7;">
                            Privacy Policy <span style="color:#8b8c8d;">|</span> Terms of Service
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:50px 50px 75px 50px;font-size:29px;line-height:1.55;color:#a4a4a6;">
                            By using our services, you agree to our Terms and Conditions and acknowledge that
                            transaction notifications, account activity updates, and security alerts may be sent to your
                            registered email address. Please ensure your contact information remains up to date so you
                            can receive important notifications about your account and transactions.

                        </td>
                    </tr>


                    <tr>
                        <td style="padding:34px 56px 45px 56px;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td valign="middle"
                                        style=" width:52px;height:52px;background:#00d54b;border-radius:14px;text-align:center;vertical-align:middle;">
                                        <span
                                            style=" font-family:Arial,Helvetica,sans-serif;font-size:38px;line-height:52px;font-weight:bold;color:#222;display:block;">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30"
                                                viewBox="0 0 24 24" fill="#fff"
                                                style="vertical-align: middle; transform: skewX(-10deg);">
                                                <path
                                                    d="M12 1a1 1 0 0 1 1 1v1.1c3.2.4 5.5 2.3 5.5 5.2h-3.2c0-1.5-1.2-2.6-3.3-2.6-1.9 0-3.1.9-3.1 2.2 0 1.4 1.3 1.9 3.7 2.4 3.4.7 6.1 1.7 6.1 5.1 0 2.8-2.2 4.7-5.7 5.1V22a1 1 0 0 1-2 0v-1.4c-3.6-.4-6-2.4-6-5.6h3.3c0 1.8 1.4 2.8 3.6 2.8 2 0 3.4-.8 3.4-2.2 0-1.5-1.5-2-4-2.6-3.2-.7-5.8-1.8-5.8-5 0-2.6 2.2-4.5 5.5-4.9V2a1 1 0 0 1 1-1z" />
                                            </svg>

                                        </span>
                                    </td>
                                    <td
                                        style="padding-left:14px;font-size:36px;line-height:42px;font-weight:700;color:#00d54b;white-space:nowrap;">
                                        Cash App</td>
                                </tr>

                            </table>
                        </td>

                    </tr>

                    <tr>
                        <td style="padding:0 56px 55px 56px; display: flex; gap:30px;">
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                    fill="#16A34A" style="vertical-align: middle;">
                                    <path
                                        d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.636 7.584H.474l8.6-9.83L0 1.153h7.594l5.243 6.932 6.064-6.932zm-1.291 19.49h2.039L6.486 3.24H4.298L17.61 20.643z" />
                                </svg>

                            </div>
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                    fill="none" stroke="#16A34A" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" style="vertical-align: middle;">
                                    <rect x="3" y="3" width="18" height="18" rx="5" />
                                    <circle cx="12" cy="12" r="4" />
                                    <circle cx="17.5" cy="6.5" r="1" fill="#16A34A" stroke="none" />
                                </svg>
                            </div>
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                    fill="#16A34A" style="vertical-align: middle;">
                                    <path
                                        d="M24 12a12 12 0 1 0-13.875 11.855v-8.39H7.078V12h3.047V9.356c0-3.007 1.792-4.668 4.533-4.668 1.312 0 2.686.234 2.686.234v2.953h-1.513c-1.49 0-1.956.925-1.956 1.874V12h3.328l-.532 3.465h-2.796v8.39A12.002 12.002 0 0 0 24 12z" />
                                </svg>

                            </div>
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                    fill="#16A34A" style="vertical-align: middle;">
                                    <path
                                        d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.125V2h-3.553v13.672a2.896 2.896 0 0 1-2.892 2.764 2.896 2.896 0 0 1-2.896-2.896 2.896 2.896 0 0 1 2.896-2.896c.298 0 .59.046.866.135V9.154a6.43 6.43 0 0 0-.866-.058A6.449 6.449 0 0 0 2.925 15.54a6.449 6.449 0 0 0 6.449 6.449 6.449 6.449 0 0 0 6.449-6.449V8.555a8.27 8.27 0 0 0 4.84 1.555V6.557a4.83 4.83 0 0 1-1.074.129z" />
                                </svg>

                            </div>
                        </td>

                    </tr>
                </table>
            </td>
        </tr>
    </table>
    <style>
        @media screen and (max-width:600px) {

            td[style*="padding-left:56px"],
            td[style*="padding-right:56px"] {
                padding-left: 24px !important;
                padding-right: 24px !important;
            }

            div[style*="font-size:58px"] {
                font-size: 38px !important;
            }

            div[style*="font-size:76px"] {
                font-size: 48px !important;
            }

            div[style*="font-size:38px"] {
                font-size: 28px !important;
            }

            div[style*="font-size:32px"] {
                font-size: 23px !important;
            }

            div[style*="font-size:30px"],
            td[style*="font-size:30px"],
            td[style*="font-size:29px"] {
                font-size: 19px !important;
            }

            td[style*="padding-top:200px"] {
                padding-top: 100px !important;
            }

            td[style*="padding-top:240px"] {
                padding-top: 120px !important;
            }

            .desktop-break {
                display: none !important;
            }
        }
    </style>
</body>
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