'use client';

import { useState } from 'react';

export default function History() {
  const [history, setHistory] = useState([]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#004696]">📜 History</h1>

      <div className="card">
        {history.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-lg">No history yet</p>
            <p className="text-sm">Generated files will appear here</p>
          </div>
        ) : (
          <div className="space-y-2">
            {history.map((item, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-[#f5f8fa] rounded-lg">
                <div>
                  <span className="font-medium">{item.fileName}</span>
                  <span className="text-sm text-gray-500 ml-4">{item.date}</span>
                </div>
                <div className="flex gap-2">
                  <span className="badge">{item.promptCount} prompts</span>
                  <button className="text-[#004696] hover:underline text-sm">Download</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}