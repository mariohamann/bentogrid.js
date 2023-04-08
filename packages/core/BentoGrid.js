class BentoGrid {
  constructor(userConfig) {
    this.config = {
      ...{
        target: ".bentogrid",
        columns: undefined,
        minCellWidth: 100,
        cellGap: 0,
        aspectRatio: 1 / 1,
        breakpoints: [],
        balanceFillers: false,
        breakpointReference: 'target'
      },
      ...userConfig
    };

    // Check if config.target is a string or an HTMLElement
    this.gridContainer =
      typeof this.config.target === "string"
        ? document.querySelector(this.config.target)
        : this.config.target;

    this.gridItems = undefined;
    this.fillers = undefined;
    this.setElements();

    this.prevTotalColumns = null;
    this.prevColumnCount = null;

    this.hideOriginalFillers();
    this.setupGrid();
    this.updateGrid();

    this.handleResponsiveBehavior();
  }

  setElements() {
    // Grid items with the 'data-bento' attribute
    this.gridItems = Array
      .from(this.gridContainer.querySelectorAll(":scope > *"))
      .filter(item => item.hasAttribute("data-bento"))
      // items that are visible
      .filter(item => item.offsetParent !== null);

    // Fillers that do not have the 'data-bento' attribute and are not set by the script
    this.fillers = Array
      .from(this.gridContainer.querySelectorAll(":scope > *"))
      .filter((item) => !item.hasAttribute("data-bento"))
      .filter(filler => !filler.style.gridColumn);
  }

  getBreakpoint() {
    const width = this.config.breakpointReference === "target"
      ? this.gridContainer.clientWidth
      : window.innerWidth;

    let activeBreakpoint = { ...this.config };

    const breakpointKeys = Object.keys(this.config.breakpoints).map(Number).sort((a, b) => a - b);

    for (const breakpointKey of breakpointKeys) {
      if (width >= breakpointKey) {
        activeBreakpoint = { ...activeBreakpoint, ...this.config.breakpoints[breakpointKey] };
      }
    }

    // Look up for the last defined columns or minCellWidth values from fitting breakpoints
    for (let i = breakpointKeys.length - 1; i >= 0; i--) {
      const breakpointKey = breakpointKeys[i];
      const breakpoint = this.config.breakpoints[breakpointKey];
      if (width >= breakpointKey) {
        if (breakpoint.columns) {
          activeBreakpoint.columns = breakpoint.columns;
          activeBreakpoint.minCellWidth = undefined;
          break;
        } else if (breakpoint.minCellWidth) {
          activeBreakpoint.minCellWidth = breakpoint.minCellWidth;
          activeBreakpoint.columns = undefined;
          break;
        }
      }
    }

    return activeBreakpoint;
  }

  setupGrid() {
    const breakpoint = this.getBreakpoint();
    const totalColumns =
      breakpoint.columns ||
      Math.floor(
        (this.gridContainer.clientWidth + breakpoint.cellGap) /
        (breakpoint.minCellWidth + breakpoint.cellGap)
      );
    this.gridContainer.style.display = "grid";
    this.gridContainer.style.gridTemplateColumns = `repeat(${totalColumns}, minmax(${breakpoint.minCellWidth}px, 1fr))`;
    this.gridContainer.style.gridGap = `${breakpoint.cellGap}px`;
    return totalColumns;
  }

  hideOriginalFillers() {
    this.fillers.forEach((filler) => {
      filler.style.display = "none";
    });
  }

  removeClonedFillers() {
    // Fillers that are visible
    Array.from(
      this.gridContainer.querySelectorAll(":scope > *")
    ).filter((item) => !item.hasAttribute("data-bento"))
      .filter(filler => !!filler.style.gridColumn)
      .forEach((filler) => {
        filler.remove();
      });
  }

  updateGrid() {
    const totalColumns = this.setupGrid();

    if (this.prevTotalColumns !== totalColumns) {
      this.removeClonedFillers();
    }

    const gridMatrix = [];
    let maxRow = 0;

    // Initialize the grid matrix
    for (let i = 0; i < totalColumns; i++) {
      gridMatrix[i] = [];
    }

    function getNextAvailablePosition(gridColumnSpan, gridRowSpan) {
      let foundPosition = false;
      let column = 0;
      let row = 0;

      while (!foundPosition) {
        if (isPositionAvailable(column, row, gridColumnSpan, gridRowSpan)) {
          foundPosition = true;
        } else {
          column++;
          if (column + gridColumnSpan > totalColumns) {
            column = 0;
            row++;
          }
        }
      }

      return { column, row };
    }

    function isPositionAvailable(column, row, gridColumnSpan, gridRowSpan) {
      for (let c = column; c < column + gridColumnSpan; c++) {
        for (let r = row; r < row + gridRowSpan; r++) {
          if (gridMatrix[c] && gridMatrix[c][r]) {
            return false;
          }
        }
      }
      return true;
    }

    function occupyPosition(column, row, gridColumnSpan, gridRowSpan) {
      for (let c = column; c < column + gridColumnSpan; c++) {
        for (let r = row; r < row + gridRowSpan; r++) {
          if (!gridMatrix[c]) {
            gridMatrix[c] = [];
          }
          gridMatrix[c][r] = true;
        }
      }
    }

    this.gridItems.forEach((item) => {
      const bento = item.getAttribute("data-bento").split("x");
      const gridColumnSpan = parseInt(bento[0]);
      const gridRowSpan = parseInt(bento[1]);

      const position = getNextAvailablePosition(gridColumnSpan, gridRowSpan);
      item.style.gridColumn = `${position.column + 1} / span ${gridColumnSpan}`;
      item.style.gridRow = `${position.row + 1} / span ${gridRowSpan}`;

      occupyPosition(
        position.column,
        position.row,
        gridColumnSpan,
        gridRowSpan
      );

      // Update maxRow
      maxRow = Math.max(maxRow, position.row + gridRowSpan);
    });


    const breakpoint = this.getBreakpoint();

    this.gridContainer.style.gridTemplateRows = `repeat(${maxRow}, minmax(${breakpoint.minCellWidth}px, 1fr))`;

    // Find the maximum row
    this.gridItems.forEach((item) => {
      const gridRowStart = parseInt(item.style.gridRow.split(" / ")[0]);
      const gridRowSpan = parseInt(
        item.style.gridRow.split(" / ")[1].split(" ")[1]
      );
      maxRow = Math.max(maxRow, gridRowStart + gridRowSpan - 1);
    });
    const addFillers = () => {
      let fillerIndex = 0;
      let lastFillerPositions = [];

      for (let row = 0; row < maxRow; row++) {
        for (let column = 0; column < totalColumns; column++) {
          if (!gridMatrix[column][row]) {
            let gridColumnSpan = 1;
            let gridRowSpan = 1;

            // Find the maximum gridColumnSpan
            while (
              column + gridColumnSpan < totalColumns &&
              !gridMatrix[column + gridColumnSpan][row]
            ) {
              gridColumnSpan++;
            }

            // Find the maximum gridRowSpan
            for (let r = row + 1; r < maxRow; r++) {
              let rowSpanValid = true;
              for (let c = column; c < column + gridColumnSpan; c++) {
                if (gridMatrix[c][r]) {
                  rowSpanValid = false;
                  break;
                }
              }
              if (!rowSpanValid) {
                break;
              }
              gridRowSpan++;
            }

            let filler;
            if (this.fillers.length > 0) {
              // Clone the filler
              filler = this.fillers[fillerIndex].cloneNode(true);
              // Update the filler index for the next iteration
              fillerIndex = (fillerIndex + 1) % this.fillers.length;
              filler.style.display = "block";
            } else {
              // Create a new div if no fillers are available
              filler = document.createElement("div");
            }

            filler.classList.add("bento-filler");
            filler.style.gridColumn = `${column + 1} / span ${gridColumnSpan}`;
            filler.style.gridRow = `${row + 1} / span ${gridRowSpan}`;

            let swapPerformed = false;

            // Swap the filler element with an existing element of the same size, if available
            if (this.config.balanceFillers) {
              const availableSwaps = Array.from(this.gridItems)
                .filter(item => !item.hasAttribute("data-bento-no-swap"))
                .filter((item) => {
                  const gridColumnStart = parseInt(item.style.gridColumn.split(" / ")[0]);
                  const gridRowStart = parseInt(item.style.gridRow.split(" / ")[0]);
                  const gridColumnEnd = parseInt(item.style.gridColumn.split(" / ")[1].split(" ")[1]);
                  const gridRowEnd = parseInt(item.style.gridRow.split(" / ")[1].split(" ")[1]);

                  return (
                    gridColumnEnd === gridColumnSpan &&
                    gridRowEnd === gridRowSpan &&
                    (gridColumnStart !== column + 1 || gridRowStart !== row + 1)
                  );
                });

              if (availableSwaps.length > 0) {
                const getNextPositionDistance = (current, next) => {
                  return Math.abs(current.column - next.column) + Math.abs(current.row - next.row);
                };

                const getAverageSwapsDistance = (swaps, newSwap) => {
                  if (swaps.length === 0) return 0;
                  const totalDistance = swaps.reduce((sum, swap) => {
                    return sum + getNextPositionDistance(swap, newSwap);
                  }, 0);
                  return totalDistance / swaps.length;
                };

                const bestSwap = availableSwaps.reduce((best, current) => {
                  const currentAvgDistance = getAverageSwapsDistance(lastFillerPositions, {
                    column: parseInt(current.style.gridColumn.split(" / ")[0]) - 1,
                    row: parseInt(current.style.gridRow.split(" / ")[0]) - 1,
                  });

                  const bestAvgDistance = getAverageSwapsDistance(lastFillerPositions, {
                    column: parseInt(best.style.gridColumn.split(" / ")[0]) - 1,
                    row: parseInt(best.style.gridRow.split(" / ")[0]) - 1,
                  });

                  return currentAvgDistance > bestAvgDistance ? current : best;
                }, availableSwaps[0]);

                const originalGridColumn = bestSwap.style.gridColumn;
                const originalGridRow = bestSwap.style.gridRow;
                bestSwap.style.gridColumn = filler.style.gridColumn;
                bestSwap.style.gridRow = filler.style.gridRow;
                filler.style.gridColumn = originalGridColumn;
                filler.style.gridRow = originalGridRow;

                lastFillerPositions.push({
                  column: parseInt(filler.style.gridColumn.split(" / ")[0]) - 1,
                  row: parseInt(filler.style.gridRow.split(" / ")[0]) - 1,
                });
                swapPerformed = true;
              }

            }

            // Update gridMatrix
            occupyPosition(column, row, gridColumnSpan, gridRowSpan);

            this.gridContainer.appendChild(filler);
          }
        }
      }
    }

    addFillers();

    this.prevTotalColumns = totalColumns;

    this.emitCalculationDoneEvent();
  }

  handleResponsiveBehavior() {
    const onResize = () => {
      clearTimeout(this.resizeObserver._timeoutId);
      this.resizeObserver._timeoutId = setTimeout(() => {
        const currentColumnCount = this.setupGrid();
        if (currentColumnCount !== this.prevColumnCount) {
          this.updateGrid();
        }
        this.prevColumnCount = currentColumnCount;
      }, 10);
    };

    if (this.config.breakpointReference === 'window') {
      this.resizeObserver = {
        observe: () => {
          window.addEventListener('resize', onResize);
        },
        unobserve: () => {
          window.removeEventListener('resize', onResize);
        },
      };
    } else {
      this.resizeObserver = new ResizeObserver(onResize);
    }

    this.resizeObserver.observe(this.gridContainer);
  }

  recalculate() {
    // Check if elements were added/removed or are now visible/invisible.
    this.setElements();
    this.updateGrid();
  }

  emitCalculationDoneEvent() {
    const calculationDoneEvent = new CustomEvent("calculationDone", {
      detail: {
        gridContainer: this.gridContainer,
      },
    });
    this.gridContainer.dispatchEvent(calculationDoneEvent);
  }
}

export default BentoGrid;