<template>
  <a-row>

    <a-col :lg="24" class="content">
      <a-alert message="Instructions" type="info" show-icon class="instruction">
        <template v-slot:icon><smile-outlined/></template>
        <template v-slot:description>
          <p>
            On this page, you can fill in and submit the following form to upload the required information for requesting a trial code.
          </p>
          <ul>
            <li>
              The '<b>Compound Name</b>' will be converted automatically to capital letters.
              Blank spaces should <b>NOT</b> be included in the middle of the compound name.
              This information will be used when generating the unique trial code.
            </li>
            <li>
              An exhaustive list of '0', 'I', 'I/II', 'I/III', 'II', 'II/III', 'IIa', 'IIb', 'III', 'IIIa', 'IIIb', 'IV' and 'NA' is employed in the '<b>Trial Phase</b>' dropdown selector.
              This information will be used when generating the unique trial code. <b>Please pay particular attention to the correctness of this field.</b>
            </li>
            <li>
              The '<b>Date of Generation</b>' calendar dropdown selector provides the date that the record was created.
            </li>
            <li>
              The '<b>Country Code</b>' should be a string composed of valid Alpha-3 codes (e.g. <span class="ant-green">CHN</span>) or the english short name (e.g. <span class="ant-green">China</span>) of the country according to the
              <a href="https://en.wikipedia.org/wiki/ISO_3166-1">ISO-3166-1</a>, separated by commas. For example, 'CHN, USA' is recommended for
              a multi-centre international trial which has its main site located in China and another site in the USA.
            </li>
          </ul>
        </template>
      </a-alert>
      <div class="divider">
        &nbsp;
      </div>
      <div class="generatorForm" v-if="!submitted">
        <div class="header">
          <span>Clinical Trial Protocol Number Registration Platform</span>
        </div>
        <a-form :model="codeGeneratorForm" :label-col="labelCol" :wrapper-col="wrapperColContent">
          <a-form-item label="Compound Name">
            <a-input v-model:value="codeGeneratorForm.trialCompoundName" placeholder="Please input the compound name" type="text"
                     @blur="standardiseTrialCompoundName(codeGeneratorForm.trialCompoundName)"/>
          </a-form-item>
          <a-form-item label="Trial Phase">
            <a-select v-model:value="codeGeneratorForm.trialPhase" placeholder="Please select a trial phase">
              <a-select-option value="p0">
                Phase 0
              </a-select-option>
              <a-select-option value="p1">
                Phase I
              </a-select-option>
              <a-select-option value="p21">
                Phase I/II
              </a-select-option>
              <a-select-option value="p31">
                Phase I/III
              </a-select-option>
              <a-select-option value="p2">
                Phase II
              </a-select-option>
              <a-select-option value="p2a">
                Phase II a
              </a-select-option>
              <a-select-option value="p2b">
                Phase II b
              </a-select-option>
              <a-select-option value="p32">
                Phase II/III
              </a-select-option>
              <a-select-option value="p3">
                Phase III
              </a-select-option>
              <a-select-option value="p3a">
                Phase III a
              </a-select-option>
              <a-select-option value="p3b">
                Phase III b
              </a-select-option>
              <a-select-option value="p4">
                Phase IV
              </a-select-option>
              <a-select-option value="p0NA">
                NA
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="Date of Generation">
            <a-date-picker v-model:value="codeGeneratorForm.trialGenerationDate" type="date"/>
          </a-form-item>
          <a-form-item label="Country Code">
            <a-input v-model:value="codeGeneratorForm.trialCountryCode" type="text" placeholder="Please input the 3-letter country code or country name, separated by commas"
                     @blur="standardiseTrialCountryCode(codeGeneratorForm.trialCountryCode)"/>
          </a-form-item>
          <a-form-item :wrapper-col="wrapperColButton" class="button-container">
            <a-button type="primary" @click="generateTrialCode" v-if="!waiting">
              <CheckCircleOutlined />Generate
            </a-button>
            <a-spin v-else/>
            <span>&nbsp;</span>
            <a-button type="primary" @click="showExample">
              <InfoCircleOutlined />Example
            </a-button>
          </a-form-item>
        </a-form>
      </div>
      <div class="submitResult" v-else>
        <a-result :status="submissionResult.status" :title="submissionResult.title"
                  :sub-title="submissionResult.subTitle">
          <template #extra>
            <a-button type="primary" @click="pushRoute('trial-list')">
              Trial List
            </a-button>
          </template>
        </a-result>
      </div>
    </a-col>

  </a-row>
