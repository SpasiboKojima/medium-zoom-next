import type { StoryObj } from '@storybook/html-vite';
import type mediumZoom from '../../src/medium-zoom';

declare global {
	interface Window {
		mediumZoom: typeof mediumZoom;
	}
}

export default {
	title: 'getZoomedImage()',
	tags: ['autodocs'],
};

export const Default: StoryObj = () => `
  <img src="image-2.jpg">
`;
Default.play = async () => {
	const zoom = window.mediumZoom('img');
	console.group('getZoomedImage()');
	console.log(zoom.getZoomedImage());
	zoom.on('open', () => console.log(zoom.getZoomedImage()));
	console.groupEnd();
};
Default.storyName = 'default';
Default.parameters = {
	docs: {
		description: {
			story: 'Returns the zoom active target.\n\n_Check the console._',
		},
		codePanel: true,
		source: {
			transform: (source) =>
				source.concat(`
  <script>
    const zoom = mediumZoom('img');

    console.group('getZoomedImage()');
    console.log(zoom.getZoomedImage());
    zoom.on('open', () => console.log(zoom.getZoomedImage()))
    console.groupEnd();
  </script>`),
		},
	},
};
