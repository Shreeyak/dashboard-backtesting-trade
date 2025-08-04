<script lang="ts">
	import * as LightweightCharts from 'lightweight-charts';
	import type { UTCTimestamp } from 'lightweight-charts';
	import { CrosshairMode } from 'lightweight-charts';
	let chartContainer: HTMLDivElement;  // will point to the <div> using bind:this

	const chartOptions = {
		height: 300,
		autoSize: true,
		layout: {
			background: { color: "#121212", type: LightweightCharts.ColorType.Solid },
			textColor: '#F5E8D8',
			fontFamily: "Lato, -apple-system, BlinkMacSystemFont, 'Trebuchet MS', Roboto, Ubuntu, sans-serif",
		},
		grid: { 
			vertLines: { color: '#F5E8D811' }, 
			horzLines: { color: '#F5E8D811' } 
		},
		rightPriceScale: { 
			borderColor: 'transparent',  //#F5E8D899
			autoScale: false 
		},  
		timeScale:  { 
			timeVisible: true, 
			borderColor: '#4A4A4A', //'rgba(255,255,255,0.2)
			secondsVisible: false, 
			rightBarStaysOnScroll: true,
			// fixRightEdge: true,
		}, 
		crosshair: { 
			mode: CrosshairMode.Normal,
			horzLine: {labelBackgroundColor: '#243424'},
			vertLine: {labelBackgroundColor: '#243424'},
		},
	}

	// Helper: generate mock OHLC data
	function generateMockData(intervalMinutes, points) {
		const data = [];
		let ts = Math.floor(Date.now() / 1000);
		let nextOpen = 150;
	
		for (let i = 0; i < points; i++) {
			ts -= intervalMinutes * 60;
			const close = nextOpen;
			const open  = close - (Math.random() - 0.5) * 90;
			const high  = Math.max(open, close) + Math.random() * 25;
			const low   = Math.min(open, close) - Math.random() * 25;
			
		
			// data.unshift({ time: ts, open, high, low, close });
			data.unshift({ time: ts as UTCTimestamp, open: open, high: high, low: low, close: close});
			nextOpen = open;
		}
		return data;
	}

	/* run the chart once after mount */
	$effect(() => {

		const chart = LightweightCharts.createChart(chartContainer, chartOptions);
		
		// Mock datasets
		const data5m  = generateMockData(5, 600);
  		const data15m = generateMockData(15, 300);
		const candleOptions = {
				upColor:   '#26a69a',
				downColor: '#EF5350',
				borderVisible: false,
		}
		const candles = chart.addSeries(LightweightCharts.CandlestickSeries, candleOptions);
    	candles.setData(data5m);

		// keep chart responsive
		const ro = new ResizeObserver(entries => {
			const cr = entries[0].contentRect;
      		chart.resize(cr.width, cr.height);
    	});
		ro.observe(chartContainer);

		// 3 – return teardown
		return () => {
			ro.disconnect();
			chart.remove();
		}; 
	});
</script>

<!-- DaisyUI & Tailwind classes -->
<div class="card bg-base-100 shadow-xl">
	<div class="card-body p-0">
		<div bind:this={chartContainer} class="w-full h-[300px] cursor-crosshair"></div>
	</div>
</div>
