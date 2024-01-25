<template>
    <div>
      <h1>Gestion des présences</h1>
      
      <!-- Ajout de la sélection d'étudiant -->
      <label for="selectStudent">Sélectionner un étudiant:</label>
      <select v-model="selectedStudentId" id="selectStudent" @change="fetchAttendances">
        <option v-for="student in students" :key="student.id" :value="student.idUtilisateur">
          {{ student.firstname }} {{ student.lastname }} {{ student.idUtilisateur }}
        </option>
      </select>
      
      <button class="btn btn-success" @click="toggleAddForm">Ajouter une présence</button>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">ID Étudiant</th>
            <th scope="col">ID Cours</th>
            <th scrop="col">Status</th>
            <th scope="col">Actions</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="attendance in attendances" :key="attendance.id">
            <td>{{ attendance.id }}</td>
            <td>{{ attendance.studentId }}</td>
            <td>{{ attendance.lessonId }}</td>
            <td>{{ attendance.status }}</td>
            <td>
              <button class="btn btn-danger" @click="deleteAttendance(attendance.id)">Supprimer</button>
            </td>
            <td>
              <button class="btn btn-danger" @click="voirplus(attendance.id)">Supprimer</button>
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
        students: [], // Liste complète des étudiants
        selectedStudentId: null, // ID de l'étudiant actuellement sélectionné
        attendances: [],
        showAddForm: false,
        newAttendance: {
          studentId: null,
          lessonId: null,
          status: null,
        },
      };
    },
    mounted() {
      this.fetchStudents();      
    },
    methods: {
      async fetchStudents() {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://localhost:8000/user', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Ajouter le token d'authentification à l'en-tête
          },
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des étudiants');
        }

        const data = await response.json();
        this.students = data;
      } catch (error) {
        console.error('Erreur lors de la récupération des étudiants', error);
      }
      },
     async fetchAttendances() {
        try {
          const response = await fetch(`http://localhost:3000/attendance/student/${this.selectedStudentId}`, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
  
          if (!response.ok) {
            throw new Error('Erreur lors de la récupération des cours');
          }
  
          const data = await response.json();
          this.attendances = data;
        } catch (error) {
          console.error('Erreur lors de la récupération des cours', error);
        }
      },
  
      deleteAttendance(attendanceId) {
        // Simuler la suppression localement
        this.attendances = this.attendances.filter(attendance => attendance.id !== attendanceId);
  
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
  