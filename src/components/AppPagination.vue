<script setup lang="ts">
import AppButton from './AppButton.vue';

const props = defineProps({
  modelValue: { type: Number, default: 1 },
  pages: { type: Number, default: 1 }
})

const emits = defineEmits(['update:modelValue'])

function updatePage(page: number) {
  emits('update:modelValue', page);
} 

</script>

<template>
  <div class="flex gap-2">
    <!-- Previous Button -->
    <AppButton
      :disabled="modelValue === 1"
      @click="updatePage(props.modelValue - 1)"
    >
      {{ '<' }}
    </AppButton>
    <!-- Page Buttons -->
    <AppButton
      v-for="page in props.pages"
      :key="page"
      :disabled="page === modelValue" 
      @click="updatePage(page)"
    >
     {{  page  }}
    </AppButton>
    <!-- Next Button -->
    <AppButton
      :disabled="modelValue === props.pages"
      @click="updatePage(props.modelValue + 1)"
    >
      {{ '>' }}
    </AppButton>
  </div>
</template>
