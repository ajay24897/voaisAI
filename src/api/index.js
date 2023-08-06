import axios from 'axios';

let apiKey = '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';
// let apiKey = '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';
const client = axios.create({
  headers: {
    Authorization: 'Bearer ' + apiKey,
    'Content-Type': 'application/json',
  },
});

const chatgptUrl = 'https://api.openai.com/v1/chat/completions';
const dalleUrl = 'https://api.openai.com/v1/images/generations';

export const apiCall = async (prompt, messages) => {
  // // Logic 1 : this will check the prompt from chatgpt if user wants to create an image
  try {
    const res = await client.post(chatgptUrl, {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: `Does this message want to generate an AI picture, image, art or anything similar? ${prompt} . Simply answer with a yes or no.`,
        },
      ],
    });
    let isArt = res.data?.choices[0]?.message?.content;
    isArt = isArt.trim();
    if (
      isArt.toLowerCase().includes('yes') ||
      prompt.includes('image') ||
      prompt.includes('picture') ||
      prompt.includes('sketch')
    ) {
      console.log('dalle api call');
      return dalleApiCall(prompt, messages);
    } else {
      console.log('chatgpt api call');
      return chatgptApiCall(prompt, messages);
    }
  } catch (err) {
    console.log('error: ', err);
    return Promise.resolve({success: false, msg: err.message});
  }
};

const chatgptApiCall = async (prompt, messages) => {
  try {
    const res = await client.post(chatgptUrl, {
      model: 'gpt-3.5-turbo',
      messages,
    });

    let answer = res.data?.choices[0]?.message?.content;
    let newMsg = [...messages];

    newMsg.push({role: 'assistant', content: answer.trim()});
    console.log('got chat response', answer);
    return Promise.resolve({success: true, data: newMsg});
  } catch (err) {
    console.log('error: ', err);
    return Promise.resolve({success: false, msg: err.message});
  }
};

const dalleApiCall = async (prompt, messages) => {
  try {
    const res = await client.post(dalleUrl, {
      prompt,
      n: 1,
      size: '512x512',
    });

    let url = res?.data?.data[0]?.url;
    console.log('got image url: ', url);
    let newMsg = [...messages];
    newMsg.push({role: 'assistant', content: url});
    return Promise.resolve({success: true, data: newMsg});
  } catch (err) {
    console.log('error: ', err);
    return Promise.resolve({success: false, msg: err.message});
  }
};
