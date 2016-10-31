(function (root, factory) {

	"use strict";

	// CommonJS module
	if (typeof module === "object" && module.exports) {
		module.exports = factory();
	}
	// AMD module
	else if (typeof require === "function" && define.amd) {
		define([], factory);
	}
	// define module in root scope
	else {
		root.CircularMenu = factory();
	}

}(this, function() {
	"use strict";

	var CircularMenu = function(element, options) {
		var menuDiv, center, wrapper, ul, li, a, span, i;

		this.options = CircularMenu.defaultOptions;
		this.initOptions(options);

		menuDiv = document.createElement("div");
		element.appendChild(menuDiv);
		menuDiv.classList.add("circle-menu");

		center = document.createElement("div");
		center.classList.add("center");
		span = document.createElement("span");
		span.innerHTML = "+";
		center.appendChild(span);

		wrapper = document.createElement("div");
		wrapper.classList.add("wrapper");

		menuDiv.appendChild(center);
		menuDiv.appendChild(wrapper);

		ul = document.createElement("ul");
		for (i = 0; i < this.options.itemCount; ++i) {
			li = document.createElement("li");
			a = document.createElement("a");
			a.href = "#";
			// TODO: customize "a" element contents
			span = document.createElement("span");
			span.innerHTML = "li";
			a.appendChild(span);

			li.appendChild(a);
			ul.appendChild(li);
		}
		wrapper.appendChild(ul);

		document.querySelector(".circle-menu .center").addEventListener(
			"click", function() {
				var parent = this.parentElement,
					is_active = parent.classList.contains("active");
				this.parentElement.classList.toggle("active");
				this.firstElementChild.innerHTML = is_active ? '+' : '\u2013';
			});
	};

	CircularMenu.defaultOptions = {
		itemCount: 6
	};

	CircularMenu.prototype = {
		constructor: CircularMenu,
		initOptions: function(options) {
			for (var op in options) {
				if (!options.hasOwnProperty(op)) continue;
				this.options[op] = options[op];
			}
		}
	};

	return CircularMenu;
}));
