# bento-grid.js

BentoGrid is a lightweight, responsive, and flexible grid library inspired by Apple's marketing slides and [bento.me](https://www.bento.me/). It allows you to create beautiful and responsive grid layouts with ease. BentoGrid has zero dependencies and weighs about 2KB (minified).

Minimal example: https://mariohamann.github.io/bento-grid.js/

## Installation

Add the bento-grid.js file to your project and include it in your HTML file:

```html
<script src="path/to/bento-grid.js"></script>
```

Or install via npm

```bash
pnpm install bento-grid
```

## Usage

Create a new BentoGrid instance and pass in a configuration object:

```js
const myBento = new BentoGrid({
	// Your configuration options here
});
```

## Configuration options

You can customize the behavior of your BentoGrid using the following configuration options:

-   `target` (`String` or `HTMLElement`)
-   `cellWidth` (`Object`): The minimum and maximum width of a cell in the grid. Default: `{ min: 100, max: 150 }`.
-   `itemSpacing` (`Number`): The spacing between items in the grid. Default: `10`.
-   `breakpoints` (`Array`): An array of breakpoint objects, which can be used to customize the grid's behavior at different screen widths. Each breakpoint object should have a minWidth property and can override any of the main configuration options.
-   `aspectRatio` (`Number`): The aspect ratio for a cell in the grid (width / height). Default: `1 / 1`.
-   `balancePlaceholders` (`Boolean`): If true, the library will attempt to evenly distribute placeholders throughout the grid. Default: `true`.

## Bento elements and placeholders

BentoGrid recognizes elements as either grid items (bento elements) or placeholders. Bento elements are grid items with the data-bento attribute, while placeholders are grid items without the data-bento attribute.

To define a bento element, add the data-bento attribute to an element with a value in the format of Columns x Rows. For example, an element that spans 2 columns and 3 rows should have the attribute data-bento="2x3".

Placeholders are used to fill empty spaces in the grid. BentoGrid will automatically add placeholders to the grid when necessary, cloning existing placeholders if available, or creating new div elements if no placeholders are present.

## Events

BentoGrid emits a custom event named "calculationDone" when the grid layout calculation is completed. You can listen to this event to perform additional actions:

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
