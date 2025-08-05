<script lang="ts">
  import { type Trade } from '../types';

  export let trades: Trade[];
</script>

<div class="trade-log-container text-sm">
  <!-- Header -->
  <div class="grid grid-cols-9 gap-x-4 p-2 font-bold border-b border-gray-600">
    <div class="col-span-1">Trade #</div>
    <div class="col-span-1">Type</div>
    <div class="col-span-2">Date/Time</div>
    <div class="col-span-1">Signal</div>
    <div class="col-span-1 text-right">Price</div>
    <div class="col-span-1 text-right">Position size</div>
    <div class="col-span-1 text-right">P&L</div>
    <div class="col-span-1 text-right">Cumulative P&L</div>
  </div>

  <!-- Trades -->
  {#each trades as trade (trade.tradeId)}
    <div class="grid grid-cols-9 grid-rows-2 gap-x-4 border-b border-gray-600 py-2 items-center">
      <!-- Vertically Spanned Columns -->
      <div class="col-start-1 row-start-1 row-span-2 flex items-center">
        <span class="text-blue-400">{trade.tradeId}</span>
        <span class="ml-2">{trade.positionType}</span>
      </div>

      <div class="col-start-7 row-start-1 row-span-2 flex flex-col justify-center items-end">
        <span>{trade.positionSize}</span>
        <span class="text-gray-400">{trade.entry.price.toFixed(2)} INR</span>
      </div>

      <div class="col-start-8 row-start-1 row-span-2 flex flex-col justify-center items-end">
        <span class:text-red-500={trade.pnlAmount < 0} class:text-green-500={trade.pnlAmount >= 0}>
          {trade.pnlAmount >= 0 ? '+' : ''}{trade.pnlAmount.toFixed(2)} INR
        </span>
        <span class:text-red-500={trade.pnlPercentage < 0} class:text-green-500={trade.pnlPercentage >= 0}>
          {trade.pnlPercentage >= 0 ? '+' : ''}{trade.pnlPercentage.toFixed(2)}%
        </span>
      </div>

      <div class="col-start-9 row-start-1 row-span-2 flex flex-col justify-center items-end">
        <span>{trade.cumulativePnlAmount.toFixed(2)} INR</span>
        <span class:text-red-500={trade.cumulativePnlPercentage < 0} class:text-green-500={trade.cumulativePnlPercentage >= 0}>
            {trade.cumulativePnlPercentage.toFixed(2)}%
        </span>
      </div>


      <!-- Exit Row (Top) -->
      <div class="col-start-2">{trade.exit.type}</div>
      <div class="col-start-3 col-span-2">{trade.exit.date}, {trade.exit.time}</div>
      <div class="col-start-5">{trade.exit.signal}</div>
      <div class="col-start-6 text-right">{trade.exit.price.toFixed(2)} INR</div>

      <!-- Entry Row (Bottom) -->
      <div class="col-start-2 row-start-2 border-t border-gray-700 pt-1">{trade.entry.type}</div>
      <div class="col-start-3 col-span-2 row-start-2 border-t border-gray-700 pt-1">{trade.entry.date}, {trade.entry.time}</div>
      <div class="col-start-5 row-start-2 border-t border-gray-700 pt-1">{trade.entry.signal}</div>
      <div class="col-start-6 row-start-2 text-right border-t border-gray-700 pt-1">{trade.entry.price.toFixed(2)} INR</div>
    </div>
  {/each}
</div>

<style>
  .trade-log-container {
    background-color: #1a1a1a;
    color: #f0f0f0;
    padding: 1rem;
    border-radius: 0.5rem;
  }
</style>
