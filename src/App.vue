<script setup lang="ts">
import { pokemon,  type Pokemon, type PokemonGetListParams } from '@/services';
import { ref, watch } from 'vue';
import PokeCard from '@/components/PokeCard.vue';
import AppButton from '@/components/AppButton.vue';
import AppPagination from '@/components/AppPagination.vue'
import type {ModelValue as NavModelVal} from './components/NavigationToggle.vue';
import axios from 'axios';
import PokedexView from './components/PokedexView.vue';

/** POKEMON FETCHING  */

const pokemons = ref<Pokemon[]>([]);
const pokemonLoading = ref(false)
const activePokeId = ref<number>(1);
const showPokedex = ref(false);

/**
 * Fetch lists of pokemons
 * @param params Parameter to pass on pokemon API
 * @param type increment: add value to the list / paginate: replace value by new items
 */
async function fetchPokemonList(params: PokemonGetListParams, type = 'increment') {
  pokemonLoading.value = true;
  let _newPokemons = (await pokemon.getList(params)).data
  let _pokemons = pokemons.value;
  if (type === 'increment' && params.offset !== 0) {
    _pokemons = [
      ..._pokemons,
      ..._newPokemons.results as Pokemon[],
    ]
  } else {
    _pokemons = _newPokemons.results as Pokemon[];
  }

  if (_pokemons.length > 150) {
    _pokemons.splice(150 - _pokemons.length)
  }

  pokemons.value = _pokemons

  for (let i = 0; i < pokemons.value.length; i++) {
    fetchPokemonDescription(i);
  }
  pokemonLoading.value = false;
}

/**
 * Fetch details of thee pokemon
 */
async function fetchPokemonDescription(index: number) {
  const _pokemon = pokemons.value[index];
  
  if (!_pokemon.url) return;

  let pokemonDetails = (await axios.get(_pokemon.url)).data;
  pokemons.value[index] = {
    ..._pokemon,
    ...pokemonDetails,
  };
}

/** NAVIGATION */

const navType = ref<NavModelVal>('increment');
const page = ref(1);

// Return to first page when changing navigation types
watch(navType, ()=>{ page.value = 1 })

// Refetch when page variable changes
watch(page, ()=>{
  const isIncrement = navType.value === 'increment';
  const isFirstPage = page.value === 1;
  const limit = isIncrement ? (isFirstPage ? 50 : 15) : 30;
  const offset1 = isIncrement ? 50 : 30;
  const offset2 = limit * (page.value - 2);
  const offset = isFirstPage ? 0 : offset1 + offset2; 
  fetchPokemonList({ offset, limit }, navType.value) 
}, { immediate: true });
</script>

<template>
  <div class="overflow-hidden min-h-screen h-screen w-full bg-secondary-600">
    <!-- Pokedec Card Viewer -->
    <div class="scrollbar h-full overflow-auto p-3 px-6">
      
      <div class="flex flex-col sm:flex-row gap-6 md:gap-1 justify-between items-center">
        <!-- Title -->
        <h1 class="mb-5 text-5xl text-primary-500">
          <span class="font-pokemon underline">MIAOU DEX</span>
        </h1>
        
        <!-- Navigation -->

      </div>
      

      <!-- List -->
      <div 
        class="
          mt-5 
          w-full 
          gap-16
          grid grid-cols-1
          lg: grid-cols-4
        "
      >
        <!-- Poke Card -->
        <PokeCard 
          v-for="(pokemon, index) in pokemons" 
          :key="`${pokemon.id}-${index}` "
          :index="index+1"
          :pokemon="pokemon"
          @viewPokedex="showPokedex = true, activePokeId = pokemon.id || 1"
        ></PokeCard>
      </div>

      <!-- Pagination -->
      <h3 v-if="pokemonLoading" class="text-primary-500 text-center">
          Loading...
      </h3>
        
      <div v-else class="flex justify-center">
        <AppPagination 
          v-if="navType === 'pagination'"
          v-model="page"
          :pages="5" 
        ></AppPagination>

        <AppButton
          v-else-if="navType === 'increment' && pokemons.length < 150" 
          @click="() => page += 1"
        >
          Load More
        </AppButton>

      </div>
      
      
    </div>
    <!-- Pokedex Viewer -->
    <PokedexView
      v-model:power-pokedex="showPokedex"
      v-model:pokemon-id="activePokeId"
    ></PokedexView>
    <!-- Intro -->
    <div 
      class="
        z-50
        fixed top-0 left-0 
        bg-secondary-900 
        h-full w-full 
        flex items-center justify-center
        animate-blurIn
      "
      >
        <div class="p-4 pb-6 bg-accent-600 border-2 border-primary-500">

          <h1 
            class="text-4xl font-pokemon text-primary-400 translate-y-1">
            MIAOU DEX
          </h1>
    
        </div>
      </div>
  </div>
</template>