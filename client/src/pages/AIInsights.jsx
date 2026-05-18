import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { BrainCircuit, Sparkles } from 'lucide-react';

const AIInsights = () => {
  const [employees, setEmployees] = useState([]);
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

    setLoading(true);
    setError('');
    
    try {
      const res = await axios.post('/api/ai/recommend', { employees }, {
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
          <button 
            onClick={generateInsights}
            disabled={loading || employees.length === 0}
            className="flex-shrink-0 flex items-center gap-2 bg-white text-indigo-600 font-bold px-6 py-3 rounded-lg shadow hover:bg-indigo-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div className="p-6 prose prose-indigo max-w-none">
            {/* Very simple markdown parsing for display */}
            {insight.split('\n').map((line, i) => {
              if (line.startsWith('###')) return <h4 key={i} className="text-md font-bold mt-4 mb-2">{line.replace('###', '')}</h4>;
              if (line.startsWith('##')) return <h3 key={i} className="text-lg font-bold mt-6 mb-3 border-b pb-2">{line.replace('##', '')}</h3>;
              if (line.startsWith('#')) return <h2 key={i} className="text-xl font-extrabold mt-8 mb-4">{line.replace('#', '')}</h2>;
              if (line.startsWith('-') || line.startsWith('*')) return <li key={i} className="ml-4">{line.substring(1)}</li>;
              if (line.trim() === '') return <br key={i} />;
              return <p key={i} className="mb-2 text-slate-700 leading-relaxed">{line}</p>;
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInsights;
