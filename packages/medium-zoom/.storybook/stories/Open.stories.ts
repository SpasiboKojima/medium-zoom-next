import type { StoryObj } from '@storybook/html-vite';
import type mediumZoom from '../../src/medium-zoom';

declare global {
	interface Window {
		mediumZoom: typeof mediumZoom;
	}
}

export default {
	title: 'open()',
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
	zoom.open();
};
Default.storyName = 'default';
Default.parameters = {
	docs: {
		description: {
			story: 'Opens the zoom with the default target.',
		},
		codePanel: true,
		source: {
			transform: (source) =>
				source.concat(`
<script>
  const zoom = mediumZoom('img');
  zoom.open();
</script>`),
		},
	},
};

export const WithTarget: StoryObj = () => `
  <div>
    <img id="image-1" src="image-3.jpg">
  </div>
  <div>
    <img id="image-2" src="image-4.jpg">
  </div>
`;
WithTarget.play = async () => {
	const zoom = window.mediumZoom('img');
	const target = document.querySelector('#image-2') as HTMLElement | null;
	zoom.open({ target: target ?? undefined });
};
WithTarget.storyName = 'with target';
WithTarget.parameters = {
	docs: {
		description: {
			story: 'Opens the zoom with the specified target',
		},
		codePanel: true,
		source: {
			transform: (source) =>
				source.concat(`
<script>
  const zoom = mediumZoom('img');
  zoom.open({ target: document.querySelector('#image-2') });
</script>`),
		},
	},
};
