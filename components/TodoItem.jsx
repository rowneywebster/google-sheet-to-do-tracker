import React from 'react';

const TodoItem = ({ todo, onToggleComplete, onDelete }) => {
  const { id, taskDescription, status, dueDate, skills } = todo;
  const isCompleted = status === 'Completed';

  return (
    <li
      className={`p-4 border border-slate-200 rounded-lg shadow-sm flex items-center justify-between transition-all duration-300 ease-in-out ${
        isCompleted ? 'bg-green-50' : 'bg-white hover:shadow-md'
      }`}
      aria-label={`Task: ${taskDescription}, Status: ${status}${dueDate ? `, Due: ${dueDate}` : ''}`}
    >
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          id={`todo-${id}`}
          checked={isCompleted}
          onChange={() => onToggleComplete(id)}
          className="h-5 w-5 text-sky-600 border-slate-300 rounded focus:ring-sky-500 cursor-pointer"
          aria-labelledby={`todo-label-${id}`}
        />
        <div>
          <label
            id={`todo-label-${id}`}
            htmlFor={`todo-${id}`}
            className={`block text-base font-medium cursor-pointer ${
              isCompleted ? 'strikethrough text-slate-500' : 'text-slate-800'
            }`}
          >
            {taskDescription}
          </label>
          {dueDate && (
            <p className={`text-xs ${isCompleted ? 'text-slate-400' : 'text-slate-500'}`}>
              Due: {new Date(dueDate).toLocaleDateString()}
            </p>
          )}
          {skills && skills.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {skills.map(skill => (
                <span key={skill} className="px-2 py-0.5 text-xs bg-sky-100 text-sky-700 rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      {onDelete && (
         <button 
            onClick={() => onDelete(id)} 
            className="text-red-500 hover:text-red-700 text-sm font-medium p-1 rounded hover:bg-red-100 transition-colors"
            aria-label={`Delete task: ${taskDescription}`}
          >
           🗑️
         </button>
      )}
    </li>
  );
};

export default TodoItem;