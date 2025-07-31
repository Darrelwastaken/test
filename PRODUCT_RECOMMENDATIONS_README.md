# Dynamic Product Recommendations System

## Overview

The Product Recommendations system has been completely redesigned to provide personalized, data-driven product recommendations based on each client's unique financial profile. Instead of hardcoded recommendations, the system now analyzes client data from multiple sources to generate tailored suggestions.

## Key Features

### 🎯 **Personalized Analysis**
- Analyzes client's financial data from multiple database tables
- Calculates risk profile based on age, income, debt, and investment experience
- Determines investment profile type (New, Beginner, Intermediate, Advanced)
- Generates recommendations based on actual financial metrics

### 📊 **Smart Algorithms**
- **Risk Profile Calculation**: Scores clients on a 0-10 scale based on multiple factors
- **Investment Profile Analysis**: Categorizes clients by investment experience level
- **Product Suitability Scoring**: Matches products to client profiles using weighted algorithms
- **Estimated Value Calculation**: Provides realistic investment amounts based on client capacity

### 🎨 **Enhanced UI**
- **Client Profile Summary**: Shows risk profile, investment profile, and key metrics
- **Filtering & Sorting**: Filter by product type and priority level
- **Expandable Details**: View product features and requirements
- **Interactive Elements**: Hover effects and smooth transitions

## System Architecture

### Core Components

1. **`useProductRecommendations` Hook** (`src/hooks/useProductRecommendations.js`)
   - Fetches client data from Supabase
   - Orchestrates the recommendation generation process
   - Returns recommendations, loading states, and client profile

2. **Product Recommendation Utils** (`src/utils/productRecommendationUtils.js`)
   - Contains all the algorithms and calculation functions
   - Risk profile calculation
   - Investment profile analysis
   - Product suitability scoring
   - Personalized reasoning generation

3. **Client Profile Summary** (`src/components/ClientProfileSummary.js`)
   - Displays client's financial profile analysis
   - Shows risk level, investment type, and key metrics
   - Provides investment strategy recommendations

4. **Product Recommendations Component** (`src/ProductRecommendations.js`)
   - Main UI component with filtering and display logic
   - Enhanced with expandable cards and interactive elements

### Database Integration

The system integrates with the following Supabase tables:

- **`clients`**: Basic client information
- **`manual_financial_inputs`**: Financial data (assets, liabilities, cash flow)
- **`calculated_financial_data`**: Computed metrics and ratios
- **`transaction_behavioral_data`**: Transaction patterns and behavior

## Algorithms

### Risk Profile Calculation

The system calculates a risk score (0-10) based on:

1. **Age Factor** (0-3 points)
   - < 30: 3 points (higher risk tolerance)
   - 30-50: 2 points (moderate risk tolerance)
   - > 50: 1 point (conservative approach)

2. **Income Stability** (0-3 points)
   - Net cash flow > RM5,000: 3 points
   - Net cash flow > RM2,000: 2 points
   - Net cash flow > 0: 1 point
   - Negative cash flow: -1 point

3. **Debt-to-Income Ratio** (0-3 points)
   - < 30%: 3 points
   - 30-50%: 1 point
   - > 50%: -2 points

4. **Credit Utilization** (0-2 points)
   - < 30%: 2 points
   - > 70%: -2 points

5. **Emergency Fund** (0-2 points)
   - ≥ 100% of 3-month expenses: 2 points
   - < 50%: -1 point

6. **Investment Experience** (0-2 points)
   - > 30% of assets in investments: 2 points
   - No investments: -1 point

**Risk Levels:**
- **Aggressive** (8-10 points): High risk tolerance, suitable for growth investments
- **Moderate** (5-7 points): Balanced approach, diversified portfolio
- **Conservative** (0-4 points): Capital preservation focus, low-risk products

### Investment Profile Analysis

Determines client's investment experience level:

1. **New** (0% investments): No investment experience
2. **Beginner** (1-20% investments): Limited investment experience
3. **Intermediate** (21-50% investments): Some investment experience
4. **Advanced** (>50% investments): Experienced investor

### Product Suitability Scoring

Each product is scored based on:

1. **Base Score** from product type and client profile
2. **Financial Capacity** adjustments
3. **Risk Alignment** with client's risk profile
4. **Current Portfolio** gaps and opportunities

