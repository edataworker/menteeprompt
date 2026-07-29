'use client';

import { saveAs } from 'file-saver';
import { useState } from 'react';

export default function GenerateButton({
  clientData,
  selectedPrompts,
  setIsGenerating,
  isGenerating,
  showToast,
}) {
  // Local loading state for the button (optional, can be removed if using prop)
  // const [isGenerating, setIsGenerating] = useState(false);

  const generateExcel = async () => {
    // 1. Validate inputs
    if (!clientData.name && !clientData.rawText) {
      showToast('Please enter client name or paste raw data.', 'error');
      return;
    }
    if (selectedPrompts.length === 0) {
      showToast('Please select at least one prompt.', 'error');
      return;
    }

    // 2. Set loading state
    setIsGenerating(true);

    try {
      // 3. Call the API route
      const response = await fetch('/api/generate-excel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientData,
          selectedPrompts,
        }),
      });

      // 4. Handle API errors
      if (!response.ok) {
        let errorMessage = 'Failed to generate Excel file.';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          // If response is not JSON, use status text
          errorMessage = `Server error (${response.status}): ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      // 5. Get the file blob from the response
      const blob = await response.blob();

      // 6. Generate filename
      const date = new Date().toISOString().slice(0, 10);
      const fileName = `Grok_Ready_Prompt_Data_${date}.xlsx`;

      // 7. Trigger download
      saveAs(blob, fileName);

      // 8. Show success message
      showToast(`✅ Excel file generated! (${selectedPrompts.length} prompts)`, 'success');
    } catch (error) {
      console.error('Generate error:', error);
      showToast(`❌ Error: ${error.message}`, 'error');
    } finally {
      // 9. Clear loading state
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
