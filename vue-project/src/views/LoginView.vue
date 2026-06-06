<template>
<div class="login-page">
    <div class="login-box">
        <h1>Backoffice</h1>
        <p class="subtitle">Entrer vos identifiants</p>

        <div class="form-group">
            <label for="username">Nom d'utilisateur</label>
            <input 
            id="username"
            v-model="username"
            type="text"
            placeholder="admin"
            @keyup.enter="login"
            />
        </div>
        <div class="form-group">
            <label for="password">Mot de passe</label>
            <input 
            id="password"
            v-model="password"
            type="text" 
            placeholder="admin123"
            @keyup.enter="login"
            />
        </div>

        <p v-if="erreur" class="erreur">Identifiants incorrectes</p>
        <button @click="login">Connexion</button>
    </div>
</div>
</template>

<script>
export default {
    name: 'LoginView',
    data() {
        return {
            username: 'admin',
            password: 'admin123',
            erreur: false
        }
    },
    methods: {
        login() {
            const USERNAME = 'admin'
            const PASSWORD = 'admin123'

            if (this.username === USERNAME && this.password === PASSWORD) {
                localStorage.setItem('bo_auth', 'true')
                this.$router.push('/backoffice/dashboard')
            } else {
                this.erreur = true
            }
        }
    }
}
</script>

<style scoped>
.login-page {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #ffffff;
}

.login-box {
    border: 2px solid #000000;
    padding: 40px;
    width: 340px;
}

h1 {
    font-size: 24px;
    margin-bottom: 6px;
    color: 340px;
}

.subtitle {
    font-size: 14px;
    color: #555555;
    margin-bottom: 24px;
}

.form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 16px;
}

label {
    font-size: 13px;
    margin-bottom: 6px;
    color: #000000;
}

input {
    border: 1px solid #000000;
    padding: 10px;
    font-size: 14px;
    outline: none;
    background-color: #ffffff;
}

input:focus {
    border-width: 2px;
}

button {
    width: 100%;
    padding: 10px;
    background-color: #000000;
    color: #ffffff;
    border: none;
    font-size: 14px;
    cursor: pointer;
}

button:hover {
    background-color: #333333;
}

.erreur {
    color: #000000;
    font-size: 13px;
    border: 1px solid #000000;
    padding: 8px;
    margin-bottom: 12px;
}
</style>