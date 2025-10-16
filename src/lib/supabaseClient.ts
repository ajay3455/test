import { createClient } from '@supabase/supabase-js';
import { v4 as uuid } from 'uuid';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.warn(
    'Supabase credentials are missing. Please provide VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment configuration.'
  );
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '');

export const PROFILE_PICTURE_BUCKET = 'contractor-profile-pictures';

export async function uploadProfilePicture(file: File) {
  const extension = file.name.split('.').pop() ?? 'jpg';
  const filePath = `${uuid()}.${extension}`;

  const { data, error } = await supabase.storage
    .from(PROFILE_PICTURE_BUCKET)
    .upload(filePath, file, {
      contentType: file.type || 'image/jpeg',
      cacheControl: '3600'
    });

  if (error) {
    throw error;
  }

  const {
    data: { publicUrl }
  } = supabase.storage.from(PROFILE_PICTURE_BUCKET).getPublicUrl(data.path);

  return publicUrl;
}
