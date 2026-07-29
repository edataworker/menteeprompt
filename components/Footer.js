'use client';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-100 bg-white/80 backdrop-blur-sm mt-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5">
        <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-gray-400 gap-2">
          <p>© {year} Prompt Generator — SCORE Mentor Tools</p>
          <div className="flex items-center gap-3">
            <span>⚡ Built with Next.js</span>
            <span className="w-px h-3 bg-gray-200"></span>
            <span>📦 ExcelJS</span>
            <span className="w-px h-3 bg-gray-200"></span>
            <span>🚀 Deployed on Vercel</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
