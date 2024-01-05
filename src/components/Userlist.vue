<template>
    <div>
      <h1>Liste des utilisateurs</h1>
      <ul>
        <li v-for="user in users" :key="user.id">{{ user.name }} {{ user.username }} {{ user.username }} {{ user.email }}</li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        users: [],
      };
    },
    mounted() {
      this.fetchUsers();
    },
    methods: {
      async fetchUsers() {
        try {
          const response = await fetch('https://jsonplaceholder.typicode.com/users');
          const data = await response.json();
          this.users = data;
        } catch (error) {
          console.error('Erreur lors de la récupération des utilisateurs', error);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  /* Style si nécessaire */
  </style>
  