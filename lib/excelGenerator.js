import ExcelJS from 'exceljs';

export async function generateExcelFile(clientData, selectedPrompts) {
  const workbook = new ExcelJS.Workbook();
  
  // =============================================
  // 1. CLIENT SHEET (With Full Formatting)
  // =============================================
  const clientSheet = workbook.addWorksheet('Client');
  
  // Add client data rows
  const clientRows = [
    ['CLIENT INFORMATION'],
    [],
    ['Field', 'Value'],
    ['Client Name', clientData.name || 'Not specified'],
    ['Business Name', clientData.company || 'Not specified'],
    ['Email', clientData.email || 'Not specified'],
    ['Phone', clientData.phone || 'Not specified'],
    ['Generated On', new Date().toLocaleString()],
    [],
  ];

  // Add parsed data if available
  if (clientData.parsedData) {
    const parsed = clientData.parsedData;
    const extraFields = [
      ['Case Number', parsed.caseNumber || ''],
      ['Case Status', parsed.status || ''],
      ['Mentoring Type', parsed.mentoringType || ''],
      ['Business Type', parsed.businessType || ''],
      ['Business Stage', parsed.businessStage || ''],
      ['Question', parsed.question || ''],
      ['Mailing Address', parsed.mailingAddress || ''],
    ];
    extraFields.forEach(f => {
      if (f[1]) clientRows.push(f);
    });
  }

  // Add raw text preview
  if (clientData.rawText) {
    clientRows.push([]);
    clientRows.push(['RAW CLIENT DATA (First 30 lines)']);
    const lines = clientData.rawText.split('\n').slice(0, 30);
    lines.forEach(line => {
      clientRows.push([line.substring(0, 200)]);
    });
    if (clientData.rawText.split('\n').length > 30) {
      clientRows.push(['... (truncated)']);
    }
  }

  clientSheet.addRows(clientRows);
  
  // Format Client Sheet
  clientSheet.getRow(1).font = { name: 'Tahoma', size: 14, bold: true };
  clientSheet.getRow(1).alignment = { horizontal: 'center' };
  
  // Style header row
  const headerRow = clientSheet.getRow(3);
  headerRow.font = { name: 'Tahoma', size: 12, bold: true, color: { argb: 'FFFFFFFF' } };
  headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF004696' } };
  headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
  headerRow.border = {
    top: { style: 'medium' },
    left: { style: 'medium' },
    bottom: { style: 'medium' },
    right: { style: 'medium' }
  };
  
  // Style data rows
  let rowIndex = 4;
  clientRows.forEach((row, index) => {
    if (index >= 3) {
      const dataRow = clientSheet.getRow(rowIndex);
      dataRow.font = { name: 'Tahoma', size: 11 };
      dataRow.alignment = { vertical: 'middle' };
      dataRow.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      // Alternating row colors
      if (rowIndex % 2 === 0) {
        dataRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF5F8FA' } };
      }
      rowIndex++;
    }
  });
  
  // Set column widths
  clientSheet.getColumn(1).width = 25;
  clientSheet.getColumn(2).width = 70;
  
  // Freeze header row
  clientSheet.views = [{ state: 'frozen', ySplit: 3 }];

  // =============================================
  // 2. LIBRARY SHEET
  // =============================================
  const librarySheet = workbook.addWorksheet('Library');
  
  const libraryData = [
    ['Run', 'Category', 'Description'],
    ...selectedPrompts.map(p => ['Y', p.category || 'N/A', p.label || p.id || 'Unknown']),
  ];
  librarySheet.addRows(libraryData);
  
  // Style Library Sheet
  const libHeaderRow = librarySheet.getRow(1);
  libHeaderRow.font = { name: 'Tahoma', size: 12, bold: true, color: { argb: 'FFFFFFFF' } };
  libHeaderRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF004696' } };
  libHeaderRow.alignment = { horizontal: 'center', vertical: 'middle' };
  libHeaderRow.border = {
    top: { style: 'medium' },
    left: { style: 'medium' },
    bottom: { style: 'medium' },
    right: { style: 'medium' }
  };
  
  librarySheet.getColumn(1).width = 10;
  librarySheet.getColumn(2).width = 15;
  librarySheet.getColumn(3).width = 40;
  
  // =============================================
  // 3. MASTER PROMPT SHEET
  // =============================================
  const masterSheet = workbook.addWorksheet('Master Prompt');
  
  const masterPromptContent = buildMasterPrompt(clientData, selectedPrompts);
  const masterLines = masterPromptContent.split('\n');
  masterLines.forEach(line => masterSheet.addRow([line]));
  
  masterSheet.getColumn(1).width = 80;
  
  // =============================================
  // 4. INDIVIDUAL PROMPT SHEETS
  // =============================================
  selectedPrompts.forEach((p, index) => {
    const promptLabel = p?.label || p?.id || `Prompt ${index + 1}`;
    const promptCategory = p?.category || 'N/A';
    const promptContent = getPromptContent(p?.id);
    const sheetName = promptLabel.replace(/[^a-zA-Z0-9 \-]/g, '').substring(0, 31) || `Prompt_${index + 1}`;
    
    const promptSheet = workbook.addWorksheet(sheetName);
    
    const data = [
      [`PROMPT ${index + 1}: ${promptLabel}`],
      [],
      ['Category: ' + promptCategory],
      [],
      ['--- INSTRUCTIONS ---'],
      [],
      ...promptContent.split('\n').map(line => [line]),
      [],
      ['--- CLIENT DATA ---'],
      [],
      [`Client: ${clientData.name || 'Not specified'}`],
      [`Company: ${clientData.company || 'Not specified'}`],
      [`Email: ${clientData.email || 'Not specified'}`],
      [`Phone: ${clientData.phone || 'Not specified'}`],
      [],
      [`Generated: ${new Date().toLocaleString()}`],
    ];
    data.forEach(row => promptSheet.addRow(row));
    
    promptSheet.getColumn(1).width = 70;
    
    // Style prompt header
    const promptHeaderRow = promptSheet.getRow(1);
    promptHeaderRow.font = { name: 'Tahoma', size: 14, bold: true };
    promptHeaderRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF004696' } };
    promptHeaderRow.font.color = { argb: 'FFFFFFFF' };
    promptHeaderRow.alignment = { horizontal: 'center' };
  });
  
  // =============================================
  // 5. GENERATE FILE
  // =============================================
  const buffer = await workbook.xlsx.writeBuffer();
  return new Blob([buffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
}

// =============================================
// BUILD MASTER PROMPT
// =============================================
function buildMasterPrompt(clientData, selectedPrompts) {
  let prompt = 'MASTER PROMPT - TAHOMA 12pt\n';
  prompt += '='.repeat(80) + '\n\n';
  prompt += `Generated: ${new Date().toLocaleString()}\n`;
  prompt += `Client: ${clientData.name || 'Not specified'}\n`;
  prompt += `Company: ${clientData.company || 'Not specified'}\n`;
  prompt += `Email: ${clientData.email || 'Not specified'}\n`;
  prompt += `Phone: ${clientData.phone || 'Not specified'}\n\n`;
  prompt += '='.repeat(80) + '\n\n';
  prompt += 'A0: GROK SYSTEM CONTRACT (READ FIRST)\n';
  prompt += 'You Are: an executive level, decision grade pro bono business mentor...\n\n';
  prompt += 'AA: GOAL AND KEY PROMPTING FACTORS\n';
  prompt += `Define Your Goal Here (required): Generate comprehensive business deliverables for ${clientData.name || 'the client'}\n\n`;
  prompt += '='.repeat(80) + '\n\n';
  prompt += 'SELECTED DELIVERABLES:\n';
  prompt += '-'.repeat(40) + '\n\n';
  
  selectedPrompts.forEach((p, i) => {
    const label = p?.label || p?.id || `Prompt ${i + 1}`;
    const category = p?.category || 'N/A';
    prompt += `DELIVERABLE ${i + 1}: ${label}\n`;
    prompt += `Category: ${category}\n`;
    prompt += '-'.repeat(40) + '\n\n';
  });
  
  return prompt;
}

// =============================================
// GET PROMPT CONTENT
// =============================================
function getPromptContent(promptId) {
  const promptLibrary = {
    'SM': 'Social Media Discovery Instructions:\n- Research target audience\n- Identify key platforms\n- Create engagement strategy',
    'MG': 'Marketing Instructions:\n- Define marketing goals\n- Identify channels\n- Create content calendar',
    'Web': 'Website SEO Instructions:\n- Keyword research\n- On-page optimization\n- Technical SEO audit',
    'Gov': 'California SOS Info Instructions:\n- Business registration\n- Compliance requirements\n- Filing deadlines',
    'ME': 'Mentee Template Instructions:\n- Define goals\n- Create action plan\n- Set milestones',
    'MT': 'Marketing Comprehensive Instructions:\n- Full marketing audit\n- Strategy development\n- Implementation plan',
    'SAM': 'SAM.gov Instructions:\n- Registration process\n- Contract finding\n- Optimization strategies',
    'GE': 'GBP Instructions:\n- Google Business Profile setup\n- Optimization\n- Review management',
    'GSC': 'GSC Instructions:\n- Google Search Console setup\n- Performance monitoring\n- SEO insights',
    'Web2': 'Website Design Instructions:\n- User experience\n- Responsive design\n- Conversion optimization',
    'Web3': 'Website eCommerce Instructions:\n- Platform selection\n- Payment processing\n- Product catalog setup',
  };
  return promptLibrary[promptId] || 'Instructions for this prompt are not yet available.';
}
