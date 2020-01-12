<template>
  <div>
    <a-row>
      <a-col class="option-panel" :span="24">
        <a-row>
          <a-col :span="14">
            <a-checkbox-group :options="defaultCheckedList" v-model="checkedList" @change="onCheckboxChanged" />
          </a-col>
          <a-col :span="10">
            <a-input-search placeholder="search" style="width: 100%" v-model="searchKeyword" @change="onSearchboxChanged" size="small"/>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
    <a-row>
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
  const checkedList = ['dev', 'qa', 'prod']
  const defaultCheckedList = [].concat(checkedList)

  export default {
    data() {
      return {
        rawData: [],
        tableColumns,
        tableData: [],
        isLoading: true,
        checkedList,
        defaultCheckedList,
        searchKeyword: ""
      }
    },
    methods: {
      getTagColor(env) {
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
        const toHex = (str) => {
          let result = ''
          for (let i=0; i<str.length; i++) {
            result += str.charCodeAt(i) * i
          }
          return parseInt(result)
        }
        return colors[toHex(env) % colors.length]
      },
      async loadRawData() {
        try {
          this.rawData = await this.$axios.$get('https://gist.githubusercontent.com/krittanon-w/c15fff7058abbe6a56ec5c3616963d31/raw/c089d61f5def2b5bc5327ee38922ee46e70acbc7/biforst')
          this.rawData = this.rawData
            .sort((a, b) => (a.name > b.name) ? 1 : -1)
            .map((_) => {
              _.addresses = _.addresses.sort((a, b) => (a.tags[0] > b.tags[0]) ? 1 : -1)
              return _
            })
          this.tableData = JSON.parse(JSON.stringify(this.rawData))
        }
        catch (error) {
          this.rawData = []
          this.tableData = []
        }
        finally {
          this.isLoading = false
        }
      },
      goto(url) {
        window.open(url)
      },
      filterTableData() {
        const checkedList = this.checkedList
        const searchKeyword = this.searchKeyword.toLowerCase()
        this.tableData = this.rawData
          .map((_) => {
            return {
              name: _.name,
              addresses: _.addresses.filter((address) => {
                return address.tags.some(tag =>
                  checkedList.some(checked => checked == tag) ||
                  checkedList.length == 3
                )
              })
            }
          })
          .filter(_ => _.addresses.length > 0)
          .filter(_ =>
            _.name.toLowerCase().indexOf(searchKeyword) >= 0 ||
            _.addresses.some(({link}) => link.toLowerCase().indexOf(searchKeyword) >= 0) ||
            searchKeyword == ''
          )
      },
      onSearchboxChanged() {
        this.filterTableData()
      },
      onCheckboxChanged() {
        this.filterTableData()
      },
    },
    async mounted() {
      await this.loadRawData()
    },
    computed: {

    }
  }
</script>

<style>
  .table-wrapper {
    height: calc(600px - 45px) !important;
  }
  .addresses-wrapper > div {
    margin-top: 8px;
    transition: 0.05s;
  }
  .addresses-wrapper > div:nth-child(1) {
    margin-top: 0px;
  }
  .addresses-wrapper > div:hover {
    cursor: pointer;
  }
  .addresses-wrapper > div:hover > span {
    color: #23AAF2;
  }
  .ant-table-tbody tr td {
    padding: 8px;
    padding-right: 0px;
    transition-duration: 0.1s, 0s;
  }
  .ant-table-thead tr {
    overflow: hidden;
  }
  .ant-table-thead tr th {
    padding: 8px;
    text-align: left;
  }
  .ant-tag {
    min-width: 40px;
    text-align: center;
    border-radius: 4px;
  }
  .ant-tag:hover {
     cursor: unset ;
  }
  a {
    color: rgba(0, 0, 0, 0.65);
    transition-duration: 0.1s, 0s;
  }
  a:hover {
    transition-duration: 0.1s, 0s;
  }
  .option-panel {
    background-color: #F3F5F6;
    border-bottom: 1px solid #E8E8E8;
    padding: 10px;
    height: 45px;
  }
</style>
