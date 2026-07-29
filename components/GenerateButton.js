import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

export default function GenerateButton({
  clientData,
  selectedPrompts,
  setIsGenerating,
  isGenerating,
  showToast,
}) {
  const generateExcel = async () => {
    if (!clientData.name.trim()) {
      showToast('Please enter at least the client name.', 'error');
      return;
    }

    if (selectedPrompts.length === 0) {
      showToast('Please select at least one prompt.', 'error');
      return;
    }

    setIsGenerating(true);

    try {
      // Get full prompt data
      const res = await fetch('/api/prompts');
      const allPrompts = await res.json();
      const selectedPromptData = allPrompts.filter((p) =>
        selectedPrompts.includes(p.id)
      );

      // Generate Excel
      const blob = await generateExcelFile(clientData, selectedPromptData);
      const date = new Date().toISOString().slice(0, 10);
      saveAs(blob, `Grok_Ready_Prompt_Data_${date}.xlsx`);

      showToast(`✅ Excel file generated successfully! (${selectedPromptData.length} prompts)`, 'success');
    } catch (error) {
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
          📥 Generate Excel for Grok
        </>
      )}
    </button>
  );
}

// Excel generation logic
async function generateExcelFile(clientData, selectedPrompts) {
  const wb = XLSX.utils.book_new();

  // 1. Client Sheet
  const clientSheetData = [
    ['Client Name', 'Company', 'Email', 'Phone', 'Generated On'],
    [
      clientData.name || 'Not specified',
      clientData.company || 'Not specified',
      clientData.email || 'Not specified',
      clientData.phone || 'Not specified',
      new Date().toLocaleString(),
    ],
    [],
    ['Additional Notes'],
    [clientData.notes || ''],
  ];
  const wsClient = XLSX.utils.aoa_to_sheet(clientSheetData);
  XLSX.utils.book_append_sheet(wb, wsClient, 'Client');

  // 2. Library Sheet
  const libraryData = [
    ['Run', 'Category', 'Description'],
    ...selectedPrompts.map((p) => ['Y', p.category, p.label]),
  ];
  // Add unchecked prompts too
  const res = await fetch('/api/prompts');
  const allPrompts = await res.json();
  allPrompts.forEach((p) => {
    if (!selectedPrompts.some((sp) => sp.id === p.id)) {
      libraryData.push(['N', p.category, p.label]);
    }
  });
  const wsLibrary = XLSX.utils.aoa_to_sheet(libraryData);
  XLSX.utils.book_append_sheet(wb, wsLibrary, 'Library');

  // 3. Master Prompt Sheet
  const masterData = [
    ['MASTER PROMPT - TAHOMA 12pt'],
    [''],
    ['Generated: ' + new Date().toLocaleString()],
    ['Client: ' + clientData.name],
    ['Company: ' + clientData.company || 'Not specified'],
    ['Email: ' + clientData.email || 'Not specified'],
    [''],
    ['A0: GROK SYSTEM CONTRACT (READ FIRST)'],
    ['You Are: an executive level, decision grade pro bono business mentor...'],
    [''],
    ['AA: GOAL AND KEY PROMPTING FACTORS'],
    ['Define Your Goal Here (required): Generate comprehensive business deliverables...'],
    [''],
    ['SELECTED DELIVERABLES:'],
  ];
  selectedPrompts.forEach((p, i) => {
    masterData.push(['']);
    masterData.push(['DELIVERABLE ' + (i + 1) + ': ' + p.label]);
    masterData.push(['Category: ' + p.category]);
    masterData.push(['']);
  });
  const wsMaster = XLSX.utils.aoa_to_sheet(masterData);
  XLSX.utils.book_append_sheet(wb, wsMaster, 'Master Prompt');

  // 4. Individual Prompt Sheets
  selectedPrompts.forEach((p) => {
    const data = [
      ['PROMPT: ' + p.label],
      ['Category: ' + p.category],
      [''],
      ['[Instructions for ' + p.label + ' go here]'],
      [''],
      ['Generated: ' + new Date().toLocaleString()],
    ];
    const ws = XLSX.utils.aoa_to_sheet(data);
    let sheetName = p.label.replace(/[^a-zA-Z0-9 \-]/g, '').substring(0, 31);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
  });

  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return new Blob([wbout], { type: 'application/octet-stream' });
}