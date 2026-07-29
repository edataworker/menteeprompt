'use client';

import { saveAs } from 'file-saver';

export default function GenerateButton({
  clientData,
  selectedPrompts,
  setIsGenerating,
  isGenerating,
  showToast,
}) {
  const generateExcel = async () => {
    if (!clientData.name && !clientData.rawText) {
      showToast('Please enter client name or paste raw data.', 'error');
      return;
    }
    if (selectedPrompts.length === 0) {
      showToast('Please select at least one prompt.', 'error');
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate-excel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientData, selectedPrompts }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate Excel');
      }

      const blob = await response.blob();
      const date = new Date().toISOString().slice(0, 10);
      saveAs(blob, `Grok_Ready_Prompt_Data_${date}.xlsx`);

      showToast(`✅ Excel file generated! (${selectedPrompts.length} prompts)`, 'success');
    } catch (error) {
      console.error('Generate error:', error);
      showToast('❌ Error generating file: ' + error.message, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={generateExcel}
        disabled={isGenerating}
        className="btn-primary text-base px-10 py-3.5 w-full sm:w-auto"
      >
        {isGenerating ? (
          <>
            <span className="spinner"></span> Generating...
          </>
        ) : (
          <>
            <span className="text-lg">🚀</span> Generate Clean Excel for Grok
          </>
        )}
      </button>
      {selectedPrompts.length > 0 && (
        <p className="text-xs text-gray-400">
          {selectedPrompts.length} prompt{selectedPrompts.length > 1 ? 's' : ''} selected
        </p>
      )}
    </div>
  );
}
