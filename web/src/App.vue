<template>
  <div class="page-container">
    <md-app>
      <md-app-toolbar class="md-primary">
        <span class="md-title">Gitlab Milestone Viewer 🦊</span>
      </md-app-toolbar>

      <md-app-content>
        <Milestones/>
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
import Milestones from './components/Milestones'

export default {
  name: 'App',
  components: {
    Milestones
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
