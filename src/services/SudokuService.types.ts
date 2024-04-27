import { Sudoku } from "sudoku-gen/dist/types/sudoku.type";

export interface CellNotes {
    1: boolean,
    2: boolean,
    3: boolean,
    4: boolean,
    5: boolean,
    6: boolean,
    7: boolean,
    8: boolean,
    9: boolean,
}

export interface SudokuGrid extends Sudoku {
    input: string,
    notes: Array<CellNotes>,
}