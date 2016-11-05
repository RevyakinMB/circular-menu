const browserSync = require('browser-sync');

module.exports = function(options) {
	return function() {
		browserSync.init({
			proxy: options.proxy
		});
	    browserSync.watch(options.dir).on('change', browserSync.reload);
	};
};
