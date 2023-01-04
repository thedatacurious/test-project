import * as aq from 'arquero'
import investCSV from './data/IRENA_RE_Public_Investment_July2022.csv?raw'
import clm from 'country-locale-map'
import { sum } from 'd3'

export let sankeyData
export let ChinaAfricaInfo
export let data

data = {
  nodes: [
    { id: 'A1' },
    { id: 'A2' },
    { id: 'A3' },
    { id: 'B1' },
    { id: 'B2' },
    { id: 'B3' },
    { id: 'B4' },
  ],
  links: [
    { source: 'A1', target: 'B1', value: 27 },
    { source: 'A1', target: 'B2', value: 9 },
    { source: 'A2', target: 'B2', value: 5 },
    { source: 'A2', target: 'B3', value: 11 },
    { source: 'A3', target: 'B2', value: 12 },
    { source: 'A3', target: 'B4', value: 7 },
  ],
}

//  Load investment flow data
const investRaw = aq.fromCSV(investCSV)

// Create mapping for consistent naming
const institutions = [
  'Adaptation Fund',
  'African Development Bank',
  'African Development Fund',
  'Arab Bank for Economic Development in Africa',
  'Arab Fund (AFESD)',
  'Asian Development Bank',
  'Asian Infrastructure Investment Bank',
  'Black Sea Trade & Development Bank',
  'Caribbean Development Bank',
  'Central American Bank for Economic Integration',
  'Climate Investment Funds',
  'Development Bank of Latin America',
  'EU Institutions',
  'European Bank for Reconstruction and Development',
  'Food and Agriculture Organisation',
  'Global Environment Facility',
  'Global Green Growth Institute',
  'Green Climate Fund',
  'IDB Invest',
  'IFAD',
  'Inter-American Development Bank',
  'International Bank for Reconstruction and Development',
  'International Development Association',
  'International Finance Corporation',
  'Islamic Development Bank',
  'Nordic Development Fund',
  'OPEC Fund for International Development',
  'UNDP',
  'UNECE',
]

const targetDirectMapping = {
  XMX: 'Multilateral',
  XME: 'South West Asia',
  XDX: 'Multilateral',
  XAF: 'Sub-Saharan Africa',
  XOC: 'Pacific',
  XCC: 'Central America and the Caribbean',
  XSA: 'South Asia',
  XAS: 'North and Southeast Asia',
  XER: 'Europe',
  EUE: 'Europe',
  XKX: 'Europe',
}

const regionalRollup = {
  'Southern Africa': 'Sub-Saharan Africa',
  'Eastern Africa': 'Sub-Saharan Africa',
  'Western Africa': 'Sub-Saharan Africa',
  'Central Africa': 'Sub-Saharan Africa',
  'East Asia': 'North and Southeast Asia',
  'South East Asia': 'North and Southeast Asia',
  'West Indies': 'Central America and the Caribbean',
  'Central America': 'Central America and the Caribbean',
  'South East Europe': 'Europe',
  'Eastern Europe': 'Europe',
  'Central Europe': 'Europe',
  'Western Europe': 'Europe',
  'Northern Europe': 'Europe',
  'Southern Europe': 'Europe',
  'South West Europe': 'Europe',
}

// Helper function for naming
const getTargetRegion = function (d) {
  if (targetDirectMapping[d.targetISO]) {
    return targetDirectMapping[d.targetISO]
  } else {
    const region = clm.getCountryByAlpha3(d.targetISO).region
    return regionalRollup[region] ?? region
  }
}

// Data cleaning for Sankey
const investData = investRaw
  .rename({
    'Amount (2020 USD million)': 'value',
    'Country/Area': 'target',
    'ISO-code': 'targetISO',
    'Finance Group': 'financeGrp',
    Year: 'year',
  })
  .filter((d) => d.value > 0 && d.Category === 'Renewables')
  .derive({
    targetRegion: aq.escape((d) => getTargetRegion(d)),
    source: aq.escape((d) =>
      institutions.includes(d.Donor) ? 'International Institutions' : d.Donor,
    ),
  })
  .select('source', 'target', 'targetRegion', 'year', 'value', 'financeGrp')

// Helper function to get required data format for Sankey
const prepSankeyData = (d = investData) => {
  const grouped = d.groupby('year').objects({ grouped: true })

  let results = {}

  for (let year = 2000; year < 2021; year++) {
    const links = grouped.get(year).map((d) => ({
      source: d.source,
      target: d.targetRegion,
      value: d.value,
      financeGrp: d.financeGrp,
    }))
    const setNodes = new Set([
      ...links.map((d) => d.target),
      ...links.map((d) => d.source),
    ])

    const nodes = Array.from(setNodes).map((d) => ({ id: d }))
    results[year] = { nodes, links }
  }

  return results
}

/** @type {Object} */
sankeyData = prepSankeyData()

ChinaAfricaInfo = aq
  .from(investData)
  .filter(
    (d) =>
      d.source === 'China' &&
      (d.targetRegion === 'Sub-Saharan Africa' ||
        d.targetRegion === 'Northern Africa'),
  )
  .derive({ value: (d) => aq.op.round(d.value * 10) / 10 })
  .pivot('year', 'value')
  .objects()[0]

console.log(ChinaAfricaInfo)
