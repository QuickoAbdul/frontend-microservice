<template>
  <div class="container mt-4">
    <h1>Liste des cours</h1>
    <button class="btn btn-success mb-3" @click="toggleAddForm">Ajouter une leçon</button>

    <div v-for="week in lessonsByWeek" :key="week.weekNumber">
      <h3>Semaine {{ week.weekNumber }}</h3>

      <div class="row">
        <div v-for="day in week.days" :key="day.date" class="col-md-4 mb-3">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">{{ day.date }}</h5>
              <div v-for="lesson in day.lessons" :key="lesson.id">
                <p class="card-text"><strong>{{ lesson.name }}</strong></p>
                <p class="card-text">{{ lesson.description }}</p>
                <p class="card-text"><strong>Date:</strong> {{ formatDate(lesson.dateBegin) }} - {{
                  formatDate(lesson.dateEnd) }}</p>
                <p class="card-text"><strong>Lieu:</strong> {{ lesson.place }}</p>
                <div class="btn-group" role="group">
                  <button class="btn btn-danger" @click="deleteLesson(lesson.id)">Supprimer</button>
                  <button class="btn btn-warning" @click="showEditModal(lesson)">Modifier</button>
                  <button class="btn btn-primary" @click="seeLesson(lesson.id)">Voir</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <!-- Champs d'édition -->
        <label for="editName">Nom:</label>
        <input class="form-control" type="text" id="editName" v-model="selectedLesson.name">

        <label for="editDescription">Description:</label>
        <textarea class="form-control" id="editDescription" v-model="selectedLesson.description"></textarea>

        <label for="editDateBegin">Date et Heure début:</label>
        <input class="form-control" type="datetime-local" id="editDateBegin" v-model="selectedLesson.dateBegin">

        <label for="editDateEnd">Date et Heure fin:</label>
        <input class="form-control" type="datetime-local" id="editDateEnd" v-model="selectedLesson.dateEnd">

        <label for="editPlace">Lieu:</label>
        <input class="form-control" type="text" id="editPlace" v-model="selectedLesson.place">

        <!-- Boutons Appliquer et Annuler -->
        <button class="btn btn-primary mt-3" @click="applyChanges">Appliquer</button>
        <button class="btn btn-secondary mt-3" @click="cancelChanges">Annuler</button>
      </div>
    </div>

    <div v-if="showAddForm" class="modal-overlay">
      <div class="modal-content modal-form">
        <h3>Ajouter un cours</h3>
        <!-- Champs pour ajouter une nouvelle leçon -->
        <label for="addIdTeacher">idteacher (Temporaire):</label>
        <input class="form-control" type="text" id="addIdTeacher" v-model="newLesson.idTeacher">

        <label for="addName">Nom:</label>
        <input class="form-control" type="text" id="addName" v-model="newLesson.name">

        <label for="addDescription">Description:</label>
        <textarea class="form-control" id="addDescription" v-model="newLesson.description"></textarea>

        <div class="row">
          <div class="col-md-6">
            <label for="addDateBegin">Date et Heure début:</label>
            <input class="form-control" type="datetime-local" id="addDateBegin" v-model="newLesson.dateBegin">
          </div>
          <div class="col-md-6">
            <label for="addDateEnd">Date et Heure fin:</label>
            <input class="form-control" type="datetime-local" id="addDateEnd" v-model="newLesson.dateEnd">
          </div>
        </div>

        <label for="addPlace">Lieu:</label>
        <input class="form-control" type="text" id="addPlace" v-model="newLesson.place">

        <!-- Boutons Ajouter et Annuler -->
        <div class="button-container mt-3">
          <button class="btn btn-primary" @click="addLesson">Ajouter</button>
          <button class="btn btn-secondary" @click="cancelAddForm">Annuler</button>
        </div>
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
  computed: {
    lessonsByWeek() {
      const lessonsByWeek = {};

      this.lessons.forEach(lesson => {
        const weekNumber = this.getWeekNumber(new Date(lesson.dateBegin));
        const weekKey = `week${weekNumber}`;

        if (!lessonsByWeek[weekKey]) {
          lessonsByWeek[weekKey] = {
            weekNumber,
            days: {},
          };
        }

        const dayKey = lesson.dateBegin.substring(0, 10);

        if (!lessonsByWeek[weekKey].days[dayKey]) {
          lessonsByWeek[weekKey].days[dayKey] = {
            date: this.formatDate(new Date(lesson.dateBegin)),
            lessons: [],
          };
        }

        lessonsByWeek[weekKey].days[dayKey].lessons.push(lesson);
      });

      return Object.values(lessonsByWeek);
    },
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

        this.lessons = data.sort((a, b) => new Date(a.dateBegin) - new Date(b.dateBegin));
      } catch (error) {
        console.error('Erreur lors de la récupération des cours', error);
      }
    },
    getWeekNumber(date) {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() + 4 - (d.getDay() || 7));
      const yearStart = new Date(d.getFullYear(), 0, 1);
      return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    },
    formatDate(dateString) {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', options);
    },
    deleteLesson(lessonId) {
      const index = this.lessons.findIndex(lesson => lesson.id === lessonId);

      if (index !== -1) {
        this.lessons.splice(index, 1);

        fetch(`http://127.0.0.1:8001/lessons?id=${lessonId}`, {
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
      console.log('Modifications annulées');
      this.showModal = false;
    },
    applyChanges() {
      // Logique pour appliquer les modifications
      console.log('Modifications appliquées localement');

      const lessonId = this.selectedLesson.id;

      // Envoie une requête PATCH à l'API pour mettre à jour le cours
      fetch(`http://127.0.0.1:8001/lessons?id=${lessonId}`, {
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
      fetch('http://127.0.0.1:8001/lessons', {
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
    seeLesson(lessonId) {
      console.log(`Tentative de voir le cours avec l'ID ${lessonId}`);
      this.$router.push({ name: 'lesson-details', params: { id: lessonId } });
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

.modal-form {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  max-width: 400px; /* Ajustez la largeur selon vos besoins */
  margin: auto;
}

.button-container {
  display: flex;
  justify-content: space-between;
}
</style>
  