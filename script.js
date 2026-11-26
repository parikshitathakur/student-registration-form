const form = document.getElementById('entryForm');
const notify = document.getElementById('notify');
const memoryBtn = document.getElementById('memoryBtn');
const clearMemoryBtn = document.getElementById('clearMemoryBtn');
const memoryContainer = document.getElementById('memoryContainer');
const recordsBody = document.getElementById('recordsBody');
const recordCount = document.getElementById('recordCount');
const emptyNotice = document.getElementById('emptyNotice');
const recordsTable = document.getElementById('recordsTable');

let studentList = [];

try {
    const saved = localStorage.getItem('registered_students');
    if (saved) {
        studentList = JSON.parse(saved);
    }
} catch (e) {
    console.warn('Storage unavailable:', e);
}

function escapeText(str) {
    const p = document.createElement('p');
    p.textContent = str || '';
    return p.innerHTML;
}

function renderTable() {
    recordCount.textContent = studentList.length;

    if (studentList.length === 0) {
        recordsBody.innerHTML = '';
        recordsTable.style.display = 'none';
        emptyNotice.classList.remove('hidden');
        return;
    }

    recordsTable.style.display = 'table';
    emptyNotice.classList.add('hidden');

    recordsBody.innerHTML = studentList.map((st, i) => `
        <tr>
            <td>${i + 1}</td>
            <td><strong>${escapeText(st.name)}</strong></td>
            <td>${escapeText(st.phone)}</td>
            <td>${escapeText(st.branch)}</td>
            <td>${escapeText(st.time)}</td>
        </tr>
    `).join('');
}

form.addEventListener('submit', function(e) {
    e.preventDefault();

    const nameVal = document.getElementById('usr').value.trim();
    const phoneVal = document.getElementById('contact').value.trim();
    const branchVal = document.getElementById('prog').value;

    if (!nameVal || !phoneVal || !branchVal) {
        notify.textContent = 'Please fill out all fields.';
        notify.style.color = '#f87171';
        return;
    }

    const now = new Date();
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const studentRecord = {
        name: nameVal,
        phone: phoneVal,
        branch: branchVal,
        time: timeFormatted
    };

    studentList.push(studentRecord);

    try {
        localStorage.setItem('registered_students', JSON.stringify(studentList));
    } catch (e) {
        console.warn('Could not save to localStorage:', e);
    }

    notify.textContent = 'Student registered successfully!';
    notify.style.color = '#4ade80';
    form.reset();

    if (!memoryContainer.classList.contains('hidden')) {
        renderTable();
    }

    setTimeout(() => {
        if (notify.textContent === 'Student registered successfully!') {
            notify.textContent = '';
        }
    }, 4000);
});

memoryBtn.addEventListener('click', function() {
    const isHidden = memoryContainer.classList.contains('hidden');
    if (isHidden) {
        memoryContainer.classList.remove('hidden');
        memoryBtn.textContent = 'Hide Saved Records';
        renderTable();
    } else {
        memoryContainer.classList.add('hidden');
        memoryBtn.textContent = 'View Saved Records';
    }
});

clearMemoryBtn.addEventListener('click', function() {
    if (studentList.length === 0) return;

    if (confirm('Are you sure you want to clear all registered student records?')) {
        studentList = [];
        try {
            localStorage.removeItem('registered_students');
        } catch (e) {
            console.warn('Could not clear storage:', e);
        }
        renderTable();
        notify.textContent = 'Saved records have been cleared.';
        notify.style.color = '#c084fc';
    }
});
