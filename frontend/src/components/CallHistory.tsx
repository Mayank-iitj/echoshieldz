'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, AlertTriangle, CheckCircle, Flag, Search, Filter } from 'lucide-react';
import { CallHistoryItem, AlertLevel } from '@/types';
import api from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';

interface CallHistoryProps {
  items?: CallHistoryItem[];
}

const levelColors: Record<AlertLevel, string> = {
  SAFE: 'bg-green-100 text-green-800',
  SUSPICIOUS: 'bg-yellow-100 text-yellow-800',
  HIGH_RISK: 'bg-orange-100 text-orange-800',
  CRITICAL: 'bg-red-100 text-red-800',
};

export function CallHistory({ items: initialItems }: CallHistoryProps) {
  const [items, setItems] = useState<CallHistoryItem[]>(initialItems || []);
  const [loading, setLoading] = useState(!initialItems);
  const [filter, setFilter] = useState<'all' | 'scams' | 'safe'>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!initialItems) {
      api.getCallHistory().then(setItems).catch(console.error).finally(() => setLoading(false));
    }
  }, [initialItems]);

  const filteredItems = items.filter((item) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'scams' && item.alert_level !== 'SAFE') ||
      (filter === 'safe' && item.alert_level === 'SAFE');
    const matchesSearch =
      !search || item.phone_number.includes(search);
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search phone number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'scams', 'safe'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredItems.map((item, index) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="font-mono text-sm">{item.phone_number}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${levelColors[item.alert_level]}`}>
                      {item.risk_score.toFixed(0)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {item.scam_type === 'SAFE' ? (
                      <span className="text-green-600">Safe</span>
                    ) : (
                      item.scam_type.replace('_', ' ')
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {item.was_reported ? (
                      <span className="inline-flex items-center gap-1 text-red-600">
                        <Flag className="w-4 h-4" />
                        Reported
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-gray-400">
                        <CheckCircle className="w-4 h-4" />
                        Verified
                      </span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No calls found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}

export default CallHistory;