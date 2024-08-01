BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "names" (
	"id"	INTEGER NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "name_langs" (
	"name_id"	INTEGER NOT NULL,
	"lang_id"	INTEGER NOT NULL,
	"name"	TEXT,
	PRIMARY KEY("name_id","lang_id")
);
CREATE TABLE IF NOT EXISTS "langs" (
	"id"	INTEGER NOT NULL,
	"name"	TEXT NOT NULL UNIQUE,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "pokemon" (
	"id"	INTEGER NOT NULL,
	"name_id"	INTEGER NOT NULL UNIQUE,
	"generation"	INTEGER NOT NULL,
	"primary_type_id"	INTEGER NOT NULL,
	"secondary_type_id"	INTEGER,
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "types" (
	"id"	INTEGER NOT NULL,
	"name_id"	INTEGER NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "buffs" (
	"id"	INTEGER NOT NULL,
	"activation_chance"	INTEGER NOT NULL,
	"attacker_attack_stats_change"	INTEGER,
	"attacker_defense_stats_change"	INTEGER,
	"target_attack_stats_change"	INTEGER,
	"target_defense_stats_change"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "type_damage" (
	"type_id"	INTEGER NOT NULL,
	"other_type_id"	INTEGER NOT NULL,
	"multiplier"	NUMERIC NOT NULL,
	PRIMARY KEY("type_id","other_type_id")
);
CREATE TABLE IF NOT EXISTS "moves" (
	"id"	TEXT NOT NULL,
	"power"	INTEGER NOT NULL,
	"energy"	INTEGER NOT NULL,
	"duration_ms"	INTEGER NOT NULL,
	"name_id"	BLOB NOT NULL,
	"combat_energy"	INTEGER NOT NULL,
	"combat_power"	INTEGER NOT NULL,
	"combat_turns"	INTEGER NOT NULL,
	"combat_buffs_id"	INTEGER,
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "pokemon_moves" (
	"pokemon_id"	INTEGER NOT NULL,
	"move_id"	TEXT NOT NULL,
	PRIMARY KEY("pokemon_id","move_id")
);
CREATE INDEX IF NOT EXISTS "name_idx" ON "name_langs" (
	"name"
);
COMMIT;
