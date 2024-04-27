<template>
  <div class="cell" :class="{ 'initial': initial, 'highlighted': highlighted, 'error': !isValid }">
    <template v-if="visualValue.length">
      {{ visualValue }}
    </template>
    <template v-else>
      <div class="notes">
        <div v-for="nr in '123456789'" :key="`cell-${index}-note-${nr}`" class="notes__cell">
          {{ notes[nr] ? nr : '' }}
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
export default {
  name: 'Cell',

  props: [
    'index',
    'puzzleValue',
    'solutionValue',
    'inputValue',
    'selectedNumber',
    'notes',
    'isValid'
  ],

  computed: {
    initial() {
      return this.puzzleValue !== '-'
    },

    activeValue() {
      return this.inputValue !== '-' ? this.inputValue : this.puzzleValue;
    },

    visualValue() {
      return this.activeValue.replace('-', '')
    },

    highlighted() {
      return this.selectedNumber === this.visualValue
    },
  }
}
</script>