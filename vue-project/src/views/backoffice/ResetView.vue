<template>
    <div class="reset-page">
        <h1>Reinitialisation des donnees</h1>
        
        <button @click="confirmer = true">Reinitialiser</button>

        <div class="confirmation" v-if="confirmer">
            <p>Etes-vous sur de vouloir continuer</p>
            <div class="boutons">
                <button class="btn-confirmer" @click="reset">Reinitialiser</button>
                <button class="btn-annuler" @click="confirmer">Annuler</button>
            </div>
        </div>

        <p v-if="message" class="message">{{ message }}</p>
        <p v-if="erreur" class="erreur">{{ erreur }}</p>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'ResetView',
    data() {
        return {
            confirmer: false,
            message:'',
            erreur:''
        }
    },
    methods: {
        async reset() {
            this.message = ''
            this.erreur = ''
            try {
                const response = await axios.post('http://localhost:3000/reset')
                this.message = response.data.message
                this.confirmer = false
            } catch (err) {
                this.erreur = 'Erreur lors de la reinitialisation : ' + err.message
                this.confirmer = false
            }
        }
    }
}
</script>

<style scoped>
.rest-page {
    padding: 40px;
}

h1 {
    font-size: 24px;
    margin-bottom: 16px;
}


button {
    padding: 10px 20px;
    background-color: #f50a0a;
    color: #ffffff;
    border: none;
    font-size: 14px;
    cursor: pointer;
}

button:hover {
    background-color: #333333;
}

.confirmation {
    border: 1px solid #ff0303;
    padding: 20px;
    margin-top: 16px;
    width: fit-content;
}

.confirmation p {
    margin-bottom: 16px;
    font-size: 14px;
}

.boutons {
    display: flex;
    gap: 12px;
}

.btn-annuler {
    background-color: #1a8e1e;
    color: #ffffff;
    border: 1px solid #0e400d;
}

.btn-annuler:hover {
    background-color: #f0f0f0;
}

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
</style>