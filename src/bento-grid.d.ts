declare module 'bento-grid' {
  export interface BentoGridBreakpoint {
    /**
     * The minimum width of the target to apply the breakpoint.
     */
    minWidth: number;
    /**
     * The minimum and maximum width of each cell in the grid.
     */
    cellWidth?: {
      min: number;
      max: number;
    };
    /**
     * The space between each cell in the grid.
     */
    cellGap?: number;
    /**
     * The number of columns to use for the grid.
     */
    columns?: number;
  }

  export interface BentoGridConfig {
    /**
     * The target element to apply the grid to.
     * Default: `".bento-grid"`
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
    cellWidth?: {
      min: number;
      max: number;
    };
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
     * Breakpoints to set responsive grid behavior.
     */
    breakpoints?: BentoGridBreakpoint[];
    /**
     * Select if the breakpoints should reference to the target's or the window's width.
     * Default: `'target'`
     */
    breakpointReference?: 'target' | 'window';
    /**
     * Whether to balance the position of the placeholders. If set, they change their position with other elements.
     * Default: `'false'`
     */
    balancePlaceholders?: boolean;
  }

  export default class BentoGrid {
    constructor(config: BentoGridConfig);
  }
}
