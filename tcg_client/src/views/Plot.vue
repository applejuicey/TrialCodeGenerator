<template>
  <a-row>

    <a-col :lg="24" class="content">
      <div class="my-table-wrapper">

        <a-row :gutter="22">
          <a-col :xl="12">
            <div class="canvas-container">
              <!--  所有产品的饼图  -->
              <canvas id="allProductsDoughnut" ></canvas>
            </div>
            <div>
              <ul>
                <li>This doughnut plot shows the number of trials of each product in each phase.</li>
                <li>Each ring refers to to a trial phase.</li>
                <li>The outermost ring shows the constituent ratio of phase I trials.</li>
                <li>From outside to inside, the rings refers to phase I, II, III, IV and total respectively.</li>
              </ul>
            </div>
          </a-col>
          <a-col :xl="12">
            <div class="canvas-container">
              <!--  TOP5产品的堆叠条图  -->
              <canvas id="top5ProductsStackedBar" ></canvas>
            </div>
            <div>
              <ul>
                <li>This stacked bar chart shows the phase distribution of the top 5 star products.</li>
                <li>Each color refers to one of the top 5 star products.</li>
              </ul>
            </div>
          </a-col>
        </a-row>

        <a-row :gutter="22">
          <a-col :xl="24">
            <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
              <a-form-item label="Product Name">
                <a-auto-complete
                    @blur="standardiseTrialCompoundName(compoundName)"
                    v-model:value="compoundName"
                    placeholder="Please input the compound name" type="text"
                    :data-source="compoundPool"
                />
              </a-form-item>
            </a-form>
          </a-col>
        </a-row>

        <a-row :gutter="22">
          <a-col :xl="12">
            <div class="canvas-container">
              <!--  特定产品的每月新增项目折线图  -->
              <canvas id="oneProductMonthLine" ></canvas>
            </div>
            <div>
              <ul>
                <li>This line chart shows the number of trials registered in each month.</li>
                <li>Each line refers to a trial phase.</li>
              </ul>
            </div>
          </a-col>
          <a-col :xl="12">
            <div class="canvas-container">
              <!--  特定产品的分期极区图  -->
              <canvas id="oneProductPhasesPolarArea" ></canvas>
            </div>
            <div>
              <ul>
                <li>This polar area plot shows the number of trials in each phase.</li>
              </ul>
            </div>
          </a-col>
        </a-row>

      </div>
    </a-col>

  </a-row>
</template>

