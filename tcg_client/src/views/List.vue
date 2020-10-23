<template>
  <a-row>

    <a-col :lg="6" class="sider">
      <a-form layout="vertical" :model="queryForm" class="queryForm">
        <a-form-item label="Compound Code">
          <a-input v-model:value="queryForm.compoundCode" placeholder="Please input the compound code" type="text"/>
        </a-form-item>
        <a-form-item label="Trial Phase">
          <a-select v-model:value="queryForm.trialPhase" placeholder="Please select a trial phase">
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
        <a-form-item label="Time of Generation">
          <a-month-picker v-model:value="queryForm.timeOfGeneration" type="date"/>
        </a-form-item>
        <a-form-item label="Country Code">
          <a-input v-model:value="queryForm.countryCode" type="text"/>
        </a-form-item>
        <a-form-item label="Confirmation Status">
          <a-select v-model:value="queryForm.confirmationStatus" placeholder="Please select a confirmation status">
            <a-select-option value="c0">
              To be confirmed
            </a-select-option>
            <a-select-option value="c1">
              Confirmed
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :wrapper-col="wrapperColButton" class="button-container">
          <a-button type="primary" @click="submitQuery" v-if="!waiting">
            Query
          </a-button>
          <a-spin v-else/>
        </a-form-item>
      </a-form>
    </a-col>

    <a-col :lg="18" class="content">
      <a-alert :message="queryResult.message" :description="queryResult.description" :type="queryResult.type" show-icon class="instruction">
        <template v-slot:icon><smile-outlined /></template>
      </a-alert>
      <a-table
          :scroll="{ y: 500 }"
          :columns="tableSpec.columns"
          :row-key="record => record.login.uuid"
          :data-source="tableSpec.data"
          :pagination="tableSpec.pagination"
          :loading="tableSpec.loading"
          @change="handleTableChange"
      >
        <template v-slot:name="{ text }"> {{ text.first }} {{ text.last }} </template>
        <template v-slot:gender="{ text, record }">
          <span>{{ text }}</span>
          <span class="confirmation-toggler" @click="toggleConfirmationStatus(text, record)">
            <a-tag :color="text === 'male' ? 'green' : 'volcano'">
              {{ text === 'male' ? 'female' : 'male' }}
            </a-tag>
          </span>
        </template>
      </a-table>
    </a-col>

  </a-row>
</template>

<script>
import { SmileOutlined } from '@ant-design/icons-vue';
import reqwest from 'reqwest';
export default {
  name: 'Home',
  components: {
    SmileOutlined,
  },
  data() {
    return {
      submitted: false,
      waiting: false,
      queryForm: {
        compoundCode: undefined,
        trialPhase: undefined,
        timeOfGeneration: undefined,
        countryCode: undefined,
        confirmationStatus: undefined,
      },
      wrapperColButton: { span: 24 },
      queryResult: {
        message: 'Instructions',
        description: 'Please fill in the query form and submit. Hit items will then be listed here.',
        type: 'info',
      },
      tableSpec: {
        columns: [
          {
            title: 'Name',
            dataIndex: 'name',
            sorter: true,
            slots: { customRender: 'name' },
          },
          {
            title: 'Gender',
            dataIndex: 'gender',
            filters: [
              { text: 'Male', value: 'male' },
              { text: 'Female', value: 'female' },
            ],
            slots: { customRender: 'gender' },
          },
          {
            title: 'Email',
            dataIndex: 'email',
            ellipsis: true,
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
  methods: {
    submitQuery: function () {
      console.log('query!', this.queryForm);
      this.waiting = true;
      setTimeout(() => {
        this.waiting = false;
        this.submitted = true;
        this.$notification['success']({
          message: 'Query Result',
          description: 'Your query is completed and the hit targets are listed in the table.',
        });
      }, 3000);
    },
    handleTableChange: function (pagination, filters, sorter) {
      console.log('pagination:' ,pagination);
      const pager = { ...this.tableSpec.pagination };
      pager.current = pagination.current;
      this.tableSpec.pagination = pager;
      this.fetch({
        results: pagination.pageSize,
        page: pagination.current,
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...filters,
      });
    },
    fetch: function (params = {}) {
      console.log('fetch params:', params);
      this.tableSpec.loading = true;
      reqwest({
        url: 'https://randomuser.me/api',
        method: 'get',
        data: {
          results: 10,
          ...params,
        },
        type: 'json',
      }).then(data => {
        console.log('fetch data:',data)
        const pagination = { ...this.tableSpec.pagination };
        // Read total count from server
        // pagination.total = data.totalCount;
        pagination.total = 200;
        this.tableSpec.loading = false;
        this.tableSpec.data = data.results;
        this.tableSpec.pagination = pagination;
      });
    },
    toggleConfirmationStatus: function (currentStatus, targetRecord) {
      console.log(currentStatus, targetRecord)
    },
  },
}
</script>

<style scoped>
.sider, .content {
  padding: 20px 25px 10px 25px;
}
.sider .button-container {
  text-align: center;
}
.content .instruction {
  margin-bottom: 20px;
}
.confirmation-toggler {
  float: right;
}
.confirmation-toggler .ant-tag {
  cursor: pointer;
}
</style>