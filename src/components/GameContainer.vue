<script lang="ts" setup>
import { onBeforeMount, onMounted, ref, unref, watch, defineEmits, Ref } from "vue";
import Cell from "./Cell.vue";
import * as sudokuService from "../services/SudokuService";
import * as localStorageService from "../services/LocalStorageService";
import { Difficulty } from "sudoku-gen/dist/types/difficulty.type";
import { CellNotes } from "../services/SudokuService.types";

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

interface GameContainerProps {
  selectedDifficulty: Difficulty
}
const props = defineProps<GameContainerProps>();

const emit = defineEmits(['show-menu', 'selectNumber']);

onBeforeMount(() => {
  setTimeout(() => {
    let loadedCells;

    const storedSudoku = localStorageService.get('sudoku');
    const storedSelectedNumber = localStorageService.get('selectedNumber');

    if (storedSudoku?.length) {
      loadedCells = JSON.parse(storedSudoku);
    } else {
      loadedCells = newPuzzle(props.selectedDifficulty);
    }

    setGameData(loadedCells);

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

const newPuzzle = (difficulty: Difficulty) => {
  let newCells = sudokuService.generate(difficulty);
  localStorageService.set('sudoku', JSON.stringify(newCells));

  return newCells;
}

const setGameData = (newCells: any) => {
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

  setInputValue(index, newInput);
}

const resetHandler = () => {
  if (confirm("All progress will be lost. Are you sure?") === true) {
    input.value = puzzle.value;
    selectedNumber.value = '-';
    validate.value = false;

    let notesArr: CellNotes[] = [];
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

const numberClick = (newVal: string) => {
  selectedNumber.value = selectedNumber.value === newVal ? '-' : newVal;
}

const hintHandler = () => {
  let indices = [];

  for (var i = 0; i < input.value.length; i++) {
      if (input.value[i] === "-") indices.push(i);
  }

  const randomIndex = indices[~~(Math.random() * indices.length)];
  setInputValue(randomIndex, solution.value[randomIndex]);
}

const validateCell = (solutionValue: string, inputValue: string): boolean => {
  if (!validate.value || inputValue === '-') return true;
  return solutionValue === inputValue;
}

const setInputValue = (index: number, newVal: string) => {
  let newInputList = input.value.split('');
  newInputList[index] = newVal;
  input.value = newInputList.join('');
}
</script>

<template>
  <div>
    <template v-if="puzzle.length">
      <div class="content-block">
        <h1>Vuedoku <small>({{ difficulty }})</small></h1>
      </div>
      <div class="content-block">
        <div class="grid">
          <Cell v-for="(value, i) in input" :key="`cell-${i}`" :index="i" :puzzleValue="puzzle[i]" :inputValue="value"
            :notes="notes[i]" :selectedNumber="selectedNumber" :isValid="validateCell(solution[i], input[i])"
            @click="cellClickHandler(i)" />
        </div>
      </div>

      <div class="content-block">
        <button type="button" @click="$emit('show-menu')" title="Return to menu">
          <span class="material-symbols-outlined">home</span>
        </button>

        <button type="button" @click="resetHandler" title="Reset puzzle">
          <span class="material-symbols-outlined">refresh</span>
        </button>

        <button type="button" @click="validate = !validate" title="Validate puzzle" :class="{ 'active': validate }">
          <span class="material-symbols-outlined">check_circle</span>
        </button>

        <button type="button" @click="hintHandler" title="Hint">
          <span class="material-symbols-outlined">lightbulb</span>
        </button>

        <button type="button" :class="{ 'active': takingNotes }" @click="takingNotes = !takingNotes">
          <span class="material-symbols-outlined">edit</span>
        </button>

        <button type="button" v-for="nr in '123456789'" :key="`number-picker-${nr}`"
          :class="{ 'number': true, 'active': selectedNumber === nr, 'completed': (input.split(nr).length - 1) === 9 }"
          @click="numberClick(nr)">
          {{ nr }}
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