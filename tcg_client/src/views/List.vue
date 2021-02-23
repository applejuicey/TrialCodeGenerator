<template>
  <a-row>

    <a-col :lg="24" class="content">
      <a-alert message="Instructions" type="info" show-icon class="instruction">
        <template v-slot:icon><smile-outlined/></template>
        <template v-slot:description>
          <p>
            On this page, you can have a good command of all trials stored in the database.
          </p>
          <ul>
            <li>
              All records will be loaded from the server automatically upon mounting of this page.
              Any successful change on the record will trigger a data refreshing.
            </li>
            <li>
              The unique trial code is listed in the '<b>Trial Code</b>' column.
            </li>
            <li>
              The compound name is listed in the '<b>Compound Name</b>' column.
              This information will be used when generating the unique trial code.
              '<span class="ant-blue"><sort-descending-outlined/>Sorting</span>' and '<span class="ant-blue"><SearchOutlined/>Searching</span>'
              functions are implemented in the '<b>Compound Name</b>' column.
              You can input a compound name in the popup box after clicking the '<span class="ant-blue"><SearchOutlined/>Searching</span>' icon to execute a more accurate search.
            </li>
            <li>
              An exhaustive list of '<span class="ant-green">Confirmed</span>',
              '<span class="ant-blue">Proposed</span>' and
              '<span class="ant-red">Suspended</span>' is employed in the '<b>Status</b>' column.
              Click the '<span class="ant-blue"><FilterOutlined/>Filtering</span>'
              icon to filter the column.
            </li>
            <li>
              A description of change of trial status or other important information is listed in the '<b>Status Description</b>' column.
            </li>
            <li>
              The country code which is composed of valid Alpha-3 codes concatenated with commas is listed in the '<b>Country</b>' column.
              '<span class="ant-blue"><sort-descending-outlined/>Sorting</span>'
              function is implemented in this column.
            </li>
            <li>
              The '<b>Time Stamp</b>' column provides the date that the record was created.
              '<span class="ant-blue"><sort-descending-outlined/>Sorting</span>'
              function is implemented in this column.
            </li>
            <li>
              An exhaustive list of '0', 'I', 'I/II', 'I/III', 'II', 'II/III', 'IIa', 'IIb', 'III', 'IIIa', 'IIIb', 'IV' and 'NA' is employed in the '<b>Phase</b>' column to mark the trial phase.
              This information will be used when generating the unique trial code.
              '<span class="ant-blue"><sort-descending-outlined/>Sorting</span>'
              function is implemented in this column.
            </li>
            <li>
              The '<b>NO.</b>' column presents the sequence of a specific trial per phase per compound.
              This information will be used when generating the unique trial code.
              '<span class="ant-blue"><sort-descending-outlined/>Sorting</span>'
              function is implemented in this column.
            </li>
            <li>
              The '<b>Action</b>' column enables the edition of the record in the same row.
              A modal with an edit form will be shown after clicking the '<span class="ant-blue"><EditOutlined/>Edit</span>' button.
            </li>
          </ul>
        </template>
      </a-alert>
      <div class="divider">
        &nbsp;
      </div>
      <div class="my-table-wrapper">
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
                  <a-input v-model:value="recordEditForm.trialCompoundName" placeholder="Please input the compound name" type="text"
                           @blur="standardiseTrialCompoundName(recordEditForm.trialCompoundName)"/>
                </a-form-item>
                <a-form-item label="Trial Status" >
                  <a-select v-model:value="recordEditForm.trialStatus" placeholder="Please select a trial status" :disabled="['t2'].includes(test.userType) && ['s1'].includes(recordEditForm.trialStatus)">
                    <a-select-option value="s0">
                      Proposed
                    </a-select-option>
                    <a-select-option value="s1" v-if="!(['t2'].includes(test.userType) && ['s0', 's2'].includes(recordEditForm.trialStatus))">
                      Confirmed
                    </a-select-option>
                    <a-select-option value="s2">
                      Suspended
                    </a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="Status Description" placeholder="Please fill in the reason for trial status change">
                  <a-textarea v-model:value="recordEditForm.trialStatusDescription" />
                </a-form-item>
                <a-form-item label="Country Code">
                  <a-input v-model:value="recordEditForm.trialCountryCode" type="text"
                           @blur="standardiseTrialCountryCode(recordEditForm.trialCountryCode)"/>
                </a-form-item>
              </a-form>
            </a-modal>
          </template>
        </a-table>
      </div>

    </a-col>

  </a-row>
