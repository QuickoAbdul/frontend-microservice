<template>
  <div>
    <h2>Détails de la leçon</h2>
    <button class="btn btn-primary" @click="toggleAddStudentForm">Ajouter un étudiant</button>

    <div v-for="lesson in lessonDetails" :key="lesson.id">
      <p><strong>Nom de la leçon:</strong> {{ lalesson.name }}</p>
      <p><strong>Description de la leçon:</strong> {{ lalesson.description }}</p>
      <p><strong>Lieu:</strong> {{ lalesson.place }}</p>
      <p><strong>ID:</strong> {{ lesson.id }}</p>
      <p><strong>ID Lesson:</strong> {{ lesson.idLesson }}</p>
      <p><strong>Utilisateurs participants à cette leçon</strong></p>
      <ul>
        <li v-for="userId in lesson.idUsers" :key="userId">
          {{ getUserFullNameWithCondition(userId) }}
          <button class="btn btn-danger btn-sm" @click="removeStudent(userId)">Supprimer</button>
        </li>
      </ul>
    </div>

    <div v-if="loginError" class="error-message">
      Utilisateur déjà existant
    </div>

    <div v-if="showAddStudentForm" class="modal-overlay">
      <div class="modal-content">
        <label for="addUserId">Utilisateur souhaité</label>
        <select v-model="newStudent.userId" id="addUserId">
          <option v-for="user in users" :key="user.idUtilisateur" :value="user.idUtilisateur">
            {{ user.lastname }} {{ user.firstname }}
          </option>
        </select>
        <!-- Boutons Ajouter et Annuler -->
        <button class="btn btn-primary" @click="addStudent">Ajouter</button>
        <button class="btn btn-secondary" @click="cancelAddStudentForm">Annuler</button>
      </div>
    </div>

  </div>
</template>

<script>
import { apiuser, apimanagement, apiattendance } from '@/config';

export default {
  data() {
    return {
      lessonDetails: [],
      lalesson: [],
      showAddStudentForm: false,
      newStudent: {
        userId: '',
      },
      users: [],
      exemple: [], // Utilisez la liste mockée des utilisateurs
      loginError: false, // Nouvelle propriété pour gérer les erreurs de connexion

    };
  },
  mounted() {
    this.fetchUsers()
    // Appeler la fonction pour récupérer les détails de la leçon en utilisant this.$route.params.id
    this.fetchLessonDetails(this.$route.params.id);
    this.getLessonById(this.$route.params.id);
  },
  methods: {
    async fetchLessonDetails(lessonId) {
      try {
        const response = await fetch(`http://${apimanagement}/classStudents?idLesson=${lessonId}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des détails de la leçon');
        }

        const data = await response.json();
        this.lessonDetails = data;
      } catch (error) {
        console.error('Erreur lors de la récupération des détails de la leçon', error);
      }
    },
    toggleAddStudentForm() {
      this.showAddStudentForm = !this.showAddStudentForm;
    },
    cancelAddStudentForm() {
      this.showAddStudentForm = false;
    },
    addStudent() {
      console.log('Ajout d\'un nouvel étudiant localement');

      // Récupérer les détails actuels de la leçon
      const currentLessonDetails = this.lessonDetails.find(lesson => lesson.idLesson === parseInt(this.$route.params.id, 10));

      // Vérifier si l'ID de l'utilisateur existe déjà dans la liste
      const userIdToAdd = parseInt(this.newStudent.userId, 10);
      if (currentLessonDetails.idUsers.includes(userIdToAdd)) {
        console.warn('Cet utilisateur est déjà ajouté à la leçon.');
        this.showAddStudentForm = false;
        this.loginError = true;
        return; // Arrêter l'exécution si l'utilisateur est déjà dans la liste
      }

      // Créer un nouvel objet avec les valeurs actuelles
      const updatedLessonDetails = {
        id: currentLessonDetails.id,
        idLesson: currentLessonDetails.idLesson,
        idUsers: [...currentLessonDetails.idUsers, userIdToAdd],
      };

      // Envoie une requête PATCH à l'API pour mettre à jour la leçon avec les nouvelles valeurs
      fetch(`http://${apimanagement}/classStudents?idLesson=${currentLessonDetails.idLesson}`, {
        method: 'PATCH',  // Ou PATCH selon ce que l'API supporte
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedLessonDetails),
      })
        .then(response => {
          // Gérer la réponse si nécessaire
        })
        .catch(error => {
          console.error('Erreur lors de la mise à jour des étudiants de la leçon sur le serveur:', error.message);
        });
        this.showAddStudentForm = false;
    },
    removeStudent(userId) {
      console.log('Suppression de l\'utilisateur avec ID:', userId);

      const currentLessonDetails = this.lessonDetails.find(lesson => lesson.idLesson === parseInt(this.$route.params.id, 10));

      const updatedLessonDetails = {
        id: currentLessonDetails.id,
        idLesson: currentLessonDetails.idLesson,
        idUsers: currentLessonDetails.idUsers.filter(id => id !== userId),
      };

      fetch(`http://${apimanagement}/classStudents?idLesson=${currentLessonDetails.idLesson}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedLessonDetails),
      })
        .then(response => {
          // Gérer la réponse si nécessaire
        })
        .catch(error => {
          console.error('Erreur lors de la mise à jour des étudiants de la leçon sur le serveur:', error.message);
        });
    },
    async getLessonById(lessonId) {
      try {
        const response = await fetch(`http://${apimanagement}/lessons?id=${lessonId}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des détails de la leçon');
        }

        const data = await response.json();
        this.lalesson = Array.isArray(data) ? data[0] : data;
      } catch (error) {
        console.error('Erreur lors de la récupération des détails de la leçon', error);
      }
    },
    async fetchUsers() {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`http://${apiuser}:8000/user`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Ajouter le token d'authentification à l'en-tête
          },
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des utilisateurs');
        }

        const data = await response.json();
        this.users = data;
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs', error);
      }
    },
      getUserFullNameWithCondition(userId) {
    if (Array.isArray(userId)) {
      // Si userId est un tableau, utilisez map
      const userNames = userId.map(id => this.getUserFullNameWithCondition(id));
      return userNames.join(', ');
    } else {
      console.log('getUserFullNameWithCondition', userId)
      // Convertir userId en nombre
      const userIdNumber = parseInt(userId, 10);

      // Vérifier si l'ID de l'utilisateur est présent dans le tableau users
      const userExists = this.users.some(user => user.idUtilisateur === userIdNumber);

      if (userExists) {
        const user = this.users.find(user => user.idUtilisateur === userIdNumber);
        return `${user.lastname} ${user.firstname}`;
      } else {
        return 'Utilisateur inconnu';
      }
    }
  },
  },
};
</script>

<style scoped>
  /* Style pour la page de détails de la leçon */
  h2 {
    margin-bottom: 20px;
  }

  .btn-primary {
    margin-bottom: 20px;
  }

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

  /* Style pour la liste des utilisateurs participants à la leçon */
  ul {
    list-style: none;
    padding: 0;
  }

  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  /* Style pour les boutons de suppression */
  .btn-danger {
    margin-left: 10px;
  }

  .error-message {
  color: red;
  margin-top: 10px;
}
</style>