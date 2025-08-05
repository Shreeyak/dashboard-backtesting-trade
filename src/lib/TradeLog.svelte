<script lang="ts">
  import { type Trade } from '../types';

  export let trades: Trade[];

  // Function to calculate P&L
  function calculatePnL(entry: number, exit: number): number {
    return exit - entry;
  }
</script>

<div class="grid grid-cols-4 gap-4 p-2 font-bold border-b border-base-content">
  <div>Snapshot</div>
  <div>Date</div>
  <div>Entry/Exit Prices</div>
  <div>P&L</div>
</div>
{#each trades as trade (trade.snapshot)}
  <div class="grid grid-cols-4 gap-4 p-2 border-b border-base-300 last:border-b-0">
    <div>{trade.snapshot}</div>
    <div>{trade.date}</div>
    <div>
      Entry: {trade.entryPrice.toFixed(2)}<br>
      Exit: {trade.exitPrice.toFixed(2)}
    </div>
    <div>{calculatePnL(trade.entryPrice, trade.exitPrice).toFixed(2)}</div>
  </div>
{/each}

<style>
  /* You can add component-specific styles here if needed */
</style>
