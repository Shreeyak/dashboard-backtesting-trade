<script lang="ts">
  import { type Trade } from '../types';

  export let trades: Trade[];

  // Helper for dynamic classes for P&L values
  function getPnlClasses(value: number) {
    return value >= 0 ? 'text-green-500' : 'text-red-500';
  }
</script>

<div class="trade-log-container text-sm">
  <!-- Header -->
  <div class="trade-log-header">
    <div>Trade #</div>
    <div>Type</div>
    <div class="col-span-2">Date/Time</div>
    <div>Signal</div>
    <div class="text-right">Price</div>
    <div class="text-right">Position size</div>
    <div class="text-right">P&L</div>
    <div class="text-right">Cumulative P&L</div>
  </div>

  <!-- Trades -->
  {#each trades as trade (trade.tradeId)}
    <div class="trade-row">
      <!-- Vertically Spanned Columns -->
      <div class="trade-id">
        <span class="text-blue-400">{trade.tradeId}</span>
        <span class="ml-2">{trade.positionType}</span>
      </div>

      <div class="position-size">
        <span>{trade.positionSize}</span>
        <span class="text-gray-400">{trade.entry.price.toFixed(2)} INR</span>
      </div>

      <div class="pnl">
        <span class={getPnlClasses(trade.pnlAmount)}>
          {trade.pnlAmount >= 0 ? '+' : ''}{trade.pnlAmount.toFixed(2)} INR
        </span>
        <span class={getPnlClasses(trade.pnlPercentage)}>
          {trade.pnlPercentage >= 0 ? '+' : ''}{trade.pnlPercentage.toFixed(2)}%
        </span>
      </div>

      <div class="cumulative-pnl">
        <span>{trade.cumulativePnlAmount.toFixed(2)} INR</span>
        <span class={getPnlClasses(trade.cumulativePnlPercentage)}>
          {trade.cumulativePnlPercentage.toFixed(2)}%
        </span>
      </div>

      <!-- Entry and Exit Details rendered via a loop -->
      {#each [trade.exit, trade.entry] as detail, i}
        {@const isEntry = i === 1}
        <div class="trade-detail-type {isEntry ? 'entry-row' : 'exit-row'}">{detail.type}</div>
        <div class="trade-detail-datetime {isEntry ? 'entry-row' : 'exit-row'}">{detail.date}, {detail.time}</div>
        <div class="trade-detail-signal {isEntry ? 'entry-row' : 'exit-row'}">{detail.signal}</div>
        <div class="trade-detail-price {isEntry ? 'entry-row' : 'exit-row'}">{detail.price.toFixed(2)} INR</div>
      {/each}
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

  .trade-log-header, .trade-row {
    display: grid;
    grid-template-columns: 1fr 1fr 2fr 1fr 1fr 1fr 1fr 1fr;
    grid-template-areas: "tradeid type datetime signal price size pnl cumpnl";
    gap: 0 1rem;
    align-items: center;
  }

  .trade-log-header {
    padding: 0.5rem;
    font-weight: bold;
    border-bottom: 1px solid #4a5568; /* gray-600 */
  }

  .trade-row {
    border-bottom: 1px solid #4a5568; /* gray-600 */
    padding: 0.5rem 0;
    grid-template-rows: 1fr 1fr;
  }

  /* Vertically spanned items */
  .trade-id, .position-size, .pnl, .cumulative-pnl {
    grid-row: 1 / span 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .position-size, .pnl, .cumulative-pnl {
    align-items: flex-end;
  }
  
  .trade-detail-price {
    text-align: right;
  }

  /* Entry/Exit detail positioning */
  .exit-row { grid-row: 1; }
  .entry-row {
    grid-row: 2;
    border-top: 1px solid #2d3748; /* gray-700 */
    padding-top: 0.5rem;
    margin-top: 0.25rem;
  }
  
  .trade-detail-type { grid-column: 2; }
  .trade-detail-datetime { grid-column: 3 / span 2; }
  .trade-detail-signal { grid-column: 5; }
  .trade-detail-price { grid-column: 6; }
</style>
