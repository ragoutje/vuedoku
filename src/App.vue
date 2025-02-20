<script lang="ts" setup>
import { Ref, onBeforeMount, ref, watch } from 'vue';
import { ColorMode } from './types/color-mode';
import { Difficulty } from 'sudoku-gen/dist/types/difficulty.type';
import * as localStorageService from './services/LocalStorageService';
import GameContainer from './components/GameContainer.vue'
import HorizontalSelect from './components/HorizontalSelect.vue';

/* Consts */
const colorModes: Array<ColorMode> = ['auto', 'light', 'dark'];
const colorModeLabels = { 'auto': 'Theme: auto', 'light': 'Light mode', 'dark': 'Dark mode'};
const difficulties: Array<Difficulty> = ['easy', 'medium', 'hard', 'expert'];
const difficultyLabels = { 'easy': 'Easy', 'medium': 'Medium', 'hard': 'Hard', 'expert': 'Expert'};

/* Refs */
const isLoading = ref(true);
const showMenu = ref(true);
const hasPreviousGame = ref(false);
const selectedColorMode: Ref<ColorMode> = ref('auto');
const selectedDifficulty: Ref<Difficulty> = ref('medium');

/* Events */
watch(selectedDifficulty, (newVal) => localStorageService.set('selectedDifficulty', newVal));
watch(selectedColorMode, (newVal) => {
  localStorageService.set('selectedColorMode', newVal);
  setColorMode(newVal);
});

/* Lifecycle */
onBeforeMount(() => {
  checkForPreviousGame();
  checkForPreviousColorMode();
  checkForPreviousDifficulty();

  setTimeout(() => {
    isLoading.value = false;
  }, 250);
});

/* Methods */
const setColorMode = (newVal: ColorMode) => {
  document.documentElement.className = `theme-${newVal}`;
}

const checkForPreviousGame = (): void => {
  const storedGame = localStorageService.get('sudoku');

  if (storedGame && JSON.parse(storedGame)?.input?.length) {
    hasPreviousGame.value = true;
  }
}

const checkForPreviousColorMode = (): void => {
  selectedColorMode.value = localStorageService.get('selectedColorMode') ?? 'auto';
  setColorMode(selectedColorMode.value);
}

const checkForPreviousDifficulty = (): void => {
  const storedDifficulty = localStorageService.get('selectedDifficulty') ?? 'medium';

  if (storedDifficulty && storedDifficulty.length) {
    const diff: Difficulty = storedDifficulty;
    selectedDifficulty.value = diff;
  }
}

const newGameHandler = (): void => {
  if (hasPreviousGame.value) {
    if (confirm("You haven't finished your previous puzzle. Start a new one?") === true) {
      localStorageService.clear();
      localStorageService.set('selectedDifficulty', selectedDifficulty.value);

    } else {
      return;
    }
  }

  menuHandler(false);
}

const menuHandler = (newVal: boolean): void => {
  showMenu.value = newVal;

  if (showMenu.value) {
    checkForPreviousDifficulty();
    checkForPreviousGame();
  }
}
</script>

<template>
  <template v-if="isLoading">
    <strong>Loading Vuedoku...</strong>
  </template>

  <template v-else>

    <template v-if="showMenu">
      <div class="main-menu">
        <div class="content-block"> 
          <h1>Vuedoku</h1>
        </div>

        <div class="content-block center">
          <HorizontalSelect
:values="difficulties" :selected="difficulties.indexOf(selectedDifficulty)" :labels="difficultyLabels"
            @change-selected="(newVal) => selectedDifficulty = difficulties[newVal]" />
        </div>

        <div class="content-block center">
          <HorizontalSelect
:values="colorModes" :selected="colorModes.indexOf(selectedColorMode)" :labels="colorModeLabels"
            @change-selected="(newVal) => selectedColorMode = colorModes[newVal]" />
        </div>

        <div class="content-block">
          <button @click="newGameHandler">New Game</button>
        </div>

        <div v-if="hasPreviousGame" class="content-block">
          <button @click="menuHandler(false)">Resume</button>
        </div>
      </div>
    </template>

    <template v-else>
      <GameContainer :selected-difficulty="selectedDifficulty" @show-menu="menuHandler(true)" />
    </template>

  </template>
</template>