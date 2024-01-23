<template>
  <div>
    <h1>Liste des utilisateurs</h1>
    <button class="btn btn-success" @click="toggleAddForm">Ajouter un utilisateur</button>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">Nom</th>
          <th scope="col">Prénom</th>
          <th scope="col">Email</th>
          <th scope="col">Roles</th>
          <th scope="col">Téléphone</th>
          <th scope="col">Actions</th>
          <th scope="col">Actions</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.idUtilisateur">
          <td><strong>{{ user.lastname }}</strong></td>
          <td>{{ user.firstname }}</td>
          <td>{{ user.email }}</td>
          <td>{{ mapRoleIdToRoleName(user.idRole) }}</td>
          <td>{{ user.phone }}</td>
          <td>
            <button class="btn btn-danger" @click="deleteUser(user.idUtilisateur)">Supprimer</button>
          </td>
          <td>
            <button class="btn btn-warning" @click="showEditModal(user)" >Modifier</button>
          </td>
          <td>
            <button class="btn btn-primary" @click="seeLesson(user.idUtilisateur)" >Voir</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <!-- Champs d'édition -->
        <label for="editLastName">Nom:</label>
        <input type="text" id="editLastName" v-model="selectedUser.lastname">

        <label for="editFirstName">Prénom:</label>
        <input type="text" id="editFirstName" v-model="selectedUser.firstname">

        <label for="editEmail">Email:</label>
        <input type="text" id="editEmail" v-model="selectedUser.email">

        <label for="editPhone">Téléphone:</label>
        <input type="text" id="editPhone" v-model="selectedUser.phone">

        <!-- Boutons Appliquer et Annuler -->
        <button class="btn btn-primary" @click="applyChanges">Appliquer</button>
        <button class="btn btn-secondary" @click="cancelChanges">Annuler</button>
      </div>
    </div>

    <div v-if="showAddForm" class="modal-overlay">
      <div class="modal-content">
        <!-- Champs d'ajout -->
        <label for="addidRole">IdRole:</label>
        <input type="text" id="addidRole" v-model="newUser.idRole">

        <label for="addLastName">Nom:</label>
        <input type="text" id="addLastName" v-model="newUser.lastname">

        <label for="addFirstName">Prénom:</label>
        <input type="text" id="addFirstName" v-model="newUser.firstname">

        <label for="addPhone">Téléphone:</label>
        <input type="text" id="addPhone" v-model="newUser.phone">

        <label for="addEmail">Email:</label>
        <input type="text" id="addEmail" v-model="newUser.email">

        <label for="addPassword">Mot de passe: (8 Caractères)</label>
        <input type="text" id="addPassword" v-model="newUser.password">

        <!-- Boutons Ajouter et Annuler -->
        <button class="btn btn-primary" @click="addUser">Ajouter</button>
        <button class="btn btn-secondary" @click="cancelAddForm">Annuler</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      users: [],
      showModal: false,
      selectedUser: null,
      showAddForm: false,
      newUser: {
        idRole: '',
        lastname: '',
        firstname: '',
        phone: '',
        email: '',
        password:'',
      },
    };
  },
  mounted() {
    this.fetchUsers();
    
  },
  methods: {
     

    //MicroService User à décommenter une fois connecté à la BDD
    async fetchUsers() {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://127.0.0.1:8000/user', {
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
    formatDate(dateString) {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', options);
    },
    deleteUser(userId) {
      const token = localStorage.getItem('token');
      const index = this.users.findIndex(user => user.idUtilisateur === userId);
      if (index !== -1) {
        this.users.splice(index, 1);

        fetch(`http://127.0.0.1:8000/user/${userId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Ajouter le token d'authentification à l'en-tête
          },
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Erreur lors de la suppression de l\'utilisateur');
          }
          return response.json();
        })
        .then(data => {
          console.log(`Utilisateur avec l'ID ${userId} supprimé avec succès sur le serveur`);
        })
        .catch(error => {
          console.error('Erreur lors de la suppression de l\'utilisateur sur le serveur:', error.message);
        });
      } else {
        console.error(`Utilisateur avec l'ID ${userId} non trouvé localement`);
      }
    },
    showEditModal(user) {
      this.selectedUser = user;
      this.showModal = true;
    },
    cancelChanges() {
      console.log('Modifications annulées');
      this.showModal = false;
    },
    applyChanges() {
      console.log('Modifications appliquées localement');
      const userId = this.selectedUser.idUtilisateur;

      fetch(`http://127.0.0.1:8000/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lastname: this.selectedUser.lastname,
          firstname: this.selectedUser.firstname,
          email: this.selectedUser.email,
          phone: this.selectedUser.phone,
        }),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erreur lors de la modification de l\'utilisateur');
        }
        return response.json();
      })
      .then(data => {
        console.log(`Utilisateur avec l'ID ${userId} modifié avec succès sur le serveur`);
      })
      .catch(error => {
        console.error('Erreur lors de la modification de l\'utilisateur sur le serveur:', error.message);
      });

      this.showModal = false;
    },
    toggleAddForm() {
      this.showAddForm = !this.showAddForm;
    },
    cancelAddForm() {
      this.showAddForm = false;
    },
    addUser() {
      console.log('Ajout d\'un nouvel utilisateur localement');
      const token = localStorage.getItem('token');

      fetch('http://127.0.0.1:8000/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Ajouter le token d'authentification à l'en-tête
        },
        body: JSON.stringify(this.newUser),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erreur lors de l\'ajout de l\'utilisateur');
        }
        return response.json();
      })
      .then(data => {
        console.log('Nouvel utilisateur ajouté avec succès sur le serveur');
        this.showAddForm = false;
        this.fetchUsers();
      })
      .catch(error => {
        console.error('Erreur lors de l\'ajout de l\'utilisateur sur le serveur:', error.message);
      });
      console.log(this.newUser)
    },
    mapRoleIdToRoleName(roleId) {
    switch (roleId) {
      case 1:
        return 'Administrateur';
      case 2:
        return 'Enseignant';
      case 3:
        return 'Élève';
      default:
        return 'Inconnu';
    }
    },
    seeLesson(lessonId) {
      console.log(`Tentative de voir le cours avec l'ID ${lessonId}`);
      this.$router.push({ name: 'user-details', params: { id: lessonId } });
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
}</style>
