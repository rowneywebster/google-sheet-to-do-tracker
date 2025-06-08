import React from 'react';

const CheckboxGroup = ({
  label,
  options,
  selectedValues,
  onChange,
  className = '',
}) => {
  return (
    <fieldset className={`mb-4 ${className}`}>
      <legend className="block text-sm font-medium text-slate-700 mb-2">{label}</legend>
      <div className="space-y-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2">
        {options.map((option) => (
          <div key={String(option.id)} className="flex items-center">
            <input
              id={String(option.id)}
              name={String(option.id)}
              type="checkbox"
              checked={selectedValues.includes(option.id)}
              onChange={(e) => onChange(option.id, e.target.checked)}
              className="h-4 w-4 text-sky-600 border-slate-300 rounded focus:ring-sky-500 transition duration-150 ease-in-out"
            />
            <label htmlFor={String(option.id)} className="ml-2 block text-sm text-slate-800">
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </fieldset>
  );
};

export default CheckboxGroup;