const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { OAuth2 } = google.auth;

const { EMAIL, MAILING_ID, MAILING_REFRESH, MAILING_SECRET } = process.env;
const oauth_link = "https://developers.google.com/oauthplayground";

// Create an OAuth2 client with the given credentials
const auth = new OAuth2(
  MAILING_ID, // Client ID
  MAILING_SECRET, // Client Secret
  oauth_link, // Redirect URL
  MAILING_REFRESH // Refresh Token
);

exports.sendVerificationEmail = async (email, name, url) => {
  try {
    // Check that email and url are defined
    if (!email || !url) {
      throw new Error("Email or URL is missing");
    }

    // Set the OAuth2 credentials
    auth.setCredentials({
      refresh_token: MAILING_REFRESH,
    });

    // Get the access token
    const { token } = await auth.getAccessToken();

    // Create a transporter using the OAuth2 client
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: EMAIL,
        clientId: MAILING_ID,
        clientSecret: MAILING_SECRET,
        refreshToken: MAILING_REFRESH,
        accessToken: token,
      },
    });

    // Define email options
    const mailOptions = {
      from: EMAIL,
      to: email,
      subject: "Facebook email verification",
      html: `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Activate Your Facebook Account</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
              }
              .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                background: #ffffff;
                padding: 20px;
                border: 1px solid #ddd;
              }
              .header {
                text-align: center;
                padding: 10px;
                background-color: #f4f4f4;
              }
              .header img {
                max-width: 100px;
              }
              .content {
                text-align: center;
                padding: 20px;
              }
              .content h1 {
                font-size: 24px;
                color: #333;
              }
              .footer {
                text-align: center;
                padding: 10px;
                background-color: #f4f4f4;
                font-size: 12px;
                color: #777;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <img src="http://res.cloudinary.com/dmhcnhtng/image/upload/v1645134414/logo_cs1si5.png" alt="Company Logo" />
              </div>
              <div class="content">
                <h1>Action Required: Activate Your Connect Account</h1>
                <p>Please click the link below to activate your account.</p>
                <a href="${url}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;">Activate Now</a>
              </div>
              <div class="footer">&copy; 2024 Your Company. All rights reserved.</div>
            </div>
          </body>
        </html>
      `,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);

    // Return success response
    return info;
  } catch (error) {
    // Handle errors
    console.error("Error sending email:", error);
    throw error;
  }
};
