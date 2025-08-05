import { type Trade } from '../types';
import type { UTCTimestamp } from 'lightweight-charts';


export function generateMockTrades(): Trade[] {
  return [
    {
      tradeId: 9,
      positionType: 'Long',
      exit: {
        type: 'Exit',
        date: 'Aug 05, 2025',
        time: '10:20',
        signal: 'Stoploss',
        price: 86.05,
      },
      entry: {
        type: 'Entry',
        date: 'Aug 05, 2025',
        time: '09:40',
        signal: 'KC Breakout Entry',
        price: 94.5,
      },
      positionSize: 1,
      pnlAmount: -673.75,
      pnlPercentage: -9.48,
      cumulativePnlAmount: 498.75,
      cumulativePnlPercentage: -0.07,
    },
    {
      tradeId: 8,
      positionType: 'Long',
      exit: {
        type: 'Exit',
        date: 'Aug 01, 2025',
        time: '09:15',
        signal: 'Target 2',
        price: 97.9,
      },
      entry: {
        type: 'Entry',
        date: 'Jul 31, 2025',
        time: '15:05',
        signal: 'KC Breakout Entry',
        price: 81.6,
      },
      positionSize: 1,
      pnlAmount: 1182.5,
      pnlPercentage: 19.26,
      cumulativePnlAmount: 1172.5,
      cumulativePnlPercentage: 0.12,
    },
    {
      tradeId: 7,
      positionType: 'Long',
      exit: {
        type: 'Exit',
        date: 'Jul 28, 2025',
        time: '13:00',
        signal: 'Target 1',
        price: 124.9,
      },
      entry: {
        type: 'Entry',
        date: 'Jul 28, 2025',
        time: '12:00',
        signal: 'KC Breakout Entry',
        price: 123.0,
      },
      positionSize: 1,
      pnlAmount: 1377.5,
      pnlPercentage: 1.12,
      cumulativePnlAmount: -10.0,
      cumulativePnlPercentage: -0.01,
    },
  ];
}

// Helper: generate mock OHLC data
export function generateMockChartData(intervalMinutes: number, points: number) {
	const data = [];
	let ts = Math.floor(Date.now() / 1000);
	let nextOpen = 150;

	for (let i = 0; i < points; i++) {
		ts -= intervalMinutes * 60;
		const close = nextOpen;
		const open  = close - (Math.random() - 0.5) * 90;
		const high  = Math.max(open, close) + Math.random() * 25;
		const low   = Math.min(open, close) - Math.random() * 25;
		
		data.unshift({ time: ts as UTCTimestamp, open: open, high: high, low: low, close: close});
		nextOpen = open;
	}
	return data;
}
