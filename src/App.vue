<script>
import Navbar from './components/Navbar.vue';
import Userlist from './components/Userlist.vue';

export default {
  components: {
    Userlist,
    Navbar,
  },
};
  
</script>

<template>
  <div>
    <Navbar />
    <router-view></router-view>
  </div>
</template>

<style>

</style>