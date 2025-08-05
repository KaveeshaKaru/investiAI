"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"

export default function Header() {
  const pathname = usePathname()

  const navLinks = [
    { href: "/", label: "Dashboard" },
    { href: "/cases", label: "Cases" },
    { href: "/police-reports", label: "Police Reports" },
  ]

  return (
    <header className="border-b border-gray-200 bg-white shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/lexaLogo.png"
              alt="Lexa AI Logo"
              width={160}
              height={40}
              className="object-contain"
            />
          </Link>
        </div>
        <nav className="hidden md:flex md:gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                pathname === link.href ? "text-blue-600" : "text-gray-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <button className="rounded-full bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-900">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-bell"
            >
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
            <span className="sr-only">Notifications</span>
          </button>
          <button className="size-8 rounded-full bg-blue-100 text-blue-600">
            <span className="sr-only">Profile</span>
            <span className="flex h-full items-center justify-center text-sm font-medium">
              JD
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}
