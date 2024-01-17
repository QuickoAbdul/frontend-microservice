<template>
    <div>
      <h1>Gestion des présences</h1>
      <button class="btn btn-success" @click="toggleAddForm">Ajouter une présence</button>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">ID Étudiant</th>
            <th scope="col">ID Cours</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="attendance in attendances" :key="attendance.id">
            <td>{{ attendance.id }}</td>
            <td>{{ attendance.studentId }}</td>
            <td>{{ attendance.lessonId }}</td>
            <td>
              <button class="btn btn-danger" @click="deleteAttendance(attendance.id)">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <div v-if="showAddForm" class="modal-overlay">
        <div class="modal-content">
          <!-- Champs d'ajout -->
          <label for="addStudentId">ID Étudiant:</label>
          <input type="text" id="addStudentId" v-model="newAttendance.studentId">
  
          <label for="addLessonId">ID Cours:</label>
          <input type="text" id="addLessonId" v-model="newAttendance.lessonId">
  
          <!-- Boutons Ajouter et Annuler -->
          <button class="btn btn-primary" @click="addAttendance">Ajouter</button>
          <button class="btn btn-secondary" @click="cancelAddForm">Annuler</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        attendances: [],
        showAddForm: false,
        newAttendance: {
          studentId: null,
          lessonId: null,
        },
      };
    },
    mounted() {
      this.fetchAttendances();
    },
    methods: {
      fetchAttendances() {
        // Simuler un délai d'attente pour simuler une requête asynchrone
        setTimeout(() => {
          // Données simulées
          const mockData = [
            { id: 1, studentId: 1, lessonId: 101 },
            { id: 2, studentId: 2, lessonId: 102 },
            { id: 3, studentId: 3, lessonId: 103 },
          ];
  
          // Mettez à jour le state avec les données simulées
          this.attendances = mockData;
        }, 1000); // Simule un délai de 1 seconde
      },
  
      deleteAttendance(attendanceId) {
        // Simuler la suppression localement
        this.attendances = this.attendances.filter(attendance => attendance.id !== attendanceId);
  
        // En cas d'utilisation réelle de l'API, faire une requête DELETE à l'API ici
      },
  
      toggleAddForm() {
        this.showAddForm = !this.showAddForm;
      },
  
      cancelAddForm() {
        this.showAddForm = false;
      },
  
      addAttendance() {
        // Simuler l'ajout localement
        const newId = this.attendances.length + 1;
        const newAttendance = { id: newId, ...this.newAttendance };
        this.attendances.push(newAttendance);
  
        // En cas d'utilisation réelle de l'API, faire une requête POST à l'API ici
  
        // Réinitialisez le formulaire et masquez-le
        this.newAttendance = { studentId: null, lessonId: null };
        this.showAddForm = false;
      },
    },
  };
  </script>
  
  <style scoped>
  /* Ajoutez vos styles ici si nécessaire */
  </style>
  