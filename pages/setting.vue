<template>
  <div>
    <a-row class="box">
      <a-col class="source-wrapper" :span="24">
        <a-row>
          <b>Sources</b>
        </a-row>
        <a-row>
          <a-input v-for="index in inputSources.length" :key="index" placeholder="..." v-model="sources[index-1]"
            size="small" />
        </a-row>
        <a-row style="text-align: right;">
          <n-link to="/">
            <a-button id="save" type="link" @click="setSources">save</a-button>
          </n-link>
        </a-row>
      </a-col>
      <div class="menu-wrapper">
        <n-link to="/">
          <a-button type="link" icon="left"></a-button>
        </n-link>
      </div>
    </a-row>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        sources: []
      }
    },
    methods: {
      getSources() {
        if (chrome.storage) {
          const key = 'sources'
          chrome.storage.local.get([key], (results) => {
            console.log('get sources', results[key])
            this.sources = results[key] || []
          })
        }
      },
      setSources() {
        if (chrome.storage) {
          chrome.storage.local.set({sources: this.sources}, () => {
            console.log('set sources', this.sources)
          })
        }
      },
    },
    mounted() {
      this.getSources()
    },
    computed: {
      inputSources() {
        if (this.sources.every(_ => _.trim() != '')) {
          this.sources.push('')
        }
        else if (this.sources.filter(_ => _.trim() == '').length >= 2) {
          this.sources.pop()
        }
        return this.sources
      }
    }
  }
</script>

<style lang="scss">
  .source-wrapper {
    & {
      padding: 10px;
    }
    & .ant-input {
      margin-top: 6px;
    }
  }
  .menu-wrapper {
    & {
      position: absolute;
      bottom: 0px;
      right: 5px;
      text-align: right;
    }
    & .ant-btn {
      padding: 0 !important;
    }
  }

  #save {
    padding: 0 !important;
  }
</style>
