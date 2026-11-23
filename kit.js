/* Connect the supplied tool artwork to the export inventory. */
'use strict';
document.querySelector('[data-kit-export]')?.addEventListener('click', () => {
  const inventory = document.querySelector('.tool-inventory');
  const exportDetails = inventory?.querySelector('details:last-child');
  if (exportDetails) exportDetails.open = true;
});
