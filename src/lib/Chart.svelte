<script lang="ts">
	import { createChart,  CrosshairMode, CandlestickSeries, ColorType } from 'lightweight-charts';
	import type {IChartApi, ISeriesApi, TimeChartOptions} from 'lightweight-charts';
	import { generateMockChartData } from './mockData';

	let { interval = '5m' } = $props();
	let chartContainer: HTMLDivElement;

	let chart: IChartApi | undefined;
	let candles: ISeriesApi<'Candlestick'> | undefined;

	// Effect for creating and initializing the chart once
	$effect(() => {
		const chartOptions = {
			height: 300,
			autoSize: true,
			layout: {
				background: { color: "#121212", type: ColorType.Solid },
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
		};
		
		chart = createChart(chartContainer, chartOptions);

		const candleOptions = {
			upColor:   '#26a69a',
			downColor: '#EF5350',
		};
		candles = chart.addSeries(CandlestickSeries, candleOptions);

		const ro = new ResizeObserver(entries => {
			const cr = entries[0].contentRect;
      		chart?.resize(cr.width, cr.height);
    	});
		ro.observe(chartContainer);

		// Return teardown function to clean up chart and observer
		return () => {
			ro.disconnect();
			chart?.remove();
		};
	});

	// Effect for updating the chart data when the interval changes
	$effect(() => {
		if (!candles) return; // guard against running before chart is ready

		const intervalMinutes = parseInt(interval.replace('m', ''));
		const newData = generateMockChartData(intervalMinutes, 600);
		candles.setData(newData);
	});
</script>

<div bind:this={chartContainer} class="w-full h-[300px] cursor-crosshair"></div>
