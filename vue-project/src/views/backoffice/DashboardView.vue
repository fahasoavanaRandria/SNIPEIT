<template>
<div class="dashboard">
    <h1>Dashboard</h1>
    <p>Bienvenue dans le backoffice.</p>
</div>
</template>

<script>
export default {
    name: 'DashboardView',
   
}
</script>

<style scoped>
.dashboard {
    padding: 40px;
}

h1 {
    font-size: 24px;
    margin-bottom: 16px;
}

button {
    padding: 8px 16px;
    background-color: #000000;
    color: #ffffff;
    border: none;
    cursor: pointer;
    font-size: 14px;
}

button:hover {
    background-color: #333333;
}

</style>