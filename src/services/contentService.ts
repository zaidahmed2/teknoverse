'use server';

import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { z } from 'zod';
import { cache } from 'react';

const sectionSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  imageUrl: z.string().optional(),
});

const demoSchema = z.object({
    id: z.string().optional(),
    title: z.string().optional(),
    demoUrl: z.string().optional(),
    sections: z.array(sectionSchema).optional(),
});

const contentSchema = z.object({
  logoUrl: z.string().optional(),
  mainShowcaseTitle: z.string().optional(),
  mainShowcaseDemoUrl: z.string().optional(),
  ctaHeading: z.string().optional(),
  ctaParagraph: z.string().optional(),
  ctaButtonText: z.string().optional(),
  ctaButtonLink: z.string().optional(),
  sections: z.array(sectionSchema).optional(),
  demos: z.array(demoSchema).optional(),
});

export type ContentData = z.infer<typeof contentSchema>;
export type Demo = z.infer<typeof demoSchema>;

const defaultContent: ContentData = {
    logoUrl: 'https://placehold.co/120x40.png',
    mainShowcaseTitle: 'Main Showcase',
    mainShowcaseDemoUrl: 'https://teknoverse.dev',
    ctaHeading: 'Ready to Explore Teknoverse?',
    ctaParagraph: "You've seen the glimpses, now experience the full vision. Click below to enter a new digital dimension.",
    ctaButtonText: 'Visit Teknoverse Now',
    ctaButtonLink: 'https://teknoverse.dev',
    sections: [
        { id: '1', name: 'Home', imageUrl: 'https://i.ibb.co/Gvh937bv/img1.png' },
        { id: '2', name: 'About', imageUrl: 'https://i.ibb.co/M5RgYHRy/img2.png' },
        { id: '3', name: 'Products', imageUrl: 'https://i.ibb.co/NdNqcnFW/img3.png' },
        { id: '4', name: 'Blog', imageUrl: 'https://i.ibb.co/3bDTSRs/img4.png' },
        { id: '5', name: 'Contact', imageUrl: 'https://i.ibb.co/MytkQCwg/img5.png' },
    ],
    demos: [],
};


const contentDocRef = doc(db, 'content', 'homepage');

export const getContent = cache(async (): Promise<ContentData> => {
  try {
    const docSnap = await getDoc(contentDocRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      // Ensure sections and demos are present
      if (!data.sections) data.sections = [];
      if (!data.demos) data.demos = [];
      
      const result = contentSchema.safeParse(data);
      if (result.success) {
        return result.data;
      }
      console.error('Invalid content structure in Firestore:', result.error);
      return { ...defaultContent, ...docSnap.data() };
    } else {
      await setDoc(contentDocRef, defaultContent);
      return defaultContent;
    }
  } catch (error) {
    console.error("Error getting document:", error);
    if (error instanceof Error && error.message.toLowerCase().includes('permission')) {
        console.error("----------------------------------------------------------------------");
        console.error(">>> Firebase Permission Error <<<");
        console.error("Your Firestore security rules are preventing the app from reading data.");
        console.error("To fix this, go to your Firebase project > Firestore > Rules and allow reads.");
        console.error("For example, to allow public reads on your content, use:");
        console.error("match /content/homepage { allow read: if true; }");
        console.error("----------------------------------------------------------------------");
    }
    return defaultContent;
  }
});

export async function updateContent(data: ContentData) {
  try {
    const dataToSave = {
      ...data,
      sections: data.sections || [],
      demos: data.demos?.map(demo => ({
        ...demo,
        sections: demo.sections || []
      })) || [],
    };
    const validatedData = contentSchema.parse(dataToSave);
    await setDoc(contentDocRef, validatedData);
    return { success: true, message: 'Content updated successfully!' };
  } catch (error) {
    console.error("Error updating document:", error);
    if (error instanceof z.ZodError) {
        return { success: false, message: 'Validation failed', errors: error.errors };
    }
    if (error instanceof Error && error.message.toLowerCase().includes('permission')) {
      return { success: false, message: 'Permission denied. Please check your Firestore security rules to allow writes.' };
    }
    return { success: false, message: 'Failed to update content.' };
  }
}
