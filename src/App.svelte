<script>
  import svelteLogo from './assets/svelte.svg'
  import roboLogo from './assets/robot.svg'
  import viteLogo from '/vite.svg'
  import Counter from './lib/Counter.svelte'
  import "./app.css";
  import Chart from './lib/Chart.svelte';
</script>

<main>
  <header class="bg-base-100 shadow-sm p-4 flex items-center justify-between">
    <img src={roboLogo} alt="robo logo" class="logoheader mr-4 flex-initial" />
    <h1 class="text-lg">Backtesting KC + KST</h1>
  </header>

  <div class="card w-11/12 bg-base-200 mx-auto mt-4">
    <div class="card-body">
      <h2 class="card-title mx-auto text-center">Nifty</h2>
      <div class="p-4">
        <Chart />
      </div>
      <Counter />
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
