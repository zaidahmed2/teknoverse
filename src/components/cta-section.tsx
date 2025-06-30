import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface CtaSectionProps {
    ctaHeading?: string;
    ctaParagraph?: string;
    ctaButtonText?: string;
    ctaButtonLink?: string;
}

export default function CtaSection({ ctaHeading, ctaParagraph, ctaButtonText, ctaButtonLink }: CtaSectionProps) {
  return (
    <div className="relative z-10 flex h-screen w-full flex-col items-center justify-center bg-background px-4 text-center">
        <h2 className="mb-6 text-4xl font-bold md:text-6xl">{ctaHeading}</h2>
        <p className="mb-8 max-w-2xl text-lg text-muted-foreground">
          {ctaParagraph}
        </p>
        {ctaButtonLink && ctaButtonText && (
          <Link href={ctaButtonLink} target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="bg-accent text-accent-foreground text-lg font-bold button-glow-accent hover:bg-black hover:text-white hover:shadow-none transition-all duration-300">
                {ctaButtonText} <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        )}
        <p className="absolute bottom-8 text-sm text-muted-foreground">
          © {new Date().getFullYear()} Designed by <a href="https://teknoverse.com.au/" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground transition-colors">Teknoverse</a>
        </p>
    </div>
  );
}
