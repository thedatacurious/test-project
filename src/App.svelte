<script>
  import { LayerCake, Svg, calcExtents, flatten } from "layercake";
  import Sankey from "./lib/Sankey.svelte";
  import Range from "./lib/Range.svelte";
  import SmallMultiple from "./lib/SmallMultiple.svelte";
  import { sankeyData, ChinaAfricaInfo, regionalNested } from "./data.js";

  $: sankeyYear = 2010;
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
  <h1>Placeholder Title</h1>

  <h3>Placeholder Section: Intro & regional differences</h3>

  <p>Beeswarm plot 1</p>

  <p>Beeswarm plot 1</p>

  <h3>Renewable Investments</h3>

  <div class="input-container">
    <label
      ><input type="radio" bind:group={chart} value="Investment" />Renewable
      energy investment received</label
    >
    <label
      ><input type="radio" bind:group={chart} value="Usage" />Usage of renewable
      energy as a proportion of primary energy</label
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
    The chart below shows renewable energy finance flows from donors (left) to
    regional recipients (right), measured in 2020 USD million.
  </p>

  {#if loanAmount != 0}
    <p>
      As a direct investor, China has been a major source of such flows to
      Africa. However, the flows appear to be all loans, as opposed to other
      finance types like grants. In {sankeyYear}, China issued US${loanAmount} mil
      of loans to African countries.
    </p>
  {:else}
    <p>
      As a direct investor, China has been a major source of such flows to
      Africa. However, the flows consist only of loans, as opposed to other
      finance types like grants. There was no record of finance flows from China
      to African countries in {sankeyYear} in IRENA database.
    </p>
  {/if}

  <div>
    <label for="basic-range">Year</label>
    <Range
      on:change={(e) => (sankeyYear = e.detail.value)}
      id="basic-slider"
      min={2000}
      max={2020}
      initialValue={2010}
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
    margin-bottom: 7px;
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
