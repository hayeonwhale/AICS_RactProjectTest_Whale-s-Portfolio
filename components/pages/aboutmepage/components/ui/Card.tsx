
import React from 'react';

const Card = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`bg-white text-slate-950 rounded-lg border border-slate-200 shadow-sm ${className}`} {...props}>
    {children}
  </div>
);

const CardContent = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`${className}`} {...props}>
    {children}
  </div>
);

export { Card, CardContent };
