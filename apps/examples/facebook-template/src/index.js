import mediumZoom from 'medium-zoom';
import 'medium-zoom/dist/style.css';

const zoomFacebook = mediumZoom('.container img', {
	template: '#template-facebook',
	container: '[data-zoom-container]',
});

// You can start manipulating the DOM after the `opened` event has been triggered
zoomFacebook.on('opened', () => {
	const closeButton = document.querySelector('[data-zoom-close]');
	closeButton.addEventListener('click', () => zoomFacebook.close());
});

// Block scroll on zoom
zoomFacebook.on('open', () => {
	document.body.style.overflow = 'hidden';
});

zoomFacebook.on('close', () => {
	document.body.style.overflow = '';
});
