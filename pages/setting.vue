<template>
  <div>
    <a-row class="box" :x="computeSources">
      <a-col class="source-wrapper" :span="24">
        <a-row>
          <b>Sources</b>
        </a-row>
        <a-row>
          <div v-for="index in sources.length" :key="index">
            <a-input placeholder="..." v-model="sources[index-1]" size="small" />
            <a-icon v-if="index != sources.length" type="minus-circle-o" @click="removeSource(index-1)"/>
          </div>
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
      removeSource(index) {
        this.sources[index] = ''
        this.computeInputList()
      },
      computeInputList() {
        this.sources = this.sources.filter(_ => _.trim() != '')
        if (this.sources.every(_ => _.trim() != '')) {
          this.sources.push('')
        }
        else if (this.sources.filter(_ => _.trim() == '').length >= 2) {
          this.sources.pop()
        }
        return this.sources
      }
    },
    mounted() {
      this.getSources()
    },
    computed: {
      computeSources() {
        this.sources
        this.computeInputList()
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
    .ant-input {
      width: calc(100% - 20px) !important;
    }
    .anticon {
      margin: 0px !important;
    }
    .anticon:hover {
      color: #23AAF2;
      cursor: pointer;
      transition-duration: 0.1s, 0s;
      margin: 0px !important;
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
