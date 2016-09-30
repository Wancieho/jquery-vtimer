/*
 * Project: vTimer
 * Description: Configurable event-based jQuery timer
 * Author: https://github.com/Wancieho
 * License: MIT
 * Version: 0.0.3
 * Dependancies: jquery-1.*
 * Date: 10/02/2016
 */
;
(function ($) {
	'use strict';

	var pluginName = 'vTimer';
	var defaults = {duration: 0};

	function VTimer(element, options) {
		this.element = element;

		this.settings = $.extend({}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;

		this.interval = null;
		this.remaining = null;
		this.expiresAt = null;
	}

	function microtime() {
		return Math.round((new Date).getTime() / 1000);
	}

	function loop() {
		var scope = this;

		this.remaining = this.expiresAt - microtime();

		$(this.element).trigger('update', this.remaining);

		if (this.remaining <= 0) {
			$(this.element).trigger('complete');

			this.stop();
		} else {
			this.interval = setTimeout(function () {
				loop.apply(scope);
			}, 1000);
		}
	}

	$.extend(VTimer.prototype, {
		start: function () {
			this.stop();

			loop.apply(this);
		},
		stop: function () {
			this.expiresAt = microtime() + this.settings.duration;

			clearInterval(this.interval);
			this.interval = null;
		},
		cancel: function () {
			$(this.element).trigger('cancel');

			this.stop();
		}
	});

	$.fn[pluginName] = function (method, options) {
		return this.each(function () {
			if (!$.data(this, 'plugin_' + pluginName)) {
				$.data(this, 'plugin_' + pluginName, new VTimer(this, options));
			}

			if (method === 'start') {
				$.data(this, 'plugin_' + pluginName).start();
			}

			if (method === 'cancel') {
				$.data(this, 'plugin_' + pluginName).cancel();
			}
		});
	};
})(jQuery);