# BentoGrid.js

[![View documentation](https://img.shields.io/badge/%F0%9F%93%84-Documentation-%23333)](https://mariohamann.github.io/bentogrid.js/) [![View on npm](https://img.shields.io/npm/v/@bentogrid/core)](https://www.npmjs.com/package/@bentogrid/core)

A smart library that automatically positions elements depending on their size in a grid to create responsive and beautiful layouts.

* 🔧 Flexible: Easily set the size of elements via attributes
* 🧠 Smart: Automatic positioning of elements in the grid
* 🌐 Lightweight: Only 2KB (minified) with zero dependencies
* 📱 Responsive: Adaptive grid layouts for various screen sizes
* 🎨 Inspired by [Apple's marketing slides](https://apple-summary-slides.vercel.app/event-AppleEventSeptember2022) and [bento.me](https://bento.me)

> **Note** The following documentation is automatically generated from the source code and just includes the API. For installation, usage and examples check out these [hand-crafted docs](https://mariohamann.github.io/bentogrid.js/).

## Classes

[BentoGrid](#BentoGrid)

## Typedefs

[UserConfig](#UserConfig) : `Object`

[Breakpoint](#Breakpoint) : `Object`

## BentoGrid

**Kind**: global class

* [BentoGrid](#BentoGrid)  
   * [new BentoGrid(userConfig)](#new%5FBentoGrid%5Fnew)  
   * [.recalculate()](#BentoGrid+recalculate)  
   * [.emitCalculationDoneEvent()](#BentoGrid+emitCalculationDoneEvent)

### new BentoGrid(userConfig)

Create a new BentoGrid instance.

| Param      | Type                          | Description                      |
| ---------- | ----------------------------- | -------------------------------- |
| userConfig | [`UserConfig`](#UserConfig) | User configuration for the grid. |

### bentoGrid.recalculate()

Recalculate the grid layout. Useful for cases when elements are added, removed, or visibility changes.

**Kind**: instance method of [`BentoGrid`](#BentoGrid)  

### bentoGrid.emitCalculationDoneEvent()

Emits a "calculationDone" event when the grid calculation is completed.

**Kind**: instance method of [`BentoGrid`](#BentoGrid)  
**Emits**: `event:{CustomEvent} calculationDone - The event object contains a "detail" property with the gridContainer as a property.`  

## UserConfig : `Object`

**Kind**: global typedef  
**Properties**

| Name                    | Type                            | Default                                                                             | Description                                                                                             |
| ----------------------- | ------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| \[target\]              | `string` \| `HTMLElement`   | `'.bentogrid'`                                                                    | The target element to apply the grid to.                                                                |
| \[minCellWidth\]        | `number`                      | `100`                                                                             | The minimum width of each cell in the grid.                                                             |
| \[columns\]             | `number`                      | The number of columns to use for the grid. This overrides minCellWidth.             |                                                                                                         |
| \[cellGap\]             | `number`                      | `0`                                                                               | The space between each cell in the grid.                                                                |
| \[aspectRatio\]         | `number`                      | `1/1`                                                                             | The aspect ratio of each cell in the grid.                                                              |
| \[breakpoints\]         | `Object.<number, Breakpoint>` | Breakpoints to set responsive grid behavior. minWidth looks at breakpointReference. |                                                                                                         |
| \[breakpointReference\] | `string`                      | `'target'`                                                                        | Select if the breakpoints should reference to the target's or the window's width.                       |
| \[balanceFillers\]      | `boolean`                     | `false`                                                                           | Whether to balance the position of the fillers. If set, they change their position with other elements. |

## Breakpoint : `Object`

**Kind**: global typedef  
**Properties**

| Name             | Type       | Description                                                             |
| ---------------- | ---------- | ----------------------------------------------------------------------- |
| \[minCellWidth\] | `number` | The minimum width of each cell in the grid.                             |
| \[cellGap\]      | `number` | The space between each cell in the grid.                                |
| \[columns\]      | `number` | The number of columns to use for the grid. This overrides minCellWidth. |
| \[aspectRatio\]  | `number` | The aspect ratio of each cell in the grid.                              |