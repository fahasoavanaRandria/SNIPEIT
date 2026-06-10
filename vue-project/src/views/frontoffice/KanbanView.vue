<template>
    <div class="kanban-page">
        <h1>Statut des tickets</h1>

        <div class="kanban">
            <div class="colonne" :style="{backgroundColor: couleurs['New']}" @drop="deposer($event, 'New')">
                <div class="colonne-header">
                    <span class="colonne-titre">{{ labels['New'] }}</span>
                    <span class="colonne-count">{{ ticketsParStatus('New').length }}</span>
                </div>
                <div v-for="ticket in ticketsParStatus('New')" :key="ticket.id" class="ticket-card" draggable="true" @dragstart="glisser($event, ticket)" @click="voirDetail(ticket)">
                    <div class="ticket-titre">Ticket - {{ ticket.id }}</div>
                </div>

                <button class="btn-ajouter" @click="formulaireVisible =true">+ Ajouter 1 ticket</button>
                
            </div>
            <div class="colonne" :style="{backgroundColor: couleurs['In Progress']}" @dragover.prevent @drop="deposer($event, 'In Progress')">
                <div class="colonne-header">
                    <span class="colonne-titre">{{ labels['In Progress'] }}</span>
                    <span class="colonne-count">{{ ticketsParStatus('In Progress').length }}</span>
                </div>
                <div v-for="ticket in ticketsParStatus('In Progress')" :key="ticket.id" class="ticket-card" draggable="true" @dragstart="glisser($event, ticket)" @click="voirDetail(ticket)">
                    <div class="ticket-titre">Ticket - {{ ticket.id }}</div>
                </div>                
            </div>
            <div class="colonne" :style="{backgroundColor: couleurs['Closed']}" @dragover.prevent @drop="deposer($event, 'Closed')">
                <div class="colonne-header">
                    <span class="colonne-titre">{{ labels['Closed'] }}</span>
                    <span class="colonne-count">{{ ticketsParStatus('Closed').length }}</span>
                </div>
                <div v-for="ticket in ticketsParStatus('Closed')" :key="ticket.id" class="ticket-card" draggable="true" @dragstart="glisser($event, ticket)" @click="voirDetail(ticket)">
                    <div class="ticket-titre">Ticket - {{ ticket.id }}</div>
                </div>
                
            </div>
        </div>
        
        <!-- Formulaire d'ajout ticket-->
         <div v-if="formulaireVisible" class="modal-overlay" @click.self="formulaireVisible = false">
            <div class="modal">
                <h2>Nouveau ticket</h2>

                <div class="champ">
                    <label>Titre</label>
                    <input v-model="nouveauTicket.titre" type="text" placeholder="Titre du ticket" />
                </div>
                <div class="champ">
                    <label>Description</label>
                    <input v-model="nouveauTicket.description" type="text" placeholder="Description du ticket" />
                </div>
                <div class="champ">
                    <label>Priority</label>
                    <select v-model="nouveauTicket.priority">
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option> 
                    </select>
                </div>
                <div class="champ">
                    <label>Elements associes</label>
                    <div class="liste-elements">
                        <div v-for="asset in assets" :key="asset.id" class="element-item">
                            <input 
                            type="checkbox"
                            :id="'asset-' + asset.id"
                            :value="asset.asset_tag"
                            v-model="nouveauTicket.items"
                            />
                            <label :for="'asset-' + asset.id">{{ asset.asset_tag }} - {{ asset.name }}</label>
                       </div>
                    </div>
                </div>

                <div class="modal-boutons">
                    <button @click="creerTicket">Creer</button>
                    <button class="btn-annuler" @click="formulaireVisible = false">Annuler</button>

                </div>
            </div>
         </div>

        <!--Details tickets-->
        <div v-if="ticketDetail" class="modal-overlay" @click.self="ticketDetail = null">
            <div class="modal">
                <h2>Ticket #{{ ticketDetail.id }}</h2>
                <div class="fiche-ligne">
                    <span class="fiche-label">Titre</span>
                    {{ ticketDetail.titre }}
                </div>
                 <div class="fiche-ligne">
                    <span class="fiche-label">Description</span>
                    {{ ticketDetail.description }}
                </div>
                 <div class="fiche-ligne">
                    <span class="fiche-label">Date</span>
                    {{ ticketDetail.date }} a {{ ticketDetail.heure }}
                </div>
                 <div class="fiche-ligne">
                    <span class="fiche-label">Statuts</span>
                    {{ ticketDetail.status }}
                </div>
                 <div class="fiche-ligne">
                    <span class="fiche-label">Priority</span>
                    {{ ticketDetail.priority }}
                </div>
                 <div class="fiche-ligne">
                    <span class="fiche-label">Elements</span>
                    {{ ticketDetail.items }}
                </div>

                <button @click="ticketDetail = null" style="margin-top:20px;">
                    Fermer
                </button>
            </div>
        </div>
         
        <!--Boite de dialogue-->
        <div v-if="modalStatut" class="modal-overlay" @click.self="modalStatut = null">
            <div class="modal">
                <h2>Changement de statut</h2>
                <p style="margin-bottom: 16px; font-size: 14px;">
                    Passer <strong>{{ modalStatut.ticket.id }}</strong> en <strong>{{ modalStatut.nouveauStatut }}</strong> ?
                </p>

               <div class="champ">
                    <label>Commentaire (optionnel)</label>
                    <textarea v-model="modalStatut.commentaire" rows="3" placeholder="Ajouter un commentaire..."></textarea>
               </div>

               <div class="modal-boutons">
                    <button @click="confirmerChangementStatut">Confirmer</button>
                    <button @click="modalStatut = null" class="btn-annuler">Annuler</button>
               </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getDatabase, sauvegarderDatabase } from '../../composables/useDatabase'

