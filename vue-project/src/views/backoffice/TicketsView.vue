<template>
  <div class="tickets-page">
    <h1>Tickets</h1>

    <!-- Liste des tickets -->
    <div v-if="!ticketSelectionne">
      <table class="tableau">
        <thead>
          <tr>
            <th>Num</th>
            <th>Date</th>
            <th>Heure</th>
            <th>Titre</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ticket in tickets" :key="ticket.id">
            <td>{{ ticket.id }}</td>
            <td>{{ ticket.date }}</td>
            <td>{{ ticket.heure }}</td>
            <td>{{ ticket.titre }}</td>
            <td>{{ ticket.status }}</td>
            <td>{{ ticket.priority }}</td>
            <td>
              <button class="btn-voir" @click="voirFiche(ticket)">Voir</button>
            </td>
          </tr>
          <tr v-if="tickets.length === 0">
            <td colspan="7">Aucun ticket trouve</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Fiche detail -->
    <div v-else class="fiche">
      <button class="btn-retour" @click="ticketSelectionne = null">Retour a la liste</button>

      <h2>Ticket #{{ ticketSelectionne.id }}</h2>

      <div class="fiche-ligne">
        <span class="fiche-label">Titre</span>
        <span>{{ ticketSelectionne.titre }}</span>
      </div>

      <div class="fiche-ligne">
        <span class="fiche-label">Description</span>
        <span>{{ ticketSelectionne.description }}</span>
      </div>

      <div class="fiche-ligne">
        <span class="fiche-label">Date</span>
        <span>{{ ticketSelectionne.date }} a {{ ticketSelectionne.heure }}</span>
      </div>

      <div class="fiche-ligne">
        <span class="fiche-label">Status</span>
        <span>{{ ticketSelectionne.status }}</span>
      </div>

      <div class="fiche-ligne">
        <span class="fiche-label">Priority</span>
        <span>{{ ticketSelectionne.priority }}</span>
      </div>

      <div class="fiche-ligne">
        <span class="fiche-label">Elements associes</span>
        <span>{{ ticketSelectionne.items }}</span>
      </div>
    </div>

    <div v-if="erreur" class="erreur">{{ erreur }}</div>
  </div>
</template>

<script>
import { getDatabase } from '../../composables/useDatabase.js'

export default {
  name: 'TicketsView',
  data() {
    return {
      tickets: [],
      ticketSelectionne: null,
      erreur: ''
    }
  },
  async mounted() {
    await this.chargerTickets()
  },
  methods: {
    async chargerTickets() {
      try {
        const db = await getDatabase()
        const res = db.exec('SELECT * FROM tickets ORDER BY id ASC')
        if (res.length === 0) {
          this.tickets = []
          return
        }
        const colonnes = res[0].columns
        this.tickets = res[0].values.map(row => {
          const ticket = {}
          colonnes.forEach((col, i) => {
            ticket[col] = row[i]
          })
          return ticket
        })
      } catch (err) {
        this.erreur = 'Erreur : ' + err.message
      }
    },

    voirFiche(ticket) {
      this.ticketSelectionne = ticket
    }
  }
}
</script>

<style scoped>
.tickets-page { padding: 40px; }

h1 { font-size: 24px; margin-bottom: 24px; }

h2 { font-size: 20px; margin-bottom: 24px; }

.tableau { width: 100%; border-collapse: collapse; font-size: 14px; }

.tableau th {
  background-color: #000000;
  color: #ffffff;
  padding: 10px 16px;
  text-align: left;
}

.tableau td {
  padding: 10px 16px;
  border-bottom: 1px solid #dddddd;
}

.btn-voir {
  padding: 6px 14px;
  background-color: #000000;
  color: #ffffff;
  border: none;
  font-size: 13px;
  cursor: pointer;
}

.btn-voir:hover { background-color: #333333; }

.fiche {
  border: 1px solid #000000;
  padding: 32px;
  max-width: 600px;
}

.fiche-ligne {
  display: flex;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid #dddddd;
  font-size: 14px;
}

.fiche-label {
  font-weight: bold;
  min-width: 160px;
}

.btn-retour {
  padding: 8px 16px;
  background-color: #ffffff;
  color: #000000;
  border: 1px solid #000000;
  font-size: 13px;
  cursor: pointer;
  margin-bottom: 24px;
}

.btn-retour:hover { background-color: #f0f0f0; }

.erreur {
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #000000;
  font-size: 14px;
  font-weight: bold;
}
</style>