import all from "ramda/src/all";
import { Cell, cellTemplate, Grid } from "./SudokuGenerator.types";
import {
    createCell,
    generateEmptyGrid,
    getRow,
    isRowSafe,
    getCol,
    isColSafe
} from "./SudokuGenerator";

describe('GridGenerator', function () {
    describe('createCell', function () {
        it('should return a cell object', function () {
            const row: number = 4;
            const col: number = 1;
            const result: Cell = createCell(row, col);
            expect(result).toEqual({ ...cellTemplate, row, col });
        });
    });

    describe('generateEmptyGrid', function () {
        const rows: number = 9;
        const cols: number = 9;
        const result: Grid = generateEmptyGrid(rows, cols);

        it('should return an array with row * cols items', function () {
            expect(result.length).toBe(rows * cols);
        });

        it('should generate an array of cells', function () {
            const predicate = (obj: Cell) => {
                return obj.value === cellTemplate.value
                    && obj.initialValue === cellTemplate.initialValue
                    && obj.notes === cellTemplate.notes;
            }
            expect(all(predicate, result)).toBe(true);
        });
    });

    describe('getRow', function () {
        const grid = generateEmptyGrid(9, 9);

        it('should select 9 cells from a certain row', function () {
            const rowNr = 2;
            const row: Cell[] = getRow(grid, 2);

            expect(row.length).toBe(9);
            expect(row[3].row).toBe(rowNr);
        });
    });

    describe('isRowSafe', function () {
        const emptyGrid = generateEmptyGrid(9, 9);
        const rowNr = 5;
        const row = getRow(emptyGrid, rowNr);

        it('should return true when the number does not appear in the row', function () {
            const valueToCheck = 4;
            expect(isRowSafe(row, valueToCheck)).toBe(true);
        });

        it('should return false when the number appears in the row', function () {
            const valueToCheck = 4;
            let rowWithNumbers = [...row];
            rowWithNumbers[0].value = valueToCheck;

            expect(isRowSafe(rowWithNumbers, valueToCheck)).toBe(false);
        });
    });

    describe('isColSafe', function () {
        const emptyGrid = generateEmptyGrid(9, 9);
        const colNr = 5;
        const col = getCol(emptyGrid, colNr);

        it('should return true when the number does not appear in the row', function () {
            const valueToCheck = 4;
            expect(isColSafe(col, valueToCheck)).toBe(true);
        });

        it('should return false when the number appears in the row', function () {
            const valueToCheck = 7;
            let colWithNumbers = [...col];
            colWithNumbers[0].value = valueToCheck;

            expect(isColSafe(colWithNumbers, valueToCheck)).toBe(false);
        });
    });

    // describe('isSafe', function () {
    //     const emptyGrid = generateEmptyGrid(9, 9);
    //     it('should return true when the value is not present in the col or row of the cell', function () {
    //         const result = isSafe(emptyGrid);
    //         expect(result).toBe(true);
    //     });
    // });
});