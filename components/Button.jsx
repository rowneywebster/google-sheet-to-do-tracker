import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  className = '',
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed";
  
  let variantStyles = '';
  switch (variant) {
    case 'secondary':
      variantStyles = 'text-sky-700 bg-sky-100 hover:bg-sky-200 focus:ring-sky-500';
      break;
    case 'danger':
      variantStyles = 'text-white bg-red-600 hover:bg-red-700 focus:ring-red-500';
      break;
    case 'primary':
    default:
      variantStyles = 'text-white bg-sky-600 hover:bg-sky-700 focus:ring-sky-500';
      break;
  }

  return (
    <button
      {...props}
      className={`${baseStyles} ${variantStyles} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;