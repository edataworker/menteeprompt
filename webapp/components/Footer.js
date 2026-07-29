export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-8">
      <div className="container mx-auto px-4 max-w-5xl py-6">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} Prompt Generator</p>
          <p className="flex items-center gap-4 mt-2 md:mt-0">
            <span>⚡ Built with Next.js</span>
            <span>•</span>
            <span>📦 SheetJS</span>
            <span>•</span>
            <span>🚀 Deployed on Vercel</span>
          </p>
        </div>
      </div>
    </footer>
  );
}