import type { StoryObj } from '@storybook/html-vite';
import type mediumZoom from '../../src/medium-zoom';

declare global {
	interface Window {
		mediumZoom: typeof mediumZoom;
	}
}

export default {
	title: 'clone()',
	tags: ['autodocs'],
};

export const WithMargin: StoryObj = () => `
  <img src="image-2.jpg">
`;
WithMargin.play = async () => {
	const zoom = window.mediumZoom({ background: '#000' });
	const clonedZoom = zoom.clone({ margin: 100 });
	clonedZoom.attach('img');
};
WithMargin.storyName = 'with margin';
WithMargin.parameters = {
	docs: {
		description: {
			story: 'This zoom clones an existing zoom and add margins.',
		},
		codePanel: true,
		source: {
			transform: (source) =>
				source.concat(`
    <script>
      const zoom = mediumZoom({ background: '#000' });
      const clonedZoom = zoom.clone({ margin: 100 })
      clonedZoom.attach('img')
    </script>`),
		},
	},
};
