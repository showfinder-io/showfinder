// Convention monétaire EN (décision Julien 2026-10-03) : symbole avant le montant,
// séparateur de milliers virgule, « excl. VAT » inchangé : « €4,500 », « ~€12,000 »,
// « €2,500-€8,000 ». Transformation purement typographique, aucun montant modifié.
const NUM = String.raw`\d{1,3}(?:[,   ]\d{3})+(?:\.\d+)?|\d+(?:\.\d+)?`;
const grp = (n) => n.replace(/[   ]/g, ",");
export function enCurrency(text) {
  let out = text;
  // Fourchettes : « 2,500-8,000 € » / « 2,500 to 8,000 € »
  out = out.replace(new RegExp(String.raw`(~?)(${NUM})\s?(-|–| to | and )\s?(~?)(${NUM})\s?€`, "g"),
    (_, t1, a, sep, t2, b) => `${t1}€${grp(a)}${sep === "–" ? "-" : sep}${t2}€${grp(b)}`);
  // Montant simple : « 4,500 € », « ~12 000 € »
  out = out.replace(new RegExp(String.raw`(~?)(${NUM})\s?€`, "g"), (_, t, a) => `${t}€${grp(a)}`);
  // « 65 euros », « 1,200 EUR »
  out = out.replace(new RegExp(String.raw`(${NUM})\s?(?:euros?|EUR)\b`, "g"), (_, a) => `€${grp(a)}`);
  return out;
}
