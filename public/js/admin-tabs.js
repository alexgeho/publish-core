function initTabs() {
  const buttons = document.querySelectorAll('.tab-btn');
  const contents = document.querySelectorAll('.tab-content');

  buttons.forEach(function(button) {
    button.addEventListener('click', function() {
      const tab = button.dataset.tab;

      buttons.forEach(function(b) {
        b.classList.remove('active');
      });

      contents.forEach(function(c) {
        c.classList.remove('active');
      });

      button.classList.add('active');
      document.getElementById(tab).classList.add('active');

      if (tab === 'articles') {
        loadPublished();
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', function () {
  initTabs();
});