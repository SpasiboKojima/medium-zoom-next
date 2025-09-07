import type { StoryObj } from '@storybook/html-vite';
import type mediumZoom from '../../src/medium-zoom';

declare global {
	interface Window {
		mediumZoom: typeof mediumZoom;
	}
}

export default {
	title: 'attributes',
	tags: ['autodocs'],
};

export const DataZoomSrc: StoryObj = () => `
  <img
    src="image-1.thumbnail.jpg"
    data-zoom-src="image-1.jpg"
  >
`;
DataZoomSrc.play = async () => {
	window.mediumZoom('img');
};
DataZoomSrc.storyName = 'data-zoom-src';
DataZoomSrc.parameters = {
	docs: {
		description: {
			story: 'Zoom on an image having a `data-zoom-src` attribute.',
		},
		codePanel: true,
		source: {
			transform: (source) => source.concat(`\n  <script>\n    window.mediumZoom('img');\n  </script>`),
		},
	},
};

export const Srcset: StoryObj = () => `
  <img
    srcset="
      image-1x300.jpg 300w,
      image-1x600.jpg 600w,
      image-1x800.jpg 800w,
      image-1x1000.jpg 1000w,
      image-1x1200.jpg 1200w
    "
  >
`;
Srcset.play = async () => {
	window.mediumZoom('img');
};
Srcset.storyName = 'srcset';
Srcset.parameters = {
	docs: {
		description: {
			story: 'Zoom on an image having `srcset` attributes.',
		},
		codePanel: true,
		source: {
			transform: (source) => source.concat(`\n  <script>\n    window.mediumZoom('img');\n  </script>`),
		},
	},
};

export const SrcsetAndDataZoomSrc: StoryObj = () => `
  <img
    src="image-1x300.jpg"
    srcset="
      image-1x300.jpg 300w,
      image-1x600.jpg 600w,
    "
    sizes="(max-width: 400px) 100vw, 400px"
    data-zoom-src="image-1.jpg"
  >
`;
SrcsetAndDataZoomSrc.play = async () => {
	window.mediumZoom('img');
};
SrcsetAndDataZoomSrc.storyName = 'srcset and data-zoom-src';
SrcsetAndDataZoomSrc.parameters = {
	docs: {
		description: {
			story: 'Zoom with srcset and data-zoom-src defined (zoom-target wins).',
		},
		codePanel: true,
		source: {
			transform: (source) => source.concat(`\n  <script>\n    window.mediumZoom('img');\n  </script>`),
		},
	},
};

export const Svg: StoryObj = () => `
  <img src="crab.svg">
`;
Svg.play = async () => {
	window.mediumZoom('img');
};
Svg.storyName = 'SVG';
Svg.parameters = {
	docs: {
		description: {
			story: `
        Zoom on a SVG.
        The image fills the entire container.`,
		},
		codePanel: true,
		source: {
			transform: (source) => source.concat(`\n  <script>\n    window.mediumZoom('img');\n  </script>`),
		},
	},
};

export const PictureTag: StoryObj = () => `
  <picture>
    <source type="image/jpeg" srcset="image-1x300.jpg 300w, image-1x600.jpg 600w"></source>
    <img>
  </picture>
`;
PictureTag.play = async () => {
	window.mediumZoom('img');
};
PictureTag.storyName = '<picture> tag';
PictureTag.parameters = {
	docs: {
		description: {
			story: `
        Zoom on an image inside a <picture> tag.
        The cloned image mirrors the picture structure and resizes the same as a usual image tag.
      `,
		},
		codePanel: true,
		source: {
			transform: (source) => source.concat(`\n  <script>\n    window.mediumZoom('img');\n  </script>`),
		},
	},
};

export const PictureTagAndDataZoomSrc: StoryObj = () => `
  <picture>
    <source type="image/jpeg" srcset="image-1x300.jpg 300w, image-1x600.jpg 600w"></source>
    <img data-zoom-src="image-1.jpg">
  </picture>
`;
PictureTagAndDataZoomSrc.play = async () => {
	window.mediumZoom('img');
};
PictureTagAndDataZoomSrc.storyName = '<picture> tag and data-zoom-src';
PictureTagAndDataZoomSrc.parameters = {
	docs: {
		description: {
			story: `
        Zoom on an image inside a <picture> tag.
        The cloned image mirrors the picture structure and resizes the same as a usual image tag, which then uses the data-zoom-src value once loaded.
      `,
		},
		codePanel: true,
		source: {
			transform: (source) => source.concat(`\n  <script>\n    window.mediumZoom('img');\n  </script>`),
		},
	},
};
