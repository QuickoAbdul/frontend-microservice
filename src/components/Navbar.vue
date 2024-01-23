<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <router-link to="/" class="navbar-brand">Mon Projet</router-link>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">
        <li class="nav-item">
          <router-link to="/users" class="nav-link">Gestion Utilisateur</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/lessons" class="nav-link">Cours & Planning</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/attendance" class="nav-link">Présence</router-link>
        </li>
      </ul>
    </div>

    <div class="ml-auto">
  <span v-if="isLoggedIn" class="nav-link">{{ firstname }}</span>
  <router-link v-if="isLoggedIn" @click.prevent="logout" class="nav-link" to="#">Déconnexion</router-link>
  <router-link v-else to="/" class="nav-link">Connexion</router-link>
</div>

  </nav>
</template>

<script>
export default {
  name: 'Navbar',
  data() {
    return {
      isLoggedIn: false,
    };
  },
  methods: {
    // ... autres méthodes du composant ...

    logout() {
      // Effacez le token du localStorage
      localStorage.removeItem('token');
      
      // Mettez à jour la propriété isLoggedIn dans le composant
      this.isLoggedIn = false;
      this.firstname = null;


      // Redirigez l'utilisateur vers la page de déconnexion (ou une autre page selon vos besoins)
      this.$router.push('/'); // Assurez-vous que vous avez configuré le routeur Vue.js
    },
  },
  created() {
    // Vérifiez si l'utilisateur est connecté lors de la création du composant
    const storedToken = localStorage.getItem('token');

    if (storedToken) {
      // Décoder le token pour obtenir les informations de l'utilisateur
      const decodedToken = JSON.parse(atob(storedToken.split('.')[1]));
      
      // Mettre à jour les propriétés dans le composant
      this.isLoggedIn = true;
      this.firstname = decodedToken.firstname; // Assurez-vous que le nom d'utilisateur est présent dans le token
    }
  },
};
</script>

<style scoped>
/* Styles spécifiques au composant, si nécessaire */
</style>
