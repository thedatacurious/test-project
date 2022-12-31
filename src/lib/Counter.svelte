
/*
import {scaleLinear, scaleBand} from 'd3-scale';
import {max} from 'd3-array'
*/

<script>
  let count = 0
  const increment = () => {
    count += 1
  }
</script>
<button on:click={increment}>
  count new is {count}
</button>
