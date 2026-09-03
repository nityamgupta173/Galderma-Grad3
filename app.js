/* ==========================================================================
   Derma-Defend™ prototype — shared engine

   One model, shared by every page. The six inputs all feed it:

     dose      -> delivered SPF, protection window, pack life, the meter
     skin      -> minutes to erythema at UV index 1
     city      -> UV index: divides that time, and stresses the filters
     screen    -> visible-light load, which is what the tint answers
     condition -> which SKUs sit in each slot, and whether a tint is required
     outdoor   -> how much direct UV the day actually contains

   Nothing here is decorative: every control changes a number you can see.
   ========================================================================== */
"use strict";

var $  = function (id) { return document.getElementById(id); };
var $$ = function (sel, root) { return [].slice.call((root || document).querySelectorAll(sel)); };
var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------------------------------------------- constants */
var SKIN_MIN = { III: 110, IV: 150, V: 210, VI: 300 };   // minutes to erythema at UV index 1
var SKIN_LBL = { III: "Fitzpatrick III", IV: "Fitzpatrick IV",
                 V:   "Fitzpatrick V",   VI: "Fitzpatrick VI" };
var HEV_K    = 0.85;   // pigment weighting of one screen hour against one UV-index hour
var TINT_AT  = 0.32;   // share of pigment load from visible light that justifies iron oxides
var LOAD_REF = 23.6;   // worst realistic combined load, used to index the gauge 0–100

/* ------------------------------------------------------------ shared state */
var DEFAULTS = { skin: "IV", city: "New Delhi", screen: 9.5, dose: 0.7,
                 condition: "melasma", outdoor: 1.4 };
var STATE_KEY = "dd-state";

function loadState() {
  var s = {};
  try { s = JSON.parse(sessionStorage.getItem(STATE_KEY) || "{}") || {}; } catch (e) { s = {}; }
  var out = {};
  Object.keys(DEFAULTS).forEach(function (k) {
    out[k] = (s[k] === undefined || s[k] === null) ? DEFAULTS[k] : s[k];
  });
  if (!byCondition[out.condition]) out.condition = DEFAULTS.condition;
  if (!SKIN_MIN[out.skin]) out.skin = DEFAULTS.skin;
  return out;
}
function saveState(s) {
  try { sessionStorage.setItem(STATE_KEY, JSON.stringify(s)); } catch (e) { /* private mode */ }
}
var state = loadState();

function uvi(cityName) {
  var c = CITIES.filter(function (x) { return x.name === (cityName || state.city); })[0];
  return c ? c.uvi : 8.4;
}

/* ------------------------------------------------------------- the model */
function model() {
  var u    = uvi();
  var dose = +state.dose;
  var cond = byCondition[state.condition];

  // Delivered SPF. The linear approximation against the 2.0 mg/cm2 ISO test dose —
  // simple, transparent, and the same one the deck uses.
  var spf  = Math.max(1, Math.round(1 + 49 * dose / 2));
  var bare = SKIN_MIN[state.skin] / u;              // minutes before bare skin reddens
  var prot = bare * spf;                            // minutes with this dose on
  var gap  = Math.max(90, Math.min(240, Math.round(prot / 15) * 15));
  var apps = Math.max(1, Math.ceil(600 / gap) - 1); // reapplications across a 10-hour day
  var pack = Math.round(45 * 2 / Math.max(dose, 0.3));

  // Light budget. UV comes from time outdoors; visible light comes from screens,
  // windows and room lighting, and it reaches the skin all day indoors.
  var uvLoad   = u * (+state.outdoor);
  var hevLoad  = (+state.screen) * HEV_K;
  var total    = uvLoad + hevLoad;
  var hevShare = total > 0 ? hevLoad / total : 0;

  // The layman translation: today's screen exposure expressed as minutes of
  // standing in midday sun, for pigment purposes only.
  var sunEquivMin = Math.round(hevLoad / u * 60);
  var loadIndex   = Math.max(1, Math.min(100, Math.round(total / LOAD_REF * 100)));

  // Does the regimen need iron oxides? Say which trigger fired, so the reason
  // visibly changes when a control moves.
  var reasons = [];
  if (cond.tint)                 reasons.push("your skin concern is driven by visible light");
  if (hevShare >= TINT_AT)       reasons.push("visible light is " + Math.round(hevShare * 100) + "% of today's pigment load");
  if (state.skin === "V" || state.skin === "VI")
                                 reasons.push("deeper skin tones pigment more readily under visible light");
  var tint = reasons.length > 0;

  return { u: u, dose: dose, cond: cond, spf: spf, bare: bare, prot: prot, gap: gap,
           apps: apps, pack: pack, uvLoad: uvLoad, hevLoad: hevLoad, hevShare: hevShare,
           sunEquivMin: sunEquivMin, loadIndex: loadIndex, tint: tint, tintReasons: reasons };
}

