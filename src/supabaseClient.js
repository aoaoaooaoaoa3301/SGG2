
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wshqzdyvvjcmzibcwhgs.supabase.co'; 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndzaHF6ZHl2dmpjbXppYmN3aGdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5NTg5MjEsImV4cCI6MjA5OTUzNDkyMX0.tVzHrXUviq9kIrqJu2HsRJNz7B3N0BuG9LGtlFZQqJs'; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);