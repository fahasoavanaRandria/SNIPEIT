<template>
  <div class="import-page">
    <h1>Import des elements</h1>
    <p class="description">Importez le fichier CSV Feuil 1 pour envoyer les elements dans SnipIT.</p>

    <div class="upload-zone">
      <label for="fichier">Choisir le fichier CSV</label>
      <input id="fichier" type="file" accept=".csv" @change="chargerFichier" />
    </div>

    <div v-if="rows.length > 0" class="apercu">
      <p>{{ rows.length }} lignes detectees</p>
      <table class="csv-table">
        <thead>
          <tr>
            <th>asset_tag</th>
            <th>name</th>
            <th>company</th>
            <th>category</th>
            <th>manufacturer</th>
            <th>model</th>
            <th>department</th>
            <th>status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in rows" :key="i">
            <td>{{ row.asset_tag }}</td>
            <td>{{ row.name }}</td>
            <td>{{ row.company }}</td>
            <td>{{ row.category }}</td>
            <td>{{ row.manufacturer }}</td>
            <td>{{ row.model }}</td>
            <td>{{ row.department }}</td>
            <td>{{ row.status }}</td>
          </tr>
        </tbody>
      </table>

      <button @click="importer" :disabled="chargement">
        {{ chargement ? 'Importation en cours...' : 'Lancer l importation' }}
      </button>
    </div>

    <div v-if="logs.length > 0" class="logs">
      <h2>Progression</h2>
      <div v-for="(log, i) in logs" :key="i" :class="['log-ligne', log.type]">
        {{ log.message }}
      </div>
    </div>

    <div v-if="termine" class="termine">
      Importation terminee : {{ succes }} reussis, {{ echecs }} echecs.
    </div>

    <hr style="margin: 40px 0; border: 1px solid #000000;"/>

    
    <h1>Import des tickets</h1>
    <p class="description">Importer votre fichier CSV pour les tickets</p>

    <div class="upload-zone">
        <label for="fichierTickets">Choisir le fichier CSV tickets</label>
        <input id="fichierTickets" type="file" accept=".csv" @change="chargerFichierTickets" />
    </div>

    <div v-if="rowsTickets.length > 0" class="apercu">
        <p>{{ rowsTickets.length }} tickets detectes</p>
        <table class="csv-table">
            <thead>
                <tr>
                    <th>Numero</th>
                    <th>Date</th>
                    <th>Titre</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Items</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(row, i) in rowsTickets" :key="i">
                    <td>{{ row.Num_Ticket }}</td>
                    <td>{{ row.Date }}</td>
                    <td>{{ row.Titre }}</td>
                    <td>{{ row.Description }}</td>
                    <td>{{ row.Status }}</td>
                    <td>{{ row.Priority }}</td>
                    <td>{{ row.Items }}</td> 
                </tr>
            </tbody>
        </table>

        <button @click="importerTickets" :disabled="chargementTickets">
            {{ chargementTickets ? 'Importation en cours...' : 'Lancer l importation tickets' }}
        </button>

        <div v-if="logsTickets.length > 0" class="logs">
            <h2>Progression tickets</h2>
            <div v-for="(log, i) in logsTickets" :key="i" :class="['log-ligne', log.type]">
                {{ log.message }}
            </div>
        </div>

        <div v-if="termineTickets" class="termine">
            Importation tickets termine : {{ succesTickets }} reussis, {{ echecsTickets }} echecs.
        </div>
    </div>
  </div>
</template>

