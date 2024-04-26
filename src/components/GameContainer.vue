<script lang="ts" setup>
import { onBeforeMount, onMounted, ref, unref, watch, defineEmits } from "vue";
import SudokuGrid from './SudokuGrid.vue';
import NumberPicker from './NumberPicker.vue';
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

interface GameContainerProps {
    selectedDifficulty: Difficulty
}
const props = defineProps<GameContainerProps>();

const emit = defineEmits(['show-menu']);

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
  }, 500);
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
}

const cellClickHandler = (index: number) => {
  let newInput = '-';

  // An initial value can't be edited
  if (puzzle.value[index] !== '-') return;

  // Nothing happens if there isn't a selected number
  if (selectedNumber.value === '-') return;


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
</script>

<template>
  <div class="game">
    <template v-if="puzzle.length">
      <div class="game-top">
        <button type="button" class="action-item" @click="$emit('show-menu')">
          Back to menu
        </button>
      </div>

      <SudokuGrid :grid="{ input, solution, puzzle }" :selectedNumber="selectedNumber" @cell-clicked="cellClickHandler" />
      <NumberPicker :input="input" @select-number="(n) => selectedNumber = n" />

      <button type="button" class="action-item" @click="resetHandler">
        Reset
      </button>
    </template>
    <template v-else>
      <div class="center">
        <strong>Loading Vuedoku...</strong>
      </div>
    </template>
  </div>
</template>

<style lang="scss">
  
</style>