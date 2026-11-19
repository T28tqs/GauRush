/* Connect the supplied tool artwork to the real page workflows. */
'use strict';
document.querySelectorAll('[data-kit-workflow]').forEach(link => {
  link.addEventListener('click', () => {
    const tab = document.getElementById(link.dataset.kitWorkflow + '-tab');
    if (tab) tab.click();
  });
});
document.querySelector('[data-kit-export]')?.addEventListener('click', () => {
  const inventory = document.querySelector('.tool-inventory');
  const exportDetails = inventory?.querySelector('details:last-child');
  if (exportDetails) exportDetails.open = true;
});
