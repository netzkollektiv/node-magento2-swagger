var util = require('util');
var magentoSwagger = require('../libs/Magento.js').Magento;

function magento(token) {

    return new magentoSwagger({
        domain: 'http://example.com/index.php/rest',
        token: {
            value: token
        }
    });

}

/* Debugging */
var errHandler = function (error) {
   console.log(util.inspect(error.body,{depth:3}));
}
var doneHandler = function(response) {
    if (response) {
      console.log(util.inspect(response));
    }
}

/* Create customer (unauthenticated) */
function createCustomer() {
    magento().customerAccountManagementV1CreateAccountPost({
        '$body': {
            'customer': {
                'firstname': 'Firstname',
                'lastname': 'Lastname',
                'email': 'firstname.lastname@email.com',
            },
            'password' : 'a123456'
        }
    }).catch(errHandler).done(doneHandler);
}

/* Login customer (unauthenticated) */
function loginCustomer(cb) {
    magento().integrationCustomerTokenServiceV1CreateCustomerAccessTokenPost({
        '$body' : {
            'username': 'firstname.lastname@email.com',
            'password': 'a123456'
        }
    }).catch(errHandler).done(function(response){

        doneHandler(response);
        cb(response);

    });
}

/* Get customer details (authenticated) */
function getCustomerDetails(token) {

    magento(token)
        .customerCustomerRepositoryV1GetByIdGet()
        .catch(errHandler)
        .done(doneHandler);
}

/* Login customer -> Get customer details (auth via returned token) */
loginCustomer(function(response){
    var token = response.body;
    getCustomerDetails(token);
});