</template>

<script>
import {
  formatTrialCode,
  formatTrialPhase,
  standardiseTrialCompoundName,
  standardiseTrialCountryCode,
} from '../utils/formatter.js';
import {
  SmileOutlined,
  SearchOutlined,
  DeleteOutlined,
  EditOutlined,
  SortDescendingOutlined,
  FilterOutlined,
} from '@ant-design/icons-vue';
export default {
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
      test: JSON.parse(localStorage.getItem('userInfo')),
      queryParams: {
        results: 20,
        page: 1,
        filters: {},
      },
      tableSpec: {
        columns: [
          {
            title: 'Trial Code',
            dataIndex: 'trialCode',
            slots: { customRender: 'trialCode' },
            width: '200px',
            // fixed: 'left',
          },
          {
            title: 'Compound Name',
            dataIndex: 'trialCompoundName',
            sorter: (a, b) => {
              return a.trialCompoundName.localeCompare(b.trialCompoundName)
            },
            defaultSortOrder: 'ascend',
            sortDirections: ['descend', 'ascend'],
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
              { text: 'Suspended', value: 's2' },
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
            sorter: (a, b) => {
              a.trialCountryCode = a.trialCountryCode? a.trialCountryCode : '';
              b.trialCountryCode = b.trialCountryCode? b.trialCountryCode : '';
              return a.trialCountryCode.localeCompare(b.trialCountryCode);
            },
            sortDirections: ['descend', 'ascend'],
            width: '120px',
          },
          {
            title: 'Time Stamp',
            dataIndex: 'trialGenerationDate',
            sorter: (a, b) => {
              return a.trialGenerationDate.localeCompare(b.trialGenerationDate);
            },
            sortDirections: ['descend', 'ascend'],
            slots: { customRender: 'trialGenerationDate' },
            width: '150px',
          },
          {
            title: 'Phase',
            dataIndex: 'trialPhase',
            sorter: (a, b) => {
              return a.trialPhase.localeCompare(b.trialPhase);
            },
            slots: { customRender: 'trialPhase' },
            width: '100px',
          },
          {
            title: 'NO.',
            dataIndex: 'trialUniqueSequenceCode',
            sorter: (a, b) => {
              return a.trialUniqueSequenceCode.toString().localeCompare(b.trialUniqueSequenceCode.toString());
            },
            sortDirections: ['descend', 'ascend'],
            width: '80px',
          },
          {
            title: 'Action',
            slots: { customRender: 'action' },
            width: '100px',
            // fixed: 'right',
            align: 'center',
          },
        ],
        data: [],
        pagination: {
          defaultPageSize: 20,
        },
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
          '/trial/batchQuery',
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
      this.modelSpec.title = `Edit record "${ formatTrialCode(targetRecord) }"`;
      this.modelSpec.visible = true;
      this.recordEditForm = targetRecord;
    },
    handleOk(e) {
      if (
          !standardiseTrialCompoundName(this.recordEditForm.trialCompoundName).status ||
          !standardiseTrialCountryCode(this.recordEditForm.trialCountryCode).status
      ) {
        // error occurred
        this.$message.error('Please check your input and correct the mistakes!', 6);
        return;
      }
      this.modelSpec.confirmLoading = true;
      this.$axios.patch(
          '/trial/update',
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
    formatTrialCode: formatTrialCode,
    formatTrialPhase: formatTrialPhase,
    formatTrialStatus: function (value) {
      const statusMap = new Map();
      statusMap.set('s0', ['Proposed', 'processing', '#108ee9'])
          .set('s1', ['Confirmed', 'success', '#87d068'])
          .set('s2', ['Suspended', 'error', '#f50']);
      return {
        text: statusMap.get(value)[0],
        status: statusMap.get(value)[1],
        color: statusMap.get(value)[2],
      };
    },
    formatTrialGenerationDate: function (value) {
      return value.split('T')[0];
    },
    standardiseTrialCompoundName: function (compoundName) {
      this.recordEditForm.trialCompoundName = standardiseTrialCompoundName(compoundName).result;
    },
    standardiseTrialCountryCode: function (countryCode) {
      this.recordEditForm.trialCountryCode = standardiseTrialCountryCode(countryCode).result;
    },
  },
}
</script>
