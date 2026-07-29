import * as XLSX from 'xlsx';
import { useState, useRef } from 'react';

export default function ClientForm({ clientData, setClientData }) {
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

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    
    // Validate file type
    const validExtensions = ['.xlsx', '.xls', '.csv', '.json'];
    const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!validExtensions.includes(fileExt)) {
      setUploadError('Please upload an Excel (.xlsx, .xls), CSV, or JSON file.');
      return;
    }

    setIsUploading(true);
    setUploadError('');
    
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        // Handle JSON files
        if (fileExt === '.json') {
          const jsonData = JSON.parse(event.target.result);
          if (Array.isArray(jsonData) && jsonData.length > 0) {
            mapDataToClient(jsonData[0]);
          } else if (typeof jsonData === 'object') {
            mapDataToClient(jsonData);
          } else {
            setUploadError('Invalid JSON format. Expected object or array.');
          }
          setIsUploading(false);
          return;
        }

        // Handle Excel and CSV files
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);
        
        if (jsonData.length > 0) {
          mapDataToClient(jsonData[0]);
        } else {
          setUploadError('No data found in the uploaded file.');
        }
      } catch (error) {
        setUploadError('Error reading file: ' + error.message);
      }
      setIsUploading(false);
    };
    
    reader.onerror = () => {
      setUploadError('Error reading file.');
      setIsUploading(false);
    };
    
    reader.readAsArrayBuffer(file);
    // Reset the input so the same file can be uploaded again
    e.target.value = '';
  };

  const mapDataToClient = (row) => {
    setClientData({
      name: row['Name'] || row['Client Name'] || row['Client'] || row['Full Name'] || row['name'] || '',
      company: row['Company'] || row['Business'] || row['Organization'] || row['company'] || '',
      email: row['Email'] || row['email'] || row['Email Address'] || '',
      phone: row['Phone'] || row['phone'] || row['Phone Number'] || row['Contact'] || '',
      notes: JSON.stringify(row, null, 2)
    });
  };

  const clearForm = () => {
    setClientData({
      name: '',
      company: '',
      email: '',
      phone: '',
      notes: '',
    });
    setUploadError('');
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="card">
      <h2 className="section-title">📋 Client Data</h2>
      
      {/* File Upload Section with VISIBLE button */}
      <div className="mb-4 p-4 bg-[#f5f8fa] rounded-lg border-2 border-dashed border-[#004696]">
        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-gray-700">
            📤 Import Client Data from File
          </label>
          
          <div className="flex flex-wrap items-center gap-3">
          {/* VISIBLE Upload Button */}
          <button
            type="button"
            onClick={triggerFileInput}
            disabled={isUploading}
            className="px-6 py-3 bg-[#004696] text-white rounded-lg hover:bg-[#00337a] transition disabled:opacity-50 disabled:cursor-not-allowed font-medium text-base shadow-sm"
          >
            {isUploading ? '⏳ Processing...' : '📁 Choose File'}
          </button>
          
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv,.json"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="hidden"
          />

            
            {fileName && (
              <span className="text-sm text-gray-600 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                📄 {fileName}
              </span>
            )}
            
            <button
              type="button"
              onClick={clearForm}
              className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition shadow-sm"
            >
              Clear All
            </button>
          </div>
          
          <p className="text-xs text-gray-400">
            Supports: Excel (.xlsx, .xls), CSV, JSON
          </p>
        </div>
        
        {isUploading && (
          <div className="mt-2 text-sm text-[#004696]">
            ⏳ Processing file...
          </div>
        )}
        {uploadError && (
          <div className="mt-2 text-sm text-red-600">
            ❌ {uploadError}
          </div>
        )}
      </div>

      {/* Manual Input Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="name"
          placeholder="Client Name *"
          value={clientData.name}
          onChange={handleChange}
          className="input-field"
          required
        />
        <input
          type="text"
          name="company"
          placeholder="Company"
          value={clientData.company}
          onChange={handleChange}
          className="input-field"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={clientData.email}
          onChange={handleChange}
          className="input-field"
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={clientData.phone}
          onChange={handleChange}
          className="input-field"
        />
        <textarea
          name="notes"
          placeholder="Additional Notes (JSON data from upload will appear here)"
          value={clientData.notes}
          onChange={handleChange}
          className="input-field md:col-span-2 min-h-[100px] font-mono text-sm"
        />
      </div>
    </div>
  );
}
