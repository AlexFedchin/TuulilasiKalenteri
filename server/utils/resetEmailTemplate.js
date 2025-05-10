const getResetEmailTemplate = (username, resetLink, clientUrl) => `
  <div style="font-family: Montserrat, sans-serif; color: #191919; font-size: 16px; line-height: 1.5; padding: 20px; max-width: 600px; margin: auto;">
    <img
      src="${clientUrl}/logo.webp"
      alt="TuulilasiKalenteri"
      style="width: 200px; height: auto; margin-bottom: 20px;"
    />
    <h2 style="color: #2aa4eb;">Password Reset Request</h2>
    <p style="color: #191919;">Hi <strong>${username}</strong>,</p>
    <p style="color: #191919;">We received a request to reset your password. Click the button below to reset it:</p>
    <a href="${resetLink}" style="display: inline-block; background-color: #2aa4eb; color: #fcfcfc; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: 550;">Reset Password</a>
    <p style="margin-top: 20px; color: "#191919";>If you didn’t request this, just ignore this email. This link will expire in 30 minutes.</p>
    <p style="color: #191919; font-style: italic;">– TuulilasiKalenteri Team</p>
  </div>
`;
module.exports = getResetEmailTemplate;
