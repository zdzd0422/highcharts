QUnit.test('csv-datetime-short-year', function (assert) {
    var chart = Highcharts.charts[0];

    assert.strictEqual(
        chart.options.series[0].data.length,
        3,
        'Loaded Data'
    );

    assert.strictEqual(
        (chart.options.series[0].data[0][1]),
        4,
        'Point one is correct'
    );

    assert.strictEqual(
        (chart.options.series[0].data[1][1]),
        6,
        'Point two is correct'
    );

    assert.strictEqual(
        (chart.options.series[0].data[2][1]),
        7,
        'Point three is correct'
    );
});