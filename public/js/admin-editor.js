function initDate() {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('date').value = today;
}

function collectEditorData() {
  return {
    site: document.getElementById('site').value,
    title: document.getElementById('title').value.trim(),
    excerpt: document.getElementById('excerpt').value.trim(),
    date: document.getElementById('date').value,
    content: document.getElementById('content').value.trim(),
    coverImage: document.getElementById('coverImage').value.trim(),
    galleryImages: document
      .getElementById('galleryImages')
      .value
      .split(',')
      .map(function (i) { return i.trim(); })
      .filter(function (i) { return i.length > 0; })
  };
}

function showResult(message, success) {
  const result = document.getElementById('result');
  result.style.display = 'block';
  result.textContent = message;
  result.className = success ? 'ok' : 'err';
}

/* ===========================
   SAVE DRAFT
=========================== */

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

/* ===========================
   DRAFTS
=========================== */

async function handlePublish(id) {
  try {
    await fetch('/posts/' + id + '/publish', { method: 'POST' });
    loadDrafts();
    loadPublished();
  } catch { }
}

async function loadDrafts() {
  try {
    const res = await fetch('/posts/drafts');
    const drafts = await res.json();
    const list = document.getElementById('drafts-list');

    if (!drafts.length) {
      list.innerHTML = '<p style="color:var(--muted);font-size:13px;text-align:center;padding:20px">No drafts</p>';
      return;
    }

    list.innerHTML = '';

    drafts.forEach(function (d) {
      const card = document.createElement('div');
      card.className = 'draft-card';

      // Left: title + date only
      const info = document.createElement('div');
      info.style.minWidth = '0';

      const title = document.createElement('div');
      title.className = 'draft-title';
      title.textContent = d.title;

      const date = document.createElement('div');
      date.className = 'draft-meta';
      date.textContent = d.date;

      info.appendChild(title);
      info.appendChild(date);

      // Publish button
      const btn = document.createElement('button');
      btn.className = 'btn btn-publish';
      btn.textContent = 'Publish';
      btn.addEventListener('click', function () {
        handlePublish(d._id);
      });

      card.appendChild(info);
      card.appendChild(btn);
      list.appendChild(card);
    });

  } catch {
    document.getElementById('drafts-list').innerHTML =
      '<p style="color:var(--muted)">Error loading drafts</p>';
  }
}

/* ===========================
   PUBLISHED ARTICLES
=========================== */

async function loadPublished() {
  try {
    const site = document.getElementById('site').value;
    const res = await fetch('/posts/published?site=' + site);
    const posts = await res.json();
    const list = document.getElementById('articles-list');

    if (!posts.length) {
      list.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--muted);padding:32px">No articles</td></tr>';
      return;
    }

    list.innerHTML = '';

    posts.forEach(function (post) {
      const tr = document.createElement('tr');
      tr.innerHTML =
        '<td>' + post.title + '</td>' +
        '<td style="color:var(--muted);font-family:DM Mono,monospace;font-size:12px">' + (post.site || '—') + '</td>' +
        '<td style="color:var(--muted);font-family:DM Mono,monospace;font-size:12px">' + post.date + '</td>' +
        '<td><span class="status-badge status-published">published</span></td>' +
        '<td><button class="btn btn-delete" onclick="deletePublished(\'' + post.slug + '\')">Delete</button></td>';
      list.appendChild(tr);
    });

  } catch {
    document.getElementById('articles-list').innerHTML =
      '<tr><td colspan="5" style="color:var(--muted)">Error loading articles</td></tr>';
  }
}

async function deletePublished(slug) {
  if (!confirm('Delete this article?')) return;
  await fetch('/posts/' + slug, { method: 'DELETE' });
  loadPublished();
}

/* ===========================
   INIT
=========================== */

document.addEventListener('DOMContentLoaded', function () {
  initDate();
  loadDrafts();

  document
    .getElementById('saveDraftBtn')
    .addEventListener('click', handleSaveDraft);
});