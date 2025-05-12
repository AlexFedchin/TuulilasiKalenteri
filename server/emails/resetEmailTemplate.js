const getResetEmailTemplate = (name, username, resetLink, clientUrl) => `
  <div style="font-family: Montserrat, sans-serif; color: #191919; font-size: 16px; line-height: 1.5; padding: 20px; max-width: 600px; margin: auto;">
    <img
      src="${clientUrl}/logo.png"
      alt="TuulilasiKalenteri"
      style="max-width: 250px; height: auto;"
    />
    <h2 style="color: #2aa4eb;">Password Reset Request</h2>
    <p style="color: #191919;">Hi <strong>${name}</strong>,</p>
    <p style="color: #191919;">We received a request to reset password for your account on TuulilasiKalenteri with username <strong>${username}</strong>. Click the button below to reset it:</p>
    <a href="${resetLink}" style="display: inline-block; background-color: #2aa4eb; color: #fcfcfc; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: 550;">Reset Password</a>
    <p style="margin-top: 20px; color: #191919;>If you didn’t request this, just ignore this email. This link will expire in 30 minutes.</p>
    <p style="color: #191919; font-style: italic;">– TuulilasiKalenteri Team</p>
  </div>
`;
module.exports = getResetEmailTemplate;
