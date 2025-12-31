
const ELEVENLABS_API_KEY = 'sk_6eecd789ed7ba6c1c3f288906bf03d2efcebb11c4fec7fa9';
const VOICE_ID = '2EiwWnXFnvU5JabPnv8n'; // "Clyde"

export async function speechToText(audioBlob: Blob): Promise<string> {
  try {
    // Ensure we have data
    if (audioBlob.size === 0) {
      console.warn('Empty audio blob received');
      return '';
    }

    const formData = new FormData();
    // Use a generic .webm filename, but ensure the Blob type is preserved
    formData.append('file', audioBlob, 'audio.webm');
    formData.append('model_id', 'scribe_v1');

    const response = await fetch(`https://api.elevenlabs.io/v1/speech-to-text`, {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Scribe API Error:', errorText);
      throw new Error(`Scribe API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.text || '';
  } catch (error) {
    console.error('STT Service Critical Fault:', error);
    throw error;
  }
}

export async function textToSpeech(text: string): Promise<HTMLAudioElement> {
  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_turbo_v2_5',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.8,
        },
      }),
    });

    if (!response.ok) throw new Error('TTS response not ok');
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    return new Audio(audioUrl);
  } catch (error) {
    console.error('TTS Service Critical Fault:', error);
    throw error;
  }
}
