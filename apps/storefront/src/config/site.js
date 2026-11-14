const site = {
  fssaiLicenceNo: null, // OI-003
  sourcingRegion: null, // OI-001
  certifications: [], // OI-002
  supportEmail: null, // OI-013
  supportPhone: null, // OI-013
  supportHours: null, // OI-013
  announcementMessage: null, // OI-006
  freeShippingThreshold: null, // OI-006
  returnsPolicy: { enabled: false }, // OI-006
  batchLabel: null, // OI-015
  heroHeadline: 'Pure single-origin haldi, ground fresh', // OI-011
  newsletterEnabled: false, // OI-006
  domain: null, // OI-010
  benefits: [
    [
      'Cooking',
      'Warm colour and familiar flavour for curries, rice, and vegetables.',
    ],
    ['Everyday', 'A simple pantry staple for recipes shared around the table.'],
    ['Storage', 'Keep sealed in a cool, dry place between uses.'],
  ],
  processSteps: [
    ['01', 'Harvest', 'Roots are selected for the next stage.'],
    ['02', 'Wash and Boil', 'Prepared with a careful, traditional process.'],
    ['03', 'Sun-dry', 'Prepared for grinding in the open air.'],
    ['04', 'Stone-grind', 'Ground for a naturally warm kitchen flavour.'],
    ['05', 'Pack', 'Sealed for your pantry.'],
  ],
};

export default Object.freeze(site);
