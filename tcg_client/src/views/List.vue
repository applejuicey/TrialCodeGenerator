<template>
  <a-row>

    <a-col :lg="6">
      <a-form :model="codeGeneratorForm" :label-col="labelCol" :wrapper-col="wrapperColContent">
        <a-form-item label="Compound Code">
          <a-input v-model:value="codeGeneratorForm.compoundCode" placeholder="Please input the compound code" type="text"/>
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
          <a-date-picker v-model:value="codeGeneratorForm.dateOfGeneration" type="date"/>
        </a-form-item>
        <a-form-item label="Enable Country Code">
          <a-switch v-model:checked="codeGeneratorForm.countryCodeFlag"/>
        </a-form-item>
        <a-form-item label="Country Code" v-if="codeGeneratorForm.countryCodeFlag === true">
          <a-input v-model:value="codeGeneratorForm.countryCode" type="text"/>
        </a-form-item>
        <a-form-item :wrapper-col="wrapperColButton" class="button-container">
          <a-button type="primary" @click="generateTrialCode" v-if="!waiting">
            Generate
          </a-button>
          <a-spin v-else/>
        </a-form-item>
      </a-form>
    </a-col>

    <a-col :lg="18">
      222222222222222222222222222222222222222222222222222222222222222
    </a-col>

  </a-row>
</template>

<script>
import moment from "moment";

export default {
  name: 'Home',
  components: {

  },
  data() {
    return {
      labelCol: { span: 6 },
      wrapperColContent: { span: 18 },
      wrapperColButton: { span: 24 },
      codeGeneratorForm: {
        compoundCode: '',
        trialPhase: undefined,
        dateOfGeneration: moment(new Date(), 'YYYY-MM-DD'),
        countryCodeFlag: false,
        countryCode: '',
      },
    };
  },

}
</script>

<style scoped>
#code-list .sider {
  width: 200px;
  background-color: #fff;
}
</style>