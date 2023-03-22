<script setup lang="ts">
import type { PropType } from 'vue';

const props = defineProps({
  modelValue: { 
    type: Boolean as PropType<boolean>, 
    required: true,
  },
  label: String as PropType<string>,
});

  const emit = defineEmits(['update:modelValue'])

  function updateModelValue() {    
    emit('update:modelValue', !props.modelValue);
  }
</script>

<template>
  <div 
    class="
      select-none
      cursor-pointer 
      flex justify-between items-center 
      transition-colors
    "
    @click="updateModelValue"
  >
    <h4
      class="transition-colors text-sm" 
      :class="{ 
        'text-secondary-600': !props.modelValue, 
        'text-primary-500': props.modelValue,
      }"
    >
      {{ label }}
    </h4>
    <!-- Toggle -->
    <div 
      class="relative mx-2 w-8 h-4 border border-secondary-500 rounded-full"
      >
      <div 
        class="absolute transition-[right] bg-primary-500 h-full aspect-square rounded-full"
        :class="props.modelValue ? 'right-0' : 'right-4'"
      ></div>
    </div>    
  </div>
</template>
