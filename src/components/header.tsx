import Image from 'next/image';
import Link from 'next/link';
import { Settings } from 'lucide-react';

interface HeaderProps {
  logoUrl: string;
}

export default function Header({ logoUrl }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between bg-background/30 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
        <Link href="/">
            <Image
              src={logoUrl}
              alt="Teknoverse Logo"
              width={120}
              height={40}
              data-ai-hint="logo tech"
              className="h-8 w-auto"
              priority
            />
        </Link>
        <Link href="/upload" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Manage Content">
            <Settings className="h-6 w-6" />
        </Link>
    </header>
  );
}
