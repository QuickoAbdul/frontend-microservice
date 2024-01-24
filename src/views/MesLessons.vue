<template>
    <h2>
        Mes prochaines leçons
        <MesLessons/>
    </h2>
</template>

<script>
import MesLessons from '../components/MesLessons.vue';

export default {
    components: {
        MesLessons,
    },
}
</script>