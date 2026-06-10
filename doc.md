## recherche (filtre select)
// template
<div class="filtres">
  <select v-model="filtres.status">
    <option value="">Tous les status</option>
    <option value="New">New</option>
    <option value="In Progress">In Progress</option>
    <option value="Closed">Closed</option>
  </select>

  <select v-model="filtres.priority">
    <option value="">Toutes les priorites</option>
    <option value="Low">Low</option>
    <option value="Medium">Medium</option>
    <option value="High">High</option>
  </select>
</div>

// script
dans data 

filtres: {
  status: '',
  priority: ''
}

computed: {
  ticketsFiltres() {
    return this.tickets.filter(ticket => {
      const status = this.filtres.status === '' ? true : ticket.status === this.filtres.status
      const priority = this.filtres.priority === '' ? true : ticket.priority === this.filtres.priority
      return status && priority
    })
  }
},

//style
.filtres {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.filtres select {
  padding: 8px 12px;
  border: 1px solid #000000;
  font-size: 13px;
  outline: none;
  background-color: #ffffff;
  cursor: pointer;
}

## recherche (filtre texte)