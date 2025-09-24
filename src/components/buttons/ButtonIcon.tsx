import React from 'react';
import { Reply, Link, Phone, Workflow } from 'lucide-react';
import { Button } from '../../types';

export default function ButtonIcon({ type }: { type: Button['type'] }) {
  switch (type) {
    case 'QUICK_REPLY':
      return <Reply className="w-4 h-4" />;
    case 'URL':
      return <Link className="w-4 h-4" />;
    case 'CALL':
      return <Phone className="w-4 h-4" />;
    case 'FLOW':
      return <Workflow className="w-4 h-4" />;
    default:
      return null;
  }
}