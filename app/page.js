'use client';

import { useState, useEffect } from 'react';
import ClientDataInput from '../components/ClientDataInput';
import PromptLibrary from '../components/PromptLibrary';
import GenerateButton from '../components/GenerateButton';
import Toast from '../components/Toast';
import Link from 'next/link';

export default function Home() {
  // ... (same state and functions as above)

  return (
    <>
      {/* Navigation Bar */}
      <nav className="bg-[#004696] text-white shadow-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition">
              <span className="text-xl sm:text-2xl">📊</span>
              <span className="font-bold text-base sm:text-lg">PromptGen</span>
            </Link>
            <div className="flex items-center gap-4 sm:gap-6 text-sm sm:text-base">
              <span className="border-b-2 border-white pb-1">🏠 Generator</span>
              <Link href="/dashboard" className="hover:text-blue-200 transition-colors duration-150 border-b-2 border-transparent pb-1">
                📊 Dashboard
              </Link>
              <Link href="/history" className="hover:text-blue-200 transition-colors duration-150 border-b-2 border-transparent pb-1">
                📜 History
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="page-container">
        {/* ... rest of the content ... */}
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-400 py-4 border-t border-gray-100 mt-8">
        <p>© {new Date().getFullYear()} Prompt Generator — SCORE Mentor Tools</p>
      </footer>
    </>
  );
}
