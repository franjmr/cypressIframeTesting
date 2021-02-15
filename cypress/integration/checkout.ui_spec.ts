import { retriesDefault, cleantNonBreakingSpace } from "../helpers/checkout";

describe('Aplazame - Checkout User Interface', () => {
    
    context('Shopping Cart', () =>{

        it('should visit Aplazame', () => {
            cy.visit('https://demo.aplazame.com');
        })

        it('should display two sections in checkout', () => {
            cy.get('.sections').find('section').should('have.length', 2)
        })

        it('should display article section', () => {
            cy.get('.sections').find('section.section-box:not(.cart-list)').should('have.length',1).and('be.visible').as('article')
            cy.get('@article').find('.img-wrapper').should('have.length', 1)
        })

        it('should display shopping cart section', () => {
            cy.get('.sections').find('section.section-box.cart-list').should('have.length',1).and('be.visible').as('cart-list')
            cy.get('@cart-list').find('ul li').as('cart-list-items')
            cy.get('@cart-list').find('.total-wrapper').as('total-wrapper')

            cy.get('@cart-list-items').find('.img-wrapper').should('have.length', 3)
            cy.get('@cart-list-items').find('.concept').should('have.length', 2)
            cy.get('@cart-list-items').find('.price').should('have.length', 5)
            cy.get('@total-wrapper').find('.price').should('be.visible').and('have.text', '130,14€')
        })
    
        it('should display deferred payment widget', retriesDefault, () => {
            cy.iframe().should('be.visible')
        })
    
        it('should click button to pay with Aplazame', () => {
            cy.get('button.pay-with-aplazame').should('be.visible').click()
        })
    })

    context('Modal Checkout', () =>{

        describe('Conditions', () => {

            beforeEach(() => {
                cy.enter('#aplazame-checkout-iframe', { timeout: 10000 }).then(getBody => {
                    getBody().find('section.conditions-section').as('sectionConditions')
                    getBody().find('section-summary').as('sectionSummary')
                })
            })

            it('should display conditions section', () => {
                cy.get('@sectionConditions').find('.order-amount').should('be.visible').invoke('text').then((text: string) => {
                    expect(cleantNonBreakingSpace(text)).equal('130,14 €');
                });
                cy.get('@sectionConditions').find('.button-num-instalments').should('be.visible').and('have.text', '13 pagos')
                cy.get('@sectionConditions').find('.button-payday').should('be.visible').and('have.text', 'día 15')
            })

            it('should display summary section', () => {
                cy.get('@sectionSummary').find('section-summary-amounts').as('sectionSummaryAmounts')
                cy.get('@sectionSummaryAmounts').find('.amounts-section').should('have.length', 3)
                cy.get('@sectionSummaryAmounts').find('._first .-value').should('be.visible').invoke('text').then((text: string) => {
                    expect(cleantNonBreakingSpace(text)).equal('10,76 €');
                });
                cy.get('@sectionSummaryAmounts').find('._second .-value').should('be.visible').invoke('text').then((text: string) => {
                    expect(cleantNonBreakingSpace(text)).equal('10,76 €/mes');
                });
                cy.get('@sectionSummaryAmounts').find('._last .-value').should('be.visible').invoke('text').then((text: string) => {
                    expect(cleantNonBreakingSpace(text)).equal('139,90 €');
                });
            })
        })
        
        describe('Summary Details', () => {
            beforeEach(() => {
                cy.enter('#aplazame-checkout-iframe', { timeout: 10000 }).then(getBody => {
                    getBody().find('.summary-details').as('summaryDetails')
                })
            })

            it('should display summary pie', retriesDefault, () => {
                cy.get('@summaryDetails').find('section-summary-pie').as('sectionSummaryPie')
                cy.get('@sectionSummaryPie').should('be.visible')
            })

            it('should display summary legend', retriesDefault, () => {
                cy.get('@summaryDetails').find('section-summary-legend').as('sectionSummaryLegend')
                cy.get('@sectionSummaryLegend').should('be.visible')
                cy.get('@sectionSummaryLegend').find('.-downpayment-amount > dd').should('be.visible').invoke('text').then((text: string) => {
                    expect(cleantNonBreakingSpace(text)).equal('10,76 €');
                });
                cy.get('@sectionSummaryLegend').find('.-loan-amount > dd').should('be.visible').invoke('text').then((text: string) => {
                    expect(cleantNonBreakingSpace(text)).equal('119,38 €');
                });
                cy.get('@sectionSummaryLegend').find('.-interest-amount > dd').should('be.visible').invoke('text').then((text: string) => {
                    expect(cleantNonBreakingSpace(text)).equal('9,76 €');
                });
            })
        })
    })
})