@login
Feature: Rocket login

  Scenario: Successful login
    Given I launch the Rocket application
    When I enter valid login credentials
    And I click on the Continue button
    Then I should be logged in successfully


