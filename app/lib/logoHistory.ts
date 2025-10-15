// Types for logo history
export interface LogoHistoryItem {
  id: string;
  companyName: string;
  style: string;
  primaryColor: string;
  backgroundColor: string;
  additionalInfo?: string;
  customPrompt?: string;
  imageData: string; // base64 encoded image
  createdAt: string; // ISO date string
}

export interface LogoHistory {
  items: LogoHistoryItem[];
}

// Local storage key
const LOGO_HISTORY_KEY = 'logoHistory';

// Get logo history from localStorage
export function getLogoHistory(): LogoHistory {
  if (typeof window === 'undefined') {
    return { items: [] };
  }

  try {
    const stored = localStorage.getItem(LOGO_HISTORY_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading logo history:', error);
  }

  return { items: [] };
}

// Save logo to history
export function saveLogoToHistory(logo: Omit<LogoHistoryItem, 'id' | 'createdAt'>): void {
  if (typeof window === 'undefined') return;

  try {
    const history = getLogoHistory();
    const newItem: LogoHistoryItem = {
      ...logo,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };

    // Add to beginning of array (most recent first)
    history.items.unshift(newItem);
    
    // Keep only the last 50 items to prevent localStorage from getting too large
    if (history.items.length > 50) {
      history.items = history.items.slice(0, 50);
    }

    localStorage.setItem(LOGO_HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving logo to history:', error);
  }
}

// Clear all logo history
export function clearLogoHistory(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(LOGO_HISTORY_KEY);
  } catch (error) {
    console.error('Error clearing logo history:', error);
  }
}

// Generate simple ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Remove specific logo from history
export function removeLogoFromHistory(id: string): void {
  if (typeof window === 'undefined') return;

  try {
    const history = getLogoHistory();
    history.items = history.items.filter(item => item.id !== id);
    localStorage.setItem(LOGO_HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error removing logo from history:', error);
  }
}
