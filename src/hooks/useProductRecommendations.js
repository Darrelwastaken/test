import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { 
  generatePersonalizedRecommendations, 
  calculateEstimatedValue,
  calculateRiskProfile,
  calculateInvestmentProfile 
} from '../utils/productRecommendationUtils';

export const useProductRecommendations = (clientNric) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clientProfile, setClientProfile] = useState(null);

  useEffect(() => {
    const generateRecommendations = async () => {
      if (!clientNric) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch comprehensive client data
        const [
          clientResult,
          manualResult,
          calculatedResult,
          behavioralResult
        ] = await Promise.all([
          supabase
            .from('clients')
            .select('*')
            .eq('nric', clientNric)
            .single(),
          supabase
            .from('manual_financial_inputs')
            .select('*')
            .eq('client_nric', clientNric)
            .single(),
          supabase
            .from('calculated_financial_data')
            .select('*')
            .eq('client_nric', clientNric)
            .single(),
          supabase
            .from('transaction_behavioral_data')
            .select('*')
            .eq('client_nric', clientNric)
            .single()
        ]);

        // Handle missing data gracefully
        const client = clientResult.data || {};
        const manual = manualResult.data || {};
        const calculated = calculatedResult.data || {};
        const behavioral = behavioralResult.data || {};

        // Combine client data for analysis
        const clientData = {
          age: calculated.calculated_age || 30,
          monthlyIncome: manual.monthly_inflow || 0,
          monthlyExpenses: manual.monthly_outflow || 0,
          totalAssets: calculated.total_assets || 0,
          totalLiabilities: calculated.total_liabilities || 0,
          netPosition: calculated.net_position || 0,
          creditUtilization: calculated.utilization_rate || 0,
          emergencyFundRatio: calculated.emergency_fund_ratio || 0,
          casaBalance: manual.casa_balance || 0,
          investmentValue: manual.investment_portfolio_value || 0,
          insuranceValue: manual.insurance_value || 0,
          current_emergency_fund: manual.current_emergency_fund || 0,
          three_month_expenses: manual.three_month_expenses || 0,
          netCashFlow: calculated.monthly_net_cash_flow || 0
        };

        // Calculate client profiles
        const riskProfile = calculateRiskProfile(clientData);
        const investmentProfile = calculateInvestmentProfile(clientData);

        setClientProfile({
          riskProfile,
          investmentProfile,
          clientData
        });

        // Generate personalized recommendations using utility functions
        const personalizedRecommendations = generatePersonalizedRecommendations(clientData, PRODUCT_CATALOG);
        
        // Add estimated values
        const recommendationsWithValues = personalizedRecommendations.map(rec => ({
          ...rec,
          estimatedValue: calculateEstimatedValue(rec, clientData)
        }));

        setRecommendations(recommendationsWithValues);
      } catch (err) {
        console.error('Error generating recommendations:', err);
        setError(err.message);
        // Fallback recommendations
        setRecommendations(getFallbackRecommendations());
      } finally {
        setLoading(false);
      }
    };

    generateRecommendations();
  }, [clientNric]);

  return { recommendations, loading, error, clientProfile };
};

