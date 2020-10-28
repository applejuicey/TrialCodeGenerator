<template>
  <a-row>

    <a-col :lg="24" class="content">
      <a-alert :message="queryResult.message" :description="queryResult.description" :type="queryResult.type" show-icon class="instruction">
        <template v-slot:icon><smile-outlined/></template>
      </a-alert>
      <div class="divider">
        &nbsp;
      </div>
      <a-table
          :scroll="{ y: 500 }"
          :columns="tableSpec.columns"
          :row-key="record => record.trialUUID"
          :data-source="tableSpec.data"
          :pagination="tableSpec.pagination"
          :loading="tableSpec.loading"
          @change="handleTableChange"
      >
        <template v-slot:filterDropdown="{ setSelectedKeys, selectedKeys, clearFilters, column }">
          <div style="padding: 8px">
            <a-input :placeholder="'Compound Name'" :value="selectedKeys[0]"
                     style="width: 188px; margin-bottom: 8px; display: block;"
                     @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
                     @pressEnter="handleSearch(selectedKeys, column.dataIndex)"/>
            <a-button type="primary" size="small" style="width: 90px; margin-right: 8px"
                      @click="handleSearch(selectedKeys, column.dataIndex)">
              <template v-slot:icon><search-outlined/></template>
              Search
            </a-button>
            <a-button size="small" style="width: 90px" @click="handleReset(clearFilters)">
              Reset
            </a-button>
          </div>
        </template>
        <template v-slot:filterIcon="filtered">
          <search-outlined :style="{ color: filtered ? '#108ee9' : undefined }" />
        </template>
        <template v-slot:trialConfirmationStatus="{ text, record }">
          <span>{{ formatConfirmationStatus(text) }}</span>
          <span class="confirmation-toggler" @click="toggleConfirmationStatus(text, record)">
            <a-tag :color="text === 'c0' ? 'green' : 'volcano'">
              {{ text === 'c0' ? 'Confirm' : 'Unconfirm' }}
            </a-tag>
          </span>
        </template>
        <template v-slot:trialGenerationYearMonth="{ text }">
          <span>{{ formatGenerationYearMonth(text) }}</span>
        </template>
        <template v-slot:trialPhase="{ text }">
          <span>{{ formatTrialPhase(text) }}</span>
        </template>
        <template v-slot:action="{ text, record }">
          <a-button type="danger" size="small"
                    @click="deleteRecord(text, record)">
            <template v-slot:icon><delete-outlined/></template>
            Delete
          </a-button>
        </template>
      </a-table>
    </a-col>

  </a-row>
</template>

