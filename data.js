/* ==========================================================================
   Derma-Defend™ prototype — shared data
   Concept product line for the Galderma GRAD 3.0 submission. Formulations,
   pack formats, prices and test values are proposals, not commercial claims.
   ========================================================================== */
"use strict";

var PACKS = [
  { id:"hf", brand:"CETAPHIL", nm:"Sun Ultra-Light Hydra-Fluid", size:"50 ml", mrp:999,  days:45,
    img:"pack_hydrafluid.png",   gold:false, clinic:false,
    role:"AM base layer for dry and sensitive skin",
    actives:"Tinosorb S + Uvinul A Plus + Ceramide NP",
    pack:"50 ml airless bottle, 1.0 ml calibrated dose pump" },

  { id:"mc", brand:"CETAPHIL", nm:"Sun Matte-Control Gel-Cream", size:"50 g", mrp:1049, days:45,
    img:"pack_mattecontrol.png", gold:false, clinic:false,
    role:"AM base layer for oily and acne-prone skin",
    actives:"Tinosorb S/M + 2% niacinamide + silica",
    pack:"50 g airless tube, plus a 15 g pocket size" },

  { id:"bt", brand:"BILUMA",   nm:"Advanced Tinted Photo-Correct Fluid", size:"40 ml", mrp:1499, days:60,
    img:"pack_biluma_tinted.png", gold:true, clinic:false,
    role:"Active photo-correction — the only SKU that blocks visible light",
    actives:"Tinosorb M + ZinGuard™ ZnO + iron oxides + alpha-arbutin",
    pack:"40 ml airless dropper, three universal tints" },

  { id:"bs", brand:"BILUMA",   nm:"Melano-Block Sun Stick", size:"20 g", mrp:1199, days:90,
    img:"pack_biluma_stick.png", gold:true, clinic:false,
    role:"Midday reapplication, over makeup, without a mirror",
    actives:"Solid filter matrix + 3-O-ethyl ascorbic acid",
    pack:"20 g twist-up with a four-pass dose mark" },

  { id:"am", brand:"CETAPHIL", nm:"Sun Aqua-Mist Invisible Shield", size:"75 ml", mrp:899, days:50,
    img:"pack_aquamist.png",     gold:false, clinic:false,
    role:"Reapplication for reactive and post-procedure skin",
    actives:"Tinosorb blend + madecassoside",
    pack:"75 ml non-aerosol micro-mist" },

  { id:"pp", brand:"CETAPHIL", nm:"Sun Post-Procedure Mineral Fluid", size:"30 ml", mrp:1349, days:40,
    img:"pack_postproc.png",     gold:false, clinic:true,
    role:"Dispensed at the aesthetics practice — not listed in retail",
    actives:"100% mineral ZnO / TiO₂, fragrance-free, lightly tinted",
    pack:"30 ml airless dropper" }
];

var byId = {};
PACKS.forEach(function (p) { byId[p.id] = p; });

/* --------------------------------------------------------------------------
   Skin conditions.

   `tint` means the regimen needs iron oxides, because visible light — not just
   UV — is driving the pigment. `clinical` flags conditions where the honest
   answer is "photoprotection helps, but see a dermatologist for the condition
   itself"; the page says so rather than implying the sunscreen is a treatment.
   -------------------------------------------------------------------------- */
