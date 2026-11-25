document.getElementById('entryForm').addEventListener('submit', function(e) {
    e.preventDefault();
    document.getElementById('notify').textContent = '[OK] Candidate recorded successfully.';
    this.reset();
});