# Blinkered dictionary: Bulgarian

The Bulgarian word list, and the evidence for every word in it.

Built by [`blinkered-attestation`](https://github.com/blinkered/blinkered-attestation). The rule,
the evidence format and the reasoning live there; what lives here is Bulgarian.

**107,898 of 279,165 candidates proved (38.7%)**, across 19 independent
families, 18 of which a stranger could check by fetching.

## What is in this repository

```
sources.mjs        which collections attest Bulgarian, and why those
attestations/      the evidence: every candidate, what saw it, and where
words.txt          what survived, in Blinkered's own format
dropped.tsv        what did not, and how close it came
searched.tsv       the publisher harvest: per page, which candidates it held and how often
SATURATION.md      what each family was worth, measured from the evidence
COLLECTIONS.md     every collection read, and where to get it again
status.json        the numbers, whether this ships, and what the list is under
```

The evidence is a **directory** rather than one file because this language's runs past the fifty
megabytes GitHub warns at. Each shard is a complete, independently valid evidence file with its
own header and digest; `readEvidence` puts them back together and refuses a repository that
somehow holds both layouts. Nothing reads them by globbing.

`.cache/` holds the downloaded collections and is not tracked. Everything here is regenerable
with `pnpm build`.

## Where the words come from

Candidates come from Blinkered's Bulgarian list, which lives in
[`blinkered-attestation/candidates/bg`](https://github.com/blinkered/blinkered-attestation/tree/main/candidates/bg).
The dictionaries that built it are demoted to **proposing words worth looking up**. What earns a
word its place here is evidence that it occurs in the world: three independent collections, each
recorded with a locator somebody else can fetch.

`SATURATION.md` says what each family was worth. `COLLECTIONS.md` names every collection read and
where to get it again, which is what makes the downloads disposable.

## What is particular to Bulgarian

**No eBible translation.** The families are a Wikipedia, three Leipzig news packages (2017, 2020,
2022), Tatoeba, six Gutenberg texts, the Internet Archive's Bulgarian books, and a harvest of 5,153
pages from fourteen Bulgarian publishers.

**Russian is the script-mate to watch.** A Russian book would confirm every candidate the two
languages spell alike, and Bulgarian never writes Ы or Э. The Archive shelf was screened on that:
a book whose Russian-only letters outnumbered Bulgarian's Ъ and Щ, or which read as Ukrainian, was
removed. That took out 14 of 455 books, and none of them would have passed the legibility floor, so
here the floor was already doing the job. The list is `archive-bg/rejected.tsv` in the shared
cache.

In the shipped list, 14,362 words (13.3%) are also in Russian's list and 6,382 (5.9%) in
Macedonian's; the top of the list is ordinary shared Slavic vocabulary (ТОЙ, МНОГО, САМО) and
nothing reads as another language. Cyrillic keeps English out structurally.

**Where the ceiling is.** 38.7% of a 279,165-word list. The near-miss pile says what is missing
plainly: of 64,258 words one family short, **51,290 were seen by the Archive and the Wikipedia and
by nothing else**, literary and encyclopedic Bulgarian (АБАЖУР, АБАНОС) that the news does not
write. A second book collection, or a Common Crawl family, is the next step. FineWeb-2 was not
fetched because the shared disk never had fifteen gigabytes free. The Archive downloader was
stopped at 455 books for time, with 4,935 available.

Every letter of the Bulgarian alphabet spells some shipped word; the rarest is Ь, in 307.

## Rebuilding

```
pnpm install
pnpm build        # reads whatever collections are in .cache/raw, reuses the record for the rest
pnpm conform      # the list says only what the evidence supports
pnpm saturation   # recomputes the curve and status.json
```

A collection that is not on disk is skipped with a warning and its recorded testimony is reused,
so a rebuild after more books arrive is short rather than a re-read of everything.

## Before this ships

Nobody has blessed this list. `status.json` says `"ships": "pending"`, which means built and
conforming but not yet checked against Blinkered's usability floor or looked at on a board.
`COMMON_CUT` in `sources.mjs` is carried over from Blinkered's old calibration against a
differently sized list and has to be re-measured before this list reaches the game.

## Licensing

Three kinds of thing live here and they do not share terms. The distinction is the project: a
licence that claimed more than we can support would undo the argument the evidence is here to
make. [NOTICE](NOTICE) is the authority; this is the summary.

| | terms | what |
| --- | --- | --- |
| **Code and docs** | [Apache-2.0](LICENSE) | `build.mjs`, `sources.mjs`, `harvest.mjs`, `conform.mjs`, `saturation.mjs`, and the Markdown |
| **The list and its evidence** | [CC0-1.0](https://creativecommons.org/publicdomain/zero/1.0/) | `words.txt`, the evidence, `status.json`, `SATURATION.md`, `COLLECTIONS.md`, `searched.tsv` |
| **The words we could not prove** | `LGPL-2.1-or-later` | `dropped.tsv`, which is **not ours to license** |

**Why the list is CC0.** A word ships because three independent collections of text were found to
contain it. The record of which collections, and where in them, is a statement of fact about those
texts rather than a copy of them, and nothing a licence governs was taken from the dictionary that
proposed the candidates.

**Why `dropped.tsv` is not.** It is the candidates that failed, and a candidate that failed is a
word we have nothing to say about except that somebody's dictionary proposed it. That makes the
file a subset of that dictionary and it carries that dictionary's terms: here `LGPL-2.1-or-later`.
