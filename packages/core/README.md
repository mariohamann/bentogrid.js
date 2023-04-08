# BentoGrid.js

Create beautiful and responsive grid layouts with BentoGrid.js, a smart library that automatically positions elements depending on their size in a grid for you.

-   🔧 Flexible: Easily set the size of elements via attributes (`data-bento="1x3"`)
-   🧠 Smart: Automatic positioning of elements in the grid
-   🌐 Lightweight: Only 2KB (minified) with zero dependencies
-   📱 Responsive: Adaptive grid layouts for various screen sizes
-   🎨 Inspired by [Apple's marketing slides](https://apple-summary-slides.vercel.app/event-AppleEventSeptember2022) and [bento.me](https://bento.me)

Example: https://mariohamann.github.io/bentogrid.js/

## Installation

Add bentogrid.js directly in HTML:

```html
<script type="module">
	import BentoGrid from "https://cdn.jsdelivr.net/npm/@bentogrid/core@1.0.0/BentoGrid.min.js";
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

BentoGrid.js recognizes elements as either Bento element or Bento filler. Bento elements are grid items with the data-bento attribute, while Bento fillers are grid items without the `data-bento` attribute.

-   To define a Bento element, add the `data-bento` attribute to an element with a value in the format of `Columns x Rows`. For example, an element that spans 2 columns and 3 rows should have the attribute `data-bento="2x3"`.
    -   Hidden elements are automatically ignored.
    -   When setting `balanceFillers` to `true`, you can ignore selected elements from being swapped by setting the attribute `data-bento-no-swap`. This makes espacially sense, if you don't want to swap e. g. the first element.
-   Fillers are used to fill empty spaces in the grid.
    -   BentoGrid.js will automatically add fillers to the grid when necessary, cloning existing fillers in a loop if available, or creating new `div` elements if no fillers are present.
    -   Bento fillers automatically get the class `bento-filler`. BentoGrid.js tries to make them as big as possible.

Your HTML could look like this:

```html
<style>
	*[data-bento] {
		background-color: #ccc;
	}
	.bento-filler {
		background-color: red;
	}
</style>

<div class="bentogrid">
	<!-- Bento elements / The first element won't be swapped -->
	<div data-bento="1x1" data-bento-no-swap></div>
	<div data-bento="2x2"></div>
	<div data-bento="2x1"></div>
	<!-- Fillers // They will get the class "bento-filler" when added -->
	<div></div>
	<div></div>
</div>
```

## Configuration options

You can customize the behavior of your BentoGrid using the following configuration options:

-   `target` (`String` or `HTMLElement`): The target element can either be a CSS selector string or a DOM element. BentoGrid.js will look for items with the `data-bento` attribute inside the target container and treat them as bento grid items. Other items will be treated as fillers. Default: `'.bentogrid'`
-   `cellWidth` (`Object`): The minimum and maximum width of a cell in the grid. Default: `100`.
-   `columns` (`Number`): The number of columns in the grid. This overrides `cellWidth`, if both are defined. Default: `undefined`.
-   `cellGap` (`Number`): The spacing between items in the grid. Default: `0`.
-   `breakpoints` (`Object`): An object with breakpoint objects, which can be used to customize the grid's behavior at different screen widths. Each breakpoint object has the `minWidth` as key and can have `cellWidth`, `columns` and `cellGap` as properties. Default: `{}`
-   `breakpointReference` (`'target' | 'window'`): Select if the breakpoints should reference to the target's or the window's width. Default: `'target'`
-   `aspectRatio` (`Number`): The aspect ratio for a cell in the grid (width / height). Currently this is only a very rough estimation and changes, when column width grows. In future there might be an additional strict mode. Default: `1 / 1`.
-   `balanceFillers` (`Boolean`): If true, the script will attempt to evenly distribute fillers throughout the grid. This should only be used, if you have styled the fillers. This might change the order of the items a lot and therefore should be used with caution, if order is important. You can ignore elements from being swapped by setting the attribute `data-bento-no-swap`. Default: `false`.

Your configuration options can be passed to the BentoGrid constructor and could look like this:

```js
const myBento = new BentoGrid({
	target: ".bentogrid",
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

## Events

BentoGrid.js emits a custom event named "`calculationDone`" when the grid layout calculation is completed. You can listen to this event to perform additional actions:

```js
const gridContainer = document.querySelector(".bentogrid");

gridContainer.addEventListener("calculationDone", (event) => {
	console.log("Calculation done for", event.detail.gridContainer);
});
```

## Methods

BentoGrid.js currently only exposes one method: `recalculate()`. This method can be used to recalculate the grid layout. This is useful, if you dynamically add or remove elements from the grid.

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

## Disclaimer

BentoGrid.js was concepted by a human and written together with ChatGPT. It is not affiliated with Apple in any way. Usage at your own risk.
