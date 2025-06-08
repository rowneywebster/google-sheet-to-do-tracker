import React from 'react';

const SectionCard = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-white shadow-xl rounded-lg overflow-hidden ${className}`}>
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
        <h2 className="text-xl font-semibold text-slate-800">{title}</h2>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default SectionCard;