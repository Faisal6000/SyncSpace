import Application from '../../domain/application';
import en from './locales/en.json';

type LocalizedStrings = typeof en;
type LocalizedStringsMap = Record<string, LocalizedStrings>;

const Strings = new Proxy({} as LocalizedStrings, {
  get(_target, prop: string) {
    const lang = Application.getCurrentLanguageCode();
    const allStrings = Application.getLocalizedStrings() as LocalizedStringsMap;

    const strings =
      allStrings?.[lang] ??
      allStrings?.['en'] ??
      (en as LocalizedStrings); // Bundled fallback

    return (
      strings?.[prop as keyof LocalizedStrings] ??
      (en as LocalizedStrings)[prop as keyof LocalizedStrings]
    );
  },
});

export default Strings;
