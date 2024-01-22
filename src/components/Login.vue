<!-- Login.vue -->
<template>
    <div>
      <h2>Page de connexion</h2>
      <form @submit.prevent="submitForm">
        <label for="email">email:</label>
        <input v-model="email" type="text" id="email" required>
  
        <label for="password">Mot de passe:</label>
        <input v-model="password" type="password" id="password" required>
  
        <button type="submit">Se connecter</button>
        <button v-if="token" @click="logout">Se déconnecter</button>

      </form>
    </div>
  </template>
  
  <script>
export default {
  data() {
    return {
      email: 'john.doe@example.com', // Initialisez avec la valeur par défaut
      password: 'motdepasse123', // Initialisez avec la valeur par défaut
      token: null,
    };
  },
  methods: {
    submitForm() {
      const loginData = {
        email: this.email,
        password: this.password,
      };

      const queryString = new URLSearchParams(loginData).toString();

      fetch(`http://localhost:8000/login?${queryString}`)
        .then(response => response.json())
        .then(data => {
          // Stocker le token dans le localStorage
          localStorage.setItem('token', data.token);

          // Mettre à jour la propriété token dans le composant
          this.token = data.token;

          // Rediriger l'utilisateur vers la page "user" après la connexion
          this.$router.push('/users'); // Assurez-vous que vous avez configuré le routeur Vue.js
        })
        .catch(error => {
          // Gérer les erreurs ici
          console.error(error);
        });
    },
    checkIfLoggedIn() {
      // Vérifier si le token est déjà présent dans le localStorage
      const storedToken = localStorage.getItem('token');

      // Mettre à jour la propriété token dans le composant
      this.token = storedToken;

      // Retourner true si l'utilisateur est connecté, false sinon
      return !!storedToken;
    },
  },
  created() {
    // Appeler la méthode pour vérifier si l'utilisateur est connecté
    const isLoggedIn = this.checkIfLoggedIn();

    // Si l'utilisateur est déjà connecté, rediriger vers la page "user"
    if (isLoggedIn) {
      this.$router.push('/users'); // Assurez-vous que vous avez configuré le routeur Vue.js
    }
  },
  logout() {
      // Effacez le token du localStorage
      localStorage.removeItem('token');
      // Mettez à jour la propriété token dans le composant
      this.token = null;
      // Redirigez l'utilisateur vers la page de déconnexion (ou une autre page selon vos besoins)
      this.$router.push('/logout'); // Assurez-vous que vous avez configuré le routeur Vue.js
    },
};

  </script>
  