<template>
    <div>
      <h1>Liste des cours</h1>
      <ul>
        <li v-for="lesson in lessons" :key="lesson.id">
          <strong>{{ lesson.name }}</strong>
          <p>Description: {{ lesson.description }}</p>
          <p>Date et heure: {{ formatDate(lesson.dateBegin) }} - {{ formatDate(lesson.dateEnd) }}</p>
          <p>Lieu: {{ lesson.place }}</p>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        lessons: [],
      };
    },
    mounted() {
      this.fetchLessons();
    },
    methods: {
      async fetchLessons() {
        try {
          const response = await fetch('URL_DE_TON_BACKEND/lessons', {
            headers: {
              'Content-Type': 'application/json',
            },
          });
  
          if (!response.ok) {
            throw new Error('Erreur lors de la récupération des cours');
          }
  
          const data = await response.json();
          this.lessons = data;
        } catch (error) {
          console.error('Erreur lors de la récupération des cours', error);
        }
      },
      formatDate(dateString) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', options);
      },
    },
  };
  </script>
  
  <style scoped>
  /* Ajoute du style si nécessaire */
  </style>
  