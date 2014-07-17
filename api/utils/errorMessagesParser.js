var _ = require('underscore');

/**
* Model Validation Error Messages parser
* sample validation error
*
{
    "ValidationError": {
        "email": [{
            "data": "donghui.wu",
            "message": "`undefined` should be a email (instead of \"donghui.wu\", which is a string)",
            "rule": "email",
            "actualType": "string",
            "expectedType": "email"
        }],
        "password": [{
            "rule": "required",
            "data": "",
            "message": "\"required\" validation rule failed for input: ''"
        }]
    }
}*/


exports.parse = function (model, err) {

	if (_.has(err, 'ValidationError')) {

		var messages =  model.validationMessages; //_.has(model, 'validations') ? model.validations : {};

		var errors = _.map(err.ValidationError, function(v, k){

			return _.has(messages, k) ? 
				_.map(v, function(error){
					return _.has(messages[k], error.rule) ? messages[k][error.rule] : error;
				})
				:v;
		});

		return _.flatten(errors);
	}

	return err;
	
}







