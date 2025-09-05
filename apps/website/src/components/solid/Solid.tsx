import mediumZoom, { type Zoom, type ZoomOptionsParams } from 'medium-zoom';
import type { JSX } from 'solid-js';
import 'medium-zoom/dist/style.css';

type ImageZoomProps = JSX.IntrinsicElements['img'] & {
	options?: ZoomOptionsParams;
};

export function SolidImageZoom({ options, ...props }: ImageZoomProps) {
	let zoomRef: Zoom;

	function getZoom() {
		if (!zoomRef) {
			zoomRef = mediumZoom(options);
		}

		return zoomRef;
	}

	const attachZoom: JSX.IntrinsicElements['img']['ref'] = (node) => {
		const zoom = getZoom();
		if (!zoom) return;

		if (node) {
			zoom.attach(node);
		} else {
			zoom.detach();
		}
	};

	return <img alt={props.alt} {...props} ref={attachZoom} />;
}

export function SolidPage() {
	return (
		<article class="container">
			<h1>Solid demo</h1>

			<SolidImageZoom src="images/image-1.jpg" alt="Zoom 1" />

			<p>
				Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tempora praesentium cupiditate fugit voluptas, rem eligendi, voluptatem
				molestias. Doloremque sit voluptatum odio maiores provident consequuntur accusantium saepe.
			</p>

			<SolidImageZoom src="images/image-2.jpg" alt="Zoom 2" />

			<p>
				Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea dolores quaerat, quis modi nostrum sequi adipisci ratione esse
				blanditiis error beatae vel non vero dolor nemo. Animi nemo quisquam ducimus!
			</p>

			<SolidImageZoom src="images/image-3.jpg" alt="Zoom 3" options={{ margin: 12 }} />
		</article>
	);
}
