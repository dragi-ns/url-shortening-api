import { v4 as uuidv4 } from 'uuid';
import { ShortenedLink } from './interfaces/ShortenedLink';

export async function shortenLink(
  link: string
): Promise<[ShortenedLink | null, any]> {
  try {
    const response = await fetch(
      `https://api.shrtco.de/v2/shorten?url=${link}`
    );
    if (!response.ok) {
      // TODO: Better message
      throw Error('Please add a valid link');
    }
    const data = await response.json();
    return [
      { id: uuidv4(), original: link, short: data.result.full_short_link2 },
      null,
    ];
  } catch (error) {
    return [null, error];
  }
}
