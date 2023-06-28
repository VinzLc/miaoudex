import axios from '@/plugins/axios';

axios.defaults.baseURL = 'https://pokeapi.co/api/v2';
export default {
  getList(params: PokemonGetListParams = {}) {
    return axios.get<PokemonGetList>('/pokemon', { params });
  },

  getItem(id: number) {
    return axios.get<PokemonLong>(`/pokemon/${id}`);
  }
}

/** TYPE DEFINITIONS */

interface PokemonGetList{
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonShort[],
}

export interface Pokemon extends PokemonShort, PokemonLong {}
export interface PokemonGetListParams {
  limit?: number;
  offset?: number;
}

export interface PokemonShort {
  name?: string;
  url?: string;
}

export interface PokemonLong {
  name?: string;
  id?: number;
  height?: number;
  weight?: number;
  sprites: {
    front_default?: string;
    back_default?: string;
    front_shiny?: string;
    back_shiny?: string;
  };
  types: PokemonType[];
  stats: PokemonStat[];
  moves: PokemonMove[];
  abilities: PokemonAbility[];
  held_items: PokemonItems[];
}


// Extra Types
export interface PokemonType  {
  slot: number;
  type: { 
    name: string; 
    url: string; 
  };
};

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  }
}

export interface PokemonMove {
  move: { name: string; url: string; };
  version_group_details: {
    level_learned_at: number;
  }[];
}

export interface PokemonAbility {
  ability: { name: string, url: string },
  is_hidden: boolean;
  slot: number;
}


export interface PokemonItems {
  item: { name: string, url: string },
}