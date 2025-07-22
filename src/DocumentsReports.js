import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function DocumentsReports() {
  const { nric } = useParams();
  const [documents, setDocuments] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('documents');

  useEffect(() => {
    // Simulate loading documents and reports
    setTimeout(() => {
      setDocuments([
        {
          id: 1,
          name: 'Client Agreement Form',
          type: 'Contract',
          status: 'Signed',
          uploadedAt: '2024-01-15',
          size: '2.3 MB',
          category: 'Legal'
        },
        {
          id: 2,
          name: 'Income Verification',
          type: 'Document',
          status: 'Pending',
          uploadedAt: '2024-01-14',
          size: '1.1 MB',
          category: 'Financial'
        },
        {
          id: 3,
          name: 'Risk Assessment Form',
          type: 'Form',
          status: 'Completed',
          uploadedAt: '2024-01-13',
          size: '856 KB',
          category: 'Assessment'
        }
      ]);

      setReports([
        {
          id: 1,
          name: 'Financial Health Report',
          type: 'Analysis',
          generatedAt: '2024-01-15',
          status: 'Ready',
          category: 'Financial'
        },
        {
          id: 2,
          name: 'Investment Portfolio Summary',
          type: 'Report',
          generatedAt: '2024-01-14',
          status: 'Ready',
          category: 'Investment'
        },
        {
          id: 3,
          name: 'Risk Profile Assessment',
          type: 'Analysis',
          generatedAt: '2024-01-13',
          status: 'Processing',
          category: 'Assessment'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, [nric]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const newDocument = {
        id: documents.length + 1,
        name: file.name,
        type: 'Document',
        status: 'Pending',
        uploadedAt: new Date().toISOString().split('T')[0],
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        category: 'Uploaded'
      };
      setDocuments([newDocument, ...documents]);
    }
  };

  const generateReport = () => {
    const newReport = {
      id: reports.length + 1,
      name: `Financial Report ${reports.length + 1}`,
      type: 'Report',
      generatedAt: new Date().toISOString().split('T')[0],
      status: 'Processing',
      category: 'Financial'
    };
    setReports([newReport, ...reports]);
    
    // Simulate processing
    setTimeout(() => {
      setReports(prev => prev.map(r => 
        r.id === newReport.id ? { ...r, status: 'Ready' } : r
      ));
    }, 3000);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex' }}>
        <Sidebar clientId={nric} />
        <div style={{ flex: 1, padding: '32px', marginLeft: '240px' }}>
          <div style={{ textAlign: 'center', padding: '48px' }}>
            <div style={{ fontSize: '18px', color: '#666' }}>Loading documents and reports...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar clientId={nric} />
      <div style={{ flex: 1, padding: '32px', marginLeft: '240px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
            Documents & Reports
          </h1>
          <p style={{ color: '#666', fontSize: '16px' }}>
            Manage client documents and generate financial reports
          </p>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', marginBottom: '24px', borderBottom: '1px solid #e5e7eb' }}>
          <button
            onClick={() => setActiveTab('documents')}
            style={{
              background: 'none',
              border: 'none',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: activeTab === 'documents' ? '600' : '400',
              color: activeTab === 'documents' ? '#222' : '#666',
              borderBottom: activeTab === 'documents' ? '2px solid #222' : '2px solid transparent',
              cursor: 'pointer'
            }}
          >
            Documents ({documents.length})
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            style={{
              background: 'none',
              border: 'none',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: activeTab === 'reports' ? '600' : '400',
              color: activeTab === 'reports' ? '#222' : '#666',
              borderBottom: activeTab === 'reports' ? '2px solid #222' : '2px solid transparent',
              cursor: 'pointer'
            }}
          >
            Reports ({reports.length})
          </button>
        </div>

        {activeTab === 'documents' && (
          <div>
            {/* Upload Section */}
            <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', border: '1px solid #e5e7eb', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>Upload Documents</h2>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                <label
                  htmlFor="file-upload"
                  style={{
                    background: '#222',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Choose File
                </label>
                <span style={{ color: '#666', fontSize: '14px' }}>
                  Supported formats: PDF, DOC, DOCX, JPG, PNG
                </span>
              </div>
            </div>

            {/* Documents List */}
            <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', border: '1px solid #e5e7eb' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>All Documents</h2>
              <div style={{ display: 'grid', gap: '16px' }}>
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '16px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      background: '#f9fafb'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        background: '#e5e7eb',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px'
                      }}>
                        📄
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>
                          {doc.name}
                        </div>
                        <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#666' }}>
                          <span>{doc.category}</span>
                          <span>{doc.size}</span>
                          <span>Uploaded: {doc.uploadedAt}</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        background: doc.status === 'Signed' ? '#dcfce7' : doc.status === 'Completed' ? '#dbeafe' : '#fef3c7',
                        color: doc.status === 'Signed' ? '#166534' : doc.status === 'Completed' ? '#1e40af' : '#92400e',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {doc.status}
                      </div>
                      <button style={{
                        background: '#f3f4f6',
                        color: '#374151',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        padding: '8px 16px',
                        fontSize: '14px',
                        cursor: 'pointer'
                      }}>
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div>
            {/* Generate Report Section */}
            <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', border: '1px solid #e5e7eb', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>Generate New Report</h2>
              <button
                onClick={generateReport}
                style={{
                  background: '#222',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Generate Financial Report
              </button>
            </div>

            {/* Reports List */}
            <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', border: '1px solid #e5e7eb' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>All Reports</h2>
              <div style={{ display: 'grid', gap: '16px' }}>
                {reports.map((report) => (
                  <div
                    key={report.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '16px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      background: '#f9fafb'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        background: '#e5e7eb',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px'
                      }}>
                        📊
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>
                          {report.name}
                        </div>
                        <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#666' }}>
                          <span>{report.category}</span>
                          <span>{report.type}</span>
                          <span>Generated: {report.generatedAt}</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        background: report.status === 'Ready' ? '#dcfce7' : '#fef3c7',
                        color: report.status === 'Ready' ? '#166534' : '#92400e',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {report.status}
                      </div>
                      {report.status === 'Ready' && (
                        <button style={{
                          background: '#222',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '8px 16px',
                          fontSize: '14px',
                          cursor: 'pointer'
                        }}>
                          Download
                        </button>
                      )}
                      {report.status === 'Processing' && (
                        <div style={{ fontSize: '12px', color: '#666' }}>Processing...</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 