import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    
    if (!productId) {
      return NextResponse.json({ error: 'Missing productId' }, { status: 400 });
    }
    
    if (!adminDb) {
      return NextResponse.json({ error: 'Firebase Admin not initialized' }, { status: 500 });
    }
    
    const reviewsRef = adminDb.collection('reviews').where('productId', '==', productId);
    const snapshot = await reviewsRef.get();
    
    const rawReviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const reviews = rawReviews.sort((a, b) => {
      const dateA = (a as {createdAt?: string}).createdAt || '';
      const dateB = (b as {createdAt?: string}).createdAt || '';
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });
    
    return NextResponse.json({ reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, rating, reviewText, authorName } = body;
    
    if (!productId || !rating || !reviewText || !authorName) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    
    if (!adminDb) {
      return NextResponse.json({ error: 'Firebase Admin not initialized' }, { status: 500 });
    }
    
    const review = {
      productId,
      rating,
      reviewText,
      authorName,
      createdAt: new Date().toISOString(),
      status: 'approved' // auto-publish for now
    };
    
    const docRef = await adminDb.collection('reviews').add(review);
    
    return NextResponse.json({ success: true, id: docRef.id, review });
  } catch (error) {
    console.error('Error adding review:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
