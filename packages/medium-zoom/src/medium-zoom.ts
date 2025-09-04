import type { Zoom, ZoomActive, ZoomOpenOptions, ZoomOptions, ZoomOptionsParams, ZoomSelector } from './types';
import { cloneTarget, createCustomEvent, createOverlay, getImagesFromSelector, getTemplate, isNode, isSvg } from './utils';

declare global {
	const __TEST__: boolean;
}

const mediumZoom = (selector?: ZoomSelector | ZoomOptionsParams, options: ZoomOptionsParams = {}) => {
	const controller = new AbortController();

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

		const zoomTarget = active.zoomed || active.original;
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
		const transform = `scale(${scale}) translate(${translateX}px, ${translateY}px) translateZ(0)`;

		active.zoomed.style.transform = transform;
	};

	const _prepareZoomedImage = (original: HTMLImageElement, options: { isChange?: boolean } = {}): Promise<HTMLImageElement> =>
		new Promise((resolve) => {
			const zoomed = cloneTarget(original);

			// If the selected <img> tag is inside a <picture> tag, set the
			// currently-applied source as the cloned `src=` attribute.
			// (as these might differ, or src= might be unset in some cases)
			if (original.parentElement?.tagName === 'PICTURE' && original.currentSrc) {
				zoomed.src = original.currentSrc;
			}

			if (options.isChange) {
				zoomed.classList.add('medium-zoom-image--opened', 'medium-zoom-image--change');
			} else {
				zoomed.classList.add('medium-zoom-image--opened');
			}

			const hdSource = original.getAttribute('data-zoom-src');
			if (hdSource) {
				const zoomedHd: HTMLImageElement = zoomed.cloneNode() as HTMLImageElement;

				// Reset the `scrset` property or the HD image won't load.
				zoomedHd.removeAttribute('srcset');
				zoomedHd.removeAttribute('sizes');
				// Remove loading attribute so the browser can load the image normally
				zoomedHd.removeAttribute('loading');

				zoomedHd.src = hdSource;

				zoomedHd.onerror = () => {
					clearInterval(getZoomTargetSize);
					console.warn(`Unable to reach the zoom image target ${zoomedHd?.src}`);
					active.zoomed = zoomed;
					resolve(zoomed);
				};

				// We need to access the natural size of the full HD
				// target as fast as possible to compute the animation.
				const getZoomTargetSize = setInterval(() => {
					if (__TEST__ ? true : zoomedHd.complete) {
						clearInterval(getZoomTargetSize);
						resolve(zoomedHd);
					}
				}, 10);

				if (__TEST__) {
					// setInterval is not triggered in test environment.
					// Calling this function manually makes testing the open() function possible.
					resolve(zoomedHd);
				}
			} else if (original.hasAttribute('srcset')) {
				// If an image has a `srcset` attribuet, we don't know the dimensions of the
				// zoomed (HD) image (like when `data-zoom-src` is specified).
				// Therefore the approach is quite similar.
				const zoomedHd = zoomed.cloneNode() as HTMLImageElement;

				// Resetting the sizes attribute tells the browser to load the
				// image best fitting the current viewport size, respecting the `srcset`.
				zoomedHd.removeAttribute('sizes');

				// In Firefox, the `loading` attribute needs to be set to `eager` (default
				// value) for the load event to be fired.
				zoomedHd.removeAttribute('loading');

				// Wait for the load event of the hd image. This will fire if the image
				// is already cached.
				const loadEventListener = () => {
					zoomedHd.removeEventListener('load', loadEventListener);
					resolve(zoomedHd);
				};
				zoomedHd.addEventListener('load', loadEventListener);

				if (__TEST__) {
					// The event `load` is not triggered in test environment.
					// Calling this function manually makes testing the open() function possible.
					resolve(zoomedHd);
				}
			} else {
				resolve(zoomed);
			}
		});

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

			const _finishOpen = (imageElement: HTMLImageElement) => {
				document.body.appendChild(imageElement);
				imageElement.addEventListener('click', close);
				imageElement.addEventListener('transitionend', _handleOpenEnd);
				active.original?.classList.add('medium-zoom-image--hidden');

				window.requestAnimationFrame(() => {
					document.body.classList.add('medium-zoom--opened');
				});

				active.zoomed = imageElement;

				_animate();

				if (__TEST__) {
					// The event `transitionend` is not triggered in test environment.
					// Calling this function manually makes testing the open() function possible.
					_handleOpenEnd();
				}
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

			document.body.appendChild(overlay);

			if (zoomOptions.template) {
				active.template = document.createElement('div');
				active.template.appendChild(zoomOptions.template.content.cloneNode(true));

				document.body.appendChild(active.template);
			}

			_prepareZoomedImage(active.original, {}).then(_finishOpen);
		});

	const change = ({ target }: ZoomOpenOptions): Promise<Zoom> =>
		new Promise((resolve) => {
			if ((target && images.indexOf(target) === -1) || images.length === 0) {
				resolve(zoom);
				return;
			}

			if (isAnimating || !active.original || !active.zoomed) {
				resolve(zoom);
				return;
			}

			const _finishOpen = (imageElement: HTMLImageElement) => {
				imageElement.addEventListener('click', close);
				document.body.appendChild(imageElement);
				if (active.zoomed) {
					document.body.removeChild(active.zoomed);
				}
				active.zoomed = imageElement;
				active.original?.classList.add('medium-zoom-image--hidden');

				_animate();

				isAnimating = false;
				resolve(zoom);
			};

			active.original.classList.remove('medium-zoom-image--hidden');

			if (target) {
				// The zoom was triggered manually via a click
				active.original = target;
			} else {
				// The zoom was triggered programmatically, select the first image in the list
				[active.original] = images;
			}

			scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
			isAnimating = true;

			_prepareZoomedImage(active.original, { isChange: true }).then(_finishOpen);
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
				active.template = null;

				resolve(zoom);
			};

			isAnimating = true;
			document.body.classList.remove('medium-zoom--opened');
			active.zoomed.classList.remove('medium-zoom-image--change');
			active.zoomed.style.transform = '';

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
		template: null,
	};

	const zoom: Zoom = {
		open,
		change,
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

	const overlay = createOverlay();
	overlay.addEventListener('click', close);

	document.addEventListener('keydown', _handleKeyDown, { signal: controller.signal });
	window.addEventListener('scroll', _handleScroll, { passive: true, signal: controller.signal });
	window.addEventListener('touchstart', _handleTouchStart, { passive: true, signal: controller.signal });
	window.addEventListener('touchend', _handleTouchEnd, { passive: true, signal: controller.signal });
	window.addEventListener('touchcancel', _handleTouchEnd, { passive: true, signal: controller.signal });
	window.addEventListener('resize', _handleResize, { passive: true, signal: controller.signal });

	return zoom;
};

export default mediumZoom;
