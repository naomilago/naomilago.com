import en from './en.json';
import pt from './pt.json';

const translations: Record<string, Record<string, string>> = { en, pt };

export function t(locale: string, key: string): string {
  return (translations[locale] ?? translations['en'])[key] ?? key;
}

export function getLangFromUrl(url: URL): string {
  const [, lang] = url.pathname.split('/');
  if (lang === 'pt') return 'pt';
  return 'en';
}

export function getLocalizedPath(lang: string, path: string): string {
  if (lang === 'en') return path;
  return `/${lang}${path}`;
}
