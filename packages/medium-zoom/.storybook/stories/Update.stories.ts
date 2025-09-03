import type { StoryObj } from '@storybook/html-vite';
import type mediumZoom from '../../src/medium-zoom';

declare global {
	interface Window {
		mediumZoom: typeof mediumZoom;
	}
}

export default {
	title: 'update()',
	tags: ['autodocs'],
};

export const MultipleOptions: StoryObj = () => `
  <img src="image-2.jpg">
  <div>
    <button id="update">Update options</button>
  </div>
`;
MultipleOptions.play = async () => {
	const zoom = window.mediumZoom('img');
	const button = document.querySelector('#update');
	if (button) {
		button.addEventListener('click', () => {
			zoom.update({
				margin: 100,
				background: 'yellow',
				scrollOffset: 0,
			});
		});
	}
};
MultipleOptions.storyName = 'multiple options';
MultipleOptions.parameters = {
	docs: {
		description: {
			story: 'Click on the button the update the options and zoom again.',
		},
		codePanel: true,
		source: {
			transform: (source) =>
				source.concat(`
<script>
  const zoom = mediumZoom('img');
  const button = document.querySelector('#update');

  button.addEventListener('click', () => zoom.update({
    margin: 100,
    background: 'yellow',
    scrollOffset: 0,
  }));
</script>`),
		},
	},
};