// Product catalog with AmBank Malaysia products
const PRODUCT_CATALOG = {
  personal_banking: [
    {
      id: 'ambank_amvault_savings',
      type: 'Savings',
      name: 'AmVault Savings Account / Account‑i',
      description: 'High-yield savings account with competitive interest rates and Islamic banking options',
      suitability: 'High',
      expectedReturn: '3.0-4.2%',
      risk: 'Low',
      minDeposit: 100,
      features: ['High interest rates', 'Islamic banking option', 'Online banking', 'Mobile app access', 'No monthly fees'],
      requirements: ['Minimum balance: RM100', 'Valid Malaysian ID', 'Age 18+']
    },
    {
      id: 'ambank_true_savers',
      type: 'Savings',
      name: 'TRUE Savers Account / Account‑i',
      description: 'Savings account with bonus interest for regular deposits and Islamic banking option',
      suitability: 'High',
      expectedReturn: '2.8-3.8%',
      risk: 'Low',
      minDeposit: 100,
      features: ['Bonus interest rates', 'Islamic banking option', 'Regular deposit rewards', 'No monthly fees'],
      requirements: ['Minimum balance: RM100', 'Monthly deposit commitment', 'Valid Malaysian ID']
    },
    {
      id: 'ambank_basic_savings',
      type: 'Savings',
      name: 'Basic Savings Account / Account‑i',
      description: 'Traditional savings account with basic banking services and Islamic option',
      suitability: 'High',
      expectedReturn: '2.0-2.5%',
      risk: 'Low',
      minDeposit: 100,
      features: ['Basic banking services', 'Islamic banking option', 'ATM access', 'Online banking'],
      requirements: ['Minimum balance: RM100', 'Valid Malaysian ID', 'Age 18+']
    },
    {
      id: 'ambank_amwafeeq',
      type: 'Savings',
      name: 'AmWafeeq Account‑i',
      description: 'Islamic savings account with profit sharing and Shariah-compliant banking',
      suitability: 'High',
      expectedReturn: '2.5-3.5%',
      risk: 'Low',
      minDeposit: 100,
      features: ['Shariah-compliant', 'Profit sharing', 'Islamic banking', 'No interest', 'Ethical banking'],
      requirements: ['Minimum balance: RM100', 'Valid Malaysian ID', 'Shariah compliance preference']
    },
    {
      id: 'ambank_eflex_savings',
      type: 'Savings',
      name: 'eFlex Savings Account‑i',
      description: 'Flexible savings account with Islamic banking and digital features',
      suitability: 'High',
      expectedReturn: '2.8-3.2%',
      risk: 'Low',
      minDeposit: 100,
      features: ['Flexible banking', 'Islamic option', 'Digital features', 'Online banking'],
      requirements: ['Minimum balance: RM100', 'Valid Malaysian ID', 'Age 18+']
    },
    {
      id: 'ambank_amgenius',
      type: 'Savings',
      name: 'AmGenius',
      description: 'Smart savings account with innovative features and rewards',
      suitability: 'Medium',
      expectedReturn: '3.2-4.0%',
      risk: 'Low',
      minDeposit: 500,
      features: ['Smart features', 'Rewards program', 'Digital banking', 'Innovative tools'],
      requirements: ['Minimum balance: RM500', 'Valid Malaysian ID', 'Age 18+']
    },
    {
      id: 'ambank_savers_gang',
      type: 'Savings',
      name: 'Savers\' G.A.N.G. (for children)',
      description: 'Children\'s savings account with educational features and parental controls',
      suitability: 'High',
      expectedReturn: '2.5-3.0%',
      risk: 'Low',
      minDeposit: 50,
      features: ['Children\'s banking', 'Educational features', 'Parental controls', 'Savings goals'],
      requirements: ['Parent/guardian account', 'Child\'s birth certificate', 'Age 0-18']
    },
    {
      id: 'ambank_current_account',
      type: 'Current',
      name: 'Current Account / Account‑i',
      description: 'Transaction account for daily banking needs with Islamic option',
      suitability: 'High',
      expectedReturn: '0.5-1.0%',
      risk: 'Low',
      minDeposit: 100,
      features: ['Daily transactions', 'Islamic option', 'Checkbook facility', 'Online banking'],
      requirements: ['Minimum balance: RM100', 'Valid Malaysian ID', 'Age 18+']
    },
    {
      id: 'ambank_foreign_currency',
      type: 'Current',
      name: 'Foreign Currency Accounts / Account‑i',
      description: 'Multi-currency accounts for international transactions and Islamic banking',
      suitability: 'Medium',
      expectedReturn: '1.0-3.5%',
      risk: 'Medium',
      minDeposit: 1000,
      features: ['Multiple currencies', 'Islamic option', 'International transfers', 'Competitive rates'],
      requirements: ['Minimum balance: RM1,000 equivalent', 'Valid Malaysian ID', 'International needs']
    },
    {
      id: 'ambank_hybrid_current',
      type: 'Current',
      name: 'Hybrid Current Account‑i',
      description: 'Combined current and savings features with Islamic banking',
      suitability: 'High',
      expectedReturn: '1.5-2.5%',
      risk: 'Low',
      minDeposit: 500,
      features: ['Hybrid features', 'Islamic banking', 'Savings benefits', 'Transaction flexibility'],
      requirements: ['Minimum balance: RM500', 'Valid Malaysian ID', 'Age 18+']
    },
    {
      id: 'ambank_term_deposit',
      type: 'Investment',
      name: 'Term Deposit / Term Deposit‑i',
      description: 'Fixed-term deposits with guaranteed returns and Islamic option',
      suitability: 'Medium',
      expectedReturn: '3.5-5.0%',
      risk: 'Low',
      minDeposit: 1000,
      features: ['Guaranteed returns', 'Islamic option', 'Flexible tenures', 'Competitive rates'],
      requirements: ['Minimum deposit: RM1,000', 'Valid Malaysian ID', 'Age 18+']
    },
    {
      id: 'ambank_amquantum_term',
      type: 'Investment',
      name: 'AmQuantum Term Deposit‑i',
      description: 'Quantum-based term deposit with enhanced returns and Islamic banking',
      suitability: 'Medium',
      expectedReturn: '4.0-5.5%',
      risk: 'Low',
      minDeposit: 5000,
      features: ['Quantum features', 'Islamic banking', 'Enhanced returns', 'Flexible tenures'],
      requirements: ['Minimum deposit: RM5,000', 'Valid Malaysian ID', 'Age 18+']
    },
    {
      id: 'ambank_afhdal_term',
      type: 'Investment',
      name: 'Afhdal Term Deposit‑i',
      description: 'Premium term deposit with best rates and Islamic banking',
      suitability: 'Medium',
      expectedReturn: '4.5-6.0%',
      risk: 'Low',
      minDeposit: 10000,
      features: ['Premium rates', 'Islamic banking', 'Best returns', 'Priority service'],
      requirements: ['Minimum deposit: RM10,000', 'Valid Malaysian ID', 'Age 18+']
    },
    {
      id: 'ambank_amtdplus',
      type: 'Investment',
      name: 'AmTDPlus‑i',
      description: 'Enhanced term deposit with additional benefits and Islamic banking',
      suitability: 'Medium',
      expectedReturn: '4.2-5.8%',
      risk: 'Low',
      minDeposit: 5000,
      features: ['Enhanced benefits', 'Islamic banking', 'Additional features', 'Flexible options'],
      requirements: ['Minimum deposit: RM5,000', 'Valid Malaysian ID', 'Age 18+']
    }
  ],
  cards: [
    {
      id: 'ambank_visa_debit',
      type: 'Debit',
      name: 'AmBank Visa Debit Card',
      description: 'Debit card for cashless transactions and ATM withdrawals',
      suitability: 'High',
      annualFee: 'RM0-50',
      features: ['Cashless payments', 'ATM withdrawals', 'Online shopping', 'Contactless payments'],
      requirements: ['Savings/current account', 'Valid Malaysian ID', 'Age 18+']
    },
    {
      id: 'ambank_enrich_visa',
      type: 'Credit',
      name: 'AmBank Enrich Visa Infinite & Platinum',
      description: 'Premium credit cards with travel rewards and exclusive benefits',
      suitability: 'Medium',
      annualFee: 'RM200-800',
      creditLimit: 'RM20,000-100,000',
      features: ['Travel rewards', 'Airport lounge access', 'Travel insurance', 'Premium benefits'],
      requirements: ['Annual income: RM60,000+', 'Excellent credit score', 'Age 21-65']
    },
    {
      id: 'ambank_visa_series',
      type: 'Credit',
      name: 'Visa Infinite, Visa Signature, Cash Rebate Visa Platinum',
      description: 'Range of Visa credit cards with different reward structures',
      suitability: 'Medium',
      annualFee: 'RM100-500',
      creditLimit: 'RM10,000-50,000',
      features: ['Rewards points', 'Cash rebates', 'Travel benefits', 'Purchase protection'],
      requirements: ['Annual income: RM36,000+', 'Good credit score', 'Age 21-65']
    },
    {
      id: 'ambank_bonuslink_visa',
      type: 'Credit',
      name: 'BonusLink Visa Series (Gold, Platinum, Gold CARz, M-Series, True Visa)',
      description: 'BonusLink rewards credit cards with various benefits and categories',
      suitability: 'Medium',
      annualFee: 'RM0-300',
      creditLimit: 'RM5,000-30,000',
      features: ['BonusLink points', 'Category rewards', 'Fuel rebates', 'Shopping benefits'],
      requirements: ['Annual income: RM24,000+', 'Good credit score', 'Age 21-65']
    },
    {
      id: 'ambank_mastercard_series',
      type: 'Credit',
      name: 'Mastercard Platinum, Gold CARz, World Mastercard',
      description: 'Mastercard credit cards with international acceptance and benefits',
      suitability: 'Medium',
      annualFee: 'RM100-400',
      creditLimit: 'RM8,000-40,000',
      features: ['International acceptance', 'Travel benefits', 'Purchase protection', 'Rewards program'],
      requirements: ['Annual income: RM30,000+', 'Good credit score', 'Age 21-65']
    },
    {
      id: 'ambank_unionpay_platinum',
      type: 'Credit',
      name: 'UnionPay Platinum',
      description: 'UnionPay credit card with China and Asia-Pacific benefits',
      suitability: 'Medium',
      annualFee: 'RM150-300',
      creditLimit: 'RM8,000-35,000',
      features: ['UnionPay network', 'Asia-Pacific benefits', 'Travel rewards', 'Shopping discounts'],
      requirements: ['Annual income: RM30,000+', 'Good credit score', 'Age 21-65']
    },
    {
      id: 'ambank_signature_priority',
      type: 'Credit',
      name: 'AmBank SIGNATURE Priority Banking Visa Infinite (Metal Card)',
      description: 'Exclusive metal credit card for priority banking customers',
      suitability: 'Low',
      annualFee: 'RM800-1200',
      creditLimit: 'RM50,000-200,000',
      features: ['Metal card design', 'Priority banking', 'Exclusive benefits', 'Concierge service'],
      requirements: ['Priority banking status', 'Annual income: RM120,000+', 'Excellent credit score']
    },
    {
      id: 'ambank_nexg_prepaid',
      type: 'Prepaid',
      name: 'NexG PrePaid Card',
      description: 'Prepaid card for controlled spending and online transactions',
      suitability: 'High',
      annualFee: 'RM0-50',
      features: ['Controlled spending', 'Online transactions', 'No credit check', 'Reloadable'],
      requirements: ['Valid Malaysian ID', 'Age 18+', 'No credit history required']
    }
  ],
  loans_financing: [
    {
      id: 'ambank_personal_financing',
      type: 'Credit',
      name: 'Personal Financing / Financing‑i',
      description: 'Personal loan with flexible terms and Islamic financing option',
      suitability: 'Medium',
      interestRate: '7.5-12.0%',
      maxAmount: 'RM100,000',
      features: ['Flexible terms', 'Islamic option', 'Quick approval', 'No collateral'],
      requirements: ['Stable income', 'Good credit history', 'DSR < 70%', 'Age 21-60']
    },
    {
      id: 'ambank_term_financing_asb',
      type: 'Credit',
      name: 'Term Financing‑i (ASB/ASB2)',
      description: 'Islamic financing for ASB and ASB2 investments',
      suitability: 'Medium',
      interestRate: '4.5-6.5%',
      maxAmount: 'RM200,000',
      features: ['Islamic financing', 'ASB investment', 'Competitive rates', 'Flexible terms'],
      requirements: ['ASB account', 'Good credit history', 'Stable income', 'Age 21-60']
    },
    {
      id: 'ambank_amoneylines',
      type: 'Credit',
      name: 'AmMoneyLine / AmMoneyLine‑i',
      description: 'Overdraft facility with Islamic banking option',
      suitability: 'Medium',
      interestRate: '8.0-15.0%',
      maxAmount: 'RM50,000',
      features: ['Overdraft facility', 'Islamic option', 'Flexible usage', 'Interest on usage only'],
      requirements: ['Current account', 'Good credit history', 'Stable income', 'Age 21-60']
    },
    {
      id: 'ambank_auto_financing',
      type: 'Credit',
      name: 'Islamic and conventional auto financing',
      description: 'Vehicle financing with both conventional and Islamic options',
      suitability: 'Medium',
      interestRate: '3.2-4.8%',
      maxAmount: 'RM500,000',
      features: ['Conventional & Islamic', 'Competitive rates', 'Flexible tenures', 'Quick approval'],
      requirements: ['Stable income', 'Good credit history', 'DSR < 70%', 'Vehicle registration']
    },
    {
      id: 'ambank_hire_purchase',
      type: 'Credit',
      name: 'Hire purchase facilities',
      description: 'Hire purchase financing for vehicles and equipment',
      suitability: 'Medium',
      interestRate: '3.5-5.0%',
      maxAmount: 'RM300,000',
      features: ['Hire purchase', 'Flexible terms', 'Competitive rates', 'Multiple assets'],
      requirements: ['Stable income', 'Good credit history', 'Asset valuation', 'Age 21-60']
    },
    {
      id: 'ambank_home_loan',
      type: 'Credit',
      name: 'Home Loan Facility',
      description: 'Conventional home financing with competitive rates',
      suitability: 'Medium',
      interestRate: '3.5-4.5%',
      maxAmount: 'RM2,000,000',
      features: ['Competitive rates', 'Flexible repayment', 'Multiple property types', 'Professional advice'],
      requirements: ['Stable income', 'Good credit history', 'DSR < 70%', 'Property valuation']
    },
    {
      id: 'ambank_home_link',
      type: 'Credit',
      name: 'Home Link',
      description: 'Home equity financing using property as collateral',
      suitability: 'Medium',
      interestRate: '4.0-5.5%',
      maxAmount: 'RM1,000,000',
      features: ['Home equity', 'Flexible usage', 'Competitive rates', 'Property collateral'],
      requirements: ['Property ownership', 'Good credit history', 'Property equity', 'Age 21-60']
    },
    {
      id: 'ambank_pr1ma_spef',
      type: 'Credit',
      name: 'PR1MA / SPEF',
      description: 'Specialized financing for PR1MA and SPEF properties',
      suitability: 'Medium',
      interestRate: '3.8-4.8%',
      maxAmount: 'RM500,000',
      features: ['PR1MA financing', 'SPEF properties', 'Special rates', 'Government support'],
      requirements: ['PR1MA/SPEF eligibility', 'Good credit history', 'Stable income', 'Age 21-60']
    },
    {
      id: 'ambank_property_link',
      type: 'Credit',
      name: 'Property Link',
      description: 'Property investment financing with flexible terms',
      suitability: 'Medium',
      interestRate: '4.2-5.2%',
      maxAmount: 'RM1,500,000',
      features: ['Property investment', 'Flexible terms', 'Competitive rates', 'Investment focus'],
      requirements: ['Investment property', 'Good credit history', 'Stable income', 'Age 21-60']
    },
    {
      id: 'ambank_term_financing_i',
      type: 'Credit',
      name: 'Term Financing‑i',
      description: 'Islamic term financing for various purposes',
      suitability: 'Medium',
      interestRate: '4.5-6.5%',
      maxAmount: 'RM200,000',
      features: ['Islamic financing', 'Flexible terms', 'Shariah-compliant', 'Competitive rates'],
      requirements: ['Stable income', 'Good credit history', 'Islamic preference', 'Age 21-60']
    },
    {
      id: 'ambank_commercial_property',
      type: 'Credit',
      name: 'Commercial Property Financing',
      description: 'Financing for commercial properties and business premises',
      suitability: 'Medium',
      interestRate: '4.8-6.0%',
      maxAmount: 'RM5,000,000',
      features: ['Commercial properties', 'Business premises', 'Competitive rates', 'Flexible terms'],
      requirements: ['Business registration', 'Good credit history', 'Property valuation', 'Age 21-60']
    },
    {
      id: 'ambank_skim_jaminan',
      type: 'Credit',
      name: 'Skim Jaminan Kredit Perumahan',
      description: 'Housing credit guarantee scheme for first-time buyers',
      suitability: 'High',
      interestRate: '3.8-4.8%',
      maxAmount: 'RM300,000',
      features: ['First-time buyers', 'Government guarantee', 'Special rates', 'Low down payment'],
      requirements: ['First-time buyer', 'Good credit history', 'Stable income', 'Age 21-60']
    },
    {
      id: 'ambank_sme_overdraft',
      type: 'Credit',
      name: 'Overdraft',
      description: 'Business overdraft facility for working capital',
      suitability: 'Medium',
      interestRate: '8.0-15.0%',
      maxAmount: 'RM500,000',
      features: ['Working capital', 'Flexible usage', 'Interest on usage', 'Quick access'],
      requirements: ['Business registration', 'Good credit history', 'Stable business', '2+ years operation']
    },
    {
      id: 'ambank_sme_term_loans',
      type: 'Credit',
      name: 'Term loans',
      description: 'Business term loans for capital expenditure',
      suitability: 'Medium',
      interestRate: '6.0-12.0%',
      maxAmount: 'RM2,000,000',
      features: ['Capital expenditure', 'Flexible terms', 'Competitive rates', 'Business focus'],
      requirements: ['Business registration', 'Good credit history', 'Stable business', '3+ years operation']
    },
    {
      id: 'ambank_cash_line',
      type: 'Credit',
      name: 'Cash line',
      description: 'Revolving credit facility for business cash flow',
      suitability: 'Medium',
      interestRate: '7.5-14.0%',
      maxAmount: 'RM1,000,000',
      features: ['Revolving credit', 'Cash flow support', 'Flexible usage', 'Interest on usage'],
      requirements: ['Business registration', 'Good credit history', 'Stable cash flow', '2+ years operation']
    },
    {
      id: 'ambank_invoice_financing',
      type: 'Credit',
      name: 'Invoice financing',
      description: 'Financing against outstanding invoices for cash flow',
      suitability: 'Medium',
      interestRate: '8.0-15.0%',
      maxAmount: 'RM1,000,000',
      features: ['Invoice-based', 'Cash flow support', 'Quick approval', 'Flexible terms'],
      requirements: ['Business registration', 'Good credit history', 'Quality invoices', '2+ years operation']
    },
    {
      id: 'ambank_factoring_i',
      type: 'Credit',
      name: 'Factoring‑i',
      description: 'Islamic factoring for trade receivables',
      suitability: 'Medium',
      interestRate: '7.0-12.0%',
      maxAmount: 'RM2,000,000',
      features: ['Islamic factoring', 'Trade receivables', 'Shariah-compliant', 'Competitive rates'],
      requirements: ['Business registration', 'Good credit history', 'Trade receivables', 'Islamic preference']
    },
    {
      id: 'ambank_trade_finance',
      type: 'Credit',
      name: 'Trade finance',
      description: 'Comprehensive trade financing solutions',
      suitability: 'Medium',
      interestRate: '5.0-10.0%',
      maxAmount: 'RM5,000,000',
      features: ['Trade financing', 'Import/export', 'Competitive rates', 'Comprehensive solutions'],
      requirements: ['Business registration', 'Good credit history', 'Trade activities', '3+ years operation']
    },
    {
      id: 'ambank_letter_of_credit',
      type: 'Credit',
      name: 'Letter of credit',
      description: 'Trade finance instrument for international transactions',
      suitability: 'Medium',
      interestRate: '3.0-8.0%',
      maxAmount: 'RM10,000,000',
      features: ['International trade', 'Payment guarantee', 'Risk mitigation', 'Trade security'],
      requirements: ['Business registration', 'Good credit history', 'International trade', 'Trade documentation']
    },
    {
      id: 'ambank_import_export_guarantees',
      type: 'Credit',
      name: 'Import/export guarantees',
      description: 'Guarantees for import and export transactions',
      suitability: 'Medium',
      interestRate: '2.0-6.0%',
      maxAmount: 'RM10,000,000',
      features: ['Import/export', 'Payment guarantees', 'Risk mitigation', 'Trade support'],
      requirements: ['Business registration', 'Good credit history', 'Trade activities', 'Trade documentation']
    }
  ],
  wealth_management: [
    {
      id: 'ambank_unit_trusts',
      type: 'Investment',
      name: 'Unit Trusts via AmInvest',
      description: 'Professional managed unit trust funds with various risk profiles',
      suitability: 'Medium',
      expectedReturn: '6-15%',
      risk: 'Medium-High',
      minInvestment: 1000,
      features: ['Professional management', 'Diversified portfolios', 'Regular income options', 'Systematic investment'],
      requirements: ['Minimum investment: RM1,000', 'Risk assessment', 'Regular contribution recommended']
    },
    {
      id: 'ambank_direct_bond_sukuk',
      type: 'Investment',
      name: 'Direct Bond / Sukuk',
      description: 'Direct investment in bonds and Islamic sukuk instruments',
      suitability: 'Medium',
      expectedReturn: '4-8%',
      risk: 'Medium',
      minInvestment: 10000,
      features: ['Direct investment', 'Islamic sukuk', 'Fixed income', 'Regular coupons'],
      requirements: ['Minimum investment: RM10,000', 'Understanding of bonds', 'Risk tolerance assessment']
    },
    {
      id: 'ambank_dual_currency',
      type: 'Investment',
      name: 'Dual Currency Investments',
      description: 'Investment products linked to currency movements',
      suitability: 'High',
      expectedReturn: '5-12%',
      risk: 'High',
      minInvestment: 5000,
      features: ['Currency-linked', 'Higher returns', 'Currency risk', 'Flexible tenures'],
      requirements: ['Minimum investment: RM5,000', 'Currency understanding', 'High risk tolerance']
    },
    {
      id: 'ambank_equities',
      type: 'Investment',
      name: 'Equities',
      description: 'Direct equity investment in Malaysian and international markets',
      suitability: 'High',
      expectedReturn: '8-20%',
      risk: 'High',
      minInvestment: 1000,
      features: ['Direct equity', 'Market exposure', 'High returns', 'Dividend income'],
      requirements: ['Minimum investment: RM1,000', 'Market understanding', 'High risk tolerance']
    },
    {
      id: 'ambank_smart_partnership',
      type: 'Investment',
      name: 'Smart Partnership Programme (SPP)',
      description: 'Partnership investment program with professional management',
      suitability: 'Medium',
      expectedReturn: '7-12%',
      risk: 'Medium',
      minInvestment: 5000,
      features: ['Partnership program', 'Professional management', 'Diversified exposure', 'Regular income'],
      requirements: ['Minimum investment: RM5,000', 'Partnership agreement', 'Risk assessment']
    },
    {
      id: 'ambank_wealth_advisory',
      type: 'Service',
      name: 'Wealth Advisory Services',
      description: 'Professional wealth management and financial planning services',
      suitability: 'High',
      serviceFee: '0.5-2.0%',
      features: ['Professional advice', 'Financial planning', 'Portfolio management', 'Tax optimization'],
      requirements: ['Minimum assets: RM100,000', 'Wealth management needs', 'Professional consultation']
    },
    {
      id: 'ambank_private_banking',
      type: 'Service',
      name: 'AmPrivate Banking',
      description: 'Exclusive private banking services for high net worth individuals',
      suitability: 'Low',
      serviceFee: '1.0-3.0%',
      features: ['Exclusive services', 'Dedicated relationship manager', 'Premium products', 'Concierge services'],
      requirements: ['Minimum assets: RM1,000,000', 'High net worth status', 'Private banking eligibility']
    },
    {
      id: 'ambank_priority_banking',
      type: 'Service',
      name: 'Priority Banking tiers',
      description: 'Tiered priority banking services with exclusive benefits',
      suitability: 'Medium',
      serviceFee: '0.3-1.5%',
      features: ['Priority services', 'Exclusive benefits', 'Dedicated support', 'Premium products'],
      requirements: ['Minimum assets: RM200,000', 'Priority banking eligibility', 'Relationship management']
    },
    {
      id: 'ambank_will_wasiat',
      type: 'Service',
      name: 'Will / Wasiat writing',
      description: 'Professional will writing and Islamic wasiat services',
      suitability: 'High',
      serviceFee: 'RM500-2000',
      features: ['Will writing', 'Islamic wasiat', 'Legal documentation', 'Estate planning'],
      requirements: ['Legal consultation', 'Documentation requirements', 'Estate planning needs']
    },
    {
      id: 'ambank_legacy_estate',
      type: 'Service',
      name: 'Legacy & estate planning',
      description: 'Comprehensive estate planning and legacy management services',
      suitability: 'High',
      serviceFee: 'RM1000-5000',
      features: ['Estate planning', 'Legacy management', 'Tax optimization', 'Succession planning'],
      requirements: ['Estate planning needs', 'Professional consultation', 'Documentation requirements']
    }
  ],
  insurance_takaful: [
    {
      id: 'ambank_general_insurance',
      type: 'Insurance',
      name: 'General Insurance (vehicle, travel, personal accident, home, business)',
      description: 'Comprehensive general insurance coverage for various needs',
      suitability: 'High',
      monthlyPremium: 'RM50-500',
      coverage: 'RM50,000-2,000,000',
      features: ['Vehicle insurance', 'Travel insurance', 'Personal accident', 'Home insurance', 'Business insurance'],
      requirements: ['Valid Malaysian ID', 'Age 18-70', 'Insurance needs assessment', 'Premium payments']
    },
    {
      id: 'ambank_life_insurance',
      type: 'Insurance',
      name: 'Life Insurance (savings, protection, legacy, credit-linked)',
      description: 'Comprehensive life insurance with various coverage options',
      suitability: 'High',
      monthlyPremium: 'RM50-300',
      coverage: 'RM50,000-1,000,000',
      features: ['Savings component', 'Protection coverage', 'Legacy planning', 'Credit-linked protection'],
      requirements: ['Age 18-65', 'Medical underwriting', 'Regular premium payments', 'Good health']
    },
    {
      id: 'ambank_family_takaful',
      type: 'Insurance',
      name: 'Family Takaful (Islamic life/family coverage)',
      description: 'Shariah-compliant family protection and life coverage',
      suitability: 'High',
      monthlyPremium: 'RM50-250',
      coverage: 'RM50,000-500,000',
      features: ['Shariah-compliant', 'Family protection', 'Islamic principles', 'Profit sharing'],
      requirements: ['Age 18-65', 'Islamic preference', 'Regular contributions', 'Good health']
    }
  ],
  corporate_treasury: [
    {
      id: 'ambank_sme_corporate',
      type: 'Service',
      name: 'SME & Corporate Banking',
      description: 'Comprehensive banking services for SMEs and corporations',
      suitability: 'Medium',
      serviceFee: 'Variable',
      features: ['Business accounts', 'Trade finance', 'Cash management', 'Corporate lending'],
      requirements: ['Business registration', 'Corporate structure', 'Banking relationship', 'Financial documentation']
    },
    {
      id: 'ambank_cash_management',
      type: 'Service',
      name: 'Cash management',
      description: 'Advanced cash management solutions for businesses',
      suitability: 'Medium',
      serviceFee: '0.1-0.5%',
      features: ['Cash pooling', 'Payment solutions', 'Receivables management', 'Liquidity management'],
      requirements: ['Business registration', 'Cash management needs', 'Corporate structure', 'Banking relationship']
    },
    {
      id: 'ambank_trade_finance_corp',
      type: 'Service',
      name: 'Trade finance',
      description: 'Comprehensive trade finance solutions for international business',
      suitability: 'Medium',
      serviceFee: '0.5-2.0%',
      features: ['Import/export finance', 'Letters of credit', 'Trade guarantees', 'Documentary collections'],
      requirements: ['Business registration', 'Trade activities', 'International business', 'Trade documentation']
    },
    {
      id: 'ambank_payroll_solutions',
      type: 'Service',
      name: 'Payroll solutions',
      description: 'Comprehensive payroll and HR management solutions',
      suitability: 'Medium',
      serviceFee: 'RM2-10 per employee',
      features: ['Payroll processing', 'HR management', 'Tax compliance', 'Employee benefits'],
      requirements: ['Business registration', 'Employee base', 'HR needs', 'Compliance requirements']
    },
    {
      id: 'ambank_business_accounts',
      type: 'Service',
      name: 'Business current accounts',
      description: 'Specialized current accounts for business operations',
      suitability: 'High',
      serviceFee: 'RM0-200',
      features: ['Business transactions', 'Online banking', 'Checkbook facility', 'Business support'],
      requirements: ['Business registration', 'Valid business documentation', 'Business needs assessment']
    },
    {
      id: 'ambank_structured_products',
      type: 'Investment',
      name: 'Structured Products (autocallables, capital-protected notes, equity-linked investments, FX, dual currency investments)',
      description: 'Sophisticated investment products with various risk-return profiles',
      suitability: 'High',
      expectedReturn: '5-20%',
      risk: 'High',
      minInvestment: 10000,
      features: ['Autocallables', 'Capital protection', 'Equity-linked', 'FX products', 'Dual currency'],
      requirements: ['Minimum investment: RM10,000', 'Sophisticated investor', 'High risk tolerance', 'Product understanding']
    }
  ]
};

