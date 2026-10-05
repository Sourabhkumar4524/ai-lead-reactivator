import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import StatsCard from './components/StatsCard';
import LeadModal from './components/LeadModal';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import { getLeads, deleteLead, createLead } from './services/api';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Fetch leads from backend API
  const fetchLeadsData = useCallback(async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    setRefreshing(true);
    setError(null);
    try {
      const data = await getLeads();
      setLeads(data);
    } catch (err) {
      console.error('Error fetching leads:', err);
      setError(err.message || 'Unable to connect to backend server on port 5000');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchLeadsData();
  }, [fetchLeadsData]);

  // Handle lead deletion
  const handleDeleteLead = async (id) => {
    try {
      await deleteLead(id);
      setLeads((prev) => prev.filter((l) => l._id !== id));
      showToast('Lead deleted successfully from database', 'success');
      if (selectedLead && selectedLead._id === id) {
        setSelectedLead(null);
      }
    } catch (err) {
      console.error('Failed to delete lead:', err);
      showToast(err.message || 'Failed to delete lead', 'error');
    }
  };

  // Quick test lead generator for demonstration
  const handleCreateTestLead = async () => {
    const sampleNames = ['Marcus Vance', 'Elena Rostova', 'David Chen', 'Sophia Martinez', 'Jordan Bell'];
    const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const testPayload = {
      name: `${randomName}`,
      phone: `+1 (555) 019-${randomNum}`,
      email: `${randomName.toLowerCase().replace(' ', '.')}${randomNum}@enterprise.ai`,
      requirement: `Need autonomous voice and SMS agent reactivation for 3,200 cold SaaS trial accounts that lapsed in the past 90 days.`,
    };

    try {
      const created = await createLead(testPayload);
      setLeads((prev) => [created, ...prev]);
      showToast(`Test lead "${created.name}" created successfully!`, 'success');
    } catch (err) {
      showToast(err.message || 'Failed to create test lead', 'error');
    }
  };

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        leadCount={leads.length}
        onRefresh={() => fetchLeadsData()}
        refreshing={refreshing}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {currentTab === 'dashboard' ? (
          <Dashboard
            leads={leads}
            loading={loading}
            onSelectLead={(lead) => setSelectedLead(lead)}
            onNavigateToLeads={() => setCurrentTab('leads')}
          />
        ) : (
          <Leads
            leads={leads}
            loading={loading}
            error={error}
            onRefresh={() => fetchLeadsData()}
            onViewLead={(lead) => setSelectedLead(lead)}
            onDeleteLead={handleDeleteLead}
            onCreateTestLead={handleCreateTestLead}
          />
        )}
      </main>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <LeadModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onDelete={handleDeleteLead}
        />
      )}

      {/* Floating Notifications Toast */}
      {toast && (
        <div className="toast-container">
          <div className={`toast toast-${toast.type}`}>
            {toast.type === 'success' ? (
              <CheckCircle2 size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
