import { app, db } from './firebase/config';
import { getAuth } from 'firebase/auth';

export const auth = getAuth(app);
export { db }; 