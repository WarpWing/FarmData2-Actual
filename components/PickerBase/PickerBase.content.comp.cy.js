import PickerBase from '@comps/PickerBase/PickerBase.vue';

describe('Test the default PickerBase content', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Check required and default props', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(PickerBase, {
      props: {
        onReady: readySpy,
        label: 'Picker',
        options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        invalidFeedbackText: 'Invalid feedback text.',
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="picker-group"]').should('exist');
        cy.get('[data-cy="picker-label"]').should('have.text', 'Picker:');
        cy.get('[data-cy="picker-required"]').should('not.exist');
        cy.get('[data-cy="picker-input"]').should('exist');

        cy.get('[data-cy="picker-options"]')
          .children()
          .should('have.length', 4);

        cy.get('[data-cy="picker-options"]')
          .children()
          .eq(0)
          .should('have.text', 'Option 1');
        cy.get('[data-cy="picker-options"]')
          .find('input')
          .eq(0)
          .should('not.be.checked');

        cy.get('[data-cy="picker-options"]')
          .children()
          .eq(3)
          .should('contain.text', 'Option 4');
        cy.get('[data-cy="picker-options"]')
          .find('input')
          .eq(3)
          .should('not.be.checked');

        cy.get('[data-cy="picker-all-button"]').should('exist');

        cy.get('[data-cy="picker-invalid-feedback"]').should(
          'contain.text',
          'Invalid feedback text.'
        );
        cy.get('[data-cy="picker-invalid-feedback"]').should('not.be.visible');
      });
  });

  it('Test required prop', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(PickerBase, {
      props: {
        onReady: readySpy,
        label: 'Picker',
        options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        invalidFeedbackText: 'Invalid feedback text.',
        required: true,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="picker-required"]').should('exist');
      });
  });

  it('Test picked prop', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(PickerBase, {
      props: {
        onReady: readySpy,
        label: 'Picker',
        options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        picked: ['Option 1', 'Option 3'],
        invalidFeedbackText: 'Invalid feedback text.',
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="picker-options"]')
          .find('input')
          .eq(0)
          .should('be.checked');
        cy.get('[data-cy="picker-options"]')
          .find('input')
          .eq(1)
          .should('not.be.checked');
        cy.get('[data-cy="picker-options"]')
          .find('input')
          .eq(2)
          .should('be.checked');
        cy.get('[data-cy="picker-options"]')
          .find('input')
          .eq(3)
          .should('not.be.checked');
      });
  });

  it('Test showAllButton prop', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(PickerBase, {
      props: {
        onReady: readySpy,
        label: 'Picker',
        options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        showAllButton: false,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="picker-all-button"]').should('not.exist');
      });
  });

  it('Test showValidityStyling prop', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(PickerBase, {
      props: {
        onReady: readySpy,
        label: 'Picker',
        options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        required: true,
        invalidFeedbackText: 'Invalid feedback text.',
        showValidityStyling: true,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="picker-invalid-feedback"]').should('be.visible');

        cy.get('[data-cy="picker-options"]')
          .find('input')
          .eq(0)
          .should('have.class', 'is-invalid');
        cy.get('[data-cy="picker-options"]')
          .find('input')
          .eq(1)
          .should('have.class', 'is-invalid');
        cy.get('[data-cy="picker-options"]')
          .find('input')
          .eq(2)
          .should('have.class', 'is-invalid');
        cy.get('[data-cy="picker-options"]')
          .find('input')
          .eq(3)
          .should('have.class', 'is-invalid');
      });
  });

  it('Test All button shows "✅ All" initially with no selections', () => {
    cy.mount(PickerBase, {
      props: {
        label: 'Picker',
        options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        invalidFeedbackText: 'Invalid feedback text.',
      },
    });

    cy.get('[data-cy="picker-all-button"]').should('contain', '✅ All');
  });

  it('Test All button shows "🚫 All" when all items are selected', () => {
    cy.mount(PickerBase, {
      props: {
        label: 'Picker',
        options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        picked: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        invalidFeedbackText: 'Invalid feedback text.',
      },
    });

    cy.get('[data-cy="picker-all-button"]').should('contain', '🚫 All');
  });

  it('Test All button text toggles when clicked', () => {
    cy.mount(PickerBase, {
      props: {
        label: 'Picker',
        options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        invalidFeedbackText: 'Invalid feedback text.',
      },
    });

    cy.get('[data-cy="picker-all-button"]')
      .should('contain', '✅ All')
      .click()
      .should('contain', '🚫 All')
      .click()
      .should('contain', '✅ All');
  });

  it('Test All button text updates when options are selected individually', () => {
    cy.mount(PickerBase, {
      props: {
        label: 'Picker',
        options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        invalidFeedbackText: 'Invalid feedback text.',
      },
    });

    cy.get('[data-cy="picker-all-button"]').should('contain', '✅ All');
    
    cy.get('[data-cy="picker-options"]')
      .find('input')
      .each(($checkbox) => {
        cy.wrap($checkbox).click();
      });

    cy.get('[data-cy="picker-all-button"]').should('contain', '🚫 All');
    
    cy.get('[data-cy="picker-options"]')
      .find('input')
      .first()
      .click();

    cy.get('[data-cy="picker-all-button"]').should('contain', '✅ All');
  });
});