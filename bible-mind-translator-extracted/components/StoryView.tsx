import React, { useState } from 'react';
import { generateStoryPage, generateStoryImage } from '../services/geminiService';
import { StoryPage } from '../types';
import { ArrowLeft, ArrowRight, BookOpen, Image as ImageIcon, Loader2 } from 'lucide-react';

const StoryView: React.FC = () => {
  const [book, setBook] = useState('Jonah');
  const [pages, setPages] = useState<StoryPage[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);

  const startStory = async () => {
    setPages([]);
    setCurrentPageIndex(0);
    loadNextPage(1);
  };

  const loadNextPage = async (pageNum: number) => {
    setLoading(true);
    try {
      const prevContext = pages.length > 0 ? pages[pages.length - 1].content : '';
      const newPage = await generateStoryPage(book, pageNum, prevContext);
      
      setPages(prev => [...prev, newPage]);
      setCurrentPageIndex(prev => prev === 0 && pageNum === 1 ? 0 : prev + 1);
      
      // Trigger image gen in background
      generateImageForPage(newPage, pages.length); 
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const generateImageForPage = async (page: StoryPage, index: number) => {
    setGeneratingImage(true);
    try {
      const img = await generateStoryImage(page.imagePrompt);
      setPages(current => {
        const updated = [...current];
        // Find the page in the array that matches this content (simplified matching)
        const targetIndex = updated.findIndex(p => p.pageNumber === page.pageNumber);
        if (targetIndex !== -1) {
            updated[targetIndex] = { ...updated[targetIndex], imageUrl: img };
        }
        return updated;
      });
    } finally {
      setGeneratingImage(false);
    }
  };

  const currentPage = pages[currentPageIndex];

  return (
    <div className="h-full flex flex-col items-center justify-center p-4">
      
      {/* Configuration Header */}
      {pages.length === 0 && !loading ? (
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl max-w-md w-full text-center space-y-6 shadow-2xl">
          <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-500/30">
            <BookOpen className="w-10 h-10 text-purple-300" />
          </div>
          <h2 className="text-3xl font-serif text-white">Bible Story Time</h2>
          <p className="text-gray-300">Choose a book to start a magical journey.</p>
          
          <div className="space-y-4">
            <input 
              value={book}
              onChange={(e) => setBook(e.target.value)}
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 text-center"
              placeholder="Enter Book (e.g. Daniel)"
            />
            <button 
              onClick={startStory}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 rounded-xl hover:opacity-90 transition-all shadow-lg"
            >
              Start Reading
            </button>
          </div>
        </div>
      ) : (
        /* Story Book Interface */
        <div className="relative w-full max-w-5xl aspect-[16/9] bg-white rounded-r-3xl rounded-l-md shadow-2xl flex overflow-hidden border-8 border-amber-900/40">
           {/* Book Spine Effect */}
           <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-amber-950 to-amber-800 z-10 shadow-xl" />

           {loading && !currentPage ? (
             <div className="w-full h-full flex items-center justify-center bg-amber-50">
               <Loader2 className="w-12 h-12 text-amber-800 animate-spin" />
             </div>
           ) : (
             <>
                {/* Left Page (Text) */}
                <div className="w-1/2 h-full bg-[#fdfbf7] p-12 pl-16 flex flex-col justify-between relative shadow-inner">
                    <div className="absolute inset-0 pointer-events-none opacity-10 mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')]"></div>
                    
                    <div>
                        <h3 className="font-serif text-2xl text-amber-900 mb-6 border-b-2 border-amber-900/10 pb-4">
                            {book} - Page {currentPage?.pageNumber}
                        </h3>
                        <p className="font-serif text-lg leading-relaxed text-gray-800">
                            {currentPage?.content}
                        </p>
                    </div>

                    <div className="flex justify-between items-center mt-8">
                        <button 
                          disabled={currentPageIndex === 0}
                          onClick={() => setCurrentPageIndex(p => p - 1)}
                          className="flex items-center text-amber-800 disabled:opacity-30 hover:underline"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" /> Prev
                        </button>
                        <span className="text-amber-900/40 font-serif italic">{currentPageIndex + 1}</span>
                    </div>
                </div>

                {/* Right Page (Image) */}
                <div className="w-1/2 h-full bg-[#fdfbf7] p-8 flex items-center justify-center relative shadow-inner border-l border-gray-300">
                     <div className="absolute inset-0 pointer-events-none opacity-10 mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')]"></div>
                    
                     <div className="w-full h-full border-4 border-amber-900/10 p-2 bg-white shadow-sm flex items-center justify-center overflow-hidden rounded-sm">
                        {currentPage?.imageUrl ? (
                            <img src={currentPage.imageUrl} alt="Story scene" className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex flex-col items-center text-amber-900/30">
                                {generatingImage ? (
                                    <>
                                        <Loader2 className="w-10 h-10 animate-spin mb-2" />
                                        <span className="font-serif">Painting the scene...</span>
                                    </>
                                ) : (
                                    <>
                                        <ImageIcon className="w-12 h-12 mb-2" />
                                        <span className="font-serif">Waiting for visual...</span>
                                    </>
                                )}
                            </div>
                        )}
                     </div>

                     <button 
                        onClick={() => loadNextPage(currentPageIndex + 2)}
                        className="absolute bottom-8 right-8 flex items-center bg-amber-800 text-amber-50 px-4 py-2 rounded-full hover:bg-amber-900 transition-colors shadow-lg z-20"
                     >
                        Next Page <ArrowRight className="w-4 h-4 ml-2" />
                     </button>
                </div>
             </>
           )}
        </div>
      )}
    </div>
  );
};

export default StoryView;
