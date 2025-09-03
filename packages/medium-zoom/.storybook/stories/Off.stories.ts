import type { StoryObj } from '@storybook/html-vite';
import type mediumZoom from '../../src/medium-zoom';

declare global {
	interface Window {
		mediumZoom: typeof mediumZoom;
	}
}

export default {
	title: 'off()',
	tags: ['autodocs'],
};

export const Open: StoryObj = () => `
  <img src="image-2.jpg">
`;
Open.play = async () => {
	const zoom = window.mediumZoom('img');
	const onOpen = () => alert('open');
	zoom.on('open', onOpen);
	zoom.off('open', onOpen);
};
Open.storyName = 'open';
Open.parameters = {
	docs: {
		description: {
			story: 'Listens and removes the listener on `open`.',
		},
		codePanel: true,
		source: {
			transform: (source) =>
				source.concat(`
<script>
  const zoom = mediumZoom('img');
  const onOpen = () => alert('open')

  zoom.on('open', onOpen);
  zoom.off('open', onOpen);
</script>`),
		},
	},
};

export const Opened: StoryObj = () => `
  <img src="image-2.jpg">
`;
Opened.play = async () => {
	const zoom = window.mediumZoom('img');
	const onOpened = () => alert('opened');
	zoom.on('opened', onOpened);
	zoom.off('opened', onOpened);
};
Opened.storyName = 'opened';
Opened.parameters = {
	docs: {
		description: {
			story: 'Listens and removes the listener on `opened`.',
		},
		codePanel: true,
		source: {
			transform: (source) =>
				source.concat(`
<script>
  const zoom = mediumZoom('img');
  const onOpened = () => alert('opened')

  zoom.on('opened', onOpened);
  zoom.off('opened', onOpened);
</script>`),
		},
	},
};

export const Close: StoryObj = () => `
  <img src="image-2.jpg">
`;
Close.play = async () => {
	const zoom = window.mediumZoom('img');
	const onClose = () => alert('close');
	zoom.on('close', onClose);
	zoom.off('close', onClose);
};
Close.storyName = 'close';
Close.parameters = {
	docs: {
		description: {
			story: 'Listens and removes the listener on `close`.',
		},
		codePanel: true,
		source: {
			transform: (source) =>
				source.concat(`
<script>
  const zoom = mediumZoom('img');
  const onClose = () => alert('close')

  zoom.on('close', onClose);
  zoom.off('close', onClose);
</script>`),
		},
	},
};

export const Closed: StoryObj = () => `
  <img src="image-2.jpg">
`;
Closed.play = async () => {
	const zoom = window.mediumZoom('img');
	const onClosed = () => alert('closed');
	zoom.on('closed', onClosed);
	zoom.off('closed', onClosed);
};
Closed.storyName = 'closed';
Closed.parameters = {
	docs: {
		description: {
			story: 'Listens and removes the listener on `closed`.',
		},
		codePanel: true,
		source: {
			transform: (source) =>
				source.concat(`
<script>
  const zoom = mediumZoom('img');
  const onClosed = () => alert('closed')

  zoom.on('closed', onClosed);
  zoom.off('closed', onClosed);
</script>`),
		},
	},
};

export const Detach: StoryObj = () => `
  <img src="image-2.jpg">
`;
Detach.play = async () => {
	const zoom = window.mediumZoom('img');
	const onDetach = () => alert('detach');
	zoom.on('detach', onDetach);
	zoom.off('detach', onDetach);
	zoom.detach();
};
Detach.storyName = 'detach';
Detach.parameters = {
	docs: {
		description: {
			story: 'Listens and removes the listener on `detach`.',
		},
		codePanel: true,
		source: {
			transform: (source) =>
				source.concat(`
<script>
  const zoom = mediumZoom('img');
  const onDetach = () => alert('detach')

  zoom.on('detach', onDetach);
  zoom.off('detach', onDetach);
  zoom.detach();
</script>
`),
		},
	},
};
