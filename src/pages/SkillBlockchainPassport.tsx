import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '../contexts/ToastContext';

// TODO: connect blockchain registry API
// TODO: upload certificate verification flow
// TODO: wallet export / QR generation

interface SkillRecord {
  id: string;
  title: string;
  issuer: string;
  date: string;
  levelBadge: 'EXPERT' | 'ADVANCED' | 'INTERMEDIATE' | 'BEGINNER';
  status: 'Verified' | 'Pending' | 'Expired';
  txHash: string;
}

interface VerificationLog {
  id: string;
  action: string;
  timestamp: string;
}

const SkillBlockchainPassport: React.FC = () => {
  const [skills, setSkills] = useState<SkillRecord[]>([
    {
      id: '1',
      title: 'Python Programming',
      issuer: 'Coursera',
      date: 'Apr 2023',
      levelBadge: 'EXPERT',
      status: 'Verified',
      txHash: '0x34a5f8c9e2d1b7a3f9e8c6d4b2a1f7e9c5d3b1a8f4e2c9d7b5a3f1e8c6d4b9f',
    },
    {
      id: '2',
      title: 'Data Analysis',
      issuer: 'DataCamp',
      date: 'Mar 2023',
      levelBadge: 'ADVANCED',
      status: 'Verified',
      txHash: '0x7b8c9d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b',
    },
    {
      id: '3',
      title: 'Network Security',
      issuer: 'Udacity',
      date: 'Nov 2022',
      levelBadge: 'INTERMEDIATE',
      status: 'Verified',
      txHash: '0x9f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2',
    },
    {
      id: '4',
      title: 'Machine Learning',
      issuer: 'edX',
      date: 'Jan 2024',
      levelBadge: 'ADVANCED',
      status: 'Pending',
      txHash: '0x2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c',
    },
  ]);

  const [publicRecord, setPublicRecord] = useState<boolean>(false);
  const [recipient, setRecipient] = useState<string>('');
  const [skillInput, setSkillInput] = useState<string>('');
  const [selectedVerification, setSelectedVerification] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showSuccess, showInfo, showError } = useToast();

  // Verification log data
  const verificationLog: VerificationLog[] = [
    { id: '1', action: 'Verified Application Security from Microsoft', timestamp: '2 days ago' },
    { id: '2', action: 'Verified AWS Fundamentals from AWS', timestamp: '1 week ago' },
    { id: '3', action: 'Verified React Development from Meta', timestamp: '2 weeks ago' },
    { id: '4', action: 'Verified Kubernetes Administration from CNCF', timestamp: '3 weeks ago' },
  ];

  // Format blockchain hash (mask middle)
  const formatTxHash = (hash: string): string => {
    if (hash.length <= 10) return hash;
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  // Generate mock transaction hash
  const generateMockTxHash = (): string => {
    const chars = '0123456789abcdef';
    let hash = '0x';
    for (let i = 0; i < 64; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
  };

  // Get level badge color
  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'EXPERT':
        return 'bg-green-100 text-green-800';
      case 'ADVANCED':
        return 'bg-blue-100 text-blue-800';
      case 'INTERMEDIATE':
        return 'bg-yellow-100 text-yellow-800';
      case 'BEGINNER':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Verified':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // TODO: integrate real verification pipeline
      console.log('File uploaded:', file.name);
      
      // Generate new skill record from file
      const newSkill: SkillRecord = {
        id: Date.now().toString(),
        title: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        issuer: 'Manual Upload',
        date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        levelBadge: 'INTERMEDIATE',
        status: 'Pending',
        txHash: generateMockTxHash(),
      };

      setSkills([newSkill, ...skills]);
      showSuccess('File Uploaded', 'Skill record added (pending verification)');
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Handle issue credential
  const handleIssueCredential = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!recipient.trim() || !skillInput.trim()) {
      showError('Validation Error', 'Please fill in all fields');
      return;
    }

    // TODO: integrate blockchain registry API
    console.log('Issue credential:', { recipient, skill: skillInput, publicRecord });

    const newSkill: SkillRecord = {
      id: Date.now().toString(),
      title: skillInput,
      issuer: recipient,
      date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      levelBadge: 'INTERMEDIATE',
      status: 'Pending',
      txHash: generateMockTxHash(),
    };

    setSkills([newSkill, ...skills]);
    showSuccess('Credential Issued', 'New credential added (pending verification)');
    
    // Reset form
    setRecipient('');
    setSkillInput('');
    
    // Show QR modal placeholder
    showInfo('QR Code', 'QR code generation coming soon');
  };

  // Handle export wallet
  const handleExportWallet = () => {
    // TODO: integrate wallet export / download
    console.log('Export wallet:', { skills, publicRecord });
    alert('Export Wallet placeholder - connect to wallet export API');
    showInfo('Wallet Export', 'Wallet export functionality coming soon');
  };

  // Handle verification log click
  const handleVerificationClick = (id: string) => {
    setSelectedVerification(id);
  };

  // Close modals on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedVerification) {
        setSelectedVerification(null);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [selectedVerification]);

  // Calculate verifications count for this month
  const verificationsThisMonth = verificationLog.filter((v) => {
    // Simple check - assume recent entries are this month
    return v.id === '1' || v.id === '2';
  }).length;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Skill Blockchain Passport</h1>
          <p className="text-gray-600 max-w-2xl">
            Securely verified skills and achievements.
          </p>
        </div>
        <button
          onClick={handleExportWallet}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 whitespace-nowrap"
          aria-label="Export wallet"
        >
          Export Wallet
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column - Upload & Info */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          {/* Upload Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Upload</h2>
            <p className="text-sm text-gray-600">
              Upload a verified skill document to add to your blockchain-secure record.
            </p>
            
            <div>
              <input
                ref={fileInputRef}
                type="file"
                id="file-upload"
                onChange={handleFileUpload}
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                aria-label="Select file to upload"
              />
              <label
                htmlFor="file-upload"
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
              >
                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm text-gray-700">Select File</span>
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="public-record"
                checked={publicRecord}
                onChange={(e) => setPublicRecord(e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                aria-label="Make record public"
              />
              <label htmlFor="public-record" className="ml-2 text-sm text-gray-700 cursor-pointer">
                Public Record
              </label>
            </div>
          </div>

          {/* Key Features Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h2>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="mr-2 text-primary-600">•</span>
                <span>Create and issue a verifiable credential</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary-600">•</span>
                <span>Blockchain-secured skill verification</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary-600">•</span>
                <span>Tamper-proof skill records</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary-600">•</span>
                <span>Portable digital credentials</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Center Column - Skill Records & Verifications */}
        <div className="col-span-12 lg:col-span-6 space-y-6">
          {/* Skill Records Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Skill Records</h2>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                {skills.length} Total Records
              </span>
            </div>

            <div className="space-y-4">
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{skill.title}</h3>
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getLevelBadgeColor(skill.levelBadge)}`}>
                          {skill.levelBadge}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusBadgeColor(skill.status)}`}>
                          {skill.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span>{skill.issuer} • {skill.date}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Blockchain Hash */}
                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 font-mono">TX:</span>
                      <span className="text-xs text-gray-600 font-mono">{formatTxHash(skill.txHash)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Verifications Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Verifications</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{verificationsThisMonth}</p>
                <p className="text-sm text-gray-600">This Month</p>
              </div>
              <div className="flex-1 max-w-xs ml-4">
                {/* Sparkline chart */}
                <svg width="100%" height="40" viewBox="0 0 100 40" className="overflow-visible">
                  <polyline
                    points="0,30 10,25 20,28 30,20 40,22 50,18 60,15 70,12 80,10 90,8 100,5"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="100" cy="5" r="2" fill="#3b82f6" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Issue Credential & Verification Log */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          {/* Issue New Credential Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Issue New Credential</h2>
            <p className="text-sm text-gray-600">
              Create and issue a new verifiable credential for yourself or others.
            </p>

            <form onSubmit={handleIssueCredential} className="space-y-4">
              <div>
                <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient
                </label>
                <input
                  type="text"
                  id="recipient"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter recipient name"
                  aria-label="Recipient name"
                />
              </div>

              <div>
                <label htmlFor="skill" className="block text-sm font-medium text-gray-700 mb-2">
                  Skill
                </label>
                <input
                  type="text"
                  id="skill"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter skill name"
                  aria-label="Skill name"
                />
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                aria-label="Issue credential"
              >
                Issue Credential
              </button>
            </form>
          </div>

          {/* Verification Log Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Verification Log</h2>
            <div className="space-y-3">
              {verificationLog.slice(0, 4).map((log) => (
                <div
                  key={log.id}
                  onClick={() => handleVerificationClick(log.id)}
                  className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleVerificationClick(log.id);
                    }
                  }}
                  aria-label={`View details for ${log.action}`}
                >
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{log.action}</p>
                    <p className="text-xs text-gray-500 mt-1">{log.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Verification Details Modal */}
      {selectedVerification && (
        <div
          className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedVerification(null)}
          aria-label="Verification details modal backdrop"
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="verification-modal-title"
          >
            {(() => {
              const log = verificationLog.find((l) => l.id === selectedVerification);
              if (!log) return null;

              return (
                <div className="p-6 space-y-6">
                  {/* Header */}
                  <div className="flex items-start justify-between border-b border-gray-200 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 id="verification-modal-title" className="text-xl font-bold text-gray-900">
                          Verification Details
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">{log.timestamp}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedVerification(null)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label="Close modal"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Details */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Verification</h4>
                      <p className="text-gray-700">{log.action}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Transaction Hash</h4>
                      <p className="text-sm text-gray-600 font-mono">
                        {generateMockTxHash()}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Status</h4>
                      <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        Verified
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => {
                        showSuccess('Certificate Downloaded', 'Verification certificate saved');
                        setSelectedVerification(null);
                      }}
                      className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                      aria-label="Download certificate"
                    >
                      Download Certificate
                    </button>
                    <button
                      onClick={() => setSelectedVerification(null)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                      aria-label="Close modal"
                    >
                      Close
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillBlockchainPassport;

