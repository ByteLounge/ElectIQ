import admin from 'firebase-admin';
import logger from '../utils/logger.js';

if (process.env.NODE_ENV !== 'test' && !admin.apps.length) {
  try {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (projectId && clientEmail && privateKey && privateKey !== 'your_private_key') {
      console.log(`[FIREBASE DEBUG] Initializing for project: ${projectId}`);
      const formattedKey = privateKey.replace(/\\n/g, '\n');
      console.log(`[FIREBASE DEBUG] Private key starts with: ${formattedKey.substring(0, 30)}...`);
      
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey: formattedKey,
        }),
      });
      console.log('[FIREBASE DEBUG] Firebase initialized successfully.');
    } else {
      logger.warn('Firebase credentials missing or invalid. Session persistence will be disabled.');
    }
  } catch (error) {
    logger.error('Firebase initialization failed:', error.message);
  }
}

const db = admin.apps.length ? admin.firestore() : null;

/**
 * Fetches session data from Firestore.
 * @param {string} sessionId - The unique identifier for the session.
 * @returns {Promise<Object|null>} - The session data or null if not found.
 */
export const getSession = async (sessionId) => {
  if (!db) return null;
  try {
    const doc = await db.collection('sessions').doc(sessionId).get();
    return doc.exists ? doc.data() : null;
  } catch (error) {
    logger.error(`Error getting session ${sessionId}:`, error);
    return null;
  }
};

/**
 * Saves or updates session data in Firestore.
 * @param {string} sessionId - The unique identifier for the session.
 * @param {Object} data - The session data to store.
 * @returns {Promise<void>}
 */
export const saveSession = async (sessionId, data) => {
  if (!db) return;
  try {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + (parseInt(process.env.SESSION_TTL_HOURS) || 24));

    await db.collection('sessions').doc(sessionId).set({
      ...data,
      sessionId,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      expiresAt: admin.firestore.Timestamp.fromDate(expiresAt),
    }, { merge: true });
  } catch (error) {
    logger.error(`Error saving session ${sessionId}:`, error);
  }
};

/**
 * Deletes a session from Firestore.
 * @param {string} sessionId - The unique identifier for the session.
 * @returns {Promise<void>}
 */
export const deleteSession = async (sessionId) => {
  if (!db) return;
  try {
    await db.collection('sessions').doc(sessionId).delete();
  } catch (error) {
    logger.error(`Error deleting session ${sessionId}:`, error);
  }
};
