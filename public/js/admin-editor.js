function initDate() {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('date').value = today;
}

function collectEditorData() {
  return {
    title: document.getElementById('title').value.trim(),
    excerpt: document.getElementById('excerpt').value.trim(),
    date: document.getElementById('date').value,
    content: document.getElementById('content').value.trim(),
    coverImage: document.getElementById('coverImage').value.trim(),
    galleryImages: document
      .getElementById('galleryImages')
      .value
      .split(',')
      .map(function(i) { return i.trim(); })
      .filter(function(i) { return i.length > 0; })
  };
}

function showResult(message, success) {
  const result = document.getElementById('result');
  result.style.display = 'block';
  result.textContent = message;
  result.className = success ? 'ok' : 'err';
}

async function handleSaveDraft() {
  const data = collectEditorData();

  if (!data.title || !data.excerpt || !data.date || !data.content) {
    showResult('All fields required', false);
    return;
  }

  try {
    const response = await fetch('/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) throw new Error();

    showResult('Draft saved', true);
    loadDrafts();

  } catch {
    showResult('Server error', false);
  }
}

async function handlePublish(id) {
  try {
    await fetch('/posts/' + id + '/publish', { method: 'POST' });
    loadDrafts();
  } catch {}
}

async function loadDrafts() {
  try {
    const res = await fetch('/posts/drafts');
    const drafts = await res.json();
    const list = document.getElementById('drafts-list');

    if (!drafts.length) {
      list.innerHTML = '<p>No drafts</p>';
      return;
    }

    list.innerHTML = '';

    drafts.forEach(function(d) {
      const card = document.createElement('div');
      card.className = 'draft-card';

      const info = document.createElement('div');
      info.className = 'draft-info';

      const title = document.createElement('h3');
      title.textContent = d.title;

      const meta = document.createElement('p');
      meta.textContent = d.date + ' · ' + d.excerpt;

      const btn = document.createElement('button');
      btn.className = 'btn btn-publish';
      btn.textContent = 'Publish';
      btn.addEventListener('click', function() {
        handlePublish(d._id);
      });

      info.appendChild(title);
      info.appendChild(meta);

      card.appendChild(info);
      card.appendChild(btn);

      list.appendChild(card);
    });

  } catch {
    document.getElementById('drafts-list').innerHTML =
      '<p>Error loading drafts</p>';
  }
}

document.addEventListener('DOMContentLoaded', function() {
  initDate();
  loadDrafts();

  document
    .getElementById('saveDraftBtn')
    .addEventListener('click', handleSaveDraft);
});