;
(function ($) {
	'use strict';

	var pluginName = 'vTimer';
	var defaults = {duration: 0};

	function Plugin(element, options) {
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

		scope.remaining = scope.expiresAt - microtime();

		$(scope.element).trigger('update', scope.remaining);

		if (scope.remaining <= 0) {
			$(scope.element).trigger('complete');

			this.stop();
		} else {
			scope.interval = setTimeout(function () {
				loop.apply(scope);
			}, 1000);
		}
	}

	$.extend(Plugin.prototype, {
		start: function () {
			this.stop();

			loop.apply(this);
		},
		stop: function () {
			this.expiresAt = microtime() + this.settings.duration;

			clearInterval(this.interval);
			this.interval = null;
		}
	});

	$.fn[pluginName] = function (options, params) {
		return this.each(function () {
			if (!$.data(this, 'plugin_' + pluginName)) {
				$.data(this, 'plugin_' + pluginName, new Plugin(this, options));
			}

			if (typeof options === 'string' && typeof $.data(this, 'plugin_' + pluginName)[options] === 'function') {
				$.data(this, 'plugin_' + pluginName)[options](params);
			}
		});
	};
})(jQuery);