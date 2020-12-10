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
              We suggest that spaces should not be included in the middle of the compound name.
              This information will be used when generating the unique trial code.
            </li>
            <li>
              An exhaustive list of 'I', 'II', 'III' and 'IV' is employed in the '<b>Trial Phase</b>' dropdown selector.
              This information will be used when generating the unique trial code.
            </li>
            <li>
              The '<b>Date of Generation</b>' calendar dropdown selector provides the date that the record was created.
            </li>
            <li>
              The '<b>Country Code</b>' should be an valid Alpha-3 code (e.g. <span class="ant-green">CHN</span>) or the english short name (e.g. <span class="ant-green">China</span>) of the country according to the
              <a href="https://en.wikipedia.org/wiki/ISO_3166-1">ISO-3166-1</a>.
            </li>
          </ul>
        </template>
      </a-alert>
      <div class="divider">
        &nbsp;
      </div>
      <div class="generatorForm" v-if="!submitted">
        <div class="header">
          <span>Trial Code Generator</span>
        </div>
        <a-form :model="codeGeneratorForm" :label-col="labelCol" :wrapper-col="wrapperColContent">
          <a-form-item label="Compound Name">
            <a-input v-model:value="codeGeneratorForm.trialCompoundName" placeholder="Please input the compound name" type="text" @blur="standardiseTrialCompoundName" autofocus/>
          </a-form-item>
          <a-form-item label="Trial Phase">
            <a-select v-model:value="codeGeneratorForm.trialPhase" placeholder="Please select a trial phase">
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
          <a-form-item label="Date of Generation">
            <a-date-picker v-model:value="codeGeneratorForm.trialGenerationDate" type="date"/>
          </a-form-item>
          <a-form-item label="Country Code">
            <a-input v-model:value="codeGeneratorForm.trialCountryCode" type="text" placeholder="Please input the 3-letter country code or country name" @blur="standardiseTrialCountryCode"/>
          </a-form-item>
          <a-form-item :wrapper-col="wrapperColButton" class="button-container">
            <a-button type="primary" @click="generateTrialCode" v-if="!waiting">
              Generate
            </a-button>
            <a-spin v-else/>
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
import country from 'country-list-js';
import {
  SmileOutlined,
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
} from '@ant-design/icons-vue';
export default {
  components: {
    SmileOutlined,
    UserOutlined,
    LaptopOutlined,
    NotificationOutlined,
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
    standardiseTrialCompoundName: function () {
      try {
        this.codeGeneratorForm.trialCompoundName = this.codeGeneratorForm.trialCompoundName.trim().toUpperCase();
      } catch (error) {
        this.$message.error('Please provide a valid compound name!', 6);
      }
    },
    standardiseTrialCountryCode: function () {
      let initialUpperCase = (someString) => {
        someString = someString.toLowerCase();
        let [initial, ...rest] = someString;
        return initial.toUpperCase() + rest.join('');
      };
      try {
        let foundCountryByISO3 = country.findByIso3(this.codeGeneratorForm.trialCountryCode.trim().toUpperCase());
        if (foundCountryByISO3) {
          this.codeGeneratorForm.trialCountryCode = this.codeGeneratorForm.trialCountryCode.trim().toUpperCase();
          return true;
        }
        let foundCountryByName = country.findByName(initialUpperCase(this.codeGeneratorForm.trialCountryCode.trim()));
        if (foundCountryByName) {
          this.codeGeneratorForm.trialCountryCode = foundCountryByName.code.iso3.trim();
          return true;
        }
        this.$message.error(`The country '${ this.codeGeneratorForm.trialCountryCode.trim() }' cannot be found according to ISO 3166. Please confirm your input!`, 6);
        this.codeGeneratorForm.trialCountryCode = undefined;
      } catch (error) {
        this.$message.error('Please provide a valid 3-letter country code or country name according to the ISO-3166!', 6);
      }
    },
    formatTrialPhase: function (value) {
      const phaseMap = new Map();
      phaseMap.set('p1', 'I').set('p2', 'II').set('p3', 'III').set('p4', 'IV');
      return phaseMap.get(value);
    },
    formatTrialUniqueSequenceCode: function (value) {
      let stringifiedSequenceCode = value.toString();
      if (stringifiedSequenceCode.length === 1 ) {
        return '0' + stringifiedSequenceCode;
      } else {
        return stringifiedSequenceCode;
      }
    },
    formatTrialCountryCode: function (value) {
      if (value === 'CHN') {
        return '';
      } else {
        return '-' + value;
      }
    },
    formatTrialCode: function (trialRecord) {
      return trialRecord.trialCompoundName + '-' + trialRecord.trialPhase.substr(1, 1) +
          this.formatTrialUniqueSequenceCode(trialRecord.trialUniqueSequenceCode) +
          this.formatTrialCountryCode(trialRecord.trialCountryCode);
    },
    generateTrialCode: function () {
      this.waiting = true;
      this.$axios.post(
          '/trial/generate',
          {
            newTrial: this.codeGeneratorForm,
          },
      ).then((response) => {
        console.log(response);
        this.waiting = false;
        this.submitted = true;
        this.submissionResult.status = 'success';
        this.submissionResult.title = 'Action Succeeded';
        const createdTrial = response.data.createdTrial;
        const trialCode = this.formatTrialCode(createdTrial);
        this.submissionResult.subTitle = `Your submission is successful and the unique trial code is ${ trialCode }.`;
      }).catch((error) => {
        console.log(error);
        this.waiting = false;
        this.submitted = true;
        this.submissionResult.status = 'error';
        this.submissionResult.title = 'Action Failed';
        this.submissionResult.subTitle = `Your submission failed, detailed error is listed as follows: ${ error }.`;
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
  font-size: xx-large;
  margin: 4px;
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