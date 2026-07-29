'use client';

import { saveAs } from 'file-saver';
import { generateExcelFile } from '../lib/excelGenerator';

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
      const blob = await generateExcelFile(clientData, selectedPrompts);
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
    <button
      onClick={generateExcel}
      disabled={isGenerating}
      className="btn-primary flex items-center justify-center gap-2"
    >
      {isGenerating ? (
        <>
          <span className="animate-spin">⏳</span> Generating...
        </>
      ) : (
        <>
          🚀 Generate Clean Excel for Grok
        </>
      )}
    </button>
  );
}
