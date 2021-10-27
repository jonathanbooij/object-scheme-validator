const validateObjectWithSchema = (objectToValidate, schema) => {
	if (typeof objectToValidate !== 'object') {
		return {
			isValidSchema: false,
			error: 'objectToValidate should be an object',
		};
	}
	
	if (typeof schema !== 'object') {
		return {
			isValidSchema: false,
			error: 'schema should be an object',
		};
	}
	
	let error = null;
	const objectToValidateEntries = Object.entries(objectToValidate);
	
	// every is more efficient, but short circuits on first error, not showing all errors at a time
	// could use forEach here as well in combination with an errors array if all errors need to be presented at once
	const isValidSchema = Object.entries(schema).every(
		schemaRule => {
			const [ schemaRuleName, expectedType ] = schemaRule;
			const requiredObjectProperty = objectToValidateEntries.find(
				objectProperty => schemaRuleName === objectProperty[0]
			)
			
			if (requiredObjectProperty === undefined) {
				error = `${schemaRuleName} is required, but not found in object`;
				return false;
			}
			
			const [ propertyName, propertyValue ] = requiredObjectProperty;
			
			const isExpectedType = expectedType === 'array'
				? Array.isArray(propertyValue)
				: typeof propertyValue === expectedType
				
			if (!isExpectedType) {
				error = `${propertyName} with value ${propertyValue} is not of type ${expectedType}`;
			}
			
			return isExpectedType;
		}
	);
	
	return {
		isValidSchema,
		error,
	};
};

// test different kinds of objects against schema below
const personSchema = {
	name: 'string',
	age: 'number',
	siblings: 'array',
	metaData: 'object',
	active: 'boolean',
};

const validPersonObj = {
	name: 'James',
	age: 25,
	siblings: ['Johnnathan'],
	metaData: {},
	active: true,
};

const personObjWithInvalidTypes = {
	name: null,
	age: '25',
	siblings: {name: 'Johnnathan'},
	metaData: [{}],
	active: 'true',
};

const personWithoutAge = {
	name: 'James',
	siblings: ['Johnnathan'],
	metaData: {},
	active: true,
};

console.log(
	validateObjectWithSchema(validPersonObj, personSchema)
);
console.log(
	validateObjectWithSchema(personObjWithInvalidTypes, personSchema)
);
console.log(
	validateObjectWithSchema(personWithoutAge, personSchema)
);