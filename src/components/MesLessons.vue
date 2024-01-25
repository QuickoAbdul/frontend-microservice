<template>
    <div>
        <h1>Mes Lessons</h1>
        <div  class="user-details" v-if="user">
            <h2>Vos informations : </h2>
            <p> Nom:  {{ user.lastname }}</p>
            <p> Prénom:  {{ user.firstname }}</p>
            <p> Email:  {{ user.email }}</p>
            <p> Téléphone:  {{ user.phone }}</p>
            <!-- Ajoutez d'autres champs selon les besoins -->
        </div>

        <div class="lesson-details" v-for="(lesson, index) in lessons" :key="index">
    <h2 v-if="lessonsDetails[index]">Lesson {{ lessonsDetails[index].idLesson }}</h2>
    <p> Nom:  {{ lesson[0].name }}</p>
    <p> Description:  {{ lesson[0].description }}</p>
    <p>Début: {{ formatLessonDate(lesson[0].dateBegin) }}</p>
    <p>Fin: {{ formatLessonDate(lesson[0].dateEnd) }}</p>

    <!-- Affichez d'autres détails de la leçon selon les besoins -->
</div>
    </div>
</template>
    
    <script>
    export default {
        data() {
        return {
            user: null, // Le tableau qui contiendra les leçons de l'utilisateur
            lessons: null, // Le tableau qui contiendra les leçons
            lessonsDetails: null, // Le tableau qui contiendra les détails des leçons
        };
        },
        async mounted() {
        // Chargez les leçons de l'utilisateur au moment de l'initialisation du composant
        this.user = await this.fetchUsersById(this.$route.params.id);
        this.lessonsDetails = await this.fetchLessonDetails(this.$route.params.id);

        console.log('lessonsDetails after initialization:', this.lessonsDetails);

        // Convertissez lessonsDetails en un tableau
        const lessonsDetailsArray = Object.values(this.lessonsDetails);

        // Créez un tableau pour stocker les détails des leçons
        this.lessons = [];

        // Parcourez chaque leçon dans lessonsDetailsArray
        for (let detail of lessonsDetailsArray) {
            // Récupérez les détails de la leçon avec l'ID de la leçon
            const lesson = await this.fetchLessonByIdLesson(detail.idLesson);

            // Ajoutez les détails de la leçon au tableau lessons
            this.lessons.push(lesson);
        }

        console.log('lessons:', this.lessons);
        console.log('lessonsDetails:', this.lessonsDetails);
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

            return await response.json(); // Retournez l'objet de réponse
        } catch (error) {
            console.error('Erreur lors de la récupération des détails de l\'utilisateur', error);
        }
        },
        async fetchLessonDetails(userId) {
        try {
            const response = await fetch(`http://localhost:8001/classStudents?idUser=${userId}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            });

            if (!response.ok) {
            throw new Error('Erreur lors de la récupération des détails de la leçon');
            }
            return await response.json(); // Retournez l'objet de réponse

        } catch (error) {
            console.error('Erreur lors de la récupération des détails de la leçon', error);
        }
        },
        async fetchLessonByIdLesson(idLesson) {
        try {
            const response = await fetch(`http://localhost:8001/lessons?id=${idLesson}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            });

            if (!response.ok) {
            throw new Error('Erreur lors de la récupération des détails de la leçon');
            }
            return await response.json(); // Retournez l'objet de réponse

        } catch (error) {
            console.error('Erreur lors de la récupération des détails de la leçon', error);
        }
        },
        formatLessonDate(isoDate) {
        const date = new Date(isoDate);
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            timeZoneName: 'short',
        };
        return date.toLocaleDateString('fr-FR', options);
        },
        
        },
    };
    </script>
    
    <style scoped>
    body {
        font-family: Arial, sans-serif;
    }
    
    h1 {
        color: #333;
        text-align: center;
        margin-bottom: 20px;
    }
    
    p {
        color: #666;
        margin: 5px 0;
    }
    
    div {
        margin-bottom: 20px;
    }
    
    h2 {
        color: #444;
        margin-top: 20px;
    }
    
    /* Style pour les détails de l'utilisateur */
    .user-details {
        background-color: #f9f9f9;
        padding: 20px;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    
    /* Style pour les détails de la leçon */
    .lesson-details {
        background-color: #fff;
        padding: 20px;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    </style>