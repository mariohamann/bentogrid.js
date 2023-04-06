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
     */
    target?: string | HTMLElement;
    /**
     * The number of columns to use for the grid.
     */
    columns?: number;
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
     * The aspect ratio of each cell in the grid.
     */
    aspectRatio?: number;
    /**
     * Breakpoints to set responsive grid behavior.
     */
    breakpoints?: BentoGridBreakpoint[];
    /**
     * Whether to balance the position of the placeholders. If set, they change their position with other elements.
     */
    balancePlaceholders?: boolean;
  }

  export default class BentoGrid {
    constructor(config: BentoGridConfig);
  }
}
