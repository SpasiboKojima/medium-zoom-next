/** @jsxImportSource react */
import mediumZoom, { type Zoom, type ZoomOptionsParams } from 'medium-zoom-next';
import 'medium-zoom-next/dist/style.css';
import { useEffect, useRef, type ComponentProps, type RefCallback } from 'react';

type ImageZoomProps = ComponentProps<'img'> & {
	options?: ZoomOptionsParams;
};

export function ReactImageZoom({ options, ...props }: ImageZoomProps) {
	const zoomRef = useRef<Zoom | null>(null);

	function getZoom() {
		if (zoomRef.current === null) {
			zoomRef.current = mediumZoom(options);
		}

		return zoomRef.current;
	}

	const attachZoom: RefCallback<HTMLImageElement> = (node) => {
		const zoom = getZoom();

		if (node) {
			zoom.attach(node);
		} else {
			zoom.detach();
		}
	};

	useEffect(() => {
		return () => {
			zoomRef.current?.destroy();
		};
	}, []);

	return <img {...props} alt={props.alt} ref={attachZoom} />;
}

export function ReactPage() {
	return (
		<article className="container">
			<h1>React demo</h1>

			<ReactImageZoom src="images/image-1.jpg" alt="Zoom 1" />

			<p>
				Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tempora praesentium cupiditate fugit voluptas, rem eligendi, voluptatem
				molestias. Doloremque sit voluptatum odio maiores provident consequuntur accusantium saepe.
			</p>

			<ReactImageZoom src="images/image-2.jpg" alt="Zoom 2" />

			<p>
				Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea dolores quaerat, quis modi nostrum sequi adipisci ratione esse
				blanditiis error beatae vel non vero dolor nemo. Animi nemo quisquam ducimus!
			</p>

			<ReactImageZoom src="images/image-3.jpg" alt="Zoom 3" options={{ margin: 12 }} />
		</article>
	);
}
