<script>
  import { LayerCake, Svg } from "layercake";
  import { tweened } from "svelte/motion";
  import * as eases from "svelte/easing";

  import Line from "./Line.svelte";
  import Area from "./Area.svelte";

  export let chart;
  export let data;
  export let fullExtents;

  export let extentGetters;

  const tweenOptions = {
    duration: 300,
    easing: eases.cubicInOut,
  };

  const xDomain = tweened(fullExtents.x, tweenOptions);
  const yDomain = tweened(undefined, tweenOptions);

  $: yDomain.set(chart === "Investment" ? fullExtents.y1 : fullExtents.y2);

  const region = data.map((d) => d.targetRegion)[0];
</script>

<LayerCake
  percentRange={true}
  padding={{ top: 10, right: 16, bottom: 2, left: 16 }}
  x={extentGetters.x}
  y={chart === "Investment" ? extentGetters.y1 : extentGetters.y2}
  {data}
  xDomain={$xDomain}
  yDomain={$yDomain}
  custom={chart}
>
  <Svg>
    <text dy="12em">{region}</text>
    <Area
      fill={region === "Sub-Saharan Africa" || region === "Northern Africa"
        ? "#9c65ff80"
        : "#ab00d610"}
    />
    <Line stroke={"#808080"} />
  </Svg>
</LayerCake>

<style>
  text {
    font-size: 10px;
  }
</style>
