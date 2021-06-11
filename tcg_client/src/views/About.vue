<template>

  <a-row type="flex" justify="space-around" align="middle">
    <a-col :lg="16" :offset-lg="4">
      <div class="my-table-wrapper">
        <div class="my-card-header-title">
          the 'Clinical Trial Protocol Code Registration Platform'
        </div>
        <div class="para-title">
          About Version Number (e.g. <span class="version-number">V a.b.c</span>):
        </div>
        <div class="para-body">
          <ul>
            <li>Increment position '<span class="version-number">a</span>' when database schema has been changed.</li>
            <li>Increment position '<span class="version-number">b</span>' when database schema has not been changed and major revision has been made.</li>
            <li>Increment position '<span class="version-number">c</span>' when database schema has not been changed and minor revision has been made.</li>
          </ul>
        </div>
        <div class="para-title">
          Update Log:
        </div>
        <div class="para-body">
          <ul>
            <li>
              <span class="version-number">V 5.0.0</span>
              <ul>
                <li>REV: Valid compounds will now be imported on database initialisation.</li>
                <li>REV: Default sequence of trials in the table on 'List' page is changed, which means 'Proposed' trials will
                    be shown in the top rows.</li>
                <li>REV: Table pagination BUGs fixed on 'List' page.</li>
                <li>ADD: Usertype of readonly is added.</li>
                <li>ADD: 'Protocol Name' field added.</li>
                <li>REV: The sequence number algorithm is revised. Now '4' will never appear in the protocol code.</li>
              </ul>
            </li>
            <li>
              <span class="version-number">V 4.2.0</span>
              <ul>
                <li>ADD: 'International Indicator Column' is added on 'Summary Table'.</li>
                <li>ADD: CSV export functions are added on the 'Summary' page.</li>
                <li>ADD: Compound name validation base on a name pool is added.</li>
                <li>ADD: External data can now be imported.</li>
              </ul>
            </li>
            <li>
              <span class="version-number">V 4.1.0</span>
              <ul>
                <li>REV: 'Trial Phase' matching codes are revised.</li>
                <li>REV: Country suffix is now removed from the generated trial protocol code.</li>
                <li>
                  REV: International trials no longer need to be marked by 'INT' in the 'Country' field.
                  They can be identified automatically if there are more than one country in the 'Country' field.
                </li>
                <li>ADD: APP name translation is added.</li>
              </ul>
            </li>
            <li>
              <span class="version-number">V 4.0.0</span>
              <ul>
                <li>REV: New 'Trial Phase' dropdown selection choices are appended.</li>
                <li>REV: The sequence number algorithm is revised.</li>
                <li>REV: International multi-centre trials now can be marked by 'INT' in the 'Country' field.</li>
                <li>REV: Mobile-end responsive features are improved.</li>
              </ul>
            </li>
            <li>
              <span class="version-number">V 3.0.1</span>
              <ul>
                <li>REV: Mobile-end responsive features are improved.</li>
              </ul>
            </li>
            <li>
              <span class="version-number">V 3.0.0</span>
              <ul>
                <li>ADD: Form validation before submission on 'Generate Page' is added.</li>
                <li>REV: Content of 'Instruction' on 'Control Panel Page' is revised.</li>
                <li>REV: Login status expiry time is shortened from 24h to 1h.</li>
                <li>REV: New 'Trial Phase' dropdown selection choices are appended.</li>
                <li>REV: A new 'About Page' is added.</li>
                <li>REV: Icon of the APP is embellished.</li>
              </ul>
            </li>
            <li>
              <span class="version-number">V 2.0.0</span>
              <ul>
                <li>ADD: A login module is added.</li>
              </ul>
            </li>
            <li>
              <span class="version-number">V 1.0.0</span>
              <ul>
                <li>Initial Deployment</li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
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
</style>