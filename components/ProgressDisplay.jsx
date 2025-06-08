import React from 'react';

const ProgressDisplay = ({ todos }) => {
  const totalTasks = todos.length;
  const completedTasks = todos.filter(todo => todo.status === 'Completed').length;
  const pendingTasks = totalTasks - completedTasks;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold text-slate-700 mb-3">Progress Overview</h3>
      <div className="space-y-2">
        <p>Total Tasks: <span className="font-bold">{totalTasks}</span></p>
        <p>Completed: <span className="font-bold text-green-600">{completedTasks}</span></p>
        <p>Pending: <span className="font-bold text-orange-600">{pendingTasks}</span></p>
      </div>
      {totalTasks > 0 && (
        <div className="mt-3">
          <div className="w-full bg-slate-200 rounded-full h-2.5">
            <div
              className="bg-sky-500 h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
              aria-valuenow={progressPercentage}
              aria-valuemin={0}
              aria-valuemax={100}
            ></div>
          </div>
          <p className="text-right text-sm text-slate-600 mt-1">{progressPercentage}% Complete</p>
        </div>
      )}
    </div>
  );
};

export default ProgressDisplay;