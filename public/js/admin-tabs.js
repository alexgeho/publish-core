function initTabs() {
  const buttons = document.querySelectorAll('.tab-btn');
  const contents = document.querySelectorAll('.tab-content');

  function activateTab(tabId) {
    buttons.forEach(function(btn) {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    contents.forEach(function(content) {
      content.classList.toggle('active', content.id === tabId);
    });
  }

  buttons.forEach(function(btn) {
    btn.addEventListener('click', function() {
      activateTab(btn.dataset.tab);
    });
  });
}

document.addEventListener('DOMContentLoaded', function() {
  initTabs();
});