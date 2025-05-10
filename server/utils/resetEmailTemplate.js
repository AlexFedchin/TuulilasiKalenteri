const getResetEmailTemplate = (username, resetLink) => `
  <div style="font-family: Arial, sans-serif; color: #333;">
    <h2 style="color: #4CAF50;">Password Reset Request</h2>
    <p>Hi <strong>${username}</strong>,</p>
    <p>We received a request to reset your password. Click the button below to reset it:</p>
    <a href="${resetLink}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
    <p style="margin-top: 20px;">If you didn’t request this, just ignore this email. This link will expire in 1 hour.</p>
    <p>– Your App Team</p>
  </div>
`;
module.exports = getResetEmailTemplate;
