import type { StoryObj } from '@storybook/html-vite';
import type mediumZoom from '../../src/medium-zoom';

declare global {
	interface Window {
		mediumZoom: typeof mediumZoom;
	}
}

export default {
	title: 'toggle()',
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
	await zoom.toggle();
	await zoom.toggle();
};
Default.storyName = 'default';
Default.parameters = {
	docs: {
		description: {
			story: 'Toggles the zoom twice.',
		},
		codePanel: true,
		source: {
			transform: (source) =>
				source.concat(`
  <script>
    const zoom = mediumZoom('img');
    zoom
      .toggle()
      .then(zoom => zoom.toggle());
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
	if (target) {
		await zoom.toggle({ target });
		await zoom.toggle();
	}
};
WithTarget.storyName = 'with target';
WithTarget.parameters = {
	docs: {
		description: {
			story: 'Toggles the zoom twice with the specified target.',
		},
		codePanel: true,
		source: {
			transform: (source) =>
				source.concat(`
  <script>
    const zoom = mediumZoom('img');
    zoom
      .toggle({ target: document.querySelector('#image-2') })
      .then(zoom => zoom.toggle());
  </script>`),
		},
	},
};
