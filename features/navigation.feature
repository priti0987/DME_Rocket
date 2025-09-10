@smoke
Feature: Navigation samples
  Scenario: Open home and verify title
    Given I open the base url
    Then page title contains "Example"

  Scenario: Follow the More Information link
    Given I open the base url
    When I click the first link on the page
    Then the page URL contains "iana.org"
