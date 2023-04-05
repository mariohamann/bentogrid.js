function Bento(config) {
  const gridContainer = document.querySelector(config.target);
  const gridItems = gridContainer.querySelectorAll(":scope > *");

  let prevTotalColumns;

  function getBreakpoint() {
    const width = window.innerWidth;
    let activeBreakpoint = { ...config };
    for (const breakpoint of config.breakpoints) {
      if (width >= breakpoint.minWidth) {
        activeBreakpoint = { ...activeBreakpoint, ...breakpoint };
      }
    }
    return activeBreakpoint;
  }

  function setupGrid() {
    const breakpoint = getBreakpoint();
    const totalColumns =
      breakpoint.columns ||
      Math.floor(
        (gridContainer.clientWidth + breakpoint.itemSpacing) /
        (breakpoint.cellWidth.min + breakpoint.itemSpacing)
      );
    gridContainer.style.display = "grid";
    gridContainer.style.gridTemplateColumns = `repeat(${totalColumns}, minmax(${breakpoint.cellWidth.min}px, 1fr))`;
    gridContainer.style.gridGap = `${breakpoint.itemSpacing}px`;
    return totalColumns;
  }

  function removePlaceholders() {
    const placeholders = gridContainer.querySelectorAll(config.placeholders);
    placeholders.forEach((placeholder) => placeholder.remove());
  }

  function initializeGridItems() {
    const totalColumns = setupGrid();

    if (prevTotalColumns !== totalColumns) {
      removePlaceholders();
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

    gridItems.forEach((item) => {
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


    const breakpoint = getBreakpoint();

    gridContainer.style.gridTemplateRows = `repeat(${maxRow}, minmax(${breakpoint.cellWidth.min}px, 1fr))`;

    // Find the maximum row
    gridItems.forEach((item) => {
      const gridRowStart = parseInt(item.style.gridRow.split(" / ")[0]);
      const gridRowSpan = parseInt(
        item.style.gridRow.split(" / ")[1].split(" ")[1]
      );
      maxRow = Math.max(maxRow, gridRowStart + gridRowSpan - 1);
    });

    let placeholders = [];
    if (config.placeholders) {
      placeholders = Array.from(document.querySelectorAll(config.placeholders));
    }

    function addDummyElements() {
      let currentPlaceholderIndex = 0;

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

            // Clone the current placeholder
            const dummyElement = placeholders[
              currentPlaceholderIndex
            ].cloneNode(true);

            // Position the cloned placeholder
            dummyElement.style.gridColumn = `${column + 1
              } / span ${gridColumnSpan}`;
            dummyElement.style.gridRow = `${row + 1} / span ${gridRowSpan}`;

            // Add the cloned placeholder to the grid
            gridContainer.appendChild(dummyElement);

            // Update gridMatrix
            occupyPosition(column, row, gridColumnSpan, gridRowSpan);

            // Update the current placeholder index, looping back to the first placeholder if needed
            currentPlaceholderIndex =
              (currentPlaceholderIndex + 1) % placeholders.length;
          }
        }
      }
    }

    addDummyElements();

    prevTotalColumns = totalColumns;
  }

  // Initialize the grid
  setupGrid();

  // Initialize grid items
  initializeGridItems();

  // Handle responsive behavior
  const resizeObserver = new ResizeObserver(() => {
    clearTimeout(resizeObserver._timeoutId);
    resizeObserver._timeoutId = setTimeout(() => {
      initializeGridItems();
    }, 10);
  });

  resizeObserver.observe(gridContainer);
}

Bento({
  target: ".grid-container",
  placeholders: ".grid-item-dummy", // selects elements that should be used as placeholders and should loop through them
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
  aspectRatio: 1 // Users can set their own aspect ratio for a cell (not an item) (width / height)
});
