import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Sprout, Droplets, Map, TrendingUp, Plus, Trash2, LayoutDashboard, Settings } from 'lucide-react';

const API_URL = 'http://localhost:8080/api';

function App() {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // New Crop Form
  const [newCrop, setNewCrop] = useState({ name: '', landRequired: '', waterRequired: '', profit: '' });
  
  // Optimization constraints
  const [constraints, setConstraints] = useState({ totalLand: 10, totalWater: 100 });
  const [optResult, setOptResult] = useState(null);
  const [optimizing, setOptimizing] = useState(false);

  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    try {
      const res = await axios.get(`${API_URL}/crops`);
      setCrops(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching crops:", err);
      setLoading(false);
    }
  };

  const handleAddCrop = async (e) => {
    e.preventDefault();
    if (!newCrop.name || !newCrop.landRequired || !newCrop.waterRequired || !newCrop.profit) return;
    
    try {
      await axios.post(`${API_URL}/crops`, {
        name: newCrop.name,
        landRequired: parseInt(newCrop.landRequired),
        waterRequired: parseInt(newCrop.waterRequired),
        profit: parseInt(newCrop.profit)
      });
      setNewCrop({ name: '', landRequired: '', waterRequired: '', profit: '' });
      fetchCrops();
    } catch (err) {
      console.error("Error adding crop:", err);
    }
  };

  const handleDeleteCrop = async (id) => {
    try {
      await axios.delete(`${API_URL}/crops/${id}`);
      fetchCrops();
    } catch (err) {
      console.error("Error deleting crop:", err);
    }
  };

  const handleOptimize = async () => {
    setOptimizing(true);
    try {
      const res = await axios.post(`${API_URL}/optimize`, {
        totalLand: parseInt(constraints.totalLand),
        totalWater: parseInt(constraints.totalWater)
      });
      setOptResult(res.data);
    } catch (err) {
      console.error("Error optimizing:", err);
    }
    setOptimizing(false);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className="w-full md:w-64 bg-dark text-slate-300 flex flex-col shadow-2xl z-10"
      >
        <div className="p-6 flex items-center space-x-3 text-white">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/50">
            <Sprout size={24} className="text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">AgriPlanner</h1>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-green-500/10 text-green-400 font-medium' : 'hover:bg-white/5 hover:text-white'}`}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </button>
          <button 
            onClick={() => setActiveTab('manage')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'manage' ? 'bg-green-500/10 text-green-400 font-medium' : 'hover:bg-white/5 hover:text-white'}`}
          >
            <Settings size={20} />
            <span>Manage Crops</span>
          </button>
        </nav>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 relative overflow-hidden bg-slate-50">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-200/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-200/40 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' ? (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <header className="mb-8">
                  <h2 className="text-3xl font-bold text-slate-800">Optimization Dashboard</h2>
                  <p className="text-slate-500 mt-2">Find the most profitable crop combination for your resources.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Constraints Panel */}
                  <div className="glass-panel p-6 lg:col-span-1 h-fit">
                    <h3 className="text-xl font-semibold mb-6 flex items-center">
                      <Settings className="mr-2 text-green-500" size={20}/> Resource Constraints
                    </h3>
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
                          <Map size={16} className="mr-2 text-amber-500" /> Available Land (Acres)
                        </label>
                        <input 
                          type="number" 
                          className="input-field" 
                          value={constraints.totalLand} 
                          onChange={(e) => setConstraints({...constraints, totalLand: e.target.value})}
                          min="1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
                          <Droplets size={16} className="mr-2 text-blue-500" /> Available Water (Units)
                        </label>
                        <input 
                          type="number" 
                          className="input-field" 
                          value={constraints.totalWater} 
                          onChange={(e) => setConstraints({...constraints, totalWater: e.target.value})}
                          min="1"
                        />
                      </div>
                      <button 
                        onClick={handleOptimize}
                        disabled={optimizing || crops.length === 0}
                        className="btn-primary w-full mt-4 flex items-center justify-center"
                      >
                        {optimizing ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                          <>Run Optimization</>
                        )}
                      </button>
                      {crops.length === 0 && (
                        <p className="text-xs text-red-500 text-center mt-2">Please add crops first.</p>
                      )}
                    </div>
                  </div>

                  {/* Results Panel */}
                  <div className="lg:col-span-2 space-y-8">
                    {optResult ? (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-panel p-8 overflow-hidden relative"
                      >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-bl-full -z-10"></div>
                        
                        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
                          <div>
                            <h3 className="text-2xl font-bold text-slate-800">Recommended Plan</h3>
                            <p className="text-slate-500 mt-1">Based on Dynamic Programming Optimization</p>
                          </div>
                          <div className="mt-4 md:mt-0 text-center md:text-right bg-green-50 px-6 py-4 rounded-2xl border border-green-100">
                            <p className="text-sm text-green-600 font-medium uppercase tracking-wider mb-1">Total Expected Profit</p>
                            <p className="text-4xl font-black text-green-600">₹{optResult.maxProfit.toLocaleString()}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                            <div className="flex justify-between items-end mb-3">
                              <span className="text-slate-500 font-medium flex items-center"><Map size={18} className="mr-2 text-amber-500"/> Land Utilization</span>
                              <span className="text-lg font-bold text-slate-800">{optResult.totalLandUsed} / {constraints.totalLand}</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2.5">
                              <div 
                                className="bg-amber-500 h-2.5 rounded-full transition-all duration-1000" 
                                style={{ width: `${Math.min(100, (optResult.totalLandUsed / constraints.totalLand) * 100)}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                            <div className="flex justify-between items-end mb-3">
                              <span className="text-slate-500 font-medium flex items-center"><Droplets size={18} className="mr-2 text-blue-500"/> Water Utilization</span>
                              <span className="text-lg font-bold text-slate-800">{optResult.totalWaterUsed} / {constraints.totalWater}</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2.5">
                              <div 
                                className="bg-blue-500 h-2.5 rounded-full transition-all duration-1000" 
                                style={{ width: `${Math.min(100, (optResult.totalWaterUsed / constraints.totalWater) * 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        <h4 className="font-semibold text-lg mb-4 text-slate-800 border-b pb-2">Selected Crops</h4>
                        {optResult.selectedCrops.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {optResult.selectedCrops.map((crop, idx) => (
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                key={idx} 
                                className="flex items-center p-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-shadow group"
                              >
                                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                                  <Sprout size={24} className="text-green-500" />
                                </div>
                                <div>
                                  <h5 className="font-bold text-slate-800">{crop.name}</h5>
                                  <div className="text-xs text-slate-500 flex space-x-3 mt-1">
                                    <span className="flex items-center"><Map size={12} className="mr-1"/> {crop.landRequired}</span>
                                    <span className="flex items-center"><Droplets size={12} className="mr-1"/> {crop.waterRequired}</span>
                                    <span className="flex items-center font-semibold text-green-600">₹{crop.profit}</span>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center p-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl">
                            <p className="text-slate-500">No combination of crops fits the given constraints.</p>
                          </div>
                        )}
                      </motion.div>
                    ) : (
                      <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-slate-400 glass-panel border-dashed border-2">
                        <TrendingUp size={48} className="mb-4 opacity-50" />
                        <p className="text-lg">Set constraints and run optimization to view results.</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="manage"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <header className="mb-8">
                  <h2 className="text-3xl font-bold text-slate-800">Manage Crops</h2>
                  <p className="text-slate-500 mt-2">Add, edit, or remove crops from your database.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="glass-panel p-6 lg:col-span-1 h-fit">
                    <h3 className="text-xl font-semibold mb-6">Add New Crop</h3>
                    <form onSubmit={handleAddCrop} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Crop Name</label>
                        <input 
                          type="text" 
                          required
                          className="input-field" 
                          placeholder="e.g. Rice"
                          value={newCrop.name} 
                          onChange={(e) => setNewCrop({...newCrop, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Land Required (Acres)</label>
                        <input 
                          type="number"
                          required
                          min="1"
                          className="input-field" 
                          placeholder="e.g. 5"
                          value={newCrop.landRequired} 
                          onChange={(e) => setNewCrop({...newCrop, landRequired: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Water Required (Units)</label>
                        <input 
                          type="number"
                          required
                          min="1"
                          className="input-field" 
                          placeholder="e.g. 50"
                          value={newCrop.waterRequired} 
                          onChange={(e) => setNewCrop({...newCrop, waterRequired: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Expected Profit (₹)</label>
                        <input 
                          type="number"
                          required
                          min="0"
                          className="input-field" 
                          placeholder="e.g. 7000"
                          value={newCrop.profit} 
                          onChange={(e) => setNewCrop({...newCrop, profit: e.target.value})}
                        />
                      </div>
                      <button type="submit" className="btn-primary w-full mt-4 flex items-center justify-center">
                        <Plus size={20} className="mr-2" /> Add Crop
                      </button>
                    </form>
                  </div>

                  <div className="lg:col-span-2">
                    <div className="glass-panel overflow-hidden">
                      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white/50">
                        <h3 className="text-xl font-semibold">Available Crops</h3>
                        <span className="bg-green-100 text-green-700 py-1 px-3 rounded-full text-sm font-medium">{crops.length} Total</span>
                      </div>
                      
                      <div className="overflow-x-auto">
                        {loading ? (
                          <div className="p-8 text-center text-slate-500">Loading crops...</div>
                        ) : crops.length === 0 ? (
                          <div className="p-12 text-center text-slate-400">
                            <Sprout size={48} className="mx-auto mb-4 opacity-30" />
                            <p>No crops added yet. Add some crops to get started.</p>
                          </div>
                        ) : (
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-slate-50/80 text-slate-500 text-sm border-b border-slate-100">
                                <th className="py-4 px-6 font-medium">Crop Name</th>
                                <th className="py-4 px-6 font-medium text-right">Land (Acres)</th>
                                <th className="py-4 px-6 font-medium text-right">Water (Units)</th>
                                <th className="py-4 px-6 font-medium text-right">Profit (₹)</th>
                                <th className="py-4 px-6 font-medium text-center">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              <AnimatePresence>
                                {crops.map((crop) => (
                                  <motion.tr 
                                    key={crop.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0, backgroundColor: '#fee2e2' }}
                                    className="border-b border-slate-50 hover:bg-white transition-colors group"
                                  >
                                    <td className="py-4 px-6 font-medium text-slate-800 flex items-center">
                                      <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center mr-3 text-green-600">
                                        <Sprout size={16} />
                                      </div>
                                      {crop.name}
                                    </td>
                                    <td className="py-4 px-6 text-right text-slate-600">{crop.landRequired}</td>
                                    <td className="py-4 px-6 text-right text-slate-600">{crop.waterRequired}</td>
                                    <td className="py-4 px-6 text-right font-semibold text-green-600">₹{crop.profit.toLocaleString()}</td>
                                    <td className="py-4 px-6 text-center">
                                      <button 
                                        onClick={() => handleDeleteCrop(crop.id)}
                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                      >
                                        <Trash2 size={18} />
                                      </button>
                                    </td>
                                  </motion.tr>
                                ))}
                              </AnimatePresence>
                            </tbody>
                          </table>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default App;
