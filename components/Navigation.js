'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: '🏠 Generator' },
    { href: '/dashboard', label: '📊 Dashboard' },
    { href: '/history', label: '📜 History' },
  ];

  return (
    <nav className="bg-[#004696] text-white shadow-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition">
            <span className="text-xl sm:text-2xl">📊</span>
            <span className="font-bold text-base sm:text-lg">PromptGen</span>
            <span className="hidden sm:inline text-[10px] font-normal bg-white/20 px-2 py-0.5 rounded-full">
              v2.0
            </span>
          </Link>
          <div className="flex items-center gap-4 sm:gap-6 text-sm sm:text-base">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`hover:text-blue-200 transition-colors duration-150 ${
                  pathname === link.href
                    ? 'text-blue-200 border-b-2 border-white pb-1'
                    : 'border-b-2 border-transparent pb-1'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
