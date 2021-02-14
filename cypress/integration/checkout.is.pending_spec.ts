import { retriesDefault, acceptAndSubmitConditionsForm, fillAndSubmitPersonalDataForm, fillOneTimePasswordForm, uploadDocumentation } from "../helpers/checkout";

describe('Aplazame - Checkout PENDING', () => {
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

    it('should accept and submit conditions form', retriesDefault, () => {
        acceptAndSubmitConditionsForm()
    })

    it('should fill personal data and submit customer form', retriesDefault, () => {
        fillAndSubmitPersonalDataForm('99999995C','14011984')
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

    it("should verify identity to approve funding", retriesDefault, () => {
        uploadDocumentation()
        cy.enter('#aplazame-checkout-iframe', { timeout: 10000 }).then(getBody => {
            getBody().find('modal-upload-documentation').as('modalUploadDocumentation')
            cy.get('@modalUploadDocumentation').find('div[message="challenges.upload_files.attached"]').should('be.visible').should('have.length',2)
        })
    })

    it('should not validate automatically the attached documentation', retriesDefault, () => {
        cy.enter('#aplazame-checkout-iframe', { timeout: 10000 }).then(getBody => {
            cy.intercept('POST','/credit-request').as('postCreditRequest')
            getBody().find('modal-upload-documentation').as('modalUploadDocumentation')
            cy.get('@modalUploadDocumentation').find('form[name=challenge_document_id]').as('formDocumentId').should('exist')
            cy.get('@formDocumentId').submit()

            cy.wait('@postCreditRequest').its('response.statusCode').should('equal',403)    
            getBody().find('.-result-content').as('resultContent').should('be.visible')
            cy.get('@resultContent').find('.-result-title').should('contain.text','Lo sentimos')
            cy.get('@resultContent').find('.-result-description').should('contain.text','No hemos podido validar automáticamente la documentación que nos has adjuntado')
        })
    })
})