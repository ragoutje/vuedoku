<script lang="ts" setup>
import { Ref, onBeforeMount, ref, watch } from 'vue';
import * as localStorageService from './services/LocalStorageService';
import GameContainer from './components/GameContainer.vue'
import { Difficulty } from 'sudoku-gen/dist/types/difficulty.type';

const isLoading = ref(true);
const showMenu = ref(true);
const hasPreviousGame = ref(false);
const previousDifficulty = ref('');
const selectedDifficulty: Ref<Difficulty> = ref('easy'); // 'easy', 'medium', 'hard', 'expert'

onBeforeMount(() => {
  checkForPreviousGame();
  checkForPreviousDifficulty();

  setTimeout(() => {
    isLoading.value = false;
  }, 250);
});

watch(selectedDifficulty, (newVal) => localStorageService.set('selectedDifficulty', newVal));

const checkForPreviousGame = () => {
  const storedGame = localStorageService.get('sudoku');

  if (storedGame && JSON.parse(storedGame)?.input?.length) {
    previousDifficulty.value = JSON.parse(storedGame).difficulty;
    hasPreviousGame.value = true;
  }
}

const checkForPreviousDifficulty = () => {
  const storedDifficulty = localStorageService.get('selectedDifficulty');

  if (storedDifficulty && storedDifficulty.length) {
    const diff: any = storedDifficulty;
    selectedDifficulty.value = diff;
  }
}

const newGameHandler = () => {
  if (hasPreviousGame.value) {
    if (confirm("You haven't finished your previous puzzle. Start a new one?") === true) {
      localStorageService.clear();
    } else {
      return;
    }
  }

  showMenu.value = false;
}

const continueHandler = () => {
  showMenu.value = false;
}

const showMenuHandler = () => {
  showMenu.value = true;
}

const prevDifficultyHandler = () => {
  if (selectedDifficulty.value === 'expert') {
    selectedDifficulty.value = 'hard'
  } else if (selectedDifficulty.value === 'hard') {
    selectedDifficulty.value = 'medium'
  } else if (selectedDifficulty.value === 'medium') {
    selectedDifficulty.value = 'easy'
  }
}
const nextDifficultyHandler = () => {
  if (selectedDifficulty.value === 'easy') {
    selectedDifficulty.value = 'medium'
  } else if (selectedDifficulty.value === 'medium') {
    selectedDifficulty.value = 'hard'
  } else if (selectedDifficulty.value === 'hard') {
    selectedDifficulty.value = 'expert'
  }
}
</script>

<template>
  <template v-if="isLoading">
    <div class="center">
        <strong>Loading Vuedoku...</strong>
      </div>
  </template>
  <template v-else>
    <template v-if="showMenu">
      <div class="main-menu">
        <h1>Vuedoku</h1>

        <div class="content-block center">
          <div class="horizontal-select">
            <div class="horizontal-select__button" @click="prevDifficultyHandler">
              <span v-if="selectedDifficulty !== 'easy'" class="material-symbols-outlined">chevron_left</span>
            </div>
            <div class="horizontal-select__label">{{ selectedDifficulty }}</div>
            <div class="horizontal-select__button" @click="nextDifficultyHandler">
              <span v-if="selectedDifficulty !== 'expert'" class="material-symbols-outlined">chevron_right</span>
            </div>
          </div>
        </div>

        <div class="content-block">
          <button @click="newGameHandler">New Game</button>
        </div>

        <div v-if="hasPreviousGame" class="content-block">
          <button @click="continueHandler">Resume</button>
        </div>
      </div>
    </template>
    <template v-else>
      <GameContainer :selected-difficulty="selectedDifficulty" @show-menu="showMenuHandler" />
    </template>
  </template>
</template>