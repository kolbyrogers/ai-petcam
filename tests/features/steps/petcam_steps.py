import time


@step('I navigate to AI Petcam')
def step_impl(context):
    context.execute_steps('''
        Given I open the url "http://localhost:3000/"
        Then I wait on element "#app" to be visible
    ''')


@step('I expect to be on the home page')
def step_impl(context):
    context.execute_steps('''
        Then I wait on element "#home" to be visible

    ''')


@step('I expect to see the event feed')
def step_impl(context):
    context.execute_steps('''
        Then I wait on element "#feed" to be visible
    ''')


@step('I expect to see the navigation button')
def step_impl(context):
    context.execute_steps('''
        Then I wait on element "#nav" to be visible
    ''')


@step('I click the navigation button')
def step_impl(context):
    context.execute_steps('''
        Then I wait on element "#nav" to be visible
        When I click on the element "#nav"
    ''')


@step('I expect to see the navigation drawer')
def step_impl(context):
    context.execute_steps('''
        Then I wait on element "#nav-drawer" to be visible
    ''')


@step('I expect to see the navigation links')
def step_impl(context):
    context.execute_steps('''
        Then I wait on element "#nav-links" to be visible
    ''')
