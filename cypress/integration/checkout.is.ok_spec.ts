describe('Aplazame - Checkout', () => {
    it('should visit Aplazame url', () => {
        cy.visit('https://demo.aplazame.com');
        cy.get('article').should('be.visible')
    })

    it('should display pay type widget title in iframe', {
        retries: {
          runMode: 2,
          openMode: 1
        }
      }, () => {
        cy.enter('iframe', { timeout: 10000 }).then(getBody => {
            getBody().find('.aplazame-widget-smart-title').should('be.visible')
            getBody().find('.aplazame-widget-smart-title').should('have.text','¡Págalo a plazos!')
        })
    })

    it('should click button to pay', () => {
        cy.get('button.pay-with-aplazame').as('buttonPay')
        cy.get('@buttonPay').click()
    })

    it('should submit modal checkout', {
        retries: {
          runMode: 2,
          openMode: 1
        }
      }, () => {
        cy.enter('#aplazame-checkout-iframe', { timeout: 10000 }).then(getBody => {
            getBody().find('form[name="checkout"]').as('formCheckout')
            cy.get('@formCheckout').should('be.visible')
            cy.get('@formCheckout').find('input[name=accepts_gdpr]').click()
            cy.get('@formCheckout').find('button[type=submit]').click()
        })
    })

    it('should fill personal data in the customer form', {
        retries: {
          runMode: 2,
          openMode: 1
        }
      }, () => {
        cy.enter('#aplazame-checkout-iframe', { timeout: 10000 }).then(getBody => {
            getBody().find('form[name="checkout"]').as('formCheckout')
            cy.get('@formCheckout').should('be.visible')
            cy.get('@formCheckout').find('input[name=document_id]').click().clear().type('34084793N')
            cy.get('@formCheckout').find('input[name=birthday]').click().clear().type('14011984', {delay: 100})
            cy.get('@formCheckout').find('input[type="checkbox"]').click()
            cy.get('@formCheckout').find('button[type=submit]').click()
        })
    })

    it('should fill payment section in the customer form', {
        retries: {
          runMode: 2,
          openMode: 1
        }
      }, () => {
        cy.enter('#aplazame-checkout-iframe', { timeout: 10000 }).then(getBody => {
            getBody().find('form[name="checkout"]').as('formCheckout')
            cy.get('@formCheckout').find('.-cc-inputs-slider').should('be.visible')
            cy.get('@formCheckout').find('.-cc-number').as('ccNumber').should('be.visible')
            cy.get('@formCheckout').find('.-cc-expiry').as('ccExpiry').should('be.visible')
            cy.get('@formCheckout').find('.-cc-cvv').as('ccCvv').should('be.visible')
        })
    })

        /**
        cy.get('section-payment-methods').as('sectionPaymentMethods')
        cy.get('@sectionPaymentMethods').should('be.visible')
        cy.enter('#aplazame-checkout-iframe', { timeout: 10000 }).then(getBody => {
            getBody().enter('[name*="__privateStripeFrame"]', { timeout: 10000 }).then(getBody => {
                getBody().find('input[name="cardnumber"]').click().type('4111111111111111', {delay: 400})
                getBody().find('input[name="cardExpiry"]').click().type('1125', {delay: 400})
                getBody().find('input[name="cardCvc"]').click().type('123', {delay: 400})
            })
        })
        */
    
})