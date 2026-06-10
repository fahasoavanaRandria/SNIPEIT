<template>
    <div class="elements-page">
        <h1>Liste des elements</h1>

        <div class="recherche">
            <div class="recherche-titre">
                <h5>-- Nom --</h5>
                <input v-model="recherche.nom" type="text" placeholder="Rechercher par nom 🔍"/>
            </div>
            <div class="recherche-titre">
                <h5>-- Categorie --</h5>
                <input v-model="recherche.categorie" type="text" placeholder="Rechercher par categorie 🔍"/>
            </div>
            <div class="recherche-titre">
                <h5>-- Statut --</h5>
                <input v-model="recherche.statut" type="text" placeholder="Rechercher par statut 🔍"/>
            </div>
            <div class="recherche-titre">
                <h5>-- Fabricant --</h5>
                <input v-model="recherche.fabricant" type="text" placeholder="Rechercher par fabricant 🔍"/>
            </div>
            <div class="recherche-titre">
                <h5>-- Entreprise --</h5>
                <input v-model="recherche.entreprise" type="text" placeholder="Rechercher par entreprise 🔍">
            </div>
            <div class="recherche-titre">
                <h5>-- Departement --</h5>
                <input v-model="recherche.departement" type="text" placeholder="Rechercher par departement 🔍">
            </div>

        </div>

        <div v-if="chargement" class="chargement">
            chargement en cours...
        </div>

    

        <div v-else>
            <table class="tableau">
                <thead>
                    <tr>
                        <th>Tag</th>
                        <th>Nom</th>
                        <th>Serie</th>
                        <th>Categorie</th>
                        <th>Fabricant</th>
                        <th>Modele</th>
                        <th>Statut</th>
                        <th>Entreprise</th>
                        <th>Assigne a</th>
                        <th>Email</th>
                        <th>Departement</th>
                        <th>Date achat</th>
                        <th>Cout</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="asset in assetsFiltres" :key="asset.id">
                        <td>{{ asset.asset_tag }}</td>
                        <td>{{ asset.name }}</td>
                        <td>{{ asset.serial }}</td>
                        <td>{{ asset.category?.name }}</td>
                        <td>{{ asset.manufacturer?.name }}</td>
                        <td>{{ asset.model?.name }}</td>
                        <td>{{ asset.status_label?.name }}</td>
                        <td>{{ asset.company?.name || '-' }}</td>
                        <td>{{ asset.assigned_to?.name || 'Non assigne' }}</td>
                        <td>{{ asset.assigned_to?.username ? asset.assigned_to.username + '@ituniversity.mg' : '-' }}</td>
                        <td>{{ asset.assigned_to?.department || '-' }}</td>
                        <td>{{ asset.purchase_date?.date || '-' }}</td>
                        <td>{{ asset.purchase_cost || '-' }}</td>
                    </tr>
                    <tr v-if="assets.length === 0">
                        <td colspan="7">Aucun element trouve</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="erreur" class="erreur">{{ erreur }}</div>
    </div>
</template>

<script>
import api from '../../composables/useSnipitApi'

export default {
    name: 'ElementsView',
    data() {
        return {
            assets: [],
            chargement: false,
            erreur: '',
            recherche: {
            nom: '',
            categorie: '',
            statut: '',
            fabricant: '',
            entreprise: '',
            departement: ''
            }
        }
      
    },
    computed: {
        assetsFiltres() {
            return this.assets.filter(asset => {
                const nom = asset.name?.toLowerCase().includes(this.recherche.nom.toLowerCase())

                const categorie = asset.category?.name?.toLowerCase().includes(this.recherche.categorie.toLowerCase())

                const statut = asset.status_label?.name?.toLowerCase().includes(this.recherche.statut.toLowerCase())

                const fabricant = asset.manufacturer?.name?.toLowerCase().includes(this.recherche.fabricant.toLowerCase())

                const entreprise = this.recherche.entreprise === '' ? true : asset.company?.name?.toLowerCase().includes(this.recherche.entreprise.toLowerCase())

                const departement = this.recherche.departement === '' ? true : asset.assigned_to?.department?.toLowerCase().includes(this.recherche.departement.toLowerCase())

                return nom && categorie && statut && fabricant && entreprise && departement

            })
        }
    },
    async mounted() {
        await this.chargerAssets()
    },
    methods: {
        async chargerAssets() {
            this.chargement = true
            this.erreur = ''
            try {
                const res = await api.get('/hardware?limit=50')
                this.assets = res.data?.rows || []

                //charger user avec departement
                const resUsers = await api.get('/users?limit=100')
                const users = resUsers.data?.rows || []

                //associer le departement a chaque asset
                this.assets = this.assets.map(asset => {
                    if (asset.assigned_to) {
                        const user = users.find(u => u.id === asset.assigned_to.id)
                        asset.assigned_to.department = user?.department?.name || '-'
                    }
                    return asset
                })

            } catch (err) {
                this.erreur = 'Erreur : ' + err.message
            } finally {
                this.chargement = false
            }
        }
    }
}
</script>

<style scoped>
.elements-page { padding: 40px; }

h1 { font-size: 24px; margin-bottom: 24px; }

.chargement { font-size: 14px; color: #555555; }

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

.erreur {
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #000000;
  font-size: 14px;
  font-weight: bold;
}

.recherche {
    display: flex;
    gap: 12px;
    margin-bottom: 20px;
    flex-wrap: wrap;
}

.recherche input {
    padding: 8px 12px;
    border: 1px solid #000000;
    font-size: 13px;
    outline: none;
    width: 200px;
    border-radius: 8px;
}

.recherche input:focus {
    border-width: 2px;
}
</style>