# Kinde Authentication Setup Guide

## Your Kinde Domain
Your Kinde domain is: `https://studystack.kinde.com`

## Required Environment Variables

Create a `.env.local` file in your project root with the following variables:

\`\`\`env
# Kinde Configuration
KINDE_CLIENT_ID=your_client_id_here
KINDE_CLIENT_SECRET=your_client_secret_here
KINDE_ISSUER_URL=https://studystack.kinde.com
KINDE_SITE_URL=http://localhost:3000
KINDE_POST_LOGOUT_REDIRECT_URL=http://localhost:3000
KINDE_POST_LOGIN_REDIRECT_URL=http://localhost:3000/auth/callback

# For production, update these URLs to your production domain
# KINDE_SITE_URL=https://your-production-domain.com
# KINDE_POST_LOGOUT_REDIRECT_URL=https://your-production-domain.com
# KINDE_POST_LOGIN_REDIRECT_URL=https://your-production-domain.com/auth/callback
\`\`\`

## Kinde Dashboard Configuration

1. **Login to your Kinde Dashboard**: https://app.kinde.com
2. **Navigate to your StudyStack application**
3. **Configure the following settings**:

### Allowed Callback URLs
Add these URLs to your Kinde app settings:
- `http://localhost:3000/auth/callback` (for development)
- `https://your-production-domain.com/auth/callback` (for production)

### Allowed Logout URLs
Add these URLs:
- `http://localhost:3000` (for development)
- `https://your-production-domain.com` (for production)

### Application Type
- Set to: **Regular Web Application**

### Authentication Methods
Enable the following:
- ✅ Email + Password
- ✅ Social Logins (optional: Google, GitHub, etc.)

## Getting Your Credentials

1. In your Kinde Dashboard, go to **Settings** → **Applications**
2. Select your StudyStack application
3. Copy the **Client ID** and **Client Secret**
4. Update your `.env.local` file with these values

## Testing the Setup

1. Start your development server: `npm run dev`
2. Navigate to: `http://localhost:3000`
3. Try logging in as either a student or admin
4. You should be redirected to: `https://studystack.kinde.com` for authentication

## Troubleshooting

### Common Issues:
1. **"Invalid redirect URI"**: Make sure your callback URLs are correctly configured in Kinde
2. **"Client not found"**: Verify your Client ID is correct
3. **"Unauthorized"**: Check your Client Secret

### Debug Mode:
Add this to your `.env.local` for debugging:
\`\`\`env
KINDE_DEBUG=true
\`\`\`

## Production Deployment

When deploying to production:
1. Update all URLs from `localhost:3000` to your production domain
2. Add production URLs to your Kinde app configuration
3. Set environment variables in your hosting platform
4. Test the authentication flow thoroughly

## Security Notes

- Never commit your `.env.local` file to version control
- Keep your Client Secret secure
- Use HTTPS in production
- Regularly rotate your credentials
