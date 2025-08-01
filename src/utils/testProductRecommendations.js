import { analyzeClientWithGemini } from './aiAnalyzer.js';

// Test data for Product Recommendations
const testClientData = {
  nric: '123456789012',
  name: 'John Doe',
  status: 'Active',
  risk_profile: 'Balanced',
  credit_score: '750'
};

const testTransactions = [
  {
    transaction_date: '2024-01-15',
    amount: 3500,
    description: 'SALARY CREDIT',
    category: 'Income',
    channel: 'Branch'
  },
  {
    transaction_date: '2024-01-20',
    amount: 830,
    description: 'GRAB TRANSPORT',
    category: 'Transport',
    channel: 'Online'
  },
  {
    transaction_date: '2024-01-25',
    amount: 156.80,
    description: 'TESCO GROCERIES',
    category: 'Groceries',
    channel: 'Card'
  },
  {
    transaction_date: '2024-01-30',
    amount: 450,
    description: 'SHOPEE ONLINE',
    category: 'Shopping',
    channel: 'Online'
  }
];

async function testProductRecommendations() {
  try {
    console.log('Testing Product Recommendations Display...');
    console.log('Client Data:', testClientData);
    console.log('Transactions:', testTransactions);
    
    const result = await analyzeClientWithGemini(testClientData, testTransactions);
    
    console.log('\n=== AI Analysis Result ===');
    console.log('Summary:', result.summary);
    console.log('\nInsights with Products:', JSON.stringify(result.insights, null, 2));
    console.log('\nRecommendations:', JSON.stringify(result.recommendations, null, 2));
    
    // Verify that insights have product information for Product Recommendations page
    const insightsWithProducts = result.insights.filter(insight => insight.product);
    console.log(`\nInsights with products for Product Recommendations: ${insightsWithProducts.length}/${result.insights.length}`);
    
    if (insightsWithProducts.length > 0) {
      console.log('✅ SUCCESS: Product Recommendations page will display products!');
      insightsWithProducts.forEach((insight, index) => {
        console.log(`\nProduct Recommendation ${index + 1}:`);
        console.log(`  - Insight: ${insight.insight}`);
        console.log(`  - Product: ${insight.product}`);
        console.log(`  - Product Reasoning: ${insight.productReasoning}`);
        console.log(`  - Priority: ${insight.priority}`);
      });
      
      // Test the format expected by Product Recommendations page
      const formattedForProductPage = insightsWithProducts.map((insight, index) => ({
        ...insight,
        recommendedProduct: {
          name: insight.product,
          description: insight.productReasoning || insight.reasoning,
          reasoning: insight.productReasoning || insight.reasoning,
          type: 'Product Recommendation'
        }
      }));
      
      console.log('\n=== Formatted for Product Recommendations Page ===');
      console.log(JSON.stringify(formattedForProductPage, null, 2));
      
    } else {
      console.log('❌ FAILED: No product recommendations found for Product Recommendations page');
    }
    
    return result;
  } catch (error) {
    console.error('❌ Test failed:', error);
    throw error;
  }
}

// Run the test if this file is executed directly
if (typeof window === 'undefined') {
  testProductRecommendations()
    .then(() => {
      console.log('\n✅ Product Recommendations test completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Product Recommendations test failed:', error);
      process.exit(1);
    });
}

export { testProductRecommendations, testClientData, testTransactions }; 