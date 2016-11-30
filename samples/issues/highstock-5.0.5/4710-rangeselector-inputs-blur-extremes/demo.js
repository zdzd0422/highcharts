$(function() {
	QUnit.test('Set extremes on inputs blur.', function(assert) {
		var clicked = false,
			chart = new Highcharts.StockChart({
				chart: {
					renderTo: 'container'
				},
				xAxis: {
					min: Date.UTC(2007,8,22),
					max: Date.UTC(2007,8,25)
				},
				rangeSelector: {
					selected: 6
				},
				series: [{
					data: [[Date.UTC(2007,8,3),0.7342],
							[Date.UTC(2007,8,4),0.7349],
							[Date.UTC(2007,8,5),0.7326],
							[Date.UTC(2007,8,6),0.7306],
							[Date.UTC(2007,8,7),0.7263],
							[Date.UTC(2007,8,10),0.7247],
							[Date.UTC(2007,8,11),0.7227],
							[Date.UTC(2007,8,12),0.7191],
							[Date.UTC(2007,8,13),0.7209],
							[Date.UTC(2007,8,14),0.7207],
							[Date.UTC(2007,8,17),0.7211],
							[Date.UTC(2007,8,18),0.7153],
							[Date.UTC(2007,8,19),0.7165],
							[Date.UTC(2007,8,20),0.7107],
							[Date.UTC(2007,8,21),0.7097],
							[Date.UTC(2007,8,24),0.7098],
							[Date.UTC(2007,8,25),0.7069],
							[Date.UTC(2007,8,26),0.7078],
							[Date.UTC(2007,8,27),0.7066],
							[Date.UTC(2007,8,28),0.7006]]
				}]
			}),
			min = chart.xAxis[0].min,
			event = $.Event('focus', {
				which: 1,
				pageX: 520,
				pageY: 20
			}),
			newMin;

		$(chart.rangeSelector.minInput).trigger(event);

		document.activeElement.value = "2007-08-03";

		event = $.Event('blur', {
			which: 1,
			pageX: 520,
			pageY: 120
		});

		$(chart.rangeSelector.minInput).trigger(event);

		newMin = chart.xAxis[0].min;

		assert.strictEqual(
			min === newMin,
			false,
			'Extremes are updated.'
		);
	});
});
