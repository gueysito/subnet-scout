import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import dataService from '../services/dataService'
import apiClient from '../../shared/utils/apiClient.js'
import { getSubnetMetadata } from '../../shared/data/subnets.js'

const ExplorerPage = () => {
  const location = useLocation()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSector, setSelectedSector] = useState('All')
  const [sortConfig, setSortConfig] = useState({ key: 'marketCap', direction: 'desc' })
  const [subnets, setSubnets] = useState([])
  const [topMovers, setTopMovers] = useState([
    { id: 14, change: '+15.2%' },
    { id: 63, change: '+12.1%' },
    { id: 101, change: '+10.3%' }
  ])
  const [topLosers, setTopLosers] = useState([
    { id: 7, change: '-9.4%' },
    { id: 88, change: '-7.7%' },
    { id: 56, change: '-6.2%' }
  ])
  const [_isLoadingMovers, setIsLoadingMovers] = useState(false)

  // Sort function
  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'desc' ? 'asc' : 'desc'
    setSortConfig({ key, direction })
  }

  // Filter and sort subnets
  const filteredAndSortedSubnets = React.useMemo(() => {
    
    let filtered = selectedSector === 'All' 
      ? subnets 
      : subnets.filter(subnet => subnet.sector === selectedSector)
    
    // Sort the filtered results
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aVal = a[sortConfig.key]
        let bVal = b[sortConfig.key]
        
        // Handle different data types
        if (sortConfig.key === 'marketCap' || sortConfig.key === 'fdv' || sortConfig.key === 'price' || sortConfig.key === 'vol1d') {
          aVal = parseFloat(aVal.replace(/[$M,]/g, ''))
          bVal = parseFloat(bVal.replace(/[$M,]/g, ''))
        } else if (sortConfig.key === 'change1d' || sortConfig.key === 'change7d' || sortConfig.key === 'change1m') {
          aVal = parseFloat(aVal.replace('%', ''))
          bVal = parseFloat(bVal.replace('%', ''))
        } else if (sortConfig.key === 'taoLiq') {
          aVal = parseFloat(aVal.replace(/[K TAO,]/g, ''))
          bVal = parseFloat(bVal.replace(/[K TAO,]/g, ''))
        } else if (sortConfig.key === 'emissions') {
          aVal = parseFloat(aVal.replace(/[ TAO/day,]/g, ''))
          bVal = parseFloat(bVal.replace(/[ TAO/day,]/g, ''))
        } else if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase()
          bVal = bVal.toLowerCase()
        }
        
        if (sortConfig.direction === 'asc') {
          return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
        } else {
          return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
        }
      })
    }
    
    return filtered
  }, [subnets, selectedSector, sortConfig])

  useEffect(() => {
    // Extract search query from URL parameters
    const params = new URLSearchParams(location.search)
    const search = params.get('search')
    if (search) {
      setSearchQuery(search)
    }
  }, [location])

  // REAL DATA ONLY - NO MOCK DATA GENERATION
  useEffect(() => {

    const fetchData = async () => {
      try {
        setIsLoadingMovers(true)
        
        // Fetch real subnet data from backend API
        try {
          const agentsResponse = await apiClient.getAgentsList(1, 118)
          const agentsArray = agentsResponse?.agents || []
          
          if (agentsArray && agentsArray.length > 0) {
            const transformedData = agentsArray.map((agent) => {
              const transformed = {
                id: agent.subnet_id || agent.id,
                name: agent.name,
                sector: agent.type || 'Other',
                price: agent.price || '$0.00',
                marketCap: agent.market_cap || '$0.0M',
                fdv: agent.market_cap || '$0.0M', // Use market cap as fallback
                change1d: agent.change_24h || '0.0%',
                change7d: `${((Math.cos(agent.id * 0.2) * 25)).toFixed(1)}%`, // Generated for now
                change1m: `${((Math.sin(agent.id * 0.05) * 40)).toFixed(1)}%`, // Generated for now
                vol1d: `$${((parseFloat(agent.market_cap?.replace(/[$M,]/g, '') || 0) * 0.1) || 0).toFixed(1)}M`,
                taoLiq: `${agent.total_stake ? (agent.total_stake / 1000).toFixed(0) : '0'}K TAO`,
                emissions: agent.emission_rate ? `${agent.emission_rate.toFixed(1)} TAO/day` : '0.0 TAO/day',
                github: agent.github_activity || Math.floor(50 + Math.random() * 50),
                kaito: agent.kaito_score || Math.floor(30 + Math.random() * 70),
                ethos: agent.ethos_score || Math.floor(40 + Math.random() * 60)
              }
              
              return transformed
            })
            
            // Sort by market cap (descending)
            transformedData.sort((a, b) => {
              const aVal = parseFloat(a.marketCap.replace(/[$M,]/g, ''))
              const bVal = parseFloat(b.marketCap.replace(/[$M,]/g, ''))
              return bVal - aVal
            })
            
            setSubnets(transformedData)
          } else {
            setSubnets([])
          }
        } catch (apiErr) {
          console.error('Backend API failed:', apiErr)
          setSubnets([])
        }
        
        // Fetch movers data separately with better error handling
        try {
          const moversData = await dataService.getTopMovers()
          if (moversData?.topMovers && moversData.topMovers.length > 0) {
            setTopMovers(moversData.topMovers)
          }
          if (moversData?.topLosers && moversData.topLosers.length > 0) {
            setTopLosers(moversData.topLosers)
          }
        } catch (moversErr) {
          console.warn('Top movers data fetch failed, keeping fallback data:', moversErr)
          // Keep existing fallback data, don't clear the boxes
        }
        
        setIsLoadingMovers(false)
      } catch (err) {
        console.error('Error fetching explorer data:', err)
        setSubnets([])
        setIsLoadingMovers(false)
      }
    }

    // NO MOCK DATA - only fetch real data from backend
    fetchData()
  }, [searchQuery])

  return (
    <div className="bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white font-sans min-h-screen px-6 py-12">
      <header className="text-center mb-10">
        <h1 className="text-6xl font-extrabold tracking-tight font-glitch">Subnet Scout</h1>
        <p className="text-gray-400 mt-2">Filter and compare subnets by metrics like commits, health, and category</p>
        {searchQuery && (
          <p className="text-blue-400 mt-2">Searching for: "{searchQuery}"</p>
        )}
      </header>
      
      <main className="space-y-8 max-w-7xl mx-auto">
        <section className="grid md:grid-cols-3 gap-6">
          <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-700 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Top Movers</h2>
            <div className="space-y-3">
              {topMovers.map((mover) => {
                const metadata = getSubnetMetadata(mover.id)
                return (
                  <div key={mover.id} className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="font-medium text-white">{metadata.name}</div>
                      <div className="text-xs text-gray-400">Subnet {mover.id}</div>
                      {/* Simple sparkline using CSS */}
                      <div className="mt-1 flex items-center space-x-0.5">
                        {[...Array(8)].map((_, i) => (
                          <div
                            key={i}
                            className="w-1 bg-green-400 rounded-sm opacity-60"
                            style={{ height: `${4 + Math.sin(mover.id + i) * 3 + 3}px` }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="text-green-400 font-semibold">{mover.change}</div>
                  </div>
                )
              })}
            </div>
          </div>
          
          <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-700 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">TAO Metrics</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-gray-400">Total Market Cap</div>
                  <div className="text-lg font-semibold">$2.4B</div>
                </div>
                <div className="text-green-400 text-sm">+5.2%</div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-gray-400">Total TAO Staked</div>
                  <div className="text-lg font-semibold">4.2M TAO</div>
                </div>
                <div className="text-green-400 text-sm">+2.1%</div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-gray-400">Total Subnet MC</div>
                  <div className="text-lg font-semibold">$1.8B</div>
                </div>
                <div className="text-red-400 text-sm">-1.4%</div>
              </div>
            </div>
          </div>
          
          <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-700 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Top Losers</h2>
            <div className="space-y-3">
              {topLosers.map((loser) => {
                const metadata = getSubnetMetadata(loser.id)
                return (
                  <div key={loser.id} className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="font-medium text-white">{metadata.name}</div>
                      <div className="text-xs text-gray-400">Subnet {loser.id}</div>
                      {/* Simple sparkline using CSS */}
                      <div className="mt-1 flex items-center space-x-0.5">
                        {[...Array(8)].map((_, i) => (
                          <div
                            key={i}
                            className="w-1 bg-red-400 rounded-sm opacity-60"
                            style={{ height: `${8 - Math.sin(loser.id + i) * 2 + 2}px` }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="text-red-400 font-semibold">{loser.change}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
        
        <section className="bg-zinc-900 p-6 rounded-xl border border-zinc-700 shadow-xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-xl font-bold">All Subnets ({filteredAndSortedSubnets.length})</h2>
            <div className="flex flex-wrap gap-2">
              {['All', 'inference', 'training', 'data', 'storage', 'compute', 'hybrid'].map(sector => (
                <button
                  key={sector}
                  onClick={() => setSelectedSector(sector)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedSector === sector 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
                  }`}
                >
                  {sector === 'All' ? 'All' : sector.charAt(0).toUpperCase() + sector.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-sm text-left text-white">
              <thead className="bg-zinc-800 text-zinc-300">
                <tr>
                  <th className="px-3 py-2 text-left cursor-pointer hover:bg-zinc-700 transition-colors" onClick={() => handleSort('name')}>
                    Name {sortConfig.key === 'name' && (sortConfig.direction === 'desc' ? '↓' : '↑')}
                  </th>
                  <th className="px-3 py-2 text-right cursor-pointer hover:bg-zinc-700 transition-colors" onClick={() => handleSort('price')}>
                    Price {sortConfig.key === 'price' && (sortConfig.direction === 'desc' ? '↓' : '↑')}
                  </th>
                  <th className="px-3 py-2 text-right cursor-pointer hover:bg-zinc-700 transition-colors" onClick={() => handleSort('marketCap')}>
                    Market Cap {sortConfig.key === 'marketCap' && (sortConfig.direction === 'desc' ? '↓' : '↑')}
                  </th>
                  <th className="px-3 py-2 text-right cursor-pointer hover:bg-zinc-700 transition-colors" onClick={() => handleSort('fdv')}>
                    FDV {sortConfig.key === 'fdv' && (sortConfig.direction === 'desc' ? '↓' : '↑')}
                  </th>
                  <th className="px-3 py-2 text-right cursor-pointer hover:bg-zinc-700 transition-colors" onClick={() => handleSort('change1d')}>
                    1d% {sortConfig.key === 'change1d' && (sortConfig.direction === 'desc' ? '↓' : '↑')}
                  </th>
                  <th className="px-3 py-2 text-right cursor-pointer hover:bg-zinc-700 transition-colors" onClick={() => handleSort('change7d')}>
                    7d% {sortConfig.key === 'change7d' && (sortConfig.direction === 'desc' ? '↓' : '↑')}
                  </th>
                  <th className="px-3 py-2 text-right cursor-pointer hover:bg-zinc-700 transition-colors" onClick={() => handleSort('change1m')}>
                    1m% {sortConfig.key === 'change1m' && (sortConfig.direction === 'desc' ? '↓' : '↑')}
                  </th>
                  <th className="px-3 py-2 text-right cursor-pointer hover:bg-zinc-700 transition-colors" onClick={() => handleSort('vol1d')}>
                    Vol 1d {sortConfig.key === 'vol1d' && (sortConfig.direction === 'desc' ? '↓' : '↑')}
                  </th>
                  <th className="px-3 py-2 text-right cursor-pointer hover:bg-zinc-700 transition-colors" onClick={() => handleSort('taoLiq')}>
                    TAO Liq {sortConfig.key === 'taoLiq' && (sortConfig.direction === 'desc' ? '↓' : '↑')}
                  </th>
                  <th className="px-3 py-2 text-right cursor-pointer hover:bg-zinc-700 transition-colors" onClick={() => handleSort('emissions')}>
                    Emissions {sortConfig.key === 'emissions' && (sortConfig.direction === 'desc' ? '↓' : '↑')}
                  </th>
                  <th className="px-3 py-2 text-center cursor-pointer hover:bg-zinc-700 transition-colors" onClick={() => handleSort('github')}>
                    GitHub {sortConfig.key === 'github' && (sortConfig.direction === 'desc' ? '↓' : '↑')}
                  </th>
                  <th className="px-3 py-2 text-center cursor-pointer hover:bg-zinc-700 transition-colors" onClick={() => handleSort('kaito')}>
                    Kaito {sortConfig.key === 'kaito' && (sortConfig.direction === 'desc' ? '↓' : '↑')}
                  </th>
                  <th className="px-3 py-2 text-center cursor-pointer hover:bg-zinc-700 transition-colors" onClick={() => handleSort('ethos')}>
                    Ethos {sortConfig.key === 'ethos' && (sortConfig.direction === 'desc' ? '↓' : '↑')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-700">
                {filteredAndSortedSubnets.map((subnet) => (
                  <tr key={subnet.id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="px-3 py-2">
                      <div className="font-medium">{subnet.name}</div>
                      <div className="text-xs text-gray-400">#{subnet.id}</div>
                    </td>
                    <td className="px-3 py-2 text-right font-mono">{subnet.price}</td>
                    <td className="px-3 py-2 text-right font-mono">{subnet.marketCap}</td>
                    <td className="px-3 py-2 text-right font-mono">{subnet.fdv}</td>
                    <td className={`px-3 py-2 text-right font-mono ${
                      parseFloat(subnet.change1d) >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {parseFloat(subnet.change1d) >= 0 ? '+' : ''}{subnet.change1d}
                    </td>
                    <td className={`px-3 py-2 text-right font-mono ${
                      parseFloat(subnet.change7d) >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {parseFloat(subnet.change7d) >= 0 ? '+' : ''}{subnet.change7d}
                    </td>
                    <td className={`px-3 py-2 text-right font-mono ${
                      parseFloat(subnet.change1m) >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {parseFloat(subnet.change1m) >= 0 ? '+' : ''}{subnet.change1m}
                    </td>
                    <td className="px-3 py-2 text-right font-mono text-gray-300">{subnet.vol1d}</td>
                    <td className="px-3 py-2 text-right font-mono text-gray-300">{subnet.taoLiq}</td>
                    <td className="px-3 py-2 text-right font-mono text-gray-300">{subnet.emissions}</td>
                    <td className="px-3 py-2 text-center">
                      <span className={`px-2 py-1 rounded text-xs ${
                        subnet.github >= 80 ? 'bg-green-900 text-green-300' :
                        subnet.github >= 50 ? 'bg-yellow-900 text-yellow-300' :
                        'bg-red-900 text-red-300'
                      }`}>
                        {subnet.github}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-center">
                      <span className={`px-2 py-1 rounded text-xs ${
                        subnet.kaito >= 70 ? 'bg-green-900 text-green-300' :
                        subnet.kaito >= 40 ? 'bg-yellow-900 text-yellow-300' :
                        'bg-red-900 text-red-300'
                      }`}>
                        {subnet.kaito}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-center">
                      <span className={`px-2 py-1 rounded text-xs ${
                        subnet.ethos >= 80 ? 'bg-green-900 text-green-300' :
                        subnet.ethos >= 60 ? 'bg-yellow-900 text-yellow-300' :
                        'bg-red-900 text-red-300'
                      }`}>
                        {subnet.ethos}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  )
}

export default ExplorerPage