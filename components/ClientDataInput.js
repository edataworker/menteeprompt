'use client';

import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';

export default function ClientDataInput({ clientData, setClientData }) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setClientData({ ...clientData, [e.target.name]: e.target.value });
  };

  // Enhanced parsing function
  const parseSCORERawData = (text) => {
    const result = {};
    const patterns = {
      name: /^(?:Client|Name|Full Name|Contact)\s*[:]\s*(.+)|^(Wesley\s+Maedo)/mi,
      businessName: /(?:Account|Business|Company)\s*Name\s*[:]\s*(.+)/i,
      email: /Email\s*[:]\s*([^\s]+@[^\s]+)/i,
      phone: /Phone\s*[:]\s*([\d\(\)\-\.\s\+]+)/i,
      mailingAddress: /Mailing\s*Address\s*[:]\s*(.+?)(?:\n|$)/i,
      caseNumber: /Case\s*Number\s*[:]\s*(\d+)/i,
      mentoringType: /Mentoring\s*Type\s*[:]\s*(.+)/i,
      businessType: /Type of Business\s*[:]\s*(.+)/i,
      businessStage: /Business Stage\s*[:]\s*(.+)/i,
      status: /Status\s*[:]\s*(.+)/i,
      question: /Question\s*[:]\s*(.+?)(?:\n|$)/i,
    };
    for (const [key, pattern] of Object.entries(patterns)) {
      const match = text.match(pattern);
      if (match) {
        result[key] = (match[1] || match[2] || match[0] || '').trim();
      }
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
      <div className="card-header">
        <h2 className="card-title">
          <span className="icon">📋</span> Client Data
        </h2>
        <button
          type="button"
          onClick={clearForm}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          Clear all
        </button>
      </div>

      {/* Upload Section */}
      <div className="upload-zone mb-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-gray-700">Import from file</p>
            <p className="text-xs text-gray-400">Supports .xlsx, .xls, .csv, .json, .txt</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={triggerFileInput}
              disabled={isUploading}
              className="btn-secondary text-sm"
            >
              {isUploading ? '⏳ Processing...' : '📁 Choose File'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv,.json,.txt"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="hidden"
            />
            {fileName && (
              <span className="text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded border border-gray-100">
                📄 {fileName}
              </span>
            )}
          </div>
        </div>
        {isUploading && <div className="mt-2 text-sm text-[#004696]">⏳ Processing file...</div>}
        {uploadError && <div className="mt-2 text-sm text-red-500">❌ {uploadError}</div>}
      </div>

      {/* Raw Text Area */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          📝 Paste raw client data
        </label>
        <textarea
          name="rawText"
          placeholder="Paste SCORE export, client notes, or any raw text here..."
          value={clientData.rawText || ''}
          onChange={handleChange}
          className="textarea-field min-h-[100px] font-mono text-xs"
        />
      </div>

      <div className="divider"></div>

      {/* Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Client Name *</label>
          <input
            type="text"
            name="name"
            placeholder="e.g. Wesley Maedo"
            value={clientData.name}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Business / Company</label>
          <input
            type="text"
            name="company"
            placeholder="e.g. Maedo & Woo Chiropractic"
            value={clientData.company}
            onChange={handleChange}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            placeholder="client@example.com"
            value={clientData.email}
            onChange={handleChange}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="text"
            name="phone"
            placeholder="(555) 123-4567"
            value={clientData.phone}
            onChange={handleChange}
            className="input-field"
          />
        </div>
      </div>
    </div>
  );
}
