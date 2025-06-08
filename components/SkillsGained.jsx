import React from 'react';

const SkillsGained = ({ completedTodos }) => {
  const skills = Array.from(
    new Set(
      completedTodos.flatMap(todo => todo.skills || [])
    )
  ).sort();

  if (skills.length === 0) {
    return (
      <div className="p-4 bg-white rounded-lg shadow">
        <h3 className="text-lg font-semibold text-slate-700 mb-2">Skills Gained</h3>
        <p className="text-sm text-slate-500">Complete tasks with associated skills to see them here.</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold text-slate-700 mb-3">Skills Gained</h3>
      <div className="flex flex-wrap gap-2">
        {skills.map(skill => (
          <span
            key={skill}
            className="px-3 py-1 bg-teal-100 text-teal-700 text-sm font-medium rounded-full shadow-sm"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SkillsGained;