// ===================================================================
// VisaPro - AI Document Extractor (Groq powered)
// Groq Llama দিয়ে PDF/Image থেকে ভিসা/ফ্লাইট তথ্য বের করে
// Free tier: 14,400 requests/day, 30 req/min
// ===================================================================

import Groq from 'groq-sdk';
import pdfParse from 'pdf-parse';

const getGroq = () => new Groq({ apiKey: (process.env.GROQ_API_KEY || '').trim() });

// ===================================================================
// Extraction Prompt
// ===================================================================
const EXTRACTION_PROMPT = `You are a document information extractor for a visa consultancy system.
Analyze the following document text (it can be a visa document, flight ticket, itinerary, passport page, hotel booking, or any travel document).

Extract ALL available information and return ONLY a valid JSON object with these exact fields (use empty string "" if not found):

{
  "applicantName": "Full name of the passenger/applicant in English (e.g. MR GOLAM MONZUR AHAMED)",
  "applicantNameBn": "Full name in Bengali if available",
  "phone": "Phone number",
  "passportNo": "Passport number (e.g. A07141595)",
  "visaType": "Type: Tourist / Student / Business / Work / Medical / Visit / Transit / Spouse / Family",
  "country": "Destination country name",
  "visaNo": "Visa number or booking reference or PNR code",
  "issueDate": "Issue date in YYYY-MM-DD format",
  "expiryDate": "Expiry date or return date in YYYY-MM-DD format",
  "entryType": "single or multiple",
  "notes": "Flight numbers, airline, departure/arrival airports, fare details, hotel name, booking details etc.",
  "documentType": "visa / flight_ticket / passport / hotel_booking / itinerary / other"
}

RULES:
- For flight tickets: applicantName = passenger name, country = destination, visaNo = PNR/booking ref, issueDate = departure date, notes = all flight details
- Return ONLY raw JSON, NO markdown, NO explanation
- Dates must be YYYY-MM-DD format or empty string ""`;

// ===================================================================
// Extract from PDF Buffer
// ===================================================================
export const extractFromPdf = async (
    pdfBuffer: Buffer
): Promise<Record<string, string>> => {
    try {
        // Step 1: Extract text from PDF
        const pdfData = await pdfParse(pdfBuffer);
        const rawText = pdfData.text?.trim();

        if (!rawText || rawText.length < 20) {
            throw new Error('PDF has no readable text. Try uploading as image instead.');
        }

        // Step 2: Send to Groq Llama
        const groq = getGroq();
        const completion = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
                {
                    role: 'user',
                    content: `${EXTRACTION_PROMPT}\n\nDocument text:\n---\n${rawText.slice(0, 6000)}\n---`,
                },
            ],
            temperature: 0.1,
            max_tokens: 1000,
        });

        const text = completion.choices[0]?.message?.content?.trim() || '{}';

        // Clean and parse JSON
        const jsonStr = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const startIdx = jsonStr.indexOf('{');
        const endIdx = jsonStr.lastIndexOf('}');
        const cleanJson = startIdx !== -1 ? jsonStr.slice(startIdx, endIdx + 1) : jsonStr;

        return JSON.parse(cleanJson);
    } catch (error: any) {
        console.error('PDF extraction error:', error.message);
        throw new Error(`PDF extraction failed: ${error.message}`);
    }
};

// ===================================================================
// Extract from Image Buffer - describe image then parse
// ===================================================================
export const extractFromImage = async (
    imageBuffer: Buffer,
    mimeType: string
): Promise<Record<string, string>> => {
    try {
        // Groq vision model
        const groq = getGroq();
        const base64 = imageBuffer.toString('base64');
        const dataUrl = `data:${mimeType};base64,${base64}`;

        const completion = await groq.chat.completions.create({
            model: 'meta-llama/llama-4-scout-17b-16e-instruct',
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: EXTRACTION_PROMPT,
                        },
                        {
                            type: 'image_url',
                            image_url: { url: dataUrl },
                        },
                    ],
                },
            ] as any,
            temperature: 0.1,
            max_tokens: 1000,
        });

        const text = completion.choices[0]?.message?.content?.trim() || '{}';
        const jsonStr = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const startIdx = jsonStr.indexOf('{');
        const endIdx = jsonStr.lastIndexOf('}');
        const cleanJson = startIdx !== -1 ? jsonStr.slice(startIdx, endIdx + 1) : jsonStr;

        return JSON.parse(cleanJson);
    } catch (error: any) {
        console.error('Image extraction error:', error.message);
        throw new Error(`Image extraction failed: ${error.message}`);
    }
};

// ===================================================================
// Main Dispatcher
// ===================================================================
export const extractDocumentData = async (
    fileBuffer: Buffer,
    mimeType: string,
    originalName: string
): Promise<Record<string, string>> => {
    const isPdf =
        mimeType === 'application/pdf' ||
        originalName.toLowerCase().endsWith('.pdf');

    if (isPdf) {
        return extractFromPdf(fileBuffer);
    } else {
        const imageMime = mimeType.startsWith('image/') ? mimeType : 'image/jpeg';
        return extractFromImage(fileBuffer, imageMime);
    }
};
