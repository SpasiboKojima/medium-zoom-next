import type { StoryObj } from '@storybook/html-vite';
import type mediumZoom from '../../src/medium-zoom';

declare global {
	interface Window {
		mediumZoom: typeof mediumZoom;
	}
}

export default {
	title: 'on()',
	tags: ['autodocs'],
};

export const Open: StoryObj = () => `
  <img src="image-2.jpg">
`;
Open.play = async () => {
	const zoom = window.mediumZoom('img');
	zoom.on('open', () => alert('open'));
};
Open.storyName = 'open';
Open.parameters = {
	docs: {
		description: {
			story: 'The `open` event fires immediately when the open method is called.',
		},
	},
	codePanel: true,
	source: {
		transform: (source) =>
			source.concat(`
<script>
  const zoom = mediumZoom('img');

  zoom.on('open', () => alert('open'));
</script>`),
	},
};

export const Opened: StoryObj = () => `
  <img src="image-2.jpg">
`;
Opened.play = async () => {
	const zoom = window.mediumZoom('img');
	zoom.on('opened', () => alert('opened'));
};
Opened.storyName = 'opened';
Opened.parameters = {
	docs: {
		description: {
			story: 'The `opened` event fires when the zoom has finished being animated.',
		},
	},
	codePanel: true,
	source: {
		transform: (source) =>
			source.concat(`
<script>
  const zoom = mediumZoom('img');

  zoom.on('opened', () => alert('opened'));
</script>`),
	},
};

export const Close: StoryObj = () => `
  <img src="image-2.jpg">
`;
Close.play = async () => {
	const zoom = window.mediumZoom('img');
	zoom.on('close', () => alert('close'));
};
Close.storyName = 'close';
Close.parameters = {
	docs: {
		description: {
			story: 'The `close` event fires immediately when the `close` instance method is called.',
		},
	},
	codePanel: true,
	source: {
		transform: (source) =>
			source.concat(`
<script>
  const zoom = mediumZoom('img');

  zoom.on('close', () => alert('close'));
</script>`),
	},
};

export const Closed: StoryObj = () => `
  <img src="image-2.jpg">
`;
Closed.play = async () => {
	const zoom = window.mediumZoom('img');
	zoom.on('closed', () => alert('closed'));
};
Closed.storyName = 'closed';
Closed.parameters = {
	docs: {
		description: {
			story: 'The `closed` event fires when the zoom out has finished being animated.',
		},
	},
	codePanel: true,
	source: {
		transform: (source) =>
			source.concat(`
<script>
  const zoom = mediumZoom('img');

  zoom.on('closed', () => alert('closed'));
</script>`),
	},
};

export const Detach: StoryObj = () => `
  <img src="image-2.jpg">
  <div>
    <button id="detach">Detach</button>
  </div>
`;
Detach.play = async () => {
	const zoom = window.mediumZoom('img');
	const button = document.querySelector('#detach');
	if (button) {
		button.addEventListener('click', () => zoom.detach());
	}
	zoom.on('detach', () => alert('detach'), { once: true });
};
Detach.storyName = 'detach';
Detach.parameters = {
	docs: {
		description: {
			story:
				'The \`detach\` event fires when the \`detach\` instance method is called.\n          Once detached, the image is not part of the zoom anymore.',
		},
		codePanel: true,
		source: {
			transform: (source) =>
				source.concat(`
<script>
  const zoom = mediumZoom('img');
  const button = document.querySelector('#detach');

  button.addEventListener('click', () => zoom.detach());
  zoom.on('detach', () => alert('detach'), { once: true });
</script>`),
		},
	},
};

export const OpenOnlyOnce: StoryObj = () => `
  <img src="image-2.jpg">
`;
OpenOnlyOnce.play = async () => {
	const zoom = window.mediumZoom('img');
	zoom.on('open', () => alert('open'), { once: true });
};
OpenOnlyOnce.storyName = 'open only once';
OpenOnlyOnce.parameters = {
	docs: {
		description: {
			story: 'The `open` event fires immediately and only once when the open method is called.',
		},
	},
	codePanel: true,
	source: {
		transform: (source) =>
			source.concat(`
<script>
  const zoom = mediumZoom('img');

  zoom.on('open', () => alert('open'), { once: true });
</script>`),
	},
};
