/// <reference types="Cypress" />

const testURL = 'https://www.phila.gov/jobs/'

describe('QA Analyst Exercise', () => {
  it('Look for any external 404 errors', () => {
    cy.visit(testURL)

    const findInPage = () => {
      cy.get(".jb-pagination .paginate-links li").last().then((el) => {
        cy.get(".jb-job-url a").each(link => {
          cy.request(link.prop('href'))
            .should((response) => {
              // only worried about 404's
              expect(response.status).to.not.eq(404)
            })
        })
        if (el.hasClass('disabled') || el.hasClass('number')) {
          // on last page, break out
          return
        }
        cy.wrap(el).click()
        findInPage()
      })
    }
    findInPage()
  })

  it('Ensure every job has a dept', () => {
    cy.visit(testURL)

    // assuming every dept will start with a letter
    const regex = /Offered by: [A-Za-z]+/

    const findInPage = () => {
      cy.get(".jb-pagination .paginate-links li").last().then((el) => {
        cy.get(".jb-job-dept").each((dept) => {
          expect(dept.text()).to.match(regex)
        })
        if (el.hasClass('disabled')) {
          // on last page, break out
          return
        }
        cy.wrap(el).click()
        findInPage()
      })
    }
    findInPage()
  })

  it('Ensure dept dropdown allways contains specified depts', () => {
    cy.visit(testURL)

    const deptList = ['Labor', 'Law', 'Revenue', 'Streets', 'Information Technology']

    deptList.forEach(d => {
      cy.get('#search-dropdown option').contains(d)
    })
  })
})