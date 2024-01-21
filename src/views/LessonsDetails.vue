<template>
    <div>
      <h2>Cours et Planning</h2>
      <!-- Ajoute les composants nécessaires ici -->
      <StudentList />
    </div>
  </template>
  
  
  <script>
  import StudentList from '../components/Studentlist.vue';
  
  export default {
      components: {
        StudentList,
      },
  };
  </script>