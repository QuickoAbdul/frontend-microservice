<template>
    <div>
      <h2>Détails de l'utilisateur</h2>
      <div v-if="userDetails">
        <p><strong>ID:</strong> {{ userDetails.idUtilisateur }}</p> 
        <p><strong>Nom:</strong> {{ userDetails.lastname }}</p>
        <p><strong>Prénom:</strong> {{ userDetails.firstname }}</p>
        <p><strong>Email:</strong> {{ userDetails.email }}</p>
        <p><strong>Téléphone:</strong> {{ userDetails.phone }}</p>
        <!-- Ajoutez d'autres champs selon les besoins -->
      </div>
    </div>

  </template>

  <script>
    export default {
    data() {
        return {
        userDetails: [],
        userLessons: [],
        };
    },
    mounted() {
        this.fetchUsersById(this.$route.params.id);
    },
    methods: {
    async fetchUsersById(userId) {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`http://127.0.0.1:8000/user/${userId}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        });

        if (!response.ok) {
        throw new Error('Erreur lors de la récupération des détails de l\'utilisateur');
        }

        const data = await response.json();
        this.userDetails = data;
    } catch (error) {
        console.error('Erreur lors de la récupération des détails de l\'utilisateur', error);
    }
    },
    },
    };

</script>