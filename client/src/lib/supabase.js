import { createClient } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    onAuthStateChange: (event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        toast.info('Check your email for the password reset link.');
      }
    }
  }
});
