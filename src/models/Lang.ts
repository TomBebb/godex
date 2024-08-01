enum Lang {
  "English" = "English",
  German = "German",
  French = "French",
  Italian = "Italian",
  Japanese = "Japanese",
  Korean = "Korean",
  Spanish = "Spanish",
}
const langs = new Map<Lang, number>(Object.values(Lang).map((l, i) => [l, i]))

export function getLangIndex(lang: Lang): number {
  return langs.get(lang)!
}
export type ByLang<T = string> = Record<Lang, T>

export default Lang
