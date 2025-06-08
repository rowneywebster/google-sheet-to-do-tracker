import React from 'react';

const SelectField = ({
  label,
  id,
  name,
  value,
  onChange,
  options,
  placeholder,
  required = false,
  className = '',
  error
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`mt-1 block w-full pl-3 pr-10 py-2 text-base bg-white border ${error ? 'border-red-500' : 'border-slate-300'} focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-md shadow-sm transition duration-150 ease-in-out`}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(option => (
          <option key={String(option.id)} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default SelectField;