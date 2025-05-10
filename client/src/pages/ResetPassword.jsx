const ResetPassword = () => {
  return (
    <div>
      <h1>Reset Password</h1>
      <form>
        <input type="password" placeholder="New Password" />
        <input type="password" placeholder="Confirm New Password" />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
