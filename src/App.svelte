<script lang="ts">
  import "./app.css";
  import Chart from './lib/Chart.svelte';
  import IntervalButtons from './lib/IntervalButtons.svelte';
  import TradeLog from './lib/TradeLog.svelte';
  import { generateMockTrades, generateMockChartData } from './lib/mockData';
  import { type Trade } from './types';
  import logo from '/bar-chart.svg';

  /* Logic to set active button for interval selection */
  let drawerOpen = $state(false);
  let selectedSymbol = $state('nifty50');
  const symbolOptions = ['nifty50', 'reliance', 'banknifty'];
  // Example menu options for each symbol
  const symbolMenus: Record<string, string[]> = {
    nifty50: ['Overview', 'Stats', 'Constituents'],
    reliance: ['Profile', 'Financials', 'News'],
    banknifty: ['Summary', 'Options Chain', 'Movers']
  };
  let menuOptions = $derived(symbolMenus[selectedSymbol]);

  // Interval selection (Svelte 5 runes)
  let activeInterval = $state('3m');
  const intervals = ['3m', '5m', '15m'];

  // Generate mock data from the new module
  let trades = $state(generateMockTrades() as Trade[]);
  let chartData = $state([]);

  // Reactively update all data when the interval changes
  $effect(() => {
    const intervalMinutes = parseInt(activeInterval.replace('m', ''));
    
    // Regenerate and shuffle trades
    trades = generateMockTrades().sort(() => Math.random() - 0.5);
    
    // Regenerate chart data
    chartData = generateMockChartData(intervalMinutes, 600);
  });
</script>


<!-- DaisyUI Drawer Wrapper -->
<div class="drawer lg:drawer-open">
  <!-- Drawer Toggle (hidden on lg) -->
  <input id="drawer-toggle" type="checkbox" class="drawer-toggle" bind:checked={drawerOpen} />
  <div class="drawer-content flex flex-col min-h-screen">
    <!-- Main App Content -->
    <main>
      <header class="sticky top-0 z-40">
        <div class="navbar bg-base-100 shadow-sm">
          <img src={logo} alt="robo logo" class="logoheader pl-2 mr-4 flex-initial" />
          <h1 class="text-lg flex-grow text-left">Backtesting Dashboard</h1>
        </div>
      </header>

      <h2 class="text-2xl font-bold text-center mt-4">Backtesting Visualizations</h2>
      <div class="card w-10/12 lg:w-11/12 bg-base-200 mx-auto mt-4">
        <div class="card-body">
          <h2 class="text-left text-xl">NIFTY</h2>
          
          <IntervalButtons bind:activeInterval intervals={intervals} />
          
          <Chart data={chartData} />
        </div>  
      </div>

      <div class="flex w-11/12 lg:w-10/12 flex-col mx-auto">
        <div class="divider my-0"></div>
      </div>

      <div class="card w-11/12 lg:w-10/12 bg-base-200 mx-auto mt-4 my-1 p-4 pt-0">
        <h3 class="text-xl font-bold py-1 mb-4">Trade Log</h3>
        <div class="overflow-x-auto max-h-[400px]">
          <TradeLog {trades} {activeInterval} data={chartData} />
        </div>
      </div>
    </main>

    <!-- Bottom Nav (Mobile Only) -->
    <nav class="btm-nav fixed bottom-0 left-0 w-full z-50 block lg:hidden bg-base-100 border-t border-base-200">
      <button class="btn btn-ghost" onclick={() => drawerOpen = !drawerOpen} aria-label="Open drawer">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
      </button>
      <!-- Add more nav actions here if needed -->
    </nav>
  </div>
  <!-- Drawer Side -->
  <div class="drawer-side z-50">
    <label for="drawer-toggle" class="drawer-overlay lg:hidden"></label>
    <aside class="menu p-4 w-72 min-h-full bg-base-200 text-base-content">
      <!-- Daisy Select -->
      <div class="form-control mb-4">
        <label class="label" for="symbol-select">
          <span class="label-text">Select Symbol</span>
        </label>
        <select id="symbol-select" class="select select-bordered w-full" bind:value={selectedSymbol}>
          {#each symbolOptions as symbol}
            <option value={symbol}>{symbol}</option>
          {/each}
        </select>
      </div>
      <!-- Daisy List/Menu -->
      <ul class="menu bg-base-100 rounded-box">
        {#each menuOptions as item}
          <li><button type="button" class="btn btn-ghost btn-sm w-full text-left">{item}</button></li>
        {/each}
      </ul>
    </aside>
  </div>
</div>

<style>
  .logoheader {
    height: 40px; /* Adjust as needed to fit within header height */
    max-width: 100px; /* Prevent logo from becoming too wide */
    object-fit: contain; /* Ensure the image fits without distortion */
  }
</style>
