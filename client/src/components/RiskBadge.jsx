import React from 'react';

const RiskBadge = ({ level }) => {
  const labels = { normal: 'Normal', suspicious: 'Suspicious', high_risk: 'High Risk' };
  return <span className={`badge ${level}`}>{labels[level] || level}</span>;
};

export default RiskBadge;
