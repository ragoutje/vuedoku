<template>
  <div
      class="cell"
      :class="{ 'initial': initial, 'highlighted': selectedNumber === visualValue}"
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
    }
  },

  methods: {
    handleClick() {
      this.$emit('clicked', this.index);
    }
  }
}
</script>

<style lang="scss" scoped>
.cell {
  &:before {
    content: "";
    display: inline-block;
    height: 100%;
    vertical-align: middle;
    font-size: 0;
    letter-spacing: 0;
    line-height: 0;
  }

  background-color: white;
  font-family: 'Roboto', sans-serif;
  font-size: 2.5vh;
  font-weight: 300;
  text-align: center;
  vertical-align: middle;
  user-select: none;

  &.initial {
    font-weight: 800;
  }

  &.highlighted {
    background-color: #fcffc8!important;
  }

  @media (orientation: portrait) {
    font-size: 2.5vw;
  }
}
</style>