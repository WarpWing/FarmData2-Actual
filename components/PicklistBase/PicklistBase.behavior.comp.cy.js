import PicklistBase from '@comps/PicklistBase/PicklistBase.vue';

describe('Test the PicklistBase component behavior', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('selects/deselects all rows using "All" button', () => {
    cy.mount(PicklistBase, {
      props: {
        rows: [
          { name: 'Item 1', quantity: 5, location: 'GHANA' },
          { name: 'Item 2', quantity: 3, location: 'GHANA' },
        ],
        columns: ['name', 'quantity', 'location'],
        labels: { name: 'Name', quantity: 'Quantity', location: 'Location' },
        picked: new Map(),
      },
    });

    cy.get('[data-cy="picklist-all-button"]').click();
    cy.get('[data-cy="picklist-checkbox-0"]').should('be.checked');
    cy.get('[data-cy="picklist-checkbox-1"]').should('be.checked');

    cy.get('[data-cy="picklist-all-button"]').click();
    cy.get('[data-cy="picklist-checkbox-0"]').should('not.be.checked');
    cy.get('[data-cy="picklist-checkbox-1"]').should('not.be.checked');

    cy.get('[data-cy="picklist-all-button"]').click();
    cy.get('[data-cy="picklist-checkbox-0"]').should('be.checked');
    cy.get('[data-cy="picklist-checkbox-1"]').should('be.checked');
  });

  it('selects/deselects all rows using "Units" button when units are set', () => {
    cy.mount(PicklistBase, {
      props: {
        rows: [
          { name: 'Item 1', quantity: 5, location: 'GHANA' },
          { name: 'Item 2', quantity: 3, location: 'GHANA' },
        ],
        columns: ['name', 'quantity', 'location'],
        labels: { name: 'Name', quantity: 'Quantity', location: 'Location' },
        picked: new Map(),
        units: 'Trays',
        quantityAttribute: 'quantity',
      },
    });

    cy.get('[data-cy="picklist-units-button"]').click();
    cy.get('[data-cy="picklist-quantity-0"]').should('have.value', '5');
    cy.get('[data-cy="picklist-quantity-1"]').should('have.value', '3');

    cy.get('[data-cy="picklist-units-button"]').click();
    cy.get('[data-cy="picklist-quantity-0"]').should('have.value', '0');
    cy.get('[data-cy="picklist-quantity-1"]').should('have.value', '0');
  });

  it('sorts rows correctly and updates picked rows and quantities', () => {
    cy.mount(PicklistBase, {
      props: {
        rows: [
          { name: 'Item B', quantity: 2, location: 'GHANA' },
          { name: 'Item A', quantity: 4, location: 'GHANA' },
        ],
        columns: ['name', 'quantity', 'location'],
        labels: { name: 'Name', quantity: 'Quantity', location: 'Location' },
        picked: new Map([
          [0, { picked: 2 }],
          [1, { picked: 3 }],
        ]),
        units: 'Trays',
        quantityAttribute: 'quantity',
      },
    });

    cy.get('[data-cy="picklist-sort-button-name"]').click();
    cy.get('[data-cy="picklist-row-0"]').contains('Item A');
    cy.get('[data-cy="picklist-row-1"]').contains('Item B');
    cy.get('[data-cy="picklist-quantity-0"]').should('have.value', '3');
    cy.get('[data-cy="picklist-quantity-1"]').should('have.value', '2');

    cy.get('[data-cy="picklist-sort-button-name"]').click();
    cy.get('[data-cy="picklist-row-0"]').contains('Item B');
    cy.get('[data-cy="picklist-row-1"]').contains('Item A');
    cy.get('[data-cy="picklist-quantity-0"]').should('have.value', '2');
    cy.get('[data-cy="picklist-quantity-1"]').should('have.value', '3');

    cy.get('[data-cy="picklist-sort-button-name"]').click();
    cy.get('[data-cy="picklist-row-0"]').contains('Item A');
    cy.get('[data-cy="picklist-row-1"]').contains('Item B');
    cy.get('[data-cy="picklist-quantity-0"]').should('have.value', '3');
    cy.get('[data-cy="picklist-quantity-1"]').should('have.value', '2');
  });

  it('Checks sort order is preserved across data change', () => {
    // Initial mounting of the component with the first set of data
    cy.mount(PicklistBase, {
      props: {
        rows: [
          { name: 'Item B', quantity: 2, location: 'GHANA' },
          { name: 'Item A', quantity: 4, location: 'GHANA' },
        ],
        columns: ['name', 'quantity', 'location'],
        labels: { name: 'Name', quantity: 'Quantity', location: 'Location' },
        picked: new Map([
          [0, { picked: 2 }],
          [1, { picked: 4 }],
        ]),
        units: 'Trays',
        quantityAttribute: 'quantity',
      },
    });

    // Apply initial sort by name in ascending order
    cy.get('[data-cy="picklist-sort-button-name"]').click();
    cy.get('[data-cy="picklist-row-0"]').contains('Item A');
    cy.get('[data-cy="picklist-row-1"]').contains('Item B');

    // Update the props to load new data
    cy.wrap({
      updateProps: (props) => {
        Cypress.vueWrapper.setProps(props);
      },
    }).invoke('updateProps', {
      rows: [
        { name: 'Item D', quantity: 1, location: 'GHANA' },
        { name: 'Item C', quantity: 6, location: 'GHANA' },
      ],
      picked: new Map([
        [0, { picked: 1 }],
        [1, { picked: 6 }],
      ]),
    });

    // Verify the new data is sorted correctly in ascending order by name
    cy.get('[data-cy="picklist-row-0"]').contains('Item C');
    cy.get('[data-cy="picklist-row-1"]').contains('Item D');
  });

  it('disables picklist buttons when info overlay is shown', () => {
    cy.mount(PicklistBase, {
      props: {
        rows: [
          { name: 'Item 1', quantity: 5, location: 'GHANA', details: 'Info 1' },
          { name: 'Item 2', quantity: 3, location: 'GHANA', details: 'Info 2' },
        ],
        columns: ['name', 'quantity', 'location'],
        labels: { name: 'Name', quantity: 'Quantity', location: 'Location', details: 'Details' },
        picked: new Map(),
        showInfoIcons: true
      },
    });

    cy.get('[data-cy="picklist-info-icon-0"]').click();
    cy.get('[data-cy="picklist-all-button"]').should('be.disabled');
    cy.get('[data-cy="picklist-checkbox-0"]').should('be.disabled');
  });

  it('toggles between checkmark and x icons for All button', () => {
    cy.mount(PicklistBase, {
      props: {
        rows: [
          { name: 'Item 1', quantity: 5, location: 'GHANA' },
          { name: 'Item 2', quantity: 3, location: 'GHANA' },
        ],
        columns: ['name', 'quantity', 'location'],
        labels: { name: 'Name', quantity: 'Quantity', location: 'Location' },
        picked: new Map(),
      },
    });

    cy.get('[data-cy="picklist-all-button"]').contains('✅ All');
    cy.get('[data-cy="picklist-all-button"]').click();
    cy.get('[data-cy="picklist-all-button"]').contains('🚫 All');
    cy.get('[data-cy="picklist-all-button"]').click();
    cy.get('[data-cy="picklist-all-button"]').contains('✅ All');
  });

  it('toggles between checkmark and x icons for Units button', () => {
    cy.mount(PicklistBase, {
      props: {
        rows: [
          { name: 'Item 1', quantity: 5, location: 'GHANA' },
          { name: 'Item 2', quantity: 3, location: 'GHANA' },
        ],
        columns: ['name', 'quantity', 'location'],
        labels: { name: 'Name', quantity: 'Quantity', location: 'Location' },
        picked: new Map(),
        units: 'Trays',
        quantityAttribute: 'quantity',
      },
    });

    cy.get('[data-cy="picklist-units-button"]').contains('✅ Trays');
    cy.get('[data-cy="picklist-units-button"]').click();
    cy.get('[data-cy="picklist-units-button"]').contains('🚫 Trays');
    cy.get('[data-cy="picklist-units-button"]').click();
    cy.get('[data-cy="picklist-units-button"]').contains('✅ Trays');
  });

  it('hides header button when showAllButton is false', () => {
    cy.mount(PicklistBase, {
      props: {
        rows: [
          { name: 'Item 1', quantity: 5, location: 'GHANA' },
          { name: 'Item 2', quantity: 3, location: 'GHANA' },
        ],
        columns: ['name', 'quantity', 'location'],
        labels: { name: 'Name', quantity: 'Quantity', location: 'Location' },
        picked: new Map(),
        showAllButton: false
      },
    });

    cy.get('[data-cy="picklist-all-button"]').should('not.exist');
  });
});