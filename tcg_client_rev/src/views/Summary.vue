<template>
  <div>
    <a-row>

      <a-col :lg="24" class="content">
        <a-alert message="Instructions" type="info" show-icon class="instruction">
          <template v-slot:icon><smile-outlined/></template>
          <template v-slot:description>
            <p>
              On this page, you can get a summary table of one or more specific compounds.
            </p>
            <ol>
              <li>
                You should first type in the compound names in the text area on the left side (sometimes it may expand the full width across your screen).
                The compound names should be separated by commas, for example,
                <br>
                <code class="ant-green">SHR1210, SHR3680</code>&nbsp;
                <CopyOutlined class="ant-blue" @click="copyToClipBoard('SHR1210, SHR3680')"/>
                <br>
                If you want to draw a comprehensive summary list of all compounds, you can input as follows:
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
                A more detailed presentation of trial phase distribution of the compound can be achieved by clicking the
                '<span class="ant-blue"><PlusSquareOutlined/>Inspect</span>' icon.
              </li>
            </ol>
          </template>
        </a-alert>
        <div class="divider">
          &nbsp;
        </div>
        <a-row>
          <a-col :sm="24" :md="12" :xl="8">
            <a-form :model="queryForm" :layout="queryForm.layout" class="query-form">
              <a-form-item label="Compound Name">
                <a-textarea v-model:value="queryForm.queryExpression" placeholder="Please input the compound names here (should be separated by comma)" type="text"/>
              </a-form-item>
              <a-form-item :wrapper-col="queryForm.wrapperColButton" class="button-container">
                <a-button type="primary" @click="submitQuery" v-if="!queryForm.waiting">
                  Submit
                </a-button>
                <a-spin v-else/>
              </a-form-item>
            </a-form>
          </a-col>
          <a-col :sm="24" :md="12" :xl="16">
            <a-table
                :scroll="{ x: 'max-content', y: 'max-content' }"
                :columns="tableSpec.columns"
                :row-key="record => record.trialUUID"
                :data-source="tableSpec.data"
                :pagination="tableSpec.pagination"
                :loading="tableSpec.loading"
            >
              <template v-slot:trialPhase="{ text }">
                <span>{{ formatTrialPhase(text) }}</span>
              </template>
            </a-table>
          </a-col>
        </a-row>
      </a-col>

    </a-row>
  </div>
</template>

<script>
import {
  SmileOutlined,
  PlusSquareOutlined,
  CopyOutlined,
  DownCircleOutlined,
} from "@ant-design/icons-vue";
export default {
  name: 'TrialSummary',
  components: {
    SmileOutlined,
    PlusSquareOutlined,
    CopyOutlined,
    DownCircleOutlined,
  },
  data() {
    return {
      queryForm: {
        layout: 'vertical',
        queryExpression: '',
        wrapperColButton: { span: 24 },
        waiting: false,
      },
      tableSpec: {
        columns: [
          {
            title: 'Compound Name',
            dataIndex: 'trialCompoundName',
            key: 'trialCompoundName',
            width: '60%',
          },
          {
            title: 'Phase',
            dataIndex: 'trialPhase',
            key: 'trialPhase',
            slots: { customRender: 'trialPhase' },
          },
          {
            title: 'Count',
            dataIndex: 'count',
            key: 'count',
            slots: { customRender: 'count' },
          },
        ],
        data: [],
        pagination: false,
        loading: false,
      },
    };
  },
  methods: {
    submitQuery: function () {
      this.tableSpec.loading = true;
      let compoundNames = this.queryForm.queryExpression.split(',');
      compoundNames = compoundNames.map((name) => {
        return name.trim();
      })
      this.$axios.post(
          '/summary',
          {
            summaryParams: {
              compoundNames: compoundNames,
            },
          },
      ).then((response) => {
        this.parseSummaryResults(response.data.queryResults);
        this.tableSpec.data = this.parseSummaryResults(response.data.queryResults);
        this.tableSpec.loading = false;
      }).catch((error) => {
        console.log(error);
        this.tableSpec.loading = false;
      });
    },
    parseSummaryResults: function (rawSummaryResults) {
      let uniqueCompoundNames = [];
      let counterMatrix = [];
      rawSummaryResults.forEach((rawRecord) => {
        if (!uniqueCompoundNames.includes(rawRecord.trialCompoundName)) {
          uniqueCompoundNames.push(rawRecord.trialCompoundName);
          counterMatrix.push([0, 0, 0, 0]);
        }
      })
      rawSummaryResults.forEach((rawRecord) => {
        counterMatrix[uniqueCompoundNames.indexOf(rawRecord.trialCompoundName)][rawRecord.trialPhase.substr(1, 1) - 1] ++;
      })
      let parsedSummaryResults = [];
      for (const name of uniqueCompoundNames) {
        parsedSummaryResults.push({
          key: uniqueCompoundNames.indexOf(name),
          trialCompoundName: name,
          count: counterMatrix[uniqueCompoundNames.indexOf(name)].reduce((last, current) =>{
            return last + current;
          }),
          children: (function (){
            let result = [];
            for (let i = 0; i < 4; i++) {
              result.push({
                key: uniqueCompoundNames.indexOf(name) + '' + (i + 1),
                trialPhase: 'p' + (i + 1),
                count: counterMatrix[uniqueCompoundNames.indexOf(name)][i],
              });
            }
            return result;
          })(),
        });
      }
      return parsedSummaryResults;
    },
    formatTrialPhase: function (value) {
      const phaseMap = new Map();
      phaseMap.set('p1', 'I').set('p2', 'II').set('p3', 'III').set('p4', 'IV');
      return phaseMap.get(value);
    },
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
  },
}
</script>

<style scoped>
.query-form {
  padding: 24px 24px 0 24px;
}
.button-container {
  text-align: center;
}
.content .ant-table-wrapper {
  padding: 10px;
}
.content .divider {
  background-color: rgb(240, 242, 245);
}
.ant-blue {
  color: #108ee9;
}
.ant-green {
  color: #87d068;
}
</style>