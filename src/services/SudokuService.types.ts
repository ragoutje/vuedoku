import { Sudoku } from "sudoku-gen/dist/types/sudoku.type";

export interface CellNotes {
    [name: string]: boolean,
}

export interface SudokuGrid extends Sudoku {
    input: string,
    notes: Array<CellNotes>,
}