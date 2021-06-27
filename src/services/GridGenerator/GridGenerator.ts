import {Cell, cellTemplate, Grid} from "../SudokuGenerator/SudokuGenerator.types";

export const generateGrid = (sudoku: any): Grid => {
    const grid: Cell[] = [];
    sudoku
        .generate('easy')
        .split('')
        .forEach((item: string, i: number) => {
                const nr = item === '.' ? 0 : parseInt(item);
                grid.push({ ...cellTemplate, value: nr, initialValue: nr, row: Math.ceil(i/9), col: Math.ceil(i%9) });
            }
        );

    return grid;
}