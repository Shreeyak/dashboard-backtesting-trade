<script lang="ts">
  import "./app.css";
  import Chart from './lib/Chart.svelte';
  import IntervalButtons from './lib/IntervalButtons.svelte';
  import TradeLog from './lib/TradeLog.svelte';
import { generateTimeValues, generateCandles, generateRandomMockTrades, generateMockTradesAndMarkers, generateIndicatorData } from './lib/mockData';
  import { type Trade } from './types';
  import logo from '/bar-chart.svg';
  import Icons from './assets/Icons.svelte';

  // Example symbols and their contracts
  const symbolList = ['Nifty50', 'Reliance', 'BankNifty'];
  const instrumentList: Record<string, string[]> = {
    Nifty50: ['Nifty50.Aug07.25000CE', 'Nifty50.Aug07.25100CE', 'Nifty50.Aug07.25200CE', 'Nifty50.Aug07.25000PE', 'Nifty50.Aug07.25100PE', 'Nifty50.Aug07.25200PE'],
    Reliance: ['Reliance.Aug07.2500CE', 'Reliance.Aug07.2510CE', 'Reliance.Aug07.2520CE', 'Reliance.Aug07.2500PE', 'Reliance.Aug07.2510PE', 'Reliance.Aug07.2520PE'],
    BankNifty: ['BankNifty.Aug07.55000CE', 'BankNifty.Aug07.55100CE', 'BankNifty.Aug07.55200CE', 'BankNifty.Aug07.55000PE', 'BankNifty.Aug07.55100PE', 'BankNifty.Aug07.55200PE']
  };
  // Generate mock data from the new module
  let trades = $state([] as Trade[]);
let chartData = $state([]);
let markers = $state([]);
let indicatorData = $state([]);

  // Drawer Sidebar and it's updates to the chart
  const LG_SCREEN_BREAKPOINT_PX = 1024;
  let drawerOpen = $state(false);
  let selectedSymbol = $state('Nifty50');
  let selectedInstrument = $state('');
  let menuOptions = $derived(instrumentList[selectedSymbol]);
  let selectRef: HTMLSelectElement | null = null;
  
  // Interval selection, reactively update chart
  const intervals = ['3m', '5m', '15m'];
  let activeInterval = $state('5m');

  // When selectedSymbol changes, always reset selectedInstrument to the first for that symbol
  $effect(() => {
    selectedInstrument = instrumentList[selectedSymbol][0];
  });

  // Reactively update all data when the interval or selectedInstrument changes
  $effect(() => {
    // Explicitly reference dependencies for Svelte 5 reactivity
    const _interval = activeInterval;
    const _instrument = selectedInstrument;
    console.log('Effect triggered: interval', _interval, 'instrument', _instrument);
    const intervalMinutes = parseInt(activeInterval.replace('m', ''));

    // Generate time values and candles
    const timeValues = generateTimeValues(intervalMinutes, 600);
    const candles = generateCandles(timeValues);

    // Generate chart data (candles)
    chartData = candles;

    // Generate indicator data (e.g. EMA)
    const indicator = generateIndicatorData(timeValues, candles, 'EMA');
    indicatorData = indicator.data;

    // Generate trades and markers using new data flow
    const { trades: rawTrades, markers: rawMarkers } = generateMockTradesAndMarkers(candles);
    trades = generateRandomMockTrades(rawTrades);
    markers = rawMarkers;
  });

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
    <main class="mb-16 lg:mb-0">
      <div class="card w-11/12 bg-base-200 mx-auto mt-4">
        <div class="card-body">
          <!-- Main Chart Container -->
          <div class="flex items-center gap-2">
            <!-- Ticker Button -->
            <button type="button" class="btn btn-ghost btn-lg pl-2 pr-4" onclick={() => {
              if (window.innerWidth >= LG_SCREEN_BREAKPOINT_PX && selectRef) {
                selectRef.focus();
              } else {
                drawerOpen = !drawerOpen;
              }
            }} aria-label="Open drawer">
              <Icons name="candlestick" size={18} className="lucide lucide-chart-candlestick" />
              <span>{selectedInstrument}</span>
            </button>
            <!-- Interval Buttons -->
            <IntervalButtons bind:activeInterval intervals={intervals} />
          </div>
          <Chart data={chartData} markers={markers} indicatorData={indicatorData} />
        </div>  
      </div>

      <div class="flex w-11/12 lg:w-10/12 flex-col mx-auto">
        <div class="divider my-0"></div>
      </div>

      <div class="card w-11/12 bg-base-200 mx-auto mt-0 p-4 pt-0">
        <h3 class="text-xl font-bold py-1 mb-0">Trade Log</h3>
        <div class="overflow-x-auto">
          <TradeLog {trades} {activeInterval} data={chartData} />
        </div>
      </div>
    </main>

    <!-- Bottom Nav (Mobile Only) -->
    <nav class="btm-nav fixed bottom-0 left-0 w-full z-50 block lg:hidden bg-base-300 border-t border-base-100">
      <button class="btn btn-ghost" onclick={() => drawerOpen = !drawerOpen} aria-label="Open drawer">
        <Icons name="candlestick" size={18} className="lucide lucide-chart-candlestick" />
      </button>
    </nav>
  </div>
  <!-- Drawer Side -->
  <div class="drawer-side z-50">
    <label for="drawer-toggle" class="drawer-overlay lg:hidden"></label>
    <aside class="menu p-4 w-72 min-h-full bg-base-200 text-base-content flex flex-col-reverse lg:flex-col">
      <!-- Daisy Select: Symbol List -->
      <div class="form-control">
        <label class="label" for="symbol-select">
          <span class="label-text">Select Symbol</span>
        </label>
        <select id="symbol-select" class="select select-bordered w-full" bind:value={selectedSymbol} bind:this={selectRef} onchange={e => {
          // Reactively update selectedInstrument since Symbol will update from bind:. 
          // defocus the select
          (e.target as HTMLSelectElement).blur();
        }}>
          {#each symbolList as symbol}
            <option value={symbol}>{symbol}</option>
          {/each}
        </select>
      </div>
      <!-- Daisy List: Contracts for Symbol -->
      <ul class="menu bg-base-100 rounded-box my-4 w-full">
        {#each menuOptions as item}
          <li><button type="button" class="btn btn-ghost btn-sm w-full justify-start" onclick={() => {
            // Reactively update the chart and ticker button
            selectedInstrument = item;
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
