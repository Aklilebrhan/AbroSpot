'use client';

import React, { useState } from 'react';
import {
  Shield,
  Activity,
  Send,
  CheckCircle2,
  XCircle,
  Copy,
  Upload,
  RefreshCw,
  AlertTriangle,
  Play,
} from 'lucide-react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'review' | 'sources' | 'dropzone'>('review');
  const [dropzoneText, setDropzoneText] = useState('');
  const [dropzoneStatus, setDropzoneStatus] = useState<string | null>(null);

  // Sample Review Queue items
  const [reviewQueue, setReviewQueue] = useState([
    {
      id: 'rev-1',
      reason: 'LOW_CONFIDENCE',
      status: 'PENDING',
      confidenceScore: 0.68,
      sourcePlatform: 'TELEGRAM',
      author: '@linkupaddis',
      rawText: 'Atmosphere Addis: Acoustic Night with Betty G! Friday Megabit 15 at Atmosphere. Doors open 6:00 PM.',
      suggestedTitle: 'Acoustic Night with Betty G',
      suggestedVenue: 'Atmosphere Addis',
      suggestedDate: '2026-03-24 (Megabit 15)',
    },
    {
      id: 'rev-2',
      reason: 'DATE_AMBIGUITY',
      status: 'PENDING',
      confidenceScore: 0.74,
      sourcePlatform: 'INSTAGRAM',
      author: '@atmosphere_addis',
      rawText: 'Live Jazz this Friday. Megabit 15. Doors at 7 PM.',
      suggestedTitle: 'Live Jazz Night',
      suggestedVenue: 'Atmosphere Addis',
      suggestedDate: 'Megabit 15 (Year not specified)',
    },
    {
      id: 'rev-3',
      reason: 'POSSIBLE_DUPLICATE',
      status: 'PENDING',
      confidenceScore: 0.82,
      sourcePlatform: 'TELEGRAM',
      author: '@eventsethiopia',
      rawText: 'Betty G Acoustic show this Friday at Atmosphere Bole.',
      suggestedTitle: 'Betty G Acoustic show',
      suggestedVenue: 'Atmosphere Addis',
      suggestedDate: '2026-03-24',
    },
  ]);

  // Monitored channels
  const [sources, setSources] = useState([
    { id: '1', platform: 'TELEGRAM', identifier: '@linkupaddis', name: 'LinkUp Addis', status: 'ACTIVE', posts: 1420 },
    { id: '2', platform: 'TELEGRAM', identifier: '@eventsethiopia', name: 'Events Ethiopia', status: 'ACTIVE', posts: 980 },
    { id: '3', platform: 'TELEGRAM', identifier: '@gdgaddis', name: 'GDG Addis', status: 'ACTIVE', posts: 310 },
    { id: '4', platform: 'TELEGRAM', identifier: '@yegnahappenings', name: 'Yegna Happenings', status: 'ACTIVE', posts: 640 },
    { id: '5', platform: 'INSTAGRAM', identifier: 'linkupaddis', name: 'LinkUp Instagram', status: 'STANDBY', posts: 110 },
    { id: '6', platform: 'X_TWITTER', identifier: 'LinkupAddis', name: 'LinkUp on X', status: 'STANDBY', posts: 85 },
  ]);

  const handleApprove = (id: string) => {
    setReviewQueue((prev) => prev.filter((item) => item.id !== id));
    alert('Event approved and published to public discovery!');
  };

  const handleReject = (id: string) => {
    setReviewQueue((prev) => prev.filter((item) => item.id !== id));
    alert('Announcement marked as rejected.');
  };

  const handleManualDrop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dropzoneText.trim()) return;
    setDropzoneStatus('Processing flyer with AI OCR and Date Normalizer...');
    setTimeout(() => {
      setDropzoneStatus('✅ Successfully processed and added to verification queue!');
      setDropzoneText('');
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Shield className="w-6 h-6 text-brand-500" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Curator & Admin Command Center</h1>
          </div>
          <p className="text-xs text-slate-400">
            Monitor ingestion channels, audit AI extractions, resolve calendar ambiguities, and merge duplicate flyers.
          </p>
        </div>

        {/* Live Engine Status Badge */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-darkSurface-100 subtle-border text-xs">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300">FastAPI AI Ingestion:</span>
            <span className="text-emerald-400 font-bold">ONLINE</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-3 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveTab('review')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'review'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
              : 'text-slate-400 hover:text-white bg-darkSurface-100 subtle-border'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>Review Queue ({reviewQueue.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('sources')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'sources'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
              : 'text-slate-400 hover:text-white bg-darkSurface-100 subtle-border'
          }`}
        >
          <Activity className="w-4 h-4 text-emerald-400" />
          <span>Monitored Sources ({sources.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('dropzone')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'dropzone'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
              : 'text-slate-400 hover:text-white bg-darkSurface-100 subtle-border'
          }`}
        >
          <Upload className="w-4 h-4 text-blue-400" />
          <span>Manual Flyer Dropzone</span>
        </button>
      </div>

      {/* Tab 1: Review Queue */}
      {activeTab === 'review' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Items requiring human verification due to confidence or calendar ambiguity</span>
            <span>{reviewQueue.length} items pending</span>
          </div>

          {reviewQueue.length > 0 ? (
            <div className="space-y-4">
              {reviewQueue.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-darkSurface-100 subtle-border space-y-4 hover:border-white/20 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wide bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {item.reason}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        Platform: {item.sourcePlatform} ({item.author})
                      </span>
                    </div>
                    <span className="text-xs text-slate-400">
                      Extraction Confidence: <strong className="text-amber-400">{(item.confidenceScore * 100).toFixed(0)}%</strong>
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-darkSurface-50 text-xs text-slate-300 font-mono">
                    {item.rawText}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-2.5 rounded-lg bg-darkSurface-50">
                      <span className="text-slate-500 block">Suggested Title:</span>
                      <span className="font-semibold text-white">{item.suggestedTitle}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-darkSurface-50">
                      <span className="text-slate-500 block">Venue:</span>
                      <span className="font-semibold text-white">{item.suggestedVenue}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-darkSurface-50">
                      <span className="text-slate-500 block">Extracted Date:</span>
                      <span className="font-semibold text-white">{item.suggestedDate}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end space-x-3 pt-2 border-t border-white/5">
                    <button
                      onClick={() => handleReject(item.id)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 flex items-center space-x-1.5"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject Announcement</span>
                    </button>
                    <button
                      onClick={() => handleApprove(item.id)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center space-x-1.5 shadow-md shadow-emerald-600/20"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve & Publish</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-slate-400 text-sm">
              All review items have been resolved! Ingestion queue is clean.
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Monitored Sources */}
      {activeTab === 'sources' && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-darkSurface-100 subtle-border overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Registered Ingestion Sources (Addis Ababa)</h3>
              <button
                onClick={() => alert('Ingestion worker triggered across all active channels!')}
                className="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold flex items-center space-x-1.5"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Trigger Ingestion Run</span>
              </button>
            </div>

            <div className="divide-y divide-white/5">
              {sources.map((s) => (
                <div key={s.id} className="p-4 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <span className="p-2 rounded-lg bg-darkSurface-50 text-brand-400">
                      <Send className="w-4 h-4" />
                    </span>
                    <div>
                      <span className="font-bold text-white text-sm block">{s.name}</span>
                      <span className="text-slate-400">{s.identifier} · {s.platform}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <span className="text-slate-300 font-mono">{s.posts} posts ingested</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        s.status === 'ACTIVE'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                      }`}
                    >
                      {s.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Manual Flyer Dropzone */}
      {activeTab === 'dropzone' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="p-6 rounded-2xl bg-darkSurface-100 subtle-border space-y-4">
            <div className="space-y-1">
              <h3 className="font-bold text-white text-base">Curator Manual Flyer Intake</h3>
              <p className="text-xs text-slate-400">
                Paste raw flyer text, Telegram post snippet, or flyer announcements to run through the AI extraction pipeline.
              </p>
            </div>

            <form onSubmit={handleManualDrop} className="space-y-4">
              <textarea
                rows={6}
                value={dropzoneText}
                onChange={(e) => setDropzoneText(e.target.value)}
                placeholder="Paste event flyer text, e.g. 'Acoustic night at Atmosphere this Friday Megabit 15...'"
                className="w-full p-4 rounded-xl bg-darkSurface-50 subtle-border text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs tracking-wide transition-all shadow-lg shadow-brand-600/30 flex items-center justify-center space-x-2"
              >
                <Upload className="w-4 h-4" />
                <span>Process with AI Ingestion Pipeline</span>
              </button>
            </form>

            {dropzoneStatus && (
              <div className="p-3 rounded-xl bg-darkSurface-50 subtle-border text-xs text-brand-300 font-medium">
                {dropzoneStatus}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
