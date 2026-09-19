// Dynamic Google Font Loader with in-memory caching for peak performance

const loadedFonts = new Set();

export function loadGoogleFont(fontQuery) {
  if (!fontQuery || loadedFonts.has(fontQuery)) return;

  try {
    const linkId = `google-font-${encodeURIComponent(fontQuery)}`;
    if (document.getElementById(linkId)) {
      loadedFonts.add(fontQuery);
      return;
    }

    const link = document.createElement('link');
    link.id = linkId;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?${fontQuery}&display=swap`;
    document.head.appendChild(link);
    loadedFonts.add(fontQuery);
  } catch (err) {
    console.warn('Unable to load font dynamically:', fontQuery, err);
  }
}

export function loadFonts(fontQueries = []) {
  fontQueries.forEach(q => loadGoogleFont(q));
}
