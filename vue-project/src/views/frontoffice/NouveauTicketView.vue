<template>
  <div class="nouveau-ticket">
    <h1>Nouveau ticket</h1>

    <div class="formulaire">

      <div class="champ">
        <label>Titre</label>
        <input v-model="ticket.titre" type="text" placeholder="Titre du ticket" />
      </div>

      <div class="champ">
        <label>Description</label>
        <textarea v-model="ticket.description" placeholder="Description du probleme" rows="4"></textarea>
      </div>

      <div class="champ">
        <label>Priorite</label>
        <select v-model="ticket.priority">
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      <div class="champ">
        <label>Status</label>
        <select v-model="ticket.status">
          <option value="New">New</option>
          <option value="In Progress">In Progress</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      <div class="champ">
        <label>Elements associes</label>
        <div v-if="chargementAssets" class="chargement">Chargement des elements...</div>
        <div v-else class="liste-elements">
          <div v-for="asset in assets" :key="asset.id" class="element-item">
            <input
              type="checkbox"
              :id="'asset-' + asset.id"
              :value="asset.asset_tag"
              v-model="ticket.items"
            />
            <label :for="'asset-' + asset.id">
              {{ asset.asset_tag }} — {{ asset.name }}
            </label>
          </div>
          <p v-if="assets.length === 0">Aucun element disponible</p>
        </div>
      </div>

      <div class="champ">
        <button @click="creerTicket" :disabled="chargement">
          {{ chargement ? 'Creation en cours...' : 'Creer le ticket' }}
        </button>
      </div>

    </div>

    <div v-if="message" class="message">{{ message }}</div>
    <div v-if="erreur" class="erreur">{{ erreur }}</div>
  </div>
</template>

<script>
import api from '../../composables/useSnipitApi.js'
import { getDatabase, sauvegarderDatabase } from '../../composables/useDatabase.js'

export default {
  name: 'NouveauTicketView',
  data() {
    return {
      ticket: {
        titre: '',
        description: '',
        priority: 'Medium',
        status: 'New',
        items: []
      },
      assets: [],
      chargementAssets: false,
      chargement: false,
      message: '',
      erreur: ''
    }
  },
  async mounted() {
    await this.chargerAssets()
  },
  methods: {
    async chargerAssets() {
      this.chargementAssets = true
      try {
        const res = await api.get('/hardware?limit=50')
        this.assets = res.data?.rows || []
      } catch (err) {
        this.erreur = 'Erreur chargement elements : ' + err.message
      } finally {
        this.chargementAssets = false
      }
    },

    async creerTicket() {
      if (!this.ticket.titre) {
        this.erreur = 'Le titre est obligatoire'
        return
      }

      this.chargement = true
      this.message = ''
      this.erreur = ''

      try {
        const db = await getDatabase()

        // Recuperer le dernier ID
        const resId = db.exec('SELECT MAX(id) FROM tickets')
        const dernierID = resId[0]?.values[0][0] || 0
        const nouvelID = dernierID + 1

        // Date et heure actuelles
        const maintenant = new Date()
        const date = maintenant.toLocaleDateString('fr-FR')
        const heure = maintenant.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

        db.run(
          'INSERT INTO tickets (id, date, heure, titre, description, status, priority, items) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [
            nouvelID,
            date,
            heure,
            this.ticket.titre,
            this.ticket.description,
            this.ticket.status,
            this.ticket.priority,
            JSON.stringify(this.ticket.items)
          ]
        )

        sauvegarderDatabase(db)

        this.message = `Ticket #${nouvelID} cree avec succes !`
        this.ticket = {
          titre: '',
          description: '',
          priority: 'Medium',
          status: 'New',
          items: []
        }

      } catch (err) {
        this.erreur = 'Erreur creation ticket : ' + err.message
      } finally {
        this.chargement = false
      }
    }
  }
}
</script>

<style scoped>
.nouveau-ticket { padding: 40px; }

h1 { font-size: 24px; margin-bottom: 24px; }

.formulaire {
  border: 1px solid #000000;
  padding: 32px;
  max-width: 600px;
}

.champ {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.champ label {
  font-size: 13px;
  font-weight: bold;
  margin-bottom: 6px;
}

input[type="text"],
textarea,
select {
  padding: 10px;
  border: 1px solid #000000;
  font-size: 14px;
  outline: none;
  background-color: #ffffff;
}

input[type="text"]:focus,
textarea:focus,
select:focus {
  border-width: 2px;
}

.liste-elements {
  border: 1px solid #000000;
  padding: 12px;
  max-height: 200px;
  overflow-y: auto;
}

.element-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
  border-bottom: 1px solid #eeeeee;
  font-size: 14px;
}

.element-item:last-child {
  border-bottom: none;
}

.element-item label {
  font-weight: normal;
  margin-bottom: 0;
  cursor: pointer;
}

button {
  padding: 10px 20px;
  background-color: #000000;
  color: #ffffff;
  border: none;
  font-size: 14px;
  cursor: pointer;
}

button:disabled { background-color: #888888; cursor: not-allowed; }
button:hover:not(:disabled) { background-color: #333333; }

.message {
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #000000;
  font-size: 14px;
}

.erreur {
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #000000;
  font-size: 14px;
  font-weight: bold;
}

.chargement { font-size: 14px; color: #555555; }
</style>