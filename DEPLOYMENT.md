# Deployment Guide

## Prerequisites

1. **Vercel Account**: Sign up at https://vercel.com
2. **Groq API Key**: Get your free key at https://console.groq.com
3. **GitHub Repository**: Push your code to GitHub (recommended)

## Environment Variables

In the Vercel dashboard, add these environment variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `GROQ_API_KEY` | Your Groq API key | Required for AI model access |
| `GROQ_MODEL` | `llama-3.3-70b-versatile` | AI model to use |
| `CLIENT_ORIGIN` | `https://your-project.vercel.app` | Your Vercel domain |

## Deployment Methods

### Method 1: Vercel CLI (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   npm run deploy
   ```

### Method 2: Vercel Dashboard

1. Connect your GitHub repository to Vercel
2. Import the project
3. Configure environment variables
4. Deploy

### Method 3: Git Integration

1. Push to GitHub
2. Connect repository to Vercel
3. Automatic deployment on push

## Configuration Files

### `vercel.json`
- Configures build settings
- Sets up API routing
- Defines serverless function settings
- Handles CORS headers

### `package.json`
- Build command: `npm run build --workspace=apps/web`
- Output directory: `apps/web/dist`
- Node version: `>=18.0.0`

## Post-Deployment Checklist

- [ ] Verify frontend loads at your domain
- [ ] Test API health: `https://your-domain.vercel.app/api/health`
- [ ] Test prediction endpoint with a sample request
- [ ] Check that environment variables are correctly set
- [ ] Monitor Vercel logs for any errors

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure `CLIENT_ORIGIN` is set correctly
2. **API Errors**: Check Groq API key is valid and model exists
3. **Build Failures**: Verify Node version and dependencies
4. **Function Timeouts**: Increase `maxDuration` in `vercel.json` if needed

### Environment Variable Debugging

Add this endpoint to check environment variables:
```javascript
// In apps/api/routes/debug.js
export const debugRouter = Router();
debugRouter.get("/env", (req, res) => {
  res.json({
    groq_model: process.env.GROQ_MODEL,
    client_origin: process.env.CLIENT_ORIGIN,
    is_vercel: process.env.VERCEL === "1"
  });
});
```

## Monitoring

- **Vercel Analytics**: Built-in performance monitoring
- **Vercel Logs**: Real-time error tracking
- **Groq Dashboard**: API usage and limits

## Scaling

The current configuration supports:
- **Free Tier**: Up to 100GB bandwidth/month
- **Function Duration**: 30 seconds (configurable)
- **Memory**: 1024MB (configurable)

For higher limits, upgrade to Vercel Pro.
