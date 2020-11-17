<template>
  <a-layout id="code-generator">

    <a-layout-content class="generatorForm" v-if="!submitted">
      <div class="header">
        <span>Trial Code Generator</span>
      </div>
      <a-form :model="codeGeneratorForm" :label-col="labelCol" :wrapper-col="wrapperColContent">
        <a-form-item label="Compound Name">
          <a-input v-model:value="codeGeneratorForm.trialCompoundName" placeholder="Please input the compound name" type="text"/>
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
        <a-form-item label="Enable Country Code">
          <a-switch v-model:checked="codeGeneratorForm.countryCodeFlag"/>
        </a-form-item>
        <a-form-item label="Country Code" v-if="codeGeneratorForm.countryCodeFlag === true">
          <a-input v-model:value="codeGeneratorForm.trialCountryCode" type="text"/>
        </a-form-item>
        <a-form-item :wrapper-col="wrapperColButton" class="button-container">
          <a-button type="primary" @click="generateTrialCode" v-if="!waiting">
            Generate
          </a-button>
          <a-spin v-else/>
        </a-form-item>
      </a-form>
    </a-layout-content>

    <a-layout-content class="submitResult" v-else>
      <a-result :status="submissionResult.status" :title="submissionResult.title"
          :sub-title="submissionResult.subTitle">
        <template #extra>
          <a-button type="primary" @click="pushRoute('trial-list')">
            Trial List
          </a-button>
        </template>
      </a-result>
    </a-layout-content>

  </a-layout>
</template>

<script>
import moment from 'moment';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons-vue';
export default {
  components: {
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
        countryCodeFlag: false,
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
    generateTrialCode: function () {
      this.waiting = true;
      this.$axios.post(
          '/generate',
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
#code-generator .generatorForm, .submitResult {
  background-color: #fff;
  padding: 24px;
}
#code-generator .header {
  font-size: xx-large;
  margin: 4px;
  padding: 4px;
  text-align: center;
}
#code-generator .button-container {
  text-align: center;
}
</style>