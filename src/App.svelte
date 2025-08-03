<script>
  import svelteLogo from './assets/svelte.svg'
  import viteLogo from '/vite.svg'
  import Counter from './lib/Counter.svelte'
  import "./app.css";
</script>

<main>
  <div class="flex flex-row items-center justify-center gap-4">
    <a href="https://vite.dev" target="_blank" rel="noreferrer" aria-label="Vite">
      <img src={viteLogo} alt="Vite logo" class="logo" />
    </a>
  
    <a href="https://svelte.dev" target="_blank" rel="noreferrer" aria-label="Svelte">
      <img src={svelteLogo} alt="Svelte logo" class="logo svelte" />
    </a>
  </div>

  <h1>Vite + Svelte</h1>

  <div class="card">
    <div class="card-body items-center">
      <Counter />
    </div>
  </div>

  <p>
    Check out <a href="https://github.com/sveltejs/kit#readme" target="_blank" rel="noreferrer">SvelteKit</a>, the official Svelte app framework powered by Vite!
  </p>

  <p class="read-the-docs">
    Click on the Vite and Svelte logos to learn more
  </p>
</main>

<style>
  .logo {
    height: 9em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }
  .read-the-docs {
    color: #888;
  }
</style>
