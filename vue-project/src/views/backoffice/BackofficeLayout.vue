<template>
    <div class="layout">
        <aside class="sidebar">
            <div class="sidebar-title">
                Backoffice
            </div>
            <nav>
                <RouterLink to="/backoffice/dashboard">Dashboard</RouterLink>
                <RouterLink to="/backoffice/reset">Reinitialisation</RouterLink>
                <RouterLink to="/backoffice/import">Import</RouterLink>
                <RouterLink to="/backoffice/tickets">Tickets</RouterLink>
                <RouterLink to="/backoffice/parametres">Personnalisation</RouterLink>
            </nav>
            <button class="logout" @click="logout">Se deconnecter</button>
        </aside>

        <main class="contenu">
            <RouterView/>
        </main>
    </div>
</template>

<script>
export default {
    name: 'BackofficeLayout',
    methods: {
        logout() {
            localStorage.removeItem('bo_auth')
            this.$router.push('/login')
        }
    }
}
</script>

<style scoped>
.layout {
    display: flex;
    min-height: 100vh;
}

.sidebar {
    width: 220px;
    min-width: 220px;
    background-color: #000000;
    color: #ffffff;
    display: flex;
    flex-direction: column;
    padding: 24px 0;
}

.sidebar-title {
  font-size: 18px;
  font-weight: bold;
  padding: 0 24px 24px 24px;
  border-bottom: 1px solid #333333;
  margin-bottom: 16px;
}

nav {
  display: flex;
  flex-direction: column;
  flex: 1;
}

nav a {
  color: #ffffff;
  text-decoration: none;
  padding: 12px 24px;
  font-size: 14px;
}

nav a:hover {
  background-color: #222222;
}

nav a.router-link-active {
  background-color: #ffffff;
  color: #000000;
  font-weight: bold;
}

.logout {
  margin: 0 24px 0 24px;
  padding: 10px;
  background-color: #ffffff;
  color: #000000;
  border: none;
  font-size: 13px;
  cursor: pointer;
}

.logout:hover {
  background-color: #cccccc;
}

.contenu {
  flex: 1;
  padding: 40px;
  background-color: #ffffff;
}
</style>