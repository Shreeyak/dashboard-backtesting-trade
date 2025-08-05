<script lang="ts">
	import * as LightweightCharts from 'lightweight-charts';
	import type { UTCTimestamp } from 'lightweight-charts';
	import { CrosshairMode } from 'lightweight-charts';
	import { generateMockChartData } from './mockData';
	let chartContainer: HTMLDivElement;  // will point to the <div> using bind:this
	let { interval = '5m' } = $props(); // Default interval

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
			borderColor: 'transparent',
			autoScale: true,
		},  
		timeScale:  { 
			timeVisible: true, 
			borderColor: '#4A4A4A',
			secondsVisible: false, 
			rightBarStaysOnScroll: true,
			rightOffset: 7,
		},
		crosshair: { 
			mode: CrosshairMode.Normal,
			horzLine: {labelBackgroundColor: '#243424'},
			vertLine: {labelBackgroundColor: '#243424'},
		},
	}

	/* run the chart and update data reactively */
	$effect(() => {
		const chart = LightweightCharts.createChart(chartContainer, chartOptions);
		
		const candleOptions = {
				upColor:   '#26a69a',
				downColor: '#EF5350',
				borderVisible: false,
		}
		const candles = chart.addSeries(LightweightCharts.CandlestickSeries, candleOptions);

		const intervalMinutes = parseInt(interval.replace('m', ''));
		const newData = generateMockChartData(intervalMinutes, 600);
		candles.setData(newData);

		// keep chart responsive
		const ro = new ResizeObserver(entries => {
			const cr = entries[0].contentRect;
      		chart.resize(cr.width, cr.height);
    	});
		ro.observe(chartContainer);

		// return teardown
		return () => {
			ro.disconnect();
			chart.remove();
		}; 
	});
</script>

<div bind:this={chartContainer} class="w-full h-[300px] cursor-crosshair"></div>
