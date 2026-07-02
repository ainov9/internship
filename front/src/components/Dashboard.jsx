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
  const [activeItem, setActiveItem] = useState('FAQ Management');
  const [faqs, setFaqs] = useState(sampleFaqs);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFaq, setSelectedFaq] = useState(null);
  const [lastSavedMessage, setLastSavedMessage] = useState('');
  const prefersReducedMotion = useReducedMotion();

  const filteredFaqs = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return faqs;
    return faqs.filter((item) => `${item.question} ${item.answer}`.toLowerCase().includes(query));
  }, [searchTerm, faqs]);

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
