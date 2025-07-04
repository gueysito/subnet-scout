import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as d3 from 'd3';
import { Play, Pause, RotateCcw, Filter, Download, TrendingUp, Activity, DollarSign, Users, AlertCircle, Info } from 'lucide-react';
import { containerStyles, cardStyles, textStyles, buttonStyles } from '../utils/styleUtils';

const SubnetHeatmap = () => {
  const svgRef = useRef(null);
  const [data, setData] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('activity');
  const [hoveredSubnet, setHoveredSubnet] = useState(null);
  const [timeStep, setTimeStep] = useState(0);
  const [animationSpeed, setAnimationSpeed] = useState(1000);
  const [filterConfig, setFilterConfig] = useState({
    minActivity: 0,
    maxActivity: 100,
    minPrice: 0,
    maxPrice: 1000,
    showOnlyActive: false
  });

  // Metric configurations
  const metrics = {
    activity: {
      name: 'Activity Score',
      icon: Activity,
      color: d3.scaleSequential(d3.interpolateViridis).domain([0, 100]),
      format: (d) => `${d}%`
    },
    price: {
      name: 'Price (TAO)',
      icon: DollarSign,
      color: d3.scaleSequential(d3.interpolateRdYlGn).domain([0, 1000]),
      format: (d) => `$${d.toFixed(2)}`
    },
    holders: {
      name: 'Holders',
      icon: Users,
      color: d3.scaleSequential(d3.interpolateBlues).domain([0, 10000]),
      format: (d) => d.toLocaleString()
    },
    risk: {
      name: 'Risk Score',
      icon: AlertCircle,
      color: d3.scaleSequential(d3.interpolateRdYlBu).domain([0, 10]),
      format: (d) => `${d}/10`
    },
    performance: {
      name: 'Performance',
      icon: TrendingUp,
      color: d3.scaleSequential(d3.interpolatePlasma).domain([0, 100]),
      format: (d) => `${d}%`
    }
  };

  // Generate mock data for 118 subnets
  useEffect(() => {
    const generateSubnetData = () => {
      const subnets = [];
      const subnetNames = [
        'Text Prompting', 'Cortext', 'FileTAO', 'Pretraining', 'Bittensor', 
        'TensorFlow', 'PyTorch', 'Keras', 'Scikit', 'Pandas',
        'NumPy', 'Matplotlib', 'Seaborn', 'Plotly', 'Bokeh',
        'Jupyter', 'Colab', 'Kaggle', 'GitHub', 'GitLab'
      ];
      
      for (let i = 0; i < 118; i++) {
        const baseActivity = Math.random() * 100;
        const basePrice = Math.random() * 500 + 10;
        const baseHolders = Math.random() * 8000 + 200;
        const baseRisk = Math.random() * 8 + 1;
        const basePerformance = Math.random() * 100;
        
        // Generate time series data (24 hours)
        const timeSeries = [];
        for (let t = 0; t < 24; t++) {
          const variance = 0.2; // 20% variance
          timeSeries.push({
            hour: t,
            activity: Math.max(0, Math.min(100, baseActivity + (Math.random() - 0.5) * variance * 100)),
            price: Math.max(0, basePrice + (Math.random() - 0.5) * variance * 100),
            holders: Math.max(0, Math.floor(baseHolders + (Math.random() - 0.5) * variance * 2000)),
            risk: Math.max(0, Math.min(10, baseRisk + (Math.random() - 0.5) * variance * 4)),
            performance: Math.max(0, Math.min(100, basePerformance + (Math.random() - 0.5) * variance * 50))
          });
        }
        
        subnets.push({
          id: i + 1,
          name: i < subnetNames.length ? subnetNames[i] : `Subnet ${i + 1}`,
          description: `Advanced AI subnet focusing on ${i < subnetNames.length ? subnetNames[i] : 'specialized tasks'}`,
          timeSeries,
          currentData: timeSeries[0] // Start with first hour
        });
      }
      return subnets;
    };

    setData(generateSubnetData());
  }, []);

  // Animation loop
  useEffect(() => {
    let interval;
    if (isPlaying && data.length > 0) {
      interval = setInterval(() => {
        setTimeStep(prev => {
          const next = (prev + 1) % 24;
          // Update current data for all subnets
          setData(prevData => prevData.map(subnet => ({
            ...subnet,
            currentData: subnet.timeSeries[next]
          })));
          return next;
        });
      }, animationSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, animationSpeed, data.length]);

  // D3 Heatmap rendering
  useEffect(() => {
    if (!data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const container = svg.node().getBoundingClientRect();
    const width = container.width || 800;
    const height = container.height || 600;
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };

    // Calculate grid dimensions
    const cols = Math.ceil(Math.sqrt(118 * (width / height)));
    const rows = Math.ceil(118 / cols);
    const cellWidth = (width - margin.left - margin.right) / cols;
    const cellHeight = (height - margin.top - margin.bottom) / rows;

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Filter data based on current filters
    const filteredData = data.filter(subnet => {
      const current = subnet.currentData;
      return current.activity >= filterConfig.minActivity &&
             current.activity <= filterConfig.maxActivity &&
             current.price >= filterConfig.minPrice &&
             current.price <= filterConfig.maxPrice &&
             (!filterConfig.showOnlyActive || current.activity > 50);
    });

    // Create cells
    const cells = g.selectAll('.cell')
      .data(filteredData)
      .enter()
      .append('g')
      .attr('class', 'cell')
      .attr('transform', (d, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        return `translate(${col * cellWidth}, ${row * cellHeight})`;
      });

    // Add rectangles
    cells.append('rect')
      .attr('width', cellWidth - 2)
      .attr('height', cellHeight - 2)
      .attr('rx', 4)
      .attr('fill', d => {
        const value = d.currentData[selectedMetric];
        return metrics[selectedMetric].color(value);
      })
      .attr('stroke', '#ffffff20')
      .attr('stroke-width', 1)
      .style('cursor', 'pointer')
      .on('mouseover', (event, d) => {
        setHoveredSubnet(d);
        d3.select(event.currentTarget)
          .attr('stroke', '#ffffff80')
          .attr('stroke-width', 2);
      })
      .on('mouseout', (event) => {
        setHoveredSubnet(null);
        d3.select(event.currentTarget)
          .attr('stroke', '#ffffff20')
          .attr('stroke-width', 1);
      });

    // Add text labels for larger cells
    if (cellWidth > 50) {
      cells.append('text')
        .attr('x', cellWidth / 2)
        .attr('y', cellHeight / 2)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', 'white')
        .attr('font-size', Math.min(cellWidth / 8, 10))
        .attr('font-weight', 'bold')
        .text(d => d.id);
    }

    // Add size-based scaling for performance
    if (selectedMetric === 'performance') {
      cells.selectAll('rect')
        .transition()
        .duration(300)
        .attr('width', d => {
          const scale = d.currentData.performance / 100;
          return Math.max(10, (cellWidth - 2) * scale);
        })
        .attr('height', d => {
          const scale = d.currentData.performance / 100;
          return Math.max(10, (cellHeight - 2) * scale);
        });
    }

  }, [data, selectedMetric, filterConfig, timeStep]);

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setTimeStep(0);
    setData(prevData => prevData.map(subnet => ({
      ...subnet,
      currentData: subnet.timeSeries[0]
    })));
  };

  const exportData = () => {
    const csvContent = data.map(subnet => {
      const current = subnet.currentData;
      return [
        subnet.id,
        subnet.name,
        current.activity,
        current.price,
        current.holders,
        current.risk,
        current.performance
      ].join(',');
    });
    
    const csv = [
      'ID,Name,Activity,Price,Holders,Risk,Performance',
      ...csvContent
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subnet-heatmap-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className={containerStyles.section}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className={`text-4xl ${textStyles.heading} mb-4`}>
          Subnet Heatmap
        </h1>
        <p className={`text-xl ${textStyles.body} mb-6`}>
          Interactive visualization of all 118 Bittensor subnets with real-time performance metrics
        </p>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className={`${cardStyles.glass} p-6 mb-6`}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Playback Controls */}
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePlay}
              className={`flex items-center space-x-2 px-4 py-2 ${buttonStyles.primary} rounded-lg`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              className={`flex items-center space-x-2 px-4 py-2 ${buttonStyles.secondary} rounded-lg`}
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </motion.button>
          </div>

          {/* Metric Selector */}
          <div className="flex items-center space-x-2">
            <label className={`text-sm ${textStyles.caption}`}>Metric:</label>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className={`px-3 py-2 bg-white/10 border border-white/20 rounded-lg ${textStyles.body} focus:outline-none focus:border-accent-500`}
            >
              {Object.entries(metrics).map(([key, config]) => (
                <option key={key} value={key} className="bg-gray-800">
                  {config.name}
                </option>
              ))}
            </select>
          </div>

          {/* Speed Control */}
          <div className="flex items-center space-x-2">
            <label className={`text-sm ${textStyles.caption}`}>Speed:</label>
            <input
              type="range"
              min="100"
              max="2000"
              step="100"
              value={animationSpeed}
              onChange={(e) => setAnimationSpeed(2100 - parseInt(e.target.value))}
              className="w-20"
            />
            <span className={`text-sm ${textStyles.caption}`}>
              {(2100 - animationSpeed) / 100}x
            </span>
          </div>

          {/* Export Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={exportData}
            className={`flex items-center space-x-2 px-4 py-2 ${buttonStyles.secondary} rounded-lg`}
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </motion.button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Heatmap */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`${cardStyles.glass} p-6 lg:col-span-3`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-xl ${textStyles.heading}`}>
              {metrics[selectedMetric].name} Heatmap
            </h3>
            <div className="flex items-center space-x-2">
              <div className={`text-sm ${textStyles.caption}`}>
                Hour: {timeStep}/24
              </div>
              <div className="w-2 h-2 bg-accent-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          <div className="relative">
            <svg
              ref={svgRef}
              width="100%"
              height="500"
              className="border border-white/10 rounded-lg"
            />
            
            {/* Legend */}
            <div className="absolute bottom-2 left-2 bg-black/50 p-2 rounded">
              <div className="text-xs text-white mb-1">Scale</div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: metrics[selectedMetric].color(0) }}></div>
                <span className="text-xs text-white">Low</span>
                <div className="w-4 h-4 rounded" style={{ backgroundColor: metrics[selectedMetric].color(50) }}></div>
                <span className="text-xs text-white">Med</span>
                <div className="w-4 h-4 rounded" style={{ backgroundColor: metrics[selectedMetric].color(100) }}></div>
                <span className="text-xs text-white">High</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-6"
        >
          {/* Subnet Details */}
          <div className={`${cardStyles.glass} p-4`}>
            <h4 className={`text-lg ${textStyles.heading} mb-3`}>
              {hoveredSubnet ? 'Subnet Details' : 'Hover over a subnet'}
            </h4>
            
            {hoveredSubnet ? (
              <div className="space-y-3">
                <div>
                  <div className={`text-sm ${textStyles.caption}`}>Subnet {hoveredSubnet.id}</div>
                  <div className={`font-semibold ${textStyles.body}`}>{hoveredSubnet.name}</div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <div className={`${textStyles.caption}`}>Activity</div>
                    <div className={`font-semibold ${textStyles.accent}`}>
                      {hoveredSubnet.currentData.activity.toFixed(1)}%
                    </div>
                  </div>
                  <div>
                    <div className={`${textStyles.caption}`}>Price</div>
                    <div className={`font-semibold ${textStyles.accent}`}>
                      ${hoveredSubnet.currentData.price.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className={`${textStyles.caption}`}>Holders</div>
                    <div className={`font-semibold ${textStyles.accent}`}>
                      {hoveredSubnet.currentData.holders.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className={`${textStyles.caption}`}>Risk</div>
                    <div className={`font-semibold ${textStyles.accent}`}>
                      {hoveredSubnet.currentData.risk.toFixed(1)}/10
                    </div>
                  </div>
                </div>
                
                <div className="pt-2 border-t border-white/10">
                  <div className={`text-xs ${textStyles.caption}`}>Description</div>
                  <div className={`text-sm ${textStyles.body}`}>
                    {hoveredSubnet.description}
                  </div>
                </div>
              </div>
            ) : (
              <div className={`text-sm ${textStyles.body} opacity-60`}>
                Hover over any subnet square to see detailed information about its performance metrics and current status.
              </div>
            )}
          </div>

          {/* Filter Controls */}
          <div className={`${cardStyles.glass} p-4`}>
            <h4 className={`text-lg ${textStyles.heading} mb-3 flex items-center`}>
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </h4>
            
            <div className="space-y-3">
              <div>
                <label className={`text-sm ${textStyles.caption} block mb-1`}>
                  Activity Range
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={filterConfig.minActivity}
                    onChange={(e) => setFilterConfig(prev => ({ ...prev, minActivity: parseInt(e.target.value) }))}
                    className="w-16 px-2 py-1 text-xs bg-white/10 border border-white/20 rounded"
                  />
                  <span className={`text-xs ${textStyles.caption}`}>to</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={filterConfig.maxActivity}
                    onChange={(e) => setFilterConfig(prev => ({ ...prev, maxActivity: parseInt(e.target.value) }))}
                    className="w-16 px-2 py-1 text-xs bg-white/10 border border-white/20 rounded"
                  />
                </div>
              </div>

              <div>
                <label className={`text-sm ${textStyles.caption} block mb-1`}>
                  Price Range ($)
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    value={filterConfig.minPrice}
                    onChange={(e) => setFilterConfig(prev => ({ ...prev, minPrice: parseInt(e.target.value) }))}
                    className="w-16 px-2 py-1 text-xs bg-white/10 border border-white/20 rounded"
                  />
                  <span className={`text-xs ${textStyles.caption}`}>to</span>
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    value={filterConfig.maxPrice}
                    onChange={(e) => setFilterConfig(prev => ({ ...prev, maxPrice: parseInt(e.target.value) }))}
                    className="w-16 px-2 py-1 text-xs bg-white/10 border border-white/20 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filterConfig.showOnlyActive}
                    onChange={(e) => setFilterConfig(prev => ({ ...prev, showOnlyActive: e.target.checked }))}
                    className="rounded"
                  />
                  <span className={`text-sm ${textStyles.caption}`}>
                    Active only (&gt;50%)
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className={`${cardStyles.glass} p-4`}>
            <h4 className={`text-lg ${textStyles.heading} mb-3`}>
              Statistics
            </h4>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className={`${textStyles.caption}`}>Total Subnets</span>
                <span className={`font-semibold ${textStyles.accent}`}>{data.length}</span>
              </div>
              <div className="flex justify-between">
                <span className={`${textStyles.caption}`}>Active (&gt;50%)</span>
                <span className={`font-semibold ${textStyles.accent}`}>
                  {data.filter(s => s.currentData.activity > 50).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={`${textStyles.caption}`}>Avg Activity</span>
                <span className={`font-semibold ${textStyles.accent}`}>
                  {(data.reduce((sum, s) => sum + s.currentData.activity, 0) / data.length).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className={`${textStyles.caption}`}>Avg Price</span>
                <span className={`font-semibold ${textStyles.accent}`}>
                  ${(data.reduce((sum, s) => sum + s.currentData.price, 0) / data.length).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SubnetHeatmap;