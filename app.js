/**
 * APLIKASI SIMULASI LATIHAN UJI KOMPETENSI (CBT)
 * Fitur:
 * - Pengelolaan Bank Soal Dinamis (Formulir, Paste Teks Cepat, Edit, Hapus, Backup/Restore)
 * - Pengerjaan Kuis Interaktif dengan Navigasi Soal Dinamis
 * - Koreksi Jawaban Instan (Real-Time Feedback) saat Submit
 * - Penyorotan Kunci Jawaban yang Benar dan Pembahasan Lengkap
 * - Rekapitulasi Skor & Pembahasan Detail
 */

// ==========================================
// STATE APLIKASI
// ==========================================
const AppState = {
  userName: '',
  questions: [],
  currentIndex: 0,
  userAnswers: [], // Array of { selectedOption: number|null, isSubmitted: boolean, isCorrect: boolean }
  soundEnabled: true,
  audioCtx: null,
  editingQuestionId: null // null jika sedang tambah baru, atau ID soal jika sedang edit
};

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

// ==========================================
// INISIALISASI
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initQuestionsData();
  bindEvents();
  checkPersistedUser();
  updateQuestionCounters();
});

function initQuestionsData() {
  const savedCustom = localStorage.getItem('custom_ujikom_questions');
  if (savedCustom) {
    try {
      const parsed = JSON.parse(savedCustom);
      if (Array.isArray(parsed) && parsed.length > 0) {
        AppState.questions = parsed;
        return;
      }
    } catch (e) {
      console.warn("Gagal parse saved questions, gunakan default:", e);
    }
  }

  // Gunakan data dari questions.js jika ada
  if (typeof questionsData !== 'undefined' && Array.isArray(questionsData) && questionsData.length > 0) {
    AppState.questions = JSON.parse(JSON.stringify(questionsData));
  } else {
    AppState.questions = generateFallbackQuestions();
  }
}

function checkPersistedUser() {
  const savedName = localStorage.getItem('ujikom_user_name');
  if (savedName) {
    const input = document.getElementById('input-user-name');
    if (input) input.value = savedName;
  }
}

function updateQuestionCounters() {
  const count = AppState.questions.length;
  
  const badgeWelcome = document.getElementById('welcome-question-count-badge');
  if (badgeWelcome) {
    badgeWelcome.textContent = `${count} Soal Tersedia`;
  }

  const badgeTab = document.getElementById('manage-tab-count');
  if (badgeTab) {
    badgeTab.textContent = count;
  }

  const badgeList = document.getElementById('list-total-badge');
  if (badgeList) {
    badgeList.textContent = count;
  }
}

function saveQuestionsToStorage() {
  localStorage.setItem('custom_ujikom_questions', JSON.stringify(AppState.questions));
  updateQuestionCounters();
}

// ==========================================
// WEB AUDIO SYNTHESIZER (SOUND EFFECTS)
// ==========================================
function playTone(freqs, type = 'sine', duration = 0.15) {
  if (!AppState.soundEnabled) return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AppState.audioCtx) {
      AppState.audioCtx = new AudioContext();
    }
    if (AppState.audioCtx.state === 'suspended') {
      AppState.audioCtx.resume();
    }

    const now = AppState.audioCtx.currentTime;
    freqs.forEach((freq, idx) => {
      const osc = AppState.audioCtx.createOscillator();
      const gain = AppState.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);

      gain.gain.setValueAtTime(0.12, now + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + duration);

      osc.connect(gain);
      gain.connect(AppState.audioCtx.destination);

      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + duration);
    });
  } catch (err) {
    console.log("Audio notice:", err);
  }
}

function playSound(action) {
  if (action === 'correct') {
    playTone([523.25, 659.25, 783.99], 'triangle', 0.18);
  } else if (action === 'wrong') {
    playTone([240, 200], 'sawtooth', 0.22);
  } else if (action === 'click') {
    playTone([800], 'sine', 0.05);
  }
}

