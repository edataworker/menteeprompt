'use client';

import { useState } from 'react';

export default function PromptLibrary({ prompts, selected, setSelected }) {
  const [filter, setFilter] = useState('all');

  const togglePrompt = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selected.length === prompts.length) {
      setSelected([]);
    } else {
      setSelected(prompts.map((p) => p.id));
    }
  };

  const categories = [...new Set(prompts.map((p) => p.category))];
  const filteredPrompts = filter === 'all'
    ? prompts
    : prompts.filter((p) => p.category === filter);

  return (
    <div className="card">
      <div className="card-header flex-wrap gap-2">
        <h2 className="card-title">
          <span className="icon">📊</span> Select Prompts
        </h2>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={toggleAll} className="btn-secondary text-xs py-1.5 px-3">
            {selected.length === prompts.length ? 'Deselect All' : 'Select All'}
          </button>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#004696]/30"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="text-xs text-gray-400 mb-3">
        {selected.length} of {prompts.length} selected
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 max-h-[300px] overflow-y-auto pr-1">
        {filteredPrompts.map((prompt) => (
          <label key={prompt.id} className="checkbox-label">
            <input
              type="checkbox"
              checked={selected.includes(prompt.id)}
              onChange={() => togglePrompt(prompt.id)}
            />
            <span className="flex-1 text-sm">{prompt.label}</span>
            <span className="badge-sm">{prompt.category}</span>
          </label>
        ))}
      </div>

      {filteredPrompts.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-4">No prompts in this category.</p>
      )}
    </div>
  );
}
