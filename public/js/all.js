function toggleLoadingIndicator(show) {

	// New version - toggle all that are interested
	$('.loading-listener').toggleClass('loading', show);

	// Old version - toggle logo
	$('#stocard-logo').toggleClass('loading', show);
}