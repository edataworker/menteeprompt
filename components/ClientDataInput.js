import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';

export default function ClientDataInput({ clientData, setClientData }) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setClientData({
      ...clientData,
      [e.target.name]: e.target.value,
    });
  };

  const parseSCORERawData = (text) => {
    const result = {};
    const patterns = {
      name: /^(Wesley\s+Maedo|Client\s*[:]\s*(.+))/mi,
      businessName: /Account\s*Name\s*[:]\s*(.+)/i,
      email: /Email\s*[:]\s*([^\s]+@[^\s]+)/i,
      phone: /Phone\s*[:]\s*([\d\(\)\-\.\s\+]+)/i,
      caseNumber: /Case\s*Number\s*[:]\s*(\d+)/i,
      mentoringType: /Mentoring\s*Type\s*[:]\s*(.+)/i,
      businessType: /Type of Business\s*[:]\s*(.+)/i,
      status: /Status\s*[:]\s*(.+)/i,
      question: /Question\s*[:]\s*(.+?)(?:\n|$)/i,
    };
    for (const [key, pattern] of Object.entries(patterns)) {
      const match = text.match(pattern);
      if (match) result[key] = match[1] || match[2] || match[0] || '';
    }
    return result;
  };

  const mapDataToClient = (row, rawText = null) => {
    if (rawText && typeof rawText === 'string') {
      const parsed = parseSCORERawData(rawText);
      setClientData({
        name: parsed.name || '',
        company: parsed.businessName || '',
        email: parsed.email || '',
        phone: parsed.phone || '',
        notes: '',
        rawText: rawText,
        parsedData: parsed,
      });
      return;
    }
    setClientData({
      name: row?.Name || row?.['Client Name'] || row?.Client || row?.name || '',
      company: row?.Company || row?.Business || row?.Organization || row?.company || '',
      email: row?.Email || row?.email || row?.['Email Address'] || '',
      phone: row?.Phone || row?.phone || row?.['Phone Number'] || '',
      notes: '',
      rawText: JSON.stringify(row, null, 2),
      parsedData: null,
    });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    setIsUploading(true);
    setUploadError('');
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        if (fileExt === '.txt') {
          const text = event.target.result;
          mapDataToClient(null, text);
          setClientData(prev => ({ ...prev, rawText: text }));
        } else if (fileExt === '.json') {
          const jsonData = JSON.parse(event.target.result);
          if (Array.isArray(jsonData) && jsonData.length > 0) mapDataToClient(jsonData[0]);
          else if (typeof jsonData === 'object') mapDataToClient(jsonData);
        } else {
          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet);
          if (jsonData.length > 0) mapDataToClient(jsonData[0]);
        }
      } catch (error) {
        setUploadError('Error reading file: ' + error.message);
      }
      setIsUploading(false);
    };
    reader.onerror = () => setUploadError('Error reading file.');
    if (fileExt === '.txt') reader.readAsText(file);
    else reader.readAsArrayBuffer(file);
    e.target.value = '';
  };

  const triggerFileInput = () => fileInputRef.current.click();

  const clearForm = () => {
    setClientData({ name: '', company: '', email: '', phone: '', notes: '', rawText: '', parsedData: null });
    setUploadError('');
    setFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="card">
      <h2 className="section-title">📋 Client Data</h2>
      <div className="mb-4 p-4 bg-[#f5f8fa] rounded-lg border-2 border-dashed border-[#004696]">
        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-gray-700">📤 Upload Client Data File</label>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={triggerFileInput} disabled={isUploading}
              className="px-6 py-3 bg-[#004696] text-white rounded-lg hover:bg-[#00337a] transition disabled:opacity-50 disabled:cursor-not-allowed font-medium text-base shadow-sm">
              {isUploading ? '⏳ Processing...' : '📁 Choose File'}
            </button>
            <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv,.json,.txt" onChange={handleFileUpload} disabled={isUploading} className="hidden" />
            {fileName && <span className="text-sm text-gray-600 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">📄 {fileName}</span>}
            <button type="button" onClick={clearForm} className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition shadow-sm">Clear All</button>
          </div>
          <p className="text-xs text-gray-400">Supports: Excel (.xlsx, .xls), CSV, JSON, TXT (SCORE exports)</p>
        </div>
        {isUploading && <div className="mt-2 text-sm text-[#004696]">⏳ Processing file...</div>}
        {uploadError && <div className="mt-2 text-sm text-red-600">❌ {uploadError}</div>}
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">📝 Or Paste Raw Client Data</label>
        <textarea name="rawText" placeholder="Paste raw client data here (SCORE export, etc.)..." value={clientData.rawText || ''} onChange={handleChange} className="input-field min-h-[150px] font-mono text-sm" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="text" name="name" placeholder="Client Name *" value={clientData.name} onChange={handleChange} className="input-field" required />
        <input type="text" name="company" placeholder="Company/Business" value={clientData.company} onChange={handleChange} className="input-field" />
        <input type="email" name="email" placeholder="Email" value={clientData.email} onChange={handleChange} className="input-field" />
        <input type="text" name="phone" placeholder="Phone" value={clientData.phone} onChange={handleChange} className="input-field" />
      </div>
    </div>
  );
}
