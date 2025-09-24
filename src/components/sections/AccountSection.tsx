import React from 'react';
import Section from './Section';
import { ApiCredentials } from '../../api/types';

type AccountProps = {
  account: ApiCredentials;
  setAccount: (account: ApiCredentials) => void;
};

export default function AccountSection({ account, setAccount }: AccountProps) {
  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedAccount = { 
      ...account, 
      [name]: value
    };
    setAccount(updatedAccount);
  };

  return (
    <Section title="Your Account">
      <div>
        <label className="rsp-block rsp-text-sm rsp-font-medium rsp-text-gray-700">API Key</label>
        <input
          type="password"
          name="apiKey"
          value={account.apiKey}
          onChange={handleAccountChange}
          className="rsp-mt-1 rsp-w-full rsp-px-3 rsp-py-2 rsp-border rsp-border-gray-300 rsp-rounded-md rsp-shadow-sm focus:rsp-ring-blue-500 focus:rsp-border-blue-500"
          placeholder="Enter your TrustSignal API key"
        />
      </div>
    </Section>
  );
}