</template>

<script>
import moment from 'moment';
import {
  formatTrialCode,
  standardiseTrialCompoundName,
  standardiseTrialCountryCode,
} from '../utils/formatter.js';
import {
  SmileOutlined,
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons-vue';
export default {
  components: {
    SmileOutlined,
    UserOutlined,
    LaptopOutlined,
    NotificationOutlined,
    CheckCircleOutlined,
    InfoCircleOutlined,
  },
  data () {
    return {
      submitted: false,
      waiting: false,
      labelCol: { span: 6 },
      wrapperColContent: { span: 18 },
      wrapperColButton: { span: 24 },
      codeGeneratorForm: {
        trialCompoundName: undefined,
        trialPhase: undefined,
        trialGenerationDate: moment(new Date(), 'YYYY-MM-DD'),
        trialCountryCode: undefined,
      },
      submissionResult: {
        status: '500',
        title: 'Internal Error',
        subTitle: 'It seems that an internal error has happened...',
      },
    };
  },
  mounted() {
    this.$notification['info']({
      message: 'Welcome',
      description: 'Hi, nice to meet you! If you have any suggestion or bug report on this public test version, feel free to contact us through fanyang@hrglobe.cn.',
    });
  },
  methods: {
    showExample: function () {
      this.codeGeneratorForm.trialCompoundName = 'SHR1210';
      this.codeGeneratorForm.trialPhase = 'p1';
      this.codeGeneratorForm.trialCountryCode = 'CHN,USA';
    },
    standardiseTrialCompoundName: function (compoundName) {
      this.codeGeneratorForm.trialCompoundName = standardiseTrialCompoundName(compoundName).result;
    },
    standardiseTrialCountryCode: function (countryCode) {
      this.codeGeneratorForm.trialCountryCode = standardiseTrialCountryCode(countryCode).result;
    },
    generateTrialCode: function () {
      if (
          !standardiseTrialCompoundName(this.codeGeneratorForm.trialCompoundName).status ||
          !standardiseTrialCountryCode(this.codeGeneratorForm.trialCountryCode).status
      ) {
        // error occurred
        console.log(standardiseTrialCompoundName().status ,standardiseTrialCountryCode().status)
        this.$message.error('Please check your input and correct the mistakes!', 6);
        return;
      }
      this.waiting = true;
      this.$axios.post(
          '/trial/generate',
          {
            newTrial: this.codeGeneratorForm,
          },
      ).then((response) => {
        console.log(response);
        this.submissionResult.status = 'success';
        this.submissionResult.title = 'Action Succeeded';
        const createdTrial = response.data.createdTrial;
        const trialCode = formatTrialCode(createdTrial);
        this.submissionResult.subTitle = `Your submission is successful and the unique trial code is ${ trialCode }.`;
      }).catch((error) => {
        console.log(error);
        this.submissionResult.status = 'error';
        this.submissionResult.title = 'Action Failed';
        this.submissionResult.subTitle = `Your submission failed, detailed error is listed as follows: ${ error }.`;
      }).finally(() => {
        this.waiting = false;
        this.submitted = true;
      });
    },
    pushRoute: function (routeName) {
      this.$router.push({
        name: routeName,
      })
    },
  },
}
</script>

<style scoped>
.generatorForm, .submitResult {
  background-color: #fff;
  padding: 24px;
}
.header {
  font-weight: lighter;
  font-size: xx-large;
  margin: 4px 4px 20px 4px;
  padding: 4px;
  text-align: center;
}
.button-container {
  text-align: center;
}
.generatorForm {
  border-radius: 25px;
  background-color: #ffffffde;
}
</style>