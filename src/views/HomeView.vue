<template>
  <div class="home">
    
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Scene from "./Scene"

export default defineComponent({
  name: 'HomeView',
  mounted(){
    new Scene(this.$el)
  },
  components: {

  }
});
</script>
