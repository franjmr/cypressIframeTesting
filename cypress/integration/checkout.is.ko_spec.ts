describe('Aplazame - Checkout KO', () => {
    it('should visit Aplazame', () => {
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

    it('should accept and submit checkout form', {
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

    it('should fill personal data and submit customer form', {
        retries: {
          runMode: 2,
          openMode: 1
        }
      }, () => {
        cy.enter('#aplazame-checkout-iframe', { timeout: 10000 }).then(getBody => {
            getBody().find('form[name="checkout"]').as('formCheckout')
            cy.get('@formCheckout').should('be.visible')
            cy.get('@formCheckout').find('input[name=document_id]').click().clear().type('99999998T')
            cy.get('@formCheckout').find('input[name=birthday]').click().clear().type('14011984', {delay: 100})
            cy.get('@formCheckout').find('input[type="checkbox"]').click()
            cy.get('@formCheckout').find('button[type=submit]').click()
        })
    })
    
    it('should fill payment section and submit customer form', {
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

            cy.get('@ccNumber').find("div.__PrivateStripeElement").each(($li, index, $lis) => {
                return new Cypress.Promise((resolve) => {
                    const iframe = $li.find('iframe[name*="__privateStripeFrame"]')
                    if(iframe.contents() && iframe.contents().find('.InputElement').length == 1){
                        const input = iframe.contents().find('.InputElement')
                        cy.wrap(input).click().clear().type('4111 1111 1111 1111', {delay: 100 })
                        resolve()
                    }else{
                        iframe.on('load', function(){
                            const document = (this as any).contentWindow.document
                            const root = document.getElementById("root")
                            const input = root.getElementsByClassName('InputElement')
                            cy.wrap(input[0]).click().clear().type('4111 1111 1111 1111', {delay: 100 })
                            resolve()
                        })
                    }
                })
            }).then(($lis) => {
                expect($lis).to.have.length(1)
            })

            cy.get('@ccExpiry').find("div.__PrivateStripeElement").each(($li, index, $lis) => {
                return new Cypress.Promise((resolve) => {
                    const iframe = $li.find('iframe[name*="__privateStripeFrame"]')
                    if(iframe.contents()!= null){
                        const input = iframe.contents().find('.InputElement')
                        cy.wrap(input).click().clear().type('1125', {delay: 100 })
                        resolve()
                    }else{
                        iframe.on('load', function(){
                            const document = (this as any).contentWindow.document
                            const root = document.getElementById("root")
                            const input = root.getElementsByClassName('InputElement')
                            cy.wrap(input[0]).click().clear().type('1125', {delay: 100 })
                            resolve()
                        })
                    }
                })
            }).then(($lis) => {
                expect($lis).to.have.length(1)
            })

            cy.get('@ccCvv').find("div.__PrivateStripeElement").each(($li, index, $lis) => {
                return new Cypress.Promise((resolve) => {
                    const iframe = $li.find('iframe[name*="__privateStripeFrame"]')
                    if(iframe.contents()!= null){
                        const input = iframe.contents().find('.InputElement')
                        cy.wrap(input).click().clear().type('123', {delay: 100 })
                        resolve()
                    }else{
                        iframe.on('load', function(){
                            const document = (this as any).contentWindow.document
                            const root = document.getElementById("root")
                            const input = root.getElementsByClassName('InputElement')
                            cy.wrap(input[0]).click().clear().type('123', {delay: 100 })
                            resolve()
                        })
                    }
                })
            }).then(($lis) => {
                expect($lis).to.have.length(1)
            })

            cy.intercept('POST','/signin').as('signInRequest')
            cy.get('@formCheckout').submit()
            cy.wait('@signInRequest').its('response.statusCode').should('equal',403)
        })
    })

    it("should not pass admission criteria", {
        retries: {
          runMode: 2,
          openMode: 1
        }
      }, () => {
        cy.enter('#aplazame-checkout-iframe', { timeout: 10000 }).then(getBody => {
            getBody().find('.-result-content').as('resultContent')
            cy.get('@resultContent').find('.-result-title').should('contain.text','¡Lo sentimos!')
            cy.get('@resultContent').find('.-result-description').should('contain.text','Tu solicitud no cumple los criterios de admisión de crédito de Aplazame')
        })
    })
})