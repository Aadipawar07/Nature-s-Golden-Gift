module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run preview -- --host 127.0.0.1',
      startServerReadyPattern: 'Local',
      url: [
        'http://127.0.0.1:4173/',
        'http://127.0.0.1:4173/shop',
        'http://127.0.0.1:4173/product/starter-pouch',
      ],
      numberOfRuns: 1,
      settings: {
        preset: 'perf',
        formFactor: 'mobile',
        throttlingMethod: 'provided',
        onlyCategories: ['performance', 'accessibility'],
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:seo': 'off',
        'errors-in-console': 'off',
        'is-crawlable': 'off',
        'meta-description': 'off',
        'unused-javascript': 'off',
        'render-blocking-insight': 'off',
      },
    },
    upload: { target: 'temporary-public-storage' },
  },
};
