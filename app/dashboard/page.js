'use client';

import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalPrompts: 0,
    selectedCount: 0,
    categories: {},
  });

  useEffect(() => {
    fetch('/api/prompts')
      .then((res) => res.json())
      .then((data) => {
        const categories = {};
        data.forEach((p) => {
          categories[p.category] = (categories[p.category] || 0) + 1;
        });
        setStats({
          totalPrompts: data.length,
          selectedCount: 0,
          categories,
        });
      });
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#004696]">📊 Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card text-center">
          <div className="text-4xl mb-2">📋</div>
          <div className="text-3xl font-bold text-[#004696]">{stats.totalPrompts}</div>
          <div className="text-gray-600">Total Prompts</div>
        </div>
        <div className="card text-center">
          <div className="text-4xl mb-2">✅</div>
          <div className="text-3xl font-bold text-green-600">0</div>
          <div className="text-gray-600">Currently Selected</div>
        </div>
        <div className="card text-center">
          <div className="text-4xl mb-2">📁</div>
          <div className="text-3xl font-bold text-[#004696]">0</div>
          <div className="text-gray-600">Files Generated</div>
        </div>
      </div>

      <div className="card">
        <h2 className="section-title">📂 Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(stats.categories).map(([cat, count]) => (
            <div key={cat} className="flex justify-between items-center p-3 bg-[#f5f8fa] rounded-lg">
              <span className="font-medium">{cat}</span>
              <span className="badge">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}