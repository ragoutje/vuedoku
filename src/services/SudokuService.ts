import { getSudoku } from "sudoku-gen";
import { Difficulty } from "sudoku-gen/dist/types/difficulty.type";
import { SudokuGrid } from "./SudokuService.types";

export const generate = (difficulty: Difficulty | undefined = "easy"): SudokuGrid => {
    const newSudokuObj = getSudoku(difficulty);

    return {
        ...newSudokuObj,
        input: newSudokuObj.puzzle,
    }
}