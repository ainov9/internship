import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Sidebar from './Sidebar';
import AnimatedGreeting from './AnimatedGreeting';
import StatCard from './StatCard';
import FaqTable from './FaqTable';
import AnswerModal from './AnswerModal';
import DataImportPanel from './DataImportPanel';




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

function Dashboard() {
  const [activeItem, setActiveItem] = useState('Assistant Manager');
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

  const filteredFaqs = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return faqs;
    return faqs.filter((item) => `${item.question} ${item.answer}`.toLowerCase().includes(query));
  }, [searchTerm, faqs]);

  const handleCreateAssistant = (event) => {
    event.preventDefault();
    setAssistantMessage('');

    if (!assistantName.trim()) {
      setAssistantMessage('Please enter a name for the assistant.');
      return;
    }

    const newAssistant = {
      id: `assistant-${Date.now()}`,
      name: assistantName.trim(),
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
              <StatCard label="Total Users" value="12.8k" icon="👥" trend="+8.2%" trendDirection="up" />
              <StatCard label="Queries Handled" value="4.2k" icon="💬" trend="+12.4%" trendDirection="up" />
              <StatCard label="Success Rate" value="94.6%" icon="✅" trend="-1.1%" trendDirection="down" />
              <StatCard label="Avg Response Time" value="1.4s" icon="⚡" trend="-0.3s" trendDirection="down" />
            </motion.div>

            {activeItem === 'Assistant Manager' && (
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
