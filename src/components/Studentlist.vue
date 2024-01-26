<template>
  <div>
    <h1>Liste des classes d'étudiants</h1>
    <button class="btn btn-success" @click="toggleAddForm">Ajouter une classe</button>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">ID</th>
          <th scope="col">ID Lesson</th>
          <th scope="col">ID Users</th>
          <th scope="col">Actions</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="classStudent in classStudents" :key="classStudent.id">
          <td><strong>{{ classStudent.id }}</strong></td>
          <td>{{ classStudent.idLesson }}</td>
          <td>{{ classStudent.idUsers.join(', ') }}</td>
          <td>
            <button class="btn btn-danger" @click="deleteClassStudent(classStudent.id)">Supprimer</button>
          </td>
          <td>
            <button class="btn btn-warning" @click="showEditModal(classStudent)">Modifier</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <label for="editIdLesson">ID Lesson:</label>
        <input type="text" id="editIdLesson" v-model="selectedClassStudent.idLesson">

        <label for="editIdUsers">ID Users (séparés par des virgules):</label>
        <input type="text" id="editIdUsers" v-model="selectedClassStudent.idUsersString">

        <!-- Boutons Appliquer et Annuler -->
        <button class="btn btn-primary" @click="applyChanges">Appliquer</button>
        <button class="btn btn-secondary" @click="cancelChanges">Annuler</button>
      </div>
    </div>

    <div v-if="showAddForm" class="modal-overlay">
      <div class="modal-content">
        <label for="addIdLesson">ID Lesson:</label>
        <input type="text" id="addIdLesson" v-model="newClassStudent.idLesson">

        <label for="addIdUsers">ID Users (séparés par des virgules):</label>
        <input type="text" id="addIdUsers" v-model="newClassStudent.idUsersString">

        <!-- Boutons Ajouter et Annuler -->
        <button class="btn btn-primary" @click="addClassStudent">Ajouter</button>
        <button class="btn btn-secondary" @click="cancelAddForm">Annuler</button>
      </div>
    </div>

      <h2>Users</h2>
      <ul>
        <li v-for="user in usersmocks" :key="user.id">
          {{ user.lastname }}
        </li>
      </ul>
  </div>
</template>

<script>
import { apiuser, apimanagement, apiattendance } from '@/config';
import { usersmocks } from "../mocks/user";

export default {
  data() {
    return {
      classStudents: [],
      usersmocks: usersmocks,
      showModal: false,
      selectedClassStudent: null,
      showAddForm: false,
      newClassStudent: {
        idLesson: '',
        idUsersString: '',
      },
    };
  },
  mounted() {
    this.fetchClassStudents().then(() => {
    (this.classStudents);
  });    this.afficherusers();
  },
  methods: {
    async fetchClassStudents() {
      try {
        const response = await fetch('http://127.0.0.1:8000/classStudents', {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des classes d\'étudiants');
        }

        const data = await response.json();
        this.classStudents = data;
      } catch (error) {
        console.error('Erreur lors de la récupération des classes d\'étudiants', error);
      }
    },
    deleteClassStudent(classStudentId) {
      console.log(`Tentative de suppression de la classe avec l'ID ${classStudentId}`);
      const index = this.classStudents.findIndex(classStudent => classStudent.id === classStudentId);
      if (index !== -1) {
        this.classStudents.splice(index, 1);

        console.log(`Classe avec l'ID ${classStudentId} supprimée localement avec succès`);

        fetch(`http://127.0.0.1:8000/classStudents?id=${classStudentId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Erreur lors de la suppression de la classe');
            }
            return response.json();
          })
          .then(data => {
            console.log(`Classe avec l'ID ${classStudentId} supprimée avec succès sur le serveur`);
          })
          .catch(error => {
            console.error('Erreur lors de la suppression de la classe sur le serveur:', error.message);
          });
      } else {
        console.error(`Classe avec l'ID ${classStudentId} non trouvée localement`);
      }
    },
    showEditModal(classStudent) {
      this.selectedClassStudent = { ...classStudent, idUsersString: classStudent.idUsers.join(', ') };
      this.showModal = true;
    },
    cancelChanges() {
      // Logique pour annuler les modifications
      console.log('Modifications annulées');
      this.showModal = false;
    },
    applyChanges() {
      // Logique pour appliquer les modifications
      console.log('Modifications appliquées localement');

      const classStudentId = this.selectedClassStudent.id;

      // Envoie une requête PATCH à l'API pour mettre à jour la classe
      fetch(`http://127.0.0.1:8000/classStudents?id=${classStudentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idLesson: this.selectedClassStudent.idLesson,
          idUsers: this.selectedClassStudent.idUsersString.split(',').map(id => id.trim()),
        }),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Erreur lors de la modification de la classe');
          }
          return response.json();
        })
        .then(data => {
          console.log(`Classe avec l'ID ${classStudentId} modifiée avec succès sur le serveur`);
        })
        .catch(error => {
          console.error('Erreur lors de la modification de la classe sur le serveur:', error.message);
        });

      this.showModal = false; // Ferme la modal après la modification
    },
    toggleAddForm() {
      this.showAddForm = !this.showAddForm;
    },
    cancelAddForm() {
      this.showAddForm = false;
    },
    addClassStudent() {
      // Logique pour ajouter la nouvelle classe
      console.log('Ajout d\'une nouvelle classe localement');

      // Envoie une requête POST à l'API pour ajouter la nouvelle classe
      fetch('http://127.0.0.1:8000/classStudents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idLesson: this.newClassStudent.idLesson,
          idUsers: this.convertIdUsersToArray(this.newClassStudent.idUsersString),
        }),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Erreur lors de l\'ajout de la classe');
          }
          return response.json();
        })
        .then(data => {
          console.log('Nouvelle classe ajoutée avec succès sur le serveur');
          this.showAddForm = false; // Ferme le formulaire après l'ajout
          this.fetchClassStudents(); // Rafraîchit la liste des classes d'étudiants
        })
        .catch(error => {
          console.error('Erreur lors de l\'ajout de la classe sur le serveur:', error.message);
        });
    },
    convertIdUsersToArray(idUsersString) {
      // Fonction pour convertir la chaîne en tableau d'entiers
      return idUsersString.split(',').map(id => parseInt(id.trim()));
    },
    afficherusers() {
      console.log(usersmocks);
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
}
</style>
