<template>
  <a-row>

    <a-col :lg="24" class="content">
      <a-alert message="Instructions" type="info" show-icon class="instruction">
        <template v-slot:icon><smile-outlined/></template>
        <template v-slot:description>
          <p>
            On this page, you can get a summary table of one or more compounds.
            </p>
          <ol>
            <li>
              You should first type in the compound names in the text area on the left side (sometimes it may expand the full width across your screen).
              The compound names should be separated by commas, for example,
              <br>
              <code class="ant-green">SHR-1210, SHR-1701</code>&nbsp;
              <CopyOutlined class="ant-blue" @click="copyToClipBoard('SHR-1210, SHR-1701')"/>
              <br>
              If you want a summary of all compounds, you can input as follows:
              <br>
              <code class="ant-green">ALL</code>&nbsp;
              <CopyOutlined class="ant-blue" @click="copyToClipBoard('ALL')"/>&nbsp;
              <DownCircleOutlined class="ant-blue" @click="setTextareaValue('ALL')"/>
            </li>
            <li>
              Click the '<span class="ant-blue">Submit</span>' button to execute the query.
            </li>
            <li>
              Hit targets will be shown in the table on the right side (sometimes the summary table may fall under the input text area).
              A total count of all '<span class="ant-green">Confirmed</span>' trials of a specific compound will be placed in the '<b>Count</b>' column.
              A total count of all '<span class="ant-green">Confirmed</span>' international multi-centre trials of a specific compound will be placed in the '<b>Global</b>' column.
              A more detailed presentation of trial phase distribution of the compound can be achieved by clicking the
              '<span class="ant-blue"><PlusSquareOutlined/>Inspect</span>' icon.
            </li>
            <li>
              After the query, an '<span class="ant-blue">Export</span>' button can be seen, on which when clicked a CSV summary file will be downloaded.
            </li>
          </ol>
        </template>
      </a-alert>
      <div class="divider">
        &nbsp;
      </div>
      <a-row :gutter="22">
        <a-col :xl="8">
          <div class="my-table-wrapper">
            <a-form :model="queryForm" :layout="queryForm.layout" class="query-form">
              <a-form-item label="Compound Name">
                <a-textarea v-model:value="queryForm.queryExpression" placeholder="Please input the compound names here (should be separated by comma)" type="text"/>
              </a-form-item>
              <a-form-item :wrapper-col="queryForm.wrapperColButton" class="button-container">
                <a-button type="primary" @click="submitQuery" v-if="!queryForm.waiting">
                  <CheckCircleOutlined />Submit
                </a-button>
                <a-spin v-else/>
                <span>&nbsp;</span>
                <a-button type="primary" @click="exportCSV" v-if="queryForm.submitted">
                  <DownloadOutlined />Export CSV
                </a-button>
              </a-form-item>
            </a-form>
          </div>
        </a-col>
        <a-col :xl="16">
          <div class="my-table-wrapper">
            <a-table
                :scroll="{ x: 'max-content', y: 'max-content' }"
                :columns="tableSpec.columns"
                :row-key="record => record.trialUUID"
                :data-source="tableSpec.data"
                :pagination="tableSpec.pagination"
                :loading="tableSpec.loading"
                bordered
            >
              <template v-slot:trialPhase="{ text }">
                <span>{{ formatTrialPhase(text) }}</span>
              </template>
            </a-table>
          </div>
        </a-col>
      </a-row>
    </a-col>

  </a-row>
</template>

