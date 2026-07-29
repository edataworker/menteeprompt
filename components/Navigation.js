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
    <nav className="bg-[#004696] text-white shadow-lg">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📊</span>
            <span className="font-bold text-lg">PromptGen</span>
          </div>
          <div className="flex gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`hover:text-blue-200 transition ${
                  pathname === link.href ? 'text-blue-200 border-b-2 border-white' : ''
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