export default {
    name: 'KanbanView',
    data() {
        return {
            tickets: [],
            formulaireVisible: false,
            nouveauTicket: {
                titre: '',
                description: '',
                priority: 'Medium',
                items: []
            },
            assets: [],
            ticketDetail: null,
            ticketEnCours: null,
            modalStatut: null,
            couleurs: {
                New: '#ffffff',
                'In Progress': '#ffffff',
                Closed: '#ffffff'
            },
            labels: {
                New: 'New',
                'In Progress': 'In Progress',
                Closed: 'Closed'
            }

        }
    },
    async mounted() {
        await this.chargerTickets()
        await this.chargerAssets()
        await this.chargerParametres()
    },
    computed: {
        ticketsParStatus() {
            return (status) => this.tickets.filter(t => t.status === status)
        }
    },
    methods: {
        async chargerTickets() {
            try {
                const db = await getDatabase()
                const res = db.exec('SELECT * FROM tickets ORDER BY id ASC')
                if (res.length === 0) { this.tickets = []; return }
                const colonnes = res[0].columns
                this.tickets = res[0].values.map(row => {
                    const ticket = {}
                    colonnes.forEach((col,i) => { ticket[col] = row[i]})
                    return ticket
                })
            } catch (err) {
                console.error('Erreur:', err)
            }
        },
        async chargerAssets() {
            try {
                const { default: api } = await import('../../composables/useSnipitApi.js')
                const res = await api.get('/hardware?limit=50')
                this.assets = res.data?.rows || []
            } catch (err) {
                console.error('Erreur assets:', err)
            }
        },

        async creerTicket() {
            if (!this.nouveauTicket.titre) return 
            try {
                const db = await getDatabase()
                const resId = db.exec('SELECT MAX(id) FROM tickets')
                const dernierID = resId[0]?.values[0][0] || 0
                const nouvelID = dernierID + 1 
                const maintenant = new Date()
                const date = maintenant.toLocaleDateString('fr-FR')
                const heure = maintenant.toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'} )

                db.run(
                    'INSERT INTO tickets (id,date,heure,titre,description,status,priority,items) VALUES (?,?,?,?,?,?,?,?)',
                    [nouvelID, date, heure, this.nouveauTicket.titre, this.nouveauTicket.description, 'New', this.nouveauTicket.priority, JSON.stringify(this.nouveauTicket.items)]
                )
                sauvegarderDatabase(db)
                await this.chargerTickets()
                this.formulaireVisible = false
                this.nouveauTicket = {titre: '', description: '', priority: 'Medium', items: []}

            } catch (err) {
                console.error('Error creation:', err)
            }
        },

        voirDetail(ticket) {
            this.ticketDetail = ticket
        },

        glisser(event, ticket) {
            this.ticketEnCours = ticket
        },

        deposer(event, nouveauStatut) {
            if (!this.ticketEnCours) return
            if (this.ticketEnCours.status === nouveauStatut) return

            this.modalStatut = {
                ticket: this.ticketEnCours,
                nouveauStatut: nouveauStatut,
                commentaire: ''
            }
            this.ticketEnCours = null
        },

        async confirmerChangementStatut() {
            try {
                const db = await getDatabase()
                db.run(
                    'UPDATE tickets SET status = ? WHERE id = ?',
                    [this.modalStatut.nouveauStatut, this.modalStatut.ticket.id]
                )
                sauvegarderDatabase(db)
                await this.chargerTickets()
                this.modalStatut = null
            } catch (err) {
                console.error('Error changement statut:', err)
            }
        },

        async chargerParametres() {
            try {
                const db = await getDatabase()
                const res = db.exec('SELECT cle, valeur FROM parametres')
                if (res.length >0) {
                    res[0].values.forEach(row => {
                        const cle = row[0]
                        const valeur = row[1]
                        if (cle === 'couleur_new') this.couleurs['New'] = valeur
                        if (cle === 'couleur_inprogress') this.couleurs['In Progress'] = valeur
                        if (cle === 'couleur_closed') this.couleurs['Closed'] = valeur

                        //version malagasy
                        if (cle === 'label_new') this.labels['New'] = valeur
                        if (cle === 'label_inprogress') this.labels['In Progress'] = valeur
                        if (cle === 'label_closed') this.labels['Closed'] = valeur


                    })
                }
            } catch (err) {
                console.error('Erreur parametres:', err)
            }
        }
    }
}
</script>

