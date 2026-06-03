// Label scan endpoint — accepts image, returns structured yarn data
// Currently uses weight-to-hook mapping and smart defaults.
// Future: integrate OCR API (Google Vision, AWS Textract) for full extraction.

const WEIGHT_HOOKS = { 0: 2.25, 1: 3.5, 2: 4.0, 3: 4.5, 4: 5.5, 5: 6.5, 6: 9.0, 7: 12.0 };
const WEIGHT_NAMES = ['Lace','Super Fine','Fine','Light','Medium','Bulky','Super Bulky','Jumbo'];
const COMMON_YARDAGES = { 0: [400, 450, 500], 1: [300, 350, 400], 2: [250, 300, 350], 3: [200, 250, 300], 4: [150, 200, 250], 5: [100, 120, 150], 6: [60, 80, 100], 7: [40, 50, 60] };

export async function onRequest(context) {
  const { request } = context;

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const { imageUrl, detectedWeight } = await request.json();

    if (!imageUrl) {
      return new Response(JSON.stringify({ error: 'imageUrl required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const weight = (detectedWeight !== undefined) ? Math.min(Math.max(parseInt(detectedWeight) || 4, 0), 7) : null;

    const result = {
      imageUrl,
      suggestions: {}
    };

    if (weight !== null) {
      result.suggestions = {
        weight,
        weightLabel: WEIGHT_NAMES[weight],
        suggestedHook: WEIGHT_HOOKS[weight],
        commonYardages: COMMON_YARDAGES[weight] || [150, 200, 250],
        estimatedYardage: COMMON_YARDAGES[weight] ? COMMON_YARDAGES[weight][1] : 200
      };
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
