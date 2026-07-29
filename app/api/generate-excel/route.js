import ExcelJS from 'exceljs';

export async function POST(request) {
  try {
    const { clientData, selectedPrompts } = await request.json();

    // Create workbook
    const workbook = new ExcelJS.Workbook();

    // Client Sheet
    const clientSheet = workbook.addWorksheet('Client');
    // ... (your existing Excel generation code here)

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();

    return new Response(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="Grok_Ready_Prompt_Data_${Date.now()}.xlsx"`,
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
