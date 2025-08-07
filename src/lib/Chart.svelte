<script lang="ts">
import { createChart, CrosshairMode, CandlestickSeries, LineSeries, ColorType, createSeriesMarkers } from 'lightweight-charts';
import type { IChartApi, ISeriesApi, UTCTimestamp } from 'lightweight-charts';

// Accept data, optional markers, optional indicatorData, optional centerTime prop, and shouldCenter trigger
let { data, markers = [], indicatorData = [], centerTime, shouldCenter = false } = $props<{ data: any[], markers?: any[], indicatorData?: any[], centerTime?: number, shouldCenter?: boolean }>();
	let chartContainer: HTMLDivElement;

let chart: IChartApi | undefined;
let candles: ISeriesApi<'Candlestick'> | undefined;
let indicatorSeries: ISeriesApi<'Line'> | undefined;
let markerPrimitive: ReturnType<typeof createSeriesMarkers> | undefined;

// Effect for creating and initializing the chart once
$effect(() => {
	if (!chartContainer) return;
	// Chart initialization
	const chartOptions = {
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
		borderVisible: false,
	};
	candles = chart.addSeries(CandlestickSeries, candleOptions);

	// Add indicator line series
	indicatorSeries = chart.addSeries(LineSeries, {
		color: '#FFD700',
		lineWidth: 2,
		priceLineVisible: false,
		lastValueVisible: false,
		crosshairMarkerVisible: false,
	});

	const ro = new ResizeObserver(entries => {
		const cr = entries[0].contentRect;
		// chart?.resize(cr.width, cr.height); // autosize handles resizing
	});
	ro.observe(chartContainer);
	// Cleanup
	return () => {
		ro.disconnect();
		chart?.remove();
	};
});

// Effect for centering the chart on centerTime when shouldCenter is triggered
$effect(() => {
    console.log('Centering chart on time:', centerTime, 'shouldCenter:', shouldCenter);
    if (
        shouldCenter &&
        centerTime !== undefined &&
        chart &&
        data &&
        Array.isArray(data) &&
        data.length > 0
    ) {
        const seriesData = data;
        const idx = seriesData.findIndex(bar => bar.time === centerTime);
        console.log('Found index:', idx);
        if (idx !== -1) {
            // Choose a window size (number of candles to show)
            const windowSize = 50;
            const fromIdx = Math.max(0, idx - Math.floor(windowSize / 2));
            const toIdx = Math.min(seriesData.length - 1, idx + Math.floor(windowSize / 2));
            console.log('Setting visible range from', fromIdx, 'to', toIdx);
            if (
                seriesData[fromIdx] &&
                seriesData[toIdx] &&
                typeof seriesData[fromIdx].time === 'number' &&
                typeof seriesData[toIdx].time === 'number'
            ) {
                chart.timeScale().setVisibleRange({
                    from: seriesData[fromIdx].time,
                    to: seriesData[toIdx].time
                });
            } else {
                console.warn('Invalid time values for visible range:', seriesData[fromIdx], seriesData[toIdx]);
            }
        }
    }
});

// Effect for updating the chart data and indicator when the data/indicatorData prop changes
$effect(() => {
	if (candles && data) {
		candles.setData(data);
	}
	if (indicatorSeries && indicatorData) {
		indicatorSeries.setData(indicatorData);
	}
});

// Effect for creating/updating marker primitive when candles or markers change
$effect(() => {
	if (!candles) return;
	// Remove previous markerPrimitive if it exists
	if (markerPrimitive) {
		markerPrimitive.setMarkers([]); // clear old markers
	}
	markerPrimitive = createSeriesMarkers(candles, markers ?? []);
});
</script>

<div bind:this={chartContainer} class="w-full h-[300px] cursor-crosshair"></div>
