import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import license from 'rollup-plugin-license';
import replace from 'rollup-plugin-replace';
import { uglify } from 'rollup-plugin-uglify';
import filesize from 'rollup-plugin-filesize';

import pkg from './package.json';

const banner = `/*! ${pkg.name} ${pkg.version} | ${pkg.license} License | https://github.com/${pkg.repository} */`;

const sharedPlugins = [
	replace({
		__TEST__: process.env.NODE_ENV === 'test' ? 'true' : 'false',
	}),
	babel({
		exclude: 'node_modules/**',
		plugins: ['external-helpers', 'transform-object-rest-spread'],
	}),
	filesize({
		showMinifiedSize: false,
		showGzippedSize: true,
	}),
];
const prettifyPlugin = uglify({
	compress: false,
	mangle: false,
	output: {
		beautify: true,
		indent_level: 2,
		preamble: banner,
	},
});

export default [
	{
		input: 'src/index.js',
		output: {
			file: pkg.module,
			format: 'es',
		},
		plugins: [...sharedPlugins, license({ banner })],
	},
	{
		input: 'src/index.js',
		output: {
			name: 'mediumZoom',
			file: pkg.main.replace('.min', ''),
			format: 'umd',
		},
		plugins: [...sharedPlugins, prettifyPlugin],
	},
	{
		input: 'src/index.js',
		output: {
			name: 'mediumZoom',
			file: pkg.main,
			format: 'umd',
		},
		plugins: [...sharedPlugins, terser(), license({ banner })],
	},
];
