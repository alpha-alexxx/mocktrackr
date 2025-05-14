import { siteConfig } from '@/lib/site/site-config';

import type { User } from 'better-auth';

export const Get2FAEmailTemplate = (user: User, otpCode: string) => {
    const year = new Date().getFullYear();

    const template = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>2FA OTP Code</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f4f4; font-family: 'Segoe UI', sans-serif; color:#333;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4; padding: 40px 0;">
    <tr>
      <td align="center">
        <table cellpadding="0" cellspacing="0" width="600" style="background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
          <!-- Accent Line -->
          <tr><td style="height: 5px; background-color: #007bff;"></td></tr>

          <!-- Logo Header -->
          <tr>
            <td align="center" style="padding: 30px;">
              <img src="${siteConfig.url}/${siteConfig.logo}" alt="${siteConfig.name}" width="120" style="display: block;" />
            </td>
          </tr>

          <!-- Email Body -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <h1 style="font-size: 24px; margin: 0 0 20px; color: #222;">Two-Factor Authentication</h1>
              <p style="font-size: 16px; line-height: 1.5;">Hi ${user.name || 'there'}, 👋</p>
              <p style="font-size: 16px; line-height: 1.5;">
                Here’s your one-time password (OTP) to complete your secure login to <strong>${siteConfig.name}</strong>:
              </p>

              <!-- OTP Code Box -->
              <div style="margin: 30px 0; text-align: center;">
                <div style="
                  display: inline-block;
                  padding: 16px 32px;
                  background-color: #f0f0f0;
                  border-radius: 8px;
                  font-size: 28px;
                  font-weight: bold;
                  letter-spacing: 8px;
                  color: #000;
                  font-family: monospace;
                  ">
                  ${otpCode}
                </div>
              </div>

              <p style="font-size: 15px; line-height: 1.6; color: #444;">
                ⚠️ This OTP is valid for <strong>5 minutes</strong> and can be used only once.
              </p>
              <p style="font-size: 15px; line-height: 1.6;">
                Didn’t request this code? It may be someone trying to access your account. Please reset your password or contact our support team immediately.
              </p>
              <p style="font-size: 15px; margin-top: 30px;">
                Your mock test performance deserves top security.<br/>
                – The ${siteConfig.name} Team
              </p>

              <hr style="margin: 30px 0; border: none; border-top: 1px solid #e0e0e0;" />

              <p style="font-size: 14px; color: #666;">Need help or saw suspicious activity? Reach us at
                <a href="mailto:${siteConfig.supportEmail}" style="color: #007bff;">${siteConfig.supportEmail}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f0f0f0; padding: 20px; text-align: center; font-size: 13px; color: #999;">
              <div style="margin-bottom: 10px;">
                <a href="${siteConfig.footer.links.socials[0]}" style="margin: 0 8px;">
                  <img src="https://cdn-icons-png.flaticon.com/512/733/733553.png" alt="GitHub" width="20" />
                </a>
                <a href="${siteConfig.footer.links.socials[1]}" style="margin: 0 8px;">
                  <img src="https://cdn-icons-png.flaticon.com/512/733/733561.png" alt="LinkedIn" width="20" />
                </a>
              </div>
              <div style="margin-bottom: 6px;">
                <a href="${siteConfig.url}/terms" style="margin: 0 10px; color: #666; text-decoration: none;">Terms</a> |
                <a href="${siteConfig.url}/privacy" style="margin: 0 10px; color: #666; text-decoration: none;">Privacy</a> |
                <a href="mailto:${siteConfig.supportEmail}" style="margin: 0 10px; color: #666; text-decoration: none;">Support</a>
              </div>
              <div style="margin-top: 6px;">&copy; ${year} ${siteConfig.name}. All rights reserved.</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

    return template;
};
