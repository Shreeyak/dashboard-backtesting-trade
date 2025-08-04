<script>
  import svelteLogo from './assets/svelte.svg'
  import roboLogo from './assets/robot.svg'
  import viteLogo from '/vite.svg'
  import Counter from './lib/Counter.svelte'
  import "./app.css";
  import Chart from './lib/Chart.svelte';
</script>

<main>
  <!-- <div class="header flex flex-row">
    <img src={roboLogo} alt="robo logo" class="logoheader" />
    <h1>Backtesting KC + KST</h1>
  </div> -->

  <div class="bg-base-100 shadow-sm p-4 flex items-center justify-between">
    <img src={roboLogo} alt="robo logo" class="logoheader mr-4" />
    <h1 class="text-lg">Backtesting KC + KST</h1>
  </div>

  

  <div class="card">
    <h3>Nifty</h3>
    <Chart />
    <div class="card-body items-center">
      <Counter />
    </div>
  </div>


</main>

<style>
  header {
    /* display: flex; */
    align-items: left;
    justify-content: space-between;
    /* background-color: @apply bg-100; Slightly different background color */
    padding: 10px 20px;
  }
  /* css<br>.header { @apply bg-base-100 background-color; }<br> */
  .logoheader {
    height: 50px; /* Adjust as needed to fit within header height */
    max-width: 100px; /* Prevent logo from becoming too wide */
    object-fit: contain; /* Ensure the image fits without distortion */
  }

</style>
