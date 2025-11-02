import React from 'react';
import Button from './Button';

export interface Idea {
  title: string;
  description: string;
  earning_potential: string;
  time_commitment: string;
  skills: string[];
  first_steps: string[];
  confidence: number;
}

interface IdeaModalProps {
  idea: Idea | null;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (idea: Idea) => void;
  isSaved?: boolean;
}

const IdeaModal: React.FC<IdeaModalProps> = ({ idea, isOpen, onClose, onSave, isSaved = false }) => {
  if (!isOpen || !idea) return null;

  const handleSave = () => {
    if (onSave) {
      onSave(idea);
    }
  };

  const handleExportJSON = () => {
    const json = JSON.stringify(idea, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `side-hustle-${idea.title.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyToClipboard = async () => {
    const json = JSON.stringify(idea, null, 2);
    try {
      await navigator.clipboard.writeText(json);
      alert('Copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy to clipboard');
    }
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 4) return 'Excellent Match';
    if (confidence >= 3) return 'Good Match';
    return 'Fair Match';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 4) return 'bg-green-100 text-green-800';
    if (confidence >= 3) return 'bg-blue-100 text-blue-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      aria-label="Modal backdrop"
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-gray-200 pb-4">
            <div>
              <h3 id="modal-title" className="text-xl font-bold text-gray-900">{idea.title}</h3>
              <span className={`mt-2 inline-block px-3 py-1 text-xs font-medium rounded-full ${getConfidenceColor(idea.confidence)}`}>
                {getConfidenceLabel(idea.confidence)} Match
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Description */}
          <p className="text-gray-700">{idea.description}</p>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-600 mb-1">Earning Potential</p>
              <p className="text-lg font-bold text-green-600">{idea.earning_potential}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-600 mb-1">Time Commitment</p>
              <p className="text-lg font-bold text-gray-900">{idea.time_commitment}</p>
            </div>
          </div>

          {/* Skills */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Required Skills</h4>
            <div className="flex flex-wrap gap-2">
              {idea.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* First Steps */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">First Steps to Get Started</h4>
            <ol className="space-y-2">
              {idea.first_steps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-semibold">
                    {idx + 1}
                  </span>
                  <span className="text-gray-700 flex-1">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            {onSave && (
              <Button
                variant={isSaved ? 'outline' : 'primary'}
                onClick={handleSave}
                disabled={isSaved}
              >
                {isSaved ? '✓ Saved' : 'Save Idea'}
              </Button>
            )}
            <Button variant="outline" onClick={handleExportJSON}>
              Export JSON
            </Button>
            <Button variant="outline" onClick={handleCopyToClipboard}>
              Copy to Clipboard
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaModal;

