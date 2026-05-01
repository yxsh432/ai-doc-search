"use client";

import React, { useState, useEffect } from 'react';
import { FileUpload } from './FileUpload';
import { FileText, Database, Shield, History, Plus, MoreVertical } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SidebarProps {
  onNewChat: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onNewChat }) => {
  const [files, setFiles] = useState<string[]>([]);

  const handleUploadSuccess = (filename: string) => {
    setFiles(prev => [filename, ...prev]);
  };

  return (
    <div className="w-80 h-full border-r border-border glass-panel flex flex-col hidden md:flex relative z-10">
      <div className="p-4 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-3 font-bold text-lg">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Database size={18} />
          </div>
          <span className="text-gradient">AI Doc Search</span>
        </div>
      </div>

      <div className="p-4 space-y-4 flex-1 overflow-y-auto custom-scrollbar">
        <motion.button
          onClick={onNewChat}
          whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.15)' }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-2 justify-center px-4 py-3 bg-white/10 border border-white/20 text-white rounded-xl transition-all duration-300 font-medium text-sm shadow-[0_0_15px_rgba(255,255,255,0.1)]"
        >
          <Plus size={18} className="text-white" />
          New Chat
        </motion.button>

        <div className="space-y-4">
          <div className="px-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Upload Documents
            </h3>
            <FileUpload onUploadSuccess={handleUploadSuccess} />
          </div>

          <div className="px-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Uploaded Files
            </h3>
            <div className="space-y-1">
              {files.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  <FileText size={24} className="mx-auto mb-2 opacity-20" />
                  <p className="text-xs">No files uploaded yet</p>
                </div>
              ) : (
                files.map((file, idx) => (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.1)" }}
                    key={idx}
                    className="group flex items-center gap-3 p-3 rounded-xl border border-transparent hover:border-white/20 transition-all duration-200 cursor-pointer"
                  >
                    <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                      <FileText size={16} />
                    </div>
                    <span className="text-sm truncate flex-1">{file}</span>
                    <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-background rounded transition-all">
                      <MoreVertical size={14} />
                    </button>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-border mt-auto">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary transition-colors cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-secondary-foreground/10 flex items-center justify-center">
            <Shield size={16} />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">Privacy Settings</p>
            <p className="text-xs text-muted-foreground truncate">End-to-end secure</p>
          </div>
        </div>
      </div>
    </div>
  );
};
