<script lang="ts">
import { createChart, CrosshairMode, CandlestickSeries, LineSeries, ColorType, createSeriesMarkers } from 'lightweight-charts';
import type { IChartApi, ISeriesApi, UTCTimestamp } from 'lightweight-charts';

// TODO: MAKE the time display convert to local time zone. 

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

	chart.subscribeCrosshairMove(param => {
		if (param.time && chartContainer) {
			const localDate = new Date(param.time * 1000);
			// Example: show local time in a simple tooltip div
			let tooltip = chartContainer.querySelector('.custom-tooltip') as HTMLElement;
			if (!tooltip) {
				tooltip = document.createElement('div');
				tooltip.className = 'custom-tooltip';
				tooltip.style.position = 'absolute';
				tooltip.style.pointerEvents = 'none';
				tooltip.style.background = '#222';
				tooltip.style.color = '#FFD700';
				tooltip.style.padding = '4px 8px';
				tooltip.style.borderRadius = '4px';
				tooltip.style.fontSize = '12px';
				tooltip.style.zIndex = '1000';
				chartContainer.appendChild(tooltip);
			}
			tooltip.textContent = `${localDate.toLocaleString('en-US', {
				month: 'short',
				day: '2-digit'
			})} ${localDate.getHours().toString().padStart(2, '0')}:${localDate.getMinutes().toString().padStart(2, '0')}`;
			// Position the tooltip near the mouse (param.point)
			if (param.point) {
				tooltip.style.left = `${param.point.x + 10}px`;
				tooltip.style.top = `${param.point.y + 10}px`;
				tooltip.style.display = 'block';
			}
		} else if (chartContainer) {
			// Hide tooltip if not hovering a bar
			const tooltip = chartContainer.querySelector('.custom-tooltip') as HTMLElement;
			if (tooltip) tooltip.style.display = 'none';
		}
	});

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
        if (idx !== -1) {
            // Choose a window size (number of candles to show)
            const windowSize = 50;
            const fromIdx = Math.max(0, idx - Math.floor(windowSize / 2));
            const toIdx = Math.min(seriesData.length - 1, idx + Math.floor(windowSize / 2));
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
