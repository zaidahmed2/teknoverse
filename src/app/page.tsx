import TeknoverseAnimation from '@/components/teknoverse-animation';
import { getContent } from '@/services/contentService';
import CtaSection from '@/components/cta-section';

export default async function Home() {
  const content = await getContent();

  return (
    <main>
      <TeknoverseAnimation sections={content.sections || []} />
      
      {content.demos?.map((demo) => (
        <div key={demo.id}>
          {demo.title && <h2 className="text-3xl md:text-4xl font-bold text-center mt-20 mb-[-5rem] relative z-10">{demo.title}</h2>}
          <TeknoverseAnimation sections={demo.sections || []} />
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
