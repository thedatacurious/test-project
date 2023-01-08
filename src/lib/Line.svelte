<!--
  @component
  Generates an SVG area shape using the `area` function from [d3-shape](https://github.com/d3/d3-shape).
 -->
<script>
  import { getContext } from "svelte";

  const { custom, data, x, y, xGet, yGet } = getContext("LayerCake");

  /** @type {String} [stroke='#ab00d6'] - The shape's fill color. This is technically optional because it comes with a default value but you'll likely want to replace it with your own color. */
  export let stroke = "#ab00d6";

  $: path =
    "M" +
    $data
      .map((d) => {
        return $xGet(d) + "," + $yGet(d);
      })
      .join("L");

  $: endpoints = [$data[0], $data[$data.length - 1]];
</script>

<path class="path-line" d={path} {stroke} />
<g>
  {#if $custom === "Investment"}
    {#each endpoints as d, i}
      <text
        x={$xGet(d)}
        y={$yGet(d)}
        dy="-0.5em"
        dx={i === 1 ? "-0.2em" : "0.8em"}
        text-anchor={i === 1 ? "start" : "end"}>US${$y(d)}m</text
      >
    {/each}
  {:else}
    {#each endpoints as d, i}
      <text
        x={$xGet(d)}
        y={$yGet(d)}
        dx={i === 1 ? "-0.2em" : "0.8em"}
        dy="-0.5em"
        text-anchor={i === 1 ? "start" : "end"}>{$y(d)}%</text
      >
    {/each}
  {/if}
</g>

<style>
  .path-line {
    fill: none;
    stroke-linejoin: round;
    stroke-linecap: round;
    stroke-width: 2;
  }

  text {
    font-size: 10px;
    /* text-shadow: 1px 1px 2px pink; */
  }
</style>
