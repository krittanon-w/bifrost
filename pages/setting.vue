<template>
  <div>
    <a-row class="box" :x="computeUrls">
      <a-col class="url-wrapper" :span="24">
        <a-row>
          <b>Urls</b>
        </a-row>
        <a-row>
          <a-col v-for="index in urls.length" :key="index">
            <a-row>
              <a-input placeholder="..." v-model="urls[index-1]" size="small" />
              <a-icon v-if="index != urls.length" type="minus-circle-o" @click="removeUrl(index-1)"/>
            </a-row>
          </a-col>
        </a-row>
        <a-row style="text-align: right;">
          <n-link to="/">
            <a-button id="save" type="link" @click="setUrls">save</a-button>
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
        urls: []
      }
    },
    methods: {
      async getUrls() {
         this.urls = await this.$getLocalStorage('urls', [])
      },
      async setUrls() {
        await this.$setLocalStorage('urls', this.urls.map(_ => _.trim()))
      },
      removeUrl(index) {
        this.urls[index] = ''
        this.computeInputList()
      },
      computeInputList() {
        this.urls = this.urls.filter(_ => _.trim() != '')
        if (this.urls.every(_ => _.trim() != '')) {
          this.urls.push('')
        }
        else if (this.urls.filter(_ => _.trim() == '').length >= 2) {
          this.urls.pop()
        }
        return this.urls
      }
    },
    mounted() {
      this.getUrls()
    },
    computed: {
      computeUrls() {
        this.urls
        this.computeInputList()
      }
    }
  }
</script>

<style lang="scss">
  .url-wrapper {
    & {
      padding: 10px;
    }
    & .ant-input {
      margin-top: 6px;
    }
    .ant-input {
      width: 100% !important;
    }
    .anticon {
      margin: 0px !important;
      position: absolute;
      bottom: 2px;
      right: 2px;
      color: #888;
      background-color: white;
      padding: 3px;
      padding-left: 4px;
      border-radius: 1px;
      // border-left: 1px solid #EEEEEE;
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
