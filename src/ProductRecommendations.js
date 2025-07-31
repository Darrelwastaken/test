import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAIProductRecommendations } from './hooks/useAIProductRecommendations';

export default function ProductRecommendations() {
  const { nric } = useParams();
  const { recommendations, loading, error, aiInsights } = useAIProductRecommendations(nric);
  const [expandedInsights, setExpandedInsights] = useState({});
  const [showProductPanel, setShowProductPanel] = useState(false);

  // Toggle insight expansion
  const toggleInsight = (insightIndex) => {
    setExpandedInsights(prev => ({
      ...prev,
      [insightIndex]: !prev[insightIndex]
    }));
  };

  // Get the top 3 insights
  const topInsights = aiInsights.slice(0, 3);

  if (loading) {
    return (
      <div style={{ display: 'flex' }}>
        <Sidebar clientId={nric} />
        <div style={{ flex: 1, padding: '32px', marginLeft: '240px' }}>
          <div style={{ textAlign: 'center', padding: '48px' }}>
            <div style={{ fontSize: '18px', color: '#666' }}>Analyzing your financial profile...</div>
            <div style={{ marginTop: '16px', fontSize: '14px', color: '#999' }}>
              Generating personalized product recommendations
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex' }}>
        <Sidebar clientId={nric} />
        <div style={{ flex: 1, padding: '32px', marginLeft: '240px' }}>
          <div style={{ textAlign: 'center', padding: '48px' }}>
            <div style={{ fontSize: '18px', color: '#dc2626', marginBottom: '8px' }}>
              Unable to load recommendations
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>
              {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar clientId={nric} />
      <div style={{ flex: 1, padding: '32px', marginLeft: '240px' }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '32px' 
        }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#111827' }}>
            Product Recommendations
          </h1>
          <button
            onClick={() => setShowProductPanel(!showProductPanel)}
            style={{
              background: '#222',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'background 0.2s ease'
            }}
            onMouseOver={(e) => e.target.style.background = '#000'}
            onMouseOut={(e) => e.target.style.background = '#222'}
          >
            Access Product Panel
          </button>
        </div>

        {/* Main Container */}
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '32px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
        }}>
          {topInsights.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px' }}>
              <div style={{ fontSize: '18px', color: '#666', marginBottom: '8px' }}>
                No AI insights available
              </div>
              <div style={{ fontSize: '14px', color: '#999' }}>
                AI analysis is required to generate personalized product recommendations
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '24px' }}>
              {topInsights.map((insight, index) => (
                <div key={index}>
                  {/* Insight Card */}
                  <div style={{
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '24px',
                    transition: 'all 0.2s ease'
                  }}>
                    {/* Insight Header */}
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                        <div style={{
                          background: '#dbeafe',
                          color: '#1e40af',
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600',
                          textTransform: 'uppercase'
                        }}>
                          {insight.type?.replace(/_/g, ' ') || 'Analysis'}
                        </div>
                        <div style={{
                          background: insight.priority === 'HIGH' ? '#dcfce7' : insight.priority === 'MEDIUM' ? '#fef3c7' : '#f3f4f6',
                          color: insight.priority === 'HIGH' ? '#166534' : insight.priority === 'MEDIUM' ? '#92400e' : '#374151',
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          {insight.priority} Priority
                        </div>
                      </div>
                      
                      <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px', color: '#111827' }}>
                        {insight.insight || insight.text || 'AI Analysis Insight'}
                      </h3>
                      
                      <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.5' }}>
                        {insight.reasoning || 'This insight is based on your financial profile and transaction patterns.'}
                      </p>
                    </div>

                    {/* View Recommended Product Button */}
                    <button
                      onClick={() => toggleInsight(index)}
                      style={{
                        background: '#222',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '12px 24px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        fontSize: '14px',
                        transition: 'background 0.2s ease'
                      }}
                      onMouseOver={(e) => e.target.style.background = '#000'}
                      onMouseOut={(e) => e.target.style.background = '#222'}
                    >
                      {expandedInsights[index] ? 'Hide Recommended Product' : 'View Recommended Product'}
                    </button>
                  </div>

                  {/* Collapsible Product Card */}
                  {expandedInsights[index] && (
                    <div style={{
                      background: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      padding: '24px',
                      marginTop: '16px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      animation: 'slideDown 0.3s ease-out'
                    }}>
                      {insight.recommendedProduct ? (
                        <>
                          {/* Product Header */}
                          <div style={{ marginBottom: '20px' }}>
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                              <div style={{ 
                                background: insight.recommendedProduct.type === 'Savings' ? '#dbeafe' : 
                                           insight.recommendedProduct.type === 'Investment' ? '#dcfce7' : 
                                           insight.recommendedProduct.type === 'Insurance' ? '#fef3c7' : 
                                           insight.recommendedProduct.type === 'Credit' ? '#f3e8ff' : 
                                           insight.recommendedProduct.type === 'Islamic' ? '#fef2f2' : '#f3f4f6',
                                color: insight.recommendedProduct.type === 'Savings' ? '#1e40af' : 
                                       insight.recommendedProduct.type === 'Investment' ? '#166534' : 
                                       insight.recommendedProduct.type === 'Insurance' ? '#92400e' : 
                                       insight.recommendedProduct.type === 'Credit' ? '#7c3aed' : 
                                       insight.recommendedProduct.type === 'Islamic' ? '#dc2626' : '#374151',
                                padding: '6px 12px',
                                borderRadius: '20px',
                                fontSize: '12px',
                                fontWeight: '600'
                              }}>
                                {insight.recommendedProduct.type}
                              </div>
                            </div>
                            
                            <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#111827' }}>
                              {insight.recommendedProduct.name}
                            </h4>
                            
                            <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.5', marginBottom: '16px' }}>
                              {insight.recommendedProduct.description}
                            </p>

                            {/* Product Reasoning */}
                            <div style={{ 
                              background: '#f0f9ff', 
                              padding: '12px 16px', 
                              borderRadius: '8px',
                              border: '1px solid #bae6fd',
                              marginBottom: '16px'
                            }}>
                              <div style={{ fontSize: '14px', color: '#0369a1', fontWeight: '600', marginBottom: '4px' }}>
                                Why this product is recommended:
                              </div>
                              <div style={{ fontSize: '13px', color: '#0369a1' }}>
                                {insight.recommendedProduct.reasoning}
                              </div>
                            </div>
                          </div>

                          {/* Key Features */}
                          <div style={{ marginBottom: '20px' }}>
                            <h5 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#374151' }}>
                              Key Features:
                            </h5>
                            <div style={{ display: 'grid', gap: '8px' }}>
                              {insight.recommendedProduct.expectedReturn && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                                  <span style={{ color: '#6b7280' }}>Expected Return:</span>
                                  <span style={{ fontWeight: '600', color: '#111827' }}>{insight.recommendedProduct.expectedReturn}</span>
                                </div>
                              )}
                              {insight.recommendedProduct.risk && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                                  <span style={{ color: '#6b7280' }}>Risk Level:</span>
                                  <span style={{ fontWeight: '600', color: '#111827' }}>{insight.recommendedProduct.risk}</span>
                                </div>
                              )}
                              {insight.recommendedProduct.monthlyPremium && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                                  <span style={{ color: '#6b7280' }}>Monthly Premium:</span>
                                  <span style={{ fontWeight: '600', color: '#111827' }}>{insight.recommendedProduct.monthlyPremium}</span>
                                </div>
                              )}
                              {insight.recommendedProduct.minDeposit && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                                  <span style={{ color: '#6b7280' }}>Minimum Deposit:</span>
                                  <span style={{ fontWeight: '600', color: '#111827' }}>RM{insight.recommendedProduct.minDeposit.toLocaleString()}</span>
                                </div>
                              )}
                              {insight.recommendedProduct.minInvestment && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                                  <span style={{ color: '#6b7280' }}>Minimum Investment:</span>
                                  <span style={{ fontWeight: '600', color: '#111827' }}>RM{insight.recommendedProduct.minInvestment.toLocaleString()}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            <button style={{
                              background: '#f3f4f6',
                              color: '#374151',
                              border: '1px solid #d1d5db',
                              borderRadius: '8px',
                              padding: '12px 24px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              fontSize: '14px',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseOver={(e) => {
                              e.target.style.background = '#e5e7eb';
                              e.target.style.borderColor = '#9ca3af';
                            }}
                            onMouseOut={(e) => {
                              e.target.style.background = '#f3f4f6';
                              e.target.style.borderColor = '#d1d5db';
                            }}
                            >
                              Learn More
                            </button>
                            <button style={{
                              background: '#059669',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '12px 24px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              fontSize: '14px',
                              transition: 'background 0.2s ease'
                            }}
                            onMouseOver={(e) => e.target.style.background = '#047857'}
                            onMouseOut={(e) => e.target.style.background = '#059669'}
                            >
                              Apply Now
                            </button>
                          </div>
                        </>
                      ) : (
                        <div style={{ textAlign: 'center', padding: '20px' }}>
                          <div style={{ fontSize: '14px', color: '#666' }}>
                            No specific product recommendation available for this insight.
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Panel Modal */}
        {showProductPanel && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={() => setShowProductPanel(false)}
          >
            <div style={{
              background: '#fff',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '800px',
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '24px',
                borderBottom: '1px solid #e5e7eb',
                paddingBottom: '16px'
              }}>
                <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#111827' }}>
                  Product Panel
                </h2>
                <button
                  onClick={() => setShowProductPanel(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: '#6b7280',
                    padding: '4px'
                  }}
                >
                  ×
                </button>
              </div>

              {/* Product Categories */}
              <div style={{ display: 'grid', gap: '20px' }}>
                {[
                  {
                    category: 'Personal Banking',
                    products: [
                      { name: 'AmVault Savings Account / Account‑i', description: 'High-yield savings account with competitive interest rates and Islamic banking options' },
                      { name: 'TRUE Savers Account / Account‑i', description: 'Savings account with bonus interest for regular deposits and Islamic banking option' },
                      { name: 'Basic Savings Account / Account‑i', description: 'Traditional savings account with basic banking services and Islamic option' },
                      { name: 'AmWafeeq Account‑i', description: 'Islamic savings account with profit sharing and Shariah-compliant banking' },
                      { name: 'eFlex Savings Account‑i', description: 'Flexible savings account with Islamic banking and digital features' },
                      { name: 'AmGenius', description: 'Smart savings account with innovative features and rewards' },
                      { name: 'Savers\' G.A.N.G. (for children)', description: 'Children\'s savings account with educational features and parental controls' },
                      { name: 'Current Account / Account‑i', description: 'Transaction account for daily banking needs with Islamic option' },
                      { name: 'Foreign Currency Accounts / Account‑i', description: 'Multi-currency accounts for international transactions and Islamic banking' },
                      { name: 'Hybrid Current Account‑i', description: 'Combined current and savings features with Islamic banking' },
                      { name: 'Term Deposit / Term Deposit‑i', description: 'Fixed-term deposits with guaranteed returns and Islamic option' },
                      { name: 'AmQuantum Term Deposit‑i', description: 'Quantum-based term deposit with enhanced returns and Islamic banking' },
                      { name: 'Afhdal Term Deposit‑i', description: 'Premium term deposit with best rates and Islamic banking' },
                      { name: 'AmTDPlus‑i', description: 'Enhanced term deposit with additional benefits and Islamic banking' }
                    ]
                  },
                  {
                    category: 'Cards',
                    products: [
                      { name: 'AmBank Visa Debit Card', description: 'Debit card for cashless transactions and ATM withdrawals' },
                      { name: 'AmBank Enrich Visa Infinite & Platinum', description: 'Premium credit cards with travel rewards and exclusive benefits' },
                      { name: 'Visa Infinite, Visa Signature, Cash Rebate Visa Platinum', description: 'Range of Visa credit cards with different reward structures' },
                      { name: 'BonusLink Visa Series (Gold, Platinum, Gold CARz, M-Series, True Visa)', description: 'BonusLink rewards credit cards with various benefits and categories' },
                      { name: 'Mastercard Platinum, Gold CARz, World Mastercard', description: 'Mastercard credit cards with international acceptance and benefits' },
                      { name: 'UnionPay Platinum', description: 'UnionPay credit card with China and Asia-Pacific benefits' },
                      { name: 'AmBank SIGNATURE Priority Banking Visa Infinite (Metal Card)', description: 'Exclusive metal credit card for priority banking customers' },
                      { name: 'NexG PrePaid Card', description: 'Prepaid card for controlled spending and online transactions' }
                    ]
                  },
                  {
                    category: 'Loans & Financing',
                    products: [
                      { name: 'Personal Financing / Financing‑i', description: 'Personal loan with flexible terms and Islamic financing option' },
                      { name: 'Term Financing‑i (ASB/ASB2)', description: 'Islamic financing for ASB and ASB2 investments' },
                      { name: 'AmMoneyLine / AmMoneyLine‑i', description: 'Overdraft facility with Islamic banking option' },
                      { name: 'Islamic and conventional auto financing', description: 'Vehicle financing with both conventional and Islamic options' },
                      { name: 'Home Loan Facility', description: 'Conventional home financing with competitive rates' },
                      { name: 'Home Link', description: 'Home equity financing using property as collateral' },
                      { name: 'PR1MA / SPEF', description: 'Specialized financing for PR1MA and SPEF properties' },
                      { name: 'Property Link', description: 'Property investment financing with flexible terms' },
                      { name: 'Term Financing‑i', description: 'Islamic term financing for various purposes' },
                      { name: 'Commercial Property Financing', description: 'Financing for commercial properties and business premises' },
                      { name: 'Skim Jaminan Kredit Perumahan', description: 'Housing credit guarantee scheme for first-time buyers' }
                    ]
                  },
                  {
                    category: 'Wealth Management & Investments',
                    products: [
                      { name: 'Unit Trusts via AmInvest', description: 'Professional managed unit trust funds with various risk profiles' },
                      { name: 'Direct Bond / Sukuk', description: 'Direct investment in bonds and Islamic sukuk instruments' },
                      { name: 'Dual Currency Investments', description: 'Investment products linked to currency movements' },
                      { name: 'Equities', description: 'Direct equity investment in Malaysian and international markets' },
                      { name: 'Smart Partnership Programme (SPP)', description: 'Partnership investment program with professional management' },
                      { name: 'Wealth Advisory Services', description: 'Professional wealth management and financial planning services' },
                      { name: 'AmPrivate Banking', description: 'Exclusive private banking services for high net worth individuals' },
                      { name: 'Priority Banking tiers', description: 'Tiered priority banking services with exclusive benefits' },
                      { name: 'Will / Wasiat writing', description: 'Professional will writing and Islamic wasiat services' },
                      { name: 'Legacy & estate planning', description: 'Comprehensive estate planning and legacy management services' }
                    ]
                  },
                  {
                    category: 'Insurance & Takaful',
                    products: [
                      { name: 'General Insurance (vehicle, travel, personal accident, home, business)', description: 'Comprehensive general insurance coverage for various needs' },
                      { name: 'Life Insurance (savings, protection, legacy, credit-linked)', description: 'Comprehensive life insurance with various coverage options' },
                      { name: 'Family Takaful (Islamic life/family coverage)', description: 'Shariah-compliant family protection and life coverage' }
                    ]
                  },
                  {
                    category: 'Corporate & Treasury Solutions',
                    products: [
                      { name: 'SME & Corporate Banking', description: 'Comprehensive banking services for SMEs and corporations' },
                      { name: 'Cash management', description: 'Advanced cash management solutions for businesses' },
                      { name: 'Trade finance', description: 'Comprehensive trade finance solutions for international business' },
                      { name: 'Payroll solutions', description: 'Comprehensive payroll and HR management solutions' },
                      { name: 'Business current accounts', description: 'Specialized current accounts for business operations' },
                      { name: 'Structured Products (autocallables, capital-protected notes, equity-linked investments, FX, dual currency investments)', description: 'Sophisticated investment products with various risk-return profiles' }
                    ]
                  }
                ].map((category, index) => (
                  <div key={index} style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '20px'
                  }}>
                    <h3 style={{ 
                      fontSize: '18px', 
                      fontWeight: '600', 
                      marginBottom: '16px', 
                      color: '#374151',
                      borderBottom: '1px solid #e5e7eb',
                      paddingBottom: '8px'
                    }}>
                      {category.category} Products
                    </h3>
                    <div style={{ display: 'grid', gap: '12px' }}>
                      {category.products.map((product, productIndex) => (
                        <div key={productIndex} style={{
                          background: '#f9fafb',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          padding: '16px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
                              {product.name}
                            </div>
                            <div style={{ fontSize: '12px', color: '#6b7280' }}>
                              {product.description}
                            </div>
                          </div>
                          <button style={{
                            background: '#222',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '8px 16px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontSize: '12px',
                            transition: 'background 0.2s ease'
                          }}
                          onMouseOver={(e) => e.target.style.background = '#000'}
                          onMouseOut={(e) => e.target.style.background = '#222'}
                          >
                            View Details
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CSS Animation */}
        <style>
          {`
            @keyframes slideDown {
              from {
                opacity: 0;
                transform: translateY(-10px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}
        </style>
      </div>
    </div>
  );
} 