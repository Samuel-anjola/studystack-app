export const kindeConfig = {
  domain: "https://studystack.kinde.com",
  clientId: "081d6e68bfae4f5eb47d57388141fe82",
  clientSecret: "KFYk72fETIdCD9uNzZ5ROlEywRChhfQCrEG7osJpsIvVaA1UTvK",
  issuerUrl: "https://studystack.kinde.com",
  siteUrl: process.env.KINDE_SITE_URL || "http://localhost:3000",
  postLogoutRedirectUrl: process.env.KINDE_POST_LOGOUT_REDIRECT_URL || "http://localhost:3000",
  postLoginRedirectUrl: process.env.KINDE_POST_LOGIN_REDIRECT_URL || "http://localhost:3000/auth/callback",
}

// Validation function to ensure all required config is present
export const validateKindeConfig = () => {
  const requiredVars = ["KINDE_CLIENT_ID", "KINDE_CLIENT_SECRET", "KINDE_ISSUER_URL"]

  const missing = requiredVars.filter((varName) => !process.env[varName])

  if (missing.length > 0) {
    throw new Error(`Missing required Kinde environment variables: ${missing.join(", ")}`)
  }

  return true
}
