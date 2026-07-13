// Lightweight client-side search and category filter for shop page
(function () {
	function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
	function qsa(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }

	const searchInput = qs('#shop-search');
	const categorySelect = qs('#shop-category');
	const productContainer = qs('.pro-container');
	const products = qsa('.pro');

	function normalize(str) { return (str || '').toString().trim().toLowerCase(); }

	function matchesCategory(el, category) {
		if (!category || category === 'all') return true;
		// try to match dataset or text content
		if (el.dataset && el.dataset.category) {
			return normalize(el.dataset.category) === normalize(category);
		}
		// fallback: check brand span or description
		const brand = normalize(el.querySelector('.des span')?.textContent);
		return brand === normalize(category);
	}

	function matchesSearch(el, query) {
		if (!query) return true;
		const name = normalize(el.dataset.name || el.querySelector('.des h5')?.textContent);
		const desc = normalize(el.querySelector('.des span')?.textContent);
		const price = normalize(el.dataset.price || el.querySelector('.des h4')?.textContent);
		return name.includes(query) || desc.includes(query) || price.includes(query);
	}

	function filterProducts() {
		const q = normalize(searchInput?.value);
		const cat = categorySelect?.value || 'all';
		products.forEach(p => {
			const show = matchesCategory(p, cat) && matchesSearch(p, q);
			p.style.display = show ? '' : 'none';
		});
	}

	// Debounce helper
	function debounce(fn, wait) {
		let t; return function (...a) { clearTimeout(t); t = setTimeout(() => fn.apply(this, a), wait); };
	}

	// Initialize dataset fields from DOM when missing so other scripts can rely on them
	products.forEach(p => {
		const brand = p.querySelector('.des span')?.textContent?.trim();
		const name = p.querySelector('.des h5')?.textContent?.trim();
		const price = p.querySelector('.des h4')?.textContent?.trim();
		if (!p.dataset.category && brand) p.dataset.category = brand.toLowerCase();
		if (!p.dataset.name && name) p.dataset.name = name;
		if (!p.dataset.price && price) p.dataset.price = price;
	});

	if (searchInput) searchInput.addEventListener('input', debounce(filterProducts, 180));
	if (categorySelect) categorySelect.addEventListener('change', filterProducts);

	// Expose function for manual invocation
	window.shopFilter = { filter: filterProducts };
})();
