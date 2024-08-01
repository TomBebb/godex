import { relations } from "drizzle-orm"
import {
  index,
  int,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core"
import { MoveKind } from "../models/go-api.ts"

export const langs = sqliteTable("langs", {
  id: int("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
})

export const names = sqliteTable("names", {
  id: int("id").primaryKey(),
})

export const namesRelations = relations(names, ({ many }) => ({
  namesByLang: many(namesByLang),
}))
export const namesByLang = sqliteTable(
  "name_langs",
  {
    nameId: int("name_id"),
    langId: int("lang_id"),
    name: text("name"),
  },
  (tbl) => ({
    nameIdx: index("name_idx").on(tbl.nameId),
    primary: primaryKey({ columns: [tbl.langId, tbl.nameId] }),
  })
)
export const namesByLangRelations = relations(namesByLang, ({ one }) => ({
  name: one(names),
  lang: one(langs),
}))
export const types = sqliteTable("types", {
  id: int("id").primaryKey({ autoIncrement: true }),
  nameId: int("name_id").unique().notNull(),
})
export const typeRelations = relations(types, ({ many }) => ({
  names: many(langs),
}))

export const buffs = sqliteTable("buffs", {
  id: int("id").primaryKey({ autoIncrement: true }),
  activationChance: int("activation_chance").notNull(),
  attackerAttackStatsChange: int("attacker_stats_stats_change"),
  attackerDefenseStatsChange: int("attacker_stats_stats_change"),
  targetAttackStatsChange: int("attacker_stats_stats_change"),
  targetDefenseStatsChange: int("attacker_stats_stats_change"),
})

export const typeDamage = sqliteTable(
  "type_damage",
  {
    typeId: int("type_id").notNull(),
    otherTypeId: int("other_type_id").notNull(),
  },
  (tbl) => ({
    primary: primaryKey({ columns: [tbl.typeId, tbl.otherTypeId] }),
  })
)

export const pokemon = sqliteTable("pokemon", {
  id: int("id").primaryKey({ autoIncrement: true }),
  nameId: int("name_id").unique().notNull(),
  generation: int("generation").notNull(),
  primaryTypeId: int("primary_type_id").notNull(),
  secondaryTypeId: int("secondary_type_id"),
})
export const pokemonRelations = relations(pokemon, ({ one, many }) => ({
  primaryType: one(types),
  secondaryType: one(types),
  names: many(langs),
  moves: many(pokemonMoves),
}))

export const pokemonMoves = sqliteTable(
  "pokemon_moves",
  {
    pokemonId: int("pokemon_id"),
    moveId: text("move_id"),
  },
  (c) => ({ primary: primaryKey({ columns: [c.pokemonId, c.moveId] }) })
)
export const moves = sqliteTable("moves", {
  id: text("id").primaryKey(),
  power: int("power").notNull(),
  energy: int("energy").notNull(),
  durationMs: int("duration_ms").notNull(),
  nameId: int("name_id").notNull(),
  combatPower: int("combat_power").notNull(),
  combatEnergy: int("combat_energy").notNull(),
  combatTurns: int("combat_turns").notNull(),
  kind: int("kind").$type<MoveKind>().notNull(),
})
