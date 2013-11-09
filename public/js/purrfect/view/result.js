/*global _li*/

(function(module) {
	'use strict';

	var moduleName = module.get('name'),
		init;

	init = function() {
		var data = {
			path: '/template/result.handlebars',
			event: null
		};

		module.publish('purrfect.view.renderTemplate', data);
	};


	module.subscribe(moduleName, 'main', init);

}(_li.define('purrfect.view.result')));