/* Build the regimen: a base layer, an optional visible-light layer, a reapply. */
function regimen(m) {
  var rows = [], seen = {};
  function add(id, time, note) {
    if (!id || seen[id]) return;
    seen[id] = 1;
    rows.push({ p: byId[id], time: time, note: note });
  }
  add(m.cond.base, "07:30", "Base layer — two pump strokes at 1.0 ml, face and neck");
  if (m.tint && m.cond.base !== "bt" && m.cond.base !== "pp")
    add("bt", "07:30", "Over the base — iron oxides, because " + m.tintReasons[0]);
  add(m.cond.reapply, hhmm(7.5 * 60 + m.gap),
      "Reapply — cover lapses about every " + (m.gap / 60).toFixed(1) + " hours at this dose");
  return rows;
}

function hhmm(mins) {
  mins = Math.round(mins);
  var h = Math.floor(mins / 60) % 24, k = mins % 60;
  return (h < 10 ? "0" : "") + h + ":" + (k < 10 ? "0" : "") + k;
}
function inr(n) { return "₹" + Math.round(n).toLocaleString("en-IN"); }

/* ------------------------------------------------------------- UI helpers */
function paintRange(el) {
  var pct = (el.value - el.min) / (el.max - el.min) * 100;
  el.style.setProperty("--trackfill",
    "linear-gradient(90deg,var(--blue-700) 0 " + pct + "%, var(--line) " + pct + "% 100%)");
}

function animateTo(el, target, decimals) {
  decimals = decimals || 0;
  var from = parseFloat(el.dataset.v || "0"), t0 = null, dur = 380;
  if (reduce || !el.firstChild) {
    el.dataset.v = target;
    if (el.firstChild) el.firstChild.nodeValue = target.toFixed(decimals);
    return;
  }
  function step(ts) {
    if (!t0) t0 = ts;
    var k = Math.min(1, (ts - t0) / dur), e = 1 - Math.pow(1 - k, 3);
    el.firstChild.nodeValue = (from + (target - from) * e).toFixed(decimals);
    if (k < 1) requestAnimationFrame(step); else el.dataset.v = target;
  }
  requestAnimationFrame(step);
}

var toastT;
function toast(msg) {
  var t = $("toast");
  if (!t) return;
  $("toastTxt").textContent = msg;
  t.classList.add("on");
  clearTimeout(toastT);
  toastT = setTimeout(function () { t.classList.remove("on"); }, 4200);
}

/* Fill the masthead chips, which appear on every page. */
function paintTelemetry() {
  var m = model();
  if ($("chipCity"))   $("chipCity").textContent   = state.city + " · " + m.u.toFixed(1);
  if ($("chipSkin"))   $("chipSkin").textContent   = SKIN_LBL[state.skin];
  if ($("chipHev"))    $("chipHev").textContent    = (+state.screen).toFixed(1) + " h · " +
                                                     Math.round(m.hevShare * 100) + "% of load";
  if ($("chipDose"))   $("chipDose").textContent   = (+state.dose).toFixed(1) + " mg/cm²";
  if ($("chipSpf")) {
    $("chipSpf").textContent = "SPF " + m.spf;
    $("chipSpf").classList.toggle("hot", m.spf < 30);
  }
}

/* Mark the current page in the nav without hard-coding it per file. */
function markNav() {
  var here = location.pathname.split("/").pop() || "index.html";
  $$(".nav a").forEach(function (a) {
    var target = a.getAttribute("href");
    if (target === here) a.setAttribute("aria-current", "page");
  });
}

document.addEventListener("DOMContentLoaded", function () {
  markNav();
  paintTelemetry();
});
