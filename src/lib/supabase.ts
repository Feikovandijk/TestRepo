import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uwubzdvwczdyshxmjzby.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3dWJ6ZHZ3Y3pkeXNoeG1qemJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE3ODAwNjEsImV4cCI6MjA0NzM1NjA2MX0.nKgtDhsqHGz9LOodyYJTC-uFAtv5rcTaUlvj2szZ8us';

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function createShoppingList(items: any) {
  const { data, error } = await supabase
    .from('shopping_lists')
    .insert([
      {
        items,
        expires_at: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getShoppingList(id: string) {
  const { data, error } = await supabase
    .from('shopping_lists')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

// Cleanup function to be run as a Supabase Edge Function
export async function cleanupExpiredLists() {
  const { error } = await supabase
    .from('shopping_lists')
    .delete()
    .lt('expires_at', new Date().toISOString());

  if (error) throw error;
}