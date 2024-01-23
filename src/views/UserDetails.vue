<template>
    <div>
      <h2>User informations</h2>
      <!-- Ajoute les composants nécessaires ici -->
      <UserDetail />
    </div>
  </template>
  
  
  <script>
  import UserDetail from '../components/UserDetails.vue';
  
  export default {
      components: {
        UserDetail,
      },
  };
  </script>