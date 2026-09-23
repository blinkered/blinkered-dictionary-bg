/**
 * The collections that attest Bulgarian, and where each comes from.
 *
 * Bulgarian has a 279,165-word candidate list. Bulgarian has almost no noun cases but a
 * postposed article and a rich verb, so the list is heavy with forms like ГРАДЪТ, ГРАДА and
 * ПИСАХМЕ that only a large corpus reaches. Expect the small families to be the ceiling.
 *
 * Bulgarian has no eBible translation. Its families are a Wikipedia, Leipzig's news, Tatoeba,
 * six Gutenberg texts and the Internet Archive's Bulgarian books. Russian is the script-mate to
 * watch: a Russian book on the Archive shelf would confirm every candidate the two languages
 * spell alike, so the shelf was screened for Ы and Э, which Bulgarian never writes.
 *
 * Every URL here was probed before it was written down. A collection that 404s does not fail
 * loudly; the build skips it with a warning and reports a healthy number over fewer families.
 */
import { createReadStream, existsSync, readFileSync, readdirSync } from 'node:fs'
import { createInterface } from 'node:readline'
import {
  fileDocuments,
  gutenbergBody,
  harvestDocuments,
  leipzigLocators,
  leipzigSentences,
  tatoebaDocuments,
  wikiDocuments,
} from '@blinkered/attestation'

export const LANGUAGE = 'bg'

const CACHE = new URL('.cache/raw/', import.meta.url).pathname

/** A Leipzig package, with its sentence-to-URL index resolved up front. */
function leipzig(pkg) {
  const base = `${CACHE}${pkg}/${pkg}`
  const locators = leipzigLocators(
    readFileSync(`${base}-inv_so.txt`, 'utf8'),
    readFileSync(`${base}-sources.txt`, 'utf8'),
  )
  const lines = createInterface({
    input: createReadStream(`${base}-sentences.txt`),
    crlfDelay: Infinity,
  })
  return leipzigSentences(lines, locators)
}

// News, from three different years. The Leipzig Wikipedia packages are deliberately absent:
// they are Wikipedia text wearing a Leipzig label, so including one would corroborate `wiki:bg`
// while looking like another family.
const LEIPZIG = ['bul_news_2022_1M', 'bul_news_2020_1M', 'bul_newscrawl_2017_1M']

const ALL = [
  {
    id: 'wiki:bg',
    what: 'Bulgarian Wikipedia; modern encyclopedic prose',
    needs: `${CACHE}bgwiki.xml.bz2`,
    documents: () => wikiDocuments(`${CACHE}bgwiki.xml.bz2`),
  },
  {
    id: 'wikisource:bg',
    what: 'Bulgarian Wikisource; same Wikimedia family, so it corroborates rather than counts',
    needs: `${CACHE}bgwikisource.xml.bz2`,
    documents: () => wikiDocuments(`${CACHE}bgwikisource.xml.bz2`),
  },
  ...LEIPZIG.map((pkg) => ({
    id: `lz:${pkg}`,
    from: `https://downloads.wortschatz-leipzig.de/corpora/${pkg}.tar.gz`,
    what: `Leipzig ${pkg}; news and web, cited by the page each sentence came from`,
    needs: `${CACHE}${pkg}`,
    documents: () => leipzig(pkg),
  })),
  {
    id: 'tat',
    from: 'https://downloads.tatoeba.org/exports/per_language/bul/bul_sentences.tsv.bz2',
    what: 'Tatoeba Bulgarian; contemporary and conversational',
    needs: `${CACHE}bul_sentences.tsv`,
    documents: () => tatoebaDocuments(`${CACHE}bul_sentences.tsv`),
  },
  {
    id: 'gut',
    from: 'https://www.gutenberg.org/cache/epub/feeds/pg_catalog.csv',
    what: 'Project Gutenberg Bulgarian, 6 texts',
    needs: `${CACHE}gutenberg-bg`,
    documents: () => {
      const dir = `${CACHE}gutenberg-bg`
      const books = readdirSync(dir)
        .filter((file) => file.endsWith('.txt'))
        .map((file) => ({ locator: file.replace('.txt', ''), path: `${dir}/${file}` }))
      return fileDocuments(books, async (path) => gutenbergBody(readFileSync(path, 'utf8')))
    },
  },
  {
    id: 'ia',
    // Scanned books are OCR, and OCR fails in a way that looks like text. Clean Gutenberg scores
    // a median 52% known words and never below 36%; the worst Archive scans score 1%. Below this
    // floor a book is not legible enough to attest anything.
    legible: 0.35,
    what: 'Internet Archive Bulgarian books; literature, and the register a newspaper never reaches',
    needs: `${CACHE}archive-bg`,
    from: 'https://archive.org/search?query=mediatype%3Atexts+AND+%28language%3A%22Bulgarian%22+OR+language%3Abul%29',
    documents: () => {
      const dir = `${CACHE}archive-bg`
      // A locator names the text, not the item: the catalogue page holds no word of the book.
      const named = new Map(
        readFileSync(`${dir}/files.tsv`, 'utf8')
          .split('\n')
          .filter(Boolean)
          .map((line) => line.split('\t')),
      )
      const books = readdirSync(dir)
        .filter((file) => file.endsWith('.txt'))
        .map((file) => file.replace('.txt', ''))
        .filter((id) => named.has(id))
        // Percent-encoded: two thirds of Archive filenames contain spaces, and the evidence
        // format spends spaces as separators.
        .map((id) => ({
          locator: `${id}/${encodeURIComponent(named.get(id))}`,
          path: `${dir}/${id}.txt`,
        }))
      return fileDocuments(books, async (path) => readFileSync(path, 'utf8'))
    },
  },
]

export const SOURCES = ALL.filter((source) => {
  if (source.needs === undefined || existsSync(source.needs)) return true
  process.stderr.write(`  (skipping ${source.id}: ${source.needs} is not in .cache/raw)\n`)
  return false
})

/**
 * Bulgarian publishers, for the harvest.
 *
 * Chosen because they publish in Bulgarian rather than because they are large. A harvester reads
 * whatever it fetches and has no idea what language it is in, so a domain that publishes mostly
 * in another language would attest that language's words against these candidates.
 */
export const DOMAINS = [
  'bnr.bg', 'mediapool.bg', 'segabg.com', '24chasa.bg', 'nova.bg',
]

export const HARVEST = existsSync(new URL('searched.tsv', import.meta.url).pathname)
  ? () => harvestDocuments(new URL('searched.tsv', import.meta.url).pathname)
  : undefined

/** Carried over from Blinkered's calibration; must be re-measured before anything ships. */
export const COMMON_CUT = 17000