// ==========================================
// EVENT LISTENERS UTAMA
// ==========================================
function bindEvents() {
  // Form Mulai Kuis
  const formStart = document.getElementById('form-start-quiz');
  formStart.addEventListener('submit', (e) => {
    e.preventDefault();
    handleStartQuiz();
  });

  // Sound Toggle
  document.getElementById('btn-sound-toggle').addEventListener('click', () => {
    AppState.soundEnabled = !AppState.soundEnabled;
    document.getElementById('sound-icon').textContent = AppState.soundEnabled ? '🔊' : '🔇';
    document.getElementById('sound-text').textContent = AppState.soundEnabled ? 'Suara: Nyala' : 'Suara: Mati';
  });

  // Buka Modal Kelola Soal dari Header & Layar Welcome
  document.getElementById('btn-open-manage').addEventListener('click', () => openManageModal());
  const btnWelcomeManage = document.getElementById('btn-welcome-manage-soal');
  if (btnWelcomeManage) {
    btnWelcomeManage.addEventListener('click', () => openManageModal());
  }

  // Tutup Modal Kelola Soal
  document.getElementById('btn-close-modal').addEventListener('click', () => closeManageModal());
  document.getElementById('btn-finish-manage').addEventListener('click', () => closeManageModal());

  // Tabs Modal Kelola Soal
  setupModalTabs();

  // Tab 1: Form Tambah/Edit Soal
  document.getElementById('btn-save-form-question').addEventListener('click', handleSaveFormQuestion);
  document.getElementById('btn-cancel-edit-mode').addEventListener('click', resetFormToCreateMode);

  // Tab 2: Bulk Paste Text
  document.getElementById('btn-insert-sample-text').addEventListener('click', insertSampleBulkText);
  document.getElementById('btn-process-append-bulk').addEventListener('click', () => handleProcessBulk(false));
  document.getElementById('btn-process-replace-bulk').addEventListener('click', () => handleProcessBulk(true));

  // Tab 3: List & Actions
  document.getElementById('btn-list-add-new').addEventListener('click', () => {
    resetFormToCreateMode();
    switchManageTab('form');
  });
  document.getElementById('btn-clear-all-questions').addEventListener('click', handleClearAllQuestions);
  document.getElementById('btn-reset-default-sample').addEventListener('click', handleResetDefaultQuestions);
  document.getElementById('btn-download-backup').addEventListener('click', downloadBackupJSON);
  document.getElementById('file-input-backup').addEventListener('change', uploadBackupJSON);

  // Tab 4: Raw JSON Save
  document.getElementById('btn-save-json-soal').addEventListener('click', handleSaveRawJSON);

  // Tombol Kuis
  document.getElementById('btn-submit-answer').addEventListener('click', handleSubmitAnswer);
  document.getElementById('btn-prev-question').addEventListener('click', () => {
    if (AppState.currentIndex > 0) loadQuestion(AppState.currentIndex - 1);
  });
  document.getElementById('btn-next-question').addEventListener('click', () => {
    if (AppState.currentIndex < AppState.questions.length - 1) {
      loadQuestion(AppState.currentIndex + 1);
    } else {
      confirmFinishQuiz();
    }
  });
  document.getElementById('btn-finish-quiz-nav').addEventListener('click', confirmFinishQuiz);

  // Layar Hasil Akhir
  document.getElementById('btn-restart-quiz').addEventListener('click', restartQuizSameUser);
  document.getElementById('btn-change-user').addEventListener('click', changeUser);
  document.getElementById('btn-print-results').addEventListener('click', () => window.print());
}

// ==========================================
// LOGIKA MODAL KELOLA SOAL DINAMIS & TABS
// ==========================================
function setupModalTabs() {
  const tabs = [
    { btn: 'tab-btn-form', content: 'tab-content-form' },
    { btn: 'tab-btn-paste', content: 'tab-content-paste' },
    { btn: 'tab-btn-list', content: 'tab-content-list' },
    { btn: 'tab-btn-json', content: 'tab-content-json' }
  ];

  tabs.forEach(t => {
    const btnEl = document.getElementById(t.btn);
    if (!btnEl) return;
    btnEl.addEventListener('click', () => {
      switchManageTab(t.content.replace('tab-content-', ''));
    });
  });
}

function switchManageTab(tabName) {
  const tabNames = ['form', 'paste', 'list', 'json'];

  tabNames.forEach(name => {
    const btn = document.getElementById(`tab-btn-${name}`);
    const content = document.getElementById(`tab-content-${name}`);

    if (name === tabName) {
      btn.className = 'tab-btn active px-3.5 py-2 rounded-lg border-b-2 border-blue-600 text-blue-600 bg-blue-50/50 flex items-center gap-1.5';
      content.classList.remove('hidden');
    } else {
      btn.className = 'tab-btn px-3.5 py-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition flex items-center gap-1.5';
      content.classList.add('hidden');
    }
  });

  // Jika membuka tab list, refresh tampilan list
  if (tabName === 'list') {
    renderManageQuestionsList();
  } else if (tabName === 'json') {
    document.getElementById('textarea-json-soal').value = JSON.stringify(AppState.questions, null, 2);
  }
}

function openManageModal() {
  updateQuestionCounters();
  renderManageQuestionsList();
  document.getElementById('modal-manage').classList.remove('hidden');
}

function closeManageModal() {
  document.getElementById('modal-manage').classList.add('hidden');
  updateQuestionCounters();

  // Jika sedang aktif di kuis, sesuaikan navigasi
  if (!document.getElementById('screen-quiz').classList.contains('hidden')) {
    if (AppState.questions.length === 0) {
      alert("Bank soal kosong! Mengalihkan ke halaman awal.");
      changeUser();
    } else {
      restartQuizSameUser();
    }
  }
}

