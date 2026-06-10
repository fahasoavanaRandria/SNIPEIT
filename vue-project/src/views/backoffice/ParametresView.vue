<template>
    <div class="parametres-page">
        <h1>Personnalisation</h1>
        <p class="description">Modifiez les couleurs kanban</p>

        <div v-if="chargement">Chargement...</div>

        <div v-else class="formulaire">
            <div class="champ">
                <label>Couleur - New</label>
                <input type="color" v-model="couleur_new">
            </div>
            <div class="champ">
                <label>Version en Malgache - New</label>
                <input type="text" v-model="label_new" placeholder="ex: Vaovao" />
            </div>
            <div class="champ">
                <label>Couleur - In Progress</label>
                <input type="color" v-model="couleur_inprogress">
            </div>
            <div class="champ">
                <label>Version en Malgache - In Progress</label>
                <input type="text" v-model="label_inprogress" placeholder="ex: Efa manao" />
            </div>
            <div class="champ">
                <label>Couleur - Closed</label>
                <input type="color" v-model="couleur_closed">
            </div>
            <div class="champ">
                <label>Version en Malgache - Closed</label>
                <input type="text" v-model="label_closed" placeholder="ex: Vita" />
            </div>

            <button @click="sauvegarder">Sauvegarder</button>

        </div>

        <div v-if="message" class="message">{{ message }}</div>
        <div v-if="erreur" class="erreur">{{ erreur }}</div>

    </div>
</template>

<script>
import { getDatabase, sauvegarderDatabase } from '../../composables/useDatabase.js'

export default {
    name: 'ParametresView',
    data() {
        return {
            couleur_new: '#ffffff',
            couleur_inprogress: '#ffffff',
            couleur_closed: '#ffffff',
            chargement: false,
            message: '',
            erreur: '',
            label_new: 'New',
            label_inprogress: 'In Progress',
            label_closed: 'Closed'
        }
    },

    async mounted() {
        await this.chargerParametres()
    },

    methods: {
        async chargerParametres() {
            this.chargement = true
            try {
                const db = await getDatabase()
                const res = db.exec('SELECT cle, valeur FROM parametres')
                if (res.length > 0) {
                    res[0].values.forEach(row => {
                        const cle = row[0]
                        const valeur = row[1]
                        //couleurs
                        if (cle === 'couleur_new') this.couleur_new = valeur
                        if (cle === 'couleur_inprogress') this.couleur_inprogress = valeur
                        if (cle === 'couleur_closed') this.couleur_closed = valeur
                        //version malagasy
                        if (cle === 'label_new') this.label_new = valeur
                        if (cle === 'label_inprogress') this.label_inprogress = valeur
                        if (cle === 'label_closed') this.label_closed = valeur
                    })
                }
            } catch (err) {
                this.erreur = 'Erreur: ' + err.message
            } finally {
                this.chargement = false
            }
        },

        async sauvegarder() {
            try {
                const db = await getDatabase()
                db.run(`INSERT OR REPLACE INTO parametres (cle, valeur) VALUES ('couleur_new', ?)`, [this.couleur_new])
                db.run(`INSERT OR REPLACE INTO parametres (cle, valeur) VALUES ('couleur_inprogress', ?)`, [this.couleur_inprogress])
                db.run(`INSERT OR REPLACE INTO parametres (cle, valeur) VALUES ('couleur_closed', ?)`, [this.couleur_closed])

                //
                db.run(`INSERT OR REPLACE INTO parametres (cle, valeur) VALUES ('label_new', ?)`, [this.label_new])
                db.run(`INSERT OR REPLACE INTO parametres (cle, valeur) VALUES ('label_inprogress', ?)`, [this.label_inprogress])
                db.run(`INSERT OR REPLACE INTO parametres (cle, valeur) VALUES ('label_closed', ?)`, [this.label_closed])


                sauvegarderDatabase(db)
                this.message = 'Sauvegardees avec succes !'

            } catch (err) {
                this.erreur = 'Erreur: ' + err.message
            }
        }
    }
}

</script>

<style scoped>
.parametres-page { padding: 40px; }
h1 { font-size: 24px; margin-bottom: 8px; }
.description { font-size: 14px; color: #555555; margin-bottom: 24px; }
.formulaire { max-width: 400px; }
.champ { display: flex; flex-direction: column; margin-bottom: 20px; }
.champ label { font-size: 13px; font-weight: bold; margin-bottom: 8px; }
input[type="color"] { width: 60px; height: 40px; border: 1px solid #000000; cursor: pointer; padding: 2px; }
button { padding: 10px 20px; background-color: #000000; color: #ffffff; border: none; font-size: 14px; cursor: pointer; }
button:hover { background-color: #333333; }
.message { margin-top: 20px; padding: 10px; border: 1px solid #000000; font-size: 14px; }
.erreur { margin-top: 20px; padding: 10px; border: 1px solid #000000; font-size: 14px; font-weight: bold; }
</style>

