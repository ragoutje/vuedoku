<template>
  <div
      class="cell"
      :class="{ 'initial': initial, 'highlighted': highlighted}"
      @click="handleClick"
      >
    {{ visualValue }}
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
    }
  },

  methods: {
    handleClick() {
      this.$emit('clicked', this.index);
    }
  }
}
</script>