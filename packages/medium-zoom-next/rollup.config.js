import babel from '@rollup/plugin-babel';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import license from 'rollup-plugin-license';
import replace from '@rollup/plugin-replace';
import filesize from 'rollup-plugin-filesize';

import pkg from './package.json' with { type: 'json' };

const banner = `/*! ${pkg.name} ${pkg.version} | ${pkg.license} License | https://github.com/${pkg.repository} */`;

const sharedPlugins = [
	replace({
		preventAssignment: true,
		values: {
			__TEST__: process.env.NODE_ENV === 'test' ? 'true' : 'false',
		},
	}),
	typescript({
		tsconfig: './tsconfig.json',
		sourceMap: true,
		declaration: true,
	}),
	babel({
		babelHelpers: 'bundled',
		exclude: 'node_modules/**',
		plugins: ['@babel/plugin-transform-object-rest-spread'],
	}),
	filesize({
		showMinifiedSize: false,
		showGzippedSize: true,
	}),
];

const prettifyPlugin = terser({
	compress: false,
	mangle: false,
	format: {
		beautify: true,
		indent_level: 2,
		preamble: banner,
	},
});

export default [
	{
		input: 'src/index.ts',
		output: {
			file: pkg.module,
			format: 'es',
		},
		plugins: [...sharedPlugins, license({ banner })],
	},
	{
		input: 'src/index.ts',
		output: {
			name: 'mediumZoom',
			file: pkg.main.replace('.min', ''),
			format: 'umd',
		},
		plugins: [...sharedPlugins, prettifyPlugin],
	},
	{
		input: 'src/index.ts',
		output: {
			name: 'mediumZoom',
			file: pkg.main,
			format: 'umd',
		},
		plugins: [...sharedPlugins, terser(), license({ banner })],
	},
];
