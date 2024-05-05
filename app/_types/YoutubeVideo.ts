export interface YoutubeVideo {
    videoId: string;
    url: string;
    urlThumbnail: string|null;
    urlThumbnailChannel: string|null;
    title: string;
    author: string;
    duration: string|null;
    views: number|null;
    publishedDatetime: string|null;
}