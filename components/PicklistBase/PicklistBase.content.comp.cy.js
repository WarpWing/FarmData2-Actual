import PicklistBase from '@comps/PicklistBase/PicklistBase.vue';

describe('Test the PicklistBase component content', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Check initial header button state with checkbox mode', () => {
    cy.mount(PicklistBase, {
      props: {
        rows: [
          { name: 'Item A', quantity: 5, location: 'GHANA' },
          { name: 'Item B', quantity: 3, location: 'GHANA' },
        ],
        columns: ['name', 'quantity', 'location'],
        labels: { name: 'Name', quantity: 'Quantity', location: 'Location' },
        picked: new Map(),
        showAllButton: true
      },
    });

    cy.get('[data-cy="picklist-all-button"]')
      .should('exist')
      .should('contain', '✅ All');
  });

  it('Check initial header button state with units mode', () => {
    cy.mount(PicklistBase, {
      props: {
        rows: [
          { name: 'Item A', quantity: 5, location: 'GHANA' },
          { name: 'Item B', quantity: 3, location: 'GHANA' },
        ],
        columns: ['name', 'quantity', 'location'],
        labels: { name: 'Name', quantity: 'Quantity', location: 'Location' },
        picked: new Map(),
        showAllButton: true,
        units: 'Trays',
        quantityAttribute: 'quantity'
      },
    });

    cy.get('[data-cy="picklist-units-button"]')
      .should('exist')
      .should('contain', '✅ Trays');
  });

  it('Check header button disabled state during info overlay', () => {
    cy.mount(PicklistBase, {
      props: {
        rows: [
          { name: 'Item A', quantity: 5, location: 'GHANA', details: 'Info A' },
          { name: 'Item B', quantity: 3, location: 'GHANA', details: 'Info B' },
        ],
        columns: ['name', 'quantity', 'location'],
        labels: { 
          name: 'Name', 
          quantity: 'Quantity', 
          location: 'Location',
          details: 'Details'
        },
        picked: new Map(),
        showInfoIcons: true,
        showAllButton: true
      },
    });

    cy.get('[data-cy="picklist-info-icon-0"]').click();
    cy.get('[data-cy="picklist-all-button"]').should('be.disabled');
  });

  it('Check header button display based on showAllButton prop', () => {
    cy.mount(PicklistBase, {
      props: {
        rows: [
          { name: 'Item A', quantity: 5, location: 'GHANA' },
          { name: 'Item B', quantity: 3, location: 'GHANA' },
        ],
        columns: ['name', 'quantity', 'location'],
        labels: { name: 'Name', quantity: 'Quantity', location: 'Location' },
        picked: new Map(),
        showAllButton: false
      },
    });

    cy.get('[data-cy="picklist-all-button"]').should('not.exist');
    cy.get('[data-cy="picklist-units-button"]').should('not.exist');
  });

  it('Check header button icon changes with all rows selected', () => {
    cy.mount(PicklistBase, {
      props: {
        rows: [
          { name: 'Item A', quantity: 5, location: 'GHANA' },
          { name: 'Item B', quantity: 3, location: 'GHANA' },
        ],
        columns: ['name', 'quantity', 'location'],
        labels: { name: 'Name', quantity: 'Quantity', location: 'Location' },
        picked: new Map([
          [0, { picked: 1 }],
          [1, { picked: 1 }],
        ])
      },
    });

    cy.get('[data-cy="picklist-all-button"]').should('contain', '🚫 All');
  });

  it('Check header button icon changes with all quantities selected', () => {
    cy.mount(PicklistBase, {
      props: {
        rows: [
          { name: 'Item A', quantity: 5, location: 'GHANA' },
          { name: 'Item B', quantity: 3, location: 'GHANA' },
        ],
        columns: ['name', 'quantity', 'location'],
        labels: { name: 'Name', quantity: 'Quantity', location: 'Location' },
        picked: new Map([
          [0, { picked: 5 }],
          [1, { picked: 3 }],
        ]),
        units: 'Trays',
        quantityAttribute: 'quantity'
      },
    });

    cy.get('[data-cy="picklist-units-button"]').should('contain', '🚫 Trays');
  });

  it('Check header button not present when rows are empty', () => {
    cy.mount(PicklistBase, {
      props: {
        rows: [],
        columns: ['name', 'quantity', 'location'],
        labels: { name: 'Name', quantity: 'Quantity', location: 'Location' },
        picked: new Map(),
        showAllButton: true
      },
    });

    cy.get('[data-cy="picklist-all-button"]').should('not.exist');
    cy.get('[data-cy="picklist-units-button"]').should('not.exist');
  });

  it('Check header button presence with single row', () => {
    cy.mount(PicklistBase, {
      props: {
        rows: [
          { name: 'Item A', quantity: 5, location: 'GHANA' },
        ],
        columns: ['name', 'quantity', 'location'],
        labels: { name: 'Name', quantity: 'Quantity', location: 'Location' },
        picked: new Map(),
        showAllButton: true
      },
    });

    cy.get('[data-cy="picklist-all-button"]').should('exist');
  });
});