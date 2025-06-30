import type { Demo } from '@/services/contentService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface DemoSectionProps {
    demos: Demo[];
}

export default function DemoSection({ demos }: DemoSectionProps) {
    if (!demos || demos.length === 0) {
        return null;
    }

    return (
        <section className="py-20 bg-background z-10 relative">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Our Demos</h2>
                <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
                    Explore our interactive demos to see what's possible. Each project is a showcase of our capabilities.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {demos.map((demo) => (
                        <Card key={demo.id} className="overflow-hidden flex flex-col group border-2 border-transparent hover:border-primary transition-all duration-300 soft-shadow">
                            {demo.imageUrl && (
                                <div className="relative aspect-video overflow-hidden">
                                    <Image
                                        src={demo.imageUrl}
                                        alt={demo.title || 'Demo Image'}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                </div>
                            )}
                            <CardHeader>
                                <CardTitle>{demo.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-grow flex flex-col">
                                <p className="text-muted-foreground mb-6 flex-grow">{demo.description}</p>
                                {demo.demoUrl && (
                                    <Button asChild className="mt-auto w-full">
                                        <Link href={demo.demoUrl} target="_blank" rel="noopener noreferrer">
                                            View Demo <ArrowRight className="ml-2"/>
                                        </Link>
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
