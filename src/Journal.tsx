import React, { useState, useEffect } from 'react';
import { getDatabase, ref, set, get } from 'firebase/database';
import { FaTrash } from 'react-icons/fa';
import Sentiment from 'sentiment';
import { getAuth } from 'firebase/auth';
import Navbar from './Navbar'; // Assuming Navbar is used here as well

const JournalModule: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [entries, setEntries] = useState<
    { title: string; content: string; date: string; showContent: boolean }[]
  >([]);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const auth = getAuth();
  const database = getDatabase();

  useEffect(() => {
    const fetchEntries = async () => {
      const user = auth.currentUser;
      if (!user) {
        console.error('User not authenticated');
        return;
      }
  
      const userId = user.uid;
      const dbRef = ref(database, `journalEntries/${userId}`);
      const snapshot = await get(dbRef);
  
      if (snapshot.exists()) {
        const data = snapshot.val();
        const entriesList = Object.values(data) as { title: string; content: string; date: string; showContent: boolean }[];
        setEntries(entriesList.reverse());
      } else {
        console.log('No entries available for this user');
      }
    };
  
    fetchEntries();
  }, [auth, database]);
  

  useEffect(() => {
    let lastScrollTop = 0;
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsNavbarVisible(scrollTop <= lastScrollTop);
      lastScrollTop = scrollTop;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const capitalizeTitle = (title: string) =>
    title
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

  const handleAddEntry = async () => {
    if (!title.trim() || !content.trim()) return;

    const formattedTitle = capitalizeTitle(title);
    const dateCreated = new Date().toLocaleString();
    const newEntry = { title: formattedTitle, content, date: dateCreated, showContent: false };

    try {
      const user = auth.currentUser;
      if (!user) return;

      const userId = user.uid;
      const entryRef = ref(database, `journalEntries/${userId}/${Date.now()}`);
      await set(entryRef, newEntry);

      setEntries([newEntry, ...entries]);
      setTitle('');
      setContent('');
    } catch (error) {
      console.error('Error saving entry:', error);
    }
  };

  const handleDeleteEntry = async (index: number) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const userId = user.uid;
      const entryKey = Object.keys(entries)[index];
      const entryRef = ref(database, `journalEntries/${userId}/${entryKey}`);
      await set(entryRef, null);

      setEntries((prevEntries) => prevEntries.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  const toggleContent = (index: number) =>
    setEntries((prev) =>
      prev.map((entry, i) =>
        i === index ? { ...entry, showContent: !entry.showContent } : entry
      )
    );

  const MoodAnalyzer: React.FC<{ content: string }> = ({ content }) => {
    const sentiment = new Sentiment();
    const analysis = sentiment.analyze(content);
    const mood =
      analysis.score > 0 ? 'Positive' : analysis.score < 0 ? 'Negative' : 'Neutral';

    const moodStyles = {
      Positive: 'text-green-700',
      Negative: 'text-red-700',
      Neutral: 'text-gray-700',
    };

    return <p className={`font-semibold ${moodStyles[mood]}`}>Mood: {mood}</p>;
  };

  return (
    <div className="w-full min-h-screen bg-[#ECDFCC] flex flex-col">
      {isNavbarVisible && <Navbar />}
  
      {/* Main Content Section */}
      <div className="flex flex-row justify-center items-start w-full pt-20 px-8 gap-8">
        {/* Form Section (Left Side) */}
        <div className="flex-1 max-w-lg bg-transparent mt-20 p-6 rounded-lg">
          <h2 className="text-3xl font-serif mb-4 text-center">HealMY Journal</h2>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mb-4 p-3 bg-white border-2 border-black rounded-lg focus:outline-none"
          />
          <textarea
            placeholder="How was your day?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-32 p-4 mb-4 bg-white border-2 border-black rounded-lg focus:outline-none"
          />
          <button
            onClick={handleAddEntry}
            className="w-full py-2 border-2 bg-black border-black text-white rounded-lg hover:bg-yellow-600 transition"
          >
            Save Entry
          </button>
        </div>
  
        {/* Entries Section (Right Side) */}
        <div className="flex-1 max-w-lg bg-transparent p-6 rounded-lg">
          <h3 className="text-xl font-serif mb-4 border-2 py-2 border-black rounded-full text-center">Your Journal Entries</h3>
          {entries.length === 0 ? (
            <p className="text-black text-center">
              No entries yet! Start writing your thoughts.
            </p>
          ) : (
            <div>
              {entries.map((entry, index) => (
                <div
                  key={index}
                  className="bg-white border-2 border-black rounded-lg p-6 mb-4"
                >
                  <h2
                    onClick={() => toggleContent(index)}
                    className="text-s font-serif text-black cursor-pointer"
                  >
                    {entry.title}
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">{entry.date}</p>
                  {entry.showContent && (
                    <>
                      <p className="mt-2">{entry.content}</p>
                      <MoodAnalyzer content={entry.content} />
                      <button
                        onClick={() => handleDeleteEntry(index)}
                        className="mt-4 text-red-500 hover:text-red-700"
                      >
                        <FaTrash /> Delete
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}  

export default JournalModule;
