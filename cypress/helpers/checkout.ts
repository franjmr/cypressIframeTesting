function setValueCreditCardInput(element: Cypress.Chainable<JQuery<HTMLElement>>, value:string):void {
    element.find("div.__PrivateStripeElement").each(($li, index, $lis) => {
        return new Cypress.Promise((resolve) => {
            const iframe = $li.find('iframe[name*="__privateStripeFrame"]')
            if(iframe.contents() && iframe.contents().find('.InputElement').length === 1){
                const input = iframe.contents().find('.InputElement')
                cy.wrap(input).click().clear().type(value, {delay: 100 })
                resolve()
            }else{
                iframe.on('load', function(){
                    const document = (this as HTMLIFrameElement).contentWindow.document
                    const root = document.getElementById("root")
                    const inputs = root.getElementsByClassName('InputElement')
                    cy.wrap(inputs[0]).click().clear().type(value, {delay: 100 })
                    resolve()
                })
            }
        })
    }).then(($lis) => {
        expect($lis).to.have.length(1)
    })
}

export function fillCreditCardInputsForm(ccNumber:string, ccExpiry: string, ccCvv:string ): void{
    cy.enter('#aplazame-checkout-iframe', { timeout: 10000 }).then(getBody => {
        getBody().find('form[name="checkout"]').as('formCheckout')
        cy.get('@formCheckout').find('.-cc-number').as('ccNumber')
        cy.get('@formCheckout').find('.-cc-expiry').as('ccExpiry')
        cy.get('@formCheckout').find('.-cc-cvv').as('ccCvv')
    
        setValueCreditCardInput(cy.get('@ccNumber'), ccNumber)
        setValueCreditCardInput(cy.get('@ccExpiry'), ccExpiry)
        setValueCreditCardInput(cy.get('@ccCvv'), ccCvv)
    })
}

export function fillAndSubmitPersonalDataForm(documentIdValue: string, birthdayValue: string):void {
    cy.enter('#aplazame-checkout-iframe', { timeout: 10000 }).then(getBody => {
        getBody().find('form[name="checkout"]').as('formCheckout')
        cy.get('@formCheckout').find('input[name=document_id]').click().clear().type(documentIdValue)
        cy.get('@formCheckout').find('input[name=birthday]').click().clear().type(birthdayValue, {delay: 100})
        cy.get('@formCheckout').find('input[type="checkbox"]').click()
        cy.get('@formCheckout').submit()
    })
}

export function acceptAndSubmitConditionsForm(): void {
    cy.enter('#aplazame-checkout-iframe', { timeout: 10000 }).then(getBody => {
        getBody().find('form[name="checkout"]').as('formCheckout')
        cy.get('@formCheckout').find('[name=conditions]')
        cy.get('@formCheckout').find('[name=gdpr_conditions]')
        cy.get('@formCheckout').find('[name=accepts_gdpr]').click()
        cy.get('@formCheckout').submit()
    })
}

export function fillOneTimePasswordForm(): void {
    cy.enter('#aplazame-checkout-iframe', { timeout: 10000 }).then(getBody => {
        getBody().find('#aplazame----otp----signature').as('otpSignature')
        getBody().find('#sandbox').as('sandbox')
        getBody().find('#OtpSecureInput').as('optSecureInput')
        cy.get('@otpSignature').find('#OtpSecureContainer', {timeout: 10000})
        cy.get('@sandbox').invoke('text').then( (sandboxText: string) => {
            const sandboxNumbers = sandboxText.match(/\d/g);
            return sandboxNumbers.join('')
        }).then( sandboxNumber => {
            cy.get('@optSecureInput').clear().click().type(sandboxNumber, {delay: 100})
        })
    })
}

export function uploadDocumentation(): void {
    cy.enter('#aplazame-checkout-iframe', { timeout: 10000 }).then(getBody => {
        getBody().find('modal-upload-documentation').as('modalUploadDocumentation')
        cy.get('@modalUploadDocumentation').find('#drop-front-area').as("frontIdCard")
        cy.get('@modalUploadDocumentation').find('#drop-back-area').as("backIdCard")
        cy.get('@frontIdCard').attachFile('front-id-card-correct.jpg', { subjectType: 'drag-n-drop' });
        cy.get('@backIdCard').attachFile('front-id-card-correct.jpg', { subjectType: 'drag-n-drop' });
    })
}

export const retriesDefault: Partial<Cypress.ResolvedConfigOptions> = {
    retries : {
        runMode: 2,
        openMode: 1
    }
}