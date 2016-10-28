// TODO: use AMD
window.addEventListener("DOMContentLoaded", function() {
	document.querySelector(".circle-menu .center").addEventListener(
		"click", function() {
			var parent = this.parentElement,
				is_active = parent.classList.contains("active");
			this.parentElement.classList.toggle("active");
			this.innerHTML = is_active ? '+' : '\u2013';
		});
});
