const Validation = {
	checkArrayResult(err, result) {
		if (err) {
			return {
				code: '500',
				result: []
			};
		}
		if (result === undefined || result.length === 0) {
			return {
				code: '404',
				result: []
			};
		} else {
			return {
				code: '200',
				result: result
			};
		}
	},

	checkSingleResult(err, result) {
		if (err) {
			return {
				code: '500',
				result: {}
			};
		}
		if (result === undefined || result.length === 0) {
			return {
				code: '404',
				result: {}
			};
		} else {
			return {
				code: '200',
				result: result[0]
			};
		}
	}
};

export default Validation;
