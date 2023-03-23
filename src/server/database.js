import pool from './pool.js'

export async function getAllTitles() {
  const { rows } = await pool.query('SELECT book_title AS book FROM books')
  return rows.map((row) => row.book)
}

export async function getTranslations(title) {
  const { rows } = await pool.query(
    `
SELECT translator_name AS translator
FROM translator
INNER JOIN books
ON books.translator_fk = translator.id
WHERE books.book_title = $1
`,
    [decodeURI(title)]
  )
  return rows.map((row) => row.translator)
}

export async function getBookInfo(title, translator) {
  const { rows } = await pool.query(
    `
SELECT book_title AS "bookTitle", sub_title AS "subTitle", pub_date AS "pubDate", translated_date AS "translatedDate", translator_name AS "translatorName"
FROM books
INNER JOIN translator ON translator.id = books.translator_fk
WHERE book_title = $1 AND translator_name = $2
`,
    [decodeURI(title), decodeURI(translator)]
  )
  return rows
}

export async function getChapterList(title, translator) {
  const { rows } = await pool.query(
    `
SELECT chapter_number AS "chapterNumber", chapter_name AS "chapterName"
FROM chapters
INNER JOIN books ON books.id = chapters.book_fk
INNER JOIN translator ON translator.id = books.translator_fk
WHERE book_title = $1 and translator_name = $2
`,
    [decodeURI(title), decodeURI(translator)]
  )
  return rows
}

export async function getChapterParagraphs(title, translator, chapter) {
  const { rows } = await pool.query(
    `
SELECT chapter_number AS "chapterNumber", paragraph_number AS "paragraphNumber", paragraph_text AS "paragraphText", see_also AS "seeAlso"
FROM books
INNER JOIN translator ON translator.id = books.translator_fk
INNER JOIN chapters ON chapters.book_fk = books.id
INNER JOIN paragraphs ON paragraphs.chapter_fk = chapters.id
WHERE book_title = $1 AND translator_name = $2 AND chapter_number = $3
ORDER BY SUBSTRING(paragraph_number FROM '([0-9]+)')::BIGINT ASC, paragraph_number

`,
    [decodeURI(title), decodeURI(translator), chapter]
  )
  return rows
}

export async function getFootnotes(title, translator, chapter, paragraph) {
  const { rows } = await pool.query(
    `
SELECT footnote_text AS footnote
FROM books
INNER JOIN translator ON translator.id = books.translator_fk
INNER JOIN chapters ON chapters.book_fk = books.id
INNER JOIN paragraphs ON paragraphs.chapter_fk = chapters.id
INNER JOIN footnotes ON footnotes.paragraph_fk = paragraphs.id 
WHERE book_title = $1 AND translator_name = $2 AND chapter_number = $3 AND paragraph_number = $4
`,
    [decodeURI(title), decodeURI(translator), chapter, paragraph]
  )
  return rows.map((row) => row.footnote)
}
