<script lang="ts">
  export let name: string;
  export let size: number = 18;
  export let className: string = '';
  export let color: string = 'currentColor';
</script>

{#if name === 'candlestick'}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class={className}
  >
    <path d="M9 5v4"/>
    <rect width="4" height="6" x="7" y="9" rx="1"/>
    <path d="M9 15v2"/>
    <path d="M17 3v2"/>
    <rect width="4" height="8" x="15" y="5" rx="1"/>
    <path d="M17 13v3"/>
    <path d="M3 3v16a2 2 0 0 0 2 2h16"/>
  </svg>
{:else}
  <!-- Optionally, render a placeholder or nothing for unknown icons -->
  <svg width={size} height={size} class={className} />
{/if}
