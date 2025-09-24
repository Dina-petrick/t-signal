import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTemplateList } from '../../api/templates/list';
import { ApiCredentials, TemplateListResponse } from '../../api/types';
import { AlertCircle, X } from 'lucide-react';
import Modal from '../Modal';

export default function MessageTemplatesDashboard() {
  const navigate = useNavigate();
  const [allTemplates, setAllTemplates] = useState<TemplateListResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Account credentials
  const [account, setAccount] = useState<ApiCredentials>(() => {
    const savedAccount = localStorage.getItem('account');
    return savedAccount ? JSON.parse(savedAccount) : {
      apiKey: ''
    };
  });
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [languageFilter, setLanguageFilter] = useState('all');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  
  // Media modal state
  const [mediaModal, setMediaModal] = useState<{
    isOpen: boolean;
    url?: string;
    templateName?: string;
  }>({ isOpen: false });

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setError(null);
        setLoading(true);
        setAllTemplates([]); // Clear templates when credentials change
        
        if (!account.apiKey) {
          setError("Please enter your TrustSignal API key");
          setLoading(false);
          return;
        }

        const response = await getTemplateList(account, {
          limit: 1000
        });

        if (response.status === 'error') {
          throw new Error(response.message);
        }

        setAllTemplates(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch templates');
        setAllTemplates([]); // Clear templates on error
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, [account]);

  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedAccount = { 
      ...account, 
      [name]: value
    };
    
    setAccount(updatedAccount);
    localStorage.setItem('account', JSON.stringify(updatedAccount));
  };

  const openMediaModal = (url: string, templateName: string) => {
    setMediaModal({
      isOpen: true,
      url,
      templateName
    });
  };

  const closeMediaModal = () => {
    setMediaModal({ isOpen: false });
  };

  // Filter templates based on search and filters
  const filteredTemplates = allTemplates.filter(template => {
    const trimmedQuery = searchQuery.trim();
    const lowerCaseQuery = trimmedQuery.toLowerCase();

    // Corrected search logic for both ID and Name (partial match)
    const matchesSearch = trimmedQuery === '' || 
      (template.id.toString().includes(trimmedQuery)) ||
      (template.name.toLowerCase().includes(lowerCaseQuery));

    const matchesStatus = statusFilter === 'all' || 
      template.status.toLowerCase() === statusFilter.toLowerCase();

    const matchesCategory = categoryFilter === 'all' || 
      template.category.toLowerCase() === categoryFilter.toLowerCase();

    const matchesLanguage = languageFilter === 'all' || 
      template.language.toLowerCase().startsWith(languageFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesCategory && matchesLanguage;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredTemplates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTemplates = filteredTemplates.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="rsp-flex rsp-items-center rsp-justify-center rsp-min-h-screen">
        <div className="rsp-text-lg rsp-text-gray-600">Loading templates...</div>
      </div>
    );
  }

  return (
    <div className="rsp-container rsp-mx-auto rsp-px-4 rsp-py-8">
      <div className="rsp-flex rsp-justify-between rsp-items-center rsp-mb-6">
        <h1 className="rsp-text-2xl rsp-font-bold">Whatsapp HSM Templates</h1>
        <button
          onClick={() => navigate('/create')}
          className="rsp-bg-blue-600 rsp-text-white rsp-px-4 rsp-py-2 rsp-rounded-md hover:rsp-bg-blue-700"
        >
          Create Template
        </button>
      </div>

      {/* Account Credentials */}
      <div className="rsp-bg-white rsp-p-4 rsp-pl-0 rsp-rounded-lg rsp-shadow-sm rsp-mb-6">
        <div>
          <label className="rsp-block rsp-text-sm rsp-font-medium rsp-text-gray-700 rsp-mb-1">
            TrustSignal API Key
          </label>
          <div className="rsp-relative">
            <input
              type="password"
              name="apiKey"
              value={account.apiKey}
              onChange={handleAccountChange}
              className="rsp-w-full rsp-px-0 rsp-py-2 rsp-border-0 rsp-border-b rsp-border-gray-300 rsp-text-sm focus:rsp-outline-none focus:rsp-border-blue-500 rsp-bg-transparent"
              placeholder="Enter your TrustSignal API key"
            />
            <div className="rsp-absolute rsp-bottom-0 rsp-left-0 rsp-w-4 rsp-h-0.5 rsp-bg-red-500"></div>
          </div>
        </div>
      </div>

      {error && (
        <div className="rsp-bg-red-50 rsp-border-l-4 rsp-border-red-500 rsp-p-4 rsp-mb-6">
          <div className="rsp-flex">
            <div className="rsp-flex-shrink-0">
              <AlertCircle className="rsp-h-5 rsp-w-5 rsp-text-red-400" />
            </div>
            <div className="rsp-ml-3">
              <p className="rsp-text-sm rsp-text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="rsp-mb-6">
        <div className="rsp-relative">
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rsp-w-full rsp-px-0 rsp-py-3 rsp-border-0 rsp-border-b rsp-border-gray-300 rsp-text-sm focus:rsp-outline-none focus:rsp-border-blue-500 rsp-bg-transparent"
          />
        </div>
      </div>

      {/* Templates Table */}
      <div className="rsp-bg-white rsp-rounded-lg rsp-shadow-sm rsp-border rsp-border-gray-200 rsp-overflow-hidden">
        <div className="rsp-overflow-x-auto">
          <table className="rsp-min-w-full">
            <thead>
              <tr className="rsp-bg-blue-600 rsp-text-white">
                <th className="rsp-px-6 rsp-py-3 rsp-text-left rsp-text-sm rsp-font-medium">
                  ID
                </th>
                <th className="rsp-px-6 rsp-py-3 rsp-text-left rsp-text-sm rsp-font-medium">
                  Name
                </th>
                <th className="rsp-px-6 rsp-py-3 rsp-text-left rsp-text-sm rsp-font-medium">
                  <div className="rsp-flex rsp-items-center rsp-justify-between">
                    <span>Category</span>
                    <div className="rsp-flex rsp-items-center">
                      <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="rsp-cursor-pointer rsp-ml-2 rsp-bg-transparent rsp-text-white rsp-border-0 rsp-text-sm focus:rsp-outline-none "
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value="all" className="rsp-text-gray-900">All</option>
                        <option value="utility" className="rsp-text-gray-900">Utility</option>
                        <option value="marketing" className="rsp-text-gray-900">Marketing</option>
                      </select>
                    </div>
                  </div>
                </th>
                <th className="rsp-px-6 rsp-py-3 rsp-text-left rsp-text-sm rsp-font-medium">
                  <div className="rsp-flex rsp-items-center rsp-justify-between">
                    <span>Language</span>
                  </div>
                </th>
                <th className="rsp-px-6 rsp-py-3 rsp-text-left rsp-text-sm rsp-font-medium">
                  Type
                </th>
                <th className="rsp-px-6 rsp-py-3 rsp-text-left rsp-text-sm rsp-font-medium">
                  <div className="rsp-flex rsp-items-center rsp-justify-between">
                    <span>Status</span>
                    <div className="rsp-flex rsp-items-center">
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="rsp-cursor-pointer rsp-ml-2 rsp-bg-transparent rsp-text-white rsp-border-0 rsp-text-sm focus:rsp-outline-none"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value="all" className="rsp-text-gray-900">All</option>
                        <option value="pending" className="rsp-text-gray-900">Pending</option>
                        <option value="approved" className="rsp-text-gray-900">Approved</option>
                        <option value="rejected" className="rsp-text-gray-900">Rejected</option>
                      </select>
                    </div>
                  </div>
                </th>
                <th className="rsp-px-6 rsp-py-3 rsp-text-left rsp-text-sm rsp-font-medium">
                  Created
                </th>
                <th className="rsp-px-6 rsp-py-3 rsp-text-left rsp-text-sm rsp-font-medium">
                  Updated
                </th>
                <th className="rsp-px-6 rsp-py-3 rsp-text-left rsp-text-sm rsp-font-medium">
                  Media
                </th>
              </tr>
            </thead>
            <tbody>
              {currentTemplates.length > 0 ? (
                currentTemplates.map((template, index) => (
                  <tr 
                    key={template.id} 
                    className={`rsp-border-b rsp-border-gray-200 ${
                      index % 2 === 0 ? 'rsp-bg-white' : 'rsp-bg-blue-50'
                    } hover:rsp-bg-blue-100 rsp-transition-colors`}
                  >
                    <td className="rsp-px-6 rsp-py-4 rsp-text-sm rsp-text-gray-900">{template.id}</td>
                    <td className="rsp-px-6 rsp-py-4 rsp-text-sm rsp-text-gray-900 rsp-font-medium">{template.name}</td>
                    <td className="rsp-px-6 rsp-py-4 rsp-text-sm rsp-text-gray-700 rsp-capitalize">{template.category}</td>
                    <td className="rsp-px-6 rsp-py-4 rsp-text-sm rsp-text-gray-700">{template.language}</td>
                    <td className="rsp-px-6 rsp-py-4 rsp-text-sm rsp-text-gray-700">{template.type}</td>
                    <td className="rsp-px-6 rsp-py-4">
                      <span className={`rsp-inline-flex rsp-px-3 rsp-py-1 rsp-rounded-full rsp-text-xs rsp-font-medium
                        ${template.status.toLowerCase() === 'approved'
                          ? 'rsp-bg-green-100 rsp-text-green-800' 
                          : template.status.toLowerCase() === 'rejected'
                          ? 'rsp-bg-red-100 rsp-text-red-800'
                          : 'rsp-bg-yellow-100 rsp-text-yellow-800'
                        }`}>
                        {template.status}
                      </span>
                    </td>
                    <td className="rsp-px-6 rsp-py-4 rsp-text-sm rsp-text-gray-700">
                      {template.creation_time ? new Date(template.creation_time).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="rsp-px-6 rsp-py-4 rsp-text-sm rsp-text-gray-700">
                      {template.updation_time ? new Date(template.updation_time).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="rsp-px-6 rsp-py-4 rsp-text-sm rsp-text-gray-700">
                      {template.medialist?.header ? (
                        <button
                          onClick={() => openMediaModal(template.medialist.header!, template.name)}
                          className="rsp-inline-flex rsp-items-center rsp-px-3 rsp-py-1 rsp-rounded rsp-text-xs rsp-font-medium rsp-bg-blue-100 rsp-text-blue-800 hover:rsp-bg-blue-200 rsp-transition-colors"
                        >
                          <svg className="rsp-w-3 rsp-h-3 rsp-mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span>View Media</span>
                        </button>
                      ) : (
                        <span className="rsp-inline-flex rsp-px-2 rsp-py-1 rsp-rounded-full rsp-text-xs rsp-font-medium rsp-bg-gray-100 rsp-text-gray-800">
                          No Media
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="rsp-px-6 rsp-py-8 rsp-text-center rsp-text-gray-500">
                    No templates found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {currentTemplates.length > 0 && (
        <div className="rsp-flex rsp-justify-between rsp-items-center rsp-mt-6 rsp-px-6 rsp-py-4 rsp-bg-white rsp-rounded-lg rsp-shadow-sm rsp-border rsp-border-gray-200">
          <div className="rsp-text-sm rsp-text-gray-700">
            Showing <span className="rsp-font-medium">{startIndex + 1}</span> to <span className="rsp-font-medium">{Math.min(endIndex, filteredTemplates.length)}</span> of <span className="rsp-font-medium">{filteredTemplates.length}</span> results
          </div>
          <div className="rsp-flex rsp-gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="rsp-px-4 rsp-py-2 rsp-text-sm rsp-font-medium rsp-text-gray-700 rsp-bg-white rsp-border rsp-border-gray-300 rsp-rounded-md hover:rsp-bg-gray-50 disabled:rsp-opacity-50 disabled:rsp-cursor-not-allowed rsp-transition-colors"
            >
              Previous
            </button>
            <span className="rsp-px-4 rsp-py-2 rsp-text-sm rsp-font-medium rsp-text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="rsp-px-4 rsp-py-2 rsp-text-sm rsp-font-medium rsp-text-gray-700 rsp-bg-white rsp-border rsp-border-gray-300 rsp-rounded-md hover:rsp-bg-gray-50 disabled:rsp-opacity-50 disabled:rsp-cursor-not-allowed rsp-transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Media Modal */}
      <Modal
        isOpen={mediaModal.isOpen}
        onClose={closeMediaModal}
        title={`Media - ${mediaModal.templateName || 'Template'}`}
      >
        <div className="rsp-space-y-4">
          {mediaModal.url && (
            <div className="rsp-text-center">
              {/* Media Preview */}
              <div className="rsp-relative rsp-bg-gray-50 rsp-rounded-lg rsp-p-4 rsp-min-h-[200px] rsp-flex rsp-items-center rsp-justify-center">
                <img 
                  src={mediaModal.url} 
                  alt="Template media"
                  className="rsp-max-w-full rsp-max-h-[400px] rsp-mx-auto rsp-rounded-lg rsp-shadow-md rsp-object-contain"
                  onLoad={(e) => {
                    const loadingDiv = e.currentTarget.parentElement?.querySelector('.loading-placeholder');
                    if (loadingDiv) loadingDiv.style.display = 'none';
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const errorDiv = e.currentTarget.parentElement?.querySelector('.error-placeholder');
                    if (errorDiv) errorDiv.style.display = 'block';
                  }}
                />
                
                {/* Loading placeholder */}
                {loading &&
                  <div className="loading-placeholder rsp-absolute rsp-inset-0 rsp-flex rsp-items-center rsp-justify-center">
                    <div className="rsp-text-gray-500 rsp-text-sm">Loading media...</div>
                  </div>
                }
                
                {/* Error placeholder */}
                <div className="error-placeholder rsp-absolute rsp-inset-0 rsp-flex rsp-flex-col rsp-items-center rsp-justify-center" style={{ display: 'none' }}>
                  <svg className="rsp-w-[100%] rsp-h-12 rsp-text-gray-400 rsp-m-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="rsp-text-gray-500 rsp-text-sm rsp-mb-2">Load media on new tab</p>
                </div>
              </div>
              
              {/* Media URL Info */}
              <div className="rsp-mt-4 rsp-p-3 rsp-bg-gray-50 rsp-rounded-lg">
                <p className="rsp-text-xs rsp-text-gray-600 rsp-mb-1">Media URL:</p>
                <p className="rsp-text-xs rsp-text-gray-800 rsp-break-all rsp-font-mono">
                  {mediaModal.url}
                </p>
              </div>
            </div>
          )}
          <div className="rsp-flex rsp-justify-end rsp-pt-4">
            <a 
              href={mediaModal.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="rsp-inline-flex rsp-items-center rsp-px-4 rsp-py-2 rsp-bg-blue-600 rsp-text-white rsp-text-sm rsp-font-medium rsp-rounded-md hover:rsp-bg-blue-700 rsp-transition-colors"
            >
              <svg className="rsp-w-4 rsp-h-4 rsp-mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Open in New Tab
            </a>
          </div>
        </div>
      </Modal>
    </div>
  );
}

