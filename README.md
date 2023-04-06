# bento-grid.js

BentoGrid is a lightweight, responsive, and flexible grid library inspired by Apple's marketing slides and [bento.me](https://www.bento.me/). It allows you to create beautiful and responsive grid layouts with ease. BentoGrid has zero dependencies and weighs about 2KB (minified).

Minimal example: https://mariohamann.github.io/bento-grid.js/

## Installation

Add the bento-grid.js to your project and include it in your HTML:

```html
<script type="module">
	import BentoGrid from "./bento-grid.js";
	const myBento = new BentoGrid({
		// Your configuration options here
	});
</script>
```

Alternatively you can use a CDN:

```html
<script type="module">
	import BentoGrid from "https://cdn.jsdelivr.net/npm/bento-grid@1.2.0/src/bento-grid.min.js";
	const myBento = new BentoGrid({
		// Your configuration options here
	});
</script>
```

Or install via npm:

```bash
pnpm install bento-grid
```

```js
import BentoGrid from "bento-grid";
const myBento = new BentoGrid({
	// Your configuration options here
});
```

## Configuration options

You can customize the behavior of your BentoGrid using the following configuration options:

-   `target` (`String` or `HTMLElement`): The target element can either be a CSS selector string or a DOM element. BentoGrid will look for items with the `data-bento` attribute inside the target container and treat them as bento grid items. Other items will be treated as placeholders. Default: `'.bento-grid'`
-   `cellWidth` (`Object`): The minimum and maximum width of a cell in the grid. Default: `{ min: 100, max: 150 }`.
-   `columns` (`Number`): The number of columns in the grid. If you set this option, the script will ignore the `cellWidth` option. Default: `null`.
-   `itemSpacing` (`Number`): The spacing between items in the grid. Default: `10`.
-   `breakpoints` (`Array`): An array of breakpoint objects, which can be used to customize the grid's behavior at different screen widths. Each breakpoint object should have a `minWidth` property and can override `cellWidth` and `itemSpacing`. Default: `[]`
-   `aspectRatio` (`Number`): The aspect ratio for a cell in the grid (width / height). If you set `itemSpacing`, the aspect ratio may can't always be set 100%. Default: `1 / 1`.
-   `balancePlaceholders` (`Boolean`): If true, the script will attempt to evenly distribute placeholders throughout the grid. This should only be used, if you have styled the placeholders. This might change the order of the items a lot and therefore should be used with caution, if order is important. Default: `false`.

## Bento elements and placeholders

BentoGrid recognizes elements as either grid items (bento elements) or placeholders. Bento elements are grid items with the data-bento attribute, while placeholders are grid items without the data-bento attribute.

To define a bento element, add the data-bento attribute to an element with a value in the format of `Columns x Rows`. For example, an element that spans 2 columns and 3 rows should have the attribute `data-bento="2x3"`.

Placeholders are used to fill empty spaces in the grid. BentoGrid will automatically add placeholders to the grid when necessary, cloning existing placeholders if available, or creating new div elements if no placeholders are present.

## Events

BentoGrid emits a custom event named "`calculationDone`" when the grid layout calculation is completed. You can listen to this event to perform additional actions:

```js
const gridContainer = document.querySelector(".bento-grid");

gridContainer.addEventListener("calculationDone", (event) => {
	console.log("Calculation done for", event.detail.gridContainer);
});
```

## Example Configuration

Check the `src` folder for a complete example.

```js
const myBento = new BentoGrid({
	cellWidth: {
		min: 100,
		max: 150,
	},
	itemSpacing: 10,
	breakpoints: [
		{
			minWidth: 480,
			cellWidth: {
				min: 150,
				max: 200,
			},
			itemSpacing: 5,
		},
		{
			minWidth: 768,
			cellWidth: {
				min: 200,
				max: 250,
			},
			itemSpacing: 10,
		},
	],
	aspectRatio: 1 / 1,
	balancePlaceholders: true,
});

const gridContainer = document.querySelector(".bento-grid");

gridContainer.addEventListener("calculationDone", (event) => {
	console.log("Calculation done for", event.detail.gridContainer);
});
```

## Disclaimer

This script was concepted by a human and mostly written by ChatGPT (in lots of iterations and optimizations).
