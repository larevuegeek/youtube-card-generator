"use server"
import { z } from 'zod';
import { YoutubeVideo } from '@/app/_types/YoutubeVideo';
import { fetchYoutubeVideoDetails } from '@/app/lib/youtube/youtubeFetcher';

const youtubeUrlSchema = z.object({
    url_youtube: z.string().regex(/^https:\/\/www\.youtube\.com\/watch\?v=[\w-]{11}$/, "l'URL Youtube est invalide")
});

export default async function handleYoutubeFetcher(formData: FormData) {
    
    const urlYoutube = formData.get('url_youtube') as string;
    try {
        youtubeUrlSchema.parse({ url_youtube: urlYoutube });

        const youtubeData: YoutubeVideo | null = await fetchYoutubeVideoDetails(urlYoutube);
        if(!youtubeData) {
            return { data: null, error: 'No video data returned from the URL' };
        } 

        return { data: youtubeData as YoutubeVideo, error: null };
    } 
    catch (error) {
      if (error instanceof z.ZodError) {
        return { data: null, error: error.errors[0].message };
      } 
      
      return { data: null, error: "An unexpected error occurred" };
    }
}