<style scoped>
.kanban-page { 
    padding: 40px;
}

h1 { 
    font-size: 24px; 
    margin-bottom: 24px; 
}

.kanban { 
    display: flex; 
    gap: 25px; 
    align-items: flex-start; 
}

.colonne { 
    flex: 1;
  border: 1px solid #dddddd;
  padding: 16px;
  min-height: 200px;
  border-radius: 10px;
  background-color: #f9f9f9;
}

.colonne-header { 
    padding-bottom: 10px;
  border-bottom: 2px solid #dddddd;
  margin-bottom: 16px;
  border-radius: 4px; 
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.colonne-count {
  background-color: #000000;
  color: #ffffff;
  padding: 2px 8px;
  font-size: 12px;
  border-radius: 10px;
}

.colonne-titre { 
    font-weight: bold; 
    font-size: 15px; 
}

.ticket-card {
  background-color: #ffffff;
  border: 1px solid #dddddd;
  padding: 12px;
  margin-bottom: 10px;
  border-radius: 6px;
  cursor: pointer;
}

.ticket-card:hover { background-color: #f0f0f0; }

.ticket-titre { font-size: 14px; margin-bottom: 4px; }

.ticket-priority { font-size: 12px; color: #555555; }

.btn-ajouter {
  width: 100%;
  padding: 8px;
  background-color: transparent;
  border: 1px dashed #000000;
  font-size: 13px;
  cursor: pointer;
  margin-top: 10px;
  border-radius: 6px;
  color: #000000;
  text-transform: capitalize;
  text-align: justify;
}

.btn-ajouter:hover { background-color: #eeeeee; }

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background-color: #ffffff;
  padding: 32px;
  width: 500px;
  max-width: 90%;
  border-radius: 8px;
}

.modal h2 { font-size: 20px; margin-bottom: 20px; }

.champ { display: flex; flex-direction: column; margin-bottom: 16px; }

.champ label { font-size: 13px; font-weight: bold; margin-bottom: 6px; }

input[type="text"], textarea, select {
  padding: 8px 10px;
  border: 1px solid #000000;
  font-size: 14px;
  outline: none;
  border-radius: 4px;
}

.liste-elements {
  border: 1px solid #000000;
  padding: 8px;
  max-height: 150px;
  overflow-y: auto;
  border-radius: 4px;
}

.element-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
  font-size: 13px;
}

.element-item label { font-weight: normal; cursor: pointer; margin-bottom: 0; }

.modal-boutons { display: flex; gap: 12px; margin-top: 20px; }

button {
  padding: 10px 20px;
  background-color: #000000;
  color: #ffffff;
  border: none;
  font-size: 14px;
  cursor: pointer;
  border-radius: 4px;
}

button:hover { background-color: #333333; }

.btn-annuler {
  background-color: #ffffff;
  color: #000000;
  border: 1px solid #000000;
}

.btn-annuler:hover { background-color: #f0f0f0; }

.fiche-ligne {
  display: flex;
  gap: 16px;
  padding: 10px 0;
  border-bottom: 1px solid #dddddd;
  font-size: 14px;
}

.fiche-label { font-weight: bold; min-width: 120px; }


</style>