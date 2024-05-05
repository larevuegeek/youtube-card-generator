import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';
import { YoutubeVideo } from './../../_types/YoutubeVideo';
import { parseCodeYoutubeUrl } from '../parser/dataParser';

export async function fetchYoutubeVideoDetails(videoUrl: string): Promise<YoutubeVideo | null> {
    try {

        //On scrappe la vidéo pour récupérer le code source
        const response = await fetch(videoUrl);
        const body = await response.text();
        const dom = new JSDOM(body);
        const document = dom.window.document;
        
        const videoId = parseCodeYoutubeUrl(videoUrl) as string;
        const timestamp = new Date().getTime();

        //Extraire l'url de la minature de la vidéo à partir de la balise link
        const urlThumbnailElement = document.querySelector('link[rel="image_src"]');
        const urlThumbnail = urlThumbnailElement ? urlThumbnailElement.getAttribute('href')+"?="+timestamp || null : null;

        //Extraire le titre de la vidéo à partir de la balise meta
        const titleElement = document.querySelector('meta[name="title"]');
        const title = titleElement ? titleElement.getAttribute('content') || 'No title found' : 'No title found';
    
        //Extraire la durée à partir de la balise meta
        const durationElements = document.querySelector('meta[itemprop="duration"]');
        const duration = durationElements ? durationElements.getAttribute('content') || null : null;

        //Extraire le nombre de vues à partir de la balise meta
        const viewsElement = document.querySelector('meta[itemprop="interactionCount"]');
        const views = viewsElement ? viewsElement.getAttribute('content') || null : null;
        const viewsNumber: number = Number(views);

        //Extraire la date de publication à partir de la balise meta
        const publishedDateElements = document.querySelector('meta[itemprop="datePublished"]');
        const publishedDatetime = publishedDateElements ? publishedDateElements.getAttribute('content') || null : null;
        if(publishedDatetime === null) { //Si on trouve pas la date la vidéo n'est pas valide
            return null;
        }

        let author = '';
        const authorElement = document.querySelector('span[itemprop="author"]');
        if (authorElement !== null) {
            author = authorElement.querySelector('[itemprop="name"]')!.getAttribute('content')!;
        }

        let urlThumbnailChannel = null;
        const channelUrlElement = document.querySelector('span[itemprop="author"] link[itemprop="url"]');
        const channelUrl = channelUrlElement ? channelUrlElement.getAttribute('href') || null : null;
        if(channelUrl !== null) {
            const response2 = await fetch(channelUrl);
            const body2 = await response2.text();
            const dom2 = new JSDOM(body2);
            const document2 = dom2.window.document;

            const imageSrcElement = document2.querySelector('link[rel="image_src"]');
            urlThumbnailChannel = imageSrcElement ? imageSrcElement.getAttribute('href') || null : null;
    
        }

        return {
            videoId: videoId,
            url: videoUrl,
            urlThumbnail: urlThumbnail,
            urlThumbnailChannel: urlThumbnailChannel,
            title: title,
            author: author,
            duration: duration,
            views : viewsNumber,
            publishedDatetime : publishedDatetime,
        };
    } catch (error) {
        console.error('Failed to fetch video details:', error);
        return null;
    }
  }