<script>
import {
  SmileOutlined,
  PlusSquareOutlined,
  CopyOutlined,
  DownCircleOutlined,
  CheckCircleOutlined,
  DownloadOutlined,
} from "@ant-design/icons-vue";
import { formatTrialPhase } from "@/utils/formatter";
export default {
  components: {
    SmileOutlined,
    PlusSquareOutlined,
    CopyOutlined,
    DownCircleOutlined,
    CheckCircleOutlined,
    DownloadOutlined,
  },
  data() {
    return {
      queryForm: {
        layout: 'vertical',
        queryExpression: '',
        wrapperColButton: { span: 24 },
        waiting: false,
        submitted: false,
      },
      tableSpec: {
        columns: [
          {
            title: 'Compound Name',
            dataIndex: 'trialCompoundName',
            key: 'trialCompoundName',
            width: '200px',
          },
          {
            title: 'Phase',
            dataIndex: 'trialPhase',
            key: 'trialPhase',
            slots: { customRender: 'trialPhase' },
            width: '100px',
          },
          {
            title: 'Count',
            dataIndex: 'count',
            key: 'count',
            slots: { customRender: 'count' },
            width: '100px',
          },
          {
            title: 'Global',
            dataIndex: 'international',
            key: 'international',
            slots: { customRender: 'international' },
            width: '150px',
          },
        ],
        data: [],
        pagination: {
          defaultPageSize: 10,
        },
        loading: false,
      },
    };
  },
  methods: {
    submitQuery: function () {
      this.tableSpec.loading = true;
      this.queryForm.waiting = true;
      let compoundNames = this.queryForm.queryExpression.split(',');
      compoundNames = compoundNames.map((name) => {
        return name.trim();
      })
      this.$axios.post(
          '/trial/summary',
          {
            summaryParams: {
              compoundNames: compoundNames,
            },
          },
      ).then((response) => {
        this.tableSpec.data = this.parseSummaryResults(response.data.queryResults);
      }).catch((error) => {
        console.error(error);
      }).finally(() => {
        this.queryForm.waiting = false;
        this.tableSpec.loading = false;
        this.queryForm.submitted = true;
      });
    },
    parseSummaryResults: function (rawSummaryResults) {
      let uniqueCompoundNames = [];
      let counterMatrix = [];
      let internationalMatrix = [];
      rawSummaryResults.forEach((rawRecord) => {
        if (!uniqueCompoundNames.includes(rawRecord.trialCompoundName)) {
          uniqueCompoundNames.push(rawRecord.trialCompoundName);
          // 分别对应0 1 2 3 4共5种
          counterMatrix.push([0, 0, 0, 0, 0]);
          internationalMatrix.push([0, 0, 0, 0, 0]);
        }
      })
      rawSummaryResults.forEach((rawRecord) => {
        counterMatrix[uniqueCompoundNames.indexOf(rawRecord.trialCompoundName)][rawRecord.trialPhase.substr(1, 1)] ++;
        if (rawRecord.trialCountryCode.split(',').length > 1) {
          internationalMatrix[uniqueCompoundNames.indexOf(rawRecord.trialCompoundName)][rawRecord.trialPhase.substr(1, 1)] ++;
        }
      })
      let parsedSummaryResults = [];
      for (const name of uniqueCompoundNames) {
        parsedSummaryResults.push({
          key: uniqueCompoundNames.indexOf(name),
          trialCompoundName: name,
          count: counterMatrix[uniqueCompoundNames.indexOf(name)].reduce((last, current) =>{
            return last + current;
          }),
          international: internationalMatrix[uniqueCompoundNames.indexOf(name)].reduce((last, current) =>{
            return last + current;
          }),
          children: (function () {
            let result = [];
            for (let i = 0; i < 5; i++) {
              result.push({
                key: uniqueCompoundNames.indexOf(name) + '' + i,
                trialPhase: 'p' + i,
                count: counterMatrix[uniqueCompoundNames.indexOf(name)][i],
                international: internationalMatrix[uniqueCompoundNames.indexOf(name)][i],
              });
            }
            return result;
          })(),
        });
      }
      return parsedSummaryResults;
    },
    formatTrialPhase: formatTrialPhase,
    copyToClipBoard: function (text) {
      let transfer = document.createElement('input');
      document.body.appendChild(transfer);
      transfer.value = text;
      transfer.focus();
      transfer.select();
      document.execCommand('copy');
      transfer.blur();
      document.body.removeChild(transfer);
      this.$message.success(`'${ text }' has been copied to the clip board!`);
    },
    setTextareaValue: function (text) {
      this.queryForm.queryExpression = text;
      this.$message.success(`The value of the text area has been set as '${ text }'!`);
    },
    exportCSV: function () {
      let csvHeader = 'data:text/csv;charset=utf-8,';
      let nameRow = 'Compound Name, Phase, Count, Global\n';
      let csvContent = csvHeader + nameRow;
      for (let compound of this.tableSpec.data) {
        let currentArr = [compound.trialCompoundName, undefined, compound.count, compound.international];
        let currentStr = currentArr.join(',') + '\n';
        csvContent = csvContent + currentStr;
        for (let phase of compound.children) {
          let currentArr = [undefined, phase.trialPhase, phase.count, phase.international];
          let currentStr = currentArr.join(',') + '\n';
          csvContent = csvContent + currentStr;
        }
      }
      let encodedUri = encodeURI(csvContent);
      let link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'trial_summary.csv');
      document.body.appendChild(link);
      link.click();
    },
  },
}
</script>

<style scoped>
.button-container {
  text-align: center;
}
</style>