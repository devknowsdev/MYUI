# MIR import / export

## Verification workflow

Recommended workflow for continuing this dataset:

1. curate a source library with manuals, scholarship, and high-quality journalism
2. extract term candidates with a short evidence span
3. classify each candidate as technical, experiential, or universal
4. split into separate senses when the meaning changes by genre
5. assign texture / energy / affect as editable priors
6. review and refine with human curation

## CSV shape

Suggested node CSVs:

- `terms.csv`
- `senses.csv`
- `genres.csv`
- `evidence.csv`

Suggested relationship CSVs:

- `term_has_sense.csv`
- `sense_in_genre.csv`
- `sense_evidenced_by.csv`

## Minimal node examples

```csv
term_id,surface,kind
T0001,log drum,technical
T0002,heavy,universal
```

```csv
sense_id,term_id,gloss,texture,energy_1_10,affect_valence,affect_arousal,affect_label
S0001,T0001,"Percussive bass instrument central to amapiano",Woody,8,+,High,Excitement
```

```csv
genre_id,name,parent_genre_id,bpm_min,bpm_max
G0001,Amapiano,G0009,110,115
```

```csv
evidence_id,url_or_ref,source_name,source_date
E0001,"Splice: What is amapiano music?","Splice",2025-03-01
```

## JSON shape

```json
{
  "term": {"id": "T0001", "surface": "log drum", "kind": "technical"},
  "senses": [
    {
      "id": "S0001",
      "genre": "Amapiano",
      "definition": "Percussive bass instrument central to amapiano.",
      "tags": {
        "texture": "Woody",
        "energy_1_10": 8,
        "affect": {"valence": "+", "arousal": "High", "label": "Excitement"}
      }
    }
  ]
}
```

## Practical handover note

The point of these formats is not just storage. They make it possible to keep:

- term identity stable
- sense distinctions explicit
- evidence attached
- graph import straightforward
- downstream document ingestion possible
