<template>
  <div style="height: 100%;">
    <div class="button-group">
    <md-button class="md-icon-button md-raised md-primary" v-on:click="showSettings = !showSettings">
      <md-icon>menu</md-icon>
    </md-button>
    <md-button class="md-icon-button md-raised md-accent" v-if="!showSettings" v-on:click="getMilestones">
        <md-icon>refresh</md-icon>
      </md-button>
    </div>
    <form novalidate class="md-layout" v-on:submit.prevent="getMilestones" v-if="showSettings && !isLoading">
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

        <md-card-actions>
          <md-button type="submit" class="md-accent md-raised" :disabled="isLoading">Load Milestones</md-button>
        </md-card-actions>
      </md-card>

      <md-snackbar :md-active.sync="dataLoaded">Milestones loaded successfully!</md-snackbar>
    </form>

    <md-snackbar :md-active.sync="isLoadError">Error while loading: {{ dataLoadError }}</md-snackbar>
    <div align="center" v-if="isLoading">
      <md-progress-spinner :md-diameter="100" :md-stroke="10" md-mode="indeterminate" class="md-accent" />
    </div>
    <md-content class="scrolling-wrapper">
      <md-card md-with-hover v-for="ms in milestones" v-bind:key="ms.id">
        <md-card-header>
          <div class="md-title">{{ ms.title }}</div>
          <div class="md-subhead">{{ ms.start_date | formatDate }} ➡️ {{ ms.due_date | formatDate }}</div>
        </md-card-header>

        <md-card-content v-html="ms.md"></md-card-content>
        <md-list class="md-double-line md-dense">
          <md-subheader>Issues</md-subheader>
          <md-list-item v-for="issue in ms.issues" v-bind:key="issue.id" :href="issue.web_url" target="_blank">
            <span style="font-size: 2em; margin-right: 10px;" v-if="issue.state === 'closed'">✅</span>
            <span style="font-size: 2em; margin-right: 10px;" v-else>💤</span>
            <div class="md-list-item-text">
              <span>#{{ issue.iid }}</span>
              <span>{{ issue.title }}</span>
            </div>
          </md-list-item>
        </md-list>
      </md-card>
    </md-content>
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
      milestones: [],
      issues: {},
      form: {
        apiToken: '',
        apiUrl: ''
      },
      dataLoaded: false,
      isLoading: false,
      isLoadError: false,
      showSettings: true,
      dataLoadError: false
    }
  },
  methods: {
    getMilestones: function () {
      this.isLoading = true
      this.showSettings = false
      axios.get(this.form.apiUrl, {
        headers: {
          'PRIVATE-TOKEN': this.form.apiToken
        }})
        .then(res => {
          this.milestones = res.data
            .map(ms => Object.assign(ms, {md: md.render(ms.description), issues: []}))
            .sort((a, b) => a.start_date > b.start_date)
          this.isLoadError = false
          this.dataLoadError = null
          // update local storage only if request was successful
          if (localStorage) {
            localStorage.setItem('gitlab-milestones-viewer', JSON.stringify(this.form))
          }
          return Promise.all(
            this.milestones.map(m => this.getIssues(m.title))
          )
        })
        .then(allIssues => {
          this.isLoading = false
          this.dataLoaded = true
        })
        .catch(err => {
          this.isLoading = false
          this.dataLoaded = false
          this.dataLoadError = err.message
          this.isLoadError = true
          this.showSettings = true
          console.error(err)
        })
    },
    getIssues: function (milestoneName) {
      return axios.get(`https://gitlab.com/api/v4/groups/2851568/issues?milestone=${milestoneName}`, {
        headers: {
          'PRIVATE-TOKEN': this.form.apiToken
        }})
        .then(res => {
          res.data.forEach(issue => {
            const msId = issue.milestone.id
            const msIx = this.milestones.findIndex(m => m.id === msId)
            this.milestones[msIx].issues.push(issue)
          })
          return res
        })
    }
  },
  beforeMount () {
    if (localStorage) {
      const storageSettings = localStorage.getItem('gitlab-milestones-viewer')
      if (storageSettings) {
        const json = JSON.parse(storageSettings)
        this.form.apiUrl = json.apiUrl
        this.form.apiToken = json.apiToken
      }
      const url = new URL(window.location.href)
      if (/[?&]autoload=/.test(url.search)) {
        this.getMilestones()
      }
    }
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
  max-height: 520px;
  overflow: auto;
}

.md-progress-spinner {
  align-self: center;
}

.scrolling-wrapper {
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
}
</style>
