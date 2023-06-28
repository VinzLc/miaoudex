
<script setup lang="ts">
import type { PokemonLong, PokemonShort } from '@/services';
import { computed } from 'vue';
import { ref, type PropType } from 'vue';
import AppToggle from './AppToggle.vue';


export interface Pokemon extends PokemonShort, PokemonLong {};

const props = defineProps({
  pokemon: { type: Object as PropType<Pokemon> }
})

const emits = defineEmits(['viewPokedex'])

/** Image View Handler */

const viewBack = ref(false);
const isShiny = ref(false);

function switchView() {
  viewBack.value = !viewBack.value;
}

const imageView = computed(()=>{
  let viewType: 'back' | 'front' = viewBack.value ? 'back' : 'front';
  let pokeType: 'shiny' | 'default' = isShiny.value ? 'shiny' : 'default';
  
  return props.pokemon?.sprites?.[`${viewType}_${pokeType}`]
})

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
      relative
      aspect-square object-cover
      rounded border border-secondary-500 
      bg-primary-200
      "
    >
      <img 
        :src="imageView" 
        :alt="props.pokemon?.name || 'Pokemon'"
        class="w-full h-full hover:scale-105 transition-transform drop-shadow hover:drop-shadow-lg cursor-pointer"
        @click="switchView"
      />

      <AppToggle 
        v-model="isShiny" 
        class="absolute bottom-1 left-2"
        label="Shiny"
      >
      </AppToggle>

      <button
        class="
          px-4
          pt-1
          absolute bottom-1 right-2
          text-xs text-white font-pixel
          rounded-full 
          bg-accent-500 hover:bg-accent-400
          shadow
          opacity-0 group-hover:opacity-100
          transition-all
        "
        @click="emits('viewPokedex')"
      >
        View in Pokedex
      </button>
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
