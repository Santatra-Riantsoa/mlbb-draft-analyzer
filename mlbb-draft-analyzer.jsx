import { useState, useMemo } from "react";

const HEROES = [
  { name: "Aldous", roles: ["Fighter"], early: 1.5, mid: 3.0, late: 5.0, damage: 4.5, survive: 3.5, control: 1.5, push: 2.5, coord: 3.0 },
  { name: "Alice", roles: ["Mage", "Tank"], early: 2.0, mid: 3.5, late: 4.5, damage: 3.8, survive: 4.2, control: 2.5, push: 3.0, coord: 3.5 },
  { name: "Alucard", roles: ["Fighter"], early: 3.0, mid: 3.5, late: 4.0, damage: 4.0, survive: 4.5, control: 1.0, push: 2.5, coord: 2.0 },
  { name: "Angela", roles: ["Support"], early: 3.0, mid: 4.0, late: 4.0, damage: 2.0, survive: 2.5, control: 3.0, push: 1.5, coord: 5.0 },
  { name: "Atlas", roles: ["Tank"], early: 3.5, mid: 4.0, late: 3.5, damage: 2.0, survive: 4.5, control: 5.0, push: 2.0, coord: 4.5 },
  { name: "Aulus", roles: ["Fighter"], early: 2.5, mid: 3.5, late: 4.5, damage: 4.5, survive: 3.5, control: 1.0, push: 3.0, coord: 2.5 },
  { name: "Aurora", roles: ["Mage"], early: 3.0, mid: 4.0, late: 3.5, damage: 4.5, survive: 2.0, control: 5.0, push: 2.5, coord: 3.5 },
  { name: "Badang", roles: ["Fighter"], early: 3.5, mid: 4.0, late: 3.5, damage: 3.5, survive: 3.0, control: 4.0, push: 4.5, coord: 3.0 },
  { name: "Balmond", roles: ["Fighter"], early: 3.0, mid: 3.5, late: 3.5, damage: 3.5, survive: 4.0, control: 2.5, push: 3.5, coord: 2.5 },
  { name: "Bane", roles: ["Fighter", "Mage"], early: 3.0, mid: 3.5, late: 3.5, damage: 3.5, survive: 3.5, control: 2.5, push: 4.0, coord: 3.0 },
  { name: "Barats", roles: ["Fighter", "Tank"], early: 2.0, mid: 3.0, late: 4.5, damage: 4.0, survive: 4.5, control: 3.5, push: 3.0, coord: 3.0 },
  { name: "Baxia", roles: ["Tank"], early: 4.0, mid: 4.0, late: 3.5, damage: 2.5, survive: 4.5, control: 3.5, push: 3.5, coord: 4.0 },
  { name: "Beatrix", roles: ["Marksman"], early: 3.5, mid: 4.5, late: 4.5, damage: 5.0, survive: 2.5, control: 2.0, push: 3.5, coord: 3.5 },
  { name: "Belerick", roles: ["Tank"], early: 3.0, mid: 3.5, late: 3.5, damage: 2.5, survive: 5.0, control: 3.5, push: 2.5, coord: 3.5 },
  { name: "Benedetta", roles: ["Assassin"], early: 3.5, mid: 4.5, late: 4.0, damage: 4.5, survive: 3.5, control: 2.5, push: 3.0, coord: 3.0 },
  { name: "Bruno", roles: ["Marksman"], early: 3.0, mid: 4.0, late: 5.0, damage: 5.0, survive: 2.5, control: 2.0, push: 3.5, coord: 3.0 },
  { name: "Carmilla", roles: ["Support", "Tank"], early: 3.5, mid: 3.5, late: 3.0, damage: 2.5, survive: 3.5, control: 4.5, push: 2.0, coord: 4.5 },
  { name: "Cecilion", roles: ["Mage"], early: 1.5, mid: 3.0, late: 5.0, damage: 5.0, survive: 2.5, control: 3.0, push: 2.5, coord: 3.0 },
  { name: "Chang'e", roles: ["Mage"], early: 2.5, mid: 3.5, late: 4.5, damage: 5.0, survive: 2.0, control: 2.5, push: 3.0, coord: 3.0 },
  { name: "Chip", roles: ["Tank", "Support"], early: 4.0, mid: 4.0, late: 3.5, damage: 2.0, survive: 4.5, control: 4.5, push: 2.5, coord: 5.0 },
  { name: "Chou", roles: ["Fighter"], early: 3.5, mid: 4.5, late: 4.0, damage: 3.5, survive: 3.5, control: 5.0, push: 2.5, coord: 4.0 },
  { name: "Cici", roles: ["Fighter"], early: 4.0, mid: 4.5, late: 4.0, damage: 4.0, survive: 4.0, control: 3.0, push: 3.5, coord: 3.0 },
  { name: "Claude", roles: ["Marksman"], early: 2.0, mid: 3.5, late: 5.0, damage: 5.0, survive: 2.5, control: 2.0, push: 3.5, coord: 3.5 },
  { name: "Clint", roles: ["Marksman"], early: 4.0, mid: 4.0, late: 4.0, damage: 4.5, survive: 2.5, control: 2.0, push: 3.5, coord: 2.5 },
  { name: "Cyclops", roles: ["Mage"], early: 3.5, mid: 4.0, late: 4.0, damage: 4.0, survive: 2.5, control: 4.5, push: 2.5, coord: 3.5 },
  { name: "Dyrroth", roles: ["Fighter"], early: 4.0, mid: 4.5, late: 4.0, damage: 4.5, survive: 3.5, control: 3.0, push: 3.0, coord: 3.0 },
  { name: "Edith", roles: ["Tank", "Marksman"], early: 3.0, mid: 4.0, late: 4.5, damage: 4.0, survive: 4.5, control: 3.5, push: 3.5, coord: 3.5 },
  { name: "Esmeralda", roles: ["Tank", "Mage"], early: 3.0, mid: 4.0, late: 4.5, damage: 3.5, survive: 5.0, control: 2.5, push: 3.0, coord: 3.5 },
  { name: "Estes", roles: ["Support"], early: 3.0, mid: 4.0, late: 4.0, damage: 1.5, survive: 3.0, control: 2.5, push: 2.0, coord: 5.0 },
  { name: "Fanny", roles: ["Assassin"], early: 3.5, mid: 5.0, late: 4.0, damage: 4.5, survive: 3.0, control: 1.5, push: 3.5, coord: 3.5 },
  { name: "Floryn", roles: ["Support"], early: 2.5, mid: 3.5, late: 4.5, damage: 2.0, survive: 3.0, control: 2.0, push: 2.0, coord: 5.0 },
  { name: "Franco", roles: ["Tank"], early: 4.0, mid: 4.0, late: 3.0, damage: 2.5, survive: 4.0, control: 5.0, push: 2.5, coord: 4.5 },
  { name: "Fredrinn", roles: ["Fighter", "Tank"], early: 3.0, mid: 4.0, late: 4.5, damage: 3.5, survive: 4.5, control: 4.0, push: 3.0, coord: 3.5 },
  { name: "Freya", roles: ["Fighter"], early: 3.5, mid: 4.0, late: 3.5, damage: 4.0, survive: 4.0, control: 3.0, push: 3.5, coord: 3.0 },
  { name: "Gatotkaca", roles: ["Tank", "Fighter"], early: 3.0, mid: 3.5, late: 3.5, damage: 3.0, survive: 4.5, control: 4.5, push: 2.5, coord: 4.0 },
  { name: "Gloo", roles: ["Tank"], early: 3.5, mid: 3.5, late: 3.5, damage: 2.5, survive: 5.0, control: 4.0, push: 2.5, coord: 3.5 },
  { name: "Gord", roles: ["Mage"], early: 2.0, mid: 3.0, late: 4.5, damage: 5.0, survive: 1.5, control: 2.5, push: 3.0, coord: 2.5 },
  { name: "Granger", roles: ["Marksman"], early: 3.5, mid: 4.5, late: 4.5, damage: 5.0, survive: 3.0, control: 2.0, push: 3.5, coord: 3.0 },
  { name: "Grock", roles: ["Tank"], early: 4.0, mid: 4.0, late: 3.5, damage: 3.0, survive: 4.5, control: 4.0, push: 4.5, coord: 4.0 },
  { name: "Guinevere", roles: ["Fighter", "Mage"], early: 4.0, mid: 4.5, late: 4.0, damage: 4.5, survive: 3.0, control: 4.5, push: 3.0, coord: 3.5 },
  { name: "Gusion", roles: ["Assassin"], early: 3.5, mid: 5.0, late: 4.0, damage: 5.0, survive: 3.0, control: 2.5, push: 3.0, coord: 3.5 },
  { name: "Hanabi", roles: ["Marksman"], early: 2.0, mid: 3.5, late: 5.0, damage: 4.5, survive: 2.5, control: 3.5, push: 4.5, coord: 3.0 },
  { name: "Hanzo", roles: ["Assassin"], early: 2.0, mid: 3.5, late: 5.0, damage: 4.5, survive: 3.0, control: 2.0, push: 3.0, coord: 3.0 },
  { name: "Harith", roles: ["Mage"], early: 3.5, mid: 4.5, late: 4.5, damage: 4.5, survive: 4.0, control: 3.5, push: 3.0, coord: 3.5 },
  { name: "Harley", roles: ["Mage", "Assassin"], early: 3.5, mid: 4.5, late: 4.0, damage: 5.0, survive: 2.5, control: 2.5, push: 3.0, coord: 3.0 },
  { name: "Hayabusa", roles: ["Assassin"], early: 3.0, mid: 4.5, late: 4.5, damage: 5.0, survive: 3.5, control: 1.5, push: 3.5, coord: 2.5 },
  { name: "Helcurt", roles: ["Assassin"], early: 4.0, mid: 4.5, late: 4.0, damage: 4.5, survive: 3.5, control: 4.0, push: 3.0, coord: 3.0 },
  { name: "Hilda", roles: ["Fighter", "Tank"], early: 4.5, mid: 4.0, late: 3.5, damage: 3.5, survive: 4.5, control: 3.0, push: 4.0, coord: 3.5 },
  { name: "Hylos", roles: ["Tank"], early: 3.5, mid: 3.5, late: 3.5, damage: 2.5, survive: 5.0, control: 4.5, push: 3.0, coord: 4.5 },
  { name: "Irithel", roles: ["Marksman"], early: 2.5, mid: 3.5, late: 5.0, damage: 5.0, survive: 2.5, control: 1.5, push: 4.0, coord: 2.5 },
  { name: "Johnson", roles: ["Tank"], early: 3.5, mid: 4.0, late: 3.5, damage: 2.5, survive: 4.5, control: 5.0, push: 3.0, coord: 5.0 },
  { name: "Joy", roles: ["Assassin"], early: 4.0, mid: 5.0, late: 4.0, damage: 5.0, survive: 4.0, control: 3.5, push: 3.0, coord: 3.0 },
  { name: "Julian", roles: ["Fighter", "Mage"], early: 3.5, mid: 4.5, late: 4.5, damage: 5.0, survive: 3.5, control: 3.0, push: 3.5, coord: 3.0 },
  { name: "Kadita", roles: ["Mage", "Assassin"], early: 3.0, mid: 4.0, late: 4.5, damage: 4.5, survive: 4.0, control: 3.5, push: 2.5, coord: 3.0 },
  { name: "Kagura", roles: ["Mage"], early: 3.0, mid: 4.5, late: 5.0, damage: 5.0, survive: 3.5, control: 4.5, push: 2.5, coord: 4.0 },
  { name: "Kaja", roles: ["Fighter", "Support"], early: 3.5, mid: 4.0, late: 3.5, damage: 3.0, survive: 3.5, control: 5.0, push: 2.5, coord: 4.5 },
  { name: "Karrie", roles: ["Marksman"], early: 2.5, mid: 3.5, late: 5.0, damage: 5.0, survive: 3.0, control: 1.5, push: 3.5, coord: 2.5 },
  { name: "Khufra", roles: ["Tank"], early: 4.0, mid: 4.0, late: 3.5, damage: 2.5, survive: 4.5, control: 5.0, push: 3.0, coord: 4.5 },
  { name: "Kimmy", roles: ["Marksman", "Mage"], early: 3.5, mid: 4.0, late: 4.5, damage: 4.5, survive: 2.5, control: 2.5, push: 4.0, coord: 3.0 },
  { name: "Lancelot", roles: ["Assassin"], early: 3.5, mid: 5.0, late: 4.0, damage: 5.0, survive: 3.5, control: 2.0, push: 3.0, coord: 3.5 },
  { name: "Lapu-Lapu", roles: ["Fighter"], early: 3.5, mid: 4.0, late: 4.5, damage: 4.5, survive: 4.0, control: 3.0, push: 3.5, coord: 3.5 },
  { name: "Layla", roles: ["Marksman"], early: 1.5, mid: 2.5, late: 5.0, damage: 5.0, survive: 1.5, control: 1.0, push: 4.5, coord: 2.0 },
  { name: "Leomord", roles: ["Fighter"], early: 3.0, mid: 4.0, late: 4.5, damage: 4.5, survive: 4.0, control: 3.0, push: 3.5, coord: 3.0 },
  { name: "Lesley", roles: ["Marksman", "Assassin"], early: 3.0, mid: 4.0, late: 5.0, damage: 5.0, survive: 2.5, control: 1.5, push: 3.5, coord: 2.5 },
  { name: "Ling", roles: ["Assassin"], early: 3.0, mid: 5.0, late: 4.5, damage: 5.0, survive: 4.0, control: 2.5, push: 3.5, coord: 3.5 },
  { name: "Lolita", roles: ["Tank", "Support"], early: 3.5, mid: 3.5, late: 3.5, damage: 2.5, survive: 4.5, control: 4.5, push: 2.5, coord: 4.5 },
  { name: "Lunox", roles: ["Mage"], early: 3.5, mid: 4.5, late: 5.0, damage: 5.0, survive: 3.5, control: 2.5, push: 2.5, coord: 3.0 },
  { name: "Luo Yi", roles: ["Mage"], early: 3.0, mid: 4.0, late: 4.5, damage: 4.5, survive: 2.5, control: 5.0, push: 3.0, coord: 4.5 },
  { name: "Lylia", roles: ["Mage"], early: 3.0, mid: 4.0, late: 4.5, damage: 5.0, survive: 3.0, control: 3.0, push: 4.0, coord: 3.0 },
  { name: "Mathilda", roles: ["Support", "Assassin"], early: 4.0, mid: 4.5, late: 4.0, damage: 3.5, survive: 3.5, control: 4.0, push: 3.0, coord: 5.0 },
  { name: "Melissa", roles: ["Marksman"], early: 3.0, mid: 4.0, late: 4.5, damage: 4.5, survive: 3.5, control: 3.0, push: 3.5, coord: 3.5 },
  { name: "Minotaur", roles: ["Tank", "Support"], early: 3.5, mid: 4.0, late: 3.5, damage: 2.5, survive: 4.5, control: 5.0, push: 2.5, coord: 4.5 },
  { name: "Minsitthar", roles: ["Fighter"], early: 3.5, mid: 4.0, late: 3.5, damage: 3.5, survive: 3.5, control: 4.5, push: 3.0, coord: 4.0 },
  { name: "Moskov", roles: ["Marksman"], early: 3.0, mid: 4.0, late: 5.0, damage: 5.0, survive: 2.5, control: 3.0, push: 4.0, coord: 2.5 },
  { name: "Natan", roles: ["Marksman"], early: 3.0, mid: 4.0, late: 5.0, damage: 5.0, survive: 3.0, control: 2.5, push: 3.5, coord: 3.0 },
  { name: "Nolan", roles: ["Assassin"], early: 4.5, mid: 5.0, late: 4.0, damage: 5.0, survive: 3.5, control: 2.5, push: 3.0, coord: 3.0 },
  { name: "Novia", roles: ["Marksman"], early: 3.5, mid: 4.5, late: 4.5, damage: 5.0, survive: 3.0, control: 1.5, push: 3.5, coord: 3.0 },
  { name: "Odette", roles: ["Mage"], early: 2.5, mid: 3.5, late: 4.5, damage: 4.5, survive: 2.5, control: 4.5, push: 3.0, coord: 4.0 },
  { name: "Paquito", roles: ["Fighter"], early: 4.5, mid: 5.0, late: 4.0, damage: 5.0, survive: 4.0, control: 4.0, push: 3.0, coord: 3.5 },
  { name: "Pharsa", roles: ["Mage"], early: 2.5, mid: 3.5, late: 5.0, damage: 5.0, survive: 2.0, control: 3.5, push: 3.5, coord: 3.5 },
  { name: "Popol & Kupa", roles: ["Marksman", "Support"], early: 4.0, mid: 4.0, late: 4.0, damage: 3.5, survive: 3.0, control: 3.5, push: 4.5, coord: 3.5 },
  { name: "Rafaela", roles: ["Support"], early: 3.0, mid: 3.5, late: 3.5, damage: 2.0, survive: 2.5, control: 3.5, push: 2.0, coord: 4.5 },
  { name: "Roger", roles: ["Fighter", "Marksman"], early: 3.5, mid: 4.0, late: 4.5, damage: 4.5, survive: 4.0, control: 3.0, push: 3.5, coord: 3.0 },
  { name: "Ruby", roles: ["Fighter"], early: 3.5, mid: 3.5, late: 4.0, damage: 3.0, survive: 4.5, control: 5.0, push: 2.5, coord: 4.5 },
  { name: "Saber", roles: ["Assassin"], early: 3.5, mid: 4.5, late: 4.0, damage: 5.0, survive: 3.0, control: 4.0, push: 3.0, coord: 3.0 },
  { name: "Selena", roles: ["Assassin", "Mage"], early: 4.5, mid: 5.0, late: 3.5, damage: 5.0, survive: 2.5, control: 5.0, push: 3.0, coord: 4.0 },
  { name: "Silvanna", roles: ["Fighter"], early: 4.0, mid: 4.5, late: 4.0, damage: 4.0, survive: 3.5, control: 4.5, push: 3.0, coord: 3.5 },
  { name: "Sun", roles: ["Fighter"], early: 3.0, mid: 3.5, late: 4.5, damage: 4.0, survive: 4.0, control: 2.0, push: 5.0, coord: 2.5 },
  { name: "Terizla", roles: ["Fighter"], early: 2.5, mid: 3.5, late: 4.5, damage: 4.5, survive: 4.5, control: 4.0, push: 3.5, coord: 3.5 },
  { name: "Thamuz", roles: ["Fighter"], early: 3.5, mid: 4.0, late: 4.5, damage: 4.5, survive: 4.0, control: 2.5, push: 3.5, coord: 3.0 },
  { name: "Tigreal", roles: ["Tank"], early: 4.0, mid: 4.0, late: 3.5, damage: 2.0, survive: 4.5, control: 5.0, push: 2.5, coord: 5.0 },
  { name: "Uranus", roles: ["Tank"], early: 3.5, mid: 3.5, late: 4.0, damage: 2.5, survive: 5.0, control: 2.5, push: 2.5, coord: 3.5 },
  { name: "Vale", roles: ["Mage"], early: 3.0, mid: 4.0, late: 4.5, damage: 4.5, survive: 2.0, control: 5.0, push: 2.5, coord: 3.5 },
  { name: "Valentina", roles: ["Mage"], early: 3.0, mid: 4.0, late: 5.0, damage: 5.0, survive: 3.0, control: 3.5, push: 3.0, coord: 3.5 },
  { name: "Valir", roles: ["Mage"], early: 3.0, mid: 4.0, late: 4.5, damage: 4.5, survive: 2.5, control: 4.5, push: 4.0, coord: 3.5 },
  { name: "Vexana", roles: ["Mage"], early: 2.0, mid: 3.5, late: 5.0, damage: 5.0, survive: 2.0, control: 3.5, push: 3.0, coord: 3.0 },
  { name: "Wanwan", roles: ["Marksman"], early: 3.5, mid: 4.5, late: 5.0, damage: 5.0, survive: 3.5, control: 3.0, push: 3.0, coord: 3.0 },
  { name: "X.Borg", roles: ["Fighter"], early: 3.5, mid: 4.0, late: 4.0, damage: 4.5, survive: 4.5, control: 2.5, push: 3.5, coord: 3.0 },
  { name: "Xavier", roles: ["Mage"], early: 2.5, mid: 3.5, late: 5.0, damage: 5.0, survive: 2.0, control: 4.0, push: 3.5, coord: 3.5 },
  { name: "Yi Sun-shin", roles: ["Assassin", "Marksman"], early: 4.0, mid: 4.5, late: 4.5, damage: 4.5, survive: 3.0, control: 2.5, push: 4.0, coord: 3.5 },
  { name: "Yin", roles: ["Fighter"], early: 4.0, mid: 5.0, late: 4.0, damage: 5.0, survive: 4.0, control: 3.5, push: 3.0, coord: 3.0 },
  { name: "Yu Zhong", roles: ["Fighter"], early: 3.5, mid: 4.5, late: 5.0, damage: 4.5, survive: 5.0, control: 3.0, push: 3.5, coord: 3.5 },
  { name: "Yve", roles: ["Mage"], early: 2.5, mid: 3.5, late: 5.0, damage: 5.0, survive: 2.5, control: 5.0, push: 3.5, coord: 4.0 },
  { name: "Zhask", roles: ["Mage"], early: 2.5, mid: 3.5, late: 5.0, damage: 5.0, survive: 2.5, control: 3.0, push: 4.5, coord: 3.0 },
  { name: "Zilong", roles: ["Fighter", "Assassin"], early: 4.5, mid: 4.5, late: 4.0, damage: 4.5, survive: 3.5, control: 2.0, push: 4.5, coord: 3.0 },
];

