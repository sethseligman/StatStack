// scripts/generateDailyChallenge.ts
// Script to generate and upload a daily challenge to Firestore
// Usage: npx ts-node scripts/generateDailyChallenge.ts YYYY-MM-DD

import admin from "firebase-admin";
import path from "path";
import process from "process";
import { readFileSync } from "fs";
import { selectWeightedTeam, updateRecentTeams, getDecayBase, selectWeightedTeamWithFrequencyPenalty } from "../src/utils/teamSelection.ts";
import { calculateOptimalScore } from "../src/utils/scoreCalculator.ts";
import { pathToFileURL } from "url";
import { addDays, format } from "date-fns";
const SERVICE_ACCOUNT_PATH = "/Users/sethseligman/keys/statstack-lite-firebase-adminsdk-fbsvc-ce159ce3f6.json";

const NFL_TEAMS = [
  "Arizona Cardinals", "Atlanta Falcons", "Baltimore Ravens", "Buffalo Bills",
  "Carolina Panthers", "Chicago Bears", "Cincinnati Bengals", "Cleveland Browns",
  "Dallas Cowboys", "Denver Broncos", "Detroit Lions", "Green Bay Packers",
  "Houston Texans", "Indianapolis Colts", "Jacksonville Jaguars", "Kansas City Chiefs",
  "Las Vegas Raiders", "Los Angeles Chargers", "Los Angeles Rams", "Miami Dolphins",
  "Minnesota Vikings", "New England Patriots", "New Orleans Saints", "New York Giants",
  "New York Jets", "Philadelphia Eagles", "Pittsburgh Steelers", "San Francisco 49ers",
  "Seattle Seahawks", "Tampa Bay Buccaneers", "Tennessee Titans", "Washington Commanders"
];

function pickTeamsWithSoftRepeats(allTeams: string[], totalRounds: number = 20): string[] {
  // Step 1: Shuffle and pick 20 unique teams
  const shuffled = [...allTeams].sort(() => Math.random() - 0.5);
  const picks = shuffled.slice(0, totalRounds);

  // Step 2: Soft repeat logic: randomly replace 1–2 picks with earlier teams
  const numRepeats = Math.floor(Math.random() * 2) + 1; // 1–2 repeats
  for (let i = 0; i < numRepeats; i++) {
    const repeatFromIndex = Math.floor(Math.random() * (totalRounds - numRepeats - 1));
    const repeatToIndex = totalRounds - 1 - i; // Replace end picks
    picks[repeatToIndex] = picks[repeatFromIndex];
  }

  // Step 3: Shuffle the final picks so repeats are not always at the end
  for (let i = picks.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [picks[i], picks[j]] = [picks[j], picks[i]];
  }

  return picks;
}

function usageAndExit() {
  console.log("Usage: npx ts-node scripts/generateDailyChallenge.ts YYYY-MM-DD");
  process.exit(1);
}

async function main(dateStr: string) {
  console.log("🚀 Starting daily challenge generation");

  const teams = pickTeamsWithSoftRepeats(NFL_TEAMS, 20);
  console.log("✅ Team selection complete:", teams);

  // Calculate optimal score for the selected teams
  console.log("🧮 Calculating optimal score...");
  let optimalScoreResult;
  try {
    optimalScoreResult = calculateOptimalScore(teams);
    console.log("✅ Optimal score calculated:", {
      maxScore: optimalScoreResult.maxScore,
      resultType: optimalScoreResult.resultType,
      usedTimeout: optimalScoreResult.usedTimeout,
      usedGreedy: optimalScoreResult.usedGreedy
    });
  } catch (err) {
    console.error("❌ Error calculating optimal score:", err);
    console.error("Teams input:", teams);
    throw err;
  }

  // Initialize Firestore
  try {
    const serviceAccount = JSON.parse(readFileSync(SERVICE_ACCOUNT_PATH, "utf8")) as admin.ServiceAccount;
    // Debug logging for admin object
    console.log("🛠️ admin object keys:", Object.keys(admin));
    console.log("🔍 admin.apps:", admin.apps);
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    }
    console.log("✅ Firebase Admin initialized");
  } catch (err) {
    console.error("❌ Error initializing Firebase Admin:", err);
    throw err;
  }

  console.log("📅 Using date:", dateStr);
  const docRef = admin.firestore().collection("dailyChallenges").doc(dateStr);

  const payload = {
    teams,
    optimalScore: optimalScoreResult.maxScore,
    optimalPicks: optimalScoreResult.optimalPicks,
    createdAt: new Date().toISOString()
  };

  console.log("Will write to document:", dateStr);

  try {
    await docRef.set(payload);
    console.log(`✅ Challenge saved to Firestore for ${dateStr}`);
    console.log("📊 Payload:", JSON.stringify(payload, null, 2));
  } catch (err) {
    console.error(`❌ Firestore write failed:`, err);
    console.error("📦 Payload:", JSON.stringify(payload, null, 2));
    throw err;
  }
}

async function generate30Days() {
  for (let i = 0; i < 30; i++) {
    const date = addDays(new Date(), i);
    const dateStr = format(date, "yyyy-MM-dd");
    console.log(`📆 Generating challenge for ${dateStr}`);
    try {
      await main(dateStr);
    } catch (err) {
      console.error(`❌ Failed to generate challenge for ${dateStr}`, err);
    }
  }
}

generate30Days();