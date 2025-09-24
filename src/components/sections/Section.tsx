import React, { ReactNode } from 'react';

type SectionProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export default function Section({ title, subtitle, children }: SectionProps) {
  return (
    <div className="rsp-bg-white rsp-rounded-lg rsp-shadow-sm rsp-border rsp-border-gray-200">
      <div className="rsp-p-6 rsp-border-b rsp-border-gray-200">
        <h2 className="rsp-text-lg rsp-font-semibold rsp-text-gray-900">{title}</h2>
        {subtitle && <p className="rsp-mt-1 rsp-text-sm rsp-text-gray-500">{subtitle}</p>}
      </div>
      <div className="rsp-p-6">
        {children}
      </div>
    </div>
  );
}