// ==========================================
// TAB 1: FORM TAMBAH & EDIT SOAL DINAMIS
// ==========================================
function handleSaveFormQuestion() {
  const qText = document.getElementById('form-q-text').value.trim();
  const opt0 = document.getElementById('form-opt-0').value.trim();
  const opt1 = document.getElementById('form-opt-1').value.trim();
  const opt2 = document.getElementById('form-opt-2').value.trim();
  const opt3 = document.getElementById('form-opt-3').value.trim();
  const opt4 = document.getElementById('form-opt-4').value.trim();
  const explanation = document.getElementById('form-q-explanation').value.trim();

  // Radio kunci jawaban
  const correctRadio = document.querySelector('input[name="form-correct-key"]:checked');
  const selectedKeyIndex = correctRadio ? parseInt(correctRadio.value, 10) : 0;

  // Validasi
  if (!qText) {
    alert("Mohon isi teks pertanyaan soal!");
    document.getElementById('form-q-text').focus();
    return;
  }

  // Kumpulkan opsi yang terisi
  const rawOptions = [opt0, opt1, opt2, opt3, opt4];
  const filledOptions = [];
  let mappedCorrectIndex = 0;

  rawOptions.forEach((opt, idx) => {
    if (opt.length > 0) {
      filledOptions.push(opt);
      if (idx === selectedKeyIndex) {
        mappedCorrectIndex = filledOptions.length - 1;
      }
    }
  });

  if (filledOptions.length < 2) {
    alert("Mohon isi minimal 2 pilihan jawaban (misal Opsi A dan B)!");
    return;
  }

  if (selectedKeyIndex >= rawOptions.length || !rawOptions[selectedKeyIndex]) {
    alert(`Opsi ${OPTION_LETTERS[selectedKeyIndex]} yang Anda pilih sebagai kunci jawaban masih kosong. Silakan isi opsi tersebut atau pilih opsi lain.`);
    return;
  }

  if (AppState.editingQuestionId !== null) {
    // Mode Update Soal
    const targetIdx = AppState.questions.findIndex(q => q.id === AppState.editingQuestionId);
    if (targetIdx !== -1) {
      AppState.questions[targetIdx] = {
        id: AppState.editingQuestionId,
        question: qText,
        options: filledOptions,
        correctIndex: mappedCorrectIndex,
        explanation: explanation || "Pembahasan belum ditambahkan."
      };
      alert(`Soal No. ${targetIdx + 1} berhasil diperbarui!`);
    }
  } else {
    // Mode Tambah Soal Baru
    const newId = AppState.questions.length > 0 
      ? Math.max(...AppState.questions.map(q => q.id || 0)) + 1 
      : 1;

    AppState.questions.push({
      id: newId,
      question: qText,
      options: filledOptions,
      correctIndex: mappedCorrectIndex,
      explanation: explanation || "Pembahasan belum ditambahkan."
    });

    alert(`Soal baru berhasil ditambahkan! Total sekarang: ${AppState.questions.length} soal.`);
  }

  saveQuestionsToStorage();
  resetFormToCreateMode();
  switchManageTab('list');
}

function resetFormToCreateMode() {
  AppState.editingQuestionId = null;
  document.getElementById('form-mode-title').innerHTML = `<span>📝</span> Mode: Tambah Soal Baru`;
  document.getElementById('btn-cancel-edit-mode').classList.add('hidden');
  document.getElementById('btn-save-form-text').textContent = '➕ Tambah Soal ke Bank Soal';

  document.getElementById('form-q-text').value = '';
  document.getElementById('form-opt-0').value = '';
  document.getElementById('form-opt-1').value = '';
  document.getElementById('form-opt-2').value = '';
  document.getElementById('form-opt-3').value = '';
  document.getElementById('form-opt-4').value = '';
  document.getElementById('form-q-explanation').value = '';

  const defaultRadio = document.querySelector('input[name="form-correct-key"][value="0"]');
  if (defaultRadio) defaultRadio.checked = true;
}

function loadQuestionIntoForm(qId) {
  const q = AppState.questions.find(item => item.id === qId);
  if (!q) return;

  AppState.editingQuestionId = qId;
  const qNumber = AppState.questions.indexOf(q) + 1;

  document.getElementById('form-mode-title').innerHTML = `<span>✏️</span> Mode: Mengedit Soal No. ${qNumber}`;
  document.getElementById('btn-cancel-edit-mode').classList.remove('hidden');
  document.getElementById('btn-save-form-text').textContent = '💾 Simpan Perubahan Soal';

  document.getElementById('form-q-text').value = q.question;
  document.getElementById('form-opt-0').value = q.options[0] || '';
  document.getElementById('form-opt-1').value = q.options[1] || '';
  document.getElementById('form-opt-2').value = q.options[2] || '';
  document.getElementById('form-opt-3').value = q.options[3] || '';
  document.getElementById('form-opt-4').value = q.options[4] || '';
  document.getElementById('form-q-explanation').value = q.explanation || '';

  const radio = document.querySelector(`input[name="form-correct-key"][value="${q.correctIndex}"]`);
  if (radio) {
    radio.checked = true;
  }

  switchManageTab('form');
}

// ==========================================
// TAB 2: BULK TEXT PARSER (DARI WORD / PDF)
// ==========================================
function insertSampleBulkText() {
  const sample = `1. Seorang perawat melakukan pengkajian awal pada pasien pasca operasi. Prioritas utama tindakan keperawatan adalah:
A. Memeriksa tanda vital dan kepatenan jalan napas
B. Memberikan makanan padat secara langsung
C. Menyuruh pasien langsung berjalan kaki
D. Melepaskan seluruh perban luka
Kunci: A
Pembahasan: Menjaga patensi jalan napas dan monitoring tanda-tanda vital adalah prioritas tertinggi pasca anestesi dan pembedahan.

2. Prinsip etik yang menekankan bahwa tenaga kesehatan harus selalu berkata jujur kepada pasien mengenai kondisinya adalah:
A. Autonomy
B. Beneficence
C. Veracity
D. Justice
Kunci: C
Pembahasan: Veracity adalah prinsip kejujuran dan ketulusan dalam menyampaikan informasi yang akurat kepada pasien.`;

  document.getElementById('textarea-bulk-paste').value = sample;
}

