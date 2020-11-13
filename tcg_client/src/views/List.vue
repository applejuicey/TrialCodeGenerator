<template>
  <a-row>

    <a-col :lg="24" class="content">
      <a-alert message="Instructions" type="info" show-icon class="instruction">
        <template v-slot:icon><smile-outlined/></template>
        <template v-slot:description>
          <p>
            All trials are listed in the table where
            <span style="color: #8ccded">
             <sort-descending-outlined/>sorting
            </span>
            and
            <span style="color: #8ccded">
             <filter-outlined/>filtering
            </span>
            functions can be employed through the header.
          </p>
          <ul>
            <li>
              Click the
              <span style="color: #8ccded">
                <sort-descending-outlined/>sorting
              </span>
              icon to sort the column.
            </li>
            <li>
              Click the
              <span style="color: #8ccded">
                <filter-outlined/>filtering
              </span>
              icon to filter the column.
            </li>
          </ul>
        </template>
      </a-alert>
      <div class="divider">
        &nbsp;
      </div>
      <a-table
          :scroll="{ x: 'max-content', y: 'max-content' }"
          :columns="tableSpec.columns"
          :row-key="record => record.trialUUID"
          :data-source="tableSpec.data"
          :pagination="tableSpec.pagination"
          :loading="tableSpec.loading"
          @change="handleTableChange"
          bordered
      >
        <template v-slot:trialCode="{ text, record }">
          <span>{{ formatTrialCode(record) }}</span>
        </template>
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
        <template v-slot:trialStatus="{ text, record }">
          <a-badge :status="formatTrialStatus(text).status"/>
          <span :style="`color: ${ formatTrialStatus(text).color }`">
            {{ formatTrialStatus(text).text }}
          </span>
        </template>
        <template v-slot:trialGenerationDate="{ text }">
          <span>{{ formatTrialGenerationDate(text) }}</span>
        </template>
        <template v-slot:trialPhase="{ text }">
          <span>{{ formatTrialPhase(text) }}</span>
        </template>
        <template v-slot:action="{ text, record }">
          <a-button-group>
            <a-button type="primary" size="small"
                      @click="editRecord(text, record)">
              <template v-slot:icon><edit-outlined/></template>
            </a-button>
          </a-button-group>
          <a-modal centered :title="modelSpec.title" v-model:visible="modelSpec.visible" :confirm-loading="modelSpec.confirmLoading" @ok="handleOk">
            <a-form layout="vertical" :model="recordEditForm">
              <a-form-item label="Compound Name">
                <a-input v-model:value="recordEditForm.trialCompoundName" placeholder="Please input the compound name" type="text"/>
              </a-form-item>
              <a-form-item label="Trial Status">
                <a-select v-model:value="recordEditForm.trialStatus" placeholder="Please select a trial status">
                  <a-select-option value="s0">
                    Proposed
                  </a-select-option>
                  <a-select-option value="s1">
                    Confirmed
                  </a-select-option>
                  <a-select-option value="s2">
                    Deleted
                  </a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="Status Description" placeholder="Please fill in the reason for trial status change">
                <a-textarea v-model:value="recordEditForm.trialStatusDescription" />
              </a-form-item>
              <a-form-item label="Trial Phase">
                <a-select v-model:value="recordEditForm.trialPhase" placeholder="Please select a trial phase">
                  <a-select-option value="p1">
                    Phase I
                  </a-select-option>
                  <a-select-option value="p2">
                    Phase II
                  </a-select-option>
                  <a-select-option value="p3">
                    Phase III
                  </a-select-option>
                  <a-select-option value="p4">
                    Phase IV
                  </a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="Country Code">
                <a-input v-model:value="recordEditForm.trialCountryCode" type="text"/>
              </a-form-item>
            </a-form>
          </a-modal>
        </template>
      </a-table>
    </a-col>

  </a-row>
</template>