<script>
import { SmileOutlined, SearchOutlined, DeleteOutlined } from '@ant-design/icons-vue';
export default {
  name: 'Home',
  components: {
    SmileOutlined,
    SearchOutlined,
    DeleteOutlined,
  },
  data() {
    return {
      queryParams: {
        results: 10,
        page: 1,
        sortField: 'trialCompoundName',
        sortOrder: 'ascend',
        filters: {},
      },
      queryResult: {
        message: 'Instructions',
        description: 'Please fill in the query form and submit. Hit items will then be listed here.',
        type: 'info',
      },
      tableSpec: {
        columns: [
          {
            title: 'Compound Name',
            dataIndex: 'trialCompoundName',
            sorter: true,
            slots: {
              filterDropdown: 'filterDropdown',
              filterIcon: 'filterIcon',
            },
            width: '200px',
          },
          {
            title: 'Confirmation Status',
            dataIndex: 'trialConfirmationStatus',
            filters: [
              { text: 'To be confirmed', value: 'c0' },
              { text: 'Confirmed', value: 'c1' },
            ],
            slots: { customRender: 'trialConfirmationStatus' },
            width: '200px',
          },
          {
            title: 'Country Code',
            dataIndex: 'countryCode',
            sorter: true,
            width: '80px',
          },
          {
            title: 'Time Stamp',
            dataIndex: 'trialGenerationYearMonth',
            sorter: true,
            slots: { customRender: 'trialGenerationYearMonth' },
            width: '100px',
          },
          {
            title: 'Trial Phase',
            dataIndex: 'trialPhase',
            sorter: true,
            slots: { customRender: 'trialPhase' },
            width: '100px',
          },
          {
            title: 'Unique Sequence Code',
            dataIndex: 'uniqueSequenceCode',
            sorter: true,
            width: '100px',
          },
          {
            title: 'Action',
            slots: { customRender: 'action' },
            width: '100px',
          },
        ],
        data: [],
        pagination: {},
        loading: false,
      },
    };
  },
  mounted() {
    this.fetch();
  },
  watch: {
    queryParams: {
      handler(newVal, oldVal) {
        this.fetch(newVal);
      },
      deep: true,
    },
  },
  methods: {
    fetch: function () {
      this.tableSpec.loading = true;
      this.$axios.post(
          '/batchQuery',
          {
            batchQueryParams: this.queryParams,
          },
      ).then((response) => {
        console.log('fetched data:',response.data)
        const pagination = { ...this.tableSpec.pagination };
        pagination.total = response.data.queryResults.totalCount;
        this.tableSpec.data = response.data.queryResults.hitTargets;
        this.tableSpec.loading = false;
        this.tableSpec.pagination = pagination;
      }).catch((error) => {
        console.log(error);
        this.tableSpec.loading = false;
      });
    },
    handleTableChange: function (pagination, filters, sorter) {
      const pager = { ...this.tableSpec.pagination };
      pager.current = pagination.current;
      this.tableSpec.pagination = pager;
      this.queryParams.results = pagination.pageSize? pagination.pageSize : this.queryParams.results;
      this.queryParams.page = pagination.current? pagination.current : this.queryParams.page;
      this.queryParams.sortField = sorter.field? sorter.field : this.queryParams.sortField;
      this.queryParams.sortOrder = sorter.order? sorter.order : this.queryParams.sortOrder;
      this.queryParams.filters = { ...this.queryParams.filters, ...filters };
    },
    handleSearch(selectedKeys, dataIndex) {
      this.queryParams.filters[dataIndex] = selectedKeys[0];
    },
    handleReset(clearFilters) {
      clearFilters();
    },
    toggleConfirmationStatus: function (currentStatus, targetRecord) {
      this.$axios.patch(
          '/update',
          {
            newTrial: {
              trialConfirmationStatus: currentStatus === 'c0'? 'c1' : 'c0',
              trialUUID: targetRecord.trialUUID,
            },
          },
      ).then((response) => {
        console.log('updated data:',response.data)
        this.$notification['success']({
          message: 'Action Succeed',
          description: 'The confirmation status has been toggled successfully. The page will be refreshed in 5 seconds.',
        });
        setTimeout(() => {
          location.reload();
        }, 5000)
      }).catch((error) => {
        console.log(error);
        this.$notification['error']({
          message: 'Action Failed',
          description: `Sorry, your request failed. Detailed error description is listed as follows:${ error }`,
        });
      });
    },
    deleteRecord: function (text, targetRecord) {
      this.$axios.post(
          '/delete',
          {
            trialUUID: targetRecord.trialUUID,
          },
      ).then((response) => {
        console.log('deleted data:',response.data)
        this.$notification['success']({
          message: 'Action Succeed',
          description: 'The selected record has been deleted successfully. The page will be refreshed in 5 seconds.',
        });
        setTimeout(() => {
          location.reload();
        }, 5000)
      }).catch((error) => {
        console.log(error);
        this.$notification['error']({
          message: 'Action Failed',
          description: `Sorry, your request failed. Detailed error description is listed as follows:${ error }`,
        });
      });
    },
    formatConfirmationStatus: function (value) {
      return value === 'c0'? 'Unconfirmed' : 'Confirmed';
    },
    formatGenerationYearMonth: function (value) {
      return value.split('T')[0];
    },
    formatTrialPhase: function (value) {
      const phaseMap = new Map();
      phaseMap.set('p1', 'I').set('p2', 'II').set('p3', 'III').set('p4', 'IV');
      return phaseMap.get(value);
    },
  },
}
</script>

<style scoped>
.content .ant-table-wrapper {
  padding: 10px;
}
.content .divider {
  background-color: rgb(240, 242, 245);
}
.confirmation-toggler {
  float: right;
}
.confirmation-toggler .ant-tag {
  cursor: pointer;
}
</style>