import type { Zoom, ZoomActive, ZoomOpenOptions, ZoomOptions, ZoomOptionsParams, ZoomSelector } from './types';
import { cloneTarget, createCustomEvent, createOverlay, getImagesFromSelector, getTemplate, isNode, isSvg } from './utils';

declare global {
	const __TEST__: boolean;
}

const mediumZoom = (selector?: ZoomSelector | ZoomOptionsParams, options: ZoomOptionsParams = {}) => {
	const _handleResize = () => {
		const browserScale = window.visualViewport?.scale ?? 1;

		if (isScaling || browserScale > 1) {
			return;
		}
		close();
	};

	const _handleScroll = () => {
		if (isAnimating || !active.original) {
			return;
		}
		const browserScale = window.visualViewport?.scale ?? 1;

		if (isScaling || browserScale > 1) {
			return;
		}

		const currentScroll = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;

		if (Math.abs(scrollTop - currentScroll) > zoomOptions.scrollOffset) {
			setTimeout(close, 150);
		}
	};

	const _handleTouchStart = (e: TouchEvent) => {
		if (e.touches.length > 1) {
			isScaling = true;
			return;
		}
	};

	const _handleTouchEnd = () => {
		isScaling = false;
	};

	const _handleKeyDown = (event: KeyboardEvent) => {
		const key = event.key;

		// Close if escape or Tab key is pressed
		if (key === 'Escape' || key === 'Esc' || key === 'Tab') {
			close();
		}
	};

	const update = (options: ZoomOptionsParams = {}) => {
		const newOptions = options;

		if (options.container && options.container instanceof Object) {
			newOptions.container = {
				...(zoomOptions.container instanceof Object ? zoomOptions.container : {}),
				...options.container,
			};
		}

		zoomOptions = { ...zoomOptions, ...newOptions, template: getTemplate(options.template) };

		images.forEach((image) => {
			image.dispatchEvent(
				createCustomEvent('medium-zoom:update', {
					detail: { zoom },
				})
			);
		});

		return zoom;
	};

	const clone = (options = {}) => mediumZoom({ ...zoomOptions, ...options });

	const attach = (...selectors: ZoomSelector[]) => {
		const newImages = selectors.reduce<HTMLImageElement[]>(
			(imagesAccumulator, currentSelector) => imagesAccumulator.concat(getImagesFromSelector(currentSelector)),
			[]
		);

		newImages
			.filter((newImage) => images.indexOf(newImage) === -1)
			.forEach((newImage) => {
				images.push(newImage);
				newImage.classList.add('medium-zoom-image');
				newImage.addEventListener('click', () => toggle({ target: newImage }), { signal: controller.signal });
			});

		eventListeners.forEach(({ type, listener, options }) => {
			newImages.forEach((image) => {
				image.addEventListener(type, listener, options);
			});
		});

		return zoom;
	};

	const detach = (...selectors: ZoomSelector[]) => {
		if (active.zoomed) {
			close();
		}

		const imagesToDetach =
			selectors.length > 0
				? selectors.reduce<HTMLImageElement[]>(
						(imagesAccumulator, currentSelector) => imagesAccumulator.concat(getImagesFromSelector(currentSelector)),
						[]
					)
				: images;

		imagesToDetach.forEach((image) => {
			image.classList.remove('medium-zoom-image');
			image.dispatchEvent(
				createCustomEvent('medium-zoom:detach', {
					detail: { zoom },
				})
			);
		});

		images = images.filter((image) => imagesToDetach.indexOf(image) === -1);

		return zoom;
	};

	const on = (type: string, listener: EventListenerOrEventListenerObject, options: boolean | AddEventListenerOptions = {}) => {
		images.forEach((image) => {
			image.addEventListener(`medium-zoom:${type}`, listener, options);
		});

		eventListeners.push({ type: `medium-zoom:${type}`, listener, options });

		return zoom;
	};

	const off = (type: string, listener: EventListenerOrEventListenerObject, options: boolean | AddEventListenerOptions = {}) => {
		images.forEach((image) => {
			image.removeEventListener(`medium-zoom:${type}`, listener, options);
		});

		eventListeners = eventListeners.filter(
			(eventListener) => !(eventListener.type === `medium-zoom:${type}` && eventListener.listener.toString() === listener.toString())
		);

		return zoom;
	};

	const _animate = () => {
		let container = {
			width: document.documentElement.clientWidth,
			height: document.documentElement.clientHeight,
			left: 0,
			top: 0,
			right: 0,
			bottom: 0,
		};
		let viewportWidth: number;
		let viewportHeight: number;

		if (zoomOptions.container) {
			if (zoomOptions.container instanceof Object && 'top' in zoomOptions.container) {
				// The container is given as an object with properties like width, height, left, top
				container = {
					...container,
					...zoomOptions.container,
				};

				// We need to adjust custom options like container.right or container.bottom
				viewportWidth = container.width - container.left - container.right - zoomOptions.margin * 2;
				viewportHeight = container.height - container.top - container.bottom - zoomOptions.margin * 2;
			} else if (zoomOptions.container instanceof HTMLElement || typeof zoomOptions.container === 'string') {
				// The container is given as an element
				const zoomContainer = isNode(zoomOptions.container)
					? zoomOptions.container
					: document.querySelector<HTMLElement>(zoomOptions.container);

				if (zoomContainer) {
					const { width, height, left, top } = zoomContainer.getBoundingClientRect();

					container.width = width;
					container.height = height;
					container.left = left;
					container.top = top;
				}
			}
		}

		viewportWidth ??= container.width - zoomOptions.margin * 2;
		viewportHeight ??= container.height - zoomOptions.margin * 2;

		const zoomTarget = active.zoomedHd || active.original;
		if (!zoomTarget || !active.zoomed) return;
		const isSvgImage = isSvg(zoomTarget);

		const naturalWidth = isSvgImage ? viewportWidth : zoomTarget.naturalWidth || viewportWidth;
		const naturalHeight = isSvgImage ? viewportHeight : zoomTarget.naturalHeight || viewportHeight;
		const { top, left, width, height } = zoomTarget.getBoundingClientRect();

		const scaleX = Math.min(Math.max(width, naturalWidth), viewportWidth) / width;
		const scaleY = Math.min(Math.max(height, naturalHeight), viewportHeight) / height;
		const scale = Math.min(scaleX, scaleY);
		const translateX = (-left + (viewportWidth - width) / 2 + zoomOptions.margin + container.left) / scale;
		const translateY = (-top + (viewportHeight - height) / 2 + zoomOptions.margin + container.top) / scale;
		const transform = `scale(${scale}) translate3d(${translateX}px, ${translateY}px, 0)`;

		active.zoomed.style.transform = transform;

		if (active.zoomedHd) {
			active.zoomedHd.style.transform = transform;
		}
	};

	const open = ({ target }: ZoomOpenOptions = {}): Promise<Zoom> =>
		new Promise((resolve) => {
			if ((target && images.indexOf(target) === -1) || images.length === 0) {
				resolve(zoom);
				return;
			}

			if (active.zoomed) {
				resolve(zoom);
				return;
			}

			const _handleOpenEnd = () => {
				isAnimating = false;
				if (!active.zoomed || !active.original) return resolve(zoom);
				active.zoomed.removeEventListener('transitionend', _handleOpenEnd);
				active.original.dispatchEvent(
					createCustomEvent('medium-zoom:opened', {
						detail: { zoom },
					})
				);

				resolve(zoom);
			};

			if (target) {
				// The zoom was triggered manually via a click
				active.original = target;
			} else {
				// The zoom was triggered programmatically, select the first image in the list
				[active.original] = images;
			}

			active.original.dispatchEvent(
				createCustomEvent('medium-zoom:open', {
					detail: { zoom },
				})
			);

			scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
			isAnimating = true;
			active.zoomed = cloneTarget(active.original);

			document.body.appendChild(overlay);

			if (zoomOptions.template) {
				active.template = document.createElement('div');
				active.template.appendChild(zoomOptions.template.content.cloneNode(true));

				document.body.appendChild(active.template);
			}

			// If the selected <img> tag is inside a <picture> tag, set the
			// currently-applied source as the cloned `src=` attribute.
			// (as these might differ, or src= might be unset in some cases)
			if (active.original.parentElement && active.original.parentElement.tagName === 'PICTURE' && active.original.currentSrc) {
				active.zoomed.src = active.original.currentSrc;
			}

			document.body.appendChild(active.zoomed);

			window.requestAnimationFrame(() => {
				document.body.classList.add('medium-zoom--opened');
			});

			active.original.classList.add('medium-zoom-image--hidden');
			active.zoomed.classList.add('medium-zoom-image--opened');

			active.zoomed.addEventListener('click', close);
			active.zoomed.addEventListener('transitionend', _handleOpenEnd);

			const hdSource = active.original.getAttribute('data-zoom-src');
			if (hdSource) {
				active.zoomedHd = active.zoomed.cloneNode() as HTMLImageElement;

				// Reset the `scrset` property or the HD image won't load.
				active.zoomedHd.removeAttribute('srcset');
				active.zoomedHd.removeAttribute('sizes');
				// Remove loading attribute so the browser can load the image normally
				active.zoomedHd.removeAttribute('loading');

				active.zoomedHd.src = hdSource;

				active.zoomedHd.onerror = () => {
					clearInterval(getZoomTargetSize);
					console.warn(`Unable to reach the zoom image target ${active.zoomedHd?.src}`);
					active.zoomedHd = null;
					_animate();
				};

				// We need to access the natural size of the full HD
				// target as fast as possible to compute the animation.
				const getZoomTargetSize = setInterval(() => {
					if (!active.zoomedHd) return;
					if (__TEST__ ? true : active.zoomedHd.complete) {
						clearInterval(getZoomTargetSize);
						active.zoomedHd.classList.add('medium-zoom-image--opened');
						active.zoomedHd.addEventListener('click', close);
						document.body.appendChild(active.zoomedHd);
						_animate();
					}
				}, 10);
			} else if (active.original.hasAttribute('srcset')) {
				// If an image has a `srcset` attribuet, we don't know the dimensions of the
				// zoomed (HD) image (like when `data-zoom-src` is specified).
				// Therefore the approach is quite similar.
				active.zoomedHd = active.zoomed.cloneNode() as HTMLImageElement;

				// Resetting the sizes attribute tells the browser to load the
				// image best fitting the current viewport size, respecting the `srcset`.
				active.zoomedHd.removeAttribute('sizes');

				// In Firefox, the `loading` attribute needs to be set to `eager` (default
				// value) for the load event to be fired.
				active.zoomedHd.removeAttribute('loading');

				// Wait for the load event of the hd image. This will fire if the image
				// is already cached.
				const loadEventListener = () => {
					if (!active.zoomedHd) return;
					active.zoomedHd.removeEventListener('load', loadEventListener);
					active.zoomedHd.classList.add('medium-zoom-image--opened');
					active.zoomedHd.addEventListener('click', close);
					document.body.appendChild(active.zoomedHd);
					_animate();
				};
				active.zoomedHd.addEventListener('load', loadEventListener);
			} else {
				_animate();
			}

			if (__TEST__) {
				// The event `transitionend` is not triggered in test environment.
				// Calling this function manually makes testing the open() function possible.
				_handleOpenEnd();
			}
		});

	const close = (): Promise<Zoom> =>
		new Promise((resolve) => {
			if (isAnimating || !active.original || !active.zoomed) {
				resolve(zoom);
				return;
			}

			const _handleCloseEnd = () => {
				if (!active.original || !active.zoomed) return resolve(zoom);
				active.original.classList.remove('medium-zoom-image--hidden');
				document.body.removeChild(active.zoomed);
				if (active.zoomedHd) {
					document.body.removeChild(active.zoomedHd);
				}
				document.body.removeChild(overlay);
				active.zoomed.classList.remove('medium-zoom-image--opened');
				if (active.template) {
					document.body.removeChild(active.template);
				}

				isAnimating = false;
				active.zoomed.removeEventListener('transitionend', _handleCloseEnd);

				active.original.dispatchEvent(
					createCustomEvent('medium-zoom:closed', {
						detail: { zoom },
					})
				);

				active.original = null;
				active.zoomed = null;
				active.zoomedHd = null;
				active.template = null;

				resolve(zoom);
			};

			isAnimating = true;
			document.body.classList.remove('medium-zoom--opened');
			active.zoomed.style.transform = '';

			if (active.zoomedHd) {
				active.zoomedHd.style.transform = '';
			}

			// Fade out the template so it's not too abrupt
			if (active.template) {
				active.template.style.transition = 'opacity 150ms';
				active.template.style.opacity = '0';
			}

			active.original.dispatchEvent(
				createCustomEvent('medium-zoom:close', {
					detail: { zoom },
				})
			);

			active.zoomed.addEventListener('transitionend', _handleCloseEnd);

			if (__TEST__) {
				// The event `transitionend` is not triggered in test environment.
				// Calling this function manually makes testing the close() function possible.
				_handleCloseEnd();
			}
		});

	const toggle = ({ target }: ZoomOpenOptions = {}) => {
		if (active.original) {
			return close();
		}

		return open({ target });
	};

	let images: HTMLImageElement[] = [];
	let eventListeners: Array<{ type: string; listener: EventListenerOrEventListenerObject; options: boolean | AddEventListenerOptions }> =
		[];
	let isAnimating = false;
	let isScaling = false;
	let scrollTop = 0;
	let zoomOptions: ZoomOptions = {
		margin: 0,
		scrollOffset: 40,
		container: null,
		template: null,
	};

	const active: ZoomActive = {
		original: null,
		zoomed: null,
		zoomedHd: null,
		template: null,
	};

	let optsToApply: ZoomOptionsParams;

	// Determine initial zoomOptions based on selector or options
	if (Object.prototype.toString.call(selector) === '[object Object]') {
		optsToApply = selector as ZoomOptionsParams;
	} else {
		optsToApply = options;
		if (selector || typeof selector === 'string') {
			// to process empty string as a selector
			attach(selector as ZoomSelector);
		}
	}

	zoomOptions = {
		...zoomOptions,
		...optsToApply,
		template: getTemplate(optsToApply.template),
	};

	const controller = new AbortController();

	const overlay = createOverlay();
	overlay.addEventListener('click', close);

	document.addEventListener('keydown', _handleKeyDown, { signal: controller.signal });
	window.addEventListener('scroll', _handleScroll, { passive: true, signal: controller.signal });
	window.addEventListener('touchstart', _handleTouchStart, { passive: true, signal: controller.signal });
	window.addEventListener('touchend', _handleTouchEnd, { passive: true, signal: controller.signal });
	window.addEventListener('touchcancel', _handleTouchEnd, { passive: true, signal: controller.signal });
	window.addEventListener('resize', _handleResize, { passive: true, signal: controller.signal });

	const zoom: Zoom = {
		open,
		close,
		toggle,
		update,
		clone,
		attach,
		detach,
		on,
		off,
		getOptions: () => zoomOptions,
		getImages: () => images,
		getZoomedImage: () => active.original,
		destroy: () => controller.abort(),
	};

	return zoom;
};

export default mediumZoom;
