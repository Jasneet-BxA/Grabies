import {env} from './env/index.js';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = env.SUPABASE_URL || '';
const supabaseKey = env.SUPABASE_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

