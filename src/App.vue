<script lang="ts" setup>
import { Ref, onBeforeMount, ref, watch } from 'vue';
import { Difficulty } from 'sudoku-gen/dist/types/difficulty.type';
import * as localStorageService from './services/LocalStorageService';
import GameContainer from './components/GameContainer.vue'
import HorizontalSelect from './components/HorizontalSelect.vue';

/* Consts */
const difficulties: Array<Difficulty> = ['easy', 'medium', 'hard', 'expert'];

/* Refs */
const isLoading = ref(true);
const showMenu = ref(true);
const hasPreviousGame = ref(false);
const selectedDifficulty: Ref<Difficulty> = ref('medium');

/* Events */
watch(selectedDifficulty, (newVal) => localStorageService.set('selectedDifficulty', newVal));


/* Lifecycle */
onBeforeMount(() => {
  checkForPreviousGame();
  checkForPreviousDifficulty();

  setTimeout(() => {
    isLoading.value = false;
  }, 250);
});

/* Methods */
const checkForPreviousGame = (): void => {
  const storedGame = localStorageService.get('sudoku');

  if (storedGame && JSON.parse(storedGame)?.input?.length) {
    hasPreviousGame.value = true;
  }
}

const checkForPreviousDifficulty = (): void => {
  const storedDifficulty = localStorageService.get('selectedDifficulty');

  if (storedDifficulty && storedDifficulty.length) {
    const diff: any = storedDifficulty;
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
          <HorizontalSelect :values="difficulties" :selected="difficulties.indexOf(selectedDifficulty)"
            @change-selected="(newVal) => selectedDifficulty = difficulties[newVal]" />
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