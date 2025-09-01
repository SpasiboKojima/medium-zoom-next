import type { StoryObj } from '@storybook/html-vite';
import type mediumZoom from '../../src/medium-zoom';

declare global {
	interface Window {
		mediumZoom: typeof mediumZoom;
	}
}

export default {
	title: 'getImages()',
	tags: ['autodocs'],
};

export const Default: StoryObj = () => `
  <div>
    <img src="image-3.jpg">
  </div>
  <div>
    <img src="image-4.jpg">
  </div>
`;
Default.play = async () => {
	const zoom = window.mediumZoom('img');
	console.group('getImages()');
	console.log(zoom.getImages());
	console.groupEnd();
};
Default.storyName = 'default';
Default.parameters = {
	docs: {
		description: {
			story: 'Returns the zoom images.\n\n_Check the console._',
		},
		codePanel: true,
		source: {
			transform: (source) =>
				source.concat(`
  <script>
    const zoom = mediumZoom('img');

    console.group('getImages()');
    console.log(zoom.getImages());
    console.groupEnd();
  </script>`),
		},
	},
};
