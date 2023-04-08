# bentogrid.js

Create beautiful and responsive grid layouts with BentoGrid, a smart library that automatically positions elements for you. No more hassle with manual positioning!

-   🔧 Flexible: Easily set the size of elements via attributes (`data-bento="1x3"`)
-   🧠 Smart: Automatic positioning of elements in a grid
-   🌐 Lightweight: Only 2KB (minified) with zero dependencies
-   📱 Responsive: Adaptive grid layouts for various screen sizes
-   🎨 Inspired by Apple's marketing slides and bento.me

Example: https://mariohamann.github.io/bentogrid.js/

## Installation

Add bentogrid.js to your project and include it in your HTML:

```html
<script type="module">
	import BentoGrid from "./BentoGrid.js";
	const myBento = new BentoGrid({
		// Your configuration options here
	});
</script>
```

Alternatively you can use a CDN:

```html
<script type="module">
	import BentoGrid from "https://cdn.jsdelivr.net/npm/@bentogrid/core@1.6.0/src/BentoGrid.min.js";
	const myBento = new BentoGrid({
		// Your configuration options here
	});
</script>
```

Or install via npm:

```bash
pnpm install @bentogrid/core
```

```js
import BentoGrid from "@bentogrid/core";
const myBento = new BentoGrid({
	// Your configuration options here
});
```

## Bento elements and fillers

BentoGrid recognizes elements as either grid items (bento elements) or fillers. Bento elements are grid items with the data-bento attribute, while fillers are grid items without the `data-bento` attribute.

-   To define a bento element, add the data-bento attribute to an element with a value in the format of `Columns x Rows`. For example, an element that spans 2 columns and 3 rows should have the attribute `data-bento="2x3"`.
    -   Hidden elements are automatically ignored
    -   When setting `balanceFillers` to `true`, you can ignore elements from being swapped by setting the attribute `data-bento-fixed`. This makes espacially sense, if you don't want to swap e. g. the first element.
-   Fillers are used to fill empty spaces in the grid.
    -   BentoGrid will automatically add fillers to the grid when necessary, cloning existing fillers if available, or creating new `div` elements if no fillers are present.
    -   Visible fillers automatically get the class `bento-filler`.

## Configuration options

You can customize the behavior of your BentoGrid using the following configuration options:

-   `target` (`String` or `HTMLElement`): The target element can either be a CSS selector string or a DOM element. BentoGrid will look for items with the `data-bento` attribute inside the target container and treat them as bento grid items. Other items will be treated as fillers. Default: `'.bentogrid'`
-   `cellWidth` (`Object`): The minimum and maximum width of a cell in the grid. Default: `100`.
-   `columns` (`Number`): The number of columns in the grid. This overrides `cellWidth`, if both are defined. Default: `undefined`.
-   `cellGap` (`Number`): The spacing between items in the grid. Default: `0`.
-   `breakpoints` (`Object`): An object with breakpoint objects, which can be used to customize the grid's behavior at different screen widths. Each breakpoint object has the `minWidth` as key and can have `cellWidth`, `columns` and `cellGap` as properties. Default: `{}`
-   `breakpointReference` (`'target' | 'window'`): Select if the breakpoints should reference to the target's or the window's width. Default: `'target'`
-   `aspectRatio` (`Number`): The aspect ratio for a cell in the grid (width / height). Currently this is only a very rough estimation and changes, when column width grows. In future there might be an additional strict mode. Default: `1 / 1`.
-   `balanceFillers` (`Boolean`): If true, the script will attempt to evenly distribute fillers throughout the grid. This should only be used, if you have styled the fillers. This might change the order of the items a lot and therefore should be used with caution, if order is important. You can ignore elements from being swapped by setting the attribute `data-bento-fixed`. Default: `false`.

## Events

BentoGrid emits a custom event named "`calculationDone`" when the grid layout calculation is completed. You can listen to this event to perform additional actions:

```js
const gridContainer = document.querySelector(".bentogrid");

gridContainer.addEventListener("calculationDone", (event) => {
	console.log("Calculation done for", event.detail.gridContainer);
});
```

## Methods

BentoGrid currently only exposes one method: `recalculate()`. This method can be used to recalculate the grid layout. This is useful, if you dynamically add or remove elements from the grid.

```js
const gridContainer = document.querySelector(".bentogrid");
const myBento = new BentoGrid({
	target: gridContainer,
});

// Add a new element to the grid
const newElement = document.createElement("div");
newElement.setAttribute("data-bento", "1x1");
gridContainer.appendChild(newElement);

// Recalculate the grid layout
myBento.recalculate();
```

## Example Configuration

Check the `src` folder for a complete example.

```js
const myBento = new BentoGrid({
	columns: 2,
	cellGap: 16,
	breakpoints: {
		400: {
			minCellWidth: 188,
			cellGap: 24,
		},
	},
	aspectRatio: 1 / 1,
	balanceFillers: true,
});
```

## Disclaimer

This script was concepted by a human and mostly written by ChatGPT (in lots of iterations and optimizations).
