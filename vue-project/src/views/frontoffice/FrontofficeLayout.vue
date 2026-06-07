<template>
    <div class="layout">
        <header class="header">
            <div class="header-titre">SnipIT</div>
            <nav>
                <RouterLink to="/elements">Elements</RouterLink>
                <RouterLink to="/nouveau-ticket">Nouveau ticket</RouterLink>
            </nav>
        </header>

        <main class="contenu">
            <RouterView />
        </main>
    </div>
</template>

<script>
export default {
    name: 'FrontofficeLayout'
}
</script>

<style scoped>
.layout {
  min-height: 100vh;
}

.header {
  background-color: #000000;
  color: #ffffff;
  padding: 16px 40px;
  display: flex;
  align-items: center;
  gap: 40px;
}

.header-titre {
  font-size: 18px;
  font-weight: bold;
}

nav a {
  color: #ffffff;
  text-decoration: none;
  font-size: 14px;
  margin-right: 24px;
}

nav a.router-link-active {
  text-decoration: underline;
}

.contenu {
  background-color: #ffffff;
  padding: 40px;
}
</style>