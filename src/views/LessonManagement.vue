<template>
  <div>
    <h2>Cours et Planning</h2>
    <!-- Ajoute les composants nécessaires ici -->
    <Lessonlist />
    <Studentlist />
  </div>
</template>


<script>
import Lessonlist from '../components/Lessonlist.vue';
import Studentlist from '../components/Studentlist.vue';

export default {
    components: {
    Studentlist,
    Lessonlist,
    },
};
</script>