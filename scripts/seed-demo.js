import 'dotenv/config';
import admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();

const seedDemo = async () => {
  const sessionId = 'demo-session-123';
  const sessionData = {
    sessionId,
    history: [
      { role: 'user', parts: [{ text: 'What are the election steps in the US?' }] },
      { role: 'model', parts: [{ text: 'In the United States, the election process typically follows these key phases:\n\n1. **Announcement & Primaries**: Candidates announce their runs and compete in state primaries/caucuses.\n2. **Voter Registration**: Eligible citizens must register to vote by their state\'s deadline.\n3. **National Conventions**: Parties formally nominate their presidential and vice-presidential candidates.\n4. **General Election Campaign**: Candidates debate and campaign across the country.\n5. **Election Day**: Held on the first Tuesday after the first Monday in November.\n6. **Electoral College**: Electors cast their votes for President.\n7. **Certification**: Congress counts the electoral votes and certifies the winner.' }] },
      { role: 'user', parts: [{ text: 'How do I register to vote in New York?' }] },
      { role: 'model', parts: [{ text: 'To register to vote in New York, you can:\n\n1. **Online**: Visit the NY State Board of Elections website if you have a NYS DMV ID.\n2. **By Mail**: Download and print a voter registration form, then mail it to your local Board of Elections.\n3. **In Person**: Visit your local Board of Elections or any New York State Agency-Based voter registration center.\n\nThe deadline is typically 10 days before an election to register for that election.' }] }
    ],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    expiresAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 24 * 60 * 60 * 1000))
  };

  try {
    await db.collection('sessions').doc(sessionId).set(sessionData);
    console.log(`Demo session ${sessionId} seeded successfully! ✅`);
  } catch (error) {
    console.error('Error seeding demo session:', error);
  } finally {
    process.exit();
  }
};

seedDemo();
