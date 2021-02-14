import { fillAndSubmitPersonalDataForm, acceptAndSubmitConditionsForm, fillCreditCardInputsForm, fillOneTimePasswordForm, retriesDefault } from "../helpers/checkout";

describe('Aplazame - Checkout OK', () => {
    it('should visit Aplazame', () => {
        cy.visit('https://demo.aplazame.com')
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

    it('should accept and submit conditions form', retriesDefault, () => {
        acceptAndSubmitConditionsForm()
    })

    it('should fill personal data and submit customer form', retriesDefault, () => {
        fillAndSubmitPersonalDataForm('34084793N','14011984')
    })
    
    it('should fill credit card form in payment section', retriesDefault, () => {
        fillCreditCardInputsForm('4111111111111111','1125','123')
    })

    it('should submit credit card form success in payment section', retriesDefault, () => {
        cy.enter('#aplazame-checkout-iframe', { timeout: 10000 }).then(getBody => {
            cy.intercept('POST','/signin').as('signInRequest')
            getBody().find('form[name="checkout"]').as('formCheckout')
            cy.get('@formCheckout').submit()
            cy.wait('@signInRequest').its('response.statusCode').should('equal',201)
        })
    })

    it("should fill One Time Password form to accept the contract", retriesDefault, () => {
        fillOneTimePasswordForm()
    })

    it("should approve funding when accept the contract", retriesDefault, () => {
        cy.enter('#aplazame-checkout-iframe', { timeout: 10000 }).then(getBody => {
            cy.intercept('POST','/credit-request').as('postCreditRequest')
            cy.wait('@postCreditRequest').its('response.statusCode').should('equal',200)
            getBody().find('modal-upload-documentation ._success').as('modalSuccess').should('be.visible')
            cy.get('@modalSuccess').should('contain.text','La financiación ha sido aprobada')
        })
    })
})