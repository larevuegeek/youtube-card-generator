import moment from 'moment';
import { parseISO, formatDistanceToNow, differenceInMinutes, differenceInHours, differenceInDays, differenceInMonths, differenceInYears } from 'date-fns';
import { fr } from 'date-fns/locale';

export function parseCodeYoutubeUrl(url: string): string | null {
    const regex = /[?&]v=([^&#]+)/;
    const match = url.match(regex);
  
    if (match) {
      return match[1];
    } 
    else {
      return null;
    }
  }

export function parseDate(dateString: string): string {
    const date = parseISO(dateString);
    const now = new Date();

    // Déterminer la différence et choisir la méthode de soustraction appropriée
    const minutesDiff = differenceInMinutes(now, date);
    if (minutesDiff < 60) {
        return `${minutesDiff} ${minutesDiff > 1 ? 'minutes' : 'minute'}`;
    }

    const hoursDiff = differenceInHours(now, date);
    if (hoursDiff < 24) {
        return `${hoursDiff} ${hoursDiff > 1 ? 'heures' : 'heure'}`;
    }

    const daysDiff = differenceInDays(now, date);
    if (daysDiff < 7) {
        return `${daysDiff} ${daysDiff > 1 ? 'jours' : 'jour'}`;
    }

    const monthsDiff = differenceInMonths(now, date);
    if (monthsDiff < 12) {
        return `${monthsDiff} ${monthsDiff > 1 ? 'mois' : 'mois'}`; // "mois" is the same in singular and plural in French
    }

    const yearsDiff = differenceInYears(now, date);
    return `${yearsDiff} ${yearsDiff > 1 ? 'ans' : 'an'}`;
}

export function parseDuration(durationString: string): string {

    let duration = moment.duration(durationString);

    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();

    let durationParsed = "";
    if (hours > 0) {
        durationParsed += `${hours}:`;
    }

    durationParsed += `${minutes.toString().padStart(2, '0')}:`;
    durationParsed += seconds.toString().padStart(2, '0');

    return durationParsed; // retourne la durée en secondes
}

export function parseViews(viewCount: number|null): String {
    
    if (viewCount === 0 || viewCount === null) {
        return "aucune vue";
    } 
    else if (viewCount === 1) {
        return "1 vue";
    } 
    else if (viewCount < 1000) {
        return `${viewCount} vues`;
    } 
    else if (viewCount < 1000000) {
        return `${(viewCount / 1000).toFixed(1).replace(/\.0$/, '')}k vues`;
    } 
    else {
        return `${(viewCount / 1000000).toFixed(1).replace(/\.0$/, '')}M vues`;
    }
}