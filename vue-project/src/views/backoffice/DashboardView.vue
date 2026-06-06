<template>
<div class="dashboard">
    <h1>Dashboard</h1>
</div>
</template>

<script>
export default {
    name: 'DashboardView',
    data() {
        return {
            totalAssets: 0,
            categories: [],
            chargement: false,
            erreur: ''
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
</style>