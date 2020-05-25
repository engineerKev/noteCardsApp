export function onErrorFunc(err, pathName, graphQLOperationObj) {
    console.log(`${graphQLOperationObj.type} ERROR, ${graphQLOperationObj.type} NAME: ${graphQLOperationObj.name}`);
    console.log(`ERROR THROWN IN ${pathName} PATH`)
    if (err.graphQLErrors) {
        err.graphQLErrors.forEach(({ message, locations, path }) => {
            console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
        })
    }

    if (err.networkError ) {
        console.log(`[Network Error]: ${err.message}`)
        err.networkError.result && err.networkError.result.errors.forEach(e => console.log(e.message));
    }
}
