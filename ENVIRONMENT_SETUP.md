# Environment Setup for AI Insights System

This guide explains how to set up environment variables for the AI insights system.

## 🔑 Required Environment Variables

### Gemini API Key

The system uses Google's Gemini AI for generating insights. You need to set up the `GEMINI_API_KEY` environment variable.

#### Option 1: Environment Variable (Recommended)

1. **Get your API key** from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **Set the environment variable**:

   **For Windows (PowerShell):**
   ```powershell
   $env:GEMINI_API_KEY="your_api_key_here"
   ```

   **For Windows (Command Prompt):**
   ```cmd
   set GEMINI_API_KEY=your_api_key_here
   ```

   **For macOS/Linux:**
   ```bash
   export GEMINI_API_KEY="your_api_key_here"
   ```

3. **For development**, you can also create a `.env` file in your project root:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

#### Option 2: Update Default Key (Less Secure)

If you prefer not to use environment variables, you can update the default key in `src/utils/aiAnalyzer.js`:

```javascript
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'your_api_key_here';
```

## 🚀 Getting Started

1. **Get your Gemini API key** from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **Set the environment variable** using one of the methods above
3. **Restart your development server** if it's running
4. **Test the system** by visiting a client dashboard

## 🔧 Verification

To verify your setup is working:

1. **Check the browser console** for any API key errors
2. **Visit a client dashboard** and check if AI insights are generated
3. **Look for the "From Cache" indicator** after the first generation

## 🛠️ Troubleshooting

### Common Issues

1. **"API key not configured" error**
   - Make sure the environment variable is set correctly
   - Restart your development server after setting the variable
   - Check that the variable name is exactly `GEMINI_API_KEY`

2. **"Module not found" error**
   - This should be fixed now with the updated import structure
   - If you still see this error, restart your development server

3. **AI insights not generating**
   - Check if the Gemini API key is valid
   - Verify your internet connection
   - Check the browser console for API errors

### Debug Steps

1. **Check environment variable**:
   ```javascript
   console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY);
   ```

2. **Test API key manually**:
   ```bash
   curl -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=YOUR_API_KEY" \
   -H "Content-Type: application/json" \
   -d '{"contents":[{"parts":[{"text":"Hello"}]}]}'
   ```

## 🔒 Security Notes

- **Never commit API keys** to version control
- **Use environment variables** in production
- **Rotate API keys** regularly
- **Monitor API usage** to avoid unexpected costs

## 📝 Next Steps

After setting up the environment variables:

1. **Run the SQL script** from `supabase/complete_ai_insights_setup.sql`
2. **Test the AI insights system** with a client dashboard
3. **Check the cache functionality** by refreshing the page
4. **Verify automatic regeneration** by editing client data

---

**Note**: The system now uses environment variables instead of importing from outside the `src/` directory, which resolves the import error you encountered. 