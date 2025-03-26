import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyDcbl-NNpezRvbpmflV4DJeCgg54datFBE');

export async function getSearchResults(query: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.0-pro' });
    const prompt = `Act as a search engine and provide a concise, well-formatted answer to: ${query}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error fetching results:', error);
    throw new Error('Failed to fetch search results');
  }
}