@echo off
setlocal

REM Configuration
set SNIPPET_SRC=c:\GC\Weaver\app\Weaver.Fabrik\snippet
set PORTAL_DEST=c:\GC\GreyCloud_Vercel_FE\greycloud-platform-main\public\weaver
set TARGET_FILE=%PORTAL_DEST%\weaver-test.js

echo ============================================================
echo WEAVER INTELLIGENCE - SNIPPET UPDATE UTILITY
echo ============================================================

echo [1/3] Building Weaver UI Widget...
pushd %SNIPPET_SRC%
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Build failed.
    popd
    exit /b 1
)
popd

echo [2/3] Syncing Compiled Assets...
cmd /c copy "%SNIPPET_SRC%\dist\weaver.iife.js" "%PORTAL_DEST%\weaver.iife.js" /Y >nul
cmd /c copy "%SNIPPET_SRC%\dist\weaver.css" "%PORTAL_DEST%\weaver.css" /Y >nul

echo [3/3] Updating GreyCloud Orchestration Snippet...
echo // GreyCloud Weaver Integration Snippet - Auto-Generated > "%TARGET_FILE%"
echo // Target: Sandbox Environment >> "%TARGET_FILE%"
echo. >> "%TARGET_FILE%"
echo const WEAVER_CONFIG = { >> "%TARGET_FILE%"
echo     LIGHTRAG_API: "https://light-rag-sandbox.lemongrass-84d35018.westus2.azurecontainerapps.io", >> "%TARGET_FILE%"
echo     API_TOKEN: "your_api_token_here", >> "%TARGET_FILE%"
echo     DEBUG: true >> "%TARGET_FILE%"
echo }; >> "%TARGET_FILE%"
echo. >> "%TARGET_FILE%"
echo const weaverLog = (msg, data) ^=^> { >> "%TARGET_FILE%"
echo     if (WEAVER_CONFIG.DEBUG) { >> "%TARGET_FILE%"
echo         console.log(`[Weaver] ${msg}`, data ^|^| ""); >> "%TARGET_FILE%"
echo     } >> "%TARGET_FILE%"
echo }; >> "%TARGET_FILE%"
echo. >> "%TARGET_FILE%"
echo async function weaverIngest(text) { >> "%TARGET_FILE%"
echo     weaverLog("Ingesting text...", text.substring(0, 50) + "..."); >> "%TARGET_FILE%"
echo     const formData = new FormData(); >> "%TARGET_FILE%"
echo     formData.append('document_id', `gc-${Date.now()}`); >> "%TARGET_FILE%"
echo     formData.append('text', text); >> "%TARGET_FILE%"
echo     formData.append('collection', 'greycloud_main'); >> "%TARGET_FILE%"
echo     try { >> "%TARGET_FILE%"
echo         const response = await fetch(`${WEAVER_CONFIG.LIGHTRAG_API}/ingest_text`, { >> "%TARGET_FILE%"
echo             method: 'POST', >> "%TARGET_FILE%"
echo             headers: { 'Authorization': `Bearer ${WEAVER_CONFIG.API_TOKEN}` }, >> "%TARGET_FILE%"
echo             body: formData >> "%TARGET_FILE%"
echo         }); >> "%TARGET_FILE%"
echo         if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`); >> "%TARGET_FILE%"
echo         const result = await response.json(); >> "%TARGET_FILE%"
echo         weaverLog("Ingestion successful", result); >> "%TARGET_FILE%"
echo         return `^<OK^> Knowledge Base Updated (${result.chunks} chunks). \nID: ${result.document_id}`; >> "%TARGET_FILE%"
echo     } catch (err) { >> "%TARGET_FILE%"
echo         console.error("[Weaver] Ingestion Error:", err); >> "%TARGET_FILE%"
echo         return `^<X^> Ingestion failed: ${err.message}`; >> "%TARGET_FILE%"
echo     } >> "%TARGET_FILE%"
echo } >> "%TARGET_FILE%"
echo. >> "%TARGET_FILE%"
echo async function weaverQuery(question) { >> "%TARGET_FILE%"
echo     weaverLog("Querying RAG...", question); >> "%TARGET_FILE%"
echo     try { >> "%TARGET_FILE%"
echo         const response = await fetch(`${WEAVER_CONFIG.LIGHTRAG_API}/query`, { >> "%TARGET_FILE%"
echo             method: 'POST', >> "%TARGET_FILE%"
echo             headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${WEAVER_CONFIG.API_TOKEN}` }, >> "%TARGET_FILE%"
echo             body: JSON.stringify({ query: question, k: 3, collection: 'greycloud_main' }) >> "%TARGET_FILE%"
echo         }); >> "%TARGET_FILE%"
echo         if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`); >> "%TARGET_FILE%"
echo         const result = await response.json(); >> "%TARGET_FILE%"
echo         weaverLog("Query result received", { traceId: result.trace_id }); >> "%TARGET_FILE%"
echo         return { response: result.answer, metadata: { trace_id: result.trace_id, weaver_link: "http://localhost:3000/dashboard" } }; >> "%TARGET_FILE%"
echo     } catch (err) { >> "%TARGET_FILE%"
echo         console.error("[Weaver] Query Error:", err); >> "%TARGET_FILE%"
echo         return { response: `^<X^> RAG Query failed: ${err.message}` }; >> "%TARGET_FILE%"
echo     } >> "%TARGET_FILE%"
echo } >> "%TARGET_FILE%"
echo. >> "%TARGET_FILE%"
echo async function handleGreyCloudMessage(message) { >> "%TARGET_FILE%"
echo     if (!message ^|^| typeof message !== 'string') return; >> "%TARGET_FILE%"
echo     const cmd = message.trim(); >> "%TARGET_FILE%"
echo     if (cmd.toLowerCase().startsWith('ingest:')) { >> "%TARGET_FILE%"
echo         const content = cmd.substring(7).trim(); >> "%TARGET_FILE%"
echo         return { response: await weaverIngest(content) }; >> "%TARGET_FILE%"
echo     } >> "%TARGET_FILE%"
echo     return await weaverQuery(cmd); >> "%TARGET_FILE%"
echo } >> "%TARGET_FILE%"
echo. >> "%TARGET_FILE%"
echo if (typeof window !== 'undefined') { >> "%TARGET_FILE%"
echo     window.greyCloudHandler = handleGreyCloudMessage; >> "%TARGET_FILE%"
echo     console.log("%%c[Weaver Intelligence]%%c Snippet Loaded ^& Ready", "color: #6366f1; font-weight: bold", "color: inherit"); >> "%TARGET_FILE%"
echo } >> "%TARGET_FILE%"

echo ============================================================
echo SUCCESS: Weaver assets and snippet updated!
echo ============================================================
pause
