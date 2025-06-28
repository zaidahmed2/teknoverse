'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Trash2, PlusCircle } from 'lucide-react';
import { getContent, updateContent, type ContentData } from '@/services/contentService';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const sectionSchema = z.object({
  id: z.string(),
  name: z.string(),
  imageUrl: z.string(),
});

const contentFormSchema = z.object({
  logoUrl: z.string(),
  ctaHeading: z.string(),
  ctaParagraph: z.string(),
  ctaButtonText: z.string(),
  ctaButtonLink: z.string(),
  sections: z.array(sectionSchema),
});

export default function UploadPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContentData>({
    resolver: zodResolver(contentFormSchema),
    defaultValues: async () => {
      // react-hook-form will handle the loading state via formState.isLoading
      return getContent();
    },
  });
  
  const { isLoading } = form.formState;

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'sections',
    keyName: 'key',
  });

  const onSubmit = async (data: ContentData) => {
    setIsSubmitting(true);
    const result = await updateContent(data);
    if (result.success) {
      toast({
        title: 'Success!',
        description: result.message,
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.message,
      });
    }
    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
        <div className="container mx-auto py-10 px-4">
            <Skeleton className="h-10 w-1/3 mb-4" />
            <Skeleton className="h-6 w-2/3 mb-8" />
            <Card className="mb-6">
                <CardHeader>
                    <Skeleton className="h-8 w-1/4" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-1/4" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-24 w-full" />
                </CardContent>
            </Card>
        </div>
    )
  }

  return (
    <main className="container mx-auto py-24 px-4">
      <h1 className="text-4xl font-bold mb-2">Manage Content</h1>
      <p className="text-muted-foreground mb-8">Update the content displayed on the homepage showcase.</p>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
            <CardHeader>
                <CardTitle>General</CardTitle>
                <CardDescription>Update the logo and final call-to-action section.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Label htmlFor="logoUrl">Logo URL</Label>
                    <Input id="logoUrl" {...form.register('logoUrl')} />
                </div>
                <Separator />
                <div>
                    <Label htmlFor="ctaHeading">CTA Heading</Label>
                    <Input id="ctaHeading" {...form.register('ctaHeading')} />
                </div>
                 <div>
                    <Label htmlFor="ctaParagraph">CTA Paragraph</Label>
                    <Input id="ctaParagraph" {...form.register('ctaParagraph')} />
                </div>
                <div>
                    <Label htmlFor="ctaButtonText">CTA Button Text</Label>
                    <Input id="ctaButtonText" {...form.register('ctaButtonText')} />
                </div>
                 <div>
                    <Label htmlFor="ctaButtonLink">CTA Button Link</Label>
                    <Input id="ctaButtonLink" {...form.register('ctaButtonLink')} />
                </div>
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Showcase Sections</CardTitle>
                <CardDescription>Manage the pages shown in the scroll animation.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {fields.map((field, index) => (
                    <div key={field.key} className="flex items-start gap-4 p-4 border rounded-lg">
                        <div className="font-bold text-lg text-muted-foreground">{index + 1}</div>
                        <div className="flex-grow space-y-4">
                            <div>
                                <Label htmlFor={`sections.${index}.name`}>Section Name</Label>
                                <Input id={`sections.${index}.name`} {...form.register(`sections.${index}.name`)} />
                            </div>
                            <div>
                                <Label htmlFor={`sections.${index}.imageUrl`}>Image URL</Label>
                                <Input id={`sections.${index}.imageUrl`} {...form.register(`sections.${index}.imageUrl`)} />
                            </div>
                        </div>
                        <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove Section</span>
                        </Button>
                    </div>
                ))}
                 <Button type="button" variant="outline" onClick={() => append({ id: `${Date.now()}`, name: '', imageUrl: '' })}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Section
                </Button>
            </CardContent>
        </Card>

        <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </main>
  );
}
