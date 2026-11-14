const credentialErrors = new Set([
  'auth/invalid-credential',
  'auth/invalid-login-credentials',
  'auth/user-not-found',
  'auth/wrong-password',
]);

export function getAuthErrorMessage(error, flow) {
  const code = error?.code || error?.cause?.code;

  if (flow === 'reset') {
    if (code === 'auth/network-request-failed') {
      return 'Unable to send instructions right now. Please check your connection.';
    }
    return 'If an account exists for that email, password reset instructions will be sent.';
  }

  if (flow === 'register') {
    return 'Unable to create your account. Please check your details and try again.';
  }

  if (credentialErrors.has(code)) {
    return 'Email or password is incorrect.';
  }

  return 'Unable to sign in right now. Please try again.';
}
