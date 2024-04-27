<script lang="ts" setup>
import { computed, toRefs } from 'vue';
import { CellNotes } from '../services/SudokuService.types';

const props = defineProps<{
  index: number,
  puzzleValue: string,
  inputValue: string,
  selectedNumber: string,
  notes: CellNotes,
  isValid: boolean
}>();

const { index, puzzleValue, inputValue, selectedNumber, notes, isValid } = toRefs(props);

const initial = computed((): boolean => puzzleValue.value !== '-');

const activeValue = computed(() => {
  return inputValue.value !== '-' ? inputValue.value : puzzleValue.value;
})

const visualValue = computed(() => {
  return activeValue.value.replace('-', '');
})

const highlighted = computed(() => {
  return selectedNumber.value === visualValue.value;
})
</script>

<template>
  <div class="cell" :class="{ 'initial': initial, 'highlighted': highlighted, 'error': !isValid }">
    <template v-if="visualValue.length">
      {{ visualValue }}
    </template>
    <template v-else>
      <div class="notes">
        <div v-for="nr in '123456789'" :key="`cell-${index}-note-${nr}`" class="notes__cell" :class="{'notes__cell': true, 'highlighted': notes[nr] && nr === selectedNumber}">
          {{ notes[nr] ? nr : '' }}
        </div>
      </div>
    </template>
  </div>
</template>