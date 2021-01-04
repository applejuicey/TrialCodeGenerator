<template>

  <a-row type="flex" justify="space-around" align="middle" class="about-form-wrapper">
    <a-col :lg="16" :offset-lg="4">
      <a-card title="About the 'Trial Code Generator'" :bordered="false">
        <div class="para-title">
          About Version Number (e.g. <span class="version-number">V a.b.c</span>):
        </div>
        <div class="para-body">
          <ul>
            <li>Increment position '<span class="version-number">a</span>' when database schema has been changed;</li>
            <li>Increment position '<span class="version-number">b</span>' when database schema has not been changed and major revision has been made;</li>
            <li>Increment position '<span class="version-number">c</span>' when database schema has not been changed and minor revision has been made.</li>
          </ul>
        </div>
        <div class="para-title">
          Update Log:
        </div>
        <div class="para-body">
          <ul>
            <li>
              <span class="version-number">V 3.0.0</span>
              <ul>
                <li>ADD: Value validation before submission of the form on 'Generate Page';</li>
                <li>REV: Content of 'Instruction' on 'Control Panel Page';</li>
                <li>REV: Login status expiry time shortened from 24h to 1h;</li>
                <li>REV: 'Trial Phase' dropdown selection choices appended;</li>
                <li>REV: Content of 'About Page' added;</li>
                <li>REV: Icon of the APP embellished.</li>
              </ul>
            </li>
            <li>
              <span class="version-number">V 2.0.0</span>
              <ul>
                <li>ADD: Login module added.</li>
              </ul>
            </li>
            <li>
              <span class="version-number">V 1.0.0</span>
              <ul>
                <li>Initial Version Deployed.</li>
              </ul>
            </li>
          </ul>
        </div>
      </a-card>
    </a-col>
  </a-row>

</template>

<script>
export default {
  data() {
    return {

    }
  },
  methods: {

  },
}
</script>

<style scoped>
.about-form-wrapper {
  text-align: center;
}
.para-title {
  text-align: left;
  font-size: medium;
}
.para-body {
  text-align: left;
}
.version-number {
  font-weight: bold;
  color: #ff5500;
}
.button-container {
  margin-bottom: 0;
}
</style>