document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggling
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const htmlElement = document.documentElement;
    
    if (themeToggleBtn && htmlElement) {
        const sunIcon = themeToggleBtn.querySelector('.fa-sun');
        const moonIcon = themeToggleBtn.querySelector('.fa-moon');

        const applyTheme = (theme) => {
            if (theme === 'dark') {
                htmlElement.classList.add('dark');
                if (sunIcon) sunIcon.classList.add('hidden');
                if (moonIcon) moonIcon.classList.remove('hidden');
            } else {
                htmlElement.classList.remove('dark');
                if (sunIcon) sunIcon.classList.remove('hidden');
                if (moonIcon) moonIcon.classList.add('hidden');
            }
        };

        let currentTheme = localStorage.getItem('theme');
        if (!currentTheme) {
            currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        applyTheme(currentTheme);

        themeToggleBtn.addEventListener('click', () => {
            const newTheme = htmlElement.classList.contains('dark') ? 'light' : 'dark';
            localStorage.setItem('theme', newTheme);
            applyTheme(newTheme);
        });
    }

    // Adjust main content padding based on header height
    const appHeader = document.getElementById('appHeader');
    const mainContent = document.getElementById('mainContent');
    if (appHeader && mainContent) {
        const headerHeight = appHeader.offsetHeight;
        mainContent.style.paddingTop = `${headerHeight}px`;
        // Also set chat interface height dynamically
        const chatInterface = document.getElementById('chatInterface');
        if (chatInterface) {
            chatInterface.style.height = `calc(100vh - ${headerHeight}px)`;
        }
    }

    // QueryInput Component Logic
    const queryForm = document.getElementById('queryForm');
    const queryInput = document.getElementById('queryInput');
    const sendButton = document.getElementById('sendButton');
    const micButton = document.getElementById('micButton');
    const sttModelSelect = document.getElementById('sttModelSelect');
    const languageSelect = document.getElementById('languageSelect');

    if (queryInput && sendButton) {
        queryInput.addEventListener('input', () => {
            sendButton.disabled = queryInput.value.trim() === '';
        });
    }

    if (queryInput) {
        queryInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                if (sendButton && !sendButton.disabled) {
                    queryForm.requestSubmit();
                }
            }
        });
    }
    
    if (queryForm) {
        queryForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const queryText = queryInput.value.trim();
            if (queryText) {
                console.log('Query Submitted:', {
                    text: queryText,
                    sttModel: sttModelSelect ? sttModelSelect.value : 'N/A',
                    language: languageSelect ? languageSelect.value : 'N/A'
                });
                // Call function to add user message to chat (will be defined in next step)
                // window.addMessageToChat(queryText, 'user');

                queryInput.value = '';
                if (sendButton) sendButton.disabled = true;

                // Placeholder: Simulate bot response flow
                // window.showBotLoadingMessage();
                // setTimeout(() => {
                //     window.showBotConfirmationMessage("SELECT * FROM FIR WHERE district='Guntur';", "Here is the generated SQL query...");
                // }, 1500);
            }
        });
    }

    if (micButton) {
        micButton.addEventListener('click', () => {
            console.log('Mic button clicked');
            const isListening = micButton.classList.toggle('pulsing');
            micButton.classList.toggle('bg-blue-600', !isListening);
            micButton.classList.toggle('dark:bg-blue-500', !isListening);
            micButton.classList.toggle('bg-red-500', isListening);
            micButton.classList.toggle('dark:bg-red-500', isListening);

            if (queryInput) {
                if (isListening) {
                    queryInput.placeholder = "Listening...";
                    // TODO: Implement actual STT start
                    console.log("STT Started (placeholder)");
                    // Simulate speech not detected for error handling demo
                    // setTimeout(() => {
                    //     if(micButton.classList.contains('pulsing')) { // check if still listening
                    //         queryInput.placeholder = "I didn't hear anything. Please try again.";
                    //         micButton.classList.remove('pulsing', 'bg-red-500', 'dark:bg-red-500');
                    //         micButton.classList.add('bg-blue-600', 'dark:bg-blue-500');
                    //         setTimeout(() => { queryInput.placeholder = "Type your query or use the microphone..."; }, 3000);
                    //     }
                    // }, 5000); // 5s timeout for STT
                } else {
                    queryInput.placeholder = "Type your query or use the microphone...";
                    // TODO: Implement actual STT stop
                    console.log("STT Stopped (placeholder)");
                }
            }
        });
    }
    
    // Initial greeting message will be handled by MessageBubble logic in the next step.
    console.log("QueryInput component initialized.");

    // --- MessageBubble Component Logic ---
    const messageHistory = document.getElementById('messageHistory');
    let messageIdCounter = 0;

    function createMessageId() {
        return `msg-${Date.now()}-${messageIdCounter++}`;
    }

    function escapeHTML(str) {
        const p = document.createElement('p');
        p.appendChild(document.createTextNode(str));
        return p.innerHTML;
    }

    function addMessageToChat(content, type = 'bot', options = {}) {
        if (!messageHistory) return;

        const messageId = options.id || createMessageId();
        let messageBubbleHTML = '';

        const commonBubbleClasses = "p-3 rounded-lg shadow max-w-xl text-sm"; // Common styling for the bubble content

        if (type === 'user') {
            messageBubbleHTML = `
                <div id="${messageId}" class="flex justify-end items-start space-x-3">
                    <div class="order-1 bg-blue-600 text-white ${commonBubbleClasses}">
                        <p>${escapeHTML(content)}</p>
                    </div>
                    <span class="flex-shrink-0 h-8 w-8 rounded-full bg-green-500 text-white flex items-center justify-center order-2">
                        <i class="fas fa-user"></i>
                    </span>
                </div>`;
        } else if (type === 'bot') {
            let botContentHTML = `<p>${escapeHTML(content)}</p>`;
            if (options.htmlContent) {
                botContentHTML = content; // Assume HTML content is already safe or will be handled carefully
            }

            messageBubbleHTML = `
                <div id="${messageId}" class="flex items-start space-x-3">
                    <span class="flex-shrink-0 h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                        <i class="fas fa-robot"></i>
                    </span>
                    <div class="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${commonBubbleClasses}">
                        ${botContentHTML}
                    </div>
                </div>`;
        } else if (type === 'loading') {
            messageBubbleHTML = `
                <div id="${messageId}" class="flex items-start space-x-3">
                    <span class="flex-shrink-0 h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                        <i class="fas fa-robot"></i>
                    </span>
                    <div class="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${commonBubbleClasses} flex items-center space-x-2">
                        <i class="fas fa-spinner fa-spin"></i>
                        <span>${escapeHTML(content)}</span>
                    </div>
                </div>`;
        } else if (type === 'confirmation') {
            // options should include: introText, sqlQuery
            messageBubbleHTML = `
                <div id="${messageId}" class="flex items-start space-x-3">
                    <span class="flex-shrink-0 h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                        <i class="fas fa-robot"></i>
                    </span>
                    <div class="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${commonBubbleClasses} w-full">
                        <p class="mb-2">${escapeHTML(options.introText)}</p>
                        <pre class="bg-gray-100 dark:bg-gray-800 p-2 rounded text-green-600 dark:text-green-400 text-xs overflow-x-auto">${escapeHTML(options.sqlQuery)}</pre>
                        <div class="mt-3 flex space-x-2">
                            <button class="confirm-run-btn text-xs bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded-md" data-message-id="${messageId}">Confirm & Run</button>
                            <button class="cancel-btn text-xs bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 py-1 px-3 rounded-md" data-message-id="${messageId}">Cancel</button>
                        </div>
                    </div>
                </div>`;
        }
        // Note: 'Complete State (with Results)' will be handled by updating a bot message or adding a new one with options.htmlContent containing ResultsDisplay

        messageHistory.insertAdjacentHTML('beforeend', messageBubbleHTML);
        scrollToBottom();

        // Add event listeners for confirmation buttons
        if (type === 'confirmation') {
            const confirmButton = messageHistory.querySelector(`#${messageId} .confirm-run-btn`);
            const cancelButton = messageHistory.querySelector(`#${messageId} .cancel-btn`);
            if (confirmButton) {
                confirmButton.addEventListener('click', () => handleConfirmation(messageId, options.sqlQuery, true));
            }
            if (cancelButton) {
                cancelButton.addEventListener('click', () => handleConfirmation(messageId, options.sqlQuery, false));
            }
        }
        return messageId;
    }
    
    window.addMessageToChat = addMessageToChat; // Expose globally for now

    function updateMessageContent(messageId, newContent, newType = 'bot') {
        const messageElement = document.getElementById(messageId);
        if (!messageElement) return;

        // Simplified update: replace the content part of the bubble
        // More sophisticated update might be needed depending on structure
        const contentDiv = messageElement.querySelector('div > div'); // Assumes bot/user structure
        if (contentDiv) {
            if (newType === 'loading') {
                 contentDiv.innerHTML = `<div class="flex items-center space-x-2"><i class="fas fa-spinner fa-spin"></i><span>${escapeHTML(newContent)}</span></div>`;
            } else {
                 contentDiv.innerHTML = `<p>${escapeHTML(newContent)}</p>`;
            }
        }
        scrollToBottom();
    }
    window.updateMessageContent = updateMessageContent;

    // --- ResultsDisplay Component Logic ---
    function createResultsDisplayHTML(reportTitle, uniqueId, sqlQuery, summaryText, chartData, tableData) {
        // Determine default active tab and disabled states
        const hasChart = chartData && chartData.length > 0;
        const hasTable = tableData && tableData.length > 0;
        const hasSummary = summaryText && summaryText.trim() !== '';
        const hasSql = sqlQuery && sqlQuery.trim() !== '';

        let defaultActiveTab = '';
        if (hasChart) defaultActiveTab = 'Chart';
        else if (hasTable) defaultActiveTab = 'Table';
        else if (hasSummary) defaultActiveTab = 'Summary';
        else if (hasSql) defaultActiveTab = 'SQL';

        return `
            <div id="resultsDisplay-${uniqueId}" class="results-display-card bg-white dark:bg-gray-750 shadow-md rounded-lg overflow-hidden my-2 border border-gray-200 dark:border-gray-700 w-full">
                <div class="results-header p-3 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center">
                    <h3 class="report-title-text text-sm font-semibold text-gray-800 dark:text-gray-200">${escapeHTML(reportTitle)}</h3>
                    <input type="text" class="report-title-input hidden text-sm font-semibold bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 p-1 rounded w-full" value="${escapeHTML(reportTitle)}">
                    <button class="edit-title-btn ml-2 p-1 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">
                        <i class="fas fa-pencil-alt text-xs"></i>
                    </button>
                </div>
                <div class="results-tabs p-2 border-b border-gray-200 dark:border-gray-600 flex space-x-1">
                    <button data-tab="Chart" class="tab-btn text-xs px-3 py-1 rounded-md ${defaultActiveTab === 'Chart' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500'}" ${!hasChart ? 'disabled' : ''}>Chart</button>
                    <button data-tab="Table" class="tab-btn text-xs px-3 py-1 rounded-md ${defaultActiveTab === 'Table' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500'}" ${!hasTable ? 'disabled' : ''}>Table</button>
                    <button data-tab="Summary" class="tab-btn text-xs px-3 py-1 rounded-md ${defaultActiveTab === 'Summary' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500'}" ${!hasSummary ? 'disabled' : ''}>Summary</button>
                    <button data-tab="SQL" class="tab-btn text-xs px-3 py-1 rounded-md ${defaultActiveTab === 'SQL' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500'}" ${!hasSql ? 'disabled' : ''}>SQL</button>
                </div>
                <div class="results-content p-3 text-xs min-h-[100px]">
                    <div class="tab-content ${defaultActiveTab === 'Chart' ? '' : 'hidden'}" data-tab-content="Chart">
                        <div class="data-chart-placeholder text-center text-gray-500 dark:text-gray-400">${hasChart ? `Chart for ${escapeHTML(reportTitle)} will be here.` : 'Chart data not available.'}</div>
                    </div>
                    <div class="tab-content ${defaultActiveTab === 'Table' ? '' : 'hidden'}" data-tab-content="Table">
                        <div class="data-table-placeholder text-center text-gray-500 dark:text-gray-400">${hasTable ? `Table for ${escapeHTML(reportTitle)} will be here.` : 'Table data not available.'}</div>
                    </div>
                    <div class="tab-content ${defaultActiveTab === 'Summary' ? '' : 'hidden'}" data-tab-content="Summary">
                        <p class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">${hasSummary ? escapeHTML(summaryText) : 'Summary not available.'}</p>
                    </div>
                    <div class="tab-content ${defaultActiveTab === 'SQL' ? '' : 'hidden'}" data-tab-content="SQL">
                        <pre class="bg-gray-100 dark:bg-gray-800 p-2 rounded text-green-600 dark:text-green-400 overflow-x-auto">${hasSql ? escapeHTML(sqlQuery) : 'SQL query not available.'}</pre>
                    </div>
                </div>
            </div>
        `;
    }
    window.createResultsDisplayHTML = createResultsDisplayHTML;

    function initializeResultsDisplayEventListeners(resultsDisplayElement) {
        const titleText = resultsDisplayElement.querySelector('.report-title-text');
        const titleInput = resultsDisplayElement.querySelector('.report-title-input');
        const editBtn = resultsDisplayElement.querySelector('.edit-title-btn');

        editBtn.addEventListener('click', () => {
            titleText.classList.add('hidden');
            titleInput.classList.remove('hidden');
            titleInput.focus();
            titleInput.select();
        });

        const saveTitle = () => {
            const newTitle = titleInput.value.trim();
            if (newTitle) {
                titleText.textContent = newTitle;
                // Potentially save this newTitle somewhere if persistence is needed
                console.log("Report title changed to:", newTitle);
            }
            titleText.classList.remove('hidden');
            titleInput.classList.add('hidden');
        };
        titleInput.addEventListener('blur', saveTitle);
        titleInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') saveTitle();
            if (e.key === 'Escape') { // Revert on Escape
                titleInput.value = titleText.textContent;
                saveTitle();
            }
        });

        const tabs = resultsDisplayElement.querySelectorAll('.tab-btn');
        const tabContents = resultsDisplayElement.querySelectorAll('.tab-content');

        tabs.forEach(tab => {
            if (tab.disabled) {
                tab.classList.add('opacity-50', 'cursor-not-allowed');
            }
            tab.addEventListener('click', () => {
                if (tab.disabled) return;

                tabs.forEach(t => t.classList.remove('bg-blue-500', 'text-white'));
                tabs.forEach(t => t.classList.add('bg-gray-100', 'dark:bg-gray-600', 'hover:bg-gray-200', 'dark:hover:bg-gray-500'));

                tab.classList.remove('bg-gray-100', 'dark:bg-gray-600', 'hover:bg-gray-200', 'dark:hover:bg-gray-500');
                tab.classList.add('bg-blue-500', 'text-white');

                const targetTabContent = tab.dataset.tab;
                tabContents.forEach(content => {
                    if (content.dataset.tabContent === targetTabContent) {
                        content.classList.remove('hidden');
                    } else {
                        content.classList.add('hidden');
                    }
                });
            });
        });
    }
    window.initializeResultsDisplayEventListeners = initializeResultsDisplayEventListeners;

    function renderChart(placeholderElement, chartData, reportTitle) {
        if (!placeholderElement || !chartData || chartData.length === 0) {
            if(placeholderElement) placeholderElement.innerHTML = '<p class="text-center text-gray-500 dark:text-gray-400">Chart data not available or empty.</p>';
            return;
        }
        // Actual Recharts rendering would go here.
        // For now, a more descriptive placeholder.
        placeholderElement.innerHTML = `
            <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 class="text-sm font-semibold mb-2 text-center text-gray-700 dark:text-gray-300">Chart: ${escapeHTML(reportTitle)}</h4>
                <div class="w-full h-64 border border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
                    <p class="text-gray-400 dark:text-gray-500 text-xs">Recharts chart would be rendered here for: <br/> ${JSON.stringify(chartData)}</p>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center"> (Chart legend and tooltips would appear here) </p>
            </div>`;
    }
    window.renderChart = renderChart;

    function renderTable(placeholderElement, tableData, reportTitle) {
        if (!placeholderElement || !tableData || tableData.length === 0) {
             if(placeholderElement) placeholderElement.innerHTML = '<p class="text-center text-gray-500 dark:text-gray-400">Table data not available or empty.</p>';
            return;
        }

        const headers = Object.keys(tableData[0]);
        let tableHTML = `
            <div class="overflow-x-auto max-h-72 shadow border-b border-gray-200 dark:border-gray-700 rounded-lg">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead class="bg-gray-50 dark:bg-gray-800 sticky top-0 z-5">
                        <tr>`;
        headers.forEach(header => {
            tableHTML += `<th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">${escapeHTML(header.replace(/_/g, ' '))}</th>`;
        });
        tableHTML += `
                        </tr>
                    </thead>
                    <tbody class="bg-white dark:bg-gray-750 divide-y divide-gray-200 dark:divide-gray-600">`;
        tableData.forEach(row => {
            tableHTML += '<tr>';
            headers.forEach(header => {
                tableHTML += `<td class="px-4 py-2 whitespace-nowrap text-xs text-gray-700 dark:text-gray-200">${escapeHTML(String(row[header]))}</td>`;
            });
            tableHTML += '</tr>';
        });
        tableHTML += `
                    </tbody>
                </table>
            </div>`;
        placeholderElement.innerHTML = tableHTML;
    }
    window.renderTable = renderTable;
    // --- End of ResultsDisplay Component Logic ---

    function handleConfirmation(messageId, sqlQuery, isConfirmed) {
        console.log(`Confirmation for message ${messageId}, SQL: ${sqlQuery}, Confirmed: ${isConfirmed}`);
        const messageElement = document.getElementById(messageId);
        const contentDiv = messageElement ? messageElement.querySelector('div > div') : null;

        if (!contentDiv) {
            console.error("Could not find message content div for ID:", messageId);
            return;
        }

        if (isConfirmed) {
            // User confirmed, proceed with SQL execution
            contentDiv.innerHTML = `<div class="flex items-center space-x-2"><i class="fas fa-spinner fa-spin"></i><span>Confirmed. Executing SQL...</span></div>`;
            scrollToBottom();

            // Placeholder: Simulate SQL execution and results
            setTimeout(() => {
                const reportTitle = "FIRs from Guntur Report";
                const summaryText = "Total 15 FIRs found in Guntur district for the specified period. Most common crime type was 'Theft'.";
                // Actual chartData and tableData would come from backend
                const exampleChartData = [{name: 'Theft', value: 8}, {name: 'Assault', value: 4}, {name: 'Other', value: 3}];
                const exampleTableData = [
                    {fir_id: 101, crime_type: 'Theft', date: '2023-01-05'},
                    {fir_id: 102, crime_type: 'Assault', date: '2023-01-08'},
                ];

                const resultsDisplayHTML = createResultsDisplayHTML(reportTitle, messageId, sqlQuery, summaryText, exampleChartData, exampleTableData);

                // Replace the loading content with the results display
                contentDiv.innerHTML = `<p>SQL executed successfully!</p>${resultsDisplayHTML}`;
                const resultsDisplayElement = contentDiv.querySelector(`#resultsDisplay-${messageId}`);
                if (resultsDisplayElement) {
                    initializeResultsDisplayEventListeners(resultsDisplayElement);
                    // Render actual chart and table placeholders
                    const chartPlaceholder = resultsDisplayElement.querySelector('.data-chart-placeholder');
                    const tablePlaceholder = resultsDisplayElement.querySelector('.data-table-placeholder');
                    if (hasChart && chartPlaceholder) {
                        renderChart(chartPlaceholder, exampleChartData, reportTitle);
                    }
                    if (hasTable && tablePlaceholder) {
                        renderTable(tablePlaceholder, exampleTableData, reportTitle);
                    }
                }
                scrollToBottom();
            }, 2000);
        } else {
            // User cancelled
            updateMessageContent(messageId, "Operation cancelled by user.");
        }
        // Disable buttons after action
        const confirmButton = messageHistory.querySelector(`#${messageId} .confirm-run-btn`);
        const cancelButton = messageHistory.querySelector(`#${messageId} .cancel-btn`);
        if (confirmButton) confirmButton.disabled = true;
        if (cancelButton) cancelButton.disabled = true;
    }


    function scrollToBottom() {
        if (messageHistory) {
            messageHistory.scrollTop = messageHistory.scrollHeight;
        }
    }

    // Modify form submission to use the new message functions
    if (queryForm) {
        queryForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const queryText = queryInput.value.trim();
            if (queryText) {
                addMessageToChat(queryText, 'user');

                queryInput.value = '';
                if (sendButton) sendButton.disabled = true;

                // Simulate bot response flow
                const loadingMsgId = addMessageToChat("Generating SQL...", 'loading');
                setTimeout(() => {
                    // Replace loading with confirmation
                    const botIntro = "Here is the generated SQL query. Please review and confirm to run:";
                    const exampleSQL = `SELECT fir_id, crime_type_id, incident_date \nFROM FIR \nWHERE district_id = (SELECT district_id FROM DISTRICT_MASTER WHERE district_name = 'Guntur') \nAND incident_date >= TO_DATE('2023-01-01', 'YYYY-MM-DD');`;

                    // For confirmation, we need to remove the old loading message and add a new confirmation one
                    // Or, more robustly, update the content of the loading message to become a confirmation message.
                    // For simplicity here, let's assume we are replacing it by ID.
                    // However, the current addMessageToChat appends. So, we'd need a removeMessageById or updateMessage.
                    // Let's use update for the loading message's content to become the confirmation.
                    // This requires `addMessageToChat` to return the ID, and an `updateMessage` function.
                    // For now, let's just add a new confirmation message after removing loading.
                    const loadingElement = document.getElementById(loadingMsgId);
                    if (loadingElement) loadingElement.remove();

                    addMessageToChat(null, 'confirmation', { introText: botIntro, sqlQuery: exampleSQL });

                }, 2000);
            }
        });
    }

    // Add initial greeting message
    function showInitialGreeting() {
        const greetingText = `Welcome to the CCTNS Copilot Engine! How can I assist you today? Try asking:
            <ul class="list-disc list-inside mt-1 text-xs">
                <li>"Show total crimes in Guntur district"</li>
                <li>"గుంటూర్ జిల్లాలో మొత్తం నేరాలు చూపించు"</li>
                <li>"गुंटूर जिले में कुल अपराध दिखाएं"</li>
            </ul>`;
        addMessageToChat(greetingText, 'bot', { htmlContent: true });
    }

    showInitialGreeting();
    // --- End of MessageBubble Component Logic ---
});
