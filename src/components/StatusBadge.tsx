import React from 'react';
import { RiskLevel } from '../types';
import { CheckCircle2, AlertTriangle, AlertOctagon } from 'lucide-react';

interface Props {
  level: RiskLevel;
  text?: string;
  showIcon?: boolean;
}

export const StatusBadge: React.FC<Props> = ({ level, text, showIcon = true }) => {
  const label = text || (level === 'green' ? 'Nominal' : level === 'yellow' ? 'Caution' : 'Critical Alert');

  return (
    <span className={`status-badge ${level}`}>
      {showIcon && (
        <>
          {level === 'green' && <CheckCircle2 size={13} />}
          {level === 'yellow' && <AlertTriangle size={13} />}
          {level === 'red' && <AlertOctagon size={13} />}
        </>
      )}
      <span>{label}</span>
    </span>
  );
};

