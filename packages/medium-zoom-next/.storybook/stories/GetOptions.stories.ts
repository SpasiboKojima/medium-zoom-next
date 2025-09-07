import type { StoryObj } from '@storybook/html-vite';
import type mediumZoom from '../../src/medium-zoom';

declare global {
	interface Window {
		mediumZoom: typeof mediumZoom;
	}
}

export default {
	title: 'getOptions()',
	tags: ['autodocs'],
};

export const Default: StoryObj = () => `
  <img src="image-2.jpg">
`;
Default.play = async () => {
	const zoom = window.mediumZoom({ scrollOffset: 64, margin: 48 });
	console.group('getOptions()');
	console.log(zoom.getOptions());
	console.groupEnd();
};
Default.storyName = 'default';
Default.parameters = {
	docs: {
		description: {
			story: 'Returns the zoom options.\n\n_Check the console._',
		},
		codePanel: true,
		source: {
			transform: (source) =>
				source.concat(`
  <script>
    const zoom = mediumZoom({ scrollOffset: 64, margin: 48 });

    console.group('getOptions()');
    console.log(zoom.getOptions());
    console.groupEnd();
  </script>`),
		},
	},
};
