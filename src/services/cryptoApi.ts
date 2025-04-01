
import { toast } from "sonner";

const API_URL = "https://api.coingecko.com/api/v3";

export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  last_updated: string;
}

export interface CoinDetail extends Coin {
  description: { en: string };
  links: {
    homepage: string[];
    blockchain_site: string[];
    official_forum_url: string[];
    chat_url: string[];
    announcement_url: string[];
    twitter_screen_name: string;
    facebook_username: string;
    telegram_channel_identifier: string;
    subreddit_url: string;
    repos_url: { github: string[] };
  };
  market_data: {
    current_price: { [key: string]: number };
    price_change_percentage_1h_in_currency: { [key: string]: number };
    price_change_percentage_24h_in_currency: { [key: string]: number };
    price_change_percentage_7d_in_currency: { [key: string]: number };
    price_change_percentage_30d_in_currency: { [key: string]: number };
  };
}

export interface MarketChart {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

// Fetch top cryptocurrencies by market cap
export const fetchTopCoins = async (limit = 50): Promise<Coin[]> => {
  try {
    const response = await fetch(
      `${API_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`
    );
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching top coins:", error);
    toast.error("Failed to fetch cryptocurrency data");
    return [];
  }
};

// Fetch detailed information for a specific coin
export const fetchCoinDetails = async (coinId: string): Promise<CoinDetail | null> => {
  try {
    const response = await fetch(
      `${API_URL}/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`
    );
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching details for ${coinId}:`, error);
    toast.error(`Failed to fetch details for ${coinId}`);
    return null;
  }
};

// Fetch historical market chart data for a coin
export const fetchCoinMarketChart = async (
  coinId: string,
  days = 7
): Promise<MarketChart | null> => {
  try {
    const response = await fetch(
      `${API_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
    );
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching market chart for ${coinId}:`, error);
    toast.error(`Failed to fetch price chart for ${coinId}`);
    return null;
  }
};

// Search for coins by query
export const searchCoins = async (query: string): Promise<any[]> => {
  try {
    const response = await fetch(`${API_URL}/search?query=${query}`);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    return data.coins || [];
  } catch (error) {
    console.error("Error searching coins:", error);
    toast.error("Failed to search cryptocurrencies");
    return [];
  }
};
