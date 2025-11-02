import React, { useMemo } from 'react';
import Button from './Button';

export interface SkillDetail {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  exp: number;
  related: string[];
  description?: string;
  suggestedActivities?: string[];
  careerMatches?: string[];
  pinned?: boolean;
}

interface SkillDetailModalProps {
  skill: SkillDetail | null;
  isOpen: boolean;
  onClose: () => void;
  onPin?: (skillId: string) => void;
  onMicroLearn?: (skillId: string) => void;
  isPinned?: boolean;
}

const SkillDetailModal: React.FC<SkillDetailModalProps> = ({
  skill,
  isOpen,
  onClose,
  onPin,
  onMicroLearn,
  isPinned = false,
}) => {
  const microLearns = useMemo(() => {
    if (skill?.suggestedActivities && skill.suggestedActivities.length > 0) {
      return skill.suggestedActivities;
    }
    return skill ? [
      `Complete ${skill.name} fundamentals tutorial`,
      `Build a project using ${skill.name}`,
      `Join ${skill.name} community and practice`,
    ] : [];
  }, [skill]);

  if (!isOpen || !skill) return null;

  return (
    <div
      className="fixed inset-0 bg-black/30 z-50 flex items-end justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      aria-label="Skill detail modal backdrop"
    >
      <div
        className="bg-white rounded-t-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto animate-fade-in-up transform translate-y-0"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-gray-200 pb-4">
            <div>
              <h3 id="modal-title" className="text-xl font-bold text-gray-900">{skill.name}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {skill.category} · {skill.exp} yrs exp · {skill.proficiency}% proficiency
              </p>
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

          {/* Actions */}
          <div className="flex gap-2">
            {onPin && (
              <Button
                variant={isPinned ? 'primary' : 'outline'}
                onClick={() => onPin(skill.id)}
              >
                {isPinned ? '✓ Pinned' : 'Pin Skill'}
              </Button>
            )}
            {onMicroLearn && (
              <Button
                variant="success"
                onClick={() => onMicroLearn(skill.id)}
              >
                MicroLearn +2
              </Button>
            )}
          </div>

          {/* Skill Summary */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Skill Summary</h4>
            <p className="text-sm text-gray-600 mb-3">
              {skill.description || `${skill.name} is a ${skill.category.toLowerCase()} skill with ${skill.proficiency}% proficiency.`}
            </p>
          </div>

          {/* Related Skills */}
          {skill.related && skill.related.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Related Skills</h4>
              <div className="flex flex-wrap gap-2">
                {skill.related.map((related, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                  >
                    {related}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Micro-Learning Suggestions */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">
              Micro-Learning Activities
            </h4>
            {microLearns.length > 0 ? (
              <ul className="list-disc list-inside space-y-1">
                {microLearns.map((activity, idx) => (
                  <li key={idx} className="text-xs text-gray-600">{activity}</li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-gray-500 italic">No suggestions available</p>
            )}
          </div>

          {/* Career Matches */}
          {skill.careerMatches && skill.careerMatches.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Career Matches</h4>
              <div className="flex flex-wrap gap-2">
                {skill.careerMatches.map((career, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-medium"
                  >
                    {career}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillDetailModal;

