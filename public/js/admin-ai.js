async function handleGenerate() {
  const title = document.getElementById('ai-title').value.trim();
  const length = document.getElementById('ai-length').value;
  const language = document.getElementById('ai-language').value;

  if (!title) {
    alert('Title required');
    return;
  }

  try {
    const response = await fetch('/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, length, language })
    });

    if (!response.ok) throw new Error();

    const data = await response.json();

    document.getElementById('title').value = title;
    document.getElementById('content').value = data.content;

    document.querySelector('[data-tab="editor"]').click();

  } catch {
    alert('AI error');
  }
}

document.addEventListener('DOMContentLoaded', function() {
  document
    .getElementById('generateBtn')
    .addEventListener('click', handleGenerate);
});