<template>
  <div>
    <a-row class="box">
      <a-col class="header-wrapper" :span="24">
        <a-row>
          <a-col :span="10">
          </a-col>
          <a-col :span="5" style="padding-right:5px">
            <a-select showSearch defaultValue="all" v-model="searchTag" size="small"  style="width:100%">
              <a-select-option value="all">all</a-select-option>
              <a-select-option value="dev">dev</a-select-option>
              <a-select-option value="qa">qa</a-select-option>
              <a-select-option value="prod">prod</a-select-option>
            </a-select>
          </a-col>
          <a-col :span="9">
            <a-input-search placeholder="search" style="width: 100%" v-model="searchWord" size="small"/>
          </a-col>
        </a-row>
      </a-col>
      <a-col class="table-wrapper" :span="24" style="overflow-y: auto">
        <a-table :columns="tableColumns" :dataSource="tableData" :pagination="false" :hideDefaultSelections="true" :loading="isLoading" :showHeader="false">
          <span class="addresses-wrapper  full-height" slot="addresses" slot-scope="addresses">
            <div v-for="address in addresses" :key="address.env" @click="goto(address.link)">
              <a-tag v-for="tag in address.tags" :key="tag" :color="getTagColor(tag)" :checked="false">
                {{tag}}
              </a-tag><span>{{address.link.replace("http://", '').replace("https://", '').replace("www.", '')}}</span>
            </div>
          </span>
        </a-table>
      </a-col>
      <div class="menu-wrapper">
        <a-button type="link" icon="sync" @click="fetchFromServer"></a-button>
        <n-link to="/setting">
          <a-button type="link" icon="setting"></a-button>
        </n-link>
      </div>
    </a-row>
  </div>
</template>

<script>
  const tableColumns = [{
      dataIndex: 'name',
      title: 'Name',
      key: 'name',
      width: "25%"
    },
    {
      dataIndex: 'addresses',
      title: 'Addresses',
      key: 'addresses',
      scopedSlots: {
        customRender: 'addresses'
      }
    }
  ]
  const colors = [
    '#1AB399', '#809900', '#E6B3B3', '#6680B3', '#66991A',
    '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
    '#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#80B300',
    '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
    '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
    '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#00B3E6',
    '#E666B3', '#33991A', '#CC9999', '#99E6E6', '#00E680',
    '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
    '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
    '#E64D66', '#4DB380', '#B3B31A', '#FF4D4D', '#6666FF'
  ]

  export default {
    data() {
      return {
        rawData: [],
        tableColumns,
        isLoading: true,
        searchWord: '',
        searchTag: 'all',
        tmpData: []
      }
    },
    methods: {
      getTagColor(env) {
        const toHex = (str) => {
          let result = ''
          for (let i=0; i<str.length; i++) {
            result += str.charCodeAt(i) * i
          }
          return parseInt(result)
        }
        return colors[toHex(env) % colors.length]
      },
      async fetchFromServer() {
        this.isLoading = true
        try {
          this.tmpData = []
          const urls = (await this.$getLocalStorage('urls', [])).filter(_ => _ != '')
          for (let i=0; i<urls.length; i++) {
            this.tmpData = this.tmpData.concat(await this.$axios.$get(urls[i]))
          }
          this.isLoading = false
          console.log(this.tmpData)
          await this.$setLocalStorage('tmpData', this.tmpData)
        }
        catch (error) {
          this.tmpData = []
        }
        await this.renderTable()
      },
      async fetchFromCache() {
        this.isLoading = true
        this.tmpData = await this.$getLocalStorage('tmpData', [])
        this.isLoading = false
        await this.renderTable()
      },
      async renderTable() {
        this.rawData = this.tmpData
          .sort((a, b) => (a.name > b.name) ? 1 : -1)
          .map((_) => {
            _.addresses = _.addresses.sort((a, b) => (a.tags[0] > b.tags[0]) ? 1 : -1)
            return _
          })
      },
      goto(url) {
        window.open(url)
      },
    },
    async mounted() {
      await this.fetchFromCache()
      if (this.tmpData == []) {
        await this.fetchFromServer()
      }
      await this.renderTable()
    },
    computed: {
      tableData() {
        const searchTag = this.searchTag
        const searchWord = this.searchWord.toLowerCase()
        return this.rawData
          .map(_ => {
            return {
              ..._,
              addresses: _.addresses.filter((address) => {
                return address.tags.some(tag => tag == searchTag || searchTag == 'all')
              })
            }
          })
          .filter(_ =>
            _.name.toLowerCase().indexOf(searchWord) >= 0 ||
            _.addresses.some(_ => _.link.toLowerCase().indexOf(searchWord) >= 0) ||
            _.addresses.some(_ => _.tags.join('|').toLowerCase().indexOf(searchWord) >= 0) ||
            searchWord == ''
          )
          .filter(_ => _.addresses.length > 0)
      },
    }
  }
</script>

<style lang="scss">
  $header-height: 40px;
  $table-height: calc(100% - 40px);

  .header-wrapper {
    background-color: #F3F5F6;
    border-bottom: 1px solid #E8E8E8;
    padding: 7px 5px 10px 5px;
    height: $header-height !important;
  }

  .table-wrapper {
    height: $table-height !important;
  }

  .addresses-wrapper {
    & > div {
      margin-top: 5px;
      transition: 0.05s;
    }
    & > div:nth-child(1) {
      margin-top: 0px;
    }
    & > div:hover {
      cursor: pointer;
    }
    & > div:hover > span {
      color: #23AAF2;
    }
  }

  .ant-table-tbody {
    & .ant-table-thead tr {
      overflow: hidden;
    }
    & tr td {
      padding: 5px 0 5px 5px;
      transition-duration: 0.1s, 0s;
    }
  }

  .ant-tag {
    min-width: 40px;
    margin-right: 5px;
    text-align: center;
    border-radius: 4px;
  }

  a {
    color: rgba(0, 0, 0, 0.65);
    transition-duration: 0.1s, 0s;
  }

  .menu-wrapper {
    & {
      position: absolute;
      bottom: 0px;
      right: 10px;
      text-align: right;
    }
    & .ant-btn {
      padding: 0 !important;
    }
  }

  ::-webkit-scrollbar {
    width: 4px;
  }
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  ::-webkit-scrollbar-thumb {
    background: #888;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  .ant-table-placeholder {
    border-bottom: 0px;
  }
</style>
