<script lang="ts">
  import "./app.css";
  import Chart from './lib/Chart.svelte';
  import IntervalButtons from './lib/IntervalButtons.svelte';
  import TradeLog from './lib/TradeLog.svelte';
  import { generateMockTrades } from './lib/mockData';
  import { type Trade } from './types';
  import logo from '/bar-chart.svg';

  /* Logic to set active button for interval selection */
  let activeInterval = $state('3m');
  const intervals = ['3m', '5m', '15m'];

  // Generate mock data from the new module
  let trades = $state<Trade[]>(generateMockTrades());

  // Reactively update trade data when the interval changes
  $effect(() => {
    // By reading activeInterval here, Svelte automatically re-runs
    // this effect whenever its value changes.
    const _ = activeInterval;
    
    // Simulate fetching new data by regenerating and shuffling the mock trades
    trades = generateMockTrades().sort(() => Math.random() - 0.5);
  });
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
