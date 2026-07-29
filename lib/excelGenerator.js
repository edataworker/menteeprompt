import * as XLSX from 'xlsx';

function createStyledWorkbook(clientData, selectedPrompts) {
    const wb = XLSX.utils.book_new();

    // 1. Create and populate the "Client" sheet
    const clientSheetData = [
        ['Client Name', 'Company', 'Email', 'Phone', 'Generated On'],
        [clientData.name, clientData.company, clientData.email, clientData.phone, new Date().toLocaleString()]
    ];
    const wsClient = XLSX.utils.aoa_to_sheet(clientSheetData);
    // TODO: Apply formatting (font, bold, background, borders, freeze pane) to wsClient
    XLSX.utils.book_append_sheet(wb, wsClient, 'Client');

    // 2. Create and populate the "Library" sheet
    const libraryData = [['Run', 'Category', 'Description']];
    selectedPrompts.forEach(p => libraryData.push(['Y', p.category, p.label]));
    const wsLibrary = XLSX.utils.aoa_to_sheet(libraryData);
    // TODO: Apply formatting to wsLibrary
    XLSX.utils.book_append_sheet(wb, wsLibrary, 'Library');

    // 3. Create and populate the "Master Prompt" sheet
    // Combine your template + selected prompt content + client data
    const masterPrompt = buildMasterPrompt(clientData, selectedPrompts);
    const masterData = masterPrompt.split('\n').map(line => [line]);
    const wsMaster = XLSX.utils.aoa_to_sheet(masterData);
    // TODO: Apply formatting to wsMaster
    XLSX.utils.book_append_sheet(wb, wsMaster, 'Master Prompt');

    // 4. Create individual sheets for each selected prompt
    selectedPrompts.forEach(p => {
        // const promptContent = getPromptContent(p.id); // Fetch the detailed prompt text
        const promptData = [
            [`PROMPT: ${p.label}`],
            ['', ''],
            ['[Full instructions for this prompt go here...]'],
        ];
        const wsPrompt = XLSX.utils.aoa_to_sheet(promptData);
        // TODO: Apply formatting to wsPrompt
        // Sanitize sheet name (max 31 chars)
        const sheetName = p.label.replace(/[^a-zA-Z0-9 \-]/g, '').substring(0, 31);
        XLSX.utils.book_append_sheet(wb, wsPrompt, sheetName);
    });

    return wb;
}
