<script lang="ts" setup>
import { ref } from 'vue';

const emit = defineEmits(['selectNumber']);

defineProps(['input']);

const selectedNumber = ref("-");

const numberClick = (newVal: string) => {
  selectedNumber.value = selectedNumber.value === newVal ? '-' : newVal;
  emit('selectNumber', selectedNumber.value)
}
</script>

<template>
  <div class="number-picker">
    <div
        v-for="nr in '123456789'"
        :key="`number-picker-${nr}`"
        :class="{'number': true, 'active': selectedNumber === nr, 'completed': (input.split(nr).length-1) === 9}"
        @click="numberClick(nr)"
      >
      {{ nr }}
    </div>
  </div>
</template>