<template>
    <div>
      <h2>Cours et Planning</h2>
      <!-- Ajoute les composants nécessaires ici -->
      <LessonDetail />
    </div>
  </template>
  
  
  <script>
  import LessonDetail from '../components/Lessondetail.vue';
  
  export default {
      components: {
        LessonDetail,
      },
  };
  </script>