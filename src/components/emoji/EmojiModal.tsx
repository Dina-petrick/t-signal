import React, { useState, useMemo, useCallback } from 'react';
import Modal from '../Modal';
import { emojis } from '../../utils/emojiList';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (emoji: string) => void;
};

// Virtual scrolling component for better performance
const VirtualizedEmojiGrid = ({ 
  emojis, 
  onSelect, 
  onClose 
}: { 
  emojis: any[], 
  onSelect: (emoji: string) => void,
  onClose: () => void 
}) => {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 80 });
  const itemsPerRow = 8;
  const itemHeight = 40;
  const containerHeight = 400;
  
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const startRow = Math.floor(scrollTop / itemHeight);
    const endRow = Math.min(
      startRow + Math.ceil(containerHeight / itemHeight) + 2,
      Math.ceil(emojis.length / itemsPerRow)
    );
    
    setVisibleRange({
      start: startRow * itemsPerRow,
      end: endRow * itemsPerRow
    });
  }, [emojis.length, itemHeight, containerHeight, itemsPerRow]);

  const convertHexToEmoji = useCallback((hex: string): string => {
    const hexMatches = hex.match(/&#x([0-9A-Fa-f]+);/g);
    if (!hexMatches) return '';
    
    const codePoints = hexMatches.map(match => {
      const cleanHex = match.replace(/&#x|;/g, '');
      return parseInt(cleanHex, 16);
    });
    
    return String.fromCodePoint(...codePoints);
  }, []);

  const totalHeight = Math.ceil(emojis.length / itemsPerRow) * itemHeight;
  const visibleEmojis = emojis.slice(visibleRange.start, visibleRange.end);

  return (
    <div 
      className="rsp-h-[400px] rsp-overflow-y-auto rsp-relative"
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight }} className="rsp-relative">
        <div 
          className="rsp-absolute rsp-w-full rsp-grid rsp-grid-cols-8 rsp-gap-1"
          style={{ 
            top: Math.floor(visibleRange.start / itemsPerRow) * itemHeight,
            transform: `translateY(0px)`
          }}
        >
          {visibleEmojis.map((emoji, index) => {
            const actualIndex = visibleRange.start + index;
            return (
              <button
                key={actualIndex}
                onClick={() => {
                  onSelect(convertHexToEmoji(emoji.hexadecimal));
                }}
                className="rsp-w-10 rsp-h-10 rsp-flex rsp-items-center rsp-justify-center rsp-text-xl hover:rsp-bg-gray-100 rsp-rounded rsp-transition-colors"
                title={emoji.name}
                style={{ height: itemHeight }}
              >
                {convertHexToEmoji(emoji.hexadecimal)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default function EmojiModal({ isOpen, onClose, onSelect }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Memoize filtered emojis to avoid recalculation
  const filteredEmojis = useMemo(() => {
    if (!searchTerm) return emojis;
    
    return emojis.filter(emoji => 
      emoji.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Reset search when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select Emoji">
      <div className="rsp-space-y-4">
        {/* Search Input */}
        <div className="rsp-relative">
          <input
            type="text"
            placeholder="Search emojis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rsp-w-full rsp-px-3 rsp-py-2 rsp-border rsp-border-gray-300 rsp-rounded-md rsp-text-sm focus:rsp-outline-none focus:rsp-border-blue-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="rsp-absolute rsp-right-2 rsp-top-1/2 rsp-transform -rsp-translate-y-1/2 rsp-text-gray-400 hover:rsp-text-gray-600"
            >
              ×
            </button>
          )}
        </div>

        {/* Emoji Categories - Quick Access */}
        <div className="rsp-flex rsp-gap-2 rsp-flex-wrap">
          {['😀', '🎉', '❤️', '👍', '🔥', '💯', '✨', '🎯'].map((emoji) => (
            <button
              key={emoji}
              onClick={() => {
                onSelect(emoji);
              }}
              className="rsp-w-8 rsp-h-8 rsp-flex rsp-items-center rsp-justify-center rsp-text-lg hover:rsp-bg-gray-100 rsp-rounded rsp-transition-colors"
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="rsp-text-sm rsp-text-gray-500">
          {filteredEmojis.length} emojis found
        </div>

        {/* Virtualized Emoji Grid */}
        <VirtualizedEmojiGrid 
          emojis={filteredEmojis}
          onSelect={onSelect}
          onClose={onClose}
        />
      </div>
    </Modal>
  );
}