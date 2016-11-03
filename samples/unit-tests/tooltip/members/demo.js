QUnit.test('Tooltip.refresh', function (assert) {
    var tooltip = new Highcharts.Tooltip({}, {
            formatter: function () {
                return undefined;
            }
        }),
        series = {
            tooltipOptions: {
                followPointer: false
            }
        },
        point = {
            getLabelConfig: function () {
                return {
                    series: series
                };
            },
            series: series
        },
        mouseEvent = {};
    tooltip.getLabel = function () {
        return Highcharts.Renderer.prototype.label();
    };

    // Test wether tooltip.refresh raises an exception.
    tooltip.refresh(point, mouseEvent);
    assert.ok(
        true,
        'Tooltip.refresh passes when formatter returns undefined. #5922'
    );
});