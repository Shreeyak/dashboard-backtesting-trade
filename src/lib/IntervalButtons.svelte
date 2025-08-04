<script lang="ts">
  let { intervals, activeInterval = $bindable() } = $props();
</script>

<div class="flex justify-left gap-1 w-full">
  {#each intervals as interval}
    <button
      class="btn btn-sm btn-soft btn-secondary"
      class:active={activeInterval === interval}
      onclick={() => (activeInterval = interval)}
    >
      {interval}
    </button>
  {/each}
</div>

<style>
  .btn-secondary.btn-soft {
    border-width: 1px; /* Pre-define border width to prevent layout shift */
    border-color: transparent;
    transition: border-color 0.2s ease-in-out;
  }

  /* On hover for a NON-ACTIVE button, just add the border color */
  .btn-secondary.btn-soft:not(.active):hover {
    border-color: hsl(var(--s)); /* Use the secondary theme color for the border */
  }

  /* For the ACTIVE button, just give it a persistent border. No other effects needed. */
  .btn-secondary.btn-soft.active {
    border-color: hsl(var(--s));
  }
</style>
