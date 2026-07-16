module.exports = {
  //forgot password email template
  emailTemplate: (resetPasswordLink, logoImageLink, userName) =>
    `<!DOCTYPE html>
  <html>
  
  <head>
    <title>DFWERRANDS</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
    <style>
      * {
        padding: 0;
        margin: 0;
        font-family: 'Poppins', sans-serif;
        border-collapse: collapse;
      }
    </style>
  </head>
  
  <body>
    <div style="width: 100%;margin: auto;box-sizing: border-box;max-width: 520px;">
      <div
        style="text-align: center;padding: 30px 30px;box-sizing: border-box;margin: 50px 0px; border-radius: 15px;
               background: linear-gradient(to right, #ec4899, #3b82f6);">
        <table>
          <tbody>
            <tr>
              <td>
                <div
                  style="background: #ffffffcc; box-sizing: border-box; padding: 60px 30px; border-radius: 30px;
                         box-shadow: 0px 0px 9px #ddd; backdrop-filter: blur(6px);">
                  <table style="width: 100%;">
                    <tbody>
                      <tr>
                        <td style="text-align: center; padding: 0 0 20px;">
                          <img src="${logoImageLink}" alt="logo" style="width: 100%; max-width: 200px;">
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <table>
                    <tbody>
                      <tr>
                        <td style="padding: 0 0 20px;">
                          <h3 style="color: #111;">Hi, ${userName}</h3>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 30px; color: #333;">
                          No worries! Follow the steps to reset your password.
                          Never share your password with anyone. We’ll never ask for it!
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <a href="${resetPasswordLink}" style="
                            padding: 12px 30px;
                            display: inline-block;
                            background: linear-gradient(to right, #ec4899, #3b82f6);
                            color: #fff;
                            text-decoration: none;
                            font-weight: bold;
                            border-radius: 8px;
                          ">Reset Password</a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </body>
  
  </html>`,
  //otp email template
  otpEmailTemplate: (otp, logoImageLink, userName) => `
  <!DOCTYPE html>
  <html>
  
  <head>
    <title>DFWERRANDS</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap"
      rel="stylesheet">
    <style>
      * {
        padding: 0;
        margin: 0;
        font-family: 'Poppins', sans-serif;
        border-collapse: collapse;
      }
    </style>
  </head>
  
  <body>
    <div style="width: 100%; margin: auto; box-sizing: border-box; max-width: 520px;">
      <div style="
        text-align: center;
        padding: 30px;
        box-sizing: border-box;
        margin: 50px 0;
        border-radius: 15px;
        background: linear-gradient(to right, #ec4899, #3b82f6);">
        
        <table>
          <tbody>
            <tr>
              <td>
                <div style="
                  background: #ffffffcc;
                  box-sizing: border-box;
                  padding: 60px 30px;
                  border-radius: 30px;
                  box-shadow: 0px 0px 9px #ddd;
                  backdrop-filter: blur(6px);">
                  
                  <table style="width: 100%;">
                    <tbody>
                      <tr>
                        <td style="text-align: center; padding-bottom: 20px;">
                          <img src="${logoImageLink}" alt="Logo" style="width: 100%; max-width: 200px;">
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 20px;">
                          <h3 style="color: #111;">Hi, ${userName}</h3>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 20px; color: #333;">
                          <p>Thank you for signing up with DFWERRANDS!</p>
                          <p>Please use the OTP below to verify your email address.</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0 30px;">
                          <div style="
                            font-size: 28px;
                            font-weight: bold;
                            color: #3b82f6;
                            background: #fff;
                            padding: 12px 20px;
                            border-radius: 10px;
                            display: inline-block;
                            box-shadow: 0px 0px 5px #ccc;">
                            ${otp}
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 14px; color: #333;">
                          <p>Do not share this OTP with anyone.</p>
                          <p>If you did not sign up for this account, you can safely ignore this email.</p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
  
                </div>
              </td>
            </tr>
          </tbody>
        </table>
  
      </div>
    </div>
  </body>
  
  </html>`,

  adminEmailTemplate: (logoImageLink, text) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>DFWERRANDS – Notification</title>
</head>

<body style="margin:0; padding:0; background:#f5f6fa; font-family: Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px;">
    <tr>
      <td align="center">

        <!-- Main Container -->
        <table width="500" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:10px; padding:30px;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:20px;">
              <img src="${logoImageLink}" 
                   alt="DFWERRANDS Logo" 
                   style="width:120px; height:auto; display:block;">
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="font-size:15px; color:#333; line-height:1.6; text-align:left;">
              ${text}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:25px; font-size:12px; color:#777;">
              © ${new Date().getFullYear()} DFWerrands. All rights reserved.
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`,
};
