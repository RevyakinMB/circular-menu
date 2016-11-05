(function init(root, factory) {
	'use strict';

	if (typeof module === 'object' && module.exports) {
		// CommonJS module
		module.exports = factory();
	} else if (typeof define === 'function' && define.amd) {
		// AMD module
		define([], factory);
	} else {
		// define module in root scope
		root.CircularMenu = factory();
	}
}(this, function factory() {
	var CircularMenu = function(element, options) {
		var menuDiv, center, wrapper, ul, li, a, span, i;

		this.options = CircularMenu.defaultOptions;
		this.initOptions(options);

		menuDiv = document.createElement('div');
		element.appendChild(menuDiv);
		menuDiv.classList.add('circle-menu');

		center = document.createElement('div');
		center.classList.add('center');
		span = document.createElement('span');
		span.innerHTML = '+';
		center.appendChild(span);

		wrapper = document.createElement('div');
		wrapper.classList.add('wrapper');

		menuDiv.appendChild(center);
		menuDiv.appendChild(wrapper);

		ul = document.createElement('ul');
		for (i = 0; i < this.options.itemCount; ++i) {
			li = document.createElement('li');
			a = document.createElement('a');
			a.href = '#';
			// TODO: customize 'a' element contents
			span = document.createElement('span');
			span.innerHTML = 'li';
			a.appendChild(span);

			li.appendChild(a);
			ul.appendChild(li);
		}
		wrapper.appendChild(ul);

		document.querySelector('.circle-menu .center').addEventListener(
			'click', function() {
				var parent = this.parentElement,
					isActive = parent.classList.contains('active');
				this.parentElement.classList.toggle('active');
				this.firstElementChild.innerHTML = isActive ? '+' : '\u2013';
			});
	};

	CircularMenu.defaultOptions = {
		itemCount: 6
	};

	CircularMenu.prototype = {
		constructor: CircularMenu,
		initOptions: function(options) {
			var op;
			for (op in options) {
				if (!{}.hasOwnProperty.call(options, op)) continue;
				this.options[op] = options[op];
			}
		}
	};

	return CircularMenu;
}));
