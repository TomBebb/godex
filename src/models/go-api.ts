import { ByLang } from "./Lang.ts"

export interface PokemonType {
  // e.g. POKEMON_TYPE_GRASS
  type: string
  names: ByLang
}
export interface PokemonMove {
  // e.g. RAZOR_LEAF_FAST
  id: string
  power: number
  energy: number
  durationMs: number
  type: PokemonType
  names: ByLang
  combat: {
    energy: number
    power: number
    turns: number
  }
}
export type Nullable<T> = T | null
export interface PokemonSprites {
  image: string
  shinyImage: string
}
export interface PokemonAssetForm extends PokemonSprites {
  form: Nullable<string>
  costume: Nullable<string>
  isFemale: boolean
}
export interface Pokemon {
  id: string
  formId: string
  names: ByLang
  generation: number
  stats: {
    stamina: number
    attack: number
    defense: number
  }
  primaryType: PokemonType
  secondaryType?: PokemonType

  quickMoves: Record<string, PokemonMove>
  cinematicMoves: Record<string, PokemonMove>
  eliteQuickMoves: Record<string, PokemonMove>
  eliteCinematicMoves: Record<string, PokemonMove>
  assets: PokemonMove
  evolutions: {
    id: string
    formId: string
    candies: number
    item: null
    quests: []
  }[]
  assetForms: PokemonAssetForm[]
  regionForms: Record<string, Omit<Pokemon, "regionForms">>
  dexNr: number
}

export enum MoveKind {
  Quick,
  Cinematic,
  EliteQuick,
  EliteCinematic,
}

export interface Type {
  type: string
  names: ByLang
  doubleDamageFrom: string[]
  halfDamageFrom: string[]
  noDamageFrom: string[]
  weatherBoost: {
    id: string
    names: ByLang
    assetName: string
  }
}