var CONDITIONS = [
  { id:"prevention", label:"No specific concern — prevention",
    why:"Daily photoprotection is the single highest-return step in any routine. Most visible ageing on Indian skin is photoageing, and it accumulates from ordinary commuting and window light, not from beach days.",
    base:"hf", reapply:"bs", tint:false, clinical:false,
    avoid:"Nothing to avoid — the constraint is consistency, not formulation." },

  { id:"melasma", label:"Melasma — symmetrical brown patches",
    why:"Melasma is the condition most sensitive to visible light. Studies in skin of colour consistently find that UV-only sunscreens fail to prevent relapse, while tinted formulas containing iron oxides do materially better. If you take one thing from this tool: for melasma, a tint is not cosmetic.",
    base:"bt", reapply:"bs", tint:true, clinical:true,
    avoid:"Heat and friction also drive melasma. Avoid vigorous rubbing and hot-water face washing." },

  { id:"pih", label:"Post-acne marks (post-inflammatory hyperpigmentation)",
    why:"Every mark left by a spot darkens further with light exposure, which is why marks that would fade in weeks can persist for months. Photoprotection does not fade a mark — it stops the mark from being re-darkened while it fades on its own.",
    base:"mc", reapply:"bs", tint:true, clinical:false,
    avoid:"Picking. It converts a two-week mark into a six-month one." },

  { id:"acne", label:"Active acne or very oily skin",
    why:"The most common reason acne-prone people skip sunscreen is finish, not belief — and skipping it while using retinoids or acids leaves skin more photosensitive than usual. The fix is a formulation problem, not a discipline problem.",
    base:"mc", reapply:"bs", tint:false, clinical:false,
    avoid:"Heavy occlusive creams and anything that reports as comedogenic." },

  { id:"rosacea", label:"Rosacea, flushing or persistent redness",
    why:"Sun exposure is among the most frequently reported rosacea triggers. Mineral filters are usually better tolerated than chemical ones on reactive skin, and a light tint neutralises redness without makeup.",
    base:"pp", reapply:"am", tint:true, clinical:true,
    avoid:"Alcohol-heavy formulas, fragrance, and physical scrubs." },

  { id:"sensitive", label:"Sensitive, reactive or eczema-prone skin",
    why:"Barrier-compromised skin reacts to more of what is put on it, so the filter system matters as much as the SPF number. Mineral filters and a fragrance-free base reduce the number of things that can go wrong.",
    base:"hf", reapply:"am", tint:false, clinical:false,
    avoid:"Fragrance, essential oils, and high-percentage actives layered under sunscreen." },

  { id:"postproc", label:"Recently had a procedure (laser, peel, filler)",
    why:"The four to six weeks after a procedure are the window where photoprotection changes the result. On Fitzpatrick IV–VI skin, post-inflammatory hyperpigmentation is the complication that actually presents, and it is largely preventable.",
    base:"pp", reapply:"am", tint:true, clinical:true,
    avoid:"Chemical filters, fragrance and actives until your clinician clears them." },

  { id:"vitiligo", label:"Vitiligo",
    why:"Depigmented patches have no melanin protection at all and burn readily, while the surrounding skin tans — which widens the contrast. Broad-spectrum protection protects the patches and reduces how much the surrounding skin darkens.",
    base:"hf", reapply:"bs", tint:true, clinical:true,
    avoid:"Sunburn on depigmented areas, which can trigger further spread." }
];

var byCondition = {};
CONDITIONS.forEach(function (c) { byCondition[c.id] = c; });

/* -------------------------------------------------------------- cities ---
   UV index is a representative clear-sky midday annual mean, used to scale
   both the erythema calculation and the filter-stress curve.                */
var CITIES = [
  { name:"New Delhi", uvi:8.4 }, { name:"Mumbai", uvi:9.1 }, { name:"Chennai", uvi:9.6 },
  { name:"Bengaluru", uvi:8.8 }, { name:"Kolkata", uvi:8.2 }, { name:"Hyderabad", uvi:9.0 },
  { name:"Pune", uvi:8.9 },      { name:"Ahmedabad", uvi:9.3 }, { name:"Chandigarh", uvi:7.6 },
  { name:"Shillong", uvi:7.1 }
];

/* ------------------------------------------------------- batch registry --- */
var BATCHES = {
  "DD-2027-04-118": { spf:"52.4", uva:"19.8", ratio:"0.38 — PA++++", cw:"378 nm", ret:"94% retained",
    panel:"n = 22, Fitzpatrick III–V", sku:"Cetaphil Sun Ultra-Light Hydra-Fluid 50 ml", rel:"12 April 2027" },
  "DD-2027-06-204": { spf:"51.1", uva:"19.1", ratio:"0.37 — PA++++", cw:"377 nm", ret:"93% retained",
    panel:"n = 20, Fitzpatrick IV–VI", sku:"Biluma Advanced Tinted Photo-Correct 40 ml", rel:"3 June 2027" },
  "DD-2027-08-311": { spf:"53.0", uva:"20.4", ratio:"0.38 — PA++++", cw:"379 nm", ret:"95% retained",
    panel:"n = 21, Fitzpatrick IV–VI", sku:"Cetaphil Sun Post-Procedure Mineral Fluid 30 ml", rel:"19 August 2027" }
};

/* ---------------------------------------------------------------- funnel --- */
var FUNNEL = [
  ["Sessions on this site",        180000, null, "Quick-commerce carousel, clinic QR codes and organic search."],
  ["Diagnostic completed",          97200, 0.54, "Six questions. Completion is high because the payoff is a number about you."],
  ["Sun-Rx regimen generated",      74900, 0.77, "Every completion produces a basket, not a leaflet."],
  ["Result card shared",            17200, 0.23, "The share loop. Earned reach, at no media cost."],
  ["First order placed",            14200, 0.19, "Against the completion count, not the session count."],
  ["Auto-replenishment started",     4830, 0.34, "Attach rate on first orders, on the 45-day pack cycle."]
];
