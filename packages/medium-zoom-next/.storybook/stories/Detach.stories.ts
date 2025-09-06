import type { StoryObj } from '@storybook/html-vite';
import type mediumZoom from '../../src/medium-zoom';

declare global {
	interface Window {
		mediumZoom: typeof mediumZoom;
	}
}

export default {
	title: 'detach()',
	tags: ['autodocs'],
};

export const WithStringSelector: StoryObj = () => `
  <div>
    <img id="image-1" src="image-3.jpg">
  </div>
  <div>
    <img id="image-2" src="image-4.jpg">
  </div>
`;
WithStringSelector.play = async () => {
	const zoom = window.mediumZoom('img');
	zoom.detach('#image-1');
};
WithStringSelector.storyName = 'with string selector';
WithStringSelector.parameters = {
	docs: {
		description: {
			story: 'Detaches the first image from the zoom with a string selector.',
		},
		codePanel: true,
		source: {
			transform: (source) =>
				source.concat(`
  <script>
    const zoom = mediumZoom('img');
    zoom.detach('#image-1');
  </script>`),
		},
	},
};

export const WithNodeSelector: StoryObj = () => `
  <div>
    <img id="image-1" src="image-3.jpg">
  </div>
  <div>
    <img id="image-2" src="image-4.jpg">
  </div>
`;
WithNodeSelector.play = async () => {
	const zoom = window.mediumZoom('img');
	const node = document.querySelector('#image-1') as HTMLElement | null;
	if (node) zoom.detach(node);
};
WithNodeSelector.storyName = 'with Node selector';
WithNodeSelector.parameters = {
	docs: {
		description: {
			story: 'Detaches the first image from the zoom with a Node selector.',
		},
		codePanel: true,
		source: {
			transform: (source) =>
				source.concat(`
<script>
  const zoom = mediumZoom('img');
  zoom.detach(document.querySelector('#image-1'));
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
WithMultipleSelectors.play = async () => {
	const zoom = window.mediumZoom('img');
	zoom.detach('#image-1', '#image-2');
};
WithMultipleSelectors.storyName = 'with multiple selectors';
WithMultipleSelectors.parameters = {
	docs: {
		description: {
			story: 'Detaches the images from the zoom with a multiple selectors.',
		},
		codePanel: true,
		source: {
			transform: (source) =>
				source.concat(`
<script>
  const zoom = mediumZoom('img');
  zoom.detach('#image-1', '#image-2');
</script>`),
		},
	},
};

export const All: StoryObj = () => `
  <div>
    <img id="image-1" src="image-3.jpg">
  </div>
  <div>
    <img id="image-2" src="image-4.jpg">
  </div>
`;
All.play = async () => {
	const zoom = window.mediumZoom('img');
	zoom.detach();
};
All.storyName = 'all';
All.parameters = {
	docs: {
		description: {
			story: 'Detaches all images from the zoom without selectors.',
		},
		codePanel: true,
		source: {
			transform: (source) =>
				source.concat(`
<script>
  const zoom = mediumZoom('img');
  zoom.detach();
</script>`),
		},
	},
};
