<script lang="ts">
  import "./app.css";
  import Chart from './lib/Chart.svelte';
  import IntervalButtons from './lib/IntervalButtons.svelte';
  import TradeLog from './lib/TradeLog.svelte';
  import { type Trade } from './types';
  import logo from '/bar-chart.svg';

  /* Logic to set active button for interval selection */
  let activeInterval = '3m';
  const intervals = ['3m', '5m', '15m'];

  // Mock data for backtesting trades table
  let trades = $state<Trade[]>([
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
  ]);
</script>

<main>
  <header class="sticky top-0 z-50">
    <div class="navbar bg-base-100 shadow-sm">
      <img src={logo} alt="robo logo" class="logoheader pl-2 mr-4 flex-initial" />
      <h1 class="text-lg flex-grow text-left">Backtesting Dashboard</h1>
    </div>
  </header>

  <h2 class="text-2xl font-bold text-center mt-4">Backtesting Visualizations</h2>
  <div class="card w-11/12 lg:w-full bg-base-200 max-w-[740px] mx-auto mt-4">
    <div class="card-body">
      <h2 class="card-title mx-auto text-center">Nifty</h2>
      
      <IntervalButtons bind:activeInterval intervals={intervals} />
      
      <Chart interval={activeInterval} />
    </div>  
  </div>

  <div class="card w-11/12 lg:w-10/12 bg-base-200 mx-auto mt-4 p-4">
    <h3 class="text-xl font-bold mb-4">Trade Log</h3>
    <div class="overflow-x-auto">
      <TradeLog {trades} />
    </div>
  </div>
</main>

<style>
  .logoheader {
    height: 40px; /* Adjust as needed to fit within header height */
    max-width: 100px; /* Prevent logo from becoming too wide */
    object-fit: contain; /* Ensure the image fits without distortion */
  }
</style>
