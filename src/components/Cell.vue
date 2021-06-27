<template>
  <div
      :id="cell.id"
      class="cell"
      @click="isClicked">
    {{ cell.value > 0 ? cell.value : '' }}
  </div>
</template>

<script lang="ts">
export default {
  name: 'Cell',
  props: [
    'cell',
  ],
  methods: {
    isClicked() {
      console.log('clicked', this.cell);
      // this.$emit('action', {action: 'enterDigit', cell: this.cell});
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

  &.disabled {
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