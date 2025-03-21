<script lang="ts" setup>
import { onBeforeMount, onMounted, ref, unref, watch, defineEmits, Ref } from "vue";
import SudokuCell from "./SudokuCell.vue";
import * as sudokuService from "../services/SudokuService";
import * as localStorageService from "../services/LocalStorageService";
import { Difficulty } from "sudoku-gen/dist/types/difficulty.type";
import { CellNotes, SudokuGrid } from "../services/SudokuService.types";

const initialized = ref(false);
const selectedNumber = ref('-');
const puzzle = ref('');
const solution = ref('');
const input = ref('');
const difficulty: Ref<Difficulty> = ref('easy');
const completed = ref(false);
const notes = ref();
const takingNotes = ref(false);
const validate = ref(false);

const props = defineProps<{selectedDifficulty: Difficulty}>();
defineEmits(['show-menu', 'selectNumber']);

onBeforeMount(() => {
  setTimeout(() => {
    let loadedCells: SudokuGrid | undefined;
    const storedSudoku = localStorageService.get('sudoku');
    const storedSelectedNumber = localStorageService.get('selectedNumber');

    // eslint-disable-next-line prefer-const
    loadedCells = storedSudoku?.length ? JSON.parse(storedSudoku) : newPuzzle(props.selectedDifficulty);

    if (loadedCells !== undefined) {
      setGameData(loadedCells);
    }

    if (storedSelectedNumber?.length) selectedNumber.value = storedSelectedNumber;
  }, 250);
});

onMounted(() => {
  initialized.value = true;
});

watch(input, (newInput) => {
  if (initialized.value) {
    storeSudoku();
  }

  // Watch for a finished puzzle (both incorrectly filled and solved ones)
  if (newInput === solution.value) {
    completed.value = true;
    if (confirm('Congratulation! Start a new game?')) {
      setGameData(newPuzzle(difficulty.value));
    };
  }
});

watch(notes, () => {
  if (initialized.value) {
    storeSudoku();
  }
}, { deep: true });


watch(selectedNumber, (newVal) => localStorageService.set('selectedNumber', newVal));


const storeSudoku = () => {
  localStorageService.set('sudoku', JSON.stringify({
    puzzle: unref(puzzle),
    solution: unref(solution),
    input: unref(input),
    difficulty: unref(difficulty),
    notes: unref(notes),
  }));
}

const newPuzzle = (difficulty: Difficulty): SudokuGrid => {
  const newCells = sudokuService.generate(difficulty);
  localStorageService.set('sudoku', JSON.stringify(newCells));

  return newCells;
}

const setGameData = (newCells: SudokuGrid) => {
  puzzle.value = newCells.puzzle;
  solution.value = newCells.solution;
  input.value = newCells.input;
  difficulty.value = newCells.difficulty;
  notes.value = newCells.notes;
}

const addNote = (index: number) => {
  notes.value[index][selectedNumber.value] = !notes.value[index][selectedNumber.value];
}

const cellClickHandler = (index: number) => {
  let newInput = '-';

  // An initial value can't be edited
  if (puzzle.value[index] !== '-') return;

  // Nothing happens if there isn't a selected number
  if (selectedNumber.value === '-') return;

  // Add notes
  if (takingNotes.value) {
    addNote(index);
    return;
  }

  // Remove an existing user input
  if (input.value[index] === selectedNumber.value) {
    newInput = '-'
  } else if (selectedNumber.value !== '-') {
    newInput = selectedNumber.value;
  }

  // Set a new value
  setInputValue(index, newInput);

  // Clean up notes
  cleanUpNotes(index, newInput);
}

const resetHandler = () => {
  if (confirm("All progress will be lost. Are you sure?") === true) {
    input.value = puzzle.value;
    selectedNumber.value = '-';
    validate.value = false;

    const notesArr: CellNotes[] = [];
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
    notes.value = notesArr;
  }
}

const numberClick = (newVal: string): void => {
  selectedNumber.value = selectedNumber.value === newVal ? '-' : newVal;
}

const hintHandler = (): void => {
  const indices = [];

  for (let i = 0; i < input.value.length; i++) {
      if (input.value[i] === "-") indices.push(i);
  }

  const randomIndex = indices[~~(Math.random() * indices.length)];
  setInputValue(randomIndex, solution.value[randomIndex]);
}

const validateCell = (solutionValue: string, inputValue: string): boolean => {
  if (!validate.value || inputValue === '-') return true;
  return solutionValue === inputValue;
}

const setInputValue = (index: number, newVal: string): void => {
  const newInputList = input.value.split('');
  newInputList[index] = newVal;
  input.value = newInputList.join('');
}

const getRow = (i: number): number => Math.floor(i / 9);
const getCol = (i: number): number => i % 9;
const getCell = (rowOrCol: number): number => Math.floor(rowOrCol / 3);

const cleanUpNotes = (index: number, newVal: string): void => {
  const indices: number[] = [];
  indices.push(index);

  const row = getRow(index);
  const col = getCol(index);
  const rowCell = getCell(row);
  const colCell = getCell(col);


  unref(notes).forEach((_el: CellNotes, i: number) => {
    const notesRow = getRow(i);
    const notesCol = getCol(i) 
    const notesRowCell = getCell(notesRow);
    const notesColCell = getCell(notesCol);

    if (
      (notesRowCell === rowCell && notesColCell === colCell) // Part of the same 9x9 cell
      || notesRow === row // same row
      || notesCol === col // same col
    ) {
        indices.push(i);
    }
  });
  // Set false all notes with the same value as newValue
  for (let i = 0; i < indices.length; i++) {
    notes.value[indices[i]][newVal] = false;
  }
}
</script>

<template>
  <div class="game-container">
    <template v-if="puzzle.length">
      <div class="content-block">
        <h1>Vuedoku <small>({{ difficulty }})</small></h1>
      </div>
      <div class="content-block">
        <div class="sudoku">
          <SudokuCell
v-for="(value, i) in input" :key="`cell-${i}`" :index="i" :puzzle-value="puzzle[i]" :input-value="value"
            :notes="notes[i]" :selected-number="selectedNumber" :is-valid="validateCell(solution[i], input[i])"
            @click="cellClickHandler(i)" />
        </div>
      </div>

      <div class="content-block">
        <div class="number-picker">
          <button
v-for="nr in '123456789'" :key="`number-picker-${nr}`" type="button"
            :class="{ 'active': selectedNumber === nr, 'completed': (input.split(nr).length - 1) === 9, 'note': takingNotes }"
            @click="numberClick(nr)">
            {{ nr }}
          </button>

          <button type="button" :class="{ 'active': takingNotes }" :title="!takingNotes ? 'Switch to notes' : 'Switch to numbers'" @click="takingNotes = !takingNotes">
            <span class="material-symbols-outlined">edit</span>
          </button>
        </div>
      </div>

      <div class="content-block bottom-menu">
        <button type="button" title="Return to menu" @click="$emit('show-menu')">
          <span class="material-symbols-outlined">home</span>
        </button>

        <button type="button" title="Reset puzzle" @click="resetHandler">
          <span class="material-symbols-outlined">refresh</span>
        </button>

        <button type="button" title="Validate puzzle" :class="{ 'active': validate }" @click="validate = !validate">
          <span class="material-symbols-outlined">check_circle</span>
        </button>

        <button type="button" title="Hint" @click="hintHandler">
          <span class="material-symbols-outlined">lightbulb</span>
        </button>
      </div>
    </template>

    <template v-else>
      <div class="center">
        <strong>Loading grid...</strong>
      </div>
    </template>
  </div>
</template>