<template>
  <div>
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

    <div align="center" v-if="isLoading">
      <md-progress-spinner :md-diameter="100" :md-stroke="10" md-mode="indeterminate" class="md-accent" />
    </div>

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
      isLoading: false,
      showSettings: true
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

.md-progress-spinner {
  align-self: center;
}
</style>
