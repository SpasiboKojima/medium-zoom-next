import type { StoryObj } from '@storybook/html-vite';
import type mediumZoom from '../../src/medium-zoom';

declare global {
	interface Window {
		mediumZoom: typeof mediumZoom;
	}
}

export default {
	title: 'close()',
	tags: ['autodocs'],
};

export const Default: StoryObj = () => `
  <div>
    <img id="image-1" src="image-3.jpg">
  </div>
  <div>
    <img id="image-2" src="image-4.jpg">
  </div>
`;
Default.play = async () => {
	const zoom = window.mediumZoom('img');
	await zoom.open();
	await zoom.close();
};
Default.storyName = 'default';
Default.parameters = {
	docs: {
		description: {
			story: 'Opens and closes the zoom.',
		},
		codePanel: true,
		source: {
			transform: (source) =>
				source.concat(`
  <script>
    const zoom = mediumZoom('img');
    zoom
      .open()
      .then(zoom => zoom.close());
  </script>
      `),
		},
	},
};