<script>
import {
  SmileOutlined,
  SearchOutlined,
  DeleteOutlined,
  EditOutlined,
  SortDescendingOutlined,
  FilterOutlined,
} from '@ant-design/icons-vue';
export default {
  name: 'Home',
  components: {
    SmileOutlined,
    SearchOutlined,
    DeleteOutlined,
    EditOutlined,
    SortDescendingOutlined,
    FilterOutlined,
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
      tableSpec: {
        columns: [
          {
            title: 'Trial Code',
            dataIndex: 'trialCode',
            slots: { customRender: 'trialCode' },
            width: '200px',
            fixed: 'left',
          },
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
            title: 'Status',
            dataIndex: 'trialStatus',
            filters: [
              { text: 'Proposed', value: 's0' },
              { text: 'Confirmed', value: 's1' },
              { text: 'Deleted', value: 's2' },
            ],
            slots: { customRender: 'trialStatus' },
            width: '120px',
          },
          {
            title: 'Status Description',
            dataIndex: 'trialStatusDescription',
            width: '200px',
          },
          {
            title: 'Country',
            dataIndex: 'trialCountryCode',
            sorter: true,
            width: '120px',
          },
          {
            title: 'Time Stamp',
            dataIndex: 'trialGenerationDate',
            sorter: true,
            slots: { customRender: 'trialGenerationDate' },
            width: '150px',
          },
          {
            title: 'Phase',
            dataIndex: 'trialPhase',
            sorter: true,
            slots: { customRender: 'trialPhase' },
            width: '100px',
          },
          {
            title: 'NO.',
            dataIndex: 'trialUniqueSequenceCode',
            sorter: true,
            width: '80px',
          },
          {
            title: 'Action',
            slots: { customRender: 'action' },
            width: '100px',
            fixed: 'right',
            align: 'center',
          },
        ],
        data: [],
        pagination: {},
        loading: false,
      },
      modelSpec: {
        title: 'Title',
        visible: false,
        confirmLoading: false,
      },
      recordEditForm: {},
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
    editRecord: function (text, targetRecord) {
      this.modelSpec.title = `Edit record "${ this.formatTrialCode(targetRecord) }"`;
      this.modelSpec.visible = true;
      this.recordEditForm = targetRecord;
    },
    formatTrialStatus: function (value) {
      const statusMap = new Map();
      statusMap.set('s0', ['Proposed', 'processing', '#108ee9'])
          .set('s1', ['Confirmed', 'success', '#87d068'])
          .set('s2', ['Deleted', 'error', '#f50']);
      return {
        text: statusMap.get(value)[0],
        status: statusMap.get(value)[1],
        color: statusMap.get(value)[2],
      };
    },
    formatTrialGenerationDate: function (value) {
      return value.split('T')[0];
    },
    formatTrialPhase: function (value) {
      const phaseMap = new Map();
      phaseMap.set('p1', 'I').set('p2', 'II').set('p3', 'III').set('p4', 'IV');
      return phaseMap.get(value);
    },
    formatTrialCode: function (trialRecord) {
      return trialRecord.trialCompoundName + '-' + this.formatTrialPhase(trialRecord.trialPhase) + '-' +
          trialRecord.trialPhase.substr(1, 1) + trialRecord.trialUniqueSequenceCode +
          (trialRecord.trialCountryCode? ('-' + trialRecord.trialCountryCode) : '');
    },
    handleOk(e) {
      this.modelSpec.confirmLoading = true;
      console.log('aa', this.recordEditForm)
      this.$axios.patch(
          '/update',
          {
            updatedTrial: this.recordEditForm,
          },
      ).then((response) => {
        this.$notification['success']({
          message: 'Action Succeed',
          description: 'The record has been updated successfully. The page will be refreshed in 5 seconds.',
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
      }).finally(() => {
        this.modelSpec.visible = false;
        this.modelSpec.confirmLoading = false;
      });
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
</style>