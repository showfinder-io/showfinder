// Export GSC ciblé gabarits prestataires + lieux (FR et EN), fenêtre 2026-09-30 -> 2026-10-27
import { readFileSync, writeFileSync } from "node:fs";
import os from "node:os"; import path from "node:path";
const S = path.join(os.homedir(), "Projects/glyphe/.secrets");
const creds = JSON.parse(readFileSync(path.join(S,"gsc-oauth-credentials.json"),"utf8")).installed;
const tok = JSON.parse(readFileSync(path.join(S,"google-oauth-token-gsc-ga4.json"),"utf8"));
const OUT = process.argv[2];
const r = await fetch("https://oauth2.googleapis.com/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({client_id:creds.client_id,client_secret:creds.client_secret,refresh_token:tok.refresh_token,grant_type:"refresh_token"})});
const at = (await r.json()).access_token;
const SITE = encodeURIComponent("sc-domain:agoris.io");
async function q(dimensions, filters, startDate="2026-09-30", endDate="2026-10-27") {
  let all=[], startRow=0;
  for(;;){
    const body={startDate,endDate,dimensions,rowLimit:25000,startRow,dataState:"final"};
    if(filters) body.dimensionFilterGroups=[{groupType:"and",filters}];
    const res=await fetch(`https://www.googleapis.com/webmasters/v3/sites/${SITE}/searchAnalytics/query`,{method:"POST",headers:{Authorization:`Bearer ${at}`,"Content-Type":"application/json"},body:JSON.stringify(body)});
    if(!res.ok) throw new Error(await res.text());
    const rows=(await res.json()).rows??[]; all=all.concat(rows);
    if(rows.length<25000) break; startRow+=25000;
  }
  return all;
}
const out={};
for (const [name, re] of [["prestataires","/prestataires/"],["lieux","/lieux/"]]) {
  const f=[{dimension:"page",operator:"includingRegex",expression:`agoris\\.io(/en)?${re}`}];
  out[name]={
    total: await q([], f),
    pages: await q(["page"], f),
    queryPage: await q(["query","page"], f),
    device: await q(["device"], f),
    pageDevice: await q(["page","device"], f),
    country: await q(["country"], f),
    queryPageDevice: await q(["query","page","device"], f),
  };
}
out.all = { total: await q([], null), pages: await q(["page"], null) };
// Courbe CTR x position de référence : fiches salons (requête x page)
out.salonsQueryPage = await q(["query","page"], [{dimension:"page",operator:"includingRegex",expression:"agoris\\.io(/en)?/salons/"}]);
writeFileSync(OUT, JSON.stringify(out));
for (const k of ["prestataires","lieux"]) console.log(k, JSON.stringify(out[k].total), "pages", out[k].pages.length, "qp", out[k].queryPage.length);
console.log("all", JSON.stringify(out.all.total));
