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
  const symbolList = ['Nifty50', 'Reliance', 'BankNifty'];
  // Example menu options for each symbol
  const instrumentList: Record<string, string[]> = {
    Nifty50: ['Nifty50.Aug07.25000CE', 'Nifty50.Aug07.25100CE', 'Nifty50.Aug07.25200CE', 'Nifty50.Aug07.25000PE', 'Nifty50.Aug07.25100PE', 'Nifty50.Aug07.25200PE'],
    Reliance: ['Reliance.Aug07.2500CE', 'Reliance.Aug07.2510CE', 'Reliance.Aug07.2520CE', 'Reliance.Aug07.2500PE', 'Reliance.Aug07.2510PE', 'Reliance.Aug07.2520PE'],
    BankNifty: ['BankNifty.Aug07.55000CE', 'BankNifty.Aug07.55100CE', 'BankNifty.Aug07.55200CE', 'BankNifty.Aug07.55000PE', 'BankNifty.Aug07.55100PE', 'BankNifty.Aug07.55200PE']
  };
  let selectedSymbol = $state('Nifty50');
  let selectedInstrument = $state(instrumentList[selectedSymbol][0]);
  let menuOptions = $derived(instrumentList[selectedSymbol]);

  // Interval selection (Svelte 5 runes)
  const intervals = ['3m', '5m', '15m'];
  let activeInterval = $state('5m');
  

  // Generate mock data from the new module
  let trades = $state(generateMockTrades() as Trade[]);
  let chartData = $state([]);

  // Reactively update all data when the interval or selectedInstrument changes
  $effect(() => {
    // Explicitly reference dependencies for Svelte 5 reactivity
    const _interval = activeInterval;
    const _instrument = selectedInstrument;
    console.log('Effect triggered: interval', _interval, 'instrument', _instrument);
    const intervalMinutes = parseInt(activeInterval.replace('m', ''));
    
    // Regenerate and shuffle trades
    trades = generateMockTrades().sort(() => Math.random() - 0.5);
    
    // Regenerate chart data
    chartData = generateMockChartData(intervalMinutes, 600);
  });

  let selectRef: HTMLSelectElement | null = null;

  const tickerIconSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='lucide lucide-chart-candlestick'><path d='M9 5v4'/><rect width='4' height='6' x='7' y='9' rx='1'/><path d='M9 15v2'/><path d='M17 3v2'/><rect width='4' height='8' x='15' y='5' rx='1'/><path d='M17 13v3'/><path d='M3 3v16a2 2 0 0 0 2 2h16'/></svg>`;
</script>

<header class="sticky top-0 z-50">
  <div class="navbar bg-base-300 shadow-sm">
    <img src={logo} alt="robo logo" class="logoheader pl-2 mr-4 flex-initial" />
    <h1 class="text-lg flex-grow text-left">Backtesting Dashboard</h1>
  </div>
</header>

<!-- DaisyUI Drawer Wrapper -->
<div class="drawer drawer-end lg:drawer-open">
  <!-- Drawer Toggle (hidden on lg) -->
  <input id="drawer-toggle" type="checkbox" class="drawer-toggle" bind:checked={drawerOpen} />
  <div class="drawer-content flex flex-col">
    <!-- Main App Content -->
    <main>
      <h2 class="text-2xl font-bold text-center mt-4">Backtesting Visualizations</h2>
      <div class="card w-11/12 bg-base-200 mx-auto mt-4">
        <div class="card-body">
          <div class="flex items-center gap-2">
            <!-- Ticker Button -->
            <button type="button" class="btn btn-ghost btn-l pl-2 pr-4" onclick={() => {
              if (window.innerWidth >= 1024 && selectRef) {
                selectRef.focus();
              } else {
                drawerOpen = !drawerOpen;
              }
            }} aria-label="Open drawer">
              {@html tickerIconSvg}
              <span>{selectedInstrument}</span>
            </button>
            <IntervalButtons bind:activeInterval intervals={intervals} />
          </div>
          <Chart data={chartData} />
        </div>  
      </div>

      <div class="flex w-11/12 lg:w-10/12 flex-col mx-auto">
        <div class="divider my-0"></div>
      </div>

      <div class="card w-11/12 bg-base-200 mx-auto mt-4 my-1 p-4 pt-0">
        <h3 class="text-xl font-bold py-1 mb-4">Trade Log</h3>
        <div class="overflow-x-auto max-h-[400px]">
          <TradeLog {trades} {activeInterval} data={chartData} />
        </div>
      </div>
    </main>

    <!-- Bottom Nav (Mobile Only) -->
    <nav class="btm-nav fixed bottom-0 left-0 w-full z-50 block lg:hidden bg-base-300 border-t border-base-200">
      <button class="btn btn-ghost" onclick={() => drawerOpen = !drawerOpen} aria-label="Open drawer">
        {@html tickerIconSvg}
      </button>
      <!-- Add more nav actions here if needed -->
    </nav>
  </div>
  <!-- Drawer Side -->
  <div class="drawer-side z-70">
    <label for="drawer-toggle" class="drawer-overlay lg:hidden"></label>
    <aside class="menu p-4 w-72 min-h-full bg-base-200 text-base-content flex flex-col-reverse lg:flex-col">
      <!-- Daisy Select -->
      <div class="form-control">
        <label class="label" for="symbol-select">
          <span class="label-text">Select Symbol</span>
        </label>
        <select id="symbol-select" class="select select-bordered w-full" bind:value={selectedSymbol} bind:this={selectRef} onchange={e => {
          selectedSymbol = (e.target as HTMLSelectElement).value;
          selectedInstrument = instrumentList[selectedSymbol][0];
          (e.target as HTMLSelectElement).blur();
        }}>
          {#each symbolList as symbol}
            <option value={symbol}>{symbol}</option>
          {/each}
        </select>
      </div>
      <!-- Daisy List/Menu -->
      <ul class="menu bg-base-100 rounded-box my-4 w-full">
        {#each menuOptions as item}
          <li><button type="button" class="btn btn-ghost btn-sm w-full justify-start" onclick={() => {
            // Use $state assignment to ensure Svelte 5 reactivity
            selectedInstrument = item;
            // Optionally, you could trigger chart update here, but $effect above will handle it
          }}>{item}</button></li>
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
