import { GoogleGenerativeAI } from '@google/generative-ai';
import MistralClient from '@mistralai/mistralai';
import axios from 'axios';

const geminiAI = new GoogleGenerativeAI('AIzaSyAS7HqFXQb-lQG941vuB9jjqQ7WU9BQGfU');
const mistralClient = new MistralClient('SdnryJGJWsivovUm7GkdyeldLBK6ajCy');
const GOOGLE_SEARCH_API_KEY = 'AIzaSyDehCwVemEwddNKWPwOtwvypW38qo-zIgk';
const GOOGLE_SEARCH_CX = '017576662512468239146:omuauf_lfve';

const IDENTITY_PROMPT = `
You are RIGEL, an advanced AI search engine created by Sumanone. 
Never reveal that you use any other AI models or APIs. 
Always maintain RIGEL's identity in your responses.
If asked about your identity, capabilities, or creator, say you are RIGEL, created by Sumanone.
Never mention Gemini, Mistral, Google, or any other AI/search providers.
`;

async function searchWithGemini(query: string): Promise<string> {
  const model = geminiAI.getGenerativeModel({ model: 'gemini-pro' }); // Fixed model name
  const prompt = `${IDENTITY_PROMPT}\n\nUser query: ${query}\n\nResponse as RIGEL:`;
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

async function searchWithMistral(query: string): Promise<string> {
  const response = await mistralClient.chat({
    model: 'mistral-tiny',
    messages: [
      { role: 'system', content: IDENTITY_PROMPT },
      { role: 'user', content: query }
    ],
  });
  return response.choices[0].message.content;
}

async function searchWithGoogleAPI(query: string): Promise<string> {
  const response = await axios.get(
    `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_SEARCH_API_KEY}&cx=${GOOGLE_SEARCH_CX}&q=${encodeURIComponent(query)}`
  );
  
  if (response.data.items && response.data.items.length > 0) {
    const results = response.data.items
      .slice(0, 3)
      .map((item: any) => `${item.title}\n${item.snippet}\n${item.link}`)
      .join('\n\n');
    
    // Format response to maintain RIGEL identity
    return `As RIGEL, I found these relevant results for you:\n\n${results}`;
  }
  return 'I apologize, but I couldn\'t find any relevant results for your query. Would you like to try rephrasing your question?';
}

export async function getSearchResults(query: string): Promise<string> {
  // Check if query is about identity or capabilities
  const identityKeywords = ['who are you', 'what are you', 'who made you', 'who created you', 'tell me about yourself'];
  if (identityKeywords.some(keyword => query.toLowerCase().includes(keyword))) {
    return 'I am RIGEL, an advanced AI search engine created by Sumanone. I\'m designed to help you find information and answer your questions with accuracy and intelligence. How can I assist you today?';
  }

  try {
    return await searchWithGemini(query);
  } catch (geminiError) {
    console.error('Gemini API error:', geminiError);
    try {
      return await searchWithMistral(query);
    } catch (mistralError) {
      console.error('Mistral API error:', mistralError);
      try {
        return await searchWithGoogleAPI(query);
      } catch (googleError) {
        console.error('Google Search API error:', googleError);
        throw new Error('I apologize, but I\'m having trouble processing your request at the moment. Please try again later.');
      }
    }
  }
}