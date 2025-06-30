'use client';

import { useState } from 'react';
import { useForm, useFieldArray, type Control, type UseFormRegister } from 'react-hook-form';
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
  id: z.string().optional(),
  imageUrl: z.string().optional(),
});

const demoSchema = z.object({
  id: z.string().optional(),
  title: z.string().optional(),
  demoUrl: z.string().optional(),
  sections: z.array(sectionSchema).optional(),
});

const contentFormSchema = z.object({
  logoUrl: z.string().optional(),
  mainShowcaseTitle: z.string().optional(),
  ctaHeading: z.string().optional(),
  ctaParagraph: z.string().optional(),
  ctaButtonText: z.string().optional(),
  ctaButtonLink: z.string().optional(),
  sections: z.array(sectionSchema).optional(),
  demos: z.array(demoSchema).optional(),
});

type FormValues = z.infer<typeof contentFormSchema>;

const DemoSectionsManager = ({ demoIndex, control, register }: { demoIndex: number, control: Control<FormValues>, register: UseFormRegister<FormValues> }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `demos.${demoIndex}.sections`,
    keyName: 'key'
  });

  return (
    <div className="space-y-4 pt-4 mt-4 border-t">
      <Label>Demo Images</Label>
       {fields.map((field, index) => (
        <div key={field.key} className="flex items-start gap-4">
          <div className="flex-grow space-y-2">
            <div>
              <Label htmlFor={`demos.${demoIndex}.sections.${index}.imageUrl`} className="sr-only">Image URL</Label>
              <Input
                id={`demos.${demoIndex}.sections.${index}.imageUrl`}
                placeholder="Image URL"
                {...register(`demos.${demoIndex}.sections.${index}.imageUrl`)}
              />
            </div>
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Remove Image</span>
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => append({ id: `${Date.now()}`, imageUrl: '' })}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Image
      </Button>
    </div>
  )
}

export default function UploadPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(contentFormSchema),
    defaultValues: async () => {
      return getContent();
    },
  });
  
  const { isLoading } = form.formState;

  const { fields: sectionFields, append: appendSection, remove: removeSection } = useFieldArray({
    control: form.control,
    name: 'sections',
    keyName: 'key',
  });

  const { fields: demoFields, append: appendDemo, remove: removeDemo } = useFieldArray({
    control: form.control,
    name: 'demos',
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
                <CardTitle>Main Showcase Sections</CardTitle>
                <CardDescription>Manage the pages shown in the main scroll animation.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <Label htmlFor="mainShowcaseTitle">Showcase Title</Label>
                    <Input id="mainShowcaseTitle" {...form.register('mainShowcaseTitle')} placeholder="e.g., Our Main Features"/>
                </div>
                <Separator/>
                {sectionFields.map((field, index) => (
                    <div key={field.key} className="flex items-start gap-4 p-4 border rounded-lg">
                        <div className="font-bold text-lg text-muted-foreground">{index + 1}</div>
                        <div className="flex-grow space-y-4">
                            <div>
                                <Label htmlFor={`sections.${index}.imageUrl`} className="sr-only">Image URL</Label>
                                <Input id={`sections.${index}.imageUrl`} {...form.register(`sections.${index}.imageUrl`)} placeholder="Image URL" />
                            </div>
                        </div>
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeSection(index)}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove Section</span>
                        </Button>
                    </div>
                ))}
                 <Button type="button" variant="outline" onClick={() => appendSection({ id: `${Date.now()}`, imageUrl: '' })}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Section
                </Button>
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Demos</CardTitle>
            <CardDescription>Manage additional showcase animations to appear on the homepage.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {demoFields.map((field, index) => (
              <Card key={field.key} className="p-4 border bg-muted/20">
                <CardHeader className="p-0 flex flex-row items-center justify-between gap-4">
                  <div className="flex-grow pr-4 space-y-4">
                      <div>
                        <Label htmlFor={`demos.${index}.title`}>Demo Title</Label>
                        <Input id={`demos.${index}.title`} {...form.register(`demos.${index}.title`)} placeholder="e.g., Product Features Showcase" />
                      </div>
                      <div>
                        <Label htmlFor={`demos.${index}.demoUrl`}>Demo URL</Label>
                        <Input id={`demos.${index}.demoUrl`} {...form.register(`demos.${index}.demoUrl`)} placeholder="https://example.com" />
                      </div>
                  </div>
                   <Button type="button" variant="destructive" onClick={() => removeDemo(index)}>
                      <Trash2 className="mr-2 h-4 w-4" /> Remove Demo
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <DemoSectionsManager demoIndex={index} control={form.control} register={form.register} />
                </CardContent>
              </Card>
            ))}
            <Button type="button" variant="outline" onClick={() => appendDemo({ id: `${Date.now()}`, title: '', sections: [] })}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Demo
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