const ROLE_COLORS = {
  Fighter: "#e8a000",
  Tank: "#4da6ff",
  Mage: "#c084fc",
  Assassin: "#f87171",
  Marksman: "#34d399",
  Support: "#fb923c",
};

const ROLE_LABELS = {
  Fighter: "Combattant",
  Tank: "Tank",
  Mage: "Mage",
  Assassin: "Assassin",
  Marksman: "Tireur",
  Support: "Support",
};

const METRICS = [
  { key: "earlyMid", label: "POTENTIEL D\u00c9BUT/MI-PARTIE" },
  { key: "late", label: "POTENTIEL FIN DE PARTIE" },
  { key: "damage", label: "POTENTIEL DE D\u00c9G\u00c2TS" },
  { key: "survive", label: "SURVIVABILIT\u00c9" },
  { key: "control", label: "CAPACIT\u00c9 DE CONTR\u00d4LE" },
  { key: "push", label: "POTENTIEL DE POUSS\u00c9E" },
  { key: "coord", label: "COORDINATION D'\u00c9QUIPE" },
];

function calcTeam(heroes) {
  if (!heroes.length) return null;
  const avg = (key) => heroes.reduce((s, h) => s + h[key], 0) / heroes.length;
  const allMetrics = [
    { key: "early" }, { key: "mid" }, { key: "late" }, { key: "damage" },
    { key: "survive" }, { key: "control" }, { key: "push" }, { key: "coord" },
  ];
  return {
    early: avg("early"),
    mid: avg("mid"),
    late: avg("late"),
    damage: avg("damage"),
    survive: avg("survive"),
    control: avg("control"),
    push: avg("push"),
    coord: avg("coord"),
    earlyMid: parseFloat(((avg("early") + avg("mid")) / 2).toFixed(2)),
    lineup: parseFloat((allMetrics.reduce((s, m) => s + avg(m.key), 0) / allMetrics.length).toFixed(2)),
  };
}

