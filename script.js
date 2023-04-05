class Bento {
  constructor(userConfig) {
    this.config = {
      ...{
        target: "",
        columns: null,
        cellWidth: { min: 100, max: 150 },
        itemSpacing: 10,
        placeholders: "",
        aspectRatio: 1 / 1,
        breakpoints: [],
        swapPlaceholders: true,
      },
      ...userConfig
    };
    this.gridContainer = document.querySelector(this.config.target);
    this.gridItems = this.gridContainer.querySelectorAll(":scope > *");
    this.prevTotalColumns = null;
    this.prevColumnCount = null;

    this.setupGrid();
    this.initializeGridItems();

    this.handleResponsiveBehavior();
  }

  getBreakpoint() {
    const width = window.innerWidth;
    let activeBreakpoint = { ...this.config };
    for (const breakpoint of this.config.breakpoints) {
      if (width >= breakpoint.minWidth) {
        activeBreakpoint = { ...activeBreakpoint, ...breakpoint };
      }
    }
    return activeBreakpoint;
  }

  setupGrid() {
    const breakpoint = this.getBreakpoint();
    const totalColumns =
      breakpoint.columns ||
      Math.floor(
        (this.gridContainer.clientWidth + breakpoint.itemSpacing) /
        (breakpoint.cellWidth.min + breakpoint.itemSpacing)
      );
    this.gridContainer.style.display = "grid";
    this.gridContainer.style.gridTemplateColumns = `repeat(${totalColumns}, minmax(${breakpoint.cellWidth.min}px, 1fr))`;
    this.gridContainer.style.gridGap = `${breakpoint.itemSpacing}px`;
    return totalColumns;
  }

  removePlaceholders() {
    const placeholders = this.gridContainer.querySelectorAll(this.config.placeholders);
    placeholders.forEach((placeholder) => placeholder.remove());
  }

  initializeGridItems() {
    const totalColumns = this.setupGrid();

    if (this.prevTotalColumns !== totalColumns) {
      this.removePlaceholders();
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

    this.gridContainer.style.gridTemplateRows = `repeat(${maxRow}, minmax(${breakpoint.cellWidth.min}px, 1fr))`;

    // Find the maximum row
    this.gridItems.forEach((item) => {
      const gridRowStart = parseInt(item.style.gridRow.split(" / ")[0]);
      const gridRowSpan = parseInt(
        item.style.gridRow.split(" / ")[1].split(" ")[1]
      );
      maxRow = Math.max(maxRow, gridRowStart + gridRowSpan - 1);
    });

    let placeholders = [];
    if (this.config.placeholders) {
      placeholders = Array.from(document.querySelectorAll(this.config.placeholders));
    }

    const addPlaceholders = () => {
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
            let rowSpanValid = true;
            for (let c = column; c < column + gridColumnSpan; c++) {
              for (let r = row + 1; r < maxRow && rowSpanValid; r++) {
                if (gridMatrix[c][r]) {
                  rowSpanValid = false;
                } else {
                  gridRowSpan++;
                }
              }
            }

            const placeholder = document.createElement("div");
            placeholder.className = "grid-item grid-item-placeholder";
            placeholder.style.gridColumn = `${column + 1
              } / span ${gridColumnSpan}`;
            placeholder.style.gridRow = `${row + 1} / span ${gridRowSpan}`;
            this.gridContainer.appendChild(placeholder);

            // Update gridMatrix
            occupyPosition(column, row, gridColumnSpan, gridRowSpan);

            // Swap the placeholder element with an existing element of the same size, if available
            if (this.config.swapPlaceholders) {
              const sameSizeElement = Array.from(this.gridItems).find((item) => {
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

              if (sameSizeElement) {
                const originalGridColumn = sameSizeElement.style.gridColumn;
                const originalGridRow = sameSizeElement.style.gridRow;
                sameSizeElement.style.gridColumn = placeholder.style.gridColumn;
                sameSizeElement.style.gridRow = placeholder.style.gridRow;
                placeholder.style.gridColumn = originalGridColumn;
                placeholder.style.gridRow = originalGridRow;
              }
            }
          }
        }
      }
    }

    addPlaceholders();

    this.prevTotalColumns = totalColumns;
  }

  handleResponsiveBehavior() {
    this.resizeObserver = new ResizeObserver(() => {
      clearTimeout(this.resizeObserver._timeoutId);
      this.resizeObserver._timeoutId = setTimeout(() => {
        const currentColumnCount = this.setupGrid();
        if (currentColumnCount !== this.prevColumnCount) {
          this.initializeGridItems();
        }
        this.prevColumnCount = currentColumnCount;
      }, 10);
    });

    this.resizeObserver.observe(this.gridContainer);
  }

  recalculate() {
    this.initializeGridItems();
  }
}

const myBento = new Bento({
  target: ".grid-container",
  placeholders: ".grid-item-placeholder", // selects elements that should be used as placeholders and should loop through them
  cellWidth: {
    min: 100,
    max: 150
  }, // a cell of the grid, not an item in the grid
  itemSpacing: 10,
  breakpoints: [
    {
      minWidth: 480,
      cellWidth: {
        min: 150,
        max: 200
      },
      itemSpacing: 5
    },
    {
      minWidth: 768,
      cellWidth: {
        min: 200,
        max: 250
      },
      itemSpacing: 10
    }
  ],
  aspectRatio: 1, // Users can set their own aspect ratio for a cell (not an item) (width / height)
  swapPlaceholders: true
});
