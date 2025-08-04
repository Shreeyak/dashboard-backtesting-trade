<script>
  import "./app.css";
  import Chart from './lib/Chart.svelte';
  import IntervalButtons from './lib/IntervalButtons.svelte';
  import roboLogo from './assets/robot.svg';

  /* Logic to set active button for interval selection */
  let activeInterval = '3m';
  const intervals = ['3m', '5m', '15m'];
</script>

<main>
  <header class="bg-base-100 shadow-sm p-4 flex items-center justify-between">
    <img src={roboLogo} alt="robo logo" class="logoheader mr-4 flex-initial" />
    <h1 class="text-lg">Backtesting KC + KST</h1>
  </header>

  <div class="card w-11/12 bg-base-200 mx-auto mt-4">
    <div class="card-body">
      <h2 class="card-title mx-auto text-center">Nifty</h2>
      
      <IntervalButtons bind:activeInterval intervals={intervals} />
      
      <Chart interval={activeInterval} />
    </div>  
  </div>

</main>

<style>
  header {
    padding: 10px 10px;
  }  
  .logoheader {
    height: 50px; /* Adjust as needed to fit within header height */
    max-width: 100px; /* Prevent logo from becoming too wide */
    object-fit: contain; /* Ensure the image fits without distortion */
  }
</style>
