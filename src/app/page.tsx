import TeknoverseAnimation from '@/components/teknoverse-animation';

export default function Home() {
  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden">
      <div className="animated-grid absolute inset-0 z-0" />
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-background via-background/80 to-background" />
      <TeknoverseAnimation />
    </main>
  );
}
