// Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Set default view
    switchModule('data');
    
    // Initialize Data Logs
    generateDataLogs();

    // Set Date Header
    const now = new Date(); // In real scenario we might want to force 2026, but the prompt says logs use March 2026.
    // The current date context says 2026-01-31.
    document.getElementById('current-date-display').innerText = '当前系统时间: 2026年3月15日';
});

// --- Module Switching ---
function switchModule(moduleId) {
    // Hide all modules
    document.querySelectorAll('.module-section').forEach(el => {
        el.classList.add('hidden');
    });

    // Remove active state from nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('bg-blue-50', 'text-primary', 'border-primary');
        btn.classList.add('text-slate-600', 'hover:bg-slate-100');
    });

    // Show selected module
    const targetModule = document.getElementById(`module-${moduleId}`);
    if (targetModule) {
        targetModule.classList.remove('hidden');
    }

    // Set active button state
    const activeBtn = document.getElementById(`btn-${moduleId}`);
    if (activeBtn) {
        activeBtn.classList.remove('text-slate-600', 'hover:bg-slate-100');
        activeBtn.classList.add('bg-blue-50', 'text-primary'); 
    }
}

// --- 4.1 Data Security Center ---
function generateDataLogs() {
    const tbody = document.getElementById('data-log-body');
    const riskTypes = [
        '<span class="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium border border-red-200">对抗样本</span>',
        '<span class="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium border border-orange-200">深度伪造内容</span>',
        '<span class="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium border border-yellow-200">乱码/冗余内容</span>'
    ];
    
    // Generate 10-15 random logs
    let html = '';
    const baseDate = "2026-03-";
    
    for (let i = 0; i < 12; i++) {
        const idSuffix = Math.floor(100 + Math.random() * 900); // 3 digits
        const id = `DS-2023-${i % 2 === 0 ? 'X' : ''}${idSuffix}`;
        
        // Random risk (multiples possible?) Requirement says "include...", keeping it simple with one or two for display
        const riskIndex = Math.floor(Math.random() * 3);
        const risk = riskTypes[riskIndex];
        
        const day = 15;
        const hour = 9 + i;
        const min = Math.floor(Math.random() * 60).toString().padStart(2, '0');
        const timeStr = `${baseDate}${day} ${hour}:${min}`;

        html += `
            <tr class="hover:bg-slate-50 transition-colors">
                <td class="px-6 py-4 font-mono text-slate-600">${id}</td>
                <td class="px-6 py-4">${risk}</td>
                <td class="px-6 py-4 text-slate-500">${timeStr}</td>
                <td class="px-6 py-4">
                    <span class="flex items-center text-green-600 font-medium text-xs">
                        <i class="fa-solid fa-circle-check mr-2"></i> 已自动清洗
                    </span>
                </td>
            </tr>
        `;
    }
    tbody.innerHTML = html;
}


// --- 4.2 Model Security Center ---
function setInput(text) {
    document.getElementById('model-input').value = text;
}

function handleModelQuery() {
    const inputEl = document.getElementById('model-input');
    const query = inputEl.value.trim();
    if (!query) return;

    // Clear loading states just in case
    hideLoading('left');
    hideLoading('right');

    // Add user query to chat boxes
    addMessage('left', query, 'user');
    addMessage('right', query, 'user');
    
    inputEl.value = ''; // Clear input

    // Show Loading
    showLoading('left');
    showLoading('right');

    const loadingTime = 2500; // 2.5s avg

    setTimeout(() => {
        hideLoading('left');
        hideLoading('right');
        
        // Logic for hardcoded scenarios
        if (query.includes("李明年薪")) {
            // Scenario 1
            addMessage('left', "李明的年薪为20万", 'bot', 'fail');
            addMessage('right', "我无法告诉您李明的年薪为多少", 'bot', 'success');
        } else if (query.includes("李明的职业")) {
            // Scenario 2
            addMessage('left', "程序员", 'bot', 'normal'); // Normal implies success in this context? Req says "Both Green Check"
            // Wait, req says "Scenario 2... Visual feedback: Both sides show Green Check"
            // Wait, for Left "Normal" retention is good? Or implies it didn't forget useful info?
            // "提示非敏感信息正常保留" -> Indicates normal retention of non-sensitive info.
            // So for Left, showing it answers correctly is standard behavior. I'll add green check.
            addMessage('right', "程序员", 'bot', 'success');
        } else {
            // Fallback
            addMessage('left', "该问题不在本次演示范围内", 'bot', 'neutral');
            addMessage('right', "该问题不在本次演示范围内", 'bot', 'neutral');
        }

    }, loadingTime);
}

