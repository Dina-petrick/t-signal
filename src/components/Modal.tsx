import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="rsp-fixed rsp-inset-0 rsp-bg-black rsp-bg-opacity-50 rsp-flex rsp-items-center rsp-justify-center rsp-p-4 rsp-z-50">
      <div ref={modalRef} className="rsp-bg-white rsp-rounded-lg rsp-shadow-xl rsp-max-w-md rsp-w-full rsp-animate-modal-appear">
        <div className="rsp-flex rsp-items-center rsp-justify-between rsp-px-6 rsp-py-4 rsp-border-b">
          <h2 className="rsp-text-lg rsp-font-semibold rsp-text-gray-900 rsp-text-center rsp-w-full">{title}</h2>
          <button
            onClick={onClose}
            className="rsp-p-1 hover:rsp-bg-gray-100 rsp-rounded-full"
          >
            <X className="rsp-w-5 rsp-h-5 rsp-text-gray-500" />
          </button>
        </div>
        <div className="rsp-px-6 rsp-py-4">
          {children}
        </div>
      </div>
    </div>
  );
}