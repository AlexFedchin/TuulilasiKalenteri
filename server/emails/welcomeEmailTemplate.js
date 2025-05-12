const getWelcomeEmailTemplate = (
  firstName,
  lastName,
  username,
  email,
  role,
  location,
  admin,
  clientUrl
) => `
  <div style="font-family: Montserrat, sans-serif; color: #191919; font-size: 16px; line-height: 1.5; padding: 20px; max-width: 600px; margin: auto;">
    <img
      src="${clientUrl}/logo.png"
      alt="TuulilasiKalenteri"
      style="max-width: 250px; height: auto;"
    />
    <h2 style="color: #2aa4eb;">Welcome to TuulilasiKalenteri!</h2>
    <p style="color: #191919;">Hi <strong>${firstName} ${lastName}</strong>,</p>
    <p style="color: #191919;">
      You've been added to TuulilasiKalenteri platform by an administrator. Below are the details of your account:
    </p>
    <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 15px;">
      <tbody>
        <tr>
          <td style="padding: 8px; font-weight: 600;">Username:</td>
          <td style="padding: 8px;">${username}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: 600;">Email:</td>
          <td style="padding: 8px;">${email}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: 600;">First Name:</td>
          <td style="padding: 8px;">${firstName}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: 600;">Last Name:</td>
          <td style="padding: 8px;">${lastName}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: 600;">Role:</td>
          <td style="padding: 8px;">${
            role === "admin" ? "Administrator" : "Regular User"
          }</td>
        </tr>
        ${
          role === "regular"
            ? `
        <tr>
          <td style="padding: 8px; font-weight: 600;">Location:</td>
          <td style="padding: 8px;">${location}</td>
        </tr>
        `
            : ""
        }
      </tbody>
    </table>
    <p style="color: #191919;">You can now log in and start using the platform. For safety purposes your password is not sent in this email. Please, ask for the password for your account from ${admin}.</p>
    <a href="${clientUrl}" style="display: inline-block; background-color: #2aa4eb; color: #fcfcfc; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: 550;">Go to TuulilasiKalenteri</a>
    <p style="margin-top: 20px; color: #191919; font-style: italic;">– TuulilasiKalenteri Team</p>
  </div>
`;
module.exports = getWelcomeEmailTemplate;
