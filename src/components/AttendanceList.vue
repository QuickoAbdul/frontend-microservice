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
              <button class="btn btn-warning" @click="changerstatus(attendance.id)">Changerstatus</button>
            </td>
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

          <label for="addStatut">Status:</label>
          <input type="text" id="addStatut" v-model="newAttendance.StatutId">
  
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
        lessons: [],
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
        async fetchLessons() {
          try {
            const response = await fetch('http://127.0.0.1:8001/lessons', {
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
      async changerstatus(attendanceId) {
    // Trouver l'index de l'attendance dans le tableau
    const index = this.attendances.findIndex(attendance => attendance.id === attendanceId);

    if (index !== -1) {
      // Changer le statut
      const currentStatus = this.attendances[index].status;
      const newStatus = currentStatus === 'absent' ? 'present' : 'absent';
      const studentId = this.attendances[index].studentId;
      const lessonId = this.attendances[index].lessonId;

      // Effectuer la mise à jour localement
      this.attendances[index].status = newStatus;

      // En cas d'utilisation réelle de l'API, faire une requête PATCH à l'API ici
      // Remplacez l'URL et la méthode en fonction de l'API réelle
      try {
        const response = await fetch(`http://localhost:3000/call_attendance/${lessonId}/${studentId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ status: newStatus }),
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la mise à jour du statut de présence');
        }

        const data = await response.json();
        console.log('Statut de présence mis à jour avec succès:', data);
      } catch (error) {
        console.error('Erreur lors de la mise à jour du statut de présence', error);
      }
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
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}  </style>
  