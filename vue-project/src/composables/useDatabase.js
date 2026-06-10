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
  }

  // Table tickets
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

  // Table parametres
  db.run(`
    CREATE TABLE IF NOT EXISTS parametres (
      cle TEXT PRIMARY KEY,
      valeur TEXT
      )
    `)

  // Valeurs par defaut des couleurs
  db.run(`INSERT OR IGNORE INTO parametres (cle, valeur) VALUES ('couleur_new', '#ffffff')`)
  db.run(`INSERT OR IGNORE INTO parametres (cle, valeur) VALUES ('couleur_inprogress', '#ffffff')`)
  db.run(`INSERT OR IGNORE INTO parametres (cle, valeur) VALUES ('couleur_closed', '#ffffff')`)

  // Valeurs par defaut langues
  db.run(`INSERT OR IGNORE INTO parametres (cle, valeur) VALUES ('label_new', 'New')`)
  db.run(`INSERT OR IGNORE INTO parametres (cle, valeur) VALUES ('label_inprogress', 'In Progress')`)
  db.run(`INSERT OR IGNORE INTO parametres (cle, valeur) VALUES ('label_closed', 'Closed')`)


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