/**
 * Simple converter to wrap text into a basic Lexical JSON structure.
 * This allows us to save AI-generated paragraphs as valid rich text.
 */
export const toLexical = (text: string) => {
    return {
        root: {
            type: 'root',
            children: [
                {
                    type: 'paragraph',
                    children: [
                        {
                            type: 'text',
                            detail: 0,
                            format: 0,
                            mode: 'normal',
                            style: '',
                            text: text,
                            version: 1,
                        },
                    ],
                    direction: 'ltr',
                    format: '',
                    indent: 0,
                    textFormat: 0,
                    version: 1,
                },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
        },
    }
}
