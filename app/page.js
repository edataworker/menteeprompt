'use client';

import { useState, useEffect } from 'react';
import ClientDataInput from '@/components/ClientDataInput';
import PromptLibrary from '@/components/PromptLibrary';
import GenerateButton from '@/components/GenerateButton';
import Toast from '@/components/Toast';

export default function Home() {
  const [clientData, setClientData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    notes: '',
    rawText: '',
    parsedData: null,
  });
  const [selectedPrompts, setSelectedPrompts] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [toast, setToast] = useState(null);
  const [availablePrompts, setAvailablePrompts] = useState([]);

  useEffect(() => {
    fetch('/api/prompts')
      .then((res) => res.json())
      .then((data) => setAvailablePrompts(data))
      .catch(() => setAvailablePrompts(getDefaultPrompts()));
  }, []);

  const getDefaultPrompts = () => [
    { id: 'SM', label: 'Social Media-Group Discovery', category: 'SM' },
    { id: 'MG', label: 'Marketing', category: 'MG' },
    { id: 'Web', label: 'Website-SEO', category: 'Web' },
    { id: 'Gov', label: 'Calif SOS Info', category: 'Gov' },
    { id: 'ME', label: 'Mentee Template', category: 'ME' },
    { id: 'SAM', label: 'SAM.gov', category: 'SAM' },
    { id: 'GE', label: 'GBP', category: 'GE' },
    { id: 'GSC', label: 'GSC', category: 'GE' },
    { id: 'MT', label: 'Marketing-Comprehensive', category: 'MT' },
    { id: 'Web2', label: 'Website-Design', category: 'Web' },
    { id: 'Web3', label: 'Website-eCommerce', category: 'Web' },
  ];

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="page-container">
      {/* Hero Section */}
      <div className="text-center mb-8 sm:mb-10 animate-fade-in-up">
        <div className="hero-icon mb-3">🚀</div>
        <h1 className="page-title">Prompt Generator</h1>
        <p className="page-subtitle max-w-xl mx-auto">
          Generate clean, professional Excel files ready for Grok upload — built for SCORE mentors.
        </p>
        <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
          <span className="badge-sm">v2.0</span>
          <span className="w-px h-3 bg-gray-200"></span>
          <span>Excel · Grok · SCORE</span>
        </div>
      </div>

      <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <ClientDataInput clientData={clientData} setClientData={setClientData} />
      </div>

      <div className="mt-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <PromptLibrary
          prompts={availablePrompts}
          selected={selectedPrompts}
          setSelected={setSelectedPrompts}
        />
      </div>

      <div className="mt-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        <GenerateButton
          clientData={clientData}
          selectedPrompts={selectedPrompts}
          setIsGenerating={setIsGenerating}
          isGenerating={isGenerating}
          showToast={showToast}
        />
      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