function getWR(hero) {
  const sum = hero.early + hero.mid + hero.late + hero.damage + hero.survive + hero.control + hero.push + hero.coord;
  const base = (sum / 40) * 10 + 45;
  return Math.min(58, Math.max(42, base)).toFixed(1);
}

function MetricBar({ label, a, b }) {
  const max = 10;
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{
        textAlign: "center", fontSize: 11, letterSpacing: 2, color: "#b0c4de",
        marginBottom: 6, fontFamily: "'Rajdhani', sans-serif", fontWeight: 700,
        textTransform: "uppercase"
      }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{
          width: 34, textAlign: "right", fontWeight: 700, fontSize: 15,
          color: a !== null ? "#d0dae8" : "#334455",
          fontFamily: "'Rajdhani', sans-serif",
        }}>
          {a !== null ? a.toFixed(1) : "--"}
        </span>
        <div style={{
          flex: 1, position: "relative", height: 6,
          background: "#0c1828", borderRadius: 3,
          overflow: "hidden"
        }}>
          {a !== null && (
            <div style={{
              position: "absolute", right: "50%", top: 0, height: "100%",
              width: `${(a / max) * 50}%`,
              background: "linear-gradient(to left, #4dd4e6, #2a8aa0)",
              borderRadius: "3px 0 0 3px",
              boxShadow: "0 0 8px #4dd4e640",
              transition: "width 0.4s ease"
            }} />
          )}
          {b !== null && (
            <div style={{
              position: "absolute", left: "50%", top: 0, height: "100%",
              width: `${(b / max) * 50}%`,
              background: "linear-gradient(to right, #4dd4e6, #2a8aa0)",
              borderRadius: "0 3px 3px 0",
              boxShadow: "0 0 8px #4dd4e640",
              transition: "width 0.4s ease"
            }} />
          )}
          <div style={{
            position: "absolute", left: "50%", top: 0, width: 1, height: "100%",
            background: "#2a4060", transform: "translateX(-50%)", zIndex: 1
          }} />
        </div>
        <span style={{
          width: 34, fontWeight: 700, fontSize: 15,
          color: b !== null ? "#d0dae8" : "#334455",
          fontFamily: "'Rajdhani', sans-serif",
        }}>
          {b !== null ? b.toFixed(1) : "--"}
        </span>
      </div>
    </div>
  );
}

