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
            <p><strong>Utilisateurs affectés:</strong></p>
            <ul>
            <li v-for="userId in lesson.idUsers" :key="userId">
                {{ getUserFullName(userId) }}
                <button class="btn btn-danger btn-sm" @click="removeStudent(userId)">Supprimer</button> 
            </li>
            </ul>
        </div>

        <div v-if="showAddStudentForm" class="modal-overlay">
        <div class="modal-content">
        <label for="addUserId">Utilisateur souhaité</label>
        <select v-model="newStudent.userId" id="addUserId">
        <option v-for="user in availableUsers" :key="user.idUtilisateur" :value="user.idUtilisateur">
            {{ user.lastname }} {{ user.firstname }}
        </option>
        </select>
        <!-- Autres champs si nécessaire -->

        <!-- Boutons Ajouter et Annuler -->
        <button class="btn btn-primary" @click="addStudent">Ajouter</button>
        <button class="btn btn-secondary" @click="cancelAddStudentForm">Annuler</button>
    </div>
    </div>
        </div>
    </template>
    
    <script>
    import { usersmocks } from '../mocks/user.js';

    export default {
        data() {
        return {
            lessonDetails: [],
            lalesson: [],
            showAddStudentForm: false,
            newStudent: {
            userId: '', 
            },
            availableUsers: usersmocks, // Utilisez la liste mockée des utilisateurs
        };
        },
        mounted() {
        // Appeler la fonction pour récupérer les détails de la leçon en utilisant this.$route.params.id
        this.fetchLessonDetails(this.$route.params.id);
        this.getLessonById(this.$route.params.id);

        },
        methods: {
        async fetchLessonDetails(lessonId) {
            try {
            const response = await fetch(`http://127.0.0.1:8001/classStudents?idLesson=${lessonId}`, {
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
        getUserFullName(userId) {
            //Lier avec l'API de Mathéo
            if (Array.isArray(userId)) {
            // Si userId est un tableau, utilisez map
            const users = userId.map(id => usersmocks.find(user => user.idUtilisateur === id));
            return users.map(user => (user ? `${user.lastname} ${user.firstname}` : 'Utilisateur inconnu')).join(', ');
            } else {
                // Sinon, userId est un ID unique
                const user = usersmocks.find(user => user.idUtilisateur === userId);
                return user ? `${user.lastname} ${user.firstname}` : 'Utilisateur inconnu';
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
      console.log('Current Lesson Details:', currentLessonDetails);

      // Vérifier si l'ID de l'utilisateur existe déjà dans la liste
      const userIdToAdd = parseInt(this.newStudent.userId, 10);
      if (currentLessonDetails.idUsers.includes(userIdToAdd)) {
        console.warn('Cet utilisateur est déjà ajouté à la leçon.');
        return; // Arrêter l'exécution si l'utilisateur est déjà dans la liste
      }

      // Créer un nouvel objet avec les valeurs actuelles
      const updatedLessonDetails = {
        id: currentLessonDetails.id,
        idLesson: currentLessonDetails.idLesson,
        idUsers: [...currentLessonDetails.idUsers, userIdToAdd],
      };
      console.log('Updated Lesson Details:', updatedLessonDetails);

      // Envoie une requête PATCH à l'API pour mettre à jour la leçon avec les nouvelles valeurs
      console.log('Envoi de la requête :', updatedLessonDetails);
      fetch(`http://127.0.0.1:8001/classStudents?idLesson=${currentLessonDetails.idLesson}`, {
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
        },
        removeStudent(userId) {
      console.log('Suppression de l\'utilisateur avec ID:', userId);

      const currentLessonDetails = this.lessonDetails.find(lesson => lesson.idLesson === parseInt(this.$route.params.id, 10));

      const updatedLessonDetails = {
        id: currentLessonDetails.id,
        idLesson: currentLessonDetails.idLesson,
        idUsers: currentLessonDetails.idUsers.filter(id => id !== userId),
      };

      console.log('Updated Lesson Details:', updatedLessonDetails);

      fetch(`http://127.0.0.1:8001/classStudents?idLesson=${currentLessonDetails.idLesson}`, {
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
            const response = await fetch(`http://127.0.0.1:8001/lessons?id=${lessonId}`, {
                headers: {
                'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des détails de la leçon');
            }
    
            const data = await response.json();
            this.lalesson = Array.isArray(data) ? data[0] : data;
            console.log(this.lalesson)
            } catch (error) {
            console.error('Erreur lors de la récupération des détails de la leçon', error);
            }
        }
    },
    };
    </script>
    
    <style scoped>
    
    </style>
    