function analyzeClientProfile(client, manual, calculated, behavioral) {
  const recommendations = [];
  
  // Extract key metrics
  const age = calculated.calculated_age || 30;
  const monthlyIncome = manual.monthly_inflow || 0;
  const monthlyExpenses = manual.monthly_outflow || 0;
  const netCashFlow = monthlyIncome - monthlyExpenses;
  const totalAssets = calculated.total_assets || 0;
  const totalLiabilities = calculated.total_liabilities || 0;
  const netWorth = calculated.net_position || 0;
  const creditUtilization = calculated.utilization_rate || 0;
  const emergencyFundRatio = calculated.emergency_fund_ratio || 0;
  const casaBalance = manual.casa_balance || 0;
  const investmentValue = manual.investment_portfolio_value || 0;
  const insuranceValue = manual.insurance_value || 0;

  // Analyze client profile and generate recommendations
  
  // 1. Emergency Fund Analysis
  if (emergencyFundRatio < 100) {
    recommendations.push({
      ...PRODUCT_CATALOG.personal_banking[0],
      priority: 'High',
      reasoning: `Your emergency fund covers only ${Math.round(emergencyFundRatio)}% of 3-month expenses. A high-yield savings account can help build your emergency fund faster.`,
      estimatedValue: Math.max(5000, monthlyExpenses * 3 - manual.current_emergency_fund)
    });
  }

  // 2. Investment Opportunities
  if (casaBalance > 10000 && investmentValue < totalAssets * 0.3) {
    recommendations.push({
      ...PRODUCT_CATALOG.wealth_management[0],
      priority: 'High',
      reasoning: `You have RM${casaBalance.toLocaleString()} in savings but limited investments. Consider diversifying with an index fund portfolio.`,
      estimatedValue: Math.min(casaBalance * 0.5, 20000)
    });
  }

  // 3. Insurance Needs
  if (insuranceValue < monthlyIncome * 12) {
    recommendations.push({
      ...PRODUCT_CATALOG.insurance_takaful[0],
      priority: 'Medium',
      reasoning: `Your insurance coverage (RM${insuranceValue.toLocaleString()}) is less than your annual income. Consider term life insurance for family protection.`,
      estimatedValue: monthlyIncome * 12
    });
  }

  // 4. Credit Management
  if (creditUtilization > 70) {
    recommendations.push({
      ...PRODUCT_CATALOG.loans_financing[1],
      priority: 'High',
      reasoning: `Your credit utilization is ${Math.round(creditUtilization)}%, which is high. A personal loan could help consolidate debt at lower rates.`,
      estimatedValue: totalLiabilities
    });
  }

  // 5. Savings Enhancement
  if (netCashFlow > 2000 && casaBalance < monthlyExpenses * 6) {
    recommendations.push({
      ...PRODUCT_CATALOG.personal_banking[1],
      priority: 'Medium',
      reasoning: `You have positive cash flow of RM${netCashFlow.toLocaleString()}/month. Consider fixed deposits for higher returns on excess savings.`,
      estimatedValue: netCashFlow * 6
    });
  }

  // 6. Investment Diversification
  if (age < 50 && investmentValue > 0 && investmentValue < totalAssets * 0.5) {
    recommendations.push({
      ...PRODUCT_CATALOG.wealth_management[1],
      priority: 'Medium',
      reasoning: `At age ${age}, you have time to grow your investments. Consider unit trusts for professional management and diversification.`,
      estimatedValue: Math.max(5000, totalAssets * 0.2)
    });
  }

  // 7. Credit Card Benefits
  if (monthlyIncome > 5000 && creditUtilization < 30) {
    recommendations.push({
      ...PRODUCT_CATALOG.cards[0],
      priority: 'Low',
      reasoning: `With good income and low credit utilization, you qualify for premium credit cards with rewards and benefits.`,
      estimatedValue: 1000
    });
  }

  // Sort by priority and estimated value
  return recommendations.sort((a, b) => {
    const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    return b.estimatedValue - a.estimatedValue;
  });
}

