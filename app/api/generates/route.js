import * as XLSX from 'xlsx';

export async function POST(request) {
  try {
    const { clientData, selectedPrompts } = await request.json();

    const wb = XLSX.utils.book_new();

    // Client Sheet
    const clientDataArr = [
      ['Client Name', 'Company', 'Email', 'Phone', 'Generated On'],
      [
        clientData.name || 'Not specified',
        clientData.company || 'Not specified',
        clientData.email || 'Not specified',
        clientData.phone || 'Not specified',
        new Date().toLocaleString(),
      ],
    ];
    const wsClient = XLSX.utils.aoa_to_sheet(clientDataArr);
    XLSX.utils.book_append_sheet(wb, wsClient, 'Client');

    // Library Sheet
    const libraryData = [['Run', 'Category', 'Description']];
    selectedPrompts.forEach((p) => {
      libraryData.push(['Y', p.category, p.label]);
    });
    const wsLibrary = XLSX.utils.aoa_to_sheet(libraryData);
    XLSX.utils.book_append_sheet(wb, wsLibrary, 'Library');

    // Master Prompt Sheet
    const masterData = [
      ['MASTER PROMPT - TAHOMA 12pt'],
      [''],
      ['Generated: ' + new Date().toLocaleString()],
      ['Client: ' + clientData.name],
      [''],
      ['SELECTED DELIVERABLES:'],
    ];
    selectedPrompts.forEach((p, i) => {
      masterData.push(['']);
      masterData.push(['DELIVERABLE ' + (i + 1) + ': ' + p.label]);
      masterData.push(['Category: ' + p.category]);
    });
    const wsMaster = XLSX.utils.aoa_to_sheet(masterData);
    XLSX.utils.book_append_sheet(wb, wsMaster, 'Master Prompt');

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

    return new Response(wbout, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="Grok_Ready_${Date.now()}.xlsx"`,
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}