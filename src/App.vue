<script lang="ts" setup>
import { Ref, onBeforeMount, ref, watch } from 'vue';
import * as localStorageService from './services/LocalStorageService';
import GameContainer from './components/GameContainer.vue'
import { Difficulty } from 'sudoku-gen/dist/types/difficulty.type';

const showMenu = ref(true);
const hasPreviousGame = ref(false);
const previousDifficulty = ref('');
const selectedDifficulty: Ref<Difficulty> = ref('easy');

onBeforeMount(() => {
  checkForPreviousGame();
  checkForPreviousDifficulty();
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
</script>

<template>
  <template v-if="showMenu">
    <div class="main-menu">
      <h1>Vuedoku</h1>
      <div class="main-menu__item">
        <!-- <input type="radio" id="easy" name="difficulty" value="easy" v-model="selectedDifficulty">
        <label for="easy">Easy</label><br>
        <input type="radio" id="medium" name="difficulty" value="medium" v-model="selectedDifficulty">
        <label for="medium">Medium</label><br>  
        <input type="radio" id="hard" name="difficulty" value="hard" v-model="selectedDifficulty">
        <label for="hard">Hard</label><br>
        <input type="radio" id="expert" name="difficulty" value="expert" v-model="selectedDifficulty">
        <label for="expert">Expert</label> -->
        <button @click="newGameHandler">New Game</button>
      </div>
      <div v-if="hasPreviousGame" class="main-menu__item">
        <button @click="continueHandler">Resume</button>
      </div>
    </div>
  </template>
  <template v-else>
    <GameContainer :selected-difficulty="selectedDifficulty" @show-menu="showMenuHandler" />
  </template>
</template>