function getFallbackRecommendations() {
  return [
    {
      id: 'ambank_basic_savings',
      type: 'Savings',
      name: 'AmBank Savings Account',
      description: 'Start building your savings with AmBank\'s basic savings account',
      suitability: 'Medium',
      expectedReturn: '2.5%',
      risk: 'Low',
      priority: 'Medium',
      reasoning: 'An AmBank savings account is a good starting point for financial planning with competitive rates.',
      estimatedValue: 5000,
      features: ['No monthly fees', 'Free ATM withdrawals', 'Online banking', 'Mobile app access'],
      requirements: ['Valid Malaysian ID', 'Age 18+', 'Initial deposit: RM100']
    },
    {
      id: 'ambank_life_insurance_basic',
      type: 'Insurance',
      name: 'AmBank Life Insurance',
      description: 'Essential life insurance coverage from AmBank',
      suitability: 'High',
      monthlyPremium: 'RM50-200',
      coverage: 'RM50,000-1,000,000',
      priority: 'High',
      reasoning: 'AmBank life insurance provides essential protection for your family with flexible premium options.',
      estimatedValue: 200000,
      features: ['Flexible premium payments', 'Multiple coverage options', 'Riders available', 'Cash value accumulation'],
      requirements: ['Age 18-65', 'Medical underwriting', 'Regular premium payments', 'Good health']
    }
  ];
} 