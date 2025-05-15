import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { format } from 'date-fns';

/**
 * Fetches the daily challenge for the given date (YYYY-MM-DD) from Firestore.
 * If no date is provided, uses today's date.
 * Returns the challenge document data or null if not found.
 */
export async function fetchDailyChallenge(dateStr?: string) {
  console.log('=== DAILY CHALLENGE FETCH START ===');
  let dateKey = dateStr;
  if (!dateKey) {
    dateKey = format(new Date(), 'yyyy-MM-dd');
  }
  console.log('📅 Fetching daily challenge for date:', dateKey);
  
  const docRef = doc(db, 'dailyChallenges', dateKey);
  console.log('📄 Document reference path:', docRef.path);
  
  try {
    console.log('🔍 Attempting to fetch document...');
  const snap = await getDoc(docRef);
    console.log('✅ Document fetch complete');
    console.log('📊 Document exists:', snap.exists());
    
  if (snap.exists()) {
      const data = snap.data();
      console.log('📦 Fetched challenge data:', data);
      console.log('=== DAILY CHALLENGE FETCH SUCCESS ===');
      return data;
    }
    
    console.log('❌ No challenge found for date:', dateKey);
    console.log('=== DAILY CHALLENGE FETCH COMPLETE (NO DATA) ===');
    return null;
  } catch (error) {
    console.error('❌ Error fetching daily challenge:', error);
    console.log('=== DAILY CHALLENGE FETCH ERROR ===');
    throw error;
  }
} 