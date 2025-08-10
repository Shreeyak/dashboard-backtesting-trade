import { type Trade } from "../types";
import type { UTCTimestamp } from "lightweight-charts";

export function generateTimeValues(intervalMinutes: number, points: number): UTCTimestamp[] {
  const timeValues: UTCTimestamp[] = [];
  // Get current time in Asia/Kolkata
  const now = new Date();
  const offset = 5.5 * 60; // IST offset in minutes
  // Calculate today's 9:15 in Asia/Kolkata
  const local = new Date(now.getTime() + (now.getTimezoneOffset() + offset) * 60000);
  let start = new Date(local);
  start.setHours(9, 15, 0, 0);
  if (local.getHours() < 9 || (local.getHours() === 9 && local.getMinutes() < 15)) {
    // If before 9:15, use yesterday
    start.setDate(start.getDate() - 1);
  }
  let dt = new Date(start);
  for (let i = 0; i < points; i++) {
    timeValues.push(Math.floor(dt.getTime() / 1000) as UTCTimestamp);
    dt.setMinutes(dt.getMinutes() + intervalMinutes);
    // If we reach 15:30, jump to next day's 9:15
    if (dt.getHours() > 15 || (dt.getHours() === 15 && dt.getMinutes() > 30)) {
      dt.setDate(dt.getDate() + 1);
      dt.setHours(9, 15, 0, 0);
    }
  }
  return timeValues;
}

export function generateCandles(timeValues: UTCTimestamp[]) {
  const candles = [];
  let nextOpen = 150;

  for (const ts of timeValues) {
    const open = nextOpen;
    const close = open - (Math.random() - 0.5) * 90;
    const high = Math.max(open, close) + Math.random() * 25;
    const low = Math.min(open, close) - Math.random() * 25;

    candles.push({ time: ts, open: open, high: high, low: low, close: close });
    nextOpen = close;
  }

  return candles;
}

// Generates EMA indicator data for the given candles and time values (period 3, using close)
export function generateIndicatorData(timeValues: UTCTimestamp[], candles: { close: number }[], indicatorName: string) {
  const indicatorData = [];
  const period = 14;
  const k = 2 / (period + 1);
  let emaPrev = candles[0]?.close ?? 0;

  for (let i = 0; i < timeValues.length; i++) {
    const close = candles[i]?.close ?? emaPrev;
    if (i === 0) {
      emaPrev = close;
    } else {
      emaPrev = close * k + emaPrev * (1 - k);
    }
    indicatorData.push({ time: timeValues[i], value: emaPrev });
  }

  return {
    name: indicatorName,
    data: indicatorData,
  };
}

