<template>
  <div>
    <md-card md-with-hover v-for="ms in milestones" v-bind:key="ms.id">
      <md-card-header>
        <div class="md-title">{{ ms.title }}</div>
        <div class="md-subhead">{{ ms.start_date | formatDate }} ➡️ {{ ms.due_date | formatDate }}</div>
      </md-card-header>

      <md-card-content v-html="ms.md"></md-card-content>
    </md-card>
  </div>
</template>

<script>
import axios from 'axios'
import mdIt from 'markdown-it'
import mdCheckbox from 'markdown-it-checkbox'

const md = mdIt().use(mdCheckbox)

export default {
  name: 'Milestones',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      milestones: []
    }
  },
  methods: {
    getMilestones: function () {
      axios.get('https://gitlab.com/api/v4/groups/2851568/milestones', {
        headers: {
          'PRIVATE-TOKEN': process.env.GITLAB_ACCESS_KEY
        }})
        .then(res => {
          this.milestones = res.data
            .map(ms => Object.assign(ms, {md: md.render(ms.description)}))
        })
    }
  },
  beforeMount () {
    this.getMilestones()
  },
  filters: {
    formatDate: function (value) {
      if (value) {
        const date = new Date(value)
        return date.toLocaleDateString(['de-DE'], {month: '2-digit', day: '2-digit', year: '2-digit'})
      }
    }
  }
}
</script>

<style scoped>
.md-card {
    width: 320px;
    margin: 4px;
    display: inline-block;
    vertical-align: top;
  }
</style>
