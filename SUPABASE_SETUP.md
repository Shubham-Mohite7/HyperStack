# Supabase Authentication Setup Guide

This guide will help you set up Supabase authentication for the HyperStack application.

## 🚀 Quick Setup

### 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" 
3. Sign in with Google or create an account
4. Click "New Project"
5. Choose your organization
6. Enter project details:
   - **Project Name**: `hyperstack` (or your preferred name)
   - **Database Password**: Generate a strong password and save it
   - **Region**: Choose closest to your users
7. Click "Create new project"

### 2. Configure Google OAuth

1. In your Supabase project dashboard, go to **Authentication** → **Providers**
2. Find **Google** in the list and click it
3. Toggle **Enable Sign in with Google** to ON
4. You'll need to configure Google OAuth:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select existing one
   - Go to **APIs & Services** → **Credentials**
   - Click **Create Credentials** → **OAuth client ID**
   - Select **Web application**
   - Add authorized redirect URI: `https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`
   - Copy the **Client ID** and **Client Secret**
5. Go back to Supabase and paste the Google credentials
6. Click **Save**

### 3. Get Supabase Configuration

1. In Supabase dashboard, go to **Project Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like `https://abcdefg.supabase.co`)
   - **anon public** API key
3. Create a `.env` file in `apps/web/`:
   ```bash
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 4. Install Dependencies

```bash
cd apps/web
npm install @supabase/supabase-js
```

### 5. Run the Application

```bash
cd apps/web
npm run dev
```

## 📋 Environment Variables

Add these to your `.env` file in `apps/web/`:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# API Configuration  
VITE_API_URL=/api
```

## 🔧 Database Setup (Optional)

For future features like saving user predictions, you can create tables:

```sql
-- Create table for user predictions
CREATE TABLE user_predictions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  project_description TEXT NOT NULL,
  prediction_result JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for user profiles
CREATE TABLE user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE user_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own predictions" ON user_predictions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own predictions" ON user_predictions  
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own predictions" ON user_predictions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own predictions" ON user_predictions
  FOR DELETE USING (auth.uid() = user_id);
```

## 🚀 Deployment

### Vercel Environment Variables

Add these to your Vercel project settings:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Test the Authentication

1. Run your app locally
2. Click "Sign in with Google"
3. Complete the Google OAuth flow
4. You should see your profile in the navbar

## 🔍 Troubleshooting

### Common Issues

1. **Redirect URI Error**: Make sure the Google OAuth redirect URI matches your Supabase project URL exactly
2. **CORS Issues**: Supabase handles this automatically, but ensure your frontend URL is added to allowed origins if needed
3. **Environment Variables**: Double-check that `.env` variables are correctly set and start with `VITE_`

### Debug Mode

Add this to your Supabase client for debugging:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  supabaseUrl, 
  supabaseAnonKey,
  {
    auth: {
      debug: true // Enable debug mode
    }
  }
)
```

## 🎯 Next Steps

Once authentication is working, you can:

1. Add user data persistence with Supabase Database
2. Implement user-specific features
3. Add user profiles and settings
4. Store prediction history
5. Add team collaboration features

## 📚 Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Google OAuth Setup](https://support.google.com/googlecloud/answer/6158849)
