<script>
  import svelteLogo from './assets/svelte.svg'
  import roboLogo from './assets/robot.svg'
  import viteLogo from '/vite.svg'
  import Counter from './lib/Counter.svelte'
  import "./app.css";
  import Chart from './lib/Chart.svelte';

  /* Logic to set active button for interval selection */
  let activeInterval = '3m';
  function selectInterval(interval) {
    activeInterval = interval;
  }
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
      <div class="flex justify-left gap-1 w-full">
        {#each intervals as interval}
          <button
            class="btn btn-sm btn-soft btn-secondary {activeInterval === interval ? 'btn-active' : ''}"
            on:click={() => selectInterval(interval)}>
            {interval}
          </button>
        {/each}
      </div>
      <Chart interval={activeInterval} />
    </div>  
  </div>

</main>

<style>
  header {
    padding: 10px 10px;
  }  
  /* css<br>.header { @apply bg-base-100 background-color; }<br> */
  .logoheader {
    height: 50px; /* Adjust as needed to fit within header height */
    max-width: 100px; /* Prevent logo from becoming too wide */
    object-fit: contain; /* Ensure the image fits without distortion */
  }

</style>
