describe('Aplazame - Checkout PENDING', () => {
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
            cy.get('@formCheckout').find('input[name=document_id]').click().clear().type('99999995C')
            cy.get('@formCheckout').find('input[name=birthday]').click().clear().type('14011984', {delay: 100})
            cy.get('@formCheckout').find('input[type="checkbox"]').click()
            cy.get('@formCheckout').find('button[type=submit]').click()
        })
    })
    
    it('should submit customer form', {
        retries: {
          runMode: 2,
          openMode: 1
        }
      }, () => {
        cy.enter('#aplazame-checkout-iframe', { timeout: 10000 }).then(getBody => {
            getBody().find('[name=cta]').as('ctaCheckout').should('be.visible')
            cy.get('@ctaCheckout').find('button').should('be.visible').click()
        })
    })

    it("should accept the credit", {
        retries: {
          runMode: 2,
          openMode: 1
        }
      }, () => {
        cy.enter('#aplazame-checkout-iframe', { timeout: 10000 }).then(getBody => {
            getBody().find('#aplazame----otp----signature').as('otpSignature')
            cy.get('@otpSignature').find('.-sms-sent', {timeout: 10000}).should('contain.text','Te hemos enviado un PIN al')
            cy.get('@otpSignature').find('#OtpSecureContainer', {timeout: 10000}).should('be.visible')
        })
    })

    it("should fill One Time Password", {
        retries: {
          runMode: 2,
          openMode: 1
        }
      }, () => {
        cy.enter('#aplazame-checkout-iframe', { timeout: 10000 }).then(getBody => {
            getBody().find('#sandbox').as('sandbox').should('be.visible')
            getBody().find('#OtpSecureInput').as('optSecureInput').should('be.visible')
            cy.get('@sandbox').invoke('text').then( (text: string) => {
                const sandboxNumber = text.match(/\d/g);
                return sandboxNumber.join('')
            }).then( sandboxNumber => {
                cy.get('@optSecureInput').clear().click().type(sandboxNumber, {delay: 100})
            })
        })
    })

    
    it("should verify identity to approve funding", {
        retries: {
          runMode: 2,
          openMode: 1
        }
      }, () => {
        cy.enter('#aplazame-checkout-iframe', { timeout: 10000 }).then(getBody => {
            getBody().find('modal-upload-documentation').as('modalUploadDocumentation').should('be.visible')
            getBody().find('form[name=challenge_document_id]').as('formDocumentId').should('exist')
            cy.get('@modalUploadDocumentation').should('contain.text','Verifica tu identidad')
            cy.get('@modalUploadDocumentation').find('form[name=challenge_document_id]').should('exist')
            cy.get('@modalUploadDocumentation').find('#drop-front-area').as("frontIdCard").should('be.visible')
            cy.get('@modalUploadDocumentation').find('#drop-back-area').as("backIdCard").should('be.visible')
            cy.get('@frontIdCard').attachFile('front-id-card-correct.jpg', { subjectType: 'drag-n-drop' });
            cy.get('@backIdCard').attachFile('front-id-card-correct.jpg', { subjectType: 'drag-n-drop' });
            cy.get('@modalUploadDocumentation').find('div[message="challenges.upload_files.attached"]').should('be.visible').should('have.length',2)
            cy.get('@formDocumentId').submit()
        })
    })

    it("No hemos podido validar automáticamente la documentación que nos has adjuntado", {
        retries: {
          runMode: 2,
          openMode: 1
        }
      }, () => {
        cy.enter('#aplazame-checkout-iframe', { timeout: 10000 }).then(getBody => {
            getBody().find('.-result-content').as('resultContent').should('be.visible')
            cy.get('@resultContent').find('-result-title').should('contain.text','Lo sentimos')
            cy.get('@resultContent').find('-result-description').should('contain.text','No hemos podido validar automáticamente la documentación que nos has adjuntado')
        })
    })
})