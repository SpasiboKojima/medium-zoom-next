export const isSupported = (node) => node.tagName === 'IMG';

export const isNodeList = (selector) => Object.prototype.isPrototypeOf.call(NodeList.prototype, selector);

export const isNode = (selector) => selector && selector.nodeType === 1;

export const isSvg = (image) => {
	const source = image.currentSrc || image.src;
	return source.substr(-4).toLowerCase() === '.svg';
};

export const getImagesFromSelector = (selector) => {
	try {
		if (Array.isArray(selector)) {
			return selector.filter(isSupported);
		}

		if (isNodeList(selector)) {
			return Array.from(selector).filter(isSupported);
		}

		if (isNode(selector)) {
			return [selector].filter(isSupported);
		}

		if (typeof selector === 'string') {
			return Array.from(document.querySelectorAll(selector)).filter(isSupported);
		}

		return [];
	} catch {
		throw new TypeError(
			'The provided selector is invalid.\n' +
				'Expects a CSS selector, a Node element, a NodeList or an array.\n' +
				'See: https://github.com/francoischalifour/medium-zoom'
		);
	}
};

export const createOverlay = () => {
	const overlay = document.createElement('div');
	overlay.classList.add('medium-zoom-overlay');

	return overlay;
};

export const cloneTarget = (template) => {
	const { top, left, width, height } = template.getBoundingClientRect();
	const clone = template.cloneNode();
	const scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
	const scrollLeft = window.scrollX || document.documentElement.scrollLeft || document.body.scrollLeft || 0;

	clone.removeAttribute('id');
	clone.style.position = 'absolute';
	clone.style.top = `${top + scrollTop}px`;
	clone.style.left = `${left + scrollLeft}px`;
	clone.style.width = `${width}px`;
	clone.style.height = `${height}px`;
	clone.style.transform = '';

	return clone;
};

export const createCustomEvent = (type, params) => {
	const eventParams = {
		bubbles: false,
		cancelable: false,
		detail: undefined,
		...params,
	};

	return new CustomEvent(type, eventParams);
};

export const getTemplate = (template) => {
	if (!template) return null;
	const tmpl = isNode(template) ? template : document.querySelector(template);

	if (!tmpl || tmpl.tagName !== 'TEMPLATE') {
		throw new Error('The specified template option is not a <template> element.');
	}

	return tmpl;
};
