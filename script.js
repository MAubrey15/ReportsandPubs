$(document).ready(function () {
  let allReports = [];

  // Load JSON data and populate the page
  $.ajax({
    url: 'clean_reports.json',
    dataType: 'json',
    success: function(data) {
      allReports = data;
      populateFilters();
      renderCards();
      applyFilters();
    },
    error: function() {
      console.error('Failed to load reports data');
    }
  });

  // Populate filter dropdowns with unique types and years
  function populateFilters() {
    // Get unique types
    const types = [...new Set(allReports.map(report => report.type))].sort();
    types.forEach(type => {
      $('#filterType').append(`<option value="${type}">${type}</option>`);
    });

    // Get unique years and sort
    const years = [...new Set(allReports.map(report => report.year))].sort((a, b) => a - b);
    
    // Populate year dropdowns
    years.forEach(year => {
      $('#filterYearStart').append(`<option value="${year}">${year}</option>`);
      $('#filterYearEnd').append(`<option value="${year}">${year}</option>`);
    });

    // Set default values
    if (years.length > 0) {
      $('#filterYearStart').val(years[0]);
      $('#filterYearEnd').val(years[years.length - 1]);
    }
  }

  // Render all cards from JSON data
  function renderCards() {
    const container = $('.cards-container');
    container.empty();

    allReports.forEach(report => {
      const card = `
        <div class="data-row" data-type="${report.type}" data-year="${report.year}">
          <div class="operation-card">
            <div class="card-header">
              <h3 class="card-title">
                <a href="${report.link}">
                  ${report.title}
                </a>
              </h3>
            </div>
            <div class="card-content">
              <div class="card-field">
                <strong>Type:</strong>
                <p>${report.type}</p>
                <strong>Date of publication:</strong>
                <p>${report.year}</p>
              </div>
            </div>
          </div>
        </div>
      `;
      container.append(card);
    });
  }

  function applyFilters() {
    const typeFilter = $('#filterType').val().toLowerCase();
    const yearStart = $('#filterYearStart').val();
    const yearEnd = $('#filterYearEnd').val();
    const searchTerm = $('#searchOperations').val().toLowerCase();

    // Set default values if empty
    const startYear = yearStart ? parseInt(yearStart) : 2002;
    const endYear = yearEnd ? parseInt(yearEnd) : 2026;

    $('.operation-card').each(function () {
      const card = $(this);

      const type = (card.closest('.data-row').data('type') || '').toLowerCase();
      const year = parseInt(card.closest('.data-row').data('year') || 0);
      const text = card.text().toLowerCase();

      const typeMatch = typeFilter === '' || type === typeFilter;
      const yearMatch = year >= startYear && year <= endYear;
      const searchMatch = searchTerm === '' || text.includes(searchTerm);

      if (typeMatch && yearMatch && searchMatch) {
        card.removeClass('hidden');
      } else {
        card.addClass('hidden');
      }
    });
  }

  $('#filterType, #filterYearStart, #filterYearEnd').on('change', applyFilters);
  $('#searchOperations').on('input', applyFilters);

  $('#resetFilters').on('click', function () {
    $('#filterType').val('');
    // Reset to first and last year
    const firstOption = $('#filterYearStart option:first').val();
    const lastOption = $('#filterYearEnd option:last').val();
    $('#filterYearStart').val(firstOption);
    $('#filterYearEnd').val(lastOption);
    $('#searchOperations').val('');
    applyFilters();
  });
});
