# MIR lexicon schema

## Core idea

Store three different layers explicitly:

- **Term**: the reusable surface form such as `log drum`, `heavy`, or `2-step`
- **Sense**: the genre-conditioned meaning of a term
- **Genre**: the genre or lineage context in which that sense applies

This avoids flattening genre language into a single global definition.

## Metadata carried by a sense

Each sense should support:

- **Texture**: a short timbral label such as `Woody`, `Airy`, or `Gritty`
- **Energy / intensity**: a human-authored 1–10 score
- **Primary affect**: valence + arousal + affect label
- **Evidence**: source anchor for the term usage
- **Notes**: optional curator comments and disambiguation details

## Recommended graph entities

- `Genre`
- `Term`
- `Sense`
- `Texture`
- `Affect`
- `Evidence`
- `AudioFeature`

## Recommended relationships

- `Term -> HAS_SENSE -> Sense`
- `Sense -> IN_GENRE -> Genre`
- `Sense -> HAS_TEXTURE -> Texture`
- `Sense -> HAS_AFFECT -> Affect`
- `Sense -> EVIDENCED_BY -> Evidence`
- `Sense -> CORRELATES_WITH -> AudioFeature`
- `Genre -> SUBGENRE_OF -> Genre`

## Why this shape

This structure supports:

- polysemy across genres
- human curation with explicit evidence
- later alignment with MIR features such as tempo, loudness, energy, or section data
- graph queries like “show all senses of `heavy` across bass music lineages”

## Example pattern

```cypher
MERGE (t:Term {surface:"heavy", kind:"universal"})
MERGE (g:Genre {name:"Dubstep"})
MERGE (s:Sense {gloss:"Dominant sub-bass with high-impact drops"})
MERGE (t)-[:HAS_SENSE]->(s)
MERGE (s)-[:IN_GENRE]->(g)
```

## Descriptor classes in the current handover

The source material distinguishes at least three practical classes:

- **technical descriptors** — production, instrumentation, rhythm, sound-design terms
- **experiential descriptors** — scene, critic, and listener language
- **universal descriptors** — reusable terms that shift meaning by genre

## Current working metadata rule

Texture / energy / affect should be treated as editable priors, not immutable truth. They are part of the curation layer and can later be refined against audio features or evaluation data.
