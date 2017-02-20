/**
 * Sonification module
 *
 * (c) 2010-2017 Highsoft AS
 * Author: Øystein Moseng
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import '../parts/Chart.js';
import '../parts/Series.js';
import '../parts/Point.js';
import '../parts/Tooltip.js';

var merge = H.merge;

H.audio = new (H.win.AudioContext || H.win.webkitAudioContext)();

H.Series.prototype.sonify = function (options, callback) {
	var gainNode = H.audio.createGain(),
		panNode = H.audio.createStereoPanner(), // Note: Panning might not be accessible to mono users
		oscillator = H.audio.createOscillator(),
		series = this,
		numPoints = series.points.length,
		valueToFreq = function (val) {
			var valMin = options.rangeMin || series.dataMin,
				valMax = options.rangeMax || series.dataMax,
				freqStep = (options.maxFrequency - options.minFrequency) / (valMax - valMin);
			return options.minFrequency + (val - valMin) * freqStep;
		},
		timePerPoint = Math.min(options.maxDuration / numPoints, options.maxPointDuration),
		maxPointsNum = options.maxDuration / options.minPointDuration,
		pointSkip = 1;

	// Skip over points if we have too many
	// We might want to use data grouping here
	if (timePerPoint < options.minPointDuration) {
		pointSkip = Math.ceil(numPoints / maxPointsNum);
		timePerPoint = options.minPointDuration;
	}

	// Init audio nodes
	panNode.pan.value = 0; // TODO
	gainNode.gain.value = options.volume;
	oscillator.type = options.waveType;
	oscillator.frequency.value = 0;
	oscillator.connect(gainNode);
	gainNode.connect(panNode);
	panNode.connect(H.audio.destination);

	// Play
	oscillator.start(H.audio.currentTime);
	for (var i = 0, point; i < numPoints; i += pointSkip) {
		point = this.points[i];
		if (point) {
			oscillator.frequency[
				options.smooth ?
				'linearRampToValueAtTime' : 'setValueAtTime'
			](
				valueToFreq(point.y),
				H.audio.currentTime + i * timePerPoint / 1000
			);
		}
	}
	gainNode.gain.setTargetAtTime(0, H.audio.currentTime + i * timePerPoint / 1000, 0.1); // Fade
	oscillator.stop(H.audio.currentTime + i * timePerPoint / 1000 + 1); // Stop eventually

	oscillator.onended = function () {
		callback.call(series);
	};
};

H.Chart.prototype.sonify = function () {
	var options = this.options.sonification;
	if (this.series[0]) {
		this.series[0].sonify(options, function sonifyNext() {
			var newSeries = this.chart.series[this.index + 1],
				opts;
			if (newSeries) {
				opts = merge(options, newSeries.options.sonification);
				setTimeout(function () {
					newSeries.sonify(options, sonifyNext);
				}, opts.seriesDelay);
			}
		});
	}
};

// Default sonification options
H.setOptions({
	sonification: {
		seriesDelay: 1000, // Delay between series in ms
		maxDuration: 7000, // In ms
		minPointDuration: 30, // In ms
		maxPointDuration: 300, // In ms
		minFrequency: 100,
		maxFrequency: 2400,
		waveType: 'sine',
		smooth: false,
		stereo: true,
		volume: 0.9
	}
});

// Add option to export menu to sonify the chart
H.getOptions().exporting.buttons.contextButton.menuItems.push({
	text: 'Sonify chart',
	onclick: function () {
		this.sonify();
	}
});
