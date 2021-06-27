<template>
  <button type="button" class="action-item" @click="onClick(command)">{{text}}</button>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: 'ActionItem',

  props: {
    command: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },

  methods: {
    onClick(action) {
      this.$emit('action', {action: action})
    }
  }
});
</script>

<style lang="scss" scoped>
.action-item {
  font-size: 1rem;
}
</style>