<script>
  import "./app.css";
  import Chart from './lib/Chart.svelte';
  import IntervalButtons from './lib/IntervalButtons.svelte';
  import logo from '/bar-chart.svg';

  /* Logic to set active button for interval selection */
  let activeInterval = '3m';
  const intervals = ['3m', '5m', '15m'];
</script>

<main>
  <header class="sticky top-0 z-50">
    <div class="navbar bg-base-100 shadow-sm">
      <img src={logo} alt="robo logo" class="logoheader pl-2 mr-4 flex-initial" />
      <h1 class="text-lg flex-grow text-left">Backtesting Dashboard</h1>
    </div>
  </header>

  <div class="card w-11/12 lg:w-full bg-base-200 max-w-[740px] mx-auto mt-4">
    <div class="card-body">
      <h2 class="card-title mx-auto text-center">Nifty</h2>
      
      <IntervalButtons bind:activeInterval intervals={intervals} />
      
      <Chart interval={activeInterval} />
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
