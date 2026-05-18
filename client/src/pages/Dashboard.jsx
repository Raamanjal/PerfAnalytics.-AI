import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Search, Filter, Trash2, Award } from 'lucide-react';

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [department, setDepartment] = useState('');
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        department ? `/api/employees/search?department=${department}` : '/api/employees',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [department, token]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await axios.delete(`/api/employees/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchEmployees();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Employee Directory</h1>
        
        <div className="flex items-center bg-white rounded-md shadow-sm border border-slate-200 px-3 py-2 w-full sm:w-auto">
          <Filter className="w-5 h-5 text-slate-400 mr-2" />
          <input
            type="text"
            placeholder="Filter by Department..."
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="border-none focus:ring-0 text-sm w-full outline-none"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : employees.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-slate-200 border-dashed">
          <Award className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-2 text-sm font-medium text-slate-900">No employees found</h3>
          <p className="mt-1 text-sm text-slate-500">Get started by adding a new employee.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {employees.map((emp) => (
            <div key={emp._id} className="bg-white overflow-hidden shadow-sm border border-slate-200 rounded-xl hover:shadow-md transition-shadow">
              <div className="px-6 py-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 truncate">{emp.name}</h3>
                  <button onClick={() => handleDelete(emp._id)} className="text-red-400 hover:text-red-600 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-sm text-slate-500 mb-2">{emp.email}</div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {emp.department}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    Score: {emp.performanceScore}/100
                  </span>
                </div>
                <div className="mb-2 text-sm text-slate-600">
                  <span className="font-medium">Experience:</span> {emp.experience} years
                </div>
                <div>
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Skills</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {emp.skills.map((skill, idx) => (
                      <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
