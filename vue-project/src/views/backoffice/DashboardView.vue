<template>
  <div class="dashboard">
    <h1>Dashboard</h1>

    <div v-if="chargement" class="chargement">
      Chargement en cours...
    </div>

    <div v-else>

      <!-- Blocs totaux cote a cote -->
      <div class="blocs-row">
        <div class="bloc">
          <div class="bloc-titre">Total elements</div>
          <div class="bloc-nombre">{{ totalAssets }}</div>
        </div>

        <div class="bloc">
          <div class="bloc-titre">Total tickets</div>
          <div class="bloc-nombre">{{ totalTickets }}</div>
        </div>
      </div>

      <!-- Details elements -->
      <h2>Details par type</h2>
      <table class="tableau">
        <thead>
          <tr>
            <th>Type</th>
            <th>Nombre</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cat in categories" :key="cat.id">
            <td>{{ cat.name }}</td>
            <td>{{ cat.assets_count }}</td>
          </tr>
          <tr v-if="categories.length === 0">
            <td colspan="2">Aucune categorie trouvee</td>
          </tr>
        </tbody>
      </table>

      <!-- Details tickets -->
      <h2>Details par status</h2>
      <table class="tableau">
        <thead>
          <tr>
            <th>Status</th>
            <th>Nombre</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in ticketsParStatus" :key="i">
            <td>{{ item.status }}</td>
            <td>{{ item.nombre }}</td>
          </tr>
          <tr v-if="ticketsParStatus.length === 0">
            <td colspan="2">Aucun ticket trouve</td>
          </tr>
        </tbody>
      </table>

    </div>

    <div v-if="erreur" class="erreur">{{ erreur }}</div>
  </div>
</template>


<script>
import api from '../../composables/useSnipitApi.js'

export default {
    name: 'DashboardView',
    data() {
        return {
            totalAssets: 0,
            categories: [],
            chargement: false,
            erreur: '',
            totalTickets: 0,
            ticketsParStatus: []
        }
    },
    async mounted() {
        await this.chargerDonnees()
    },
    methods: {
        async chargerDonnees() {
            this.chargement = true
            this.erreur = ''
            try {
                // total elements (assets)
                const resAssets = await api.get('/hardware?limit=1')
                this.totalAssets = resAssets.data?.total || 0

                //Categories avec assets_count
                const resCats = await api.get('/categories?limit=50')
                this.categories = (resCats.data?.rows || []).filter(c => c.assets_count > 0)

                //Tickets depuis SQLite
                const { getDatabase } = await import('../../composables/useDatabase.js')
                const db = await getDatabase()

                const totalRes = db.exec('SELECT COUNT(*) as total FROM tickets')
                this.totalTickets = totalRes[0]?.values[0][0] || 0

                const statusRes = db.exec('SELECT status, COUNT(*) as nombre FROM tickets GROUP BY status')
                this.ticketsParStatus = statusRes[0]?.values.map(row => ({
                    status: row[0],
                    nombre: row[1]
                })) || []
            } catch (err) {
                this.erreur = 'Erreur de chargement : ' + err.message
            } finally {
                this.chargement = false
            }
        }
    }   
}
</script>

<style scoped>
.dashboard { padding: 40px; }

h1 { font-size: 24px; margin-bottom: 24px; }

h2 { font-size: 18px; margin-bottom: 12px; margin-top: 32px; }

.chargement { font-size: 14px; color: #555555; }

.bloc {
  border: 1px solid #000000;
  padding: 24px;
  width: 200px;
  margin-bottom: 32px;
}

.bloc-titre {
  font-size: 13px;
  color: #555555;
  margin-bottom: 8px;
}

.bloc-nombre {
  font-size: 48px;
  font-weight: bold;
}

.tableau {
  width: 100%;
  max-width: 400px;
  border-collapse: collapse;
  font-size: 14px;
}

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

.tableau tr:last-child td {
  border-bottom: none;
}

.erreur {
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #000000;
  font-size: 14px;
  font-weight: bold;
}

.blocs-row {
  display: flex;
  gap: 32px;
  align-items: flex-start;
}

.bloc {
  border: 1px solid #000000;
  padding: 24px;
  min-width: 250px;
}
</style>