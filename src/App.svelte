<script>
  import { LayerCake, Svg, calcExtents, flatten } from "layercake";
  import Sankey from "./lib/Sankey.svelte";
  import Range from "./lib/Range.svelte";
  import SmallMultiple from "./lib/SmallMultiple.svelte";
  import { sankeyData, ChinaAfricaInfo, regionalNested } from "./data.js";

  $: sankeyYear = 2003;
  $: filteredSankeyData = sankeyData[sankeyYear];
  $: loanAmount = ChinaAfricaInfo[sankeyYear] ?? 0;

  const extentGetters = {
    x: (d) => d.year,
    y1: (d) => d.regionalInvestment,
    y2: (d) => d.regionalAvg,
  };

  const fullExtents = calcExtents(flatten(regionalNested), extentGetters);
  let chart = "Investment";
</script>

<main>
  <h1>The darker side of energy transition riches</h1>

  <p>
    Renewables are becoming an important source of energy over the years. Not
    only is it seen as a solution to our climate crisis—using renewables as
    opposed to other forms of gas such as coal/fossil fuels/oil releases less
    greenhouse gas—but reports also show that consumption of renewables can
    reduce income inequality.
  </p>

  <p>
    Countries where renewable energy use is close to half (47%) of total energy
    consumption will see income inequality decrease by 0.2% for every additional
    1% percent increase in renewable consumption, according to a study conducted
    by the <a href="https://www.sussex.ac.uk/broadcast/read/55693"
      >University of Sussex</a
    >.
  </p>

  <p>
    But data shows that progress has been unequal across continents, especially
    in developing countries and regions like Africa although they are rich in
    wind, solar, hydro, and geothermal energy sources.
  </p>

  <p>[Beeswarm plots placeholder]</p>

  <p>
    We take a look at how much investment each region is receiving for renewable
    energy from 2000 to 2020. Despite the high investment amount in Sub-Saharan
    Africa, the share of primary energy from renewable sources has been pretty
    stagnant.
  </p>

  <div class="input-container">
    <label
      ><input type="radio" bind:group={chart} value="Investment" />Investment
      received</label
    >
    <label
      ><input type="radio" bind:group={chart} value="Usage" />Usage of renewable
      energy</label
    >
  </div>

  <div class="small-multiple-container">
    {#each regionalNested as data}
      <div class="line-container">
        <SmallMultiple {data} {fullExtents} {chart} {extentGetters} />
      </div>
    {/each}
  </div>

  <p>
    Upon of closer analysis of renewable energy finance flows from donors (left)
    to regional recipients (right), we see that China has been one of the
    biggest donors to Africa from 2003.
  </p>

  {#if loanAmount != 0}
    <p>
      However, the flows are in the form of loans, as opposed to other finance
      types like grants. In {sankeyYear}, China issued US${loanAmount} mil of loans
      to African countries.
    </p>
  {:else}
    <p>
      However, the flows are in the form of loans, as opposed to other finance
      types like grants. There was no record of finance flows from China to
      African countries in {sankeyYear} in
      <a
        href="https://www.irena.org/Data/View-data-by-topic/Finance-and-Investment/Renewable-Energy-Finance-Flows"
        >IRENA database</a
      >.
    </p>
  {/if}

  <p>
    <a
      href="https://www.sciencedirect.com/science/article/pii/S0305750X20304939"
      >Some studies</a
    > of Chinese investment renewable projects caution against overly optimistic
    expectations of co-benefits.
  </p>

  <div>
    <label for="basic-range">Year</label>
    <Range
      on:change={(e) => (sankeyYear = e.detail.value)}
      id="basic-slider"
      min={2000}
      max={2020}
      initialValue={2003}
    />
  </div>
  {sankeyYear}

  <div class="sankey-container">
    <LayerCake data={filteredSankeyData}>
      <Svg>
        <Sankey />
      </Svg>
    </LayerCake>
  </div>
</main>

<style>
  .small-multiple-container {
    height: 600px;
    width: 100%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
  .input-container {
    margin-top: 7px;
  }
  label {
    cursor: pointer;
  }
  input {
    margin-right: 7px;
  }
  .line-container {
    width: 15%;
    height: 40%;
  }

  .sankey-container {
    width: 100%;
    height: 800px;
  }
</style>
