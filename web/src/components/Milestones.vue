<template>
  <div class="hello">
  </div>
</template>

<script>
import 'axios'
export default {
  name: 'Milestones',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods: {
    getMilestones: function () {
      console.log(JSON.stringify(process.env))
    }
  },
  beforeMount () {
    this.getMilestones()
  }
}
</script>

<style scoped>

</style>