// Generates mock trades and markers for a given series of candles
// Returns { trades, markers }
export function generateMockTradesAndMarkers(candles) {
  const minTrades = 3;
  const maxTrades = 7;
  const numTrades = Math.floor(Math.random() * (maxTrades - minTrades + 1)) + minTrades;
  const trades = [];
  const markers = [];
  const usedIndices = new Set();

  // Helper to pick a random index not already used
  function pickIndex(range, exclude = []) {
    let idx;
    do {
      idx = Math.floor(Math.random() * range);
    } while (exclude.includes(idx) || usedIndices.has(idx));
    usedIndices.add(idx);
    return idx;
  }

  for (let i = 0; i < numTrades; i++) {
    // Pick entry index (avoid last 20 candles for entry)
    const maxEntryIdx = candles.length - 21;
    const entryIdx = pickIndex(maxEntryIdx >= 0 ? maxEntryIdx : 0); // avoid last 20 candles for entry

    // Pick exit index between 3-20 candles after entry
    const minExitOffset = 3;
    const maxExitOffset = 20;
    const maxPossibleOffset = candles.length - entryIdx - 1;
    const exitOffsetRange = Math.max(Math.min(maxExitOffset, maxPossibleOffset), minExitOffset);
    const exitOffset = Math.floor(Math.random() * (exitOffsetRange - minExitOffset + 1)) + minExitOffset;
    const exitIdx = entryIdx + exitOffset;
    const entryCandle = candles[entryIdx];
    const exitCandle = candles[exitIdx];
    const side = Math.random() > 0.5 ? "buy" : "sell";
    const entryQty = Math.floor(Math.random() * 5) + 1;
    const exitQty = entryQty;
    const entryPrice = entryCandle.close;
    const exitPrice = exitCandle.close;
    const pnl = side === "buy" ? (exitPrice - entryPrice) * entryQty : (entryPrice - exitPrice) * entryQty;
    const entrySignal = side === "buy" ? "Breakout Buy" : "Breakout Sell";
    const exitSignal = side === "buy" ? "Target/Stop Sell" : "Target/Stop Buy";

    // Generate a unique random 3-digit trade id
    trades.push({
      id: "0",
      side,
      entryTime: entryCandle.time,
      entryPrice,
      exitTime: exitCandle.time,
      exitPrice,
      entryQty,
      exitQty,
      pnl,
      entrySignal,
      exitSignal,
    });

    // Entry marker
    markers.push({
      id: `entry-${i + 1}`,
      time: entryCandle.time,
      position: "belowBar",
      color: side === "buy" ? "green" : "red",
      shape: side === "buy" ? "arrowUp" : "arrowDown",
      text: side === "buy" ? `Entry Long @ ${entryPrice.toFixed(2)}` : `Entry Short @ ${entryPrice.toFixed(2)}`,
    });
    // Exit marker
    markers.push({
      id: `exit-${i + 1}`,
      time: exitCandle.time,
      position: "aboveBar",
      color: side === "buy" ? "red" : "green",
      shape: side === "buy" ? "arrowDown" : "arrowUp",
      text: side === "buy" ? `Exit Long @ ${exitPrice.toFixed(2)}` : `Exit Short @ ${exitPrice.toFixed(2)}`,
    });
  }

  trades.sort((a, b) => a.entryTime - b.entryTime);
  markers.sort((a, b) => a.time - b.time);

  // Reassign trade IDs to be sequential 3-digit strings in ascending order
  trades.forEach((trade, idx) => {
    trade.id = (idx + 1).toString().padStart(3, "0");
  });

  return { trades, markers };
}

// Generates mock trades in the same format as generateMockTrades(), using generateMockTradesAndMarkers
export function generateRandomMockTrades(trades) {
  let cumulativePnlAmount = 0;
  let cumulativePnlPercentage = 0;
  const result = [];

  // For display only: convert UTC timestamp to local date/time string
  function formatDate(ts) {
    const d = new Date(ts * 1000); // ts is always UTC timestamp (seconds)
    return d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
  }
  function formatTime(ts) {
    const d = new Date(ts * 1000); // ts is always UTC timestamp (seconds)
    return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
  }

  trades.forEach((t, idx) => {
    const pnlPercentage =
      t.side === "buy"
        ? ((t.exitPrice - t.entryPrice) / t.entryPrice) * 100
        : ((t.entryPrice - t.exitPrice) / t.entryPrice) * 100;
    cumulativePnlAmount += t.pnl;
    cumulativePnlPercentage += pnlPercentage;
    result.push({
      tradeId: t.id,
      positionType: t.side === "buy" ? "Long" : "Short",
      entry: {
        type: "Entry",
        date: formatDate(t.entryTime),
        time: formatTime(t.entryTime),
        timeISO: t.entryTime, // UTC timestamp for chart logic
        signal: t.entrySignal,
        price: t.entryPrice,
      },
      exit: {
        type: "Exit",
        date: formatDate(t.exitTime),
        time: formatTime(t.exitTime),
        timeISO: t.exitTime, // UTC timestamp for chart logic
        signal: t.exitSignal,
        price: t.exitPrice,
      },
      positionSize: t.entryQty,
      pnlAmount: t.pnl,
      pnlPercentage,
      cumulativePnlAmount,
      cumulativePnlPercentage,
    });
  });
  return result;
}
