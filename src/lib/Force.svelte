<script>
  import * as d3 from "d3";
  
  export let width;
  export let height;
  export let param_force;
  export let params_labels;
  export let continentsArray;
  export let year;
  export let my_data;

  //reference to g containing 'circles'
  let all_nodes;
  //reference to each 'circle'...
  let nodes;

  let margin= {left: 40, right: 20, top: 20, bottom: 10};
  const maxRadius = 20;

  function highlight(param_code)
      {
                                 // console.warn(param_code,param_force)
                                 if (param_code==param_force)
                                  {
                                    
                                    return "class='highlighted'";
                                  }
                                  else
                                  {
                                    return false
                                  }                                  
                                  
        }
    
    $ : xScale = d3.scaleLinear()                
      .domain([d3.min(my_data, d => d[param_force]), d3.max(my_data, d => d[param_force])])
     .range([(margin.left+maxRadius), (width - margin.left)]);

  
    $ : xScaleAxis = d3.scaleLinear()                
      .domain([0, d3.max(my_data, d => d[param_force])])
     .range([margin.left, (width - margin.left)])           
  
    $ : radiusScale = d3.scaleSqrt()
        .domain([d3.min(my_data, d => d.gdp),d3.max(my_data, d => d.gdp)])
        .range([3, maxRadius]);           

    //no need of reactivity     
    let colorScale = d3.scaleOrdinal()
                  .domain(continentsArray)
                  .range(d3.schemeCategory10);
    
    let tooltip = d3.select('body')
        .append('div')
        .attr('class', 'force-tooltip tooltip')        
        .style('position', 'absolute')
        .style('z-index', '1')
        .style('visibility', 'hidden')
        .style('padding', '10px')
        .style('background', 'rgba(0,0,0,0.6)')
        .style('border-radius', '4px')
        .style('color', '#fff');

    let selected_datapoint;
    function mouseover_fx(e,d) 
    {                
            const tooltipWidth = tooltip.node().offsetWidth;
            const tooltipHeight = tooltip.node().offsetHeight;
            
            tooltip
                .style("left", e.pageX - tooltipWidth/2 +'px')
                .style("top", e.pageY-tooltipHeight - 10+'px')
                .style('visibility', 'visible')            
                .html(`<span><b>Country</b>: ${d.country} <span/>
                <span><b>Year</b>: ${d.year} <span/>`+
                    Object.entries(params_labels).map((o,i)=>
                                {
                                    let param_code=o[0];
                                    let param_label=o[1];       
                                    if (param_code=='renewablesConsPerCap')
                                    return `<span ${highlight(param_code)}><b>`+param_label+`</b>: ${d[param_code].toLocaleString('en-US', {maximumFractionDigits:2})}</span>`
                                    else
                                    return `<span ${highlight(param_code)}><b>`+param_label+`</b>: ${d[param_code]}</span>`
                                }).join('')
                                    +`
                                    <span><b>GDP per cap</b>: ${d.gdp.toLocaleString('en-US', {maximumFractionDigits: 2})}<span/>                              
                                    `)                   
    }      
    
    let displayData = [];  
    function update() {
      //only 'updating' my_data simulation tick fires..
      displayData = my_data
      return my_data
    }

    $:simulation = d3.forceSimulation(my_data)
        .force('x', d3.forceX().x(d => xScale(d[param_force])))
        .force('y', d3.forceY().y(height/2))
        .force('collision', d3.forceCollide().radius( d =>radiusScale(d.gdp) +1));
    
  
    
    
    $: simulation.on("tick", update)
  
    let innerH=height - margin.top - margin.bottom;
    let  format_k =function(d)
    {
      if (!param_force.includes('Perc'))
      {
      if (d/1000>1)
      return d/1000 + " K"
      else 
      return d
      }
      else
     {
        if (param_force.includes('Twh'))
        return d+' Twh'
        else
        return d
      }
    }
  </script>
 
  
  
  <g class="xAxis" transform="translate(0,0)">
   
        {#each xScaleAxis.ticks() as d,i}
  
            <text
                text-anchor={'middle'}
                font-size={'.7rem'}
                dy=".71em"
                y={innerH}
                transform={`translate(${xScaleAxis(d)},0)`}
              >
              {format_k(d)}
              
              </text>
  
   {/each}
   </g>
  
  <g class='circles' bind:this={all_nodes}>
  
  {#each displayData as d,i}
  <circle bind:this={nodes}
      r={radiusScale(d.gdp) }
      fill={colorScale(d.continent)}
      fill-opacity={0.4}
      data={JSON.stringify(d)}
      cx={d.x}
      cy={d.y}
      on:mouseover={(e) => {selected_datapoint = d; mouseover_fx(e,d)}}
      on:mousemove={(e)=>{ 
        const tooltipWidth = tooltip.node().offsetWidth;
        const tooltipHeight = tooltip.node().offsetHeight;
      tooltip
         .style("left", e.pageX - tooltipWidth/2 +'px')
        .style("top", e.pageY-tooltipHeight - 10+'px')
      }}
      on:mouseout={(e)=>{ 
        tooltip.style('visibility', 'hidden')
      }
    }
      
      
  />
  
  {/each}
  </g>