<script>
import Papa from 'papaparse'
import api from '../../composables/useSnipitApi.js'
import { getDatabase, sauvegarderDatabase } from '../../composables/useDatabase.js'
export default {
  name: 'ImportView',
  data() {
    return {
        //feuil 1
      rows: [],
      logs: [],
      chargement: false,
      termine: false,
      succes: 0,
      echecs: 0,

        //feuil 2
       rowsTickets: [],
       logsTickets: [],
       chargementTickets: false,
       termineTickets: false,
       succesTickets: 0,
       echecsTickets: 0
    }
  },
  methods: {
    chargerFichier(event) {
      const fichier = event.target.files[0]
      if (!fichier) return
      this.rows = []
      this.logs = []
      this.termine = false
      this.succes = 0
      this.echecs = 0
      Papa.parse(fichier, {
        header: true,
        skipEmptyLines: true,
        complete: (resultat) => {
          this.rows = resultat.data
        }
      })
    },

    async getOuCreer(endpoint, name, extraData = {}) {
      const res = await api.get(`/${endpoint}?search=${encodeURIComponent(name)}&limit=50`)
      const rows = res.data?.rows || []
      const trouve = rows.find(r => r.name?.toLowerCase() === name.toLowerCase())
      if (trouve) return trouve.id
      const creation = await api.post(`/${endpoint}`, { name, ...extraData })
      return creation.data?.payload?.id
    },

    async getOuCreerUser(firstName, lastName, username, email, departmentId) {
      const res = await api.get(`/users?search=${encodeURIComponent(username)}&limit=50`)
      const rows = res.data?.rows || []
      const trouve = rows.find(r => r.username === username)
      if (trouve) return trouve.id

      const creation = await api.post('/users', {
        first_name: firstName,
        last_name: lastName,
        username: username,
        email: email,
        password: 'Password1234!',
        password_confirmation: 'Password1234!',
        department_id: departmentId,
        activated: true
      })
      return creation.data?.payload?.id
    },

    convertirDate(date) {
      if (!date) return null
      const parties = date.split('/')
      if (parties.length !== 3) return null
      return `${parties[2]}-${parties[1]}-${parties[0]}`
    },

    async importerLigne(ligne) {
      // 1. Categorie
      const categoryId = await this.getOuCreer('categories', ligne.category, {
        category_type: 'asset'
      })

      // 2. Fabricant
      const manufacturerId = await this.getOuCreer('manufacturers', ligne.manufacturer)

      // 3. Modele
      const modelId = await this.getOuCreer('models', ligne.model, {
        category_id: categoryId,
        manufacturer_id: manufacturerId
      })

      // 4. Statut
      const statusId = await this.getOuCreer('statuslabels', ligne.status, {
        type: 'deployable'
      })

      // 5. Departement
      const departmentId = await this.getOuCreer('departments', ligne.department)

      // 6.Company
      const companyId = await this.getOuCreer('companies', ligne.company)

      // 7. Utilisateur
      const nomComplet = ligne.user.trim().split(' ')
      const firstName = nomComplet[0] || 'Inconnu'
      const lastName = nomComplet.slice(1).join(' ') || 'Inconnu'
      const username = ligne.email
        ? ligne.email.split('@')[0]
        : ligne.user.replace(' ', '.').toLowerCase()

      const userId = await this.getOuCreerUser(
        firstName,
        lastName,
        username,
        ligne.email,
        departmentId
      )

      // 8. Creer l'asset
      const assetRes = await api.post('/hardware', {
        name: ligne.name,
        asset_tag: ligne.asset_tag,
        serial: ligne.serial,
        model_id: modelId,
        status_id: statusId,
        purchase_date: this.convertirDate(ligne.purchase_date),
        purchase_cost: ligne.purchase_cost,
        company_id: companyId,
        department_id: departmentId
      })

      const assetId = assetRes.data?.payload?.id

      // 9. Checkout vers l'utilisateur
      if (assetId && userId) {
        await api.post(`/hardware/${assetId}/checkout`, {
          checkout_to_type: 'user',
          assigned_user: userId
        })
      }
    },

    async importer() {
      this.chargement = true
      this.logs = []
      this.succes = 0
      this.echecs = 0
      this.termine = false

      for (const ligne of this.rows) {
        try {
          await this.importerLigne(ligne)
          this.succes++
          this.logs.push({ type: 'ok', message: `OK : ${ligne.asset_tag} - ${ligne.name}` })
        } catch (err) {
          this.echecs++
          const detail = err.response?.data?.messages || err.message
          this.logs.push({ type: 'erreur', message: `ERREUR : ${ligne.asset_tag} - ${JSON.stringify(detail)}` })
        }
      }

      this.chargement = false
      this.termine = true
    },

    //TICKETS
    chargerFichierTickets(event) {
        const fichier = event.target.files[0]
        if (!fichier) return
        this.rowsTickets = []
        this.logsTickets = []
        this.termineTickets = false
        Papa.parse(fichier, {
            header: true,
            skipEmptyLines: true,
            complete: (resultat) => {
                this.rowsTickets = resultat.data
            }
        })
    },

    async importerTickets() {
        this.chargementTickets = true
        this.logsTickets = []
        this.succesTickets = 0
        this.echecsTickets = false
        this.termineTickets = false

        try {
            const db = await getDatabase()

            db.run('DELETE FROM tickets')

            for (const ligne of this.rowsTickets) {
                try {
                    db.run(
                        'INSERT INTO tickets (id, date, heure, titre, description, status, priority, items) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                        [
                            parseInt(ligne.Num_Ticket),
                            ligne.Date,
                            ligne.Heure,
                            ligne.Titre,
                            ligne.Description,
                            ligne.Status,
                            ligne.Priority,
                            ligne.Items

                        ]
                    )
                    this.succesTickets++
                    this.logsTickets.push({type: 'ok', message: `OK : Ticket #${ligne.Num_Ticket} - ${ligne.Titre}` })
                } catch (err) {
                    this.echecsTickets++
                    this.logsTickets.push({type: 'erreur', message: `ERREUR : Ticket #${ligne.Num_Ticket} - ${err.message}`})
                }
            }
            sauvegarderDatabase(db)
            this.termineTickets = true
        } catch (err) {
            this.logsTickets.push({type: 'erreur', message: `Erreur SQLite : ${err.message}`})
        } finally {
            this.chargementTickets = false
        }
    }
  }
}
</script>

<style scoped>
.import-page { padding: 40px; }
h1 { font-size: 24px; margin-bottom: 8px; }
.description { font-size: 14px; color: #555555; margin-bottom: 24px; }
.upload-zone {
  border: 1px solid #000000;
  padding: 20px;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: fit-content;
}
label { font-size: 13px; font-weight: bold; }
.apercu { margin-bottom: 24px; }
.apercu p { font-size: 14px; margin-bottom: 12px; }
.csv-table { width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px; }
.csv-table th { background-color: #000000; color: #ffffff; padding: 8px 12px; text-align: left; }
.csv-table td { padding: 7px 12px; border-bottom: 1px solid #dddddd; }
button { padding: 10px 20px; background-color: #000000; color: #ffffff; border: none; font-size: 14px; cursor: pointer; }
button:disabled { background-color: #888888; cursor: not-allowed; }
button:hover:not(:disabled) { background-color: #333333; }
.logs { border: 1px solid #000000; padding: 16px; margin-bottom: 24px; max-height: 300px; overflow-y: auto; }
h2 { font-size: 16px; margin-bottom: 12px; }
.log-ligne { font-size: 13px; padding: 4px 0; border-bottom: 1px solid #eeeeee; font-family: monospace; }
.log-ligne.erreur { font-weight: bold; }
.termine { border: 1px solid #000000; padding: 12px; font-size: 14px; font-weight: bold; }
</style>