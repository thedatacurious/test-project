<script>
  import { LayerCake, Svg } from "layercake";
  import Sankey from "./lib/Sankey.svelte";
  import Range from "./lib/Range.svelte";
  import { sankeyData, ChinaAfricaInfo } from "./data.js";

  $: sankeyYear = 2010;
  $: filteredSankeyData = sankeyData[sankeyYear];
  $: loanAmount = ChinaAfricaInfo[sankeyYear] ?? 0;
</script>

<main>
  <h1>Placeholder Title</h1>

  <h3>Placeholder Section: Intro & regional differences</h3>

  <p>Beeswarm plot 1</p>

  <p>Beeswarm plot 1</p>

  <h3>Renewable Investments</h3>

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
  .sankey-container {
    width: 100%;
    height: 800px;
  }
</style>
