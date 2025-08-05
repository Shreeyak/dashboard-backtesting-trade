<script lang="ts">
  import { type Trade } from '../types';

  let { trades } = $props<{ trades: Trade[] }>();

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
    <div>Date/Time</div>
    <div>Signal</div>
    <div class="text-right">Price</div>
    <div class="text-right">Position size</div>
    <div class="text-right">P&L</div>
    <div class="text-right">Cumulative P&L</div>
  </div>

  <!-- Trades -->
  <div class="trade-log-body">
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
          <div class="cell-type {isEntry ? 'entry-row' : ''}">{detail.type}</div>
          <div class="cell-datetime {isEntry ? 'entry-row' : ''}">{detail.date}, {detail.time}</div>
          <div class="cell-signal {isEntry ? 'entry-row' : ''}">{detail.signal}</div>
          <div class="cell-price {isEntry ? 'entry-row' : ''}">{detail.price.toFixed(2)} INR</div>
        {/each}
      </div>
    {/each}
  </div>
</div>

<style>
  .trade-log-container {
    background-color: #1a1a1a;
    color: #f0f0f0;
    border-radius: 0.5rem;
    /* The container itself becomes a grid to layout header and body */
    display: grid;
    grid-template-rows: auto 1fr;
  }

  .trade-log-header, .trade-row {
    display: grid;
    /* A consistent 8-column grid is the key to alignment */
    grid-template-columns: 1fr 1fr 2fr 1fr 1fr 1fr 1fr 1fr;
    gap: 0 1rem;
    align-items: center;
  }

  .trade-log-header {
    padding: 0.5rem;
    font-weight: bold;
    position: sticky;
    top: 0;
    z-index: 10;
    background-color: #2a2a2a; /* Slightly different color to stand out */
    border-bottom: 1px solid #4a5568; /* gray-600 */
  }

  .trade-log-body {
    overflow-y: auto;
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
  
  .trade-id { grid-column: 1; }
  .position-size { grid-column: 6; align-items: flex-end; }
  .pnl { grid-column: 7; align-items: flex-end; }
  .cumulative-pnl { grid-column: 8; align-items: flex-end; }
  
  /* Explicit placement for each detail cell */
  .cell-type { grid-column: 2; }
  .cell-datetime { grid-column: 3; }
  .cell-signal { grid-column: 4; }
  .cell-price { grid-column: 5; text-align: right; }

  .entry-row {
    border-top: 1px solid #2d3748; /* gray-700 */
    padding-top: 0.5rem;
    margin-top: 0.25rem;
  }
</style>
