<template>
    <div>
      <h2>Gestion Utilisateur</h2>
      <!-- Ajoute les composants nécessaires ici -->
        <Userlist />
    </div>
  </template>

    <script>
    import Userlist from '../components/Userlist.vue';
    
    export default {
      components: {
        Userlist,
      },
    };
    </script>