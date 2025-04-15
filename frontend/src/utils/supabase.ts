// src/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pfwewoskqpvegfpwsyxl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmd2V3b3NrcXB2ZWdmcHdzeXhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1MTkwMjcsImV4cCI6MjA2MDA5NTAyN30.rJdn0lXGFok5vcK6pyJvhtuJflng7XCXVLMOa6AXlHw';
export const supabase = createClient(supabaseUrl, supabaseKey);


        