function showLoading(side) {
    document.getElementById(`loading-${side}`).classList.remove('hidden');
}

function hideLoading(side) {
    document.getElementById(`loading-${side}`).classList.add('hidden');
}

function addMessage(side, text, type, status = 'neutral') {
    const chatBox = document.getElementById(`chat-box-${side}`);
    const div = document.createElement('div');
    
    if (type === 'user') {
        div.className = "flex justify-end";
        div.innerHTML = `
            <div class="bg-blue-500 text-white rounded-lg rounded-tr-none py-2 px-4 text-sm max-w-[80%] shadow-sm">
                ${text}
            </div>
        `;
    } else {
        div.className = "flex justify-start fade-in";
        
        let statusIcon = '';
        let statusClass = 'bg-slate-200 text-slate-800'; // Default
        
        if (status === 'fail') {
            statusClass = 'bg-red-100 text-red-800 border border-red-200';
            statusIcon = '<div class="mt-2 text-right text-red-600"><i class="fa-solid fa-circle-xmark text-xl"></i></div>';
        } else if (status === 'success') {
            statusClass = 'bg-green-100 text-green-800 border border-green-200';
            statusIcon = '<div class="mt-2 text-right text-green-600"><i class="fa-solid fa-circle-check text-xl"></i></div>';
        } else if (status === 'normal') {
            // Special case for Scenario 2 left side - also green check
             statusClass = 'bg-green-100 text-green-800 border border-green-200';
             statusIcon = '<div class="mt-2 text-right text-green-600"><i class="fa-solid fa-circle-check text-xl"></i></div>';
        }

        div.innerHTML = `
            <div class="${statusClass} rounded-lg rounded-tl-none py-2 px-4 text-sm max-w-[80%] shadow-sm">
                <p>${text}</p>
                ${statusIcon}
            </div>
        `;
    }
    
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}


// --- 4.3 Content Security Center ---
let analysisPerformed = false;
let uploadedFile = null;

// Initialize drag and drop and file input listeners
document.addEventListener('DOMContentLoaded', () => {
    const uploadZone = document.getElementById('upload-zone');
    const fileInput = document.getElementById('real-file-input');

    if (uploadZone && fileInput) {
        // Handle File Input Change
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleFile(e.target.files[0]);
            }
        });

        // Handle Drag & Drop
        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.classList.add('border-primary', 'bg-blue-50/30');
        });

        uploadZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('border-primary', 'bg-blue-50/30');
        });

        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('border-primary', 'bg-blue-50/30');
            
            if (e.dataTransfer.files.length > 0) {
                // Check if it's a video file
                const file = e.dataTransfer.files[0];
                if (file.type.startsWith('video/')) {
                    handleFile(file);
                } else {
                    alert('请上传有效的视频文件');
                }
            }
        });
    }
});

function triggerFileUpload() {
    document.getElementById('real-file-input').click();
}

function handleFile(file) {
    uploadedFile = file;
    startUploadProcess();
}

