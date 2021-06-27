import filter from 'ramda/src/filter';
import includes from 'ramda/src/includes';
import map from 'ramda/src/map';
import pipe from 'ramda/src/pipe';
import uniq from 'ramda/src/uniq';
import without from 'ramda/src/without';
import {getRandomSudokuNumber} from "../../utilities/functional-helpers";
import { Grid, Cell, cellTemplate } from "./SudokuGenerator.types";

export const createCell = (row: number, col: number) => <Cell>({
    ...cellTemplate,
    row,
    col,
});

export const generateEmptyGrid = (gridSize: number): Grid => {
    let array: Grid = [];
    let currentRow: number = 1;
    let currentCol: number = 1;
    const maxCells: number = gridSize * gridSize;

    for (let i = 0; i < maxCells; i++) {
        if (currentCol > gridSize) {
            currentRow++;
            currentCol = 1;
        }
        array.push(createCell(currentRow, currentCol));
        currentCol++;
    }

    return array;
}

export const valuesMapFn = (cell: Cell) => cell.value;

// Row functions
export const rowFilterFn = (row: number) => (cell: Cell): boolean => cell.row === row;
export const getRow = (grid: Grid, row: number): Cell[] => filter(rowFilterFn(row), grid);
export const isRowSafe = (row: Cell[], nr: number) => !pipe(map(valuesMapFn), includes(nr))(row);

// Column functions
export const colFilterFn = (col: number) => (cell: Cell): boolean => cell.col === col;
export const getCol = (grid: Grid, col: number): Cell[] => filter(colFilterFn(col), grid);
export const isColSafe = (col: Cell[], nr: number) => !pipe(map(valuesMapFn), includes(nr))(col);

//Block functions
export const ranges: any = {
    1: [1,2,3],
    2: [4,5,6],
    3: [7,8,9],
};
export const getBlockCoordinate = (nr: number) => Math.ceil(nr / 3);
export const blockFilterFn = (rowRange: number[], colRange: number[]) => (cell: Cell) => includes(cell.row, rowRange) && includes(cell.col, colRange);
export const getBlock = (grid: Grid, row: number, col: number): Cell[] => filter(
    blockFilterFn(
        ranges[getBlockCoordinate(row)],
        ranges[getBlockCoordinate(col)]
    ),
    grid
);

export const getGridSafeNumber = (grid: Grid, cell: Cell): number => {
    const colValues = map(valuesMapFn, getCol(grid, cell.col));
    const rowValues = map(valuesMapFn, getRow(grid, cell.row));
    const blockValues = map(valuesMapFn, getBlock(grid, cell.row, cell.col));

    const unsafeValues = without([0], uniq([...colValues, ...rowValues, ...blockValues]));
    const safeValues = without(unsafeValues, [1,2,3,4,5,6,7,8,9]);

    return getRandomSudokuNumber(safeValues);
}

export const generateSudoku = (gridSize: number): Grid => {
    const grid = generateEmptyGrid(gridSize);

    grid.forEach(cell => {
        cell.value = getGridSafeNumber(grid, cell);
        cell.initialValue = cell.value;
    });

    return grid;
};

// export const generatePlayableGrid = (filledGrid: Grid, nrOfRemoves: number = 3): Grid => {
//     let grid: Grid = [...filledGrid];
//     let alreadyRemoved: number[] = [];
//
//     for (let i = 0; alreadyRemoved.length < nrOfRemoves; i++) {
//         let row = getRandomNumber();
//         let col = getRandomNumber();
//
//         const cellIndex = grid.findIndex(cell => cell.row === row && cell.col === col);
//         if (!alreadyRemoved.includes(cellIndex)) {
//             alreadyRemoved.push(cellIndex);
//             grid[cellIndex].value = 0;
//         }
//     }
//
//     return grid;
// }