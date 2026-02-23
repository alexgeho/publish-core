async function handleGenerate() {
  const title = document.getElementById('ai-title').value.trim();
  const length = document.getElementById('ai-length').value;
  const language = document.getElementById('ai-language').value;

  const button = document.getElementById('generateBtn');
  const resultBox = document.getElementById('ai-result');

  if (!title) {
    alert('Title required');
    return;
  }

  if (button.disabled) return;

  try {
    button.disabled = true;
    button.textContent = 'Generating...';

    resultBox.style.display = 'block';
    resultBox.textContent = 'AI is generating article. Please wait...';

    const response = await fetch('/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, length, language })
    });

    if (!response.ok) {
      throw new Error('AI request failed');
    }

    const data = await response.json();

    document.getElementById('title').value = title;
    document.getElementById('content').value = data.content;

    resultBox.textContent = 'Article generated ✓';

    document.querySelector('[data-tab="editor"]').click();

  } catch (error) {
    resultBox.textContent = 'AI error. Check server.';
  } finally {
    button.disabled = false;
    button.textContent = 'Generate Article';
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const button = document.getElementById('generateBtn');
  if (button) {
    button.addEventListener('click', handleGenerate);
  }
});