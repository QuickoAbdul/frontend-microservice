<!-- Login.vue -->
<template>
    <div>
      <h2>Page de connexion</h2>
      <form @submit.prevent="submitForm">
        <label for="email">email:</label>
        <input v-model="email" type="text" id="email" required>
  
        <label for="password">Mot de passe:</label>
        <input v-model="password" type="password" id="password" required>
  
        <div v-if="loginError" class="error-message">
        Erreur lors de la connexion. Veuillez vérifier vos informations.
        </div>

        <button type="submit">Se connecter</button>
        <button v-if="token" @click="logout">Se déconnecter</button>

      </form>
    </div>
  </template>
  
  <script>
export default {
  data() {
    return {
      email: 'user3@gmail.com', // Initialisez avec la valeur par défaut
      password: '12345678', // Initialisez avec la valeur par défaut
      token: null,
      loginError: false, // Nouvelle propriété pour gérer les erreurs de connexion

    };
  },
  methods: {
    submitForm() {
      this.loginError = false;

      const loginData = {
        email: this.email,
        password: this.password,
      };

      const queryString = new URLSearchParams(loginData).toString();

      fetch(`http://localhost:8000/login?${queryString}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Erreur lors de la connexion');
          }
          return response.json();
        })
        .then(data => {
          localStorage.setItem('token', data.token);
          const decodedToken = this.decodeToken(data.token);
          console.log(decodedToken);
          this.token = data.token;
              // Redirection en fonction du rôle de l'utilisateur
          if (decodedToken.user.idRole === 1) {
            // Rôle 1, rediriger vers la page des utilisateurs
            this.$router.push('/users');
          } else if (decodedToken.user.idRole === 3) {
            // Rôle 3, rediriger vers la page des leçons
            this.$router.push({ name: 'meslessons', params: { id: decodedToken.user.id } });
          } else {
            // Gérer d'autres cas selon vos besoins
            console.error('Rôle non géré');
          }
        })
        .catch(error => {
          console.error('Erreur lors de la connexion', error);
          this.loginError = true; // Définir loginError à true en cas d'erreur de connexion
          // En cas d'échec de la connexion, effacer le token du localStorage
          localStorage.removeItem('token');
        });
    },
    decodeToken(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(atob(base64));
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
  /*created() {
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
    },*/
};

  </script>
  
  <style scoped>
.error-message {
  color: red;
  margin-top: 10px;
}
</style>