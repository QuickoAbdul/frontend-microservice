<template>
  <div>
    <h2>Cours et Planning</h2>
    <!-- Ajoute les composants nécessaires ici -->
    <Lessonlist />
  </div>
</template>


<script>
import Lessonlist from '../components/Lessonlist.vue';
    
export default {
    components: {
    Lessonlist,
    },
};
</script>