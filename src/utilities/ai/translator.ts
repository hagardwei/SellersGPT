import { getAIService } from "./service";
import { BlockData } from './pageBuilder';

/**
 * Simple in-memory cache for translations.
 * In production, consider persisting this in Redis, a database, or local JSON.
 */
// const translationCache: Record<string, string> = {};
const translationCache: Record<any, any> = {};

const MEDIA_KEYS = new Set([
  'image',
  'images',
  'icon',
  'icons',
  'video',
  'videos',
  'media',
  'upload',
  'thumbnail',
  'file',
]);

const TRANSLATABLE_KEYS = new Set([
  'title',
  'subTitle',
  'heading',
  'label',
  'text',
  'description',
  'introContent',
  'buttonText',
  'ctaText',
]);


/**
 * Recursively extracts text fields from blocks.
 */
function extractTextPaths(block: any, path: string[] = [], result: Record<string, string> = {}) {
  for (const key in block) {
    const value = block[key];
    const keyLower = key.toLowerCase();
     // 🚫 Never descend into media fields
     if(MEDIA_KEYS.has(keyLower)){
      continue
     }

    // 🚫 Never translate structural keys
    // if (NON_TRANSLATABLE_KEYS.has(key)) {
    //   continue;
    // }

    const currentPath = [...path, key];

    // ✅ Translate plain content strings only
   // ✅ Only translate whitelisted content keys
    if (typeof value === 'string' && TRANSLATABLE_KEYS.has(key)) {
      result[currentPath.join('.')] = value;
      continue;
    }

    // Arrays
    if (Array.isArray(value)) {
      value.forEach((v, i) => {
        if (v && typeof v === 'object') {
          extractTextPaths(v, [...currentPath, i.toString()], result);
        }
      });
      continue;
    }

    // Objects
    if (value && typeof value === 'object') {
      extractTextPaths(value, currentPath, result);
    }

    // if (typeof value === 'string') {
    //   result[currentPath.join('.')] = value;
    // } else if (Array.isArray(value)) {
    //   value.forEach((v, i) => {
    //     if (v && typeof v === 'object') extractTextPaths(v, [...currentPath, i.toString()], result);
    //   });
    // } else if (value && typeof value === 'object') {
    //   extractTextPaths(value, currentPath, result);
    // }
  }
  return result;
}

/**
 * Applies translations back to blocks using paths.
 */
function applyTranslationsByPath(block: any, translations: Record<string, string>) {
  for (const key in block) {
    const value = block[key];
    if(MEDIA_KEYS.has(key.toLowerCase())) continue;
    if (['blockType','id','_uuid','slug','status','variant'].includes(key)) continue;


       if (typeof value === 'string' && translations[value]) {
      block[key] = translations[value];
    } else if (Array.isArray(value)) {
      value.forEach(v => { if(v && typeof v==='object') applyTranslationsByPath(v,translations); });
    } else if (value && typeof value==='object') applyTranslationsByPath(value,translations);
  }
  return block;
}

/**
 * Translates a page layout efficiently using caching to reduce cost.
 */
export async function translateContent(
  content: { layout: BlockData[] },
  targetLanguage: any,
  sourceLanguage: string = 'en',
  context: { brandTone: string; pageTitle: string } = { brandTone: 'Professional', pageTitle: 'Page' }
): Promise<{ data: { layout: BlockData[] }, prompt: string | null }> {
  const aiService = getAIService();

  // Extract all text fields
  const textMapArray = content.layout.map(block => extractTextPaths(block));
  // Merge into a single object
  const combinedTexts: Record<string, string> = {};
  textMapArray.forEach(map => Object.assign(combinedTexts, map));

  // Filter out already cached translations
  const textsToTranslate: Record<string, string> = {};
  for (const path in combinedTexts) {
    if (!translationCache[combinedTexts[path]]) {
      textsToTranslate[path] = combinedTexts[path];
    }
  }

  // If everything is cached, skip AI call
  // if (Object.keys(textsToTranslate).length === 0) {
  //   const translatedLayout = content.layout.map(block => applyTranslationsByPath(block, translationCache));
  //   return { data: { layout: translatedLayout }, prompt: null };
  // }

  if(Object.keys(textsToTranslate).length > 0){
    // Prepare AI prompt
    const systemPrompt = `
    You are a professional translator for web content.
    Translate the following texts from ${sourceLanguage} to ${targetLanguage}.
    Maintain brand tone: "${context.brandTone}".
    Return a JSON object mapping the same keys to translated texts.
    `;
    console.log("Text to translateeeeeeeeeeee: ", textsToTranslate)
    const userPrompt = JSON.stringify(textsToTranslate); // compact JSON
    const fullPrompt = `System:\n${systemPrompt}\n\nUser JSON:\n${userPrompt}`;

    const response = await aiService.generate(fullPrompt, { type: 'json_object' });

    if (response.success && response.data) {
      // Update cache with new translations
      const originalTexts = Object.values(textsToTranslate);
      Object.values(response.data).forEach((translatedText, idx) => {
        const originalText = originalTexts[idx];
        if (originalText && translatedText) translationCache[originalText] = translatedText;
      });
    } else {
      console.warn('[Translator] AI failed, returning original content.', response.error);
    }
  }

  

  // Apply translations (from cache) back to layout
  const translatedLayout = content.layout.map(block => applyTranslationsByPath(block, translationCache));

  return { data: { layout: translatedLayout }, prompt: null };
}
