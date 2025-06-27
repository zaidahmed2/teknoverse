import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-end px-4 sm:px-6 lg:px-8">
        <Link href="/">
            <Image
              src="https://placehold.co/120x40.png"
              alt="Teknoverse Logo"
              width={120}
              height={40}
              data-ai-hint="logo tech"
              className="h-8 w-auto"
            />
        </Link>
    </header>
  );
}
