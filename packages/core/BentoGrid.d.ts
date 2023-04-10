export default BentoGrid;
export type UserConfig = {
    /**
     * - The target element to apply the grid to.
     */
    target?: string | HTMLElement;
    /**
     * - The minimum width of each cell in the grid.
     */
    minCellWidth?: number;
    /**
     * - The number of columns to use for the grid. This overrides minCellWidth.
     */
    columns?: number;
    /**
     * - The space between each cell in the grid.
     */
    cellGap?: number;
    /**
     * - The aspect ratio of each cell in the grid.
     */
    aspectRatio?: number;
    /**
     * - Breakpoints to set responsive grid behavior. minWidth looks at breakpointReference.
     */
    breakpoints?: {
        [x: number]: Breakpoint;
    };
    /**
     * - Select if the breakpoints should reference to the target's or the window's width.
     */
    breakpointReference?: string;
    /**
     * - Whether to balance the position of the fillers. If set, they change their position with other elements.
     */
    balanceFillers?: boolean;
};
export type Breakpoint = {
    /**
     * - The minimum width of each cell in the grid.
     */
    minCellWidth?: number;
    /**
     * - The space between each cell in the grid.
     */
    cellGap?: number;
    /**
     * - The number of columns to use for the grid. This overrides minCellWidth.
     */
    columns?: number;
    /**
     * - The aspect ratio of each cell in the grid.
     */
    aspectRatio?: number;
};
/**
 * @typedef {Object} UserConfig
 * @property {string | HTMLElement} [target='.bentogrid'] - The target element to apply the grid to.
 * @property {number} [minCellWidth=100] - The minimum width of each cell in the grid.
 * @property {number} [columns] - The number of columns to use for the grid. This overrides minCellWidth.
 * @property {number} [cellGap=0] - The space between each cell in the grid.
 * @property {number} [aspectRatio=1/1] - The aspect ratio of each cell in the grid.
 * @property {Object.<number, Breakpoint>} [breakpoints] - Breakpoints to set responsive grid behavior. minWidth looks at breakpointReference.
 * @property {string} [breakpointReference='target'] - Select if the breakpoints should reference to the target's or the window's width.
 * @property {boolean} [balanceFillers=false] - Whether to balance the position of the fillers. If set, they change their position with other elements.
 */
/**
 * @typedef {Object} Breakpoint
 * @property {number} [minCellWidth] - The minimum width of each cell in the grid.
 * @property {number} [cellGap] - The space between each cell in the grid.
 * @property {number} [columns] - The number of columns to use for the grid. This overrides minCellWidth.
 * @property {number} [aspectRatio] - The aspect ratio of each cell in the grid.
 */
declare class BentoGrid {
    /**
     * Create a new BentoGrid instance.
     * @param {UserConfig} userConfig - User configuration for the grid.
     */
    constructor(userConfig: UserConfig);
    config: {
        /**
         * - The target element to apply the grid to.
         */
        target: string | HTMLElement;
        /**
         * - The minimum width of each cell in the grid.
         */
        minCellWidth: number;
        /**
         * - The number of columns to use for the grid. This overrides minCellWidth.
         */
        columns?: number;
        /**
         * - The space between each cell in the grid.
         */
        cellGap: number;
        /**
         * - The aspect ratio of each cell in the grid.
         */
        aspectRatio: number;
        /**
         * - Breakpoints to set responsive grid behavior. minWidth looks at breakpointReference.
         */
        breakpoints: {
            [x: number]: Breakpoint;
        };
        /**
         * - Select if the breakpoints should reference to the target's or the window's width.
         */
        breakpointReference: string;
        /**
         * - Whether to balance the position of the fillers. If set, they change their position with other elements.
         */
        balanceFillers: boolean;
    };
    gridContainer: Element;
    gridItems: any;
    fillers: any;
    prevTotalColumns: any;
    prevColumnCount: any;
    setElements(): void;
    getBreakpoint(): {
        /**
         * - The target element to apply the grid to.
         */
        target: string | HTMLElement;
        /**
         * - The minimum width of each cell in the grid.
         */
        minCellWidth: number;
        /**
         * - The number of columns to use for the grid. This overrides minCellWidth.
         */
        columns?: number;
        /**
         * - The space between each cell in the grid.
         */
        cellGap: number;
        /**
         * - The aspect ratio of each cell in the grid.
         */
        aspectRatio: number;
        /**
         * - Breakpoints to set responsive grid behavior. minWidth looks at breakpointReference.
         */
        breakpoints: {
            [x: number]: Breakpoint;
        };
        /**
         * - Select if the breakpoints should reference to the target's or the window's width.
         */
        breakpointReference: string;
        /**
         * - Whether to balance the position of the fillers. If set, they change their position with other elements.
         */
        balanceFillers: boolean;
    };
    setupGrid(): number;
    hideOriginalFillers(): void;
    removeClonedFillers(): void;
    updateGrid(): void;
    handleResponsiveBehavior(): void;
    resizeObserver: ResizeObserver | {
        observe: () => void;
        unobserve: () => void;
    };
    /**
     * Recalculate the grid layout.
     * Useful for cases when elements are added, removed, or visibility changes.
     */
    recalculate(): void;
    /**
     * Emits a "calculationDone" event when the grid calculation is completed.
     * @method
     * @emits {CustomEvent} calculationDone - The event object contains a "detail" property with the gridContainer as a property.
     */
    emitCalculationDoneEvent(): void;
}
