import TeknoverseAnimation from '@/components/teknoverse-animation';
import { getContent } from '@/services/contentService';
import DemoSection from '@/components/demo-section';
import CtaSection from '@/components/cta-section';

export default async function Home() {
  const content = await getContent();

  return (
    <main>
      <TeknoverseAnimation sections={content.sections || []} />
      <DemoSection demos={content.demos || []} />
      <CtaSection
        ctaHeading={content.ctaHeading || ''}
        ctaParagraph={content.ctaParagraph || ''}
        ctaButtonText={content.ctaButtonText || ''}
        ctaButtonLink={content.ctaButtonLink || ''}
      />
    </main>
  );
}
