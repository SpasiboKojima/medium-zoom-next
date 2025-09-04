export type ZoomSelector = string | HTMLElement | HTMLElement[] | NodeList;
export type ZoomEvent = 'open' | 'opened' | 'close' | 'closed' | 'detach' | 'update' | 'changed';

export interface ZoomOptionsParams {
	/**
	 * The space outside the zoomed image.
	 *
	 * @default 0
	 */
	margin?: number;

	/**
	 * The number of pixels to scroll to close the zoom.
	 *
	 * @default 40
	 */
	scrollOffset?: number;

	/**
	 * The viewport to render the zoom in.
	 *
	 * @default null
	 */
	container?: string | HTMLElement | ZoomContainer | null;

	/**
	 * The template element to display on zoom.
	 *
	 * @default null
	 */
	template?: string | HTMLTemplateElement | null;
}

export interface ZoomOptions extends Required<ZoomOptionsParams> {
	template: HTMLTemplateElement | null;
}

export interface ZoomActive {
	original: HTMLImageElement | null;
	zoomed: HTMLImageElement | null;
	template?: HTMLElement | null;
}

export interface ZoomContainer {
	width?: number;
	height?: number;
	top?: number;
	bottom?: number;
	right?: number;
	left?: number;
}

export interface ZoomOpenOptions {
	/**
	 * The target of the zoom.
	 *
	 * If not specified, the target is the first image of the zoom.
	 *
	 */
	target?: HTMLImageElement;
}

export interface Zoom {
	/**
	 * Opens the zoom.
	 *
	 * @param options
	 * @returns A promise resolving with the zoom.
	 */
	open(options?: ZoomOpenOptions): Promise<Zoom>;

	/**
	 * Changes currently zoomed image to another one already attached without animation. Useful to switch open image with keyboard or on-screen buttons.
	 *
	 * @param options
	 * @returns A promise resolving with the zoom.
	 */
	change(options?: ZoomOpenOptions): Promise<Zoom>;

	/**
	 * Closes the zoom.
	 *
	 * @returns A promise resolving with the zoom.
	 */
	close(): Promise<Zoom>;

	/**
	 * Toggles the zoom.
	 *
	 * @param options
	 * @returns A promise resolving with the zoom.
	 */
	toggle(options?: ZoomOpenOptions): Promise<Zoom>;

	/**
	 * Attaches the images to the zoom.
	 *
	 * @param selectors - The selectors describing the images.
	 * @returns The zoom.
	 */
	attach(...selectors: ZoomSelector[]): Zoom;

	/**
	 * Releases the images from the zoom.
	 *
	 * @param selectors - The selectors describing the images.
	 * @returns The zoom.
	 */
	detach(...selectors: ZoomSelector[]): Zoom;

	/**
	 * Updates the options.
	 *
	 * @param options
	 * @returns The zoom.
	 */
	update(options: ZoomOptionsParams): Zoom;

	/**
	 * Extends the zoom with the provided options merged with the current ones.
	 *
	 * @param options
	 * @returns The zoom.
	 */
	clone(options?: ZoomOptionsParams): Zoom;

	/**
	 * Registers an event handler on each target of the zoom.
	 *
	 * @param type - The event type to listen for.
	 * @param listener - The function to execute when the event is triggered.
	 * @param options - The event listener options (same as [`addEventListener`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Parameters))
	 * @returns The zoom.
	 */
	on(type: ZoomEvent, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): Zoom;

	/**
	 * Unregisters an event handler.
	 *
	 * @param type - The event type to unregister.
	 * @param listener - The function to remove from the event target.
	 * @param options - The event listener options (same as [`removeEventListener`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener#Parameters))
	 * @returns The zoom.
	 */
	off(type: ZoomEvent, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): Zoom;

	/**
	 * Returns the zoom options.
	 *
	 * @returns The zoom options.
	 */
	getOptions(): ZoomOptions;

	/**
	 * Returns the zoom images.
	 *
	 * @returns The zoom images.
	 */
	getImages(): HTMLElement[];

	/**
	 * Returns the current zoomed image.
	 *
	 * @returns The current zoomed image.
	 */
	getZoomedImage(): ZoomActive['original'];

	/**
	 * Removes all previously attached event listeners.
	 */
	destroy(): void;
}
