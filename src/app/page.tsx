import TeknoverseAnimation from '@/components/teknoverse-animation';
import { getContent } from '@/services/contentService';

export default async function Home() {
  const content = await getContent();

  return (
    <main>
      <TeknoverseAnimation
        sections={content.sections}
        ctaHeading={content.ctaHeading}
        ctaParagraph={content.ctaParagraph}
        ctaButtonText={content.ctaButtonText}
        ctaButtonLink={content.ctaButtonLink}
      />
    </main>
  );
}
