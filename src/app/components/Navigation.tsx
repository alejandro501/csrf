"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Navigation = () => {
  const pathname = usePathname();

  return (
    <nav className="flex items-center justify-end py-4 bg-primary text-white border-b border-white/10 px-4 sm:px-6 lg:px-8">
      <ul className="flex gap-8">
        <li>
          <Link
            href="/"
            className={`text-lg font-semibold ${
              pathname === "/"
                ? "text-accent"
                : "text-white/60 hover:text-red-500"
            }`}
          >
            poc
          </Link>
        </li>
        <li>
          <Link
            href="/readme"
            className={`text-lg font-semibold ${
              pathname === "/readme"
                ? "text-accent"
                : "text-white/60 hover:text-red-500"
            }`}
          >
            readme
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
