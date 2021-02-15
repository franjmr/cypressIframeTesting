import { fillCreditCardInputsForm, retriesDefault, acceptAndSubmitConditionsForm, fillAndSubmitPersonalDataForm, data } from "../helpers/checkout";

describe('Aplazame - Checkout KO', () => {
    
    context('Shopping Cart', () =>{
        it('should visit Aplazame', () => {
            cy.visit('https://demo.aplazame.com');
        })
    
        it('should display deferred payment widget ', retriesDefault, () => {
            cy.enter('iframe', { timeout: 10000 }).then(getBody => {
                getBody().find('.aplazame-widget ').should('be.visible').as('aplazameWidget')
                cy.get('@aplazameWidget').find('.aplazame-widget-instalments').should('be.visible').as('instalments')
                cy.get('@instalments').find('select > option').should('have.length.greaterThan', 0)
            })
        })
    
        it('should click button to pay with Aplazame', () => {
            cy.get('button.pay-with-aplazame').should('be.visible').click()
        })
    })

    context('Modal Checkout', () =>{
        let testData: data
    
        before(()=>{
            testData = {
                documentId: '99999998T',
                birthday: '14011984',
                creditCard: {
                    number: '4111111111111111',
                    expiry: '1125',
                    cvv: '123'
                }
            }
        })

        it('should accept and submit conditions form', retriesDefault, () => {
            acceptAndSubmitConditionsForm()
        })
    
        it('should fill personal data and submit customer form', retriesDefault, () => {
            fillAndSubmitPersonalDataForm(testData.documentId, testData.birthday)
        })
        
        it('should fill credit card form in payment section', retriesDefault, () => {
            fillCreditCardInputsForm(testData.creditCard.number, testData.creditCard.expiry, testData.creditCard.expiry)
        })

        it("should not pass admission criteria when submit customer form", retriesDefault, () => {
            cy.enter('#aplazame-checkout-iframe', { timeout: 10000 }).then(getBody => {
                getBody().find('form[name="checkout"]').as('formCheckout')
                cy.intercept('POST','/signin').as('signInRequest')
                cy.get('@formCheckout').submit()
                
                cy.wait('@signInRequest').its('response.statusCode').should('equal',403)
                getBody().find('.-result-content').as('resultContent')
                cy.get('@resultContent').find('.-result-description').should('contain.text','Tu solicitud no cumple los criterios de admisión de crédito de Aplazame')
            })
        })
    })
})