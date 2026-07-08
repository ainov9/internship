import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import Sidebar from './Sidebar';
import AnimatedGreeting from './AnimatedGreeting';
import StatCard from './StatCard';
import FaqTable from './FaqTable';
import AnswerModal from './AnswerModal';
import DataImportPanel from './DataImportPanel';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);



//  exemple data for FAQs to demonstrate the dashboard functionality
const sampleFaqs = [
  {
    id: 1,
    question: 'How do I reset my password?',
    answer: 'Use the Forgot Password link on the login page.',
    category: 'Account',
    status: 'Answered',
  },
  {
    id: 2,
    question: 'Can I change my subscription plan?',
    answer: '',
    category: 'Billing',
    status: 'Unanswered',
  },
  {
    id: 3,
    question: 'Where can I find API documentation?',
    answer: 'The docs are available in the developer portal.',
    category: 'Product',
    status: 'Answered',
  },
  {
    id: 4,
    question: 'Is there a mobile app available?',
    answer: '',
    category: 'General',
    status: 'Unanswered',
  },
];
// sample query events (timestamp + whether chatbot handled the query)
const sampleQueries = [
  { id: 1, date: '2026-01-12', handled: true },
  { id: 2, date: '2026-01-15', handled: false },
  { id: 3, date: '2026-02-03', handled: true },
  { id: 4, date: '2026-02-18', handled: true },
  { id: 5, date: '2026-03-02', handled: false },
  { id: 6, date: '2026-03-11', handled: true },
  { id: 7, date: '2026-04-09', handled: true },
  { id: 8, date: '2026-04-21', handled: false },
  { id: 9, date: '2026-05-05', handled: true },
  { id: 10, date: '2026-05-17', handled: true },
  { id: 11, date: '2026-06-03', handled: false },
  { id: 12, date: '2026-06-20', handled: true },
];
//partie logique li katdir l'interface dyal dashboard li kayn f admin
// Dashboard component for managing assistants and FAQs
function Dashboard() {
  const [activeItem, setActiveItem] = useState('Assistant Manager');//3ndna hna l'item li kayn f sidebar li kayn f dashboard okygol lik role
  const [faqs, setFaqs] = useState(sampleFaqs);
  const [assistants, setAssistants] = useState([
    { id: 'assistant-1', name: 'Support Assistant', purpose: 'Answer customer questions with knowledge base context', createdAt: 'Today' },
  ]);
  const [assistantName, setAssistantName] = useState('');
  const [assistantPurpose, setAssistantPurpose] = useState('Help customers with frequently asked questions');
  const [assistantMessage, setAssistantMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFaq, setSelectedFaq] = useState(null);
  const [lastSavedMessage, setLastSavedMessage] = useState('');
  const prefersReducedMotion = useReducedMotion();
  

  const answeredFaqCount = useMemo(
    () => faqs.filter((item) => item.status === 'Answered').length,
    [faqs],
  );


  const unansweredFaqCount = useMemo(
    () => faqs.filter((item) => item.status === 'Unanswered').length,
    [faqs],
  );
  const totalFaqCount = useMemo(() => faqs.length, [faqs]);

const filteredFaqs = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return faqs;

    return faqs.filter((item) => `${item.question} ${item.answer}`.toLowerCase().includes(query));
  }, [searchTerm, faqs]);




  const queryChartData = useMemo(() => ({
    labels: ['Handled by Chatbot', 'Not handled by Chatbot'],
    datasets: [{
      label: 'Query handling status',
      data: [answeredFaqCount, unansweredFaqCount],
      backgroundColor: ['#0ea5e9', '#f97316'],
      borderColor: ['#0b79c1', '#c2410c'],
      borderWidth: 2,
    }],
  }), [answeredFaqCount, unansweredFaqCount]);

  const queriesPerMonthData = useMemo(() => {
    // Create month labels covering the range of sampleQueries
    const dates = sampleQueries.map((q) => new Date(q.date));
    if (!dates.length) return { labels: [], datasets: [] };

    const minDate = new Date(Math.min(...dates.map((d) => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())));

    const labels = [];
    const cursor = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
    while (cursor <= maxDate) {
      labels.push(`${cursor.toLocaleString('default', { month: 'short' })} ${cursor.getFullYear()}`);
      cursor.setMonth(cursor.getMonth() + 1);
    }

    const handledCounts = labels.map(() => 0);
    const notHandledCounts = labels.map(() => 0);

    sampleQueries.forEach((q) => {
      const d = new Date(q.date);
      const label = `${d.toLocaleString('default', { month: 'short' })} ${d.getFullYear()}`;
      const idx = labels.indexOf(label);
      if (idx >= 0) {
        if (q.handled) handledCounts[idx] += 1;
        else notHandledCounts[idx] += 1;
      }
    });

    return {
      labels,
      datasets: [
        {
          label: 'Handled',
          data: handledCounts,
          backgroundColor: '#273840',
        },
        {
          label: 'Not handled',
          data: notHandledCounts,
          backgroundColor: '#3c2e23',
        },
      ],
    };
  }, []);




  const handleCreateAssistant = (event) => {
    event.preventDefault();
    setAssistantMessage('');

    if (!assistantName.trim()) {
      setAssistantMessage('Please enter a name for the assistant.');
      return;
    }

    const newAssistant = {
      id: `assistant-${Date.now()}`,
      name: assistantName.trim().toUpperCase(),
      purpose: assistantPurpose.trim() || 'Support customers with FAQs and conversation flow',
      createdAt: new Date().toLocaleDateString(),
    };

    setAssistants((current) => [newAssistant, ...current]);
    setAssistantName('');
    setAssistantPurpose('Help customers with frequently asked questions');
    setAssistantMessage(`Assistant “${newAssistant.name}” created successfully.`);
  };

  const handleAnswerSave = (answer) => {
    if (!selectedFaq) return;

    setFaqs((current) =>
      current.map((item) =>
        item.id === selectedFaq.id
          ? { ...item, answer, status: answer.trim() ? 'Answered' : 'Unanswered' }
          : item,
      ),
    );
    setLastSavedMessage(`Updated answer for “${selectedFaq.question}”.`);
    setSelectedFaq(null);
  };

  const handleImport = ({ rows, mapping }) => {
    const importedFaqs = rows
      .map((row, index) => {
        const question = row[mapping.question] || row.question || '';
        const answer = row[mapping.answer] || row.answer || '';
        const category = row[mapping.category] || row.category || 'General';
        const status = answer ? 'Answered' : 'Unanswered';

        if (!question) return null;
        return {
          id: `import-${index}`,
          question: String(question),
          answer: String(answer),
          category: String(category),
          status,
        };
      })
      .filter(Boolean);

    if (importedFaqs.length) {
      setFaqs((current) => [...importedFaqs, ...current]);
      setLastSavedMessage(`Imported ${importedFaqs.length} FAQ entries from your file.`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-3 text-slate-800 sm:p-4 lg:p-6">
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
        <Sidebar activeItem={activeItem} onNavigate={setActiveItem} />

        <main className="rounded-[30px] bg-[#f7f8fc] p-4 shadow-sm sm:p-6 lg:p-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 rounded-[24px] border border-slate-200/80 bg-white/80 p-4 shadow-sm lg:flex-row lg:items-end lg:justify-between lg:p-5">
              <AnimatedGreeting name="Amina" />
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 shadow-sm">
                <p className="font-semibold text-slate-900">Current focus</p>
                <p>Keep unresolved tickets moving with confident answers.</p>
              </div>
            </div>

            <motion.div
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
            >
              <StatCard label="Answered FAQs" value={`${answeredFaqCount}`} icon="✅" trend="+12.4%" trendDirection="up" />
              <StatCard label="Total Users" value="12.8k" icon="👥" trend="+8.2%" trendDirection="up" />
              <StatCard label="Queries Handled" value={`${totalFaqCount}`} icon="💬" trend="+12.4%" trendDirection="up" />
              <StatCard label="Avg Response Time" value="1.4s" icon="⚡" trend="-0.3s" trendDirection="down" />
              <StatCard label="Unanswered FAQs" value={`${unansweredFaqCount}`} icon="❌" trend="-5.1%" trendDirection="down" />
            </motion.div>

            {activeItem === 'Assistant Manager' && (
              <>
                <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900">Assistant Manager</h2>
                      <p className="mt-1 text-sm text-slate-500">Create assistants and manage their purpose.</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 shadow-sm">
                      <p className="font-semibold text-slate-900">Admin only</p>
                      <p>Assistants cannot upload datasets from the home section.</p>
                    </div>
                  </div>
                </section>

                <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">Handled vs Not handled Queries</h3>
                      <p className="mt-1 text-sm text-slate-500">Chatbot query coverage for the current FAQ dataset.</p>
                    </div>
                  </div>

                  <div className="mt-6 max-w-xl">
                    <Doughnut data={queryChartData} options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: 'bottom' },
                        tooltip: { enabled: true },
                      },
                    }} />
                  </div>

                  <div className="mt-6">
                    <div className="h-64">
                      <Bar data={queriesPerMonthData} options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { position: 'bottom' },
                        },
                        scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true } },
                      }} />
                    </div>
                  </div>
                </section>

                <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                  <div className="mt-6 grid gap-6 lg:grid-cols-2">
                    <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                      <h3 className="text-base font-semibold text-slate-900">New Assistant</h3>
                      <label className="block text-sm text-slate-700">
                        Name
                        <input
                          type="text"
                          value={assistantName}
                          onChange={(event) => setAssistantName(event.target.value)}
                          placeholder="Support Assistant"
                          className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                        />
                      </label>
                      <label className="block text-sm text-slate-700">
                        Purpose
                        <textarea
                          value={assistantPurpose}
                          onChange={(event) => setAssistantPurpose(event.target.value)}
                          rows={4}
                          className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={handleCreateAssistant}
                        className="w-full rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      >
                        Create Assistant
                      </button>
                      {assistantMessage && (
                        <p className="text-sm text-slate-600">{assistantMessage}</p>
                      )}
                    </div>

                    <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                      <h3 className="text-base font-semibold text-slate-900">Existing Assistants</h3>
                      <div className="space-y-3">
                        {assistants.map((assistant) => (
                          <div key={assistant.id} className="rounded-3xl border border-slate-200 bg-white p-4">
                            <div className="flex items-center justify-between gap-4">
                              <div>
                                <p className="font-semibold text-slate-900">{assistant.name}</p>
                                <p className="text-sm text-slate-500">Created: {assistant.createdAt}</p>
                              </div>
                            </div>
                            <p className="mt-3 text-sm text-slate-600">{assistant.purpose}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              </>
            )}

            {activeItem === 'FAQ Management' && (
              <>
                <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900">FAQ Management</h2>
                      <p className="mt-1 text-sm text-slate-500">{faqs.length} entries in the knowledge base</p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <label className="flex items-center rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-600 focus-within:ring-2 focus-within:ring-sky-500">
                        <span className="mr-2">🔎</span>
                        <input
                          value={searchTerm}
                          onChange={(event) => setSearchTerm(event.target.value)}
                          placeholder="Search FAQ"
                          className="w-full bg-transparent outline-none"
                          aria-label="Search FAQ entries"
                        />
                      </label>
                      <button
                        type="button"
                        className="rounded-2xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        onClick={() => setSelectedFaq({ id: 'new', question: '', answer: '', category: 'General', status: 'Unanswered' })}
                      >
                        Add Question
                      </button>
                    </div>
                  </div>

                  <div className="mt-6">
                    <FaqTable items={filteredFaqs} onAnswerClick={setSelectedFaq} />
                  </div>
                </section>

                <DataImportPanel onImport={handleImport} />

                <div aria-live="polite" className="text-sm text-slate-500">
                  {lastSavedMessage || 'Use sample data or import a file to populate the dashboard.'}
                </div>
              </>
            )}

            {activeItem !== 'FAQ Management' && activeItem !== 'Assistant Manager' && (
              <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm sm:p-6">
                <h2 className="text-xl font-semibold text-slate-900">{activeItem}</h2>
                <p className="mt-3 text-sm text-slate-500">This section is under construction. Please use Assistant Manager or FAQ Management for now.</p>
              </section>
            )}
          </div>
        </main>
      </div>

      <AnswerModal
        isOpen={Boolean(selectedFaq)}
        initialValue={selectedFaq?.answer || ''}
        onClose={() => setSelectedFaq(null)}
        onSave={handleAnswerSave}
      />
    </div>
  );
}

export default Dashboard;
