'use client';

import { useState, useEffect } from 'react';
import ClientForm from '../components/ClientForm';
import PromptLibrary from '../components/PromptLibrary';
import GenerateButton from '../components/GenerateButton';
import Toast from '../components/Toast';

export default function Home() {
  const [clientData, setClientData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    notes: '',
  });
  const [selectedPrompts, setSelectedPrompts] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [toast, setToast] = useState(null);

  // Load prompts from API on mount
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
  ];

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="space-y-6">
      <header className="text-center py-4">
        <h1 className="text-3xl md:text-4xl font-bold text-[#004696]">
          🚀 Prompt Generator
        </h1>
        <p className="text-gray-600 mt-2 text-sm md:text-base">
          Generate clean Excel files ready for Grok upload
        </p>
      </header>

      <ClientForm clientData={clientData} setClientData={setClientData} />

      <PromptLibrary
        prompts={availablePrompts}
        selected={selectedPrompts}
        setSelected={setSelectedPrompts}
      />

      <GenerateButton
        clientData={clientData}
        selectedPrompts={selectedPrompts}
        setIsGenerating={setIsGenerating}
        isGenerating={isGenerating}
        showToast={showToast}
      />

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
