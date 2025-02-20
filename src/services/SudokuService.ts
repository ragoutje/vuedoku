import { getSudoku } from "sudoku-gen";
import { Difficulty } from "sudoku-gen/dist/types/difficulty.type";
import { SudokuGrid } from "./SudokuService.types";

export const generate = (difficulty: Difficulty = "easy"): SudokuGrid => {
    const newSudokuObj = getSudoku(difficulty);

    const notesArr = [];

    for (let i = 0; i < 81; i++) {
        notesArr[i] = {
            1: false,
            2: false,
            3: false,
            4: false,
            5: false,
            6: false,
            7: false,
            8: false,
            9: false,
        }
    }

    return {
        ...newSudokuObj,
        input: newSudokuObj.puzzle,
        notes: notesArr,
    }
}