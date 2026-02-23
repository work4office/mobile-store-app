const Tour = require('../../models/tourModel');

describe('Tour Model', () => {
  it('should require a name', () => {
    const tour = new Tour({});
    const err = tour.validateSync();
    expect(err.errors.name).toBeDefined();
  });

  it('should require a price', () => {
    const tour = new Tour({ name: 'Test' });
    const err = tour.validateSync();
    expect(err.errors.price).toBeDefined();
  });

  it('should calculate durationWeeks virtual', () => {
    const tour = new Tour({
      name: 'Test Tour',
      duration: 14,
      maxGroupSize: 10,
      difficulty: 'easy',
      price: 500,
      summary: 'A test tour',
      imageCover: 'cover.jpg',
    });
    expect(tour.durationWeeks).toBe(2);
  });

  it('should only accept valid difficulty values', () => {
    const tour = new Tour({
      name: 'Test',
      duration: 7,
      maxGroupSize: 10,
      difficulty: 'invalid',
      price: 100,
      summary: 'Test',
      imageCover: 'img.jpg',
    });
    const err = tour.validateSync();
    expect(err.errors.difficulty).toBeDefined();
  });
});
