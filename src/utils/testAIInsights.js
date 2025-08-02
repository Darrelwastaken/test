import { analyzeClientWithGemini } from './aiAnalyzer.js';

// Test data for AI insights
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

async function testAIInsights() {
  try {
    console.log('Testing AI Insights with Product Recommendations...');
    console.log('Client Data:', testClientData);
    console.log('Transactions:', testTransactions);
    
    const result = await analyzeClientWithGemini(testClientData, testTransactions);
    
    console.log('\n=== AI Analysis Result ===');
    console.log('Summary:', result.summary);
    console.log('\nInsights:', JSON.stringify(result.insights, null, 2));
    console.log('\nRecommendations:', JSON.stringify(result.recommendations, null, 2));
    
    // Verify that insights have product recommendations
    const insightsWithProducts = result.insights.filter(insight => insight.product);
    console.log(`\nInsights with products: ${insightsWithProducts.length}/${result.insights.length}`);
    
    if (insightsWithProducts.length > 0) {
      console.log('✅ SUCCESS: AI insights now include product recommendations!');
      insightsWithProducts.forEach((insight, index) => {
        console.log(`\nInsight ${index + 1}:`);
        console.log(`  - Insight: ${insight.insight}`);
        console.log(`  - Product: ${insight.product}`);
        console.log(`  - Reasoning: ${insight.reasoning}`);
      });
    } else {
      console.log('❌ FAILED: No product recommendations found in insights');
    }
    
    return result;
  } catch (error) {
    console.error('❌ Test failed:', error);
    throw error;
  }
}

// Run the test if this file is executed directly
if (typeof window === 'undefined') {
  testAIInsights()
    .then(() => {
      console.log('\n✅ Test completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Test failed:', error);
      process.exit(1);
    });
}

export { testAIInsights, testClientData, testTransactions }; 