function parseBulkTextQuestions(rawText) {
  if (!rawText || !rawText.trim()) return [];

  const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const parsedQuestions = [];

  let currentQ = null;

  const optionRegex = /^([A-Fa-f])[\.\)\-\:]\s*(.*)$/;
  const keyRegex = /^(?:kunci|jawaban|kunci jawaban|ans|key)\s*[\:\-]\s*([A-Fa-f])/i;
  const expRegex = /^(?:pembahasan|rasional|penjelasan|rasionalisasi)\s*[\:\-]\s*(.*)$/i;
  const numStartRegex = /^(?:soal\s*)?(\d+)[\.\)\-\:]\s*(.*)$/i;

  lines.forEach((line) => {
    // Cek apakah ini Kunci Jawaban
    const keyMatch = line.match(keyRegex);
    if (keyMatch && currentQ) {
      const letter = keyMatch[1].toUpperCase();
      const idx = OPTION_LETTERS.indexOf(letter);
      if (idx !== -1) {
        currentQ.correctIndex = idx;
      }
      return;
    }

    // Cek apakah ini Pembahasan
    const expMatch = line.match(expRegex);
    if (expMatch && currentQ) {
      currentQ.explanation = expMatch[1];
      return;
    }

    // Cek apakah ini Opsi Jawaban (A, B, C, D, E)
    const optMatch = line.match(optionRegex);
    if (optMatch && currentQ) {
      const letter = optMatch[1].toUpperCase();
      const text = optMatch[2].trim();
      currentQ.options.push(text);
      return;
    }

    // Cek apakah ini Awal Soal Baru (Angka 1., 2., dll)
    const numMatch = line.match(numStartRegex);
    if (numMatch) {
      if (currentQ && currentQ.question && currentQ.options.length >= 2) {
        parsedQuestions.push(finalizeParsedQuestion(currentQ, parsedQuestions.length + 1));
      }

      currentQ = {
        question: numMatch[2] ? numMatch[2] : '',
        options: [],
        correctIndex: 0,
        explanation: ''
      };
      return;
    }

    // Jika bukan nomor baru dan belum ada opsi, tambahkan ke teks pertanyaan saat ini
    if (currentQ && currentQ.options.length === 0) {
      currentQ.question += (currentQ.question ? ' ' : '') + line;
    } else if (currentQ && currentQ.explanation) {
      currentQ.explanation += ' ' + line;
    }
  });

  // Push soal terakhir jika ada
  if (currentQ && currentQ.question && currentQ.options.length >= 2) {
    parsedQuestions.push(finalizeParsedQuestion(currentQ, parsedQuestions.length + 1));
  }

  return parsedQuestions;
}

function finalizeParsedQuestion(rawQ, seqId) {
  return {
    id: seqId,
    question: rawQ.question.trim(),
    options: rawQ.options,
    correctIndex: (rawQ.correctIndex < rawQ.options.length) ? rawQ.correctIndex : 0,
    explanation: rawQ.explanation ? rawQ.explanation.trim() : "Pembahasan belum ditambahkan."
  };
}

function handleProcessBulk(isReplaceAll) {
  const text = document.getElementById('textarea-bulk-paste').value;
  const statusEl = document.getElementById('bulk-parse-status');

  const parsed = parseBulkTextQuestions(text);

  if (parsed.length === 0) {
    statusEl.textContent = '❌ Tidak ada soal yang valid terdeteksi. Pastikan ada nomor soal (1.) dan opsi (A., B.).';
    statusEl.className = 'text-xs font-bold text-red-600';
    return;
  }

  if (isReplaceAll) {
    if (!confirm(`Ganti SELURUH bank soal saat ini dengan ${parsed.length} soal hasil paste ini?`)) {
      return;
    }
    AppState.questions = parsed;
    alert(`Berhasil mengganti seluruh soal! Total sekarang: ${parsed.length} soal.`);
  } else {
    // Append
    const startId = AppState.questions.length > 0 
      ? Math.max(...AppState.questions.map(q => q.id || 0)) + 1 
      : 1;

    parsed.forEach((item, idx) => {
      item.id = startId + idx;
      AppState.questions.push(item);
    });
    alert(`Berhasil menambahkan ${parsed.length} soal baru! Total sekarang: ${AppState.questions.length} soal.`);
  }

  saveQuestionsToStorage();
  document.getElementById('textarea-bulk-paste').value = '';
  statusEl.textContent = `✅ Berhasil memproses ${parsed.length} soal.`;
  statusEl.className = 'text-xs font-bold text-green-600';

  switchManageTab('list');
}

// ==========================================
// TAB 3: DAFTAR & KELOLA SOAL (EDIT/HAPUS)
// ==========================================
function renderManageQuestionsList() {
  const container = document.getElementById('manage-questions-container');
  if (!container) return;

  container.innerHTML = '';

  if (AppState.questions.length === 0) {
    container.innerHTML = `
      <div class="text-center py-8 bg-slate-50 border border-dashed border-slate-300 rounded-2xl text-slate-500">
        <div class="text-3xl mb-2">📭</div>
        <p class="font-bold text-sm">Belum ada soal di Bank Soal.</p>
        <p class="text-xs mt-1">Silakan gunakan "Form Tambah Soal" atau "Paste Teks Cepat" di atas.</p>
      </div>
    `;
    return;
  }

  AppState.questions.forEach((q, idx) => {
    const card = document.createElement('div');
    card.className = 'p-3.5 bg-white border border-slate-200 rounded-xl hover:border-blue-300 transition shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3';

    const correctLetter = OPTION_LETTERS[q.correctIndex] || 'A';
    const correctText = q.options[q.correctIndex] || '-';

    card.innerHTML = `
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <span class="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-bold text-xs">
            No. ${idx + 1}
          </span>
          <span class="px-2 py-0.5 bg-green-100 text-green-800 rounded font-bold text-xs flex items-center gap-1">
            Kunci: ${correctLetter}
          </span>
          <span class="text-[11px] text-slate-400">
            (${q.options.length} Pilihan)
          </span>
        </div>
        <p class="text-xs font-medium text-slate-800 line-clamp-2 leading-relaxed">
          ${escapeHTML(q.question)}
        </p>
        <p class="text-[11px] text-slate-500 mt-1 truncate">
          <strong>Jawaban Benar:</strong> ${escapeHTML(correctText)}
        </p>
      </div>

      <div class="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
        <button 
          class="btn-edit-q px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg text-xs transition flex items-center gap-1"
          data-id="${q.id}"
        >
          ✏️ Edit
        </button>
        <button 
          class="btn-delete-q px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-lg text-xs transition flex items-center gap-1"
          data-id="${q.id}"
        >
          🗑️ Hapus
        </button>
      </div>
    `;

    // Event listener Edit & Hapus
    card.querySelector('.btn-edit-q').addEventListener('click', () => {
      loadQuestionIntoForm(q.id);
    });

    card.querySelector('.btn-delete-q').addEventListener('click', () => {
      handleDeleteQuestion(q.id, idx + 1);
    });

    container.appendChild(card);
  });
}