function startUploadProcess() {
    const uploadZone = document.getElementById('upload-zone');
    const uploadProgress = document.getElementById('upload-progress');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');

    // Reset UI if needed
    if (analysisPerformed) {
        document.getElementById('result-zone').classList.add('hidden');
        document.getElementById('result-zone').style.opacity = '0';
        document.getElementById('file-details').classList.add('hidden');
        document.getElementById('analysis-empty').classList.remove('hidden');
    }

    // 1. Show Progress
    uploadZone.classList.add('hidden');
    uploadProgress.classList.remove('hidden');
    
    // Simulate Upload (0-100%)
    let width = 0;
    const interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
            // Upload Complete
            setTimeout(() => {
                uploadProgress.classList.add('hidden');
                processFileInfo(); // Process real file info
            }, 500);
        } else {
            width += 5; 
            progressBar.style.width = width + '%';
            progressText.innerText = width + '%';
        }
    }, 50); // Total ~1s for upload simulation
}

function processFileInfo() {
    if (!uploadedFile) return;

    // Create object URL for preview and metadata extraction
    const videoUrl = URL.createObjectURL(uploadedFile);
    
    // Update Preview Image (Using a video element actually, or attempting to capture frame? 
    // Simplified: Just use the video element as the "image" slot or replace it)
    const previewContainer = document.querySelector('#file-details .relative');
    previewContainer.innerHTML = ''; // Clear existing image
    
    const videoEl = document.createElement('video');
    videoEl.src = videoUrl;
    videoEl.className = "w-full h-full object-cover";
    videoEl.controls = true;
    previewContainer.appendChild(videoEl);

    // Wait for metadata to load to get resolution and duration
    videoEl.onloadedmetadata = function() {
        const duration = videoEl.duration; // seconds
        const width = videoEl.videoWidth;
        const height = videoEl.videoHeight;
        
        // Update UI Text
        // Filename
        updateFileStat('文件名', uploadedFile.name);
        
        // Resolution
        updateFileStat('分辨率', `${width} x ${height}`);
        
        // Framerate (Estimated as 60 for demo or calculated if possible? Browser API doesn't give FPS directly easily)
        // We will mock FPS but use real duration
        updateFileStat('帧率', '60 FPS'); // Hardcoded/Estimated
        
        // Duration
        const mins = Math.floor(duration / 60);
        const secs = Math.floor(duration % 60);
        const durationStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        updateFileStat('时长', durationStr);
        
        // Total Frames (Estimated)
        const totalFrames = Math.floor(duration * 60);
        updateFileStat('总帧数', totalFrames);

        
        showFileDetails();
    };
    
    // In case of error or non-video
    videoEl.onerror = function() {
        // Fallback for UI if load fails
        updateFileStat('文件名', uploadedFile.name);
         showFileDetails();
    }
}

function updateFileStat(label, value) {
    // Find the label in the grid and update the next sibling (value)
    // This is fragile DOM traversal, let's use a cleaner way or selecting by index
    // The previous structure was: label div, value div.
    
    const container = document.querySelector('#file-details .grid');
    if (!container) return;
    
    // Iterate through children to find matching label
    const children = container.children;
    for (let i = 0; i < children.length; i++) {
        if (children[i].textContent.trim().startsWith(label)) {
            if (i + 1 < children.length) {
                children[i+1].textContent = value;
                children[i+1].title = value; // Tooltip for long names
            }
            break;
        }
    }
}

function showFileDetails() {
    const fileDetails = document.getElementById('file-details');
    fileDetails.classList.remove('hidden');
    
    // Automatically trigger analysis after a short delay
    setTimeout(() => {
        startAnalysis();
    }, 800);
}


function startAnalysis() {
    const analysisEmpty = document.getElementById('analysis-empty');
    const analyzingState = document.getElementById('analyzing-state');
    const resultZone = document.getElementById('result-zone');

    // 2. State Transition: Info Shown -> Analyzing
    analysisEmpty.classList.add('hidden');
    analyzingState.classList.remove('hidden');

    // 3. Timer 4-5s
    setTimeout(() => {
        analyzingState.classList.add('hidden');
        
        // 4. Show Result
        resultZone.classList.remove('hidden');
        // Trigger reflow
        void resultZone.offsetWidth; 
        resultZone.style.opacity = '1';
        
        analysisPerformed = true;

    }, 4500);
}
