YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "MockjaxUtils.MockjaxData",
        "MockjaxUtils.MockjaxSettings",
        "TestCase.EmberTestSuit",
        "TestCase.SetupStore",
        "TestCase.TestAssignValues",
        "TestCase.TestBlock",
        "TestCase.TestCase",
        "TestCase.TestOperation",
        "TestCase.TestSuit",
        "TestCase.TestValueAssignObject",
        "TestCase.TestValueCheckObject",
        "TestCase.TestValues",
        "TestUtils"
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
            "description": "Test Case Helper module."
        },
        {
            "displayName": "test-case-operation",
            "name": "test-case-operation",
            "description": "Test Operations submodule."
        },
        {
            "displayName": "test-utils",
            "name": "test-utils",
            "description": "Utility funcitons for testing."
        }
    ]
} };
});