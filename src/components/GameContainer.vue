<script lang="ts" setup>
import { onBeforeMount, onMounted, ref, unref, watch, defineEmits } from "vue";
import Cell from "./Cell.vue";
import * as sudokuService from "../services/SudokuService";
import * as localStorageService from "../services/LocalStorageService";
import { Difficulty } from "sudoku-gen/dist/types/difficulty.type";

const initialized = ref(false);
const selectedNumber = ref('-');
const puzzle = ref('');
const solution = ref('');
const input = ref('');
const difficulty = ref('');
const completed = ref(false);
const notes = ref()
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

    if (storedSudoku?.length) {
      loadedCells = JSON.parse(storedSudoku);
    } else {
      loadedCells = newPuzzle(props.selectedDifficulty);
    }

    setGameData(loadedCells);    
  }, 250);
});

onMounted(() => {
  initialized.value = true;
});

watch(input, (newInput) => {
  if (initialized.value) {
    localStorageService.set('sudoku', JSON.stringify({
      puzzle: unref(puzzle),
      solution: unref(solution),
      input: unref(newInput),
      difficulty: unref(difficulty),
      notes: unref(notes),
    }));
  }

  // Watch for a finished puzzle (both incorrectly filled and solved ones)
  if (newInput === solution.value) {
    completed.value = true;
    if (confirm('Congratulation! Start a new game?')) {
      setGameData(newPuzzle('easy'));
    };
  }
});

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

  let newInputList = input.value.split('');
  newInputList[index] = newInput;
  input.value = newInputList.join('');
}

const resetHandler = () => {
  if (confirm("All progress will be lost. Are you sure?") === true) {
    input.value = puzzle.value;
  }
}

const numberClick = (newVal: string) => {
  selectedNumber.value = selectedNumber.value === newVal ? '-' : newVal;
}

const takingNotesHandler = () => {
  takingNotes.value = !takingNotes.value;
}

const validateHandler = () => {
  validate.value = !validate.value;
}

const validateCell = (solutionValue: string, inputValue: string): boolean => {
  if (!validate.value || inputValue === '-') return true;
  return solutionValue === inputValue;
}
</script>

<template>
  <div>
    <template v-if="puzzle.length">
      <div class="content-block">
        <button type="button" @click="$emit('show-menu')" title="Return to menu">
          <span class="material-symbols-outlined">home</span>
        </button>
  
        <button type="button" @click="resetHandler" title="Reset puzzle">
          <span class="material-symbols-outlined">refresh</span>
        </button>
  
        <button type="button" @click="validateHandler" title="Validate puzzle" :class="{ 'active': validate }">
          <span class="material-symbols-outlined">check_circle</span>
        </button>
  
        <button type="button" title="Hint">
          <span class="material-symbols-outlined">lightbulb</span>
        </button>
      </div>
  
      <div class="content-block">
        <div class="grid">
          <Cell
              v-for="(value, i) in puzzle"
              :key="`cell-${i}`"
              :index="i"
              :puzzleValue="value"
              :solutionValue="solution[i]"
              :inputValue="input[i]"
              :notes="notes[i]"
              :selectedNumber="selectedNumber"
              :isValid="validateCell(solution[i], input[i])"
              @click="cellClickHandler(i)"
          />
        </div>
      </div>

      <div class="content-block">
        <button type="button"
            v-for="nr in '123456789'"
            :key="`number-picker-${nr}`"
            :class="{'number': true, 'active': selectedNumber === nr, 'completed': (input.split(nr).length-1) === 9}"
            @click="numberClick(nr)"
          >
          {{ nr }}
        </button>
        <button type="button" :class="{'active': takingNotes }" @click="takingNotesHandler">
          <span class="material-symbols-outlined">edit</span>
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