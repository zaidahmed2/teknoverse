import TeknoverseAnimation from '@/components/teknoverse-animation';
import { getContent } from '@/services/contentService';
import CtaSection from '@/components/cta-section';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default async function Home() {
  const content = await getContent();

  return (
    <main>
      {content.mainShowcaseTitle && <h2 className="text-3xl md:text-4xl font-bold text-center mt-32 mb-[-5rem] relative z-10">{content.mainShowcaseTitle}</h2>}
      <TeknoverseAnimation sections={content.sections || []} />
      
      {content.demos?.map((demo) => (
        <div key={demo.id} className="relative z-10">
          {demo.title && <h2 className="text-3xl md:text-4xl font-bold text-center mt-32 mb-[-5rem] relative z-10">{demo.title}</h2>}
          <TeknoverseAnimation sections={demo.sections || []} />
          {demo.demoUrl && (
            <div className="text-center py-12 bg-background">
                <Button asChild size="lg">
                    <Link href={demo.demoUrl} target="_blank" rel="noopener noreferrer">
                        View Demo <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                </Button>
            </div>
          )}
        </div>
      ))}

      <CtaSection
        ctaHeading={content.ctaHeading || ''}
        ctaParagraph={content.ctaParagraph || ''}
        ctaButtonText={content.ctaButtonText || ''}
        ctaButtonLink={content.ctaButtonLink || ''}
      />
    </main>
  );
}
