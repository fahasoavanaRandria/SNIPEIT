import initSqlJs from 'sql.js/dist/sql-asm.js'

let db = null

export async function getDatabase() {
  if (db) return db

  const SQL = await initSqlJs()

  const sauvegarde = localStorage.getItem('tickets_db')
  if (sauvegarde) {
    const buffer = Uint8Array.from(JSON.parse(sauvegarde))
    db = new SQL.Database(buffer)
  } else {
    db = new SQL.Database()
    db.run(`
      CREATE TABLE IF NOT EXISTS tickets (
        id INTEGER PRIMARY KEY,
        date TEXT,
        heure TEXT,
        titre TEXT,
        description TEXT,
        status TEXT,
        priority TEXT,
        items TEXT
      )
    `)
  }

  return db
}

export function sauvegarderDatabase(db) {
  const data = db.export()
  localStorage.setItem('tickets_db', JSON.stringify(Array.from(data)))
}

export function reinitialiserDatabase() {
  localStorage.removeItem('tickets_db')
  db = null
}