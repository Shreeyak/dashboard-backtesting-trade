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

        <!-- Grouped Entry and Exit Details -->
        <div class="trade-details-container">
            {#each [trade.exit, trade.entry] as detail, i}
                {@const isEntry = i === 1}
                <div class="trade-details-group {isEntry ? 'entry-row' : ''}">
                    <div>{detail.type}</div>
                    <div>{detail.date}, {detail.time}</div>
                    <div>{detail.signal}</div>
                    <div class="text-right">{detail.price.toFixed(2)} INR</div>
                </div>
            {/each}
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .trade-log-container {
    background-color: #1a1a1a;
    color: #f0f0f0;
    border-radius: 0.5rem;
    display: grid;
    grid-template-rows: auto 1fr;
  }

  .trade-log-header {
    display: grid;
    grid-template-columns: 1fr 1fr 2fr 1fr 1fr 1fr 1fr 1fr;
    gap: 0 1rem;
    padding: 0.5rem;
    font-weight: bold;
    position: sticky;
    top: 0;
    z-index: 10;
    background-color: #2a2a2a;
    border-bottom: 1px solid #4a5568;
  }
  
  .trade-log-body {
    overflow-y: auto;
  }

  .trade-row {
    display: grid;
    /* This grid positions the main columns: ID, Details, Size, P&L, Cum. P&L */
    grid-template-columns: 1fr 5fr 1fr 1fr 1fr;
    gap: 0 1rem;
    border-bottom: 1px solid #4a5568;
    padding: 0.5rem 0;
    align-items: center;
  }

  .trade-details-container {
    grid-column: 2;
    grid-row: 1 / span 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  .trade-details-group {
    display: grid;
    /* This nested grid's proportions match the header perfectly */
    grid-template-columns: 1fr 2fr 1fr 1fr;
    gap: 0 1rem; /* Match the parent's gap for alignment */
    align-items: center;
  }

  /* --- Vertically spanned items --- */
  .trade-id, .position-size, .pnl, .cumulative-pnl {
    grid-row: 1 / span 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  .trade-id { grid-column: 1; }
  .position-size { grid-column: 3; align-items: flex-end; }
  .pnl { grid-column: 4; align-items: flex-end; }
  .cumulative-pnl { grid-column: 5; align-items: flex-end; }
  
  /* --- Entry/Exit row styling --- */
  .entry-row {
    border-top: 1px solid #2d3748;
    padding-top: 0.5rem;
    margin-top: 0.25rem;
  }
</style>