function handleDeleteQuestion(qId, seqNum) {
  if (!confirm(`Hapus soal nomor ${seqNum} dari daftar?`)) return;

  AppState.questions = AppState.questions.filter(q => q.id !== qId);
  saveQuestionsToStorage();
  renderManageQuestionsList();
}

function handleClearAllQuestions() {
  if (!confirm("PERINGATAN: Apakah Anda yakin ingin MENGHAPUS SEMUA soal di bank soal?")) return;

  AppState.questions = [];
  saveQuestionsToStorage();
  renderManageQuestionsList();
  alert("Semua soal telah dikosongkan. Silakan tambahkan soal Anda!");
}

function handleResetDefaultQuestions() {
  if (!confirm("Kembalikan daftar soal ke 20 Soal Contoh Bawaan?")) return;

  if (typeof questionsData !== 'undefined' && Array.isArray(questionsData)) {
    AppState.questions = JSON.parse(JSON.stringify(questionsData));
  } else {
    AppState.questions = generateFallbackQuestions();
  }

  saveQuestionsToStorage();
  renderManageQuestionsList();
  alert("Bank soal telah di-reset ke 20 soal contoh bawaan.");
}

// Backup & Restore File JSON
function downloadBackupJSON() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(AppState.questions, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `bank_soal_ujikom_${AppState.questions.length}_soal.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

function uploadBackupJSON(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(event) {
    try {
      const parsed = JSON.parse(event.target.result);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error("File JSON harus berupa array berisi soal.");
      }
      AppState.questions = parsed;
      saveQuestionsToStorage();
      renderManageQuestionsList();
      alert(`Berhasil memuat ${parsed.length} soal dari file backup!`);
    } catch (err) {
      alert("Gagal membaca file JSON: " + err.message);
    }
  };
  reader.readAsText(file);
}

function handleSaveRawJSON() {
  const textarea = document.getElementById('textarea-json-soal');
  const errorEl = document.getElementById('json-error');

  try {
    const parsed = JSON.parse(textarea.value);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      throw new Error("Data soal harus berupa array yang berisi minimal 1 soal.");
    }

    parsed.forEach((item, i) => {
      if (!item.question || !Array.isArray(item.options) || typeof item.correctIndex !== 'number') {
        throw new Error(`Soal nomor ${i + 1} tidak memiliki format lengkap (question, options[], correctIndex).`);
      }
    });

    AppState.questions = parsed;
    saveQuestionsToStorage();
    errorEl.classList.add('hidden');
    alert(`Berhasil menyimpan ${parsed.length} soal dari JSON!`);
    closeManageModal();
  } catch (err) {
    errorEl.textContent = `Format JSON tidak valid: ${err.message}`;
    errorEl.classList.remove('hidden');
  }
}

// ==========================================
// LOGIKA MEMULAI KUIS
// ==========================================
function handleStartQuiz() {
  const input = document.getElementById('input-user-name');
  const name = input.value.trim();
  const errorEl = document.getElementById('name-error');

  if (!name) {
    errorEl.classList.remove('hidden');
    input.focus();
    return;
  }
  errorEl.classList.add('hidden');

  if (AppState.questions.length === 0) {
    alert("Bank soal masih kosong! Silakan tambahkan soal Anda terlebih dahulu dengan mengklik tombol 'Kelola & Tambah Soal'.");
    openManageModal();
    return;
  }

  AppState.userName = name;
  localStorage.setItem('ujikom_user_name', name);

  // Inisialisasi array jawaban dinamis sesuai jumlah soal yang ada
  AppState.userAnswers = AppState.questions.map(() => ({
    selectedOption: null,
    isSubmitted: false,
    isCorrect: false
  }));

  AppState.currentIndex = 0;

  // Update UI Peserta
  document.getElementById('display-user-name').textContent = name;
  document.getElementById('badge-initial').textContent = name.charAt(0).toUpperCase();

  // Beralih ke layar kuis
  document.getElementById('screen-welcome').classList.add('hidden');
  document.getElementById('screen-results').classList.add('hidden');
  document.getElementById('screen-quiz').classList.remove('hidden');

  // Render navigasi nomor soal dinamis
  renderQuestionNavGrid();

  // Tampilkan soal pertama
  loadQuestion(0);
}

// ==========================================
// RENDER NAVIGASI NOMOR SOAL DINAMIS (1 .. N)
// ==========================================
function renderQuestionNavGrid() {
  const container = document.getElementById('grid-question-nav');
  container.innerHTML = '';

  AppState.questions.forEach((q, index) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.id = `nav-btn-${index}`;
    btn.className = 'nav-num-btn h-10 w-full flex items-center justify-center text-xs font-bold transition rounded-lg status-unanswered';
    btn.textContent = index + 1;

    btn.addEventListener('click', () => {
      loadQuestion(index);
    });

    container.appendChild(btn);
  });

  updateNavGridStatus();
}

function updateNavGridStatus() {
  let answeredCount = 0;
  let correctCount = 0;
  let wrongCount = 0;

  AppState.questions.forEach((_, idx) => {
    const btn = document.getElementById(`nav-btn-${idx}`);
    if (!btn) return;

    const ans = AppState.userAnswers[idx];

    btn.className = 'nav-num-btn h-10 w-full flex items-center justify-center text-xs font-bold transition rounded-lg ';

    if (ans && ans.isSubmitted) {
      answeredCount++;
      if (ans.isCorrect) {
        btn.classList.add('status-correct');
        correctCount++;
      } else {
        btn.classList.add('status-wrong');
        wrongCount++;
      }
    } else {
      btn.classList.add('status-unanswered');
    }

    if (idx === AppState.currentIndex) {
      btn.classList.add('active', 'ring-2', 'ring-blue-600', 'ring-offset-2');
    }
  });

  document.getElementById('nav-summary').textContent = `${answeredCount}/${AppState.questions.length}`;
  document.getElementById('score-answered-live').textContent = answeredCount;
  document.getElementById('score-correct-live').textContent = correctCount;
  document.getElementById('score-wrong-live').textContent = wrongCount;
}

// ==========================================
// LOAD & TAMPILKAN SOAL TERTENTU
// ==========================================
function loadQuestion(index) {
  if (index < 0 || index >= AppState.questions.length) return;

  AppState.currentIndex = index;
  const currentQ = AppState.questions[index];
  const currentAns = AppState.userAnswers[index];

  // Update Badge Soal Nomor
  document.getElementById('badge-question-number').textContent = `Soal Nomor ${index + 1} dari ${AppState.questions.length}`;

  // Update Progress Bar
  const percent = ((index + 1) / AppState.questions.length) * 100;
  document.getElementById('quiz-progress-bar').style.width = `${percent}%`;

  // Teks Soal
  document.getElementById('question-text').textContent = currentQ.question;

  // Render Pilihan Ganda
  renderOptions(currentQ, currentAns);

  // Status Feedback & Tombol Submit
  const feedbackContainer = document.getElementById('feedback-container');
  const btnSubmit = document.getElementById('btn-submit-answer');
  const actionHint = document.getElementById('action-hint');
  const statusPill = document.getElementById('question-status-pill');

  if (currentAns.isSubmitted) {
    btnSubmit.disabled = true;
    btnSubmit.innerHTML = `<span>✓ Jawaban Tersimpan</span>`;
    actionHint.textContent = `Soal ini telah Anda kerjakan. Periksa pembahasan di bawah.`;
    statusPill.textContent = currentAns.isCorrect ? '✓ Dijawab Benar' : '✗ Dijawab Salah';
    statusPill.className = currentAns.isCorrect ? 'text-xs font-bold text-green-600' : 'text-xs font-bold text-red-600';

    showFeedbackUI(currentQ, currentAns);
  } else {
    feedbackContainer.classList.add('hidden');
    btnSubmit.disabled = (currentAns.selectedOption === null);
    btnSubmit.innerHTML = `
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      <span>Kirim Jawaban</span>
    `;
    actionHint.textContent = currentAns.selectedOption !== null 
      ? `Klik "Kirim Jawaban" untuk mengecek kebenaran jawaban Anda.` 
      : `Pilih salah satu opsi lalu klik tombol Kirim Jawaban.`;
    statusPill.textContent = 'Pilih satu jawaban';
    statusPill.className = 'text-xs font-semibold text-slate-400';
  }

  // Tombol Previous & Next
  document.getElementById('btn-prev-question').disabled = (index === 0);
  
  const btnNext = document.getElementById('btn-next-question');
  if (index === AppState.questions.length - 1) {
    btnNext.innerHTML = `<span>Lihat Hasil Akhir</span> 🏆`;
    btnNext.className = 'px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition flex items-center gap-2 shadow-sm';
  } else {
    btnNext.innerHTML = `<span>Selanjutnya</span> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>`;
    btnNext.className = 'px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition flex items-center gap-2 shadow-sm';
  }

  updateNavGridStatus();
}

// ==========================================
// RENDER PILIHAN GANDA (OPTIONS)
// ==========================================
function renderOptions(question, answerState) {
  const container = document.getElementById('options-container');
  container.innerHTML = '';

  question.options.forEach((optText, optIdx) => {
    const letter = OPTION_LETTERS[optIdx] || (optIdx + 1);
    const isSelected = (answerState.selectedOption === optIdx);
    const isCorrectOption = (optIdx === question.correctIndex);

    const btn = document.createElement('div');
    btn.className = 'option-btn flex items-start gap-3.5 p-4 rounded-xl cursor-pointer bg-white';

    if (answerState.isSubmitted) {
      btn.classList.add('submitted');
      if (isSelected && answerState.isCorrect) {
        btn.classList.add('is-correct');
      } else if (isSelected && !answerState.isCorrect) {
        btn.classList.add('is-wrong');
      } else if (isCorrectOption) {
        btn.classList.add('is-correct');
      } else {
        btn.classList.add('is-dimmed');
      }
    } else {
      if (isSelected) {
        btn.classList.add('selected');
      }
      btn.addEventListener('click', () => {
        selectOption(optIdx);
      });
    }

    let badgeClass = 'w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 border transition ';
    if (answerState.isSubmitted) {
      if (isCorrectOption) {
        badgeClass += 'bg-green-600 border-green-700 text-white';
      } else if (isSelected && !answerState.isCorrect) {
        badgeClass += 'bg-red-600 border-red-700 text-white';
      } else {
        badgeClass += 'bg-slate-100 border-slate-300 text-slate-500';
      }
    } else {
      badgeClass += isSelected 
        ? 'bg-blue-600 border-blue-700 text-white shadow-sm' 
        : 'bg-slate-100 border-slate-300 text-slate-700';
    }

    let statusBadgeHTML = '';
    if (answerState.isSubmitted) {
      if (isCorrectOption) {
        statusBadgeHTML = `
          <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-green-100 text-green-800 border border-green-300 ml-auto shrink-0">
            ✓ Kunci Jawaban Benar
          </span>
        `;
      } else if (isSelected && !answerState.isCorrect) {
        statusBadgeHTML = `
          <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-red-100 text-red-800 border border-red-300 ml-auto shrink-0">
            ✗ Jawaban Anda (Salah)
          </span>
        `;
      }
    }

    btn.innerHTML = `
      <div class="${badgeClass}">${letter}</div>
      <div class="flex-1 text-sm sm:text-base text-slate-800 font-normal pt-1 leading-snug">
        ${escapeHTML(optText)}
      </div>
      ${statusBadgeHTML}
    `;

    container.appendChild(btn);
  });
}

function selectOption(optIndex) {
  const currentAns = AppState.userAnswers[AppState.currentIndex];
  if (currentAns.isSubmitted) return;

  currentAns.selectedOption = optIndex;
  playSound('click');

  const currentQ = AppState.questions[AppState.currentIndex];
  renderOptions(currentQ, currentAns);

  const btnSubmit = document.getElementById('btn-submit-answer');
  btnSubmit.disabled = false;
  document.getElementById('action-hint').textContent = `Pilihan ${OPTION_LETTERS[optIndex]} dipilih. Klik "Kirim Jawaban" untuk mengecek kebenaran.`;
}

// ==========================================
// SUBMIT JAWABAN (KOREKSI INSTAN BENAR/SALAH)
// ==========================================
function handleSubmitAnswer() {
  const currentQ = AppState.questions[AppState.currentIndex];
  const currentAns = AppState.userAnswers[AppState.currentIndex];

  if (currentAns.selectedOption === null || currentAns.isSubmitted) return;

  const isCorrect = (currentAns.selectedOption === currentQ.correctIndex);
  currentAns.isSubmitted = true;
  currentAns.isCorrect = isCorrect;

  if (isCorrect) {
    playSound('correct');
  } else {
    playSound('wrong');
  }

  renderOptions(currentQ, currentAns);
  showFeedbackUI(currentQ, currentAns);

  const btnSubmit = document.getElementById('btn-submit-answer');
  btnSubmit.disabled = true;
  btnSubmit.innerHTML = `<span>✓ Jawaban Tersimpan</span>`;
  document.getElementById('action-hint').textContent = `Jawaban telah disubmit. Anda dapat melanjutkan ke nomor berikutnya.`;

  updateNavGridStatus();
}

function showFeedbackUI(question, answerState) {
  const feedbackContainer = document.getElementById('feedback-container');
  const alertBox = document.getElementById('feedback-alert');
  const iconEl = document.getElementById('feedback-icon');
  const titleEl = document.getElementById('feedback-title');
  const subtitleEl = document.getElementById('feedback-subtitle');
  const explanationEl = document.getElementById('feedback-explanation');

  const correctLetter = OPTION_LETTERS[question.correctIndex];
  const correctText = question.options[question.correctIndex];

  if (answerState.isCorrect) {
    alertBox.className = 'p-4 rounded-xl flex items-start gap-3.5 mb-4 border bg-green-50 border-green-300 text-green-900';
    iconEl.textContent = '🎉';
    titleEl.textContent = 'Luar Biasa! Jawaban Anda BENAR.';
    subtitleEl.textContent = `Anda tepat memilih opsi ${correctLetter}: "${correctText}".`;
  } else {
    const userLetter = answerState.selectedOption !== null ? OPTION_LETTERS[answerState.selectedOption] : '-';
    alertBox.className = 'p-4 rounded-xl flex items-start gap-3.5 mb-4 border bg-red-50 border-red-300 text-red-900';
    iconEl.textContent = '❌';
    titleEl.textContent = 'Jawaban Anda KURANG TEPAT.';
    subtitleEl.innerHTML = `Anda memilih <strong>${userLetter}</strong>. Jawaban yang benar adalah <strong class="text-green-700 underline">${correctLetter}: ${escapeHTML(correctText)}</strong>.`;
  }

  explanationEl.textContent = question.explanation || "Pembahasan untuk soal ini belum tersedia.";
  feedbackContainer.classList.remove('hidden');
}

// ==========================================
// SELESAIKAN KUIS & LAYAR HASIL AKHIR
// ==========================================
function confirmFinishQuiz() {
  const unAnswered = AppState.userAnswers.filter(a => !a.isSubmitted).length;

  if (unAnswered > 0) {
    const confirmMsg = `Masih ada ${unAnswered} soal yang belum Anda jawab/submit. Apakah Anda yakin ingin menyelesaikan simulasi sekarang dan melihat hasil akhir?`;
    if (!confirm(confirmMsg)) return;
  }

  showResults();
}

function showResults() {
  document.getElementById('screen-quiz').classList.add('hidden');
  document.getElementById('screen-results').classList.remove('hidden');

  const total = AppState.questions.length;
  let correctCount = 0;
  let wrongCount = 0;

  AppState.userAnswers.forEach(ans => {
    if (ans.isSubmitted && ans.isCorrect) {
      correctCount++;
    } else {
      wrongCount++;
    }
  });

  const score100 = total > 0 ? Math.round((correctCount / total) * 100) : 0;
  const isPassed = score100 >= 70;

  document.getElementById('res-user-name').textContent = AppState.userName;
  document.getElementById('res-score-number').textContent = score100;
  document.getElementById('res-count-correct').textContent = correctCount;
  document.getElementById('res-count-wrong').textContent = wrongCount;
  document.getElementById('res-accuracy').textContent = `${score100}%`;

  const badgeEl = document.getElementById('result-status-badge');
  const gradeTextEl = document.getElementById('res-grade-text');

  if (isPassed) {
    badgeEl.textContent = '🏆 LULUS UJI KOMPETENSI';
    badgeEl.className = 'inline-block px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider mb-4 bg-emerald-100 text-emerald-800 border border-emerald-300';
    gradeTextEl.textContent = 'Status: KOMPETEN (LULUS)';
    playSound('correct');
  } else {
    badgeEl.textContent = '⚠️ BELUM LULUS (PERLU PENGAYAAN)';
    badgeEl.className = 'inline-block px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider mb-4 bg-amber-100 text-amber-800 border border-amber-300';
    gradeTextEl.textContent = 'Status: BELUM KOMPETEN (Skor < 70)';
  }

  renderReviewList();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderReviewList() {
  const container = document.getElementById('review-list-container');
  container.innerHTML = '';

  AppState.questions.forEach((q, idx) => {
    const ans = AppState.userAnswers[idx] || { isSubmitted: false, isCorrect: false, selectedOption: null };
    const isSubmitted = ans.isSubmitted;
    const isCorrect = isSubmitted && ans.isCorrect;

    const correctLetter = OPTION_LETTERS[q.correctIndex] || 'A';
    const correctOptionText = q.options[q.correctIndex] || '-';

    let userSelectedText = 'Tidak dijawab';
    let userLetter = '-';
    if (ans.selectedOption !== null && q.options[ans.selectedOption]) {
      userLetter = OPTION_LETTERS[ans.selectedOption];
      userSelectedText = `${userLetter}. ${q.options[ans.selectedOption]}`;
    }

    const card = document.createElement('div');
    card.className = `p-5 rounded-2xl border bg-white shadow-sm transition ${
      isCorrect ? 'border-green-200' : 'border-red-200'
    }`;

    card.innerHTML = `
      <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
        <span class="font-bold text-sm text-slate-800">
          Soal No. ${idx + 1}
        </span>
        <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
          isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }">
          ${isCorrect ? '✓ Benar' : '✗ Salah'}
        </span>
      </div>

      <p class="text-sm text-slate-800 mb-4 leading-relaxed font-medium">
        ${escapeHTML(q.question)}
      </p>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-xs">
        <div class="p-3 rounded-xl ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}">
          <span class="font-semibold block ${isCorrect ? 'text-green-800' : 'text-red-800'} mb-1">
            Jawaban Anda:
          </span>
          <span class="text-slate-700 font-medium">${escapeHTML(userSelectedText)}</span>
        </div>

        <div class="p-3 rounded-xl bg-blue-50 border border-blue-200">
          <span class="font-semibold block text-blue-800 mb-1">
            Kunci Jawaban yang Benar:
          </span>
          <span class="text-slate-800 font-medium">${correctLetter}. ${escapeHTML(correctOptionText)}</span>
        </div>
      </div>

      <div class="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700">
        <span class="font-bold text-slate-800 block mb-1">💡 Pembahasan:</span>
        <p class="leading-relaxed">${escapeHTML(q.explanation || 'Pembahasan belum ditambahkan.')}</p>
      </div>
    `;

    container.appendChild(card);
  });
}

function restartQuizSameUser() {
  AppState.userAnswers = AppState.questions.map(() => ({
    selectedOption: null,
    isSubmitted: false,
    isCorrect: false
  }));
  AppState.currentIndex = 0;

  document.getElementById('screen-results').classList.add('hidden');
  document.getElementById('screen-quiz').classList.remove('hidden');

  renderQuestionNavGrid();
  loadQuestion(0);
}

function changeUser() {
  document.getElementById('screen-results').classList.add('hidden');
  document.getElementById('screen-quiz').classList.add('hidden');
  document.getElementById('screen-welcome').classList.remove('hidden');

  const input = document.getElementById('input-user-name');
  input.value = '';
  input.focus();
}

// ==========================================
// UTILITY HELPERS
// ==========================================
function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function generateFallbackQuestions() {
  const list = [];
  for (let i = 1; i <= 20; i++) {
    list.push({
      id: i,
      question: `Pertanyaan Latihan Uji Kompetensi Soal Nomor ${i}?`,
      options: [
        `Pilihan A untuk soal nomor ${i}`,
        `Pilihan B untuk soal nomor ${i} (Kunci Jawaban Tepat)`,
        `Pilihan C untuk soal nomor ${i}`,
        `Pilihan D untuk soal nomor ${i}`
      ],
      correctIndex: 1,
      explanation: `Penjelasan untuk nomor ${i}: Pilihan B adalah tindakan yang paling tepat sesuai dengan standar prosedur operasional.`
    });
  }
  return list;
}
