Feature: This is login feature. It has all scenario including positive and negative

  Scenario: Verify error message when user enters invalid credentials
    Given login page is launched 
    When user enters invalid credentials
    Then user should get error message
