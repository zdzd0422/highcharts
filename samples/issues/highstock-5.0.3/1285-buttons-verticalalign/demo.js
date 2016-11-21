$(function () {
	QUnit.test('Buttons text should be vertically aligned', function (assert) {
		var chart = $('#container').highcharts('StockChart', {
			rangeSelector: {
			  buttonTheme: {
				height: 28,
				width: 28,
						verticalAlign: 'bottom'
			  }
			},
			series: [{
				data: [1, 20, 5, 1, 11]
			}]
		}).highcharts();

		assert.strictEqual(
			chart.rangeSelector.buttons[0].text.y,
			27,
			'text is at the bottom'
		);
	});
});