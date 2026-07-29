import * as XLSX from 'xlsx';

export function generateExcelFile(clientData, selectedPrompts) {
  const wb = XLSX.utils.book_new();

  // Helper function to apply professional formatting
  const applyProfessionalFormatting = (ws, data) => {
    // Set column widths
    const colWidths = data[0].map(() => ({ wch: 20 }));
    ws['!cols'] = colWidths;

    // Apply styles (SheetJS doesn't support direct styling in xlsx)
    // For full styling, we'd need to use xlsx-style or ExcelJS
    // But we can still structure it professionally
  };

  // In the Client Sheet section
  const clientDataArr = [
  ['Client Information', '', ''],
  ['Field', 'Value', ''],
  ['Client Name', clientData.name || 'Not specified', ''],
  ['Business Name', clientData.company || 'Not specified', ''],
  ['Email', clientData.email || 'Not specified', ''],
  ['Phone', clientData.phone || 'Not specified', ''],
  ['Generated On', new Date().toLocaleString(), ''],
  ['', '', ''],
  ['Additional Information', '', ''],
];

  // Add parsed data if available
  if (clientData.parsedData) {
    const parsed = clientData.parsedData;
    const extraFields = [
      ['Case Number', parsed.caseNumber || ''],
      ['Mentoring Type', parsed.mentoringType || ''],
      ['Business Type', parsed.businessType || ''],
      ['Business Stage', parsed.businessStage || ''],
      ['Status', parsed.status || ''],
    ];
    extraFields.forEach(f => {
      if (f[1]) clientDataArr.push(f);
    });
  }
  const wsClient = XLSX.utils.aoa_to_sheet(clientDataArr);
  wsClient['!cols'] = [{ wch: 20 }, { wch: 40 }, { wch: 10 }, { wch: 10 }, { wch: 10 }];
  XLSX.utils.book_append_sheet(wb, wsClient, 'Client');

  // 2. Library Sheet
  const libraryData = [
    ['Run', 'Category', 'Description', 'Selected'],
    ...selectedPrompts.map(p => ['Y', p.category, p.label, '✅']),
  ];
  const wsLibrary = XLSX.utils.aoa_to_sheet(libraryData);
  wsLibrary['!cols'] = [{ wch: 10 }, { wch: 15 }, { wch: 35 }, { wch: 12 }];
  XLSX.utils.book_append_sheet(wb, wsLibrary, 'Library');

  // 3. Master Prompt Sheet
  const masterPromptContent = buildMasterPrompt(clientData, selectedPrompts);
  const masterData = masterPromptContent.split('\n').map(line => [line]);
  const wsMaster = XLSX.utils.aoa_to_sheet(masterData);
  wsMaster['!cols'] = [{ wch: 80 }];
  XLSX.utils.book_append_sheet(wb, wsMaster, 'Master Prompt');

  // 4. Individual Prompt Sheets
  selectedPrompts.forEach((p, index) => {
    const promptContent = getPromptContent(p.id);
    const data = [
      [`PROMPT ${index + 1}: ${p.label}`],
      [''],
      ['Category: ' + p.category],
      [''],
      ['--- INSTRUCTIONS ---'],
      [''],
      ...promptContent.split('\n').map(line => [line]),
      [''],
      ['--- CLIENT DATA ---'],
      [''],
      [`Client: ${clientData.name}`],
      [`Company: ${clientData.company}`],
      [`Email: ${clientData.email}`],
      [`Phone: ${clientData.phone}`],
      [''],
      [`Generated: ${new Date().toLocaleString()}`],
    ];
    const wsPrompt = XLSX.utils.aoa_to_sheet(data);
    wsPrompt['!cols'] = [{ wch: 70 }];
    const sheetName = p.label.replace(/[^a-zA-Z0-9 \-]/g, '').substring(0, 31);
    XLSX.utils.book_append_sheet(wb, wsPrompt, sheetName);
  });

  // Generate file
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return new Blob([wbout], { type: 'application/octet-stream' });
}

// Build the master prompt
function buildMasterPrompt(clientData, selectedPrompts) {
  let prompt = 'MASTER PROMPT - TAHOMA 12pt\n';
  prompt += '='.repeat(80) + '\n\n';
  prompt += `Generated: ${new Date().toLocaleString()}\n`;
  prompt += `Client: ${clientData.name}\n`;
  prompt += `Company: ${clientData.company}\n`;
  prompt += `Email: ${clientData.email}\n`;
  prompt += `Phone: ${clientData.phone}\n\n`;
  prompt += '='.repeat(80) + '\n\n';
  prompt += 'A0: GROK SYSTEM CONTRACT (READ FIRST)\n';
  prompt += 'You Are: an executive level, decision grade pro bono business mentor...\n\n';
  prompt += 'AA: GOAL AND KEY PROMPTING FACTORS\n';
  prompt += `Define Your Goal Here (required): Generate comprehensive business deliverables for ${clientData.name}\n\n`;
  prompt += '='.repeat(80) + '\n\n';
  prompt += 'SELECTED DELIVERABLES:\n';
  prompt += '-'.repeat(40) + '\n\n';
  
  selectedPrompts.forEach((p, i) => {
    prompt += `DELIVERABLE ${i + 1}: ${p.label}\n`;
    prompt += `Category: ${p.category}\n`;
    prompt += '-'.repeat(40) + '\n\n';
  });
  
  return prompt;
}

// Get prompt content (you'll expand this with actual content)
function getPromptContent(promptId) {
  const promptLibrary = {
    'SM': 'Social Media Discovery Instructions:\n- Research target audience\n- Identify key platforms\n- Create engagement strategy',
    'MG': 'Marketing Instructions:\n- Define marketing goals\n- Identify channels\n- Create content calendar',
    'Web': 'Website SEO Instructions:\n- Keyword research\n- On-page optimization\n- Technical SEO audit',
    'Gov': 'California SOS Info Instructions:\n- Business registration\n- Compliance requirements\n- Filing deadlines',
    'ME': 'Mentee Template Instructions:\n- Define goals\n- Create action plan\n- Set milestones',
    'MT': 'Marketing Comprehensive Instructions:\n- Full marketing audit\n- Strategy development\n- Implementation plan',
  };
  return promptLibrary[promptId] || 'Instructions for this prompt are not yet available.';
}
