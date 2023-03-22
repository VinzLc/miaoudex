
<script setup lang="ts">
import type { PokemonLong, PokemonShort } from '@/services';
import { ref, type PropType } from 'vue';


export interface Pokemon extends PokemonShort, PokemonLong {};

const props = defineProps({
  pokemon: { type: Object as PropType<Pokemon> }
})

/** Image View Handler */

const viewBack = ref(false);

function switchView() {
  viewBack.value = !viewBack.value;
}

</script>

<template>
  <div 
    class="group p-3 flex flex-col my-1 w-full bg-primary-300 rounded shadow-lg shadow-secondary-800"
  >

    <!-- Pokemon Name -->
    <h3 
      class="
        z-20 
        -mb-3
        drop-shadow-lg 
        text-3xl text-center uppercase font-bold font-pokemon text-accent-600 group-hover:text-accent-800
        select-none
        transition-colors
      "
    >
      {{ props.pokemon?.name || 'Pokemon' }}
    </h3>
    <!-- Pokemon Image -->
    <div
    class="
        aspect-square object-cover
        rounded border border-secondary-500 
        bg-primary-200
      "
    >
      <img 
        :src="props.pokemon?.sprites?.[viewBack ? 'back_default' : 'front_default']" 
        :alt="props.pokemon?.name || 'Pokemon'"
        class="w-full h-full hover:scale-105 transition-transform drop-shadow hover:drop-shadow-lg cursor-pointer"
        @click="switchView"
      />
    </div>
    <!-- Description -->
    <div 
      class="
        mt-3 px-3
        flex flex-col gap-1 
        font-semibold uppercase text-sm 
      "
    >
      <div class="flex justify-between">
        <h5 class="text-secondary-700">Height: </h5>
        <p class="text-accent-600">
          {{ pokemon?.height?.toLocaleString() || 'Loading...' }}
        </p>
      </div>

      <div class="flex justify-between">
        <h5 class="text-secondary-700">Weight: </h5>
        <p class="text-accent-600">
          {{ pokemon?.weight?.toLocaleString() || 'Loading...' }}
        </p>
      </div>
    </div>
  </div>
</template>
