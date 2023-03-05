<template>
  <div class="home">
    
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Scene1 from "./Scene1"
import Scene2 from "./Scene2"
import Scene3 from "./Scene3"

export default defineComponent({
  name: 'HomeView',
  mounted(){
    new Scene3(this.$el)
  },
  components: {

  }
});
</script>
