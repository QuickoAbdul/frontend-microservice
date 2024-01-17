<template>
    <div>
      <h2>État des Présences</h2>
      <!-- Ajoute les composants nécessaires ici -->
      <AttendanceList />
    </div>
  </template>

<script>
import AttendanceList from '@/components/AttendanceList.vue';

export default {
    components: {
    AttendanceList,
    },
};
</script>