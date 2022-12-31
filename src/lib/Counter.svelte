
<script>
import {scaleLinear, scaleBand} from 'd3-scale';

  let count = 0
  const increment = () => {
    count += 1
  }
</script>
<button on:click={increment}>
  count new is {count}
</button>
