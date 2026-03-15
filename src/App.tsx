/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Gamepad2, ArrowLeft, Maximize } from 'lucide-react';
import gamesData from './data/games.json';
import { Game } from './types';

export default function App() {
  const [games] = useState<Game[]>(gamesData);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  const filteredGames = games.filter(game =>
    game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFullscreen = () => {
    const iframe = document.getElementById('game-iframe');
    if (iframe) {
      if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" 
            onClick={() => setSelectedGame(null)}
          >
            <Gamepad2 className="w-8 h-8 text-emerald-400" />
            <h1 className="text-xl font-bold tracking-tight text-white hidden sm:block">Unblocked Hub</h1>
          </div>

          {!selectedGame && (
            <div className="relative w-full max-w-md ml-4 sm:ml-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-slate-600 rounded-lg leading-5 bg-slate-700 text-slate-200 placeholder-slate-400 focus:outline-none focus:bg-slate-600 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 sm:text-sm transition-colors"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedGame ? (
          <div className="flex flex-col h-[calc(100vh-8rem)]">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setSelectedGame(null)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Games
              </button>
              <h2 className="text-2xl font-bold hidden sm:block">{selectedGame.title}</h2>
              <button
                onClick={handleFullscreen}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors text-sm font-medium"
              >
                <Maximize className="w-4 h-4" />
                Fullscreen
              </button>
            </div>
            
            <div className="flex-1 bg-black rounded-xl overflow-hidden border border-slate-700 shadow-2xl relative">
              <iframe
                id="game-iframe"
                src={selectedGame.url}
                className="absolute inset-0 w-full h-full border-0"
                title={selectedGame.title}
                allow="fullscreen; autoplay; gamepad"
              ></iframe>
            </div>
            
            <div className="mt-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700 text-sm text-slate-400">
              <p className="flex items-center gap-2 justify-center">
                <span className="font-semibold text-slate-300">Note:</span> 
                If a game refuses to connect, the target site may have X-Frame-Options set to DENY. You can update the URLs in <code className="bg-slate-800 px-1.5 py-0.5 rounded text-emerald-400">src/data/games.json</code> to use proxy links or embed-friendly URLs.
              </p>
            </div>
          </div>
        ) : (
          <>
            {filteredGames.length === 0 ? (
              <div className="text-center py-20">
                <Gamepad2 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-slate-300">No games found</h3>
                <p className="text-slate-500 mt-2">Try adjusting your search query.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredGames.map((game) => (
                  <div
                    key={game.id}
                    onClick={() => setSelectedGame(game)}
                    className="group bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-emerald-500 transition-all cursor-pointer hover:shadow-lg hover:shadow-emerald-500/10 flex flex-col"
                  >
                    <div className="aspect-video w-full overflow-hidden bg-slate-900 relative p-4 flex items-center justify-center">
                      <img
                        src={game.thumbnail}
                        alt={game.title}
                        className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300 opacity-80 group-hover:opacity-100 drop-shadow-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=500';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-emerald-500 text-white rounded-full p-3 transform translate-y-4 group-hover:translate-y-0 transition-all shadow-lg">
                          <Gamepad2 className="w-6 h-6" />
                        </div>
                      </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col border-t border-slate-700/50">
                      <h3 className="text-lg font-bold text-slate-100 mb-1 group-hover:text-emerald-400 transition-colors">{game.title}</h3>
                      <p className="text-sm text-slate-400 line-clamp-2">{game.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
