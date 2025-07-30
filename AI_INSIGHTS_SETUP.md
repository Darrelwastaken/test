# AI Insights Storage System Setup

This document explains how to set up and use the new AI insights storage system that saves generated insights in the database and only regenerates them when needed.

## 🚀 Quick Setup

### 1. Run the SQL Script

Copy and paste the contents of `supabase/complete_ai_insights_setup.sql` into your Supabase SQL Editor and run it. This will:

- Create the `ai_insights` table
- Set up indexes for performance
- Create trigger functions for automatic timestamp updates
- Add utility functions for managing insights

### 2. Verify Installation

After running the SQL script, you should see:
- A new `ai_insights` table in your database
- Indexes created for better performance
- Trigger functions for automatic updates

## 🔧 How It Works

### Storage System
- **AI insights are now stored in the database** instead of being generated every time
- **Data versioning** tracks when client data changes to determine if insights need regeneration
- **Automatic regeneration** only happens when:
  - No insights exist for a client
  - Client data has been modified (edit client info)
  - New client is created
  - Manual refresh is triggered

### Key Features
- ✅ **Cached insights** - Faster loading times
- ✅ **Smart regeneration** - Only when data changes
- ✅ **Manual refresh** - Force regeneration when needed
- ✅ **Cache indicator** - Shows when insights are from cache
- ✅ **Data integrity** - Automatic cleanup and versioning

## 📊 Database Schema

```sql
ai_insights table:
├── id (SERIAL PRIMARY KEY)
├── client_nric (TEXT, REFERENCES clients(nric))
├── insights (JSONB) - Array of insight objects
├── summary (JSONB) - Summary statistics
├── generated_at (TIMESTAMP) - When insights were generated
├── last_updated (TIMESTAMP) - When insights were last updated
└── data_version (TEXT) - Hash of client data for versioning
```

## 🎯 Usage

### For Users
1. **First visit**: Insights will be generated and stored
2. **Subsequent visits**: Insights load instantly from cache
3. **After editing client data**: Insights automatically regenerate
4. **Manual refresh**: Click the "Refresh" button to force regeneration

### For Developers
The system provides these utility functions:

```javascript
// Generate and save insights (with caching)
const result = await generateAndSaveInsights(clientData);

// Force regenerate insights
const result = await forceRegenerateInsights(clientData);

// Get existing insights
const insights = await getAIInsights(clientNric);

// Delete insights (forces regeneration)
await deleteAIInsights(clientNric);
```

## 🔄 Automatic Regeneration Triggers

Insights are automatically regenerated when:

1. **New client created** - `ClientSelection.js` deletes any existing insights
2. **Client data edited** - `EditClientInfoNew.js` deletes insights after save
3. **Data changes detected** - System compares data hash with stored version
4. **Manual refresh** - User clicks refresh button in AI Insights component

## 🎨 UI Changes

### AI Insights Component
- **Removed recommendations section** (as requested)
- **Added cache indicator** - Shows "From Cache" when using stored insights
- **Added refresh button** - Manual regeneration option
- **Improved loading states** - Better user feedback

### Dashboard Integration
- **Faster loading** - Cached insights load instantly
- **Automatic refresh** - When returning from edit page
- **Better UX** - Clear indication of data source

## 🛠️ Maintenance

### Database Cleanup
The system includes a cleanup function for old insights:

```sql
-- Clean up insights older than 30 days
SELECT cleanup_old_insights();
```

### Monitoring
Check insight usage with these queries:

```sql
-- Count total insights
SELECT COUNT(*) FROM ai_insights;

-- Check recent insights
SELECT client_nric, generated_at, last_updated 
FROM ai_insights 
ORDER BY last_updated DESC;

-- Find clients without insights
SELECT c.nric, c.name 
FROM clients c 
LEFT JOIN ai_insights ai ON c.nric = ai.client_nric 
WHERE ai.client_nric IS NULL;
```

## 🐛 Troubleshooting

### Common Issues

1. **Insights not generating**
   - Check if AI API is running (`server.js`)
   - Verify client data exists in database
   - Check browser console for errors

2. **Cache not working**
   - Verify `ai_insights` table exists
   - Check database permissions
   - Ensure Supabase connection is working

3. **Insights not updating after edit**
   - Verify `deleteAIInsights` is called in edit functions
   - Check if client NRIC matches between edit and dashboard

### Debug Queries

```sql
-- Check if insights exist for a client
SELECT has_insights('CLIENT_NRIC_HERE');

-- Get insights for a client
SELECT * FROM get_client_insights('CLIENT_NRIC_HERE');

-- Check table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'ai_insights';
```

## 📈 Performance Benefits

- **Faster dashboard loading** - Cached insights load instantly
- **Reduced API calls** - Only generate when needed
- **Better user experience** - No waiting for AI generation
- **Cost optimization** - Fewer AI API calls

## 🔮 Future Enhancements

Potential improvements:
- **Batch insights generation** - Generate for multiple clients
- **Insights analytics** - Track which insights are most valuable
- **Custom insight templates** - Bank-specific insight formats
- **Insights scheduling** - Regular background regeneration
- **Insights sharing** - Export insights to reports

---

**Note**: This system maintains backward compatibility. Existing functionality continues to work while adding the new caching layer. 