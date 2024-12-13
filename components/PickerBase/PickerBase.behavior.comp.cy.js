import PickerBase from '@comps/PickerBase/PickerBase.vue';

describe('Test the PickerBase component behavior', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Check options property updates when the array reference changes', () => {
    const initOpts = ['Option 1', 'Option 2', 'Option 3'];
    const newOpts = ['Option A', 'Option B', 'Option C', 'Option D'];

    const readySpy = cy.spy().as('readySpy');

    cy.mount(PickerBase, {
      props: {
        onReady: readySpy,
        label: 'Picker',
        options: initOpts,
        invalidFeedbackText: 'Invalid feedback text.',
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('[data-cy="picker-options"]')
            .children()
            .eq(0)
            .should('have.text', 'Option 1');

          wrapper.setProps({ options: newOpts });

          cy.get('[data-cy="picker-options"]')
            .children()
            .eq(0)
            .should('have.text', 'Option A');
          cy.get('[data-cy="picker-options"]')
            .children()
            .eq(3)
            .should('have.text', 'Option D');
        });
    });
  });

  it('Check picked prop changes picker options', () => {
    const readySpy = cy.spy().as('readySpy');

    let initPicked = ['Option 1', 'Option 3'];
    let newPicked = ['Option 2'];

    cy.mount(PickerBase, {
      props: {
        onReady: readySpy,
        label: 'Picker',
        options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        picked: initPicked,
        invalidFeedbackText: 'Invalid feedback text.',
      },
    }).then(({ wrapper }) => {
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

          wrapper.setProps({ picked: newPicked });

          cy.get('[data-cy="picker-options"]')
            .find('input')
            .eq(0)
            .should('not.be.checked');
          cy.get('[data-cy="picker-options"]')
            .find('input')
            .eq(1)
            .should('be.checked');
          cy.get('[data-cy="picker-options"]')
            .find('input')
            .eq(2)
            .should('not.be.checked');
        });
    });
  });

  it('Check showValidityStyling prop is reactive', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(PickerBase, {
      props: {
        onReady: readySpy,
        required: true,
        label: 'Picker',
        options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        invalidFeedbackText: 'Invalid feedback text.',
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('[data-cy="picker-options"]')
            .find('input')
            .eq(0)
            .should('not.have.class', 'is-invalid');

          wrapper.setProps({ showValidityStyling: true });

          cy.get('[data-cy="picker-options"]')
            .find('input')
            .eq(0)
            .should('have.class', 'is-invalid');
        });
    });
  });

  it('All button selects all beds if none selected', () => {
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
        cy.get('[data-cy="picker-all-button"]').click();
        cy.get('[data-cy="picker-options"]')
          .find('input')
          .each((input) => {
            cy.wrap(input).should('be.checked');
          });
      });
  });

  it('All button selects all beds if some but not all selected', () => {
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
        cy.get('[data-cy="picker-all-button"]').click();
        cy.get('[data-cy="picker-options"]')
          .find('input')
          .each((input) => {
            cy.wrap(input).should('be.checked');
          });
      });
  });

  it('All button clears all beds if all selected', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(PickerBase, {
      props: {
        onReady: readySpy,
        label: 'Picker',
        options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        picked: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        invalidFeedbackText: 'Invalid feedback text.',
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="picker-all-button"]').click();
        cy.get('[data-cy="picker-options"]')
          .find('input')
          .each((input) => {
            cy.wrap(input).should('not.be.checked');
          });
      });
  });

  it('Changing option adjusts picked options if necessary', () => {
    const readySpy = cy.spy().as('readySpy');
    const updateSpy = cy.spy().as('updateSpy');

    const newOpts = ['Option 2', 'Option 4'];

    cy.mount(PickerBase, {
      props: {
        onReady: readySpy,
        'onUpdate:picked': updateSpy,
        required: true,
        label: 'Picker',
        options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        picked: ['Option 1', 'Option 2', 'Option 3'],
        invalidFeedbackText: 'Invalid feedback text.',
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          wrapper.setProps({ options: newOpts });
          cy.get('@updateSpy').should('have.been.calledOnce');
          cy.get('@updateSpy').should('have.been.calledWith', ['Option 2']);
        });
    });
  });
  
  it('should initially show "✅ All" when no items are selected', () => {
    cy.get('[data-cy="picker-all-button"]')
      .should('contain', '✅ All');
  });

  it('should show "🚫 All" when all items are selected', () => {
    cy.get('[data-cy="picker-all-button"]').click();
    
    cy.get('[data-cy="picker-all-button"]')
      .should('contain', '🚫 All');
    
    cy.get('[data-cy="picker-options"]')
      .find('input[type="checkbox"]')
      .should('have.length', 3)
      .should('be.checked');
  });

  it('should toggle between selecting all and none when clicked', () => {
    cy.get('[data-cy="picker-options"]')
      .find('input[type="checkbox"]:checked')
      .should('have.length', 0);
    
    cy.get('[data-cy="picker-all-button"]').click();
    cy.get('[data-cy="picker-options"]')
      .find('input[type="checkbox"]:checked')
      .should('have.length', 3);
    cy.get('[data-cy="picker-all-button"]')
      .should('contain', '🚫 All');
    
    cy.get('[data-cy="picker-all-button"]').click();
    cy.get('[data-cy="picker-options"]')
      .find('input[type="checkbox"]:checked')
      .should('have.length', 0);
    cy.get('[data-cy="picker-all-button"]')
      .should('contain', '✅ All');
  });

  it('should update button text when selections are made manually', () => {
    cy.get('[data-cy="picker-options"]')
      .find('input[type="checkbox"]')
      .each(($checkbox) => {
        cy.wrap($checkbox).click();
      });
    
    cy.get('[data-cy="picker-all-button"]')
      .should('contain', '🚫 All');
    
    cy.get('[data-cy="picker-options"]')
      .find('input[type="checkbox"]')
      .first()
      .click();
    
    cy.get('[data-cy="picker-all-button"]')
      .should('contain', '✅ All');
  });

  it('should emit correct picked values when using All button', () => {
    const onUpdatePicked = cy.spy().as('updatePickedSpy');

    cy.mount(PickerBase, {
      props: {
        label: 'Test Picker',
        invalidFeedbackText: 'Please select at least one option',
        options: ['Option 1', 'Option 2', 'Option 3'],
        showAllButton: true,
        required: false,
        'onUpdate:picked': onUpdatePicked
      }
    });

    cy.get('[data-cy="picker-all-button"]').click();
    
    cy.get('@updatePickedSpy').should('have.been.calledWith', ['Option 1', 'Option 2', 'Option 3']);
    
    cy.get('[data-cy="picker-all-button"]').click();
    
    cy.get('@updatePickedSpy').should('have.been.calledWith', []);
  });
});
