import type { Meta, StoryObj } from '@storybook/html-vite';
import type mediumZoom from '../../src/medium-zoom';

declare global {
	interface Window {
		mediumZoom: typeof mediumZoom;
	}
}

export default {
	title: 'attach()',
	tags: ['autodocs'],
} satisfies Meta<StoryObj>;

export const WithStringSelector: StoryObj = () => `
  <div>
    <img id="image-1" src="image-3.jpg">
  </div>
  <div>
    <img id="image-2" src="image-4.jpg">
  </div>
`;

WithStringSelector.play = () => {
	const zoom = window.mediumZoom();
	zoom.attach('img');
};
WithStringSelector.storyName = 'with string selector';
WithStringSelector.parameters = {
	docs: {
		description: {
			story: 'Attaches the zoom with a string selector.',
		},
		codePanel: true,
		source: {
			transform: (source) =>
				source.concat(`
  <script>
    const zoom = mediumZoom();
    zoom.attach('img');
  </script>`),
		},
	},
};

export const WithNodeSelector: StoryObj = () => `
  <div>
    <img src="image-3.jpg">
  </div>
`;
WithNodeSelector.play = ({ canvasElement }) => {
	const zoom = window.mediumZoom();
	const img = canvasElement.querySelector('img');
	if (img) {
		zoom.attach(img);
	}
};
WithNodeSelector.storyName = 'with Node selector';
WithNodeSelector.parameters = {
	docs: {
		description: {
			story: 'Attaches the zoom with a Node selector.',
		},
		codePanel: true,
		source: {
			transform: (source) =>
				source.concat(`
  <script>
    const zoom = mediumZoom();
    zoom.attach(document.querySelector('img'));
  </script>`),
		},
	},
};

export const WithMultipleSelectors: StoryObj = () => `
  <div>
    <img id="image-1" src="image-3.jpg">
  </div>
  <div>
    <img id="image-2" src="image-4.jpg">
  </div>
`;
WithMultipleSelectors.play = () => {
	const zoom = window.mediumZoom();
	zoom.attach('#image-1', '#image-2');
};
WithMultipleSelectors.storyName = 'with multiple selectors';
WithMultipleSelectors.parameters = {
	docs: {
		description: {
			story: 'Attaches the zoom with multiple selectors.',
		},
		codePanel: true,
		source: {
			transform: (source) =>
				source.concat(`
  <script>
    const zoom = window.mediumZoom();
    zoom.attach('#image-1', '#image-2');
  </script>`),
		},
	},
};
