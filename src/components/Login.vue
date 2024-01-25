<!-- Login.vue -->
<template>
    <div>
<body class="bg-gradient-primary">
<div class="container">
    <!-- Outer Row -->
    <div class="row justify-content-center">
        <div class="col-xl-10 col-lg-12 col-md-9">
            <div class="card o-hidden border-0 shadow-lg my-5">
                <div class="card-body p-0">
                    <!-- Nested Row within Card Body -->
                    <div class="row">
                        <div class="col-lg-6 d-none d-lg-block bg-login-image"></div>
                        <div class="col-lg-6">
                            <div class="p-5">
                                <div class="text-center">
                                    <h1 class="h4 text-gray-900 mb-4">Welcome Back!</h1>
                                </div>
                                <form class="user" @submit.prevent="submitForm">
                                    <div for="email" class="form-group">
                                        <input v-model="email" type="text" class="form-control form-control-user" id="email" aria-describedby="emailHelp" placeholder="Enter Email Address...">
                                    </div>
                                    <div  for="password" class="form-group">
                                        <input  v-model="password" type="password" class="form-control form-control-user" id="password" placeholder="Password">
                                    </div>
                                    <div v-if="loginError" class="error-message">
                                    Erreur lors de la connexion. Veuillez vérifier vos informations.
                                    </div>

                                    <div class="form-group">
                                        <div class="custom-control custom-checkbox small">
                                            <input type="checkbox" class="custom-control-input" id="customCheck">
                                            <label class="custom-control-label" for="customCheck">Remember
                                                Me</label>
                                        </div>
                                    </div>
                                    <button type="submit" class="btn btn-primary btn-user btn-block">Se connecter</button>
                                    <button v-if="token" @click="logout">Se déconnecter</button>
                                    <hr>
                                </form>
                                <hr>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

</body>     
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