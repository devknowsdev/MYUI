# MIR handover

This folder is the canonical home for MIR handover material in this repo.

## Read in this order

1. [Lexicon schema](./lexicon-schema.md)
2. [Import / export](./import-export.md)
3. [Open questions](./open-questions.md)

## Purpose

The current MIR work is a hierarchical lexicon of musical language for use in Music Information Retrieval systems and graph storage.

The goal is to store musical language as reusable concepts while still supporting genre-specific meanings. Example: a term such as `heavy` can remain one reusable surface form while branching into different genre-conditioned senses.

## Scope

The current handover covers:

- a reusable term / sense / genre model
- texture, energy, and affect metadata
- cross-genre descriptor handling
- graph-oriented storage design
- import / export shapes for downstream systems
- a verification workflow intended to reduce fabricated terminology

## Genre priority in the current handover

The working genre bridge in the source material is:

- Boom bap
- Trap
- Drill
- Grime
- UK garage / 2-step
- Dubstep
- Gqom
- Amapiano

## Source note

These docs are built from the MIR handover material already shared in chat and converted here into stable repo docs for easier navigation and review.

## Suggested working rule

Whenever MIR terminology or schema changes:

1. update the relevant doc in `docs/mir/`
2. update this file if the reading order changes
3. link any new canonical doc from `docs/INDEX.md`
