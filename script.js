$(document).ready(function () {

  function applyFilters() {
    const typeFilter = $('#filterType').val().toLowerCase();
    const yearFilter = $('#filterYear').val().toLowerCase();
    const searchTerm = $('#searchOperations').val().toLowerCase();

    $('.data-row').each(function () {
      const row = $(this);
      const card = row.find('.operation-card');

      const type = (row.data('type') || '').toLowerCase();
      const year = (row.data('year') || '').toString().toLowerCase();
      const text = row.text().toLowerCase();

      const typeMatch = typeFilter === '' || type === typeFilter;
      const yearMatch = yearFilter === '' || year === yearFilter;
      const searchMatch = searchTerm === '' || text.includes(searchTerm);

      if (typeMatch && yearMatch && searchMatch) {
        card.removeClass('hidden');
      } else {
        card.addClass('hidden');
      }
    });
  }

  $('#filterType, #filterYear').on('change', applyFilters);
  $('#searchOperations').on('input', applyFilters);

  $('#resetFilters').on('click', function () {
    $('#filterType').val('');
    $('#filterYear').val('');
    $('#searchOperations').val('');
    applyFilters();
  });

  applyFilters();
});
