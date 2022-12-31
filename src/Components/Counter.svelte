
<script>
import {scaleLinear, scaleBand} from 'd3-scale';

import energyDataCsv from './../data/energyData.csv';

	import {max} from 'd3-array'
  let count = 0
  const increment = () => {
    count += 1
  }
</script>
<button on:click={increment}>
  count new is {count}
</button>
