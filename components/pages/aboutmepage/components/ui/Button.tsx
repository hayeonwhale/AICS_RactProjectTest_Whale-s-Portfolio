import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
  asChild?: boolean;
}

const Button: React.FC<React.PropsWithChildren<ButtonProps>> = ({
  children,
  className,
  variant = 'default',
  asChild = false,
  ...props
}) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2";

  const variantClasses = {
    default: "bg-slate-900 text-slate-50 hover:bg-slate-900/90",
    outline: "border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900",
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className || ''}`;

  if (asChild && React.isValidElement(children)) {
     // FIX: The type of `children.props` was being inferred as `unknown`, which caused type errors.
     // This cast to `any` allows spreading its properties and accessing `className`.
     const childProps = children.props as any;
     return React.cloneElement(children, {
       ...childProps,
       className: `${combinedClasses} ${childProps.className || ''}`,
     });
  }

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
};

export { Button };
