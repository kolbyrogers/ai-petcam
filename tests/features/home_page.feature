Feature: Home page
    As an AI Petcam user,
    I want the home page to function as expected,
    So that I can navigate to the expected pages and see the event feed.

    Scenario: Event feed shows on home page
        Given I navigate to AI Petcam
        Then I expect to see the event feed

    Scenario: Home page has navigation
        Given I navigate to AI Petcam
        Then I expect to see the navigation button

    Scenario: Navigation button opens navigation
        Given I navigate to AI Petcam
        When I click the navigation button
        Then I expect to see the navigation drawer