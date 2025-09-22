import { GoogleGenAI, Type, GenerateContentParameters } from "@google/genai";
import { SupportedLanguage, TestGenerationOutput, UploadedFile } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const parseCodeFromResponse = (responseText: string): string => {
  const codeBlockRegex = /```(?:\w+\n)?([\s\S]*?)```/;
  const match = responseText.match(codeBlockRegex);
  if (match && match[1]) {
    return match[1].trim();
  }
  return responseText.trim();
};

const handleApiError = (error: unknown): Error => {
    console.error("API Error:", error);
    let message = "An unexpected error occurred. Please try again later.";
    if (error instanceof Error && error.message) {
        const lowerMessage = error.message.toLowerCase();
        if (lowerMessage.includes('api key not valid')) {
            message = "Your API key is invalid or missing. Please check your environment configuration.";
        } else if (lowerMessage.includes('rate limit')) {
            message = "You've made too many requests. Please wait a moment and try again.";
        } else if (lowerMessage.includes('safety')) {
            message = "The request was blocked for safety reasons. Please modify your prompt and try again.";
        } else if (lowerMessage.includes('json') || lowerMessage.includes('unexpected token')) {
            message = "The response from the model was not in the expected format. Please try again.";
        }
    }
    return new Error(message);
};

export const generateCode = async (
    prompt: string, 
    language: SupportedLanguage,
    file: UploadedFile | null
): Promise<string> => {
  const model = 'gemini-2.5-flash';

  let systemPrompt = `You are an expert code generator. Your task is to generate clean, efficient, and well-documented code in ${language} based on the user's request. Only output the raw code for the requested language inside a single markdown code block. Do not include any explanatory text, introduction, or conclusion outside of the code block.`;

  if (file) {
    systemPrompt += `\n\nThe user has provided a file named '${file.name}' as a reference. Use its contents to inform the code generation.`;
  }
  
  const fullPrompt = `${systemPrompt}\n\nUser request: "${prompt}"`;

  const contents: GenerateContentParameters['contents'] = file ? {
    parts: [
      { text: fullPrompt },
      { inlineData: { mimeType: file.mimeType, data: file.data } }
    ]
  } : fullPrompt;

  try {
    const response = await ai.models.generateContent({
      model,
      contents,
    });
    const rawText = response.text;
    if (!rawText) {
        throw new Error("Received an empty response from the API.");
    }
    return parseCodeFromResponse(rawText);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getPromptSuggestions = async (prompt: string): Promise<string[]> => {
    const model = 'gemini-2.5-flash';

    const fullPrompt = `You are an expert prompt engineer. Your task is to refine the following user request for a code generator to be more detailed, specific, and clear.
Generate 3 distinct and creative suggestions. Each suggestion should explore a different angle or add a unique requirement to the original prompt.
For example, if the user asks for a "login form", suggestions could be:
1. A modern, responsive login form with social media login buttons (Google, Facebook).
2. A secure login form with client-side and server-side validation, including password strength indicators.
3. A multi-step login/registration flow using React hooks for state management.

Original user request: "${prompt}"`;

    const schema = {
        type: Type.OBJECT,
        properties: {
            suggestions: {
                type: Type.ARRAY,
                description: 'An array of 3 refined prompt suggestions as strings.',
                items: {
                    type: Type.STRING,
                },
            },
        },
        required: ["suggestions"],
    };

    try {
        const response = await ai.models.generateContent({
            model,
            contents: fullPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });

        const jsonText = response.text.trim();
        if (!jsonText) {
            throw new Error("Received an empty response from the API while refining prompt.");
        }
        const parsed = JSON.parse(jsonText);
        if (!parsed.suggestions || !Array.isArray(parsed.suggestions)) {
            throw new Error("Response did not contain valid suggestions.");
        }
        return parsed.suggestions;

    } catch (error) {
        throw handleApiError(error);
    }
};


export const getRecommendations = async (code: string, language: SupportedLanguage): Promise<string> => {
  const model = 'gemini-2.5-flash';

  const languageTag = {
    [SupportedLanguage.Python]: 'python',
    [SupportedLanguage.JavaScript]: 'javascript',
    [SupportedLanguage.Java]: 'java',
    [SupportedLanguage.CPP]: 'cpp',
    [SupportedLanguage.CSharp]: 'csharp',
    [SupportedLanguage.CSharpWinForms]: 'csharp',
    [SupportedLanguage.HTML_CSS]: 'html',
  }[language] || '';

  const fullPrompt = `You are an expert code reviewer. Analyze the following ${language} code snippet and provide recommendations for improvements, additional features, or useful libraries.
Present your recommendations as a clear, concise, and actionable list (e.g., using markdown bullet points).
Do not include any preamble, introduction, or conclusion, just the list of recommendations.

Code:
\`\`\`${languageTag}
${code}
\`\`\``;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: fullPrompt,
    });
    
    const recommendationsText = response.text;
    if (!recommendationsText) {
        throw new Error("Received an empty response from the API while getting recommendations.");
    }

    return recommendationsText.trim();
  } catch (error) {
    throw handleApiError(error);
  }
};

export const generateTests = async (code: string, language: SupportedLanguage): Promise<TestGenerationOutput> => {
  if (language !== SupportedLanguage.JavaScript && language !== SupportedLanguage.Python) {
    throw new Error("Test generation is currently only supported for JavaScript and Python.");
  }

  const model = 'gemini-2.5-flash';
  const framework = language === SupportedLanguage.JavaScript ? 'Jest' : 'Pytest';
  const languageName = language === SupportedLanguage.JavaScript ? 'JavaScript' : 'Python';

  const fullPrompt = `As a senior software quality engineer, your task is to write unit tests for the following ${languageName} code snippet using the ${framework} testing framework.

Provide a complete, runnable test file.
Also, provide clear, step-by-step instructions on how to set up the testing environment and run the tests.

Code to test:
\`\`\`
${code}
\`\`\`
`;

  const schema = {
    type: Type.OBJECT,
    properties: {
      testCode: {
        type: Type.STRING,
        description: `The complete unit test code written in ${framework}. This should be a single string containing the full code for the test file.`,
      },
      setupInstructions: {
        type: Type.STRING,
        description: "Step-by-step instructions in Markdown format on how to install dependencies (e.g., Jest or Pytest) and run the generated tests.",
      },
    },
    required: ["testCode", "setupInstructions"],
  };

  try {
    const response = await ai.models.generateContent({
      model,
      contents: fullPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
      throw new Error("Received an empty response from the API while generating tests.");
    }
    const parsedResponse = JSON.parse(jsonText);
    
    const cleanedCode = parseCodeFromResponse(parsedResponse.testCode || '');

    return {
        testCode: cleanedCode,
        setupInstructions: parsedResponse.setupInstructions || 'No instructions provided.',
    };

  } catch (error) {
    throw handleApiError(error);
  }
};