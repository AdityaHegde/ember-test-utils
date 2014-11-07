YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "EmberTests.MockjaxUtilsMockjaxData",
        "EmberTests.MockjaxUtilsMockjaxSettings",
        "EmberTests.TestCase.AsyncOperation",
        "EmberTests.TestCase.EmberTestSuit",
        "EmberTests.TestCase.SetupStore",
        "EmberTests.TestCase.TestAssignValueObject",
        "EmberTests.TestCase.TestAssignValues",
        "EmberTests.TestCase.TestBlock",
        "EmberTests.TestCase.TestCase",
        "EmberTests.TestCase.TestOperation",
        "EmberTests.TestCase.TestSuit",
        "EmberTests.TestCase.TestValueCheckObject",
        "EmberTests.TestCase.TestValuesCheck",
        "EmberTests.TestUtils"
    ],
    "modules": [
        "mockjax-utils",
        "test-case",
        "test-case-operation",
        "test-utils"
    ],
    "allModules": [
        {
            "displayName": "mockjax-utils",
            "name": "mockjax-utils",
            "description": "Wrapper to mock ajax request from CrudAdaptor module."
        },
        {
            "displayName": "test-case",
            "name": "test-case",
            "description": "Module with classes for building a test suit."
        },
        {
            "displayName": "test-case-operation",
            "name": "test-case-operation",
            "description": "Test Operations submodule."
        },
        {
            "displayName": "test-utils",
            "name": "test-utils",
            "description": "Module with misc methods."
        }
    ]
} };
});