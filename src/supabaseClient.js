
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://acxviyadnoaieseujywr.supabase.co'; // ← вставьте сюда
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjeHZpeWFkbm9haWVzZXVqeXdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxOTM4ODQsImV4cCI6MjA4Mjc2OTg4NH0.9cT5bXDhg1UWE0Bd_N6aUfvw8fXReWFjp0wiX9cd37U'; // ← вставьте сюда

export const supabase = createClient(supabaseUrl, supabaseAnonKey);