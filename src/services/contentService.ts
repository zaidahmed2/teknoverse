'use server';

import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { z } from 'zod';

const sectionSchema = z.object({
  id: z.string(),
  name: z.string(),
  imageUrl: z.string().url(),
});

const contentSchema = z.object({
  logoUrl: z.string().url(),
  ctaHeading: z.string(),
  ctaParagraph: z.string(),
  ctaButtonText: z.string(),
  ctaButtonLink: z.string().url(),
  sections: z.array(sectionSchema),
});

export type ContentData = z.infer<typeof contentSchema>;

const defaultContent: ContentData = {
    logoUrl: 'https://placehold.co/120x40.png',
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
};


const contentDocRef = doc(db, 'content', 'homepage');

export async function getContent(): Promise<ContentData> {
  try {
    const docSnap = await getDoc(contentDocRef);
    if (docSnap.exists()) {
      // Using safeParse for robustness against malformed data
      const result = contentSchema.safeParse(docSnap.data());
      if (result.success) {
        return result.data;
      }
      // Log error if data is invalid and fall back to default
      console.error('Invalid content structure in Firestore:', result.error);
      return defaultContent;
    } else {
      // The document doesn't exist. Instead of trying to create it here
      // (which requires write permissions), we'll just return the default content.
      // The document will be created when the user saves from the /upload page.
      return defaultContent;
    }
  } catch (error) {
    console.error("Error getting document:", error);
    // This will catch permission errors on read, and other network issues.
    return defaultContent;
  }
}

export async function updateContent(data: ContentData) {
  try {
    const validatedData = contentSchema.parse(data);
    await setDoc(contentDocRef, validatedData);
    return { success: true, message: 'Content updated successfully!' };
  } catch (error) {
    console.error("Error updating document:", error);
    if (error instanceof z.ZodError) {
        return { success: false, message: 'Validation failed', errors: error.errors };
    }
    // Try to provide a more helpful message for permission errors
    if (error instanceof Error && error.message.toLowerCase().includes('permission')) {
      return { success: false, message: 'Permission denied. Please check your Firestore security rules to allow writes.' };
    }
    return { success: false, message: 'Failed to update content.' };
  }
}
