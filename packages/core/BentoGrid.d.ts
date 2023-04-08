declare module '@bentogrid/core' {

  export interface BentoGridConfig {
    /**
     * The target element to apply the grid to.
     * Default: `".bentogrid"`
     */
    target?: string | HTMLElement;
    /**
     * The number of columns to use for the grid. This overrides cellWidth.
     * Default: `undefined`
     */
    columns?: number;
    /**
     * The minimum and maximum width of each cell in the grid.
     * Default: `{ min: 100, max: 150 }`
     */
    minCellWidth?: number;
    /**
     * The space between each cell in the grid.
     * Default: `0`
     */
    cellGap?: number;
    /**
     * The aspect ratio of each cell in the grid.
     * Default: `1/1`
     */
    aspectRatio?: number;
    /**
     * Breakpoints to set responsive grid behavior. midWidth looks at breakpointReference (Default: 'target').
     */
    breakpoints?: {
      [minWidth: number]: {
        /**
         * The minimum width of each cell in the grid.
         */
        minCellWidth?: number;
        /**
         * The space between each cell in the grid.
         */
        cellGap?: number;
        /**
         * The number of columns to use for the grid.
         */
        columns?: number;
      };
    };
    /**
     * Select if the breakpoints should reference to the target's or the window's width.
     * Default: `'target'`
     */
    breakpointReference?: 'target' | 'window';
    /**
     * Whether to balance the position of the fillers. If set, they change their position with other elements.
     * Default: `'false'`
     */
    balanceFillers?: boolean;

    /**
     * Recalculate the grid layout.
     * Useful for cases when elements are added, removed, or visibility changes.
     */
    recalculate?: void;
  }

  export default class BentoGrid {
    constructor(config: BentoGridConfig);

    /**
     * Recalculate the grid layout.
     * Useful for cases when elements are added, removed, or visibility changes.
     */
    recalculate(): void;
  }
}
