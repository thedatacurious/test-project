import fs from 'fs'
import * as aq from 'arquero'
import clm from 'country-locale-map'
const { op } = aq

//  Load energy data
const csvData = './data/energyData.csv?raw'

const energyRaw = aq.fromCSV(csvData)

// Filter energy data to keep relevant columns
const energyClean = energyRaw.select({
    country: 'country',
    year: 'year',
    iso_code: 'iso_code',
    gdp: 'gdp',
    population: 'population',
    renewables_share_energy: 'renewablesShareCon',
    renewables_share_elec: 'renewablesShareGen',
  })
  .derive({ gdpPerCap : d => d.gdp/d.population})
  .filter(
    (d) =>
      op.abs(d.gdp) >= 0 &&
      op.abs(d.renewablesShareCon) >= 0 &&
      op.abs(d.year) === 2018,
  )

  energyClean.print()
  console.log(energyClean)

// Export energyClean.csv that is optimized and smaller 
const outputData = energyClean.toCSV() //doesnt work now
fs.writeFileSync('energyClean.csv', outputData, 'utf8')

//Need to update with region mapping
const energyCleanwithMapping = energyClean.map((d) => {
    // const nameToMatch = NAME_OVERRIDES[d.Country] ?? d.Country
    const nameToMatch = d.country
    const alpha3 = clm.getAlpha3ByName(nameToMatch, true)
    const country = clm.getCountryByAlpha3(alpha3)
  
    return {
      name: country.name,
      alpha3,
      continent: country.continent,
      year: d.year,
      iso_code: d.iso_code,
      gdp: d.gdp,
      population: d.population,
      renewablesConsPerCap: d.renewablesConsPerCap,
      renewablesGenPerCap: d.renewablesGenPerCap,
      gdpPerCap: d.gdpPerCap
    }
  })

fs.writeFileSync("output.json", JSON.stringify(energyCleanwithMapping, null, 2))