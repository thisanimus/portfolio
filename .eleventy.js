const fs = require('fs');
const Image = require('@11ty/eleventy-img');
const path = require('path');

module.exports = function (eleventyConfig) {
	eleventyConfig.addShortcode('image', imageShortcode);
	eleventyConfig.addShortcode('svg', svgShortcode);
	eleventyConfig.addPassthroughCopy('./assets');
	eleventyConfig.addPassthroughCopy('./robots.txt');

	eleventyConfig.addPassthroughCopy('./assets');
	eleventyConfig.addPassthroughCopy('./robots.txt');

	eleventyConfig.setServerPassthroughCopyBehavior('passthrough');

	// RSS Date Format
	eleventyConfig.addLiquidFilter('rfc822Date', (dateValue) => {
		return rfc822Date(dateValue);
	});

	return {
		dir: {
			layouts: '_layouts',
		},
		htmlTemplateEngine: 'liquid',
		markdownTemplateEngine: 'liquid',
	};
};
async function imageShortcode(src, alt, classString) {
	//console.log({ src, alt, classString });
	let defaultFormat = src.endsWith('.png') ? 'png' : 'jpeg';
	let sizes = '(min-width: 1024px) 100vw, 50vw';
	let srcPrefix = `./assets/img/`;
	src = srcPrefix + src;

	let imageAttributes = {
		alt,
		sizes,
		class: classString,
		loading: 'lazy',
		decoding: 'async',
	};

	let metadata = await Image(src, {
		svgShortCircuit: true,
		widths: [600, 900, 1500],
		formats: ['webp', defaultFormat],
		urlPath: '/assets/img',
		outputDir: './_site/assets/img',

		filenameFormat: (id, src, width, format, options) => {
			const extension = path.extname(src);
			const name = path.basename(src, extension);
			return `${name}-${width}w.${format}`;
		},
	});
	return Image.generateHTML(metadata, imageAttributes);
}

async function svgShortcode(file) {
	const svgString = fs.readFileSync('./assets/icons/' + file);
	const currentColor = svgString
		.toString()
		.replace(/#000000/g, 'currentColor')
		.replace(/#000/g, 'currentColor');
	return currentColor;
}