<script>
import Chart from 'chart.js/auto';
import {
  standardiseTrialCompoundName,
} from '../utils/formatter.js';
import { compounds } from '../utils/compounds.js';
export default {
  components: {

  },
  data() {
    return {
      c3: undefined,
      c4: undefined,
      compoundName: 'SHR-1210',
      compoundPool: compounds,
      trials: [],
      essentials: {
        // 所有产品名
        products: [],
        // 每个产品对应的颜色
        colors: [],
        // 每个产品0-IV分期计数、合计
        counterMatrix: [],
        internationalMatrix: [],
        phaseNames: ['Phase 0', 'Phase I', 'Phase II', 'Phase III', 'Phase IV', 'Total'],
        phaseColors: [
          'rgba(123, 232, 176, 0.2)',
          'rgba(42, 35, 3, 0.2)',
          'rgba(53, 153, 134, 0.2)',
          'rgba(255, 15, 32, 0.2)',
          'rgba(35, 22, 201, 0.2)',
          'rgba(135, 22, 13, 0.2)',
        ],
      },
      allProductsDoughnutConfig: {
        type: 'doughnut',
        data: {
          datasets: [],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Number of Trials per Product per Phase'
            }
          }
        }
      },
      top5ProductsStackedBarConfig: {
        type: 'bar',
        data: {
          labels: undefined,
          datasets: []
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: 'Stacked Phase Distribution of TOP 5 Star Products'
            },
          },
          responsive: true,
          scales: {
            x: { stacked: true },
            y: { stacked: true },
          }
        }
      },
      oneProductMonthLineConfig: {
        type: 'line',
        data: {
          labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC', ],
          datasets: []
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Number of SHR-1210 Trials Registered per Phase per Month'
            }
          }
        }
      },
      oneProductPhasesPolarAreaConfig: {
        type: 'polarArea',
        data: {
          labels: undefined,
          datasets: [
            {
              data: [],
              backgroundColor: undefined,
            },
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Phase Constitution of all SHR-1210 Trials'
            }
          }
        }
      },
    };
  },
  async mounted () {

    // 获取所有trials数组
    this.trials = await this.getAllTrials();
    console.log('trials', this.trials)

    // 获取essentials
    this.setEssentials(this.trials);
    console.log('setEssentials',this.essentials)

    // 所有产品的甜甜圈图
    this.setData4AllProductsDoughnut();
    let allProductsDoughnut = document.getElementById('allProductsDoughnut');
    let c1 = new Chart(
        allProductsDoughnut,
        this.allProductsDoughnutConfig
    );

    // TOP5产品的堆叠条图
    this.setData4Top5ProductsStackedBar();
    let top5ProductsStackedBar = document.getElementById('top5ProductsStackedBar');
    let c2 = new Chart(
        top5ProductsStackedBar,
        this.top5ProductsStackedBarConfig
    );

    // 特定产品的每月新增项目折线图
    let oneProductMonthLine = document.getElementById('oneProductMonthLine');
    this.setData4OneProductMonthLine(this.compoundName, oneProductMonthLine);



    // 特定产品的分期极区图
    this.setData4OneProductPhasesPolarArea(this.compoundName);
    let oneProductPhasesPolarArea = document.getElementById('oneProductPhasesPolarArea');
    this.c4 = new Chart(
        oneProductPhasesPolarArea,
        this.oneProductPhasesPolarAreaConfig
    );

  },
  methods: {

    standardiseTrialCompoundName: function (compoundName) {
      this.compoundName = standardiseTrialCompoundName(compoundName).result;
      let oneProductMonthLine = document.getElementById('oneProductMonthLine');
      this.setData4OneProductMonthLine(this.compoundName, oneProductMonthLine);
      // console.log('jjj2',this.oneProductPhasesPolarAreaConfig.data.datasets[0].data )
      // this.oneProductPhasesPolarAreaConfig.data.datasets[0].data[0] = 99;
      // // console.log('bnlur',this.c3)
      // // this.c3.update();
      // // this.setData4OneProductPhasesPolarArea(this.compoundName);
      // console.log('bnlur2',this.c4)
      // this.c4.update();
    },

    // 数组求和
    sumArr: function (arr) {
      let sum = 0;
      arr.forEach((val, index, arr) => {
        sum += val;
      })
      return sum;
    },

    // 为每个compound设定颜色
    getColors: function (number) {
      let colors = [];
      for (let i = 0; i < number; i++) {
        colors.push(`rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.2)`);
      }
      return colors;
    },

    // 从服务端获取所有项目信息
    getAllTrials: async function () {
      try {
        const response = await this.$axios.post('/trial/query', {
          batchQueryParams: {},
        });
        // 获取项目资料成功
        if (['1'].includes(response.data.statusCode)) {
          return response.data.queryResults.hitTargets;
        }
      } catch (error) {
        console.error(error);
      }
    },

    // 获取essentials
    setEssentials: function (trials) {
      let uniqueCompoundNames = [];
      let counterMatrix = [];
      let internationalMatrix = [];
      // 准备初始数据存储变量
      trials.forEach((trial) => {
        if (!uniqueCompoundNames.includes(trial.trialCompoundName)) {
          uniqueCompoundNames.push(trial.trialCompoundName);
          // 分别对应0-IV期共5种
          counterMatrix.push([0, 0, 0, 0, 0]);
          internationalMatrix.push([0, 0, 0, 0, 0]);
        }
      });
      // 迭代所有项目并计数
      trials.forEach((rawRecord) => {
        // 计数各期型的项目
        counterMatrix[uniqueCompoundNames.indexOf(rawRecord.trialCompoundName)][rawRecord.trialPhase.substr(1, 1)] ++;
        // 计数各期型的国际多中心项目
        if (rawRecord.trialCountryCode.split(',').length > 1) {
          internationalMatrix[uniqueCompoundNames.indexOf(rawRecord.trialCompoundName)][rawRecord.trialPhase.substr(1, 1)] ++;
        }
      });
      // 计算0-IV期合计
      counterMatrix.forEach((compound) => {
        compound[5] = this.sumArr(compound);
      });
      // 为data中essentials的赋值
      this.essentials.products = uniqueCompoundNames;
      this.essentials.colors = this.getColors(uniqueCompoundNames.length);
      this.essentials.counterMatrix = counterMatrix;
      this.essentials.internationalMatrix = internationalMatrix;
    },

    // 解析并生成所有产品的甜甜圈图所需数据
    setData4AllProductsDoughnut: function () {
      // 设定labels
      this.allProductsDoughnutConfig.data.labels = this.essentials.products;
      // 设定datasets
      let phaseCounter = [[], [], [], [], [], []];
      this.essentials.counterMatrix.forEach((compound) => {
        phaseCounter[0].push(compound[0]);
        phaseCounter[1].push(compound[1]);
        phaseCounter[2].push(compound[2]);
        phaseCounter[3].push(compound[3]);
        phaseCounter[4].push(compound[4]);
        phaseCounter[5].push(compound[5]);
      });
      // 为统计图填充数据
      for (let i = 0; i < phaseCounter.length; i++) {
        this.allProductsDoughnutConfig.data.datasets.push({
          label: `Phase ${ i }`,
          data: phaseCounter[i],
          backgroundColor: this.essentials.colors,
        });
      }
    },

    // 解析并生成TOP5产品的堆叠条图所需数据
    setData4Top5ProductsStackedBar: function () {
      // 设定datasets
      let phaseCounter = [[], [], [], [], [], []];
      this.essentials.counterMatrix.forEach((compound) => {
        phaseCounter[0].push(compound[0]);
        phaseCounter[1].push(compound[1]);
        phaseCounter[2].push(compound[2]);
        phaseCounter[3].push(compound[3]);
        phaseCounter[4].push(compound[4]);
        phaseCounter[5].push(compound[5]);
      });
      // 获取试验数目TOP5的产品的index
      let top5Count = [...phaseCounter[5]];
      top5Count.sort((a, b) => {return b - a});
      top5Count.length = 5;
      let top5Index = [];
      top5Count.forEach((number) => {
        top5Index.push(phaseCounter[5].indexOf(number));
      });
      // 为统计图填充数据
      let noTotalLabels = [...this.essentials.phaseNames];
      noTotalLabels.length = 5;
      this.top5ProductsStackedBarConfig.data.labels = noTotalLabels;
      top5Index.forEach((index) => {
        let noTotalCount = [...this.essentials.counterMatrix[index]];
        noTotalCount.length = 5;
        this.top5ProductsStackedBarConfig.data.datasets.push({
          label: `${ this.essentials.products[index] }`,
          data: noTotalCount,
          backgroundColor: [`${ this.essentials.colors[index] }`],
        });
      });
    },

    // 特定产品的每月新增项目折线图
    setData4OneProductMonthLine: function (compoundName, element) {
      let phaseCounter = [[0,0,0,0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0,0,0,0], []];
      // 迭代所有项目并计数
      this.trials.forEach((trial) => {
        // 判断是否为目标产品
        if (trial.trialCompoundName === compoundName) {
          // 迭代各分期
          for (let i = 0; i < 5; i++) {
            if (trial.trialPhase.substr(1,1) == i) {
              // 每个月份
              let month = parseInt(trial.trialGenerationDate.substr(5, 2));
              phaseCounter[i][month - 1] ++;
            }
          }
        }
      });
      // 计算total
      for (let i = 0; i < 12; i++) {
        phaseCounter[5].push(phaseCounter[0][i] + phaseCounter[1][i] + phaseCounter[2][i] + phaseCounter[3][i] + phaseCounter[4][i]);
      }
      // 为统计图填充数据
      this.oneProductMonthLineConfig.data.datasets = [];
      phaseCounter.forEach((data, index) => {
        this.oneProductMonthLineConfig.data.datasets.push({
          label: this.essentials.phaseNames[index],
          data: data,
          backgroundColor: this.essentials.phaseColors[index],
        });
      });
      // 绘图
      let c3 = new Chart(
          element,
          this.oneProductMonthLineConfig
      );
    },

    // 特定产品的分期极区图
    setData4OneProductPhasesPolarArea: function (compoundName) {
      // 获取特定产品的index
      let compoundIndex = this.essentials.products.indexOf(compoundName);
      let noTotalData = [...this.essentials.counterMatrix[compoundIndex]];
      noTotalData.length = 5;
      let noTotalLabels = [...this.essentials.phaseNames];
      noTotalLabels.length = 5;
      let noTotalColors = [...this.essentials.phaseColors];
      noTotalColors.length = 5;
      // 为统计图填充数据
      this.oneProductPhasesPolarAreaConfig.data.labels = noTotalLabels;
      this.oneProductPhasesPolarAreaConfig.data.datasets[0].data = [];
      this.oneProductPhasesPolarAreaConfig.data.datasets[0].data = noTotalData;
      this.oneProductPhasesPolarAreaConfig.data.datasets[0].backgroundColor = noTotalColors;
    },

  },
}
</script>

<style scoped>
.canvas-container {
  padding: 10px;
}
</style>