## Product Catalog

The system includes a comprehensive catalog of AmBank Malaysia products:

### Savings Products
- **AmBank Savings Account**: Basic savings with competitive rates
- **AmBank Fixed Deposit**: Secure fixed deposits with flexible tenures
- **AmBank Goal Savings Account**: Purpose-driven savings with bonus interest

### Investment Products
- **AmBank Unit Trust Funds**: Professional managed funds with various risk profiles
- **AmBank Structured Deposits**: Investment-linked deposits with capital protection
- **AmBank Foreign Currency Fixed Deposit**: Multi-currency investment options

### Insurance Products
- **AmBank Life Insurance**: Comprehensive life coverage with flexible premiums
- **AmBank Critical Illness Protection**: Protection against 36+ critical illnesses
- **AmBank Personal Accident Insurance**: Worldwide accident coverage

### Credit Products
- **AmBank Credit Cards**: Range of cards with rewards and benefits
- **AmBank Personal Loan**: Flexible personal financing
- **AmBank Home Loan**: Competitive home financing
- **AmBank Car Loan**: Vehicle financing with competitive rates

### Islamic Products
- **AmBank Islamic Savings Account**: Shariah-compliant savings with profit sharing
- **AmBank Islamic Fixed Deposit**: Shariah-compliant fixed deposits
- **AmBank Islamic Home Financing**: Shariah-compliant home financing

Each product includes:
- Detailed descriptions
- Expected returns and risk levels
- Features and requirements
- Minimum amounts and terms
- Malaysian market-specific information

## Usage

### Basic Usage

```javascript
import { useProductRecommendations } from './hooks/useProductRecommendations';

function MyComponent() {
  const { recommendations, loading, error, clientProfile } = useProductRecommendations(clientNric);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <ClientProfileSummary clientProfile={clientProfile} />
      {recommendations.map(rec => (
        <ProductCard key={rec.id} recommendation={rec} />
      ))}
    </div>
  );
}
```

### Testing

Run the test function to verify the system:

```javascript
import { testProductRecommendations } from './utils/testProductRecommendations';

// Run in browser console or test environment
testProductRecommendations();
```

## Customization

### Adding New Products

1. Add product to `PRODUCT_CATALOG` in the hook
2. Update suitability scoring logic if needed
3. Add any new product types to the filtering system

### Modifying Algorithms

1. Edit functions in `productRecommendationUtils.js`
2. Adjust scoring weights and thresholds
3. Update risk profile calculation factors

### Styling

The UI uses inline styles for consistency. To modify:
1. Update color schemes in `getTypeColor()` and `getPriorityColor()` functions
2. Modify card layouts in the main component
3. Adjust responsive breakpoints as needed

## Performance Considerations

- **Caching**: Recommendations are calculated once per client session
- **Database Queries**: Optimized to fetch all required data in parallel
- **Fallback Data**: Graceful handling of missing client data
- **Error Handling**: Comprehensive error states and fallback recommendations

## Future Enhancements

1. **Machine Learning Integration**: Implement ML models for more sophisticated recommendations
2. **Real-time Updates**: Refresh recommendations when client data changes
3. **A/B Testing**: Test different recommendation algorithms
4. **Client Feedback**: Collect and incorporate client feedback on recommendations
5. **Market Data Integration**: Include current market conditions in recommendations

## Troubleshooting

### Common Issues

1. **No Recommendations Showing**
   - Check if client data exists in database
   - Verify all required fields are populated
   - Check browser console for errors

2. **Incorrect Risk Profile**
   - Verify client age calculation from NRIC
   - Check financial data accuracy
   - Review risk scoring algorithm

3. **Database Connection Issues**
   - Verify Supabase configuration
   - Check network connectivity
   - Review database permissions

### Debug Mode

Enable debug logging by adding to browser console:

```javascript
localStorage.setItem('debugRecommendations', 'true');
```

This will log detailed information about the recommendation generation process.

## Support

For issues or questions about the Product Recommendations system:

1. Check the browser console for error messages
2. Verify client data in the database
3. Test with the provided test functions
4. Review the algorithm documentation above

---

*This system provides a foundation for intelligent, data-driven product recommendations that can be continuously improved and enhanced.* 