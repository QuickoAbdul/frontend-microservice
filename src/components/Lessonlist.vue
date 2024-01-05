<template>
  <div>
    <h1>Liste des cours</h1>
    <button class="btn btn-success" @click="toggleAddForm">Ajouter une leçon</button>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">Nom</th>
          <th scope="col">Description</th>
          <th scope="col">Date et Heure</th>
          <th scope="col">Lieu</th>
          <th scope="col">Actions</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="lesson in lessons" :key="lesson.id">
          <td><strong>{{ lesson.name }}</strong></td>
          <td>{{ lesson.description }}</td>
          <td>{{ formatDate(lesson.dateBegin) }} - {{ formatDate(lesson.dateEnd) }}</td>
          <td>{{ lesson.place }}</td>
          <td>
            <button class="btn btn-danger" @click="deleteLesson(lesson.id)">Supprimer</button>
          </td>
          <td>
            <button class="btn btn-warning" @click="showEditModal(lesson)" >Modifier</button>
          </td>
        </tr>
      </tbody>
    </table>

  <div v-if="showModal" class="modal-overlay">
    <div class="modal-content">
      <!-- Champs d'édition -->
      <label for="editName">Nom:</label>
      <input type="text" id="editName" v-model="selectedLesson.name">

      <label for="editDescription">Description:</label>
      <textarea id="editDescription" v-model="selectedLesson.description"></textarea>

      <label for="editDateBegin">Date et Heure début:</label>
      <input type="datetime-local" id="editDateBegin" v-model="selectedLesson.dateBegin">

      <label for="editDateEnd">Date et Heure fin:</label>
      <input type="datetime-local" id="editDateEnd" v-model="selectedLesson.dateEnd">

      <label for="editPlace">Lieu:</label>
      <input type="text" id="editPlace" v-model="selectedLesson.place">

      <!-- Boutons Appliquer et Annuler -->
      <button class="btn btn-primary" @click="applyChanges">Appliquer</button>
      <button class="btn btn-secondary" @click="cancelChanges">Annuler</button>
    </div>
  </div>

  <div v-if="showAddForm"   class="modal-overlay">
      <div class="modal-content">
        <label for="addIdteacher">idteacher(Temporaire):</label> <!-- A modifier car il faut relier les MicroServices -->
        <input type="text" id="addIdTeacher" v-model="newLesson.idTeacher">

        <label for="addName">Nom:</label>
        <input type="text" id="addName" v-model="newLesson.name">

        <label for="addDescription">Description:</label>
        <textarea id="addDescription" v-model="newLesson.description"></textarea>

        <label for="addDateBegin">Date et Heure début:</label>
        <input type="datetime-local" id="addDateBegin" v-model="newLesson.dateBegin">

        <label for="addDateEnd">Date et Heure fin:</label>
        <input type="datetime-local" id="addDateEnd" v-model="newLesson.dateEnd">

        <label for="addPlace">Lieu:</label>
        <input type="text" id="addPlace" v-model="newLesson.place">

        <!-- Boutons Ajouter et Annuler -->
        <button class="btn btn-primary" @click="addLesson">Ajouter</button>
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
        showModal: false,
        selectedLesson: null,
        showAddForm: false,
        newLesson: {
          idTeacher: '',
          name: '',
          description: '',
          dateBegin: '',
          dateEnd: '',
          place: '',
      },
      };
    },
    mounted() {
      this.fetchLessons();
    },
    methods: {
      async fetchLessons() {
        try {
          const response = await fetch('http://127.0.0.1:8000/lessons', {
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
      deleteLesson(lessonId) {
        console.log(`Tentative de suppression du cours avec l'ID ${lessonId}`);
        const index = this.lessons.findIndex(lesson => lesson.id === lessonId);
        if (index !== -1) {
          this.lessons.splice(index, 1);

          console.log(`Cours avec l'ID ${lessonId} supprimé localement avec succès`);

          fetch(`http://127.0.0.1:8000/lessons?id=${lessonId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          })
          .then(response => {
            if (!response.ok) {
              throw new Error('Erreur lors de la suppression du cours');
            }
            return response.json();
          })
          .then(data => {
            console.log(`Cours avec l'ID ${lessonId} supprimé avec succès sur le serveur`);
          })
          .catch(error => {
            console.error('Erreur lors de la suppression du cours sur le serveur:', error.message);
          });
        } else {
          console.error(`Cours avec l'ID ${lessonId} non trouvé localement`);
        }
      },

    showEditModal(lesson) {
      this.selectedLesson = lesson;
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

    const lessonId = this.selectedLesson.id;

    // Envoie une requête PATCH à l'API pour mettre à jour le cours
    fetch(`http://127.0.0.1:8000/lessons?id=${lessonId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idTeacher: this.selectedLesson.idTeacher,
        name: this.selectedLesson.name,
        description: this.selectedLesson.description,
        dateBegin: this.selectedLesson.dateBegin,
        dateEnd: this.selectedLesson.dateEnd,
        place: this.selectedLesson.place,
      }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erreur lors de la modification du cours');
      }
      return response.json();
    })
    .then(data => {
      console.log(`Cours avec l'ID ${lessonId} modifié avec succès sur le serveur`);
    })
    .catch(error => {
      console.error('Erreur lors de la modification du cours sur le serveur:', error.message);
    });

    this.showModal = false; // Ferme la modal après la modification
  },
    toggleAddForm() {
      this.showAddForm = !this.showAddForm;
    },
    cancelAddForm() {
      this.showAddForm = false;
    },
    addLesson() {
      // Logique pour ajouter la nouvelle leçon
      console.log('Ajout d\'une nouvelle leçon localement');
      // Envoie une requête POST à l'API pour ajouter la nouvelle leçon
      fetch('http://127.0.0.1:8000/lessons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.newLesson),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erreur lors de l\'ajout de la leçon');
        }
        return response.json();
      })
      .then(data => {
        console.log('Nouvelle leçon ajoutée avec succès sur le serveur');
        this.showAddForm = false; // Ferme le formulaire après l'ajout
        this.fetchLessons(); // Rafraîchit la liste des leçons
      })
      .catch(error => {
        console.error('Erreur lors de l\'ajout de la leçon sur le serveur:', error.message);
      });
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
  