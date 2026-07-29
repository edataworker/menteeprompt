import { useState } from 'react';

export default function PromptLibrary({ prompts, selected, setSelected }) {
  const [filter, setFilter] = useState('all');

  const togglePrompt = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((p) => p !== id)
        : [...prev, id]
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
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <h2 className="section-title mb-0">📊 Select Prompts</h2>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={toggleAll}
            className="text-sm px-3 py-1 rounded bg-[#e6f0fa] text-[#004696] hover:bg-[#d0e0f0] transition"
          >
            {selected.length === prompts.length ? 'Deselect All' : 'Select All'}
          </button>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="text-sm px-3 py-1 rounded border border-[#d0d7de] bg-white"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="text-sm text-gray-500 mb-3">
        {selected.length} of {prompts.length} selected
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
        {filteredPrompts.map((prompt) => (
          <label key={prompt.id} className="checkbox-label">
            <input
              type="checkbox"
              checked={selected.includes(prompt.id)}
              onChange={() => togglePrompt(prompt.id)}
            />
            <span className="flex-1">{prompt.label}</span>
            <span className="badge">{prompt.category}</span>
          </label>
        ))}
      </div>

      {filteredPrompts.length === 0 && (
        <p className="text-gray-500 text-center py-4">
          No prompts in this category.
        </p>
      )}
    </div>
  );
}