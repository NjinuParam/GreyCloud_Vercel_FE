// GreyCloud Weaver Integration Snippet - Auto-Generated 
// Target: Sandbox Environment 

const WEAVER_CONFIG = {
    LIGHTRAG_API: "https://52.151.192.107.nip.io",
    API_TOKEN: "your_api_token_here",
    COLLECTION: "greycloud_main",
    DEBUG: true
};

const weaverLog = (msg, data) => {
    if (WEAVER_CONFIG.DEBUG) {
        console.log(`[Weaver] ${msg}`, data || "");
    }
};

async function weaverIngest(text) {
    weaverLog("Ingesting text...", text.substring(0, 50) + "...");
    const formData = new FormData();
    formData.append('document_id', `gc-${Date.now()}`);
    formData.append('text', text);
    formData.append('collection', WEAVER_CONFIG.COLLECTION);
    try {
        const response = await fetch(`${WEAVER_CONFIG.LIGHTRAG_API}/ingest_text`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${WEAVER_CONFIG.API_TOKEN}` },
            body: formData
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        const result = await response.json();
        weaverLog("Ingestion successful", result);
        return `<OK> Knowledge Base Updated (${result.chunks} chunks). \nID: ${result.document_id}`;
    } catch (err) {
        console.error("[Weaver] Ingestion Error:", err);
        return `<X> Ingestion failed: ${err.message}`;
    }
}

async function weaverQuery(question) {
    weaverLog("Querying RAG...", question);
    try {
        const response = await fetch(`${WEAVER_CONFIG.LIGHTRAG_API}/query`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${WEAVER_CONFIG.API_TOKEN}` },
            body: JSON.stringify({ query: question, k: 3, collection: WEAVER_CONFIG.COLLECTION })
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        const result = await response.json();
        weaverLog("Query result received", { traceId: result.trace_id });
        return { response: result.answer, metadata: { trace_id: result.trace_id, weaver_link: "http://localhost:3001/dashboard" } };
    } catch (err) {
        console.error("[Weaver] Query Error:", err);
        return { response: `<X> RAG Query failed: ${err.message}` };
    }
}

async function handleGreyCloudMessage(message) {
    if (!message || typeof message !== 'string') return;
    const cmd = message.trim();
    if (cmd.toLowerCase().startsWith('ingest:')) {
        const content = cmd.substring(7).trim();
        return { response: await weaverIngest(content) };
    }
    return await weaverQuery(cmd);
}

if (typeof window !== 'undefined') {
    window.greyCloudHandler = handleGreyCloudMessage;
    console.log("%c[Weaver Intelligence]%c Snippet Loaded ^& Ready", "color: #6366f1; font-weight: bold", "color: inherit");
} 
