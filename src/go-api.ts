import { eq } from "drizzle-orm"
import ky from "ky"
import db, { Insert } from "./db"
import { langs, names, namesByLang, pokemon, types } from "./db/schema.ts"
import { MoveKind, Pokemon, PokemonMove, Type } from "./models/go-api.ts"
import Lang, { ByLang, getLangIndex } from "./models/Lang.ts"

function importLangs() {
  return db
    .insert(langs)
    .values(
      (Object.values(Lang) as Lang[]).map((l, index) => ({
        id: index,
        name: l,
      }))
    )
    .onConflictDoNothing()
}

async function importNames(raw: { names: ByLang }[]): Promise<number> {
  const [{ id: nameId }] = await db.insert(names).values({}).returning()
  await db.insert(namesByLang).values(
    raw
      .flatMap((v) => Object.entries(v.names))
      .map(([lang, data]) => ({
        nameId,
        langId: getLangIndex(lang as Lang),
        data,
      }))
  )
  return nameId
}
async function importTypes() {
  const raw = await ky
    .get("https://pokemon-go-api.github.io/pokemon-go-api/api/types.json")
    .json<Type[]>()

  const nameId = await importNames(raw)
  await db.insert(types).values(
    raw.map((_ty, index) => ({
      id: index,
      nameId: nameId,
    }))
  )
}
async function importPokemon() {
  const raw = await ky
    .get("https://pokemon-go-api.github.io/pokemon-go-api/api/pokedex.json")
    .json<Pokemon[]>()

  const nameId = await importNames(raw)
  const typeIds = await db
    .select({ id: types.id, name: namesByLang.name })
    .from(types)
    .innerJoin(types, eq(types.nameId, namesByLang.nameId))
    .where(eq(namesByLang.langId, getLangIndex(Lang.English)))
  const tyIds = Object.fromEntries(
    typeIds.map((row) => [
      `POKEMON_TYPE_${String(row.name).toUpperCase()}`,
      row.id,
    ])
  )
  const allMoves: Record<string, PokemonMove & { kind: MoveKind }> = {}
  const keyKinds: Partial<Record<keyof Pokemon, MoveKind>> = {
    quickMoves: MoveKind.Quick,
    cinematicMoves: MoveKind.Cinematic,
    eliteQuickMoves: MoveKind.EliteQuick,
    eliteCinematicMoves: MoveKind.EliteCinematic,
  }
  for (const pkm of raw) {
    for (const [movesKey, kind] of Object.entries(keyKinds)) {
      // @ts-ignore
      for (const move of pkm[movesKey] as PokemonMove[]) {
        allMoves[move.id] = { ...move, kind: kind }
      }
    }
  }
  await db.insert(pokemon).values(
    raw.map(
      (pkm) =>
        ({
          id: pkm.dexNr,
          nameId: nameId,
          generation: pkm.generation,
          primaryTypeId: tyIds[pkm.primaryType.type],
          secondaryTypeId: pkm.secondaryType
            ? tyIds[pkm.secondaryType.type]
            : undefined,
        }) satisfies Insert<"pokemon">
    )
  )
}
export async function importAll(): Promise<void> {
  importLangs()
  await importTypes()

  await importPokemon()
}
