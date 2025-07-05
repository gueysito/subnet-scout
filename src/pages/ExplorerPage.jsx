import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import dataService from '../services/dataService'

const ExplorerPage = () => {
  const location = useLocation()
  const [searchQuery, setSearchQuery] = useState('')
  const [subnets, setSubnets] = useState([
    { id: 1, name: 'Subnet 1', category: 'Training', marketCap: '$2.3M', health: '89%', commits: 150 },
    { id: 2, name: 'Subnet 2', category: 'Inference', marketCap: '$1.8M', health: '93%', commits: 172 },
    { id: 3, name: 'Subnet 3', category: 'Other', marketCap: '$950K', health: '76%', commits: 48 }
  ])
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

  useEffect(() => {
    // Extract search query from URL parameters
    const params = new URLSearchParams(location.search)
    const search = params.get('search')
    if (search) {
      setSearchQuery(search)
    }
  }, [location])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data in parallel
        const [subnetListData, moversData] = await Promise.all([
          searchQuery 
            ? dataService.searchSubnets(searchQuery)
            : dataService.getSubnetList(1, 20),
          dataService.getTopMovers()
        ])

        if (subnetListData?.subnets) {
          setSubnets(subnetListData.subnets)
        }
        if (moversData?.topMovers) {
          setTopMovers(moversData.topMovers)
        }
        if (moversData?.topLosers) {
          setTopLosers(moversData.topLosers)
        }
      } catch (err) {
        console.error('Error fetching explorer data:', err)
        // Keep fallback data if API fails
      }
    }

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
        <section className="grid md:grid-cols-2 gap-6">
          <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-700 shadow-lg">
            <h2 className="text-xl font-semibold mb-2">Top Movers</h2>
            <ul className="text-green-400 text-sm space-y-1">
              {topMovers.map((mover) => (
                <li key={mover.id}>Subnet {mover.id} {mover.change}</li>
              ))}
            </ul>
          </div>
          <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-700 shadow-lg">
            <h2 className="text-xl font-semibold mb-2">Top Losers</h2>
            <ul className="text-red-400 text-sm space-y-1">
              {topLosers.map((loser) => (
                <li key={loser.id}>Subnet {loser.id} {loser.change}</li>
              ))}
            </ul>
          </div>
        </section>
        
        <section className="bg-zinc-900 p-6 rounded-xl border border-zinc-700 shadow-xl">
          <h2 className="text-xl font-bold mb-4">Subnet Table</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-sm text-left text-white">
              <thead className="bg-zinc-800 text-zinc-300">
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Category</th>
                  <th className="px-4 py-2">Market Cap</th>
                  <th className="px-4 py-2">Health</th>
                  <th className="px-4 py-2">Commits</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-700">
                {subnets.map((subnet) => (
                  <tr key={subnet.id}>
                    <td className="px-4 py-2">{subnet.name}</td>
                    <td className="px-4 py-2">{subnet.category}</td>
                    <td className="px-4 py-2">{subnet.marketCap}</td>
                    <td className="px-4 py-2">{subnet.health}</td>
                    <td className="px-4 py-2">{subnet.commits}</td>
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