function HeroCard({ hero, onRemove, side }) {
  const roleColor = ROLE_COLORS[hero.roles[0]] || "#aaa";
  const sideColor = side === "A" ? "#f0c040" : "#4da6ff";
  return (
    <div style={{
      width: 80, textAlign: "center", position: "relative",
      background: `linear-gradient(180deg, ${roleColor}18, #0a0e1400)`,
      border: `1px solid ${sideColor}25`,
      borderRadius: 8, padding: "8px 4px 6px", flexShrink: 0,
      cursor: "pointer"
    }} onClick={() => onRemove(hero.name)} title="Retirer">
      {/* Avatar */}
      <div style={{
        width: 50, height: 50, borderRadius: "50%", margin: "0 auto 5px",
        background: `linear-gradient(135deg, ${roleColor}35, ${roleColor}10)`,
        border: `2px solid ${roleColor}70`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 22, color: roleColor, fontWeight: 700,
        fontFamily: "'Orbitron', sans-serif",
        boxShadow: `0 0 15px ${roleColor}25, inset 0 0 15px ${roleColor}10`
      }}>
        {hero.name.charAt(0)}
      </div>
      {/* Name */}
      <div style={{
        fontSize: 11, fontWeight: 700, color: "#e8eef4",
        fontFamily: "'Rajdhani', sans-serif", lineHeight: 1.2,
        marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
      }}>{hero.name}</div>
      {/* Roles */}
      <div style={{
        fontSize: 8, color: "#8899aa", fontWeight: 600,
        fontFamily: "'Rajdhani', sans-serif", letterSpacing: 0.3,
        textTransform: "uppercase", lineHeight: 1.2
      }}>{hero.roles.map(r => ROLE_LABELS[r] || r).join("/")}</div>
      {/* Role dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: 3, marginTop: 4 }}>
        {hero.roles.map(r => (
          <div key={r} style={{
            width: 14, height: 14, borderRadius: "50%",
            background: `${ROLE_COLORS[r]}20`,
            border: `1px solid ${ROLE_COLORS[r]}50`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 7, color: ROLE_COLORS[r]
          }}>{(ROLE_LABELS[r] || r).charAt(0)}</div>
        ))}
      </div>
    </div>
  );
}

function BanSlot({ hero, onRemove, side }) {
  const sideColor = side === "A" ? "#f0c040" : "#4da6ff";
  if (!hero) {
    return (
      <div style={{
        width: 50, height: 50, borderRadius: 6,
        border: `1px solid ${sideColor}15`,
        background: "#0a1220",
      }} />
    );
  }
  const roleColor = ROLE_COLORS[hero.roles[0]] || "#aaa";
  return (
    <div style={{
      width: 50, height: 50, borderRadius: 6,
      border: "1px solid #f8717140",
      background: "#150808",
      position: "relative", cursor: "pointer", overflow: "hidden"
    }} onClick={() => onRemove(hero.name)} title={`D\u00e9bannir ${hero.name}`}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          background: `${roleColor}15`, border: `1px solid ${roleColor}25`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, color: `${roleColor}70`, fontWeight: 700,
          fontFamily: "'Orbitron', sans-serif"
        }}>{hero.name.charAt(0)}</div>
      </div>
      {/* Red X overlay */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        background: "rgba(200,20,20,0.15)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 22, color: "#f87171cc", fontWeight: 900
      }}>X</div>
    </div>
  );
}

function HeroSelector({ selected, bans, onToggle, onBan, side, banMode }) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const roles = ["All", ...Object.keys(ROLE_COLORS)];
  const allBanned = [...(bans || [])];
  const allSelected = [...selected];
  const filtered = HEROES.filter(h =>
    (roleFilter === "All" || h.roles.includes(roleFilter)) &&
    h.name.toLowerCase().includes(search.toLowerCase()) &&
    !allSelected.find(s => s.name === h.name) &&
    !allBanned.find(b => b.name === h.name)
  );
  const sideColor = side === "A" ? "#f0c040" : "#4da6ff";

  return (
    <div>
      {/* Search */}
      <div style={{ position: "relative", marginBottom: 8 }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher un h\u00e9ros..."
          style={{
            width: "100%", background: "#0a1220", border: "1px solid #1e305060",
            color: "#ccd6e0", padding: "8px 36px 8px 12px", borderRadius: 6, fontSize: 13,
            fontFamily: "'Rajdhani', sans-serif", boxSizing: "border-box",
            outline: "none"
          }}
        />
        <span style={{
          position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
          color: "#446677", fontSize: 13, pointerEvents: "none"
        }}>p</span>
      </div>

      {/* Role filters */}
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 6 }}>
        {roles.map(r => {
          const label = r === "All" ? "Tous" : (ROLE_LABELS[r] || r);
          return (
            <button key={r} onClick={() => setRoleFilter(r)} style={{
              padding: "3px 10px", borderRadius: 12, fontSize: 11, cursor: "pointer",
              fontFamily: "'Rajdhani', sans-serif", fontWeight: 600,
              background: roleFilter === r ? (ROLE_COLORS[r] || "#3a5068") : "transparent",
              border: `1px solid ${roleFilter === r ? (ROLE_COLORS[r] || "#3a5068") : "#1e305060"}`,
              color: roleFilter === r ? (r === "All" ? "#fff" : "#000") : "#8899aa",
              transition: "all 0.15s"
            }}>{label}</button>
          );
        })}
      </div>

      {/* WR sort indicator */}
      <div style={{
        textAlign: "right", fontSize: 10, color: "#556677", marginBottom: 6,
        fontFamily: "'Rajdhani', sans-serif", fontWeight: 600
      }}>WR \u2193</div>

      {/* Hero grid */}
      <div style={{
        maxHeight: 280, overflowY: "auto", overflowX: "hidden",
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8,
        paddingRight: 2
      }}>
        {filtered
          .sort((a, b) => parseFloat(getWR(b)) - parseFloat(getWR(a)))
          .map(h => {
          const roleColor = ROLE_COLORS[h.roles[0]] || "#aaa";
          const wr = getWR(h);
          const canAct = banMode ? (bans || []).length < 5 : selected.length < 5;
          return (
            <button key={h.name} onClick={() => canAct && (banMode ? onBan(h) : onToggle(h))} style={{
              padding: "8px 2px 6px", borderRadius: 6, cursor: canAct ? "pointer" : "not-allowed",
              fontFamily: "'Rajdhani', sans-serif", fontWeight: 600,
              background: banMode ? "#150808" : "#0c1624",
              border: `1px solid ${banMode ? "#f8717120" : "#1e305040"}`,
              color: canAct ? "#c8d6e4" : "#334455",
              opacity: canAct ? 1 : 0.4,
              transition: "all 0.15s", textAlign: "center",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 2
            }}>
              {/* Avatar circle */}
              <div style={{
                width: 42, height: 42, borderRadius: "50%",
                background: `linear-gradient(135deg, ${roleColor}30, ${roleColor}08)`,
                border: `2px solid ${roleColor}50`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 17, color: roleColor, fontWeight: 700,
                fontFamily: "'Orbitron', sans-serif",
                boxShadow: `0 0 10px ${roleColor}15`,
                marginBottom: 2
              }}>{h.name.charAt(0)}</div>
              {/* Name */}
              <div style={{
                fontSize: 11, fontWeight: 700, color: "#d0dae4",
                lineHeight: 1.1, whiteSpace: "nowrap", overflow: "hidden",
                textOverflow: "ellipsis", maxWidth: "100%"
              }}>{h.name}</div>
              {/* Role label */}
              <div style={{
                fontSize: 8, color: roleColor, letterSpacing: 0.3,
                textTransform: "uppercase", lineHeight: 1.1
              }}>{h.roles.map(r => ROLE_LABELS[r] || r).join("/")}</div>
              {/* Win rate */}
              <div style={{
                fontSize: 10,
                color: parseFloat(wr) >= 52 ? "#34d399" : parseFloat(wr) >= 49 ? "#f0c040" : "#f87171",
                fontWeight: 700
              }}>{wr}% WR</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function VerdictHexagon({ counterIndex }) {
  const isEven = Math.abs(counterIndex) < 0.3;
  const color = isEven ? "#4dd4e6" : counterIndex > 0 ? "#f0c040" : "#4da6ff";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <svg width="80" height="80" viewBox="0 0 100 100">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <polygon
          points="50,5 93,27.5 93,72.5 50,95 7,72.5 7,27.5"
          fill="none" stroke={color} strokeWidth="2"
          opacity="0.5" filter="url(#glow)"
        />
        <polygon
          points="50,18 80,34 80,66 50,82 20,66 20,34"
          fill={`${color}08`} stroke={color} strokeWidth="1.5"
          opacity="0.7"
        />
        <polygon
          points="50,30 68,40 68,60 50,70 32,60 32,40"
          fill={`${color}10`} stroke={color} strokeWidth="1"
          opacity="0.4"
        />
        <text x="50" y="54" textAnchor="middle" fill={color}
          fontFamily="'Orbitron', sans-serif" fontSize="14" fontWeight="700">
          {isEven ? "=" : Math.abs(counterIndex).toFixed(1)}
        </text>
      </svg>
    </div>
  );
}

export default function App() {
  const [teamA, setTeamA] = useState([]);
  const [teamB, setTeamB] = useState([]);
  const [bansA, setBansA] = useState([]);
  const [bansB, setBansB] = useState([]);
  const [banModeA, setBanModeA] = useState(false);
  const [banModeB, setBanModeB] = useState(false);

  const allBans = useMemo(() => [...bansA, ...bansB], [bansA, bansB]);
  const statsA = useMemo(() => calcTeam(teamA), [teamA]);
  const statsB = useMemo(() => calcTeam(teamB), [teamB]);

  const counterIndex = statsA && statsB
    ? parseFloat((statsA.lineup - statsB.lineup).toFixed(1))
    : null;

  const addHero = (team, hero) => {
    if (allBans.find(b => b.name === hero.name)) return;
    if (team === "A") setTeamA(p => p.length < 5 ? [...p, hero] : p);
    else setTeamB(p => p.length < 5 ? [...p, hero] : p);
  };
  const removeHero = (team, name) => {
    if (team === "A") setTeamA(p => p.filter(h => h.name !== name));
    else setTeamB(p => p.filter(h => h.name !== name));
  };
  const addBan = (team, hero) => {
    if (team === "A") setBansA(p => p.length < 5 ? [...p, hero] : p);
    else setBansB(p => p.length < 5 ? [...p, hero] : p);
  };
  const removeBan = (team, name) => {
    if (team === "A") setBansA(p => p.filter(h => h.name !== name));
    else setBansB(p => p.filter(h => h.name !== name));
  };
  const resetDraft = () => {
    setTeamA([]); setTeamB([]); setBansA([]); setBansB([]);
    setBanModeA(false); setBanModeB(false);
  };

  const teamPanel = (side, team, bans, banMode, setBanMode) => {
    const sideColor = side === "A" ? "#f0c040" : "#4da6ff";
    return (
      <div style={{
        background: "#0b1420",
        border: `1px solid ${sideColor}20`,
        borderRadius: 10, padding: "16px 18px",
        boxShadow: `0 0 25px ${sideColor}06, inset 0 0 0 1px ${sideColor}08`
      }}>
        {/* Team header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 14
        }}>
          <span style={{
            fontFamily: "'Orbitron', sans-serif", fontWeight: 900,
            fontSize: 18, color: "#e0e8f0", letterSpacing: 2,
          }}>TEAM {side}</span>
          <span style={{
            fontSize: 16, color: sideColor, fontWeight: 900,
            fontFamily: "'Orbitron', sans-serif",
          }}>{team.length}/5</span>
        </div>

        {/* Bans section */}
        <div style={{ marginBottom: 14 }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginBottom: 8
          }}>
            <span style={{
              fontSize: 13, fontWeight: 700, color: "#e0e8f0",
              fontFamily: "'Rajdhani', sans-serif", letterSpacing: 1
            }}>BANS</span>
            <button onClick={() => setBanMode(!banMode)} style={{
              padding: "5px 18px", borderRadius: 4, fontSize: 12, cursor: "pointer",
              fontFamily: "'Orbitron', sans-serif", fontWeight: 700, letterSpacing: 2,
              background: banMode
                ? "linear-gradient(180deg, #c84040, #8a2020)"
                : "#0c1828",
              border: banMode ? "1px solid #f87171" : "1px solid #2a405a",
              color: banMode ? "#fff" : "#8899aa",
              transition: "all 0.2s"
            }}>BAN</button>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <BanSlot
                key={i}
                hero={bans[i] || null}
                onRemove={n => removeBan(side, n)}
                side={side}
              />
            ))}
          </div>
        </div>

        {/* Picks label */}
        <div style={{
          fontSize: 13, fontWeight: 700, color: "#e0e8f0",
          fontFamily: "'Rajdhani', sans-serif", letterSpacing: 1,
          marginBottom: 8
        }}>Picks</div>

        {/* Selected hero cards */}
        <div style={{
          display: "flex", gap: 6, marginBottom: 16,
          minHeight: 120
        }}>
          {team.map(h => (
            <HeroCard key={h.name} hero={h} onRemove={n => removeHero(side, n)} side={side} />
          ))}
          {Array.from({ length: Math.max(0, 5 - team.length) }).map((_, i) => (
            <div key={`empty-${i}`} style={{
              width: 80, height: 120, borderRadius: 8,
              border: `1px solid ${sideColor}10`,
              background: "#0a1220",
              flexShrink: 0
            }} />
          ))}
        </div>

        {/* Hero selector */}
        <HeroSelector
          selected={[...team, ...(side === "A" ? teamB : teamA)]}
          bans={allBans}
          onToggle={h => addHero(side, h)}
          onBan={h => addBan(side, h)}
          side={side}
          banMode={banMode}
        />
      </div>
    );
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#060e18",
      fontFamily: "'Rajdhani', sans-serif",
      backgroundImage: "radial-gradient(ellipse at 20% 20%, #0d1f35 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, #0d0d25 0%, transparent 50%)"
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&family=Orbitron:wght@700;900&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{
        textAlign: "center", padding: "24px 20px 16px",
        position: "relative",
      }}>
        <div style={{
          fontSize: 32, fontFamily: "'Orbitron', sans-serif", fontWeight: 900,
          letterSpacing: 6, color: "#f0c040",
          textShadow: "0 0 30px #f0c04020, 0 2px 4px rgba(0,0,0,0.6)",
          fontStyle: "italic"
        }}>
          DRAFT ANALYZER
        </div>
        <div style={{
          fontSize: 11, letterSpacing: 6, color: "#4a6a8a", marginTop: 4,
          fontFamily: "'Orbitron', sans-serif", fontWeight: 700
        }}>MOBILE LEGENDS : BANG BANG</div>

        {/* Live + hero count pill */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8, marginTop: 10,
          padding: "4px 16px", borderRadius: 20,
          border: "1px solid #34d39930", background: "#0a1a1a"
        }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%", background: "#34d399",
            boxShadow: "0 0 8px #34d399"
          }} />
          <span style={{
            fontSize: 12, color: "#34d399", fontWeight: 700,
            fontFamily: "'Orbitron', sans-serif", letterSpacing: 2
          }}>LIVE</span>
          <span style={{ color: "#446677", fontSize: 11 }}>-</span>
          <span style={{
            fontSize: 12, color: "#8899aa", fontWeight: 600,
            fontFamily: "'Rajdhani', sans-serif", letterSpacing: 1
          }}>{HEROES.length} HEROES</span>
        </div>

        {/* Reset button */}
        <button onClick={resetDraft} style={{
          position: "absolute", top: 22, right: 24,
          padding: "10px 28px", borderRadius: 4, cursor: "pointer",
          fontFamily: "'Orbitron', sans-serif", fontWeight: 900,
          fontSize: 14, letterSpacing: 3,
          background: "linear-gradient(180deg, #2a3a50, #141e2e)",
          border: "1px solid #f0c04050",
          color: "#f0c040",
          boxShadow: "0 0 20px #f0c04008",
          transition: "all 0.2s"
        }}>RESET</button>
      </div>

      {/* Main 3-column grid */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 360px 1fr",
        gap: 14, maxWidth: 1340, margin: "0 auto", padding: "8px 16px 24px"
      }}>
        {/* Team A */}
        {teamPanel("A", teamA, bansA, banModeA, setBanModeA)}

        {/* Center: Analyse */}
        <div style={{
          background: "#0b1420",
          border: "1px solid #1e305030",
          borderRadius: 10, padding: "18px 22px",
          display: "flex", flexDirection: "column"
        }}>
          {/* Analyse header */}
          <div style={{
            textAlign: "center", marginBottom: 18,
            paddingBottom: 12, borderBottom: "1px solid #1e305040"
          }}>
            <div style={{
              fontFamily: "'Orbitron', sans-serif", fontWeight: 900,
              fontSize: 22, color: "#e0e8f0", letterSpacing: 3,
            }}>Analyse</div>
          </div>

          {/* Metrics */}
          <div style={{ flex: 1 }}>
            {METRICS.map(m => (
              <MetricBar key={m.key} label={m.label}
                a={statsA ? statsA[m.key] : null}
                b={statsB ? statsB[m.key] : null}
              />
            ))}
          </div>

          {/* Verdict */}
          {statsA && statsB ? (
            <div style={{
              textAlign: "center", padding: "14px 0 6px",
              borderTop: "1px solid #1e305040"
            }}>
              <div style={{
                fontSize: 12, letterSpacing: 2, marginBottom: 10,
                fontFamily: "'Orbitron', sans-serif", fontWeight: 700,
                color: Math.abs(counterIndex) < 0.3 ? "#8899aa"
                  : counterIndex > 0 ? "#f0c040" : "#4da6ff"
              }}>
                VERDICT DE DRAFT : {Math.abs(counterIndex) < 0.3
                  ? "MATCH \u00c9QUILIBR\u00c9"
                  : counterIndex > 0 ? "AVANTAGE TEAM A" : "AVANTAGE TEAM B"}
              </div>
              <VerdictHexagon counterIndex={counterIndex} />
            </div>
          ) : (
            <div style={{
              textAlign: "center", color: "#2a3a50", fontSize: 12,
              letterSpacing: 2, paddingTop: 14,
              fontFamily: "'Orbitron', sans-serif"
            }}>
              S\u00c9LECTIONNEZ DES H\u00c9ROS<br />POUR L'ANALYSE
            </div>
          )}

          {/* Lineup ratings */}
          {(statsA || statsB) && (
            <div style={{
              display: "flex", justifyContent: "space-between",
              marginTop: 14, padding: "12px 0 0",
              borderTop: "1px solid #1e305030"
            }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 9, color: "#667788", letterSpacing: 2, marginBottom: 2 }}>LINEUP A</div>
                <div style={{
                  fontSize: 22, fontWeight: 700, color: "#f0c040",
                  fontFamily: "'Orbitron', sans-serif",
                  textShadow: "0 0 10px #f0c04030"
                }}>{statsA ? statsA.lineup : "--"}</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 9, color: "#667788", letterSpacing: 2, marginBottom: 2 }}>DIFF</div>
                <div style={{
                  fontSize: 22, fontWeight: 700,
                  color: counterIndex !== null
                    ? (Math.abs(counterIndex) < 0.3 ? "#8899aa" : counterIndex > 0 ? "#f0c040" : "#4da6ff")
                    : "#334455",
                  fontFamily: "'Orbitron', sans-serif"
                }}>{counterIndex !== null ? (counterIndex >= 0 ? `+${counterIndex}` : counterIndex) : "--"}</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 9, color: "#667788", letterSpacing: 2, marginBottom: 2 }}>LINEUP B</div>
                <div style={{
                  fontSize: 22, fontWeight: 700, color: "#4da6ff",
                  fontFamily: "'Orbitron', sans-serif",
                  textShadow: "0 0 10px #4da6ff30"
                }}>{statsB ? statsB.lineup : "--"}</div>
              </div>
            </div>
          )}
        </div>

        {/* Team B */}
        {teamPanel("B", teamB, bansB, banModeB, setBanModeB)}
      </div>
    </div>
  );
}
