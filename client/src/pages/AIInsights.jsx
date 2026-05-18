import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { BrainCircuit, Sparkles, UserCheck } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const AIInsights = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('all');
  const [insight, setInsight] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get('/api/employees', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEmployees(res.data);
      } catch (err) {
        console.error('Failed to fetch employees', err);
      }
    };
    fetchEmployees();
  }, [token]);

  const generateInsights = async () => {
    if (employees.length === 0) {
      setError('No employees available to analyze.');
      return;
    }

    const employeesToAnalyze = selectedEmployeeId === 'all' 
      ? employees 
      : employees.filter(e => e._id === selectedEmployeeId);

    if (employeesToAnalyze.length === 0) {
      setError('Selected employee not found.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const res = await axios.post('/api/ai/recommend', { employees: employeesToAnalyze }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInsight(res.data.recommendation);
    } catch (err) {
      setError('Failed to generate AI insights. Check API keys and connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl overflow-hidden mb-8 text-white p-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold flex items-center gap-3">
              <BrainCircuit className="w-10 h-10" />
              AI Performance Analytics
            </h1>
            <p className="mt-2 text-indigo-100 max-w-2xl text-lg">
              Generate intelligent promotion recommendations, training suggestions, and feedback based on your team's performance metrics and skills.
            </p>
          </div>
          
          <div className="flex flex-col gap-4 bg-white/10 p-4 rounded-xl border border-white/20">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-indigo-100" />
              <label className="text-sm font-medium text-indigo-50">Select Target:</label>
              <select 
                value={selectedEmployeeId}
                onChange={(e) => setSelectedEmployeeId(e.target.value)}
                className="ml-2 bg-indigo-700 border border-indigo-500 text-white text-sm rounded-lg focus:ring-white focus:border-white p-2 outline-none"
              >
                <option value="all">Entire Team (All Users)</option>
                {employees.map(emp => (
                  <option key={emp._id} value={emp._id}>{emp.name} ({emp.department})</option>
                ))}
              </select>
            </div>

            <button 
              onClick={generateInsights}
              disabled={loading || employees.length === 0}
              className="w-full flex justify-center items-center gap-2 bg-white text-indigo-600 font-bold px-6 py-3 rounded-lg shadow hover:bg-indigo-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                  Analyzing Data...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" /> Generate Insights
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 text-sm text-red-700 mb-8 rounded shadow-sm">
          {error}
        </div>
      )}

      {insight && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <h3 className="text-lg font-semibold text-slate-800">AI Recommendations Report</h3>
          </div>
          <div className="p-8 prose prose-indigo max-w-none prose-headings:font-bold prose-h2:text-indigo-700 prose-h3:text-indigo-600 prose-p:text-slate-700 prose-a:text-indigo-600 prose-li:marker:text-indigo-500">
            <ReactMarkdown>{insight}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInsights;
