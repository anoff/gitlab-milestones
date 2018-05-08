<template>
  <div>
    <form novalidate class="md-layout" v-on:submit.prevent="getMilestones">
      <md-card class="md-layout-item md-size-50 md-small-size-100">
        <md-card-header>
          <div class="md-title">API</div>
        </md-card-header>

        <md-card-content>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field>
                <label for="api-token">API Token</label>
                <md-input name="api-token" id="api-token" autocomplete="given-name" v-model="form.apiToken" :disabled="isLoading" />
              </md-field>
            </div>

            <div class="md-layout-item md-small-size-100">
              <md-field>
                <label for="api-url">API Endpoint</label>
                <md-input name="api-url" id="api-url" autocomplete="family-name" v-model="form.apiUrl" :disabled="isLoading" />
              </md-field>
            </div>
          </div>
        </md-card-content>
        <md-progress-bar md-mode="indeterminate" v-if="isLoading" />

        <md-card-actions>
          <md-button type="submit" class="md-primary md-raised" :disabled="isLoading">Load Milestones</md-button>
        </md-card-actions>
      </md-card>

      <md-snackbar :md-active.sync="dataLoaded">Milestones loaded successfully!</md-snackbar>
    </form>

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
      milestones: [],
      form: {
        apiToken: process.env.GITLAB_ACCESS_KEY,
        apiUrl: 'https://gitlab.com/api/v4/groups/2851568/milestones'
      },
      dataLoaded: false,
      isLoading: false
    }
  },
  methods: {
    getMilestones: function () {
      this.isLoading = true
      axios.get(this.form.apiUrl, {
        headers: {
          'PRIVATE-TOKEN': this.form.apiToken
        }})
        .then(res => {
          this.milestones = res.data
            .map(ms => Object.assign(ms, {md: md.render(ms.description)}))
            .sort((a, b) => a.start_date > b.start_date)
          this.isLoading = false
          this.dataLoaded = true
        })
    }
  },
  beforeMount () {
    